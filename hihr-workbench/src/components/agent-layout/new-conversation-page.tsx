import { PersonalBriefing } from "@/features/hr/personal-briefing";
import { useLayoutEffect, useRef, useState } from "react";
import { hrIcons } from "@/features/hr/icons";
import { ArrowRight, IndentIncrease, ChevronDown, X } from "lucide-react";
import type { AppConfig } from "@/agent-ui/immersive/contracts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconButton } from "./icon-button";
import { Composer, type ContextItem } from "./composer";
import { useHR } from "@/features/hr/context";
import { skillCategories, categoryExperts } from "@/features/hr/data";
import { Tasks } from "@/features/hr/views";
type Props = {
  config: Pick<
    AppConfig,
    | "experts"
    | "welcome"
    | "composerExpertOptions"
    | "composerExpertVisualKeys"
    | "showConnectorSelect"
  >;
  isSidebarDocked: boolean;
  onOpenSidebar: () => void;
  onStartConversation: (message: string, context: ContextItem[]) => void;
  compact?: boolean;
};
export function NewConversationPage({
  config,
  isSidebarDocked,
  onOpenSidebar,
  onStartConversation,
}: Props) {
  const { homeAgentCategory, setHomeAgentCategory, homeExpert, setHomeExpert, homeContext, setHomeContext, setRoute, tasks, homeDraft: draft, setHomeDraft: setDraft } = useHR();
  const [category, setCategory] = useState<string | null>(homeAgentCategory);
  const selectedCategory = skillCategories.find(item => item.id === category);
  return (
    <>
      <header className="flex h-13 shrink-0 items-center px-4">
        {!isSidebarDocked && (
          <Tooltip>
            <TooltipTrigger
              render={
                <IconButton aria-label="展开导航" onClick={onOpenSidebar}>
                  <IndentIncrease />
                </IconButton>
              }
            />
            <TooltipContent side="right">展开导航</TooltipContent>
          </Tooltip>
        )}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col pb-8 pt-[clamp(24px,5vh,48px)]">
          <h1 className="text-center text-2xl font-medium tracking-tight">嘿！有什么能帮到你的？</h1>
          <div className="mt-6">
            <Composer
              contextItems={homeContext}
              onContextItemsChange={setHomeContext}
              selectedExpert={homeExpert}
              onSelectedExpertChange={expert => {setHomeExpert(expert); setHomeAgentCategory(null);}}
              expertVisualKeys={config.composerExpertVisualKeys}
              expertOptions={config.composerExpertOptions}
              showConnectorSelect={config.showConnectorSelect}
              draft={draft}
              onDraftChange={setDraft}
              onSend={onStartConversation}
              menuSide="below"
            />
          </div>
          {(!homeExpert || homeAgentCategory) && (
          <div className="mt-4">
            {!homeExpert && <SkillCategories category={category} onSelect={id => setCategory(category === id ? null : id)} />}
            <div id="home-skill-list">
              {selectedCategory && <div className="mt-2 flex flex-col" role="region" aria-label={`${selectedCategory.label}技能`}>
                {selectedCategory.skills.map(skill => <Button key={skill.name} variant="ghost" className="h-auto min-h-9 w-full justify-start whitespace-normal px-3 py-1.5 text-left font-normal" onClick={() => {setDraft(skill.prompt); setHomeExpert(categoryExperts[selectedCategory.id] ?? null);}}><span className="shrink-0 font-medium">{skill.name}</span><span aria-hidden="true" className="mx-1 h-3.5 shrink-0 border-l" /><span className="text-sm leading-5 text-muted-foreground">{skill.description}</span></Button>)}
              </div>}
            </div>
          </div>
          )}
          <div className="mt-16">
            <PersonalBriefing />
          </div>
          <section data-slot="home-tasks" className="mt-6 rounded-xl border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium">
                待办事项{" "}
                <span className="ml-1 text-muted-foreground">
                  {tasks.filter((t) => !t.done).length}
                </span>
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="font-normal text-muted-foreground"
                onClick={() => setRoute("tasks")}
              >
                全部待办
                <ArrowRight />
              </Button>
            </div>
            <Tasks />
          </section>
        </div>
      </div>
    </>
  );
}

function SkillCategories({category, onSelect}: {category: string | null; onSelect: (id: string) => void}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number>(skillCategories.length);
  useLayoutEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const update = () => {
      const widths = Array.from(measure.children).map(el => el.getBoundingClientRect().width);
      const available = row.clientWidth;
      const total = widths.slice(0, -1).reduce((sum, width) => sum + width, 0) + (skillCategories.length - 1) * 8;
      if (total <= available) { setCount(skillCategories.length); return; }
      let used = widths[widths.length - 1];
      let fit = 0;
      for (const width of widths.slice(0, -1)) {
        if (used + width + 8 > available) break;
        used += width + 8;
        fit++;
      }
      setCount(fit);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);
  const chip = (item: typeof skillCategories[number]) => {
    const Icon = hrIcons[item.id];
    return <Button key={item.id} variant={category === item.id ? "secondary" : "outline"} className="group/skill h-9 rounded-full px-3 font-normal" aria-pressed={category === item.id} aria-expanded={category === item.id} aria-controls="home-skill-list" onClick={() => onSelect(item.id)}><span className="relative size-4 shrink-0"><Icon className={category === item.id ? "size-4 group-hover/skill:invisible group-focus-visible/skill:invisible" : "size-4"} />{category === item.id && <X aria-hidden="true" className="invisible absolute inset-0 size-4 group-hover/skill:visible group-focus-visible/skill:visible" />}</span>{item.label}</Button>;
  };
  const hiddenSelected = skillCategories.slice(count).some(item => item.id === category);
  return <div className="relative">
    <div ref={measureRef} aria-hidden="true" inert className="pointer-events-none invisible absolute left-0 top-0 flex w-max gap-2">{skillCategories.map(chip)}<Button variant="outline" className="h-9 rounded-full px-3 font-normal">更多<ChevronDown className="size-4" /></Button></div>
    <div ref={rowRef} className="flex min-w-0 flex-nowrap justify-center gap-2" aria-label="技能分类">
      {skillCategories.slice(0, count).map(chip)}
      {count < skillCategories.length && <DropdownMenu><DropdownMenuTrigger render={<Button variant={hiddenSelected ? "secondary" : "outline"} className="h-9 rounded-full px-3 font-normal" />}>更多<ChevronDown className="size-4" /></DropdownMenuTrigger><DropdownMenuContent align="end">{skillCategories.slice(count).map(item => {const Icon = hrIcons[item.id]; return <DropdownMenuItem className="group/skill" key={item.id} onClick={() => onSelect(item.id)}><span className="relative size-4 shrink-0"><Icon className={category === item.id ? "size-4 group-hover/skill:invisible group-data-highlighted/skill:invisible" : "size-4"} />{category === item.id && <X aria-hidden="true" className="invisible absolute inset-0 size-4 group-hover/skill:visible group-data-highlighted/skill:visible" />}</span>{item.label}{item.id === category && <span className="ml-auto text-xs text-muted-foreground">已选</span>}</DropdownMenuItem>;})}</DropdownMenuContent></DropdownMenu>}
    </div>
  </div>;
}
