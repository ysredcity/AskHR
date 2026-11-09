import { useMemo, useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { zhCN } from "date-fns/locale";
import { CalendarIcon, ChartNoAxesCombined, Check, Lightbulb, MousePointerClick, Plus, Puzzle, Rocket, Route, Search, Sparkles, UsersRound, Workflow, BookOpenText, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePanelPortal } from "@/components/agent-layout/panel-portal";
import { cn } from "@/lib/utils";
import type { Plan } from "./data";
import { dateToDay, dayToDate, library, topics, type TopicKey } from "./catalog";

// —— 课程封面：按主题生成的本地封面，不使用外部图片 ——
const covers: Record<TopicKey, { icon: LucideIcon; className: string }> = {
  ai: { icon: Sparkles, className: "from-primary/30 to-info/20 text-primary" },
  strategy: { icon: Route, className: "from-info/30 to-primary/15 text-info" },
  data: { icon: ChartNoAxesCombined, className: "from-success/30 to-info/15 text-success-foreground" },
  scale: { icon: Rocket, className: "from-warning/30 to-success/15 text-warning-foreground" },
  ux: { icon: MousePointerClick, className: "from-info/25 to-warning/15 text-info" },
  solution: { icon: Puzzle, className: "from-primary/25 to-warning/15 text-primary" },
  insight: { icon: Lightbulb, className: "from-warning/25 to-info/15 text-warning-foreground" },
  delivery: { icon: Workflow, className: "from-success/25 to-primary/15 text-success-foreground" },
  people: { icon: UsersRound, className: "from-primary/25 to-success/20 text-primary" },
};
export function CourseCover({ topic, className }: { topic: TopicKey; className?: string }) {
  const { icon: Icon, className: tone } = covers[topic];
  return <div aria-hidden className={cn("relative flex h-14 w-20 shrink-0 flex-col justify-between overflow-hidden rounded-md bg-linear-to-br p-1.5", tone, className)}>
    <Icon className="size-4" />
    <span className="truncate text-[10px] font-medium leading-none text-foreground/70">{topics[topic].label}</span>
    <Icon className="absolute -bottom-2 -right-2 size-10 opacity-15" />
  </div>;
}
export function CaseIcon({ className }: { className?: string }) {
  return <div aria-hidden className={cn("grid size-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground", className)}><BookOpenText className="size-4" /></div>;
}

// —— 日期范围：限定在计划周期内 ——
export function DateRangeField({ plan, startDay, endDay, onChange, label, className, readOnly }: { plan: Plan; startDay: number; endDay: number; onChange: (startDay: number, endDay: number) => void; label: string; className?: string; readOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>();
  const from = dayToDate(plan, startDay);
  const to = dayToDate(plan, endDay);
  const first = dayToDate(plan, 1);
  const last = dayToDate(plan, plan.conditions.days);
  const text = `${format(from, "yyyy/MM/dd")} – ${format(to, "yyyy/MM/dd")}`;
  if (readOnly) return <span className={cn("inline-flex h-7 items-center gap-1.5 text-xs tabular-nums text-muted-foreground", className)}><CalendarIcon className="size-3.5" />{text}</span>;
  return <Popover open={open} onOpenChange={next => { setOpen(next); if (!next) setDraft(undefined); }}>
    <PopoverTrigger render={<Button type="button" variant="outline" size="sm" aria-label={`${label}：${text}，点击修改`} className={cn("h-7 gap-1.5 px-2 text-xs font-normal tabular-nums", className)} />}>
      <CalendarIcon className="size-3.5" />{text}
    </PopoverTrigger>
    <PopoverContent align="start" className="w-auto p-0" data-component-style="default">
      <Calendar mode="range" locale={zhCN} defaultMonth={from} startMonth={first} endMonth={last}
        disabled={[{ before: first }, { after: last }]}
        selected={draft ?? { from, to }}
        onSelect={(_range, day) => {
          // 两次点击确定范围：第一次为开始日期，第二次为结束日期（早于开始时自动对调）
          if (!draft?.from) { setDraft({ from: day, to: undefined }); return; }
          const [a, b] = draft.from <= day ? [draft.from, day] : [day, draft.from];
          onChange(dateToDay(plan, a), dateToDay(plan, b));
          setOpen(false); setDraft(undefined);
        }} />
      <p className="border-t px-3 pt-2 text-xs text-muted-foreground">{draft?.from ? `开始：${format(draft.from, "yyyy/MM/dd")}，请选择结束日期` : "先选开始日期，再选结束日期"}</p>
      <p className="px-3 pb-2 text-xs text-muted-foreground">可选范围：计划周期 {format(first, "yyyy/MM/dd")} – {format(last, "yyyy/MM/dd")}</p>
    </PopoverContent>
  </Popover>;
}

// —— 条目编辑 / 新增 ——
export type EditDraft = { title: string; body: string; hours?: number; startDay: number; endDay: number };
export function ItemEditDialog({ open, title, bodyLabel, plan, draft, onCancel, onSave, validate }: {
  open: boolean; title: string; bodyLabel: string; plan: Plan; draft: EditDraft | null;
  onCancel: () => void; onSave: (draft: EditDraft) => void; validate?: (draft: EditDraft) => string | null;
}) {
  const container = usePanelPortal();
  const [value, setValue] = useState<EditDraft | null>(draft);
  const [error, setError] = useState("");
  const [lastDraft, setLastDraft] = useState(draft);
  if (draft !== lastDraft) { setLastDraft(draft); setValue(draft); setError(""); }
  return <Dialog open={open} onOpenChange={next => !next && onCancel()}>
    <DialogContent container={container} className="sm:max-w-md" data-component-style="default">
      <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>保存后更新当前计划，可撤销最近修改。</DialogDescription></DialogHeader>
      {value && <form className="space-y-4" onSubmit={event => {
        event.preventDefault();
        const message = validate?.(value) ?? (value.hours !== undefined && !(value.hours > 0) ? "预计用时需大于 0。" : null);
        if (message) { setError(message); return; }
        onSave({ ...value, title: value.title.trim(), body: value.body.trim() });
      }}>
        <label className="block space-y-2 text-sm"><span>名称</span><Input required value={value.title} onChange={e => setValue({ ...value, title: e.target.value })} /></label>
        <label className="block space-y-2 text-sm"><span>{bodyLabel}</span><Textarea required rows={3} value={value.body} onChange={e => setValue({ ...value, body: e.target.value })} /></label>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2 text-sm"><span className="block">计划时间</span><DateRangeField plan={plan} label="计划时间" startDay={value.startDay} endDay={value.endDay} onChange={(startDay, endDay) => setValue({ ...value, startDay, endDay })} className="h-8" /></div>
          {value.hours !== undefined && <label className="w-28 space-y-2 text-sm"><span className="block">预计用时（小时）</span><Input required type="number" min={0.5} step={0.5} value={value.hours} onChange={e => setValue({ ...value, hours: Number(e.target.value) })} /></label>}
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2"><Button type="submit" disabled={!value.title.trim() || !value.body.trim()}>保存</Button><Button type="button" variant="outline" onClick={onCancel}>取消</Button></div>
      </form>}
    </DialogContent>
  </Dialog>;
}

// —— 从课程库 / 案例库添加 ——
export function LibraryDialog({ open, kind, addedIds, onAdd, onClose }: { open: boolean; kind: "course" | "case"; addedIds: Set<string>; onAdd: (entryId: string) => void; onClose: () => void }) {
  const container = usePanelPortal();
  const [query, setQuery] = useState("");
  const name = kind === "course" ? "课程" : "标杆案例";
  const entries = useMemo(() => {
    const words = query.trim().toLowerCase();
    return library.filter(entry => entry.kind === kind && (!words || `${entry.title}${entry.summary}${topics[entry.topic].label}`.toLowerCase().includes(words)));
  }, [kind, query]);
  return <Dialog open={open} onOpenChange={next => { if (!next) { onClose(); setQuery(""); } }}>
    <DialogContent container={container} className="flex max-h-[min(560px,calc(100%-2rem))] flex-col gap-3 sm:max-w-lg" data-component-style="default">
      <DialogHeader><DialogTitle>添加{name}</DialogTitle><DialogDescription>从{kind === "course" ? "企业学习平台课程库" : "内部标杆案例库"}中选择，添加后可调整计划时间。</DialogDescription></DialogHeader>
      <div className="relative"><Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input autoFocus className="pl-8" placeholder={`搜索${name}名称、内容或主题`} aria-label={`搜索${name}`} value={query} onChange={e => setQuery(e.target.value)} /></div>
      <ul className="-mx-1 min-h-0 flex-1 space-y-1 overflow-y-auto px-1" aria-label={`${name}列表`}>
        {entries.map(entry => {
          const added = addedIds.has(entry.id);
          return <li key={entry.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
            {kind === "course" ? <CourseCover topic={entry.topic} className="h-12 w-16" /> : <CaseIcon />}
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{entry.title}</p><p className="truncate text-xs text-muted-foreground">{topics[entry.topic].label} · {entry.hours} 小时 · {entry.summary}</p></div>
            <Button size="sm" variant={added ? "ghost" : "outline"} disabled={added} aria-label={added ? `${entry.title}已添加` : `添加${entry.title}`} onClick={() => onAdd(entry.id)}>{added ? <><Check className="size-3.5" />已添加</> : <><Plus className="size-3.5" />添加</>}</Button>
          </li>;
        })}
        {!entries.length && <li className="py-8 text-center text-sm text-muted-foreground">没有找到匹配的{name}，换个关键词试试。</li>}
      </ul>
    </DialogContent>
  </Dialog>;
}
