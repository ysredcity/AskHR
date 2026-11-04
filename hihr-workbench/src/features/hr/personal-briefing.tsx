import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Puzzle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/agent-layout/icon-button";
import { personalRecommendations } from "./data";
import { useHR } from "./context";

export function PersonalBriefing() {
  const { setHomeDraft, setHomeContext, setHomeExpert } = useHR();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const items = personalRecommendations;
  const index = Math.max(0, items.findIndex(item => item.id === selectedId));
  const current = items[index];
  const topicLabels = [
    [["目标拆解", "绩效 PBC", "年度规划"], ["关键成果", "目标对齐", "行动计划"], ["工作总结", "成长反馈", "绩效沟通"]],
    [["能力标准", "任职资格", "自我评价"], ["举证材料", "认证申请", "专业能力"], ["学习地图", "成长计划", "认证记录"]],
    [["业绩成果", "职称申请", "专业发展"], ["材料清单", "申报条件", "评审规则"], ["成果梳理", "职业成长", "资格审核"]],
  ][index];
  const choose = (id: string) => { if (id === current.id) return; setDirection(items.findIndex(item => item.id === id) > index ? 1 : -1); setSelectedId(id); };
  const continueWith = () => {
    setHomeExpert(current.expert);
    setHomeContext([{id: `recommendation-${current.id}`, label: current.topic, type: "技能"}, {id: `source-${current.id}`, label: current.source, type: "文件库"}]);
    setHomeDraft(current.prompt);
  };
  return <section aria-label="智能推荐区" aria-roledescription="轮播">
    <div className="briefing-banner relative isolate overflow-hidden rounded-2xl border px-10 py-5">
      <IconButton aria-label="上一条推荐" className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full" onClick={() => { setDirection(-1); setSelectedId(items[(index - 1 + items.length) % items.length].id); }}><ChevronLeft /></IconButton>
      <IconButton aria-label="下一条推荐" className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full" onClick={() => { setDirection(1); setSelectedId(items[(index + 1) % items.length].id); }}><ChevronRight /></IconButton>
      <div key={`topics-${current.id}`} className="briefing-topics" aria-hidden="true">
        {topicLabels.map((row, i) => <div key={i} className="briefing-topic-row">{row.map(label => <span key={label} className="briefing-topic"><Puzzle className="size-3.5 shrink-0" />{label}</span>)}</div>)}
      </div>
      <div key={current.id} data-direction={direction} className="briefing-transition briefing-copy relative z-10">
        <div className="briefing-window mb-2 inline-flex h-6 max-w-full items-center gap-1.5 rounded-full px-2.5 text-xs font-medium leading-5"><CalendarDays className="size-3 shrink-0" aria-hidden="true" /><span className="truncate">人资窗口期 · {current.window}</span></div>
        <h2 title={current.title} className="h-6 truncate text-base font-medium leading-6 tracking-tight">{current.title}</h2>
        <p title={current.description} className="mt-1 h-5 truncate text-sm leading-5 text-muted-foreground">{current.description}</p>
      </div>
      <div className="relative z-10 mt-3 pr-12">
        <div className="flex gap-2">
          <Button className="bg-foreground text-background hover:bg-foreground/85">{current.entry}<ArrowRight data-icon="inline-end" /></Button>
          <Button variant="outline" onClick={continueWith}><Sparkles />{current.action}</Button>
        </div>
      </div>
        <div className="absolute bottom-2 right-3 z-20 flex items-center gap-0" aria-label="推荐分页">
          {items.map((item, page) => <button key={item.id} aria-label={`第 ${page + 1} 条推荐：${item.topic}`} aria-pressed={item.id === current.id} onClick={()=>choose(item.id)} className="grid h-6 w-4 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className={cn("size-1.5 rounded-full transition-colors", item.id === current.id ? "bg-primary" : "bg-muted-foreground/25 hover:bg-muted-foreground")} /></button>)}
        </div>
    </div>
  </section>;
}
