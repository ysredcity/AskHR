import { RegionReference } from "./region-reference";
import { useState, type ReactNode } from "react";
import { Info, Pencil, Plus, Repeat2, Rocket, Target, ThumbsUp, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { targetPositions, type Plan } from "./data";
import {
  analysis, directionFocus, steps, type StepKey, library, learningBudget, mentoringFrequencies, mentoringMethods, mentoringTip, phasePath, topics,
  type ExperienceItem, type GrowthPage, type LearningItem, type Mentoring,
} from "./catalog";
import { CaseIcon, CourseCover, DateRangeField, ItemEditDialog, LibraryDialog, type EditDraft } from "./plan-dialogs";

export type Commit = (page: GrowthPage, answer: string) => void;
type SectionProps = { plan: Plan; page: GrowthPage; commit: Commit; locked: boolean; readOnly?: boolean };


export function Chapter({ id, step, description, action, children }: { id: string; step: StepKey; description?: string; action?: ReactNode; children: ReactNode }) {
  const index = steps.findIndex(item => item.key === step);
  const { title } = steps[index];
  return <section id={id} aria-labelledby={`${id}-title`} className="group/region scroll-mt-16 space-y-4 rounded-2xl border bg-card p-5 shadow-sm @min-[600px]:p-6">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 id={`${id}-title`} className="flex items-center gap-2 text-lg font-semibold"><span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground tabular-nums">{index + 1}</span>{title}</h3>
        {description && <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">{action}{step !== "practice" && <RegionReference region={id} title={title} />}</div>
    </div>
    {children}
  </section>;
}
const hoursText = (hours: number) => `${Number(hours.toFixed(1))} 小时`;

// —— 01 优劣势分析 ——
const tones = {
  strength: { label: "优势", icon: ThumbsUp, box: "border-success/30 bg-linear-to-br from-success/12 to-success/3", bar: "bg-success", text: "text-success-foreground" },
  improve: { label: "待提升项", icon: Target, box: "border-warning/35 bg-linear-to-br from-warning/14 to-warning/3", bar: "bg-warning", text: "text-warning-foreground" },
};
type AnalysisRow = { title: string; evidence: string; meaning: string };
function AnalysisGroup({ tone, rows, className }: { tone: keyof typeof tones; rows: AnalysisRow[]; className?: string }) {
  const t = tones[tone];
  const Icon = t.icon;
  return <div className={cn("rounded-xl border p-4", t.box, className)}>
    <p className={cn("mb-3 flex items-center gap-2 text-sm font-semibold", t.text)}><Icon className="size-4" />{t.label}<span className="font-normal text-muted-foreground">· {rows.length} 项</span></p>
    <ul className="space-y-3">{rows.map(row => <li key={row.title} className="relative pl-3.5">
      <span aria-hidden className={cn("absolute bottom-1 left-0 top-1 w-1 rounded-full", t.bar)} />
      <p className="text-sm font-medium">{row.title}</p>
      <p className="mt-1 text-sm leading-6">{row.meaning}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">依据：{row.evidence}</p>
    </li>)}</ul>
  </div>;
}
export function AnalysisSection({ plan, id }: { plan: Plan; id: string }) {
  const data = analysis(plan);
  return <Chapter id={id} step="analysis" description={`结合绩效与主管反馈，对照目标岗位「${plan.conditions.targetRole}」判断可发挥的优势与需要优先提升的方面。`}>
    <div className="grid gap-3 @min-[640px]:grid-cols-2">
      <AnalysisGroup tone="strength" rows={data.strengths} />
      <AnalysisGroup tone="improve" rows={data.improvements} />
    </div>
    <p className="text-xs text-muted-foreground">未提供量化测评，不生成能力分数或技能等级。</p>
  </Chapter>;
}

// —— 02 建议发展方向 ——
export function DirectionSection({ plan, id }: { plan: Plan; id: string }) {
  const target = targetPositions.find(position => position.name === plan.conditions.targetRole);
  const focuses = directionFocus(plan);
  return <Chapter id={id} step="direction">
    <div className="rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 to-primary/2 p-4">
      <div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{plan.conditions.direction}</Badge><span className="text-xs text-muted-foreground">已确认的目标岗位</span></div>
      <p className="mt-2 text-base font-semibold">{plan.conditions.targetRole}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{target?.reason ?? "以已确认的目标岗位为方向，结合现有优势安排发展重点。"}</p>
    </div>
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">本周期发展重点</h4>
      <ol className="divide-y rounded-xl border">{focuses.map((item, i) => <li key={item.focus} className="grid gap-2 p-4 @min-[640px]:grid-cols-[minmax(0,10rem)_1fr]">
        <div className="flex items-start gap-2"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">{i + 1}</span><div><p className="text-sm font-medium">{item.focus}</p><Badge variant={item.priority === "高" ? "default" : "outline"} className="mt-1">优先级 {item.priority}</Badge></div></div>
        <dl className="grid gap-2 text-sm @min-[760px]:grid-cols-3">
          {[["关联分析", item.relation], ["本周期目标", item.goal], ["验证成果", item.verify]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-0.5 leading-6">{value}</dd></div>)}
        </dl>
      </li>)}</ol>
    </div>
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">阶段路径</h4>
      <ol className="grid gap-2 @min-[640px]:grid-cols-3">{phasePath(plan).map((step, i) => <li key={step.title} className="rounded-lg bg-muted/40 p-3">
        <p className="flex items-baseline justify-between gap-2 text-sm font-medium"><span>{i + 1}. {step.title}</span><span className="text-xs font-normal tabular-nums text-muted-foreground">第 {step.startDay}–{step.endDay} 天</span></p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.text}</p>
      </li>)}</ol>
    </div>
  </Chapter>;
}

// —— 03 学习计划 ——
type Editing = { kind: LearningItem["kind"] | ExperienceItem["kind"]; id: string | null; draft: EditDraft } | null;
const kindName = { course: "课程", case: "标杆案例", challenge: "挑战任务", rotation: "多岗历练" };

export function LearningSection({ plan, page, commit, locked, readOnly, id }: SectionProps & { id: string }) {
  const [adding, setAdding] = useState<"course" | "case" | null>(null);
  const budget = learningBudget(plan);
  const total = page.learning.reduce((sum, item) => sum + item.hours, 0);
  const update = (learning: LearningItem[], answer: string) => commit({ ...page, learning }, answer);
  const add = (entryId: string) => {
    const entry = library.find(item => item.id === entryId)!;
    const focus = directionFocus(plan).find(item => item.topic === entry.topic)?.focus ?? topics[entry.topic].label;
    update([...page.learning, { id: `${entry.kind}-manual-${Date.now()}`, kind: entry.kind, topic: entry.topic, focus, title: entry.title, summary: entry.summary, hours: entry.hours,
      startDay: 1, endDay: plan.conditions.days, source: entry.source, libraryId: entry.id, manual: true,
      reason: entry.kind === "course" ? `手动添加，补充「${topics[entry.topic].label}」相关学习。` : `手动添加，借鉴「${topics[entry.topic].label}」相关实践。` }], `已添加${kindName[entry.kind]}“${entry.title}”，可撤销。`);
  };
  const group = (kind: "course" | "case") => {
    const rows = page.learning.filter(item => item.kind === kind);
    return <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">{kind === "course" ? "课程学习" : "标杆案例"}<span className="ml-1.5 font-normal text-muted-foreground">{rows.length}</span><span className="ml-2 text-xs font-normal text-muted-foreground">来源：{kind === "course" ? "企业学习平台课程库" : "内部标杆案例库"}</span></h4>
        {!readOnly && <Button size="sm" disabled={locked} onClick={() => setAdding(kind)}><Plus className="size-3.5" />添加{kindName[kind]}</Button>}
      </div>
      {rows.length ? <ul className="divide-y rounded-xl border">{rows.map(item => <li key={item.id} className="flex gap-3 p-3">
        {kind === "course" ? <CourseCover topic={item.topic} /> : <CaseIcon />}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start gap-2">
            <p className="min-w-0 flex-1 text-sm font-medium leading-5">{item.title}</p>
            {!readOnly && <div className="-mr-1 -mt-1 flex shrink-0">
              <Button variant="ghost" size="icon-sm" disabled={locked} aria-label={`移除${item.title}`} title="移除" onClick={() => update(page.learning.filter(x => x.id !== item.id), `已移除${kindName[kind]}“${item.title}”，可撤销。`)}><Trash2 className="size-3.5" /></Button>
            </div>}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">{item.summary}</p>
          <p className="text-xs leading-5">推荐理由：{item.reason}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs text-muted-foreground">
            <Badge variant="secondary" className="font-normal">{item.focus}</Badge>
            <DateRangeField plan={plan} readOnly={readOnly} label={`${item.title}计划时间`} startDay={item.startDay} endDay={item.endDay}
              onChange={(startDay, endDay) => update(page.learning.map(x => x.id === item.id ? { ...x, startDay, endDay } : x), `已调整“${item.title}”的计划时间，可撤销。`)} />
            <span className="tabular-nums">{hoursText(item.hours)}</span>
          </div>
        </div>
      </li>)}</ul> : <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">尚未安排{kindName[kind]}，可从{kind === "course" ? "课程库" : "案例库"}添加。</p>}
    </div>;
  };
  return <Chapter id={id} step="learning" description="课程建立方法，标杆案例借鉴实际做法。课程与案例内容来自资源库，可调整每项的学习时间。">
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="flex items-center justify-between gap-2 text-xs"><span>学习用时安排</span><span className="tabular-nums">{hoursText(total)} / 预算 {hoursText(budget)}</span></div>
      <Progress className="mt-2" aria-label="已安排学习用时占预算比例" value={Math.min(100, total / budget * 100)} />
      <p className="mt-2 text-xs text-muted-foreground">按每周 {plan.conditions.hours} 小时、{plan.conditions.days} 天计算预算；剩余时间用于整理与复习。挑战任务、多岗历练结合日常工作开展，辅导用时另计。</p>
      {total > budget && <p role="alert" className="mt-2 text-xs text-destructive">学习安排已超出预算，请减少条目或用时。</p>}
    </div>
    {group("course")}
    {group("case")}
    <LibraryDialog open={!!adding} kind={adding ?? "course"} addedIds={new Set(page.learning.map(item => item.libraryId).filter(Boolean) as string[])} onAdd={add} onClose={() => setAdding(null)} />
  </Chapter>;
}

// —— 04 实践历练 ——
const experienceMeta = {
  challenge: { label: "挑战任务", icon: Rocket, tip: "在本职工作中承担有挑战的任务，验证所学方法。" },
  rotation: { label: "多岗历练", icon: Repeat2, tip: "根据当前发展方向与岗位要求，推荐以下历练机会。" },
};
export function ExperienceSection({ plan, page, commit, locked, readOnly, id }: SectionProps & { id: string }) {
  const [editing, setEditing] = useState<Editing>(null);
  const update = (experience: ExperienceItem[], answer: string) => commit({ ...page, experience }, answer);
  const column = (kind: "challenge" | "rotation") => {
    const meta = experienceMeta[kind];
    const Icon = meta.icon;
    const rows = page.experience.filter(item => item.kind === kind);
    return <div id={`${id}-${kind}`} className="group/region flex min-w-0 flex-col gap-3 rounded-xl bg-muted/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 border-l-[3px] border-primary pl-2 text-sm font-semibold"><Icon className="size-4 text-primary" />{meta.label}<span className="font-normal text-muted-foreground">{rows.length}</span></h4>
        <div className="flex items-center gap-1"><RegionReference region={`${id}-${kind}`} title={meta.label} />{!readOnly && <Button size="sm" disabled={locked} onClick={() => setEditing({ kind, id: null, draft: { title: "", body: "", startDay: 1, endDay: plan.conditions.days } })}><Plus className="size-3.5" />新增</Button>}</div>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{meta.tip}</p>
      {rows.length ? <ol className="space-y-2">{rows.map((item, i) => <li key={item.id} className="rounded-lg border bg-card p-3 shadow-xs">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-sm font-medium leading-5">{kind === "challenge" && <span className="mr-1.5 tabular-nums text-muted-foreground">{i + 1}.</span>}{item.title}</p>
          {!readOnly && <div className="-mr-1 -mt-1 flex shrink-0">
            <Button variant="ghost" size="icon-sm" disabled={locked} aria-label={`编辑${item.title}`} title="编辑" onClick={() => setEditing({ kind, id: item.id, draft: { title: item.title, body: item.detail, startDay: item.startDay, endDay: item.endDay } })}><Pencil className="size-3.5" /></Button>
            <Button variant="ghost" size="icon-sm" disabled={locked} aria-label={`移除${item.title}`} title="移除" onClick={() => update(page.experience.filter(x => x.id !== item.id), `已移除${meta.label}“${item.title}”，可撤销。`)}><Trash2 className="size-3.5" /></Button>
          </div>}
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
        <DateRangeField plan={plan} readOnly={readOnly} className="mt-2" label={`${item.title}起止时间`} startDay={item.startDay} endDay={item.endDay}
          onChange={(startDay, endDay) => update(page.experience.map(x => x.id === item.id ? { ...x, startDay, endDay } : x), `已调整“${item.title}”的起止时间，可撤销。`)} />
      </li>)}</ol> : <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">尚未安排{meta.label}。</p>}
    </div>;
  };
  const current = editing && (editing.kind === "challenge" || editing.kind === "rotation") ? editing : null;
  return <Chapter id={id} step="practice" description="在实际工作中应用所学：挑战任务聚焦发展重点，多岗历练拓展岗位视野。具体项目需与直属上级确认。">
    <div className="grid gap-3 @min-[700px]:grid-cols-2">{column("challenge")}{column("rotation")}</div>
    <ItemEditDialog open={!!current} plan={plan} draft={current?.draft ?? null} bodyLabel="内容说明"
      title={current ? `${current.id ? "编辑" : "新增"}${kindName[current.kind]}` : ""} onCancel={() => setEditing(null)}
      onSave={draft => {
        if (!current) return;
        const kind = current.kind as ExperienceItem["kind"];
        const next = current.id
          ? page.experience.map(x => x.id === current.id ? { ...x, title: draft.title, detail: draft.body, startDay: draft.startDay, endDay: draft.endDay } : x)
          : [...page.experience, { id: `${kind}-manual-${Date.now()}`, kind, title: draft.title, detail: draft.body, startDay: draft.startDay, endDay: draft.endDay, manual: true }];
        update(next, `已${current.id ? "保存" : "新增"}${kindName[kind]}“${draft.title}”，可撤销。`);
        setEditing(null);
      }} />
  </Chapter>;
}

// —— 05 辅导带教 ——
export function MentoringSection({ page, commit, locked, readOnly, id }: Omit<SectionProps, "plan"> & { id: string }) {
  const [draft, setDraft] = useState<Mentoring>(page.mentoring);
  const [source, setSource] = useState(page.mentoring);
  if (source !== page.mentoring) { setSource(page.mentoring); setDraft(page.mentoring); }
  const save = (next: Mentoring, label: string) => {
    if (JSON.stringify(next) === JSON.stringify(page.mentoring)) return;
    if (!next.mentor.trim() || !next.measures.trim()) { setDraft(page.mentoring); return; }
    commit({ ...page, mentoring: { ...next, mentor: next.mentor.trim(), measures: next.measures.trim() } }, `已更新辅导带教的${label}，可撤销。`);
  };
  if (readOnly) return <Chapter id={id} step="mentoring">
    <dl className="grid gap-4 text-sm @min-[640px]:grid-cols-3">
      {[["导师", page.mentoring.mentor], ["辅导方式", page.mentoring.method], ["辅导频次", page.mentoring.frequency]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}
      <div className="@min-[640px]:col-span-3"><dt className="text-muted-foreground">具体措施</dt><dd className="mt-1 whitespace-pre-wrap leading-6">{page.mentoring.measures}</dd></div>
    </dl>
  </Chapter>;
  const select = (key: "method" | "frequency", label: string, options: string[]) => <label className="space-y-1.5 text-sm">
    <span className="block text-muted-foreground">{label}</span>
    <Select value={draft[key]} disabled={locked || readOnly} onValueChange={value => { const next = { ...draft, [key]: String(value) }; setDraft(next); save(next, label); }}>
      <SelectTrigger className="w-full" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent data-component-style="default">{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
    </Select>
  </label>;
  return <Chapter id={id} step="mentoring">
    {!readOnly && <p className="flex gap-2 rounded-lg bg-muted/50 p-3 text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 size-3.5 shrink-0" />{mentoringTip}</p>}
    <div className="grid gap-3 @min-[640px]:grid-cols-3">
      <label className="space-y-1.5 text-sm"><span className="block text-muted-foreground">导师</span>
        <Input value={draft.mentor} disabled={locked} readOnly={readOnly} aria-label="导师" onChange={e => setDraft({ ...draft, mentor: e.target.value })} onBlur={() => save(draft, "导师")} /></label>
      {select("method", "辅导方式", mentoringMethods)}
      {select("frequency", "辅导频次", mentoringFrequencies)}
    </div>
    <label className="block space-y-1.5 text-sm"><span className="block text-muted-foreground">具体措施</span>
      <Textarea rows={3} value={draft.measures} disabled={locked} readOnly={readOnly} aria-label="具体措施" onChange={e => setDraft({ ...draft, measures: e.target.value })} onBlur={() => save(draft, "具体措施")} /></label>
    {!readOnly && <p className="text-xs text-muted-foreground">修改在输入框失去焦点后保存；计划审批通过并生效后，按辅导频次提醒。</p>}
  </Chapter>;
}
