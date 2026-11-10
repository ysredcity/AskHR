import { ConfirmCard } from "@/agent-ui/conversation";
import { Badge } from "@/components/ui/badge";
import { withExtraChallenge, withLighterLearning } from "./catalog";
import { useEffect } from "react";
import { useHR } from "@/features/hr/context";
import { ConversationSurface } from "@/agent-ui/conversation";
import { ConversationFlow } from "@/components/agent-layout/conversation-flow";
import { Composer } from "@/components/agent-layout/composer";
import { appConfig } from "@/components/agent-layout/app-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TargetPositionField } from "./target-position-field";
import type { ArtifactTarget } from "@/agent-ui/immersive/contracts";
import { buildPlan, growthArtifact, growthScene, isSubmitIntent, parseConditions, profileSteps, submitSteps, type GrowthSession, type Plan } from "./data";

export function GrowthFlow({ id, onOpenArtifact }: { id: string; onOpenArtifact: (target: ArtifactTarget) => void }) {
  const { growthSessions, setGrowthSessions, sessionDrafts, setSessionDrafts, sessionContexts, setSessionContexts } = useHR();
  const state = growthSessions[id];
  const update = (change: Partial<GrowthSession>) => setGrowthSessions(all => ({ ...all, [id]: { ...all[id], ...change } }));
  useEffect(() => {
    if (state.profileReady && !state.running && !state.plan && !state.clarified && !state.missing.length) setGrowthSessions(all => ({ ...all, [id]: { ...all[id], clarified: { ...all[id].conditions } } }));
  }, [id, state.running, state.plan, state.missing.length, state.profileReady, state.clarified, setGrowthSessions]);
  useEffect(() => {
    if (!state.running) return;
    const timer = setTimeout(() => setGrowthSessions(all => {
      const current = all[id];
      if (!current.running) return all;
      if (current.phase === "profile") {
        return { ...all, [id]: current.progress < profileSteps.length - 1
          ? { ...current, progress: current.progress + 1 }
          : { ...current, profileReady: true, running: false } };
      }
      return { ...all, [id]: current.progress < 3 ? { ...current, progress: current.progress + 1 } : { ...current, running: false, plan: buildPlan(current.conditions) } };
    }), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450);
    return () => clearTimeout(timer);
  }, [id, state.running, state.progress, state.phase, setGrowthSessions]);
  // 提交审批：分阶段创建审批流并固化审批稿，不模拟审批通过或正式生效。
  useEffect(() => {
    if (!state.submitting) return;
    const timer = setTimeout(() => setGrowthSessions(all => {
      const current = all[id];
      if (!current.submitting || !current.plan) return all;
      const step = current.submitStep ?? 0;
      return { ...all, [id]: step < submitSteps.length - 1 ? { ...current, submitStep: step + 1 } : { ...current, submitting: false, submitted: { plan: current.plan, at: new Date().toLocaleString("zh-CN", { hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) } } };
    }), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500);
    return () => clearTimeout(timer);
  }, [id, state.submitting, state.submitStep, setGrowthSessions]);
  useEffect(() => {
    if (!state.plan || state.opened) return;
    onOpenArtifact(growthArtifact(id));
    setGrowthSessions(all => ({ ...all, [id]: { ...all[id], opened: true } }));
  }, [id, state.plan, state.opened, onOpenArtifact, setGrowthSessions]);
  const apply = (plan: Plan, user: string, answer: string) => update({ previous: state.plan, plan, conditions: plan.conditions, pending: undefined, messages: [...state.messages, { user, answer }] });
  const send = (message: string) => {
    if (state.running || state.pending || state.submitting) return;
    const conditions = parseConditions(message, state.conditions);
    if (!Number.isInteger(conditions.days) || conditions.days < 3 || conditions.days > 365 || conditions.hours <= 0 || conditions.hours > 40) {
      update({ messages: [...state.messages, { user: message, answer: "周期需为3–365天，每周学习时间需大于0且不超过40小时，请调整后再试。原计划保留。" }] }); return;
    }
    setSessionDrafts(all => ({ ...all, [id]: "" }));
    if (!state.plan) { update({ conditions, missing: [], clarified: { ...conditions } }); return; }
    if (isSubmitIntent(message)) {
      const plan = state.plan;
      update({ submitting: true, submitStep: 0, messages: [...state.messages, { user: message, kind: "submit", answer: `成长计划（修订 ${plan.revision}）已创建审批流并提交审批，当前状态为“待审批”，审批稿见下方附件。\n\n审批通过后，计划才正式生效；生效后再按课程、案例、挑战任务、多岗历练的起止时间及辅导频次安排提醒与推送。当前尚未生效。\n\n如需调整，可以继续在对话中告诉我，修改定稿后需重新提交审批。` }] });
      return;
    }
    if (/撤销/.test(message) && state.previous) { update({ plan: state.previous, conditions: state.previous.conditions, previous: undefined, messages: [...state.messages, { user: message, answer: "已撤销最近一次修改。" }] }); return; }
    const plan: Plan = { ...state.plan, conditions, revision: state.plan.revision + 1, actions: state.plan.actions.map(a => ({ ...a })) };
    const rebuilding = /重新生成|重新制定|重做/.test(message);
    if (rebuilding || conditions.role !== state.conditions.role || conditions.targetRole !== state.conditions.targetRole || conditions.goal !== state.conditions.goal) {
      plan.actions = buildPlan(conditions).actions.map((action, i) => state.plan!.actions[i]?.manual ? state.plan!.actions[i] : action);
    } else if (/轻量|减少课程|减少学习/.test(message)) {
      plan.conditions = { ...conditions, hours: Math.max(.5, conditions.hours / 2) };
      plan.actions = plan.actions.map(a => ({ ...a, resource: a.manual ? a.resource : "学习主题：优先阅读当前任务相关资料，减少额外课程" }));
      plan.page = withLighterLearning(plan);
    } else if (/增加实践/.test(message)) {
      plan.actions = plan.actions.map(a => ({ ...a, detail: a.manual ? a.detail : `${a.detail} 增加一次小范围实操，并记录反馈。` }));
      plan.page = withExtraChallenge(plan);
    } else if (JSON.stringify(conditions) === JSON.stringify(state.conditions)) {
      update({ messages: [...state.messages, { user: message, answer: "这条要求尚未应用，原计划保持不变。可以直接编辑行动，或告诉我“缩短到60天”“每周一小时”“增加实践”“岗位改为数据分析师”。" }] }); return;
    }
    if (conditions.targetRole !== state.conditions.targetRole || conditions.goal !== state.conditions.goal || conditions.role !== state.conditions.role || (rebuilding && state.plan.actions.some(a => a.manual))) {
      update({ pending: plan, messages: [...state.messages, { user: message, answer: "此次调整会改变计划方向，影响全部阶段。手工编辑将保留，请确认后核对它们与新方向是否一致。" }] }); return;
    }
    apply(plan, message, `计划已更新：${plan.conditions.days}天，每周学习${plan.conditions.hours}小时。阶段时间已重新分配，手工内容保留，可以撤销最近一次修改。`);
  };
  const valid = Number.isInteger(state.conditions.days) && state.conditions.days >= 3 && state.conditions.days <= 365 && state.conditions.hours > 0 && state.conditions.hours <= 40;
  const scene = growthScene(id, state);
  return <ConversationSurface scrollKey={`${id}-${state.progress}-${state.messages.length}-${state.submitStep ?? 0}-${!!state.submitting}-${!!state.clarified}-${state.authorization ?? "waiting"}`} footer={<Composer contextItems={sessionContexts[id] ?? []} onContextItemsChange={items => setSessionContexts(all => ({ ...all, [id]: items }))} disabled={state.running || !!state.pending || !!state.submitting} draft={sessionDrafts[id] ?? ""} onDraftChange={value => setSessionDrafts(all => ({ ...all, [id]: value }))} onSend={send} expertOptions={appConfig.composerExpertOptions} expertVisualKeys={appConfig.composerExpertVisualKeys} />}>
    <ConversationFlow scene={scene} identity={appConfig.identity} experts={appConfig.experts} onOpenArtifact={onOpenArtifact} renderProductBlock={appConfig.renderProductBlock} onProductBlockAction={action => {
      if (action.type === "follow-up-select") setSessionDrafts(all => ({ ...all, [id]: action.content }));
    }} renderAssistantSupplement={index => index === 0 ? <>
      {state.clarified ? <section aria-label="已提交的成长计划条件" data-component-style="default" className="mt-5 max-w-[600px] space-y-4 rounded-xl border bg-card p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-medium">确认目标岗位与安排</h3><Badge variant="secondary">已提交</Badge></div><dl className="space-y-3 text-sm">{[["目标岗位", state.clarified.targetRole], ["发展方向", state.clarified.direction], ["计划周期", `${state.clarified.days}天`], ["每周学习投入", `${state.clarified.hours}小时`]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1">{value}</dd></div>)}</dl></section> : !state.plan && !state.running && <section data-component-style="default" aria-label="成长计划条件" className="mt-5 max-w-[600px] space-y-5 rounded-xl border bg-card p-4">
        <h3 className="font-medium">确认目标岗位与安排</h3>
        <TargetPositionField conditions={state.conditions} onChange={conditions => update({ conditions })} />
        <label className="block space-y-2 text-sm"><span>计划周期（天）</span><Input type="number" value={state.conditions.days || ""} onChange={event => update({ conditions: { ...state.conditions, days: Number(event.target.value) } })} /></label>
        <label className="block space-y-2 text-sm"><span>每周学习投入（小时）</span><Input type="number" value={state.conditions.hours || ""} onChange={event => update({ conditions: { ...state.conditions, hours: Number(event.target.value) } })} /></label>
        {!valid && <p role="alert" className="text-sm text-destructive">周期需为3–365天，学习时间需大于0且不超过40小时。</p>}
        <p className="text-xs leading-5 text-muted-foreground">岗位推荐为成长方向建议，不代表已取得任职资格或获得晋升承诺。计划从今天开始。</p>
        <div className="flex flex-wrap gap-2"><Button disabled={!valid} onClick={() => update({ missing: [], clarified: { ...state.conditions } })}>确认并生成计划</Button></div>
      </section>}

    </> : index === 1 && state.clarified && !state.authorization ? <div data-component-style="default" className="mt-4"><ConfirmCard blockId={`${id}-data-authorization`} riskLevel="medium" question="是否授权使用敏感信息？" description="授权范围仅限本次成长计划分析，不修改或对外发送数据。" fields={[{ key: "scope", label: "数据范围", value: "会议记录与文档协作数据" }, { key: "purpose", label: "使用目的", value: "分析岗位差距，补充个性化成长建议" }]} actions={[{ id: "decline", label: "仅使用已有档案", decision: "cancel", tone: "secondary" }, { id: "grant", label: "同意授权并继续", decision: "confirm", tone: "primary" }]} onAction={action => { if (action.type === "confirm-decision") update({ authorization: action.decision === "confirm" ? "granted" : "declined", phase: "plan", running: true, progress: 0 }); }} /></div> : index === scene.turns.length - 1 ? <>
      {state.pending && <section data-component-style="default" className="mt-4 space-y-3 rounded-xl border bg-card p-4" aria-label="确认计划变更"><h3 className="font-medium">确认调整方向</h3><p className="text-sm">{state.conditions.role} → {state.pending.conditions.role}；目标岗位：{state.conditions.targetRole} → {state.pending.conditions.targetRole}。影响全部阶段，手工内容保留。</p><div className="flex gap-2"><Button onClick={() => apply(state.pending!, "确认调整方向", "已更新计划方向，手工内容保留。可撤销本次修改。")}>应用调整</Button><Button variant="outline" onClick={() => update({ pending: undefined })}>取消</Button></div></section>}

    </> : null} />

  </ConversationSurface>;
}
