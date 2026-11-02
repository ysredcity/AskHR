import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/agent-layout/icon-button";
import { personalRecommendations } from "./data";
import { HairlineBriefing } from "./hairline-briefing";
import { useHR } from "./context";

export function PersonalBriefing() {
  const { setHomeDraft, setHomeContext, setHomeExpert } = useHR();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const items = personalRecommendations;
  const index = Math.max(0, items.findIndex(item => item.id === selectedId));
  const current = items[index];
  const choose = (id: string) => { if (id === current.id) return; setDirection(items.findIndex(item => item.id === id) > index ? 1 : -1); setSelectedId(id); };
  const continueWith = () => {
    setHomeExpert(current.expert);
    setHomeContext([{id: `recommendation-${current.id}`, label: current.topic, type: "技能"}, {id: `source-${current.id}`, label: current.source, type: "文件库"}]);
    setHomeDraft(current.prompt);
  };
  return <section aria-label="智能推荐区" aria-roledescription="轮播">
    <div className="briefing-banner relative isolate overflow-hidden rounded-2xl border px-10 py-3">
      <IconButton aria-label="上一条推荐" className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full" onClick={() => { setDirection(-1); setSelectedId(items[(index - 1 + items.length) % items.length].id); }}><ChevronLeft /></IconButton>
      <IconButton aria-label="下一条推荐" className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full" onClick={() => { setDirection(1); setSelectedId(items[(index + 1) % items.length].id); }}><ChevronRight /></IconButton>
      <HairlineBriefing />
      <div key={current.id} data-direction={direction} className="briefing-transition briefing-copy relative z-10">
        <h2 title={current.title} className="h-6 truncate text-base font-medium leading-6 tracking-tight">{current.title}</h2>
        <p title={current.description} className="mt-1 h-5 truncate text-sm leading-5 text-muted-foreground">{current.description}</p>
      </div>
      <div className="relative z-10 mt-2 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button className="bg-foreground text-background hover:bg-foreground/85" onClick={continueWith}><MessageSquare />{current.action}</Button>
          <Button variant="outline">查看详情<ArrowRight data-icon="inline-end" /></Button>
        </div>
        <div className="flex items-center gap-0" aria-label="推荐分页">
          {items.map((item, page) => <button key={item.id} aria-label={`第 ${page + 1} 条推荐：${item.topic}`} aria-pressed={item.id === current.id} onClick={()=>choose(item.id)} className="grid h-6 w-4 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className={cn("size-1.5 rounded-full transition-colors", item.id === current.id ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground")} /></button>)}
        </div>
      </div>
    </div>
  </section>;
}
