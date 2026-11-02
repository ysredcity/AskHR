import { parseLeaveDates } from "@/features/hr/data";
import { useHR } from "@/features/hr/context";
import { createDraftScene } from "./conversation-data";
import { useState, useEffect, type ReactNode } from "react";

import {
  ConversationSurface,
  type ProductBlockAction,
} from "@/agent-ui/conversation";
import {
  type AppConfig,
  type ArtifactTarget,
  type ConversationScene,
  type ProductIdentity,
  type WelcomeExpert,
} from "@/agent-ui/immersive/contracts";
import { Composer } from "./composer";
import {
  ConversationFlow,
  type ProductBlockRenderer,
} from "./conversation-flow";
import { splitSentContext } from "./message-context";

type ConversationSectionProps = {
  composerControls?: ReactNode;
  createFollowUpScene?: (message: string) => ConversationScene;
  approvalStatus?: "pending" | "approved" | "rejected";
  composerExpertOptions?: readonly string[];
  composerExpertVisualKeys?: Readonly<
    Record<string, WelcomeExpert["visualKey"]>
  >;
  experts: readonly WelcomeExpert[];
  identity: ProductIdentity;
  initialDraft?: string;
  onApprovalDecision?: (status: "approved" | "rejected") => void;
  onOpenArtifact: (target: ArtifactTarget) => void;
  onProductBlockAction?: (action: ProductBlockAction) => void;
  renderProductBlock?: ProductBlockRenderer;
  scene: ConversationScene;
  showConnectorSelect?: boolean;
};

/**
 * Agent 与 Copilot 共同使用的完整对话 section。
 * 它统一 rich Flow、rich Composer、消息追加、滚动与 footer；形态壳层只负责 Header、容器和 artifact adapter。
 */
export function ConversationSection({
  composerControls,
  createFollowUpScene,
  approvalStatus,
  composerExpertOptions,
  composerExpertVisualKeys,
  experts,
  identity,
  initialDraft = "",
  onApprovalDecision,
  onOpenArtifact,
  onProductBlockAction,
  renderProductBlock,
  scene,
  showConnectorSelect = true,
}: ConversationSectionProps) {
  const { sessionDrafts, setSessionDrafts } = useHR();
  const composerDraft = sessionDrafts[scene.id] ?? initialDraft;
  const setComposerDraft = (value: string) => setSessionDrafts(items => ({ ...items, [scene.id]: value }));
  const { sessions, setSessions, leave, setLeave } = useHR();
  const sentScenes = sessions[scene.id] ?? [];
  const awaitingApproval = approvalStatus === "pending";

  const handleProductBlockAction = (action: ProductBlockAction) => {
    if (action.type === "follow-up-select") setComposerDraft(action.content);
    if (action.type === "confirm-decision" && awaitingApproval) {
      if (action.decision === "confirm") onApprovalDecision?.("approved");
      if (action.decision === "cancel") onApprovalDecision?.("rejected");
    }
    onProductBlockAction?.(action);
  };

  const guardedRenderer = renderProductBlock
    ? (
        block: Parameters<NonNullable<AppConfig["renderProductBlock"]>>[0],
        context: Parameters<NonNullable<AppConfig["renderProductBlock"]>>[1],
      ) => {
        if (
          block.type === "follow-up-suggestions" &&
          (!context.isLatestTurn || sentScenes.length > 0)
        )
          return null;
        return renderProductBlock(block, context);
      }
    : undefined;

  return (
    <ConversationSurface
      scrollKey={scene.id}
      footer={
        <Composer
          trailingControls={composerControls}
          disabled={awaitingApproval}
          expertOptions={composerExpertOptions}
          expertVisualKeys={composerExpertVisualKeys}
          showConnectorSelect={showConnectorSelect}
          draft={composerDraft}
          onDraftChange={setComposerDraft}
          onSend={(message, context) => {
            const input = splitSentContext(message, context);
            const editingLeave =
              scene.turns.some((t) => t.productBlock?.type === "hr-leave") &&
              /改成|改为|换成|修改/.test(input.content) &&
              leave.status === "草稿";
            if (editingLeave) {
              const dates = parseLeaveDates(input.content);
              if (dates) setLeave((l) => ({ ...l, ...dates }));
            }
            const generated = createFollowUpScene ? createFollowUpScene(input.content) : createDraftScene(
              editingLeave ? "休假申请" : input.content,
              input.expert,
              input.attachments,
            );
            const next = {
              ...generated,
              id: `follow-${Date.now()}`,
              turns: generated.turns.map((t, i) =>
                i === 0
                  ? {
                      ...t,
                      user: {
                        content: input.content,
                        attachments: input.attachments,
                      },
                    }
                  : t,
              ),
            };
            setSessions((items) => ({
              ...items,
              [scene.id]: [...(items[scene.id] ?? []), next],
            }));
            setComposerDraft("");
          }}
        />
      }
    >
      <ProgressiveFlow
        key={scene.id}
        approvalStatus={approvalStatus}
        scene={scene}
        identity={identity}
        experts={experts}
        renderProductBlock={guardedRenderer}
        onProductBlockAction={handleProductBlockAction}
        onOpenArtifact={onOpenArtifact}
      />
      {sentScenes.map((next) => (
        <ProgressiveFlow
          key={next.id}
          scene={next}
          identity={identity}
          experts={experts}
          renderProductBlock={guardedRenderer}
          onProductBlockAction={handleProductBlockAction}
          onOpenArtifact={onOpenArtifact}
        />
      ))}
    </ConversationSurface>
  );
}

const completedSceneIds = new Set<string>();
function ProgressiveFlow(props: React.ComponentProps<typeof ConversationFlow>) {
  const shouldAnimate =
    props.scene.id.includes("draft-") ||
    props.scene.id.includes("follow-") ||
    /\d{10}/.test(props.scene.id);
  const [phase, setPhase] = useState(() =>
    completedSceneIds.has(props.scene.id) || !shouldAnimate ? 2 : 0,
  );
  useEffect(() => {
    if (phase === 2) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () =>
        setPhase((p) => {
          const next = reduced ? 2 : p + 1;
          if (next === 2) completedSceneIds.add(props.scene.id);
          return next;
        }),
      reduced ? 0 : phase === 0 ? 380 : 550,
    );
    return () => window.clearTimeout(timer);
  }, [phase, props.scene.id]);
  const shown =
    phase === 2
      ? props.scene
      : {
          ...props.scene,
          turns: props.scene.turns.map((t) => ({
            ...t,
            assistant: undefined,
            productBlock: undefined,
            execution: {
              ...t.execution,
              status: "running" as const,
              duration: undefined,
              summary: phase === 0 ? "正在确认查询范围" : "正在整理业务结果",
              steps: t.execution.steps.slice(0, phase + 1).map((step, i) => ({
                ...step,
                status:
                  i === phase ? ("running" as const) : ("completed" as const),
              })),
            },
          })),
        };
  return (
    <div role="log" aria-live="polite">
      <ConversationFlow
        key={phase === 2 ? "complete" : "progress"}
        {...props}
        scene={shown}
      />
    </div>
  );
}
