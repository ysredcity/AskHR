import { createPanoramaScene } from "@/features/hr/business-intent";
import { createSalaryProject, isSalaryDiagnosis } from "@/features/compensation/data";
import { parseLeaveDates } from "@/features/hr/data";
import { useHR } from "@/features/hr/context";
import { HRWorkspace } from "@/features/hr/views";
import { IndentIncrease, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useViewportWidth } from "@/hooks/use-viewport-width";
import { SIDEBAR_WIDTH, CHAT_MIN_WIDTH, clampPanelWidth, getWorkspaceLayout } from "./workspace-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArtifactPanel } from "./artifact-panel";
import { EmployeeCopilot } from "./employee-copilot";
import { ChatWorkspace } from "./chat-workspace";
import { AgentSidebar, type Conversation } from "./sidebar";
import { matchTrigger } from "@/agent-ui/script-engine/match";
import type {
  ImmersiveAgentAppProps,
  ImmersiveConversationMeta,
  ImmersiveConversationScene,
  MessageAttachment,
} from "@/agent-ui/immersive/contracts";
import { splitSentContext } from "./message-context";
import { ImageViewer } from "./image-viewer";
import {
  panelViewKey,
  type ArtifactTarget,
  type ImageView,
  type PanelTab,
  type PanelView,
} from "./panel-types";


/**
 * 审批态由场景末轮派生：末轮 `awaitingApproval` 即为「待批准」。
 * 只有末轮生效，因为待批准会阻断新指令；写在中间轮的 `awaitingApproval` 属于数据错误（由 check-scripts 拦截）。
 * 会话 meta 里显式给出的 approved/rejected 优先，用于表达"已决策完成"的历史会话。
 */
function deriveApprovalStatus(
  scene: ImmersiveConversationScene | undefined,
  explicit?: "pending" | "approved" | "rejected",
) {
  if (explicit) return explicit;
  return scene?.turns.at(-1)?.awaitingApproval
    ? ("pending" as const)
    : undefined;
}

/**
 * 新对话的自然语言入口：先按 trigger 命中预写场景，未命中才回退到 createDraftScene。
 * 命中时把首轮用户消息替换成用户**实际输入**（含其真实附件），后续轮保持剧本——
 * 否则用户会看到一段自己没说过的话，像是发错了对话。
 * 场景 id 需要换成新的，避免与侧栏已有会话的 scene id 冲突。
 */
function resolveSceneForInput(
  content: string,
  scenes: readonly ImmersiveConversationScene[],
  attachments?: MessageAttachment[],
): ImmersiveConversationScene | null {
  const matched = matchTrigger(content, scenes);
  if (!matched?.turns.length) return null;
  const [first, ...rest] = matched.turns;
  return {
    ...matched,
    id: `${matched.id}-${Date.now()}`,
    turns: [
      {
        ...first,
        user: {
          ...first.user,
          content,
          attachments: attachments?.length
            ? attachments
            : first.user.attachments,
        },
      },
      ...rest,
    ],
  };
}

export function AgentShell({
  config,
  scenes,
  initialPinnedConversations = [],
  initialConversations = [],
  createDraftScene,
}: ImmersiveAgentAppProps) {
  const hr = useHR();
  const [copilotMode, setCopilotMode] = useState<"sidebar" | "floating">("sidebar");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotConversation, setCopilotConversation] = useState<Conversation | null>(null);
  const [hrHeaderTarget, setHRHeaderTarget] = useState<HTMLDivElement | null>(null);
  const scenesById = Object.fromEntries(
    scenes.map((scene) => [scene.id, scene]),
  );
  const withDerivedApproval = (
    item: ImmersiveConversationMeta,
  ): Conversation => {
    const scene = scenesById[item.id];
    return {
      ...item,
      scene,
      approvalStatus: deriveApprovalStatus(scene, item.approvalStatus),
    };
  };
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [pinnedConversations, setPinnedConversations] = useState<
    Conversation[]
  >(() => initialPinnedConversations.map(withDerivedApproval));
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    initialConversations.map(withDerivedApproval),
  );
  useEffect(() => {
    // Synchronize the shared salary-project registry into the existing conversation history.
    // oxlint-disable-next-line react/set-state-in-effect
    setConversations(items => {
      const existing = new Set([...items, ...pinnedConversations].map(item=>item.id));
      const added = hr.salaryProjects.filter(p=>p.diagnosis&&!existing.has(p.id)).map(p=>({id:p.id,title:p.title}));
      return added.length ? [...added,...items] : items;
    });
  }, [hr.salaryProjects, pinnedConversations]);
  useEffect(() => {
    const project = hr.salaryProjects.find(p=>p.id===hr.salaryLaunch);
    if (!project) return;
    const conversation = {id:project.id,title:project.title,scene:project.scenes[0]};
    // Synchronize an explicit launch request from the salary homepage into the Agent shell.
    // oxlint-disable-next-line react/set-state-in-effect
    setActiveConversation(conversation);
    setConversations(items=>items.some(item=>item.id===project.id)?items:[conversation,...items]);
    hr.setSalaryLaunch(null);
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [hr.salaryLaunch, hr.salaryProjects, hr.setSalaryLaunch]);
  const [renamingConversation, setRenamingConversation] =
    useState<Conversation | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [readConversationIds, setReadConversationIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [panelTabs, setPanelTabs] = useState<PanelTab[]>([]);
  const [activePanelTabId, setActivePanelTabId] = useState<string | null>(null);
  const [panelFullscreenRequested, setPanelFullscreenRequested] =
    useState(false);
  const [imageView, setImageView] = useState<ImageView | null>(null);
  const [panelWidth, setPanelWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const drawerTouchStart = useRef<number | null>(null);
  const panelCloseTimer = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  );

  const viewportWidth = useViewportWidth();
  const below740 = viewportWidth < 740;
  const salaryHomepage = hr.route === "compensation";
  const salaryConversation = hr.route === "home" && hr.salaryProjects.some(project => project.id === activeConversation?.id && project.source !== "askhr");
  const salaryWorkspace = salaryHomepage || salaryConversation;
  const panelOpen = hr.route === "home" && panelTabs.length > 0;
  const copilotAvailable = ["employee", "team", "organization", "hall", "tasks"].includes(hr.route);
  const copilotVisible = copilotAvailable && copilotOpen;
  const { sidebarCanDock, sidebarDocked } = getWorkspaceLayout(viewportWidth, panelOpen, sidebarOpen && !salaryWorkspace, panelFullscreenRequested, copilotVisible && copilotMode === "sidebar");
  const panelFullscreen = panelOpen && (below740 || panelFullscreenRequested);
  const drawerVisible = !salaryWorkspace && sidebarDrawerOpen && !sidebarCanDock && !panelFullscreen;
  const openSidebar = () => {
    if (sidebarCanDock) setSidebarOpen(true);
    else setSidebarDrawerOpen(true);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(
    () => () => {
      if (panelCloseTimer.current !== null)
        window.clearTimeout(panelCloseTimer.current);
    },
    [],
  );

  const cancelPanelClose = () => {
    if (panelCloseTimer.current === null) return;
    window.clearTimeout(panelCloseTimer.current);
    panelCloseTimer.current = null;
  };

  const changePinnedState = (conversation: Conversation, pinned: boolean) => {
    if (pinned) {
      setConversations((items) =>
        items.filter((item) => item.id !== conversation.id),
      );
      setPinnedConversations((items) => [conversation, ...items]);
      toast.success("对话已置顶");
    } else {
      setPinnedConversations((items) =>
        items.filter((item) => item.id !== conversation.id),
      );
      setConversations((items) => [conversation, ...items]);
      toast.success("已取消置顶");
    }
  };

  const startRenaming = (conversation: Conversation) => {
    setRenamingConversation(conversation);
    setRenameTitle(conversation.title);
  };

  const saveRenamedConversation = () => {
    const title = renameTitle.trim();
    if (!renamingConversation || !title) return;
    const rename = (items: Conversation[]) =>
      items.map((item) =>
        item.id === renamingConversation.id ? { ...item, title } : item,
      );
    setPinnedConversations(rename);
    setConversations(rename);
    setActiveConversation((current) =>
      current?.id === renamingConversation.id ? { ...current, title } : current,
    );
    setCopilotConversation(current => current?.id === renamingConversation.id ? { ...current, title } : current);
    setRenamingConversation(null);
    toast.success("标题已修改");
  };

  const activeConversationPinned = Boolean(
    activeConversation &&
    pinnedConversations.some((item) => item.id === activeConversation.id),
  );

  const updateApprovalStatus = (
    conversation: Conversation,
    approvalStatus: "approved" | "rejected",
  ) => {
    const update = (items: Conversation[]) =>
      items.map((item) =>
        item.id === conversation.id ? { ...item, approvalStatus } : item,
      );
    setCopilotConversation(current => current?.id === conversation.id ? { ...current, approvalStatus } : current);
    setPinnedConversations(update);
    setConversations(update);
    setActiveConversation((current) =>
      current?.id === conversation.id
        ? { ...current, approvalStatus }
        : current,
    );
  };

  /** 执行 Badge 的统一入口：图片走蒙层查看器，其余产物进独立面板容器 */
  const openArtifact = (target: ArtifactTarget) => {
    if (target.type === "image") setImageView(target);
    else openPanel(target);
  };

  /** 打开一个容器：已存在同一容器时只切换 Tab，否则新增 Tab */
  const openPanel = (view: PanelView) => {
    cancelPanelClose();
    if (!panelOpen) setPanelWidth(null);
    setPanelVisible(true);
    const key = panelViewKey(view);
    const existing = panelTabs.find((tab) => panelViewKey(tab) === key);
    if (existing) {
      setActivePanelTabId(existing.id);
      return;
    }
    const tab: PanelTab = {
      ...view,
      id: `panel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setPanelTabs((tabs) => [...tabs, tab]);
    setActivePanelTabId(tab.id);
  };

  /** 在当前容器内跳转（例如检索结果 → 浏览器），不新开 Tab */
  const navigatePanel = (view: PanelView) => {
    setPanelTabs((tabs) =>
      tabs.map((tab) =>
        tab.id === activePanelTabId ? { ...view, id: tab.id } : tab,
      ),
    );
  };

  const closePanelTab = (id: string) => {
    const index = panelTabs.findIndex((tab) => tab.id === id);
    const next = panelTabs.filter((tab) => tab.id !== id);
    if (next.length === 0) {
      closePanel();
      return;
    }
    setPanelTabs(next);
    if (id === activePanelTabId)
      setActivePanelTabId(next[Math.min(index, next.length - 1)]?.id ?? null);
  };

  const closePanel = (immediate = false) => {
    cancelPanelClose();
    setPanelVisible(false);
    const clearPanel = () => {
      setPanelTabs([]);
      setActivePanelTabId(null);
      setPanelFullscreenRequested(false);
      panelCloseTimer.current = null;
    };
    if (immediate) {
      clearPanel();
      return;
    }
    // 保留现有容器直到 CSS 收起动画结束，避免布局和内容瞬间消失。
    panelCloseTimer.current = window.setTimeout(clearPanel, 200);
  };

  /**
   * 切换对话的唯一入口：独立面板的内容只属于某个对话，
   * 因此换对话或回到新对话页时必须收起面板，避免残留上一个对话的产物。
   */
  const openConversation = (conversation: Conversation | null) => {
    hr.setSalaryActive(conversation && hr.salaryProjects.some(p=>p.id===conversation.id) ? conversation.id : null);
    hr.setRoute("home");
    setActiveConversation(conversation);
    closePanel(true);
    if (conversation)
      setReadConversationIds((ids) => new Set(ids).add(conversation.id));
  };

  const startConversation = (
    message: string,
    context: import("./composer").ContextItem[] = [],
    destination: "home" | "copilot" = "home",
  ) => {
    const { attachments, content, expert } = splitSentContext(message, context);
    if (isSalaryDiagnosis(content)) {
      const project = createSalaryProject(content, "组织薪酬", "askhr");
      hr.setSalaryProjects(items => [project, ...items]);
      hr.setSalaryActive(project.id);
      const conversation = { id: project.id, title: project.title, scene: project.scenes[0] };
      if (destination === "copilot") {
        setCopilotConversation(conversation);
        setConversations(items => [conversation, ...items]);
        setReadConversationIds(ids => new Set(ids).add(project.id));
        hr.setCopilotDraft("");
        hr.setCopilotContext([]);
      } else {
        hr.setSalaryLaunch(project.id);
        hr.setRoute("home");
      }
      closePanel(true);
      return;
    }
    if (/帮我请|请假|申请年假/.test(content) && hr.leave.status === "草稿") {
      const dates = parseLeaveDates(content);
      if (dates) hr.setLeave((l) => ({ ...l, ...dates }));
    }
    // 标题去掉内联标签标记，只保留可读文本
    const businessSource = context.find(item => item.id === "business-source");
    const businessSkill = context.find(item => item.id === "business-skill");
    const title =
      (businessSource ? `${businessSource.label.split(" · ").slice(0, 2).join(" · ")} · ${businessSkill?.label ?? "分析"}` : "") ||
      content.replace(/\[\[[^\]]+\]\]/g, "").trim() ||
      attachments[0]?.name ||
      context[0]?.label ||
      "新对话";
    const scene = createPanoramaScene(content, context, expert, attachments) ?? (/调休|病假|产假|半天/.test(content)
      ? createDraftScene(content, expert, attachments)
      : (resolveSceneForInput(content, scenes, attachments) ??
        createDraftScene(content, expert, attachments)));
    const newConversation: Conversation = {
      id: `draft-${Date.now()}`,
      title: title.slice(0, 36),
      initialMessage: content,
      businessContext: context.some(item => item.id === "business-source") ? context : undefined,
      expert,
      scene,
      approvalStatus: deriveApprovalStatus(scene),
    };
    setConversations((items) => [newConversation, ...items]);
    if (destination === "copilot") {
      setCopilotConversation(newConversation);
      setReadConversationIds(ids => new Set(ids).add(newConversation.id));
      hr.setCopilotDraft("");
      hr.setCopilotContext([]);
    } else openConversation(newConversation);
  };

  useEffect(() => {
    const receive = (event: Event) =>
      startConversation((event as CustomEvent<string>).detail);
    const compose = () => openConversation(null);
    const employeeCompose = () => {
      hr.setSalaryActive(null);
      setCopilotConversation(null);
      setCopilotOpen(true);
      closePanel(true);
    };
    window.addEventListener("hihr:employee-compose", employeeCompose);
    window.addEventListener("hihr:ask", receive);
    window.addEventListener("hihr:compose", compose);
    return () => { window.removeEventListener("hihr:employee-compose", employeeCompose); window.removeEventListener("hihr:ask", receive); window.removeEventListener("hihr:compose", compose); };
  });

  const panelProps = {
    tabs: panelTabs,
    activeTabId: activePanelTabId ?? panelTabs[0]?.id ?? "",
    onSelectTab: setActivePanelTabId,
    onCloseTab: closePanelTab,
    onClose: closePanel,
    onNavigate: navigatePanel,
    // 窄屏下面板强制全屏，没有非全屏形态可切，因此不提供切换入口
    onToggleFullscreen: below740 || copilotVisible
      ? undefined
      : () => setPanelFullscreenRequested((value) => !value),
  };

  const startResizing = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      setIsResizing(true);

      const resize = (pointerEvent: PointerEvent) => {
        const bounds = shellRef.current?.getBoundingClientRect();
        if (!bounds) return;

        const nextWidth = bounds.right - pointerEvent.clientX;
        setPanelWidth(clampPanelWidth(nextWidth, bounds.width, sidebarDocked));
      };

      const stop = () => {
        setIsResizing(false);
        window.removeEventListener("pointermove", resize);
        window.removeEventListener("pointerup", stop);
      };

      window.addEventListener("pointermove", resize);
      window.addEventListener("pointerup", stop);
    },
    [sidebarDocked],
  );

  return (
    <>
      <TooltipProvider delay={150}>
        <SidebarProvider
          className="h-dvh min-h-0 min-w-0 overflow-hidden bg-background-mobile min-[660px]:min-w-[420px] md:bg-sidebar"
          style={
            { "--sidebar-width": `${SIDEBAR_WIDTH}px` } as React.CSSProperties
          }
        >
          <main
            ref={shellRef}
            className={cn(
              "relative flex h-full w-full overflow-hidden",
              isResizing && "cursor-col-resize select-none",
            )}
          >
            {!salaryWorkspace && sidebarCanDock && (
              <div
                aria-hidden={!sidebarOpen || panelFullscreen}
                inert={!sidebarOpen || panelFullscreen || (copilotVisible && panelTabs.length > 0)}
                className={cn(
                  "shrink-0 overflow-hidden transition-[width] duration-200 ease-out motion-reduce:transition-none",
                  sidebarOpen ? "w-60" : "w-0",
                )}
              >
                <AgentSidebar
                  config={config}
                  activeConversationId={hr.route === "compensation" ? hr.salaryActive : (copilotAvailable ? copilotConversation : activeConversation)?.id ?? null}
                  darkMode={darkMode}
                  onCollapse={() => setSidebarOpen(false)}
                  onDarkModeChange={setDarkMode}
                  onNewChat={() => openConversation(null)}
                  onPinnedChange={changePinnedState}
                  onRename={startRenaming}
                  onSelectConversation={openConversation}
                  readConversationIds={readConversationIds}
                  pinnedConversations={pinnedConversations}
                  conversations={conversations}
                  className={cn(
                    "transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
                    sidebarOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0 pointer-events-none",
                  )}
                />
              </div>
            )}

            <div className="flex min-w-0 flex-1" inert={panelFullscreen || (copilotVisible && panelTabs.length > 0)} aria-hidden={panelFullscreen || (copilotVisible && panelTabs.length > 0)}>
              {hr.route !== "home" ? (
                <section className="flex min-w-0 flex-1 flex-col bg-background-desktop">
                  {!salaryHomepage && <header className="flex h-13 shrink-0 items-center gap-3 border-b px-6">
                    {!salaryHomepage && !sidebarDocked && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="展开导航"
                        onClick={openSidebar}
                      >
                        <IndentIncrease className="size-4" />
                      </Button>
                    )}
                    {["employee", "team", "organization", "hall", "tasks", "compensation"].includes(hr.route) ? <div ref={setHRHeaderTarget} className="min-w-0 flex-1" /> : <span className="text-sm text-muted-foreground">
                      HiHR /{" "}
                      {
                        {
                          employee: "个人全景",
                          team: "团队全景",
                          organization: "组织全景",
                          hall: "服务大厅",
                          tasks: "待办事项",
                          service: hr.service?.name,
                          compensation: "薪酬智参",
                        }[hr.route]
                      }
                    </span>}
                  </header>}

                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <HRWorkspace headerTarget={hrHeaderTarget} />
                  </div>
                </section>
              ) : (
                <ChatWorkspace
                  config={config}
                  createDraftScene={createDraftScene}
                  activeConversation={activeConversation}
                  isSidebarDocked={sidebarDocked || salaryConversation}
                  onNewChat={() => {
                    openConversation(null);
                    if (salaryConversation) hr.setRoute("compensation");
                  }}
                  onPinnedChange={changePinnedState}
                  onRename={startRenaming}
                  activeConversationPinned={activeConversationPinned}
                  onOpenArtifact={openArtifact}
                  onApprovalStatusChange={updateApprovalStatus}
                  onOpenSidebar={openSidebar}
                  onStartConversation={startConversation}
                  panelOpen={panelOpen}
                  panelAtDefaultSplit={panelOpen && !panelFullscreen && panelWidth === null}
                />
              )}

              {copilotAvailable && !copilotOpen && (
                <Button
                  size="icon"
                  aria-label="打开 AI 对话"
                  aria-controls="hr-copilot"
                  aria-expanded={false}
                  title="AI 对话"
                  className="absolute bottom-8 right-8 z-20 size-11 rounded-full border border-foreground bg-foreground text-background shadow-xl hover:bg-foreground/90"
                  onClick={() => setCopilotOpen(true)}
                ><Sparkles className="size-5" /></Button>
              )}

              {copilotVisible && (
                <div className={cn("shrink-0", below740 ? "absolute inset-0 z-30" : copilotMode === "floating" ? "absolute bottom-4 right-4 z-30 h-[min(600px,calc(100dvh-32px))] w-[400px]" : "w-[400px]")}>
                  <EmployeeCopilot
                    mode={copilotMode}
                    onModeChange={setCopilotMode}
                    config={config}
                    conversation={copilotConversation}
                    history={conversations.filter(item => !hr.archived.includes(item.id))}
                    pinnedHistory={pinnedConversations.filter(item => !hr.archived.includes(item.id))}
                    onPinnedChange={changePinnedState}
                    onRename={startRenaming}
                    readConversationIds={readConversationIds}
                    onSelect={conversation => { setCopilotConversation(conversation); closePanel(true); if (conversation) setReadConversationIds(ids => new Set(ids).add(conversation.id)); }}
                    onSend={(message, context) => startConversation(message, context, "copilot")}
                    onClose={() => setCopilotOpen(false)}
                    onExpand={conversation => {
                      if (!conversation) {
                        hr.setHomeDraft(hr.copilotDraft);
                        hr.setHomeExpert(hr.copilotExpert);
                        hr.setHomeContext(hr.copilotContext);
                      }
                      setCopilotOpen(false);
                      setSidebarDrawerOpen(false);
                      openConversation(conversation);
                    }}
                    onApproval={updateApprovalStatus}
                    onOpenArtifact={target => { if (target.type === "image") setImageView(target); else { openPanel(target); setPanelFullscreenRequested(true); } }}
                  />
                </div>
              )}

              {hr.route === "home" && panelOpen && !panelFullscreen && (
                <div
                  className={cn(
                    "relative flex h-full min-w-80 shrink-0 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none starting:translate-x-4 starting:opacity-0",
                    panelVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0 pointer-events-none",
                    panelWidth === null && "flex-1",
                  )}
                  style={
                    panelWidth === null
                      ? undefined
                      : {
                          width: panelWidth,
                          maxWidth: `calc(100% - ${CHAT_MIN_WIDTH}px)`,
                        }
                  }
                >
                  {/* group 挂在手柄自身，只有悬停这条可拖拽区域才高亮，而不是悬停整个面板 */}
                  <button
                    aria-label="调整独立面板宽度"
                    className="group/resize absolute -left-1 top-0 z-20 h-full w-2 cursor-col-resize touch-none"
                    onPointerDown={startResizing}
                  >
                    {/*
                  悬停与拖拽时用竖向渐变：中间实色、上下两端淡出。
                  必须同时把 background-color 置为透明，否则底色会从渐变透明处透出来，两端就不是 0% 透明度。
                */}
                    <span
                      className={cn(
                        "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border transition-all",
                        "group-hover/resize:w-0.5 group-hover/resize:bg-transparent group-hover/resize:bg-linear-to-b group-hover/resize:from-transparent group-hover/resize:via-primary group-hover/resize:to-transparent",
                        isResizing &&
                          "w-0.5 bg-transparent bg-linear-to-b from-transparent via-primary to-transparent",
                      )}
                    />
                  </button>
                  <ArtifactPanel fullscreen={false} {...panelProps} />
                </div>
              )}
            </div>

            {drawerVisible && (
              <div
                role="dialog"
                aria-modal="false"
                aria-label="导航"
                onKeyDown={event => {if (event.key === "Escape") setSidebarDrawerOpen(false);}}
                className="absolute inset-y-0 left-0 z-40 flex w-80 max-w-full"
                onPointerDown={(event) => {
                  drawerTouchStart.current = event.clientX;
                }}
                onPointerUp={(event) => {
                  if (
                    drawerTouchStart.current !== null &&
                    event.clientX - drawerTouchStart.current < -48
                  ) {
                    setSidebarDrawerOpen(false);
                  }
                  drawerTouchStart.current = null;
                }}
              >
                <AgentSidebar
                  config={config}
                  activeConversationId={hr.route === "compensation" ? hr.salaryActive : (copilotAvailable ? copilotConversation : activeConversation)?.id ?? null}
                  darkMode={darkMode}
                  drawer
                  onClose={() => setSidebarDrawerOpen(false)}
                  onCollapse={() => setSidebarDrawerOpen(false)}
                  onDarkModeChange={setDarkMode}
                  onNewChat={() => {
                    openConversation(null);
                    setSidebarDrawerOpen(false);
                  }}
                  onPinnedChange={changePinnedState}
                  onRename={startRenaming}
                  onSelectConversation={(conversation) => {
                    openConversation(conversation);
                    setSidebarDrawerOpen(false);
                  }}
                  readConversationIds={readConversationIds}
                  pinnedConversations={pinnedConversations}
                  conversations={conversations}
                  className="w-80 [--sidebar-width:320px]"
                />
              </div>
            )}


            {((hr.route === "home" && panelFullscreen) || (copilotVisible && panelTabs.length > 0)) && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="产物预览"
                className={cn(
                  "absolute inset-0 z-50 bg-background transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none starting:translate-x-4 starting:opacity-0",
                  panelVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0 pointer-events-none",
                )}
              >
                <ArtifactPanel fullscreen {...panelProps} />
              </div>
            )}


            <Dialog
              open={Boolean(renamingConversation)}
              onOpenChange={(open) => {
                if (!open) setRenamingConversation(null);
              }}
            >
              <DialogContent className="w-[400px] gap-5 rounded-2xl bg-card p-5 shadow-xl sm:max-w-[400px]">
                <DialogHeader className="gap-4">
                  <DialogTitle className="text-lg font-semibold">
                    编辑标题
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    修改当前对话的标题
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="grid gap-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveRenamedConversation();
                  }}
                >
                  <label className="grid gap-2 text-sm text-muted-foreground">
                    请输入新标题
                    <Input
                      autoFocus
                      className="h-9 bg-muted/50 text-foreground"
                      value={renameTitle}
                      onChange={(event) => setRenameTitle(event.target.value)}
                      onFocus={(event) => event.currentTarget.select()}
                    />
                  </label>
                  <DialogFooter className="m-0 flex-row justify-end border-0 bg-transparent p-0">
                    <DialogClose
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 min-w-18"
                        />
                      }
                    >
                      取消
                    </DialogClose>
                    <Button
                      type="submit"
                      className="h-9 min-w-18"
                      disabled={!renameTitle.trim()}
                    >
                      确认
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* 用 src 作为挂载 key，切换图片时自然回到默认缩放 */}
            {imageView && (
              <ImageViewer
                key={imageView.src}
                view={imageView}
                onClose={() => setImageView(null)}
              />
            )}
          </main>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster theme={darkMode ? "dark" : "light"} position="top-center" />
    </>
  );
}
