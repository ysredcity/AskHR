import { useHR } from "@/features/hr/context";
import { useEffect, useState } from "react";
import { ChevronDown, Check, Star, User, Workflow } from "lucide-react";
import { Composer } from "@/components/agent-layout/composer";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { analysisScene, createSalaryProject, distribution, type Project } from "./data";
export default function CompensationApp() {
  const {setRoute, salaryProjects:projects, setSalaryProjects:setProjects, setSalaryActive:setActive, setSalaryLaunch} = useHR();
  const [mode, setMode] = useState("组织薪酬");
  const [filter, setFilter] = useState("全部项目");
  const [model, setModel] = useState("HiStar Ultra");
  const [draft, setDraft] = useState("");
  useEffect(() => { document.title = "薪酬智参 · AskHR"; }, []);
  const openProject = (item: Project) => {
    if (!item.scenes.length) setProjects(items => items.map(p => p.id === item.id ? { ...p, scenes: [analysisScene(`${p.id}-analysis`, `请分析${p.title}`, p.title)] } : p));
    setActive(item.id); setSalaryLaunch(item.id); setRoute("home");
  };
  const start = (message: string) => {
    const project = createSalaryProject(message, mode, "compensation");
    setProjects(items => [project, ...items]);
    setActive(project.id); setSalaryLaunch(project.id); setRoute("home"); setDraft("");
  };
  const modelControl = <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" size="sm" className="rounded-full font-normal" aria-label={`模型切换：${model}`} />}>{model}<ChevronDown className="size-3.5" /></DropdownMenuTrigger><DropdownMenuContent align="end">{["HiStar Ultra", "Deepseek V2.1", "KImi K3"].map(item=><DropdownMenuItem key={item} onClick={()=>setModel(item)}>{item}{model===item && <Check className="ml-auto size-4" />}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>;
  return <main className="salary-app min-h-full">

      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-[clamp(48px,9vh,100px)] text-center">
        <p className="text-[11px] font-medium tracking-[0.35em] text-primary">COMPENSATION INTELLIGENCE</p>
        <h1 className="mt-5 text-[clamp(30px,3.6vw,50px)] font-semibold tracking-tight">让每一份薪酬决策<span className="salary-title">有据可依</span></h1>
        <p className="mt-5 text-sm text-muted-foreground">基于组织数据、市场对标与内部公平性，生成结构化薪酬洞察报告。</p>
        <div className="mx-auto mt-14 max-w-3xl rounded-[28px] border border-card bg-muted/70 p-1 text-left shadow-sm">
          <Tabs value={mode} onValueChange={v=>setMode(String(v))}><TabsList className="mb-1 bg-transparent"><TabsTrigger value="组织薪酬"><Workflow className="size-4" />组织薪酬</TabsTrigger><TabsTrigger value="个人薪酬"><User className="size-4" />个人薪酬</TabsTrigger></TabsList></Tabs>
          <Composer placeholder="告诉我要查询的组织范围，如：分析显示事业部" trailingControls={modelControl} draft={draft} onDraftChange={setDraft} onSend={start} menuSide="below" expertOptions={["薪酬专家"]} />
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-8 pb-10">
        <div className="mb-4 flex gap-2">{["全部项目","我的收藏"].map(item=><Button key={item} variant={filter===item?"default":"ghost"} className={cn("rounded-full",filter===item&&"bg-foreground text-background hover:bg-foreground/85")} onClick={()=>setFilter(item)}>{item}</Button>)}</div>
        <div className="grid grid-cols-5 gap-4 max-[1200px]:grid-cols-4 max-[1000px]:grid-cols-3 max-[740px]:grid-cols-2">
          {projects.filter(p=>filter!=="我的收藏"||p.favorite).map(p=><article key={p.id} className="group relative rounded-xl border bg-card p-2 shadow-sm transition-shadow hover:shadow-md">
            <button className="w-full text-left" onClick={()=>openProject(p)}><ReportThumbnail /><h2 className="mt-3 line-clamp-2 min-h-10 text-sm font-medium leading-5">{p.title}</h2><p className="mb-1 mt-2 text-xs text-muted-foreground">{p.mode} · 分析报告</p></button>
            <Button variant="ghost" size="icon-xs" className="absolute right-3 top-3 bg-card/90" aria-label={`${p.favorite?"取消收藏":"收藏"}${p.title}`} onClick={()=>setProjects(items=>items.map(item=>item.id===p.id?{...item,favorite:!item.favorite}:item))}><Star className={cn("size-3.5",p.favorite&&"fill-current text-primary")} /></Button>
          </article>)}
        </div>
        {!projects.some(p=>filter!=="我的收藏"||p.favorite)&&<p className="py-12 text-center text-sm text-muted-foreground">暂无收藏项目</p>}
      </section>
  </main>;
}
function ReportThumbnail() {
  return <div aria-hidden="true" className="h-28 overflow-hidden rounded-lg border bg-background p-3"><div className="mb-2 h-1 w-2/5 bg-primary" /><div className="mb-3 h-1 w-3/4 bg-muted" /><div className="flex gap-3"><div className="flex h-12 flex-1 items-end justify-around border-b">{distribution.map((n,i)=><span key={i} className="w-2 rounded-t-sm bg-primary/65" style={{height:`${n}%`}} />)}</div><div className="flex-1 space-y-1.5">{distribution.map((_,i)=><div key={i} className="h-1 bg-muted" />)}</div></div><div className="mt-3 h-1 w-full bg-muted" /><div className="mt-1 h-1 w-4/5 bg-muted" /></div>;
}
