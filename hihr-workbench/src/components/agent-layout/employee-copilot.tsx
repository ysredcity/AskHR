import { DiagnosisFlow } from "@/features/compensation/diagnosis-flow";
import { createPanoramaScene } from "@/features/hr/business-intent";
import { createDraftScene } from "./conversation-data";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, PanelRight, PictureInPicture2, History, Maximize2, MessageSquare, SquarePen, X } from "lucide-react";
import type { ImmersiveAgentAppProps, ArtifactTarget } from "@/agent-ui/immersive/contracts";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHR } from "@/features/hr/context";
import { Composer, type ContextItem } from "./composer";
import { ConversationSection } from "./conversation-section";
import { ConversationHistoryList, type Conversation } from "./sidebar";

type Props = {
  mode: "sidebar" | "floating";
  onModeChange: (mode: "sidebar" | "floating") => void;
  config: ImmersiveAgentAppProps["config"];
  conversation: Conversation | null;
  history: Conversation[];
  pinnedHistory: Conversation[];
  onPinnedChange: (conversation: Conversation, pinned: boolean) => void;
  onRename: (conversation: Conversation) => void;
  readConversationIds: Set<string>;
  onSelect: (conversation: Conversation | null) => void;
  onSend: (message: string, context: ContextItem[]) => void;
  onClose: () => void;
  onExpand: (conversation: Conversation | null) => void;
  onOpenArtifact: (target: ArtifactTarget) => void;
  onApproval: (conversation: Conversation, status: "approved" | "rejected") => void;
};

/** 同一会话数据与 rich Section 的员工页面适配器，只拥有辅助区的外壳。 */
export function EmployeeCopilot({ mode, onModeChange, config, conversation, history, pinnedHistory, onPinnedChange, onRename, readConversationIds, onSelect, onSend, onClose, onExpand, onOpenArtifact, onApproval }: Props) {
  const hr = useHR();
  const salaryProject = hr.salaryProjects.find(project => project.id === conversation?.id);
  const [historyOpen, setHistoryOpen] = useState(false);
  useEffect(() => {
    const showComposer = () => setHistoryOpen(false);
    window.addEventListener("hihr:employee-compose", showComposer);
    return () => window.removeEventListener("hihr:employee-compose", showComposer);
  }, []);
  const newChat = () => {
    setHistoryOpen(false);
    onSelect(null);
    hr.setCopilotDraft("");
    hr.setCopilotContext([]);
    hr.setCopilotExpert(null);
  };
  return <aside id="hr-copilot" aria-label="AskHR AI 对话" className={cn("flex h-full min-h-0 w-full flex-col bg-background-desktop", mode === "sidebar" ? "border-l" : "overflow-hidden rounded-2xl border shadow-xl max-[739px]:rounded-none")}>
    <header className="flex h-13 shrink-0 items-center gap-1 border-b px-3">
      {historyOpen ? <>
        <Button size="icon-sm" variant="ghost" aria-label="返回对话" title="返回" onClick={() => setHistoryOpen(false)}><ArrowLeft /></Button>
        <h2 className="min-w-0 flex-1 truncate text-base font-medium">历史对话</h2>
        <Button size="icon-sm" variant="ghost" aria-label="新建 AI 对话" title="新对话" onClick={newChat}><SquarePen /></Button>
        <Button size="icon-sm" variant="ghost" aria-label="关闭 AI 对话" title="关闭" onClick={onClose}><X /></Button>
      </> : <>
      <MessageSquare className="mr-1 size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium" title={conversation?.title}>{conversation?.title ?? "AskHR"}</span>
      <Button size="icon-sm" variant="ghost" aria-label="新建 AI 对话" title="新对话" onClick={newChat}><SquarePen /></Button>
      <Button size="icon-sm" variant="ghost" aria-label="历史对话" title="历史对话" onClick={() => setHistoryOpen(true)}><History /></Button>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger render={<DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost" aria-label="切换对话模式" />}>{mode === "floating" ? <PictureInPicture2 /> : <PanelRight />}</DropdownMenuTrigger>} />
          <TooltipContent side="bottom">切换对话模式</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onModeChange("sidebar")}><PanelRight />侧边栏{mode === "sidebar" && <Check className="ml-auto" />}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onModeChange("floating")}><PictureInPicture2 />浮动{mode === "floating" && <Check className="ml-auto" />}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExpand(conversation)}><Maximize2 />全屏</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button size="icon-sm" variant="ghost" aria-label="关闭 AI 对话" title="关闭" onClick={onClose}><X /></Button>
      </>}
    </header>
    {historyOpen && <div className="min-h-0 flex-1 overflow-y-auto bg-card px-2 py-3">
      <ConversationHistoryList activeConversationId={conversation?.id} conversations={history} pinnedConversations={pinnedHistory} onPinnedChange={onPinnedChange} onRename={onRename} readConversationIds={readConversationIds} onSelectConversation={item => { setHistoryOpen(false); onExpand(item); onClose(); }} />
      {!history.length && !pinnedHistory.length && <p className="px-3 py-4 text-sm text-muted-foreground">暂无历史对话</p>}
    </div>}
    <div className={cn("min-h-0 flex-1 flex-col", historyOpen ? "hidden" : "flex")} inert={historyOpen}>
    {salaryProject?.diagnosis ? <DiagnosisFlow key={salaryProject.id} project={salaryProject} onOpenArtifact={onOpenArtifact} /> : conversation?.scene ? <ConversationSection
      createFollowUpScene={conversation.businessContext ? message => createPanoramaScene(message, conversation.businessContext!, conversation.expert, []) ?? { ...createDraftScene(message), id: `draft-${crypto.randomUUID()}` } : undefined}
      key={conversation.id}
      scene={conversation.scene}
      approvalStatus={conversation.approvalStatus}
      composerExpertOptions={config.composerExpertOptions}
      composerExpertVisualKeys={config.composerExpertVisualKeys}
      identity={config.identity}
      experts={config.experts}
      renderProductBlock={config.renderProductBlock}
      showConnectorSelect={config.showConnectorSelect}
      onOpenArtifact={onOpenArtifact}
      onApprovalDecision={status => onApproval(conversation, status)}
    /> : <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-base font-medium">一起处理眼前的人资事务</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{hr.copilotContext.length ? "已带入页面上下文，你可以调整问题后发送，也可以继续查看页面内容。" : "结合页面内容提出问题，让 AskHR 帮你查询、分析或办理人资事务。"}</p>
      </div>
      <div className="shrink-0 px-4 pb-3">
        <Composer draft={hr.copilotDraft} onDraftChange={hr.setCopilotDraft}
          contextItems={hr.copilotContext} onContextItemsChange={hr.setCopilotContext}
          selectedExpert={hr.copilotExpert} onSelectedExpertChange={hr.setCopilotExpert}
          expertOptions={config.composerExpertOptions} expertVisualKeys={config.composerExpertVisualKeys}
          showConnectorSelect={config.showConnectorSelect} onSend={onSend} />
        <p className="mt-2 text-center text-xs text-muted-foreground">以上内容由AI生成</p>
      </div>
    </>}
    </div>
  </aside>;
}
