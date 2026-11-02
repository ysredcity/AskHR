import { createPanoramaScene } from "@/features/hr/business-intent";
import {DiagnosisFlow} from "@/features/compensation/diagnosis-flow";
import {analysisScene} from "@/features/compensation/data";
import { useHR } from "@/features/hr/context";
import { House, Archive } from "lucide-react";
import { useRef, useState } from "react";
import {
  IndentIncrease,
  Menu,
  MessageSquarePlus,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  SquarePen,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { IconButton } from "./icon-button";
import type { Conversation } from "./sidebar";
import { ConversationSection } from "./conversation-section";
import type {
  AppConfig,
  ArtifactTarget,
  MessageAttachment,
} from "@/agent-ui/immersive/contracts";

type ConversationPageProps = {
  config: AppConfig;
  createDraftScene: (
    content: string,
    expert?: string,
    attachments?: MessageAttachment[],
  ) => NonNullable<Conversation["scene"]>;
  conversation: Conversation;
  isSidebarDocked: boolean;
  onNewChat: () => void;
  onOpenSidebar: () => void;
  onOpenArtifact: (target: ArtifactTarget) => void;
  onApprovalStatusChange: (
    conversation: Conversation,
    status: "approved" | "rejected",
  ) => void;
  onPinnedChange: (conversation: Conversation, pinned: boolean) => void;
  onRename: (conversation: Conversation) => void;
  pinned: boolean;
};

export function ConversationPage({
  config,
  conversation,
  createDraftScene,
  isSidebarDocked,
  onApprovalStatusChange,
  onNewChat,
  onOpenArtifact,
  onOpenSidebar,
  onPinnedChange,
  onRename,
  pinned,
}: ConversationPageProps) {
  const {salaryProjects} = useHR();
  const salaryProject = salaryProjects.find(p=>p.id===conversation.id);
  const salarySubapp = !!salaryProject && salaryProject.source !== "askhr";
  const mobile = useMediaQuery("(max-width: 659px)");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleTruncated, setTitleTruncated] = useState(false);
  const scene =
    conversation.scene ??
    createDraftScene(
      conversation.initialMessage || conversation.title,
      conversation.expert,
    );

  const checkTitleTruncation = () => {
    const title = titleRef.current;
    setTitleTruncated(Boolean(title && title.scrollWidth > title.clientWidth));
  };

  return (
    <>
      <header className="flex h-13 shrink-0 items-center gap-4 border-b px-4 max-[659px]:border-b-0">
        <div className="flex min-w-0 flex-1 items-center gap-1 max-[659px]:gap-3">
          {!salarySubapp && !isSidebarDocked && !mobile && (
            <HeaderAction label="展开导航" onClick={onOpenSidebar}>
              <IndentIncrease />
            </HeaderAction>
          )}
          {!salarySubapp && !isSidebarDocked && !mobile && (
            <HeaderAction label="新对话" onClick={onNewChat}>
              <SquarePen />
            </HeaderAction>
          )}
          {mobile && !salarySubapp && (
            <HeaderAction
              label="展开导航"
              onClick={onOpenSidebar}
              className="size-10 border border-white/80 bg-background/65 shadow-[0_4px_12px_rgba(0,0,0,0.10)] backdrop-blur-2xl dark:border-white/10 [&_svg]:size-5"
            >
              <Menu />
            </HeaderAction>
          )}
          {salarySubapp && <HeaderAction label="薪酬智参首页" onClick={onNewChat}><House /></HeaderAction>}
          <Tooltip>
            <TooltipTrigger
              render={
                <h1
                  ref={titleRef}
                  className="ml-1 truncate text-base font-medium max-[659px]:ml-0"
                  onPointerEnter={checkTitleTruncation}
                >
                  {conversation.title}
                </h1>
              }
            />
            {titleTruncated && (
              <TooltipContent side="bottom" className="max-w-72">
                {conversation.title}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
        {mobile && !salarySubapp ? (
          <div className="flex h-10 shrink-0 items-center rounded-full border border-white/80 bg-background/65 px-1 shadow-[0_4px_12px_rgba(0,0,0,0.10)] backdrop-blur-2xl dark:border-white/10">
            <IconButton
              aria-label="新对话"
              className="size-9 [&_svg]:size-5"
              onClick={onNewChat}
            >
              <MessageSquarePlus />
            </IconButton>
            <span className="h-[18px] w-px bg-border" />
            <ConversationMoreMenu
              conversation={conversation}
              pinned={pinned}
              onPinnedChange={onPinnedChange}
              onRename={onRename}
              buttonClassName="size-9 [&_svg]:size-5"
            />
          </div>
        ) : (
          <ConversationMoreMenu
            conversation={conversation}
            pinned={pinned}
            onPinnedChange={onPinnedChange}
            onRename={onRename}
          />
        )}
      </header>

      {salaryProject?.diagnosis ? <DiagnosisFlow project={salaryProject} onOpenArtifact={onOpenArtifact} /> : <ConversationSection
        createFollowUpScene={salaryProject ? message=>analysisScene(`salary-follow-${crypto.randomUUID()}`,message,salaryProject.title) : conversation.businessContext ? message => createPanoramaScene(message, conversation.businessContext!, conversation.expert, []) ?? createDraftScene(message) : undefined}
        key={conversation.id}
        approvalStatus={conversation.approvalStatus}
        composerExpertOptions={config.composerExpertOptions}
        composerExpertVisualKeys={config.composerExpertVisualKeys}
        scene={scene}
        showConnectorSelect={config.showConnectorSelect ?? true}
        identity={config.identity}
        experts={config.experts}
        renderProductBlock={config.renderProductBlock}
        onApprovalDecision={(status) =>
          onApprovalStatusChange(conversation, status)
        }
        onOpenArtifact={onOpenArtifact}
      />}
    </>
  );
}

function HeaderAction({
  children,
  className,
  label,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <IconButton
            aria-label={label}
            className={className}
            onClick={onClick}
          >
            {children}
          </IconButton>
        }
      />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function ConversationMoreMenu({
  buttonClassName,
  conversation,
  onPinnedChange,
  onRename,
  pinned,
}: {
  buttonClassName?: string;
  conversation: Conversation;
  onPinnedChange: (conversation: Conversation, pinned: boolean) => void;
  onRename: (conversation: Conversation) => void;
  pinned: boolean;
}) {
  const { setArchived } = useHR();
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <IconButton aria-label="更多操作" className={buttonClassName}>
                  <MoreHorizontal />
                </IconButton>
              }
            />
          }
        />
        <TooltipContent side="bottom">更多操作</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={4}
        className="w-40"
      >
        <DropdownMenuItem onClick={() => onRename(conversation)}>
          <Pencil />
          重命名
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPinnedChange(conversation, !pinned)}>
          {pinned ? <PinOff /> : <Pin />}
          {pinned ? "取消置顶" : "置顶"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setArchived((a) => [...a, conversation.id])}
        >
          <Archive />
          归档对话
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
