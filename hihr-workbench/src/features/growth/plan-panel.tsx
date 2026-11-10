import { GrowthReadOnlyContext } from "./read-only-context";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Clock3, Pencil } from "lucide-react";
import { useHR } from "@/features/hr/context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegionReference } from "./region-reference";
import { TargetPositionField } from "./target-position-field";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { growthProfile, submittedCurrent, type Conditions } from "./data";
import { dayToDate, learningBudget, reconcilePage, steps, type GrowthPage, type StepKey } from "./catalog";
import { AnalysisSection, DirectionSection, ExperienceSection, LearningSection, MentoringSection } from "./plan-sections";

type ChapterKey = StepKey;
const chapters = steps.map(step => [step.key, step.title] as const);
const finalChapterTitles: Record<ChapterKey, string> = { analysis: "优劣势分析", direction: "发展方向", learning: "学习计划", practice: "实践计划", mentoring: "辅导带教安排" };

export function GrowthPlanPanel({ id, final = false }: { id: string; final?: boolean }) {
  const { growthSessions, setGrowthSessions, setSessionDrafts } = useHR();
  const state = growthSessions[id];
  const plan = final ? state?.submitted?.plan : state?.plan;
  const [overview, setOverview] = useState<Conditions | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [paging, setPaging] = useState({ left: false, right: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ChapterKey>("analysis");
  const anchor = (key: ChapterKey) => `${id}-${final ? "final-" : ""}${key}`;

  // 滚动时高亮当前章节：取顶部吸顶目录下方第一个进入视口的章节
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !plan) return;
    const update = () => {
      const top = root.getBoundingClientRect().top + Math.min(240, root.clientHeight * 0.3);
      let current: ChapterKey = chapters[0][0];
      for (const [key] of chapters) {
        const element = document.getElementById(anchor(key));
        if (element && element.getBoundingClientRect().top <= top) current = key;
      }
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) current = chapters[chapters.length - 1][0];
      setActive(current);
    };
    update();
    root.addEventListener("scroll", update, { passive: true });
    return () => root.removeEventListener("scroll", update);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, !!plan]);

  // 仅调整目录自己的横向位置，避免 scrollIntoView 牵动其他滚动容器。
  const hasPlan = !!plan;
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const viewport = tabsRef.current;
      const tab = viewport?.querySelector<HTMLElement>(`[data-step="${active}"]`);
      if (!viewport || !tab) return;
      if (active === "analysis") { viewport.scrollLeft = 0; return; }
      const bounds = viewport.getBoundingClientRect();
      const target = tab.getBoundingClientRect();
      if (target.left < bounds.left + 28) viewport.scrollLeft += target.left - bounds.left - 28;
      else if (target.right > bounds.right - 28) viewport.scrollLeft += target.right - bounds.right + 28;
    });
    return () => cancelAnimationFrame(frame);
  }, [active, hasPlan]);

  useEffect(() => {
    const node = tabsRef.current;
    if (!node) return;
    const measure = () => setPaging({ left: node.scrollLeft > 1, right: node.scrollLeft + node.clientWidth < node.scrollWidth - 1 });
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    node.addEventListener("scroll", measure);
    measure();
    return () => { observer.disconnect(); node.removeEventListener("scroll", measure); };
  }, [hasPlan]);

  if (!plan) return <p className="p-6 text-sm text-muted-foreground">{final ? "成长计划尚未提交审批。" : "计划尚未生成，请返回对话继续。"}</p>;
  const page = reconcilePage(plan);
  const locked = !!state.pending || !!state.submitting;
  const submitted = !final && submittedCurrent(state);
  const commit = (next: GrowthPage, answer: string) => setGrowthSessions(all => {
    const current = all[id];
    return { ...all, [id]: { ...current, previous: current.plan, plan: { ...current.plan!, page: next, revision: current.plan!.revision + 1 }, messages: [...current.messages, { user: "调整计划内容", answer }] } };
  });
  const jump = (key: ChapterKey) => {
    setActive(key);
    document.getElementById(anchor(key))?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const start = dayToDate(plan, 1);
  const end = dayToDate(plan, plan.conditions.days);
  const sectionProps = { plan, page, commit, locked, readOnly: final };

  const wrap = "mx-auto w-full max-w-5xl px-5 @min-[600px]:px-8 @min-[900px]:px-10";
  // 页头弥散渐变直接叠在页面底色上，与整页背景融为一体；样式不随经典 / Glass 主题变化
  return <GrowthReadOnlyContext value={final}><div className="flex min-h-0 min-w-0 flex-1 flex-col" data-slot="growth-plan-shell" data-component-style="default"><div ref={scrollRef} className="@container min-h-0 min-w-0 flex-1 overflow-y-auto text-foreground" data-growth-session={id} data-slot="growth-plan-page" data-component-style="default">
    <div className="bg-[radial-gradient(ellipse_80%_100%_at_0%_0%,color-mix(in_oklch,var(--primary)_26%,transparent),transparent_70%),radial-gradient(ellipse_60%_80%_at_100%_0%,color-mix(in_oklch,var(--info)_14%,transparent),transparent_70%)]">
      <header className={`${wrap} space-y-4 pb-6 pt-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-card/70">{final ? "审批稿" : "预览版"}</Badge>
            {(final || submitted) && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" />待审批 · 尚未生效{state.submitted ? ` · ${state.submitted.at}` : ""}</span>}
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">修订 {plan.revision}</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{growthProfile.name}的成长计划</h2>
          <p className="mt-1 text-sm text-muted-foreground">{growthProfile.organization} · {growthProfile.role}</p>
        </div>
        <div id={`${id}-overview`} className="group/region rounded-xl border bg-card/80 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2"><h3 className="text-sm font-medium">计划概览</h3><div className="flex items-center gap-1"><RegionReference region={`${id}-overview`} title="计划概览" />{!final && <Button variant="ghost" size="sm" disabled={locked} onClick={() => setOverview({ ...plan.conditions })}><Pencil className="size-3.5" />编辑</Button>}</div></div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm @min-[720px]:grid-cols-4">
          {[["目标岗位", plan.conditions.targetRole], ["发展方向", plan.conditions.direction],
            ["计划周期", `${plan.conditions.days} 天 · ${format(start, "yyyy/MM/dd")}–${format(end, "yyyy/MM/dd")}`],
            ["学习投入", `每周 ${plan.conditions.hours} 小时 · 预算 ${Number(learningBudget(plan).toFixed(1))} 小时`]].map(([label, value]) =>
            <div key={label} className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}
        </dl></div>
        <p className="text-xs text-muted-foreground">本周期用于积累发展成果，不构成晋升承诺。</p>
      </header>
    </div>

    {/* 章节目录：滚动到顶部后吸顶，随滚动高亮当前章节 */}
    <nav aria-label="计划步骤" className="sticky top-0 z-10 bg-(--growth-canvas)/90 py-2 backdrop-blur">
      <div className={wrap}><div className="relative overflow-hidden rounded-lg bg-card shadow-xs"><Button variant="ghost" size="icon-sm" aria-label="上一页步骤" className={`absolute inset-y-0 left-0 z-10 my-auto rounded-none bg-card hover:bg-[color-mix(in_oklch,var(--card)_94%,var(--foreground))] dark:hover:bg-[color-mix(in_oklch,var(--card)_94%,var(--foreground))] ${paging.left ? "" : "hidden"}`} onClick={() => tabsRef.current?.scrollBy({ left: -tabsRef.current.clientWidth * .8, behavior: "smooth" })}><ChevronLeft className="size-4" /></Button><div ref={tabsRef} className="min-w-0 overflow-x-auto [scrollbar-width:none]"><Tabs value={active} onValueChange={value => jump(value as ChapterKey)}>
        <TabsList className="h-auto w-max justify-start gap-0.5 bg-card p-1 shadow-xs [scrollbar-width:none]">{chapters.map(([key, title], i) => <span key={key} className="flex shrink-0 items-center">
          {i > 0 && <ChevronRight aria-hidden className="size-3.5 text-muted-foreground/60" />}
          <TabsTrigger value={key} data-step={key} className="group/step h-7 shrink-0 gap-1.5 px-2 data-active:bg-muted">
            <span aria-hidden className="grid size-4.5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold tabular-nums text-muted-foreground group-data-active/step:bg-primary group-data-active/step:text-primary-foreground">{i + 1}</span>{final ? finalChapterTitles[key] : title}
          </TabsTrigger>
        </span>)}</TabsList>
      </Tabs></div><Button variant="ghost" size="icon-sm" aria-label="下一页步骤" className={`absolute inset-y-0 right-0 z-10 my-auto rounded-none bg-card hover:bg-[color-mix(in_oklch,var(--card)_94%,var(--foreground))] dark:hover:bg-[color-mix(in_oklch,var(--card)_94%,var(--foreground))] ${paging.right ? "" : "hidden"}`} onClick={() => tabsRef.current?.scrollBy({ left: tabsRef.current.clientWidth * .8, behavior: "smooth" })}><ChevronRight className="size-4" /></Button></div></div>
    </nav>

    <div className={wrap}>
      <main className="space-y-4 py-5">
        <AnalysisSection plan={plan} id={anchor("analysis")} />
        <DirectionSection plan={plan} id={anchor("direction")} />
        <LearningSection {...sectionProps} id={anchor("learning")} />
        <ExperienceSection {...sectionProps} id={anchor("practice")} />
        <MentoringSection key={plan.revision} page={page} commit={commit} locked={locked} readOnly={final} id={anchor("mentoring")} />

      </main>
    </div>
  </div>
    {!final && <footer className="shrink-0 border-t bg-card px-5 py-3" data-slot="growth-plan-footer">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 flex-1 text-xs leading-5 text-muted-foreground">{final ? "审批稿为提交审批时的计划快照，审批通过后才生效。" : submitted ? "当前版本待审批，审批通过后生效；修改后需重新提交审批。" : "定稿后提交审批，审批通过后计划正式生效。"}</p>
        {!final && <div className="flex shrink-0 gap-2"><Button size="sm" disabled={locked || submitted} onClick={() => setSessionDrafts(all => ({ ...all, [id]: "确认定稿，提交成长计划审批" }))}>提交审批</Button></div>}
      </div>
    </footer>}
    <Dialog open={!final && !!overview} onOpenChange={open => !open && setOverview(null)}><DialogContent className="max-h-[85dvh] overflow-y-auto" data-component-style="default"><DialogHeader><DialogTitle>编辑计划概览</DialogTitle><DialogDescription>修改岗位、周期与学习投入，同步调整计划内容，可撤销。</DialogDescription></DialogHeader>{overview && <form className="space-y-4" onSubmit={event => {
      event.preventDefault();
      const next = { ...plan, conditions: overview };
      const nextPage = reconcilePage(next);
      setGrowthSessions(all => ({ ...all, [id]: { ...all[id], conditions: overview, previous: all[id].plan, plan: { ...next, page: nextPage, revision: plan.revision + 1 } } }));
      setOverview(null);
    }}><TargetPositionField conditions={overview} onChange={setOverview} /><label className="block space-y-2 text-sm"><span>计划周期（天）</span><Input required type="number" min={3} max={365} step={1} value={overview.days} onChange={e => setOverview({ ...overview, days: Number(e.target.value) })} /></label><label className="block space-y-2 text-sm"><span>每周学习投入（小时）</span><Input required type="number" min={0.01} max={40} step="any" value={overview.hours} onChange={e => setOverview({ ...overview, hours: Number(e.target.value) })} /></label><div className="flex gap-2"><Button type="submit">保存修改</Button><Button type="button" variant="outline" onClick={() => setOverview(null)}>取消</Button></div></form>}</DialogContent></Dialog>
  </div></GrowthReadOnlyContext>;
}
