import { useEffect, useId, useState } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Check } from "lucide-react";
import {RecommendationList} from "@/agent-ui/conversation/recommendation-list";
import {ConversationSurface} from "@/agent-ui/conversation";
import { useHR } from "@/features/hr/context";
import { Composer } from "@/components/agent-layout/composer";
import { ConversationFlow } from "@/components/agent-layout/conversation-flow";
import { appConfig } from "@/components/agent-layout/app-config";
import type { ArtifactTarget } from "@/agent-ui/immersive/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import type { Project } from "./data";
import { diagnosisArtifact, diagnosisScene, fieldLabels, firstSteps, secondSteps, finalSteps, reportRecommendation, type Diagnosis } from "./competitiveness";
export function DiagnosisFlow({project,onOpenArtifact}:{project:Project;onOpenArtifact:(artifact:ArtifactTarget)=>void}) {
  const {setSalaryProjects,sessionDrafts,setSessionDrafts,sessionContexts,setSessionContexts}=useHR();
  const state=project.diagnosis!;
  const update=(change:Partial<Diagnosis>)=>setSalaryProjects(items=>items.map(p=>p.id===project.id?{...p,diagnosis:{...p.diagnosis!,...change}}:p));
  useEffect(()=>{
    if(!state.running)return;
    const count=(state.stage===1?firstSteps:state.stage===2?secondSteps:finalSteps).length;
    const timer=setTimeout(()=>setSalaryProjects(items=>items.map(p=>{
      if(p.id!==project.id||!p.diagnosis?.running)return p;
      const d=p.diagnosis;
      return {...p,diagnosis:{...d,progress:Math.min(d.progress+1,count-1),running:d.progress+1<count}};
    })),650);
    return ()=>clearTimeout(timer);
  },[project.id,state.running,state.progress,state.stage,setSalaryProjects]);
  useEffect(()=>{
    if(state.running||state.stage===3||state.opened===state.stage)return;
    const artifact=diagnosisArtifact(state.stage===1?0:1,state.clarification);
    onOpenArtifact(artifact);
    update({opened:state.stage});
  // 只在阶段完成时自动打开一次，不随手动关闭或编辑重新打开。
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  },[state.running,state.stage,state.opened]);
  const send=(message:string)=>{
    if(state.running)return;
    if(state.stage===1)return;
    const confirm=/^(是|是的|确认|可以|立即生成薪酬诊断报告|生成最终报告|生成报告)[。！!\s]*$/.test(message.replace(/\[\[[^\]]+\]\]/g, "").trim());
    const stage=confirm?3:2;
    update({stage,formSubmitted:confirm?state.formSubmitted:false,progress:0,running:true,opened:stage===2?undefined:state.opened,messages:stage===3?[...state.messages.slice(0,2),message]:[state.messages[0],message],clarification:confirm?state.clarification:{...state.clarification,feedback:message}});
  };
  return <ConversationSurface scrollKey={`${project.id}-${state.stage}-${state.running}`} footer={<Composer contextItems={sessionContexts[project.id]??[]} onContextItemsChange={items=>setSessionContexts(all=>({...all,[project.id]:items}))} disabled={state.running||state.stage===1} draft={sessionDrafts[project.id]??""} onDraftChange={value=>setSessionDrafts(items=>({...items,[project.id]:value}))} onSend={send} expertOptions={appConfig.composerExpertOptions} expertVisualKeys={appConfig.composerExpertVisualKeys} />}>
      <div className="space-y-5" role="log" aria-live="polite">
        {Array.from({length:state.stage},(_,i)=>i+1).map(stage=><div key={stage}>
          <ConversationFlow hideUserMessage={stage===2 && (state.formSubmitted ?? Boolean(state.messages[1]?.startsWith("已确认分析条件")))} scene={diagnosisScene(project.id,stage,state)} identity={appConfig.identity} experts={appConfig.experts} onOpenArtifact={onOpenArtifact} renderProductBlock={block=>block.type==="follow-up-suggestions"?<section aria-label="后续建议"><RecommendationList items={reportRecommendation} arrowDirection="down-left" onSelect={item=>send(item.content)} /></section>:null} assistantSupplement={<>
            {stage===1&&(!state.running||state.stage>1)&&<div className="mt-5 space-y-4">
            <p className="text-sm leading-6">分析信息还不够明确，需要你补充几个关键信息，我好帮你落地。</p>
            <Clarification state={state} onChange={update} onSubmit={()=>update({stage:2,formSubmitted:true,progress:0,running:true,messages:[state.messages[0],`已确认分析条件：${Object.entries(state.clarification).filter(([key])=>["scenario","focus","basis","industry","overall","management","professional","strategic"].includes(key)).map(([key,value])=>`${fieldLabels[key]}：${value||"无"}`).join("；")}`]})} />
          </div>}
          </>} />
        </div>)}
      </div>
    </ConversationSurface>;

}
const scenarios=[{name:"业务扩张",description:"侧重核心岗分位提升、人才引进预算测算"},{name:"稳健运营",description:"侧重内外公平平衡、人力成本管控"},{name:"收缩优化",description:"排查低价值岗位降本与冗余薪酬，锁定性价比偏低人群"}];
function Clarification({state,onChange,onSubmit}:{state:Diagnosis;onChange:(change:Partial<Diagnosis>)=>void;onSubmit:()=>void}) {
  const scenarioId = useId();
  const [reviewStep, setReviewStep] = useState(1);
  const step=state.formStep??1;
  const values=state.clarification;
  const set=(key:string,value:string)=>onChange({clarification:{...values,[key]:value}});
  if(state.stage>1) {
    const keys=reviewStep===1?["scenario","focus"]:["basis","industry","overall","management","professional","strategic"];
    return <section aria-label="已提交的澄清表单" className="max-w-[600px] overflow-hidden rounded-xl border bg-card shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b p-3"><h3 className="text-base font-medium">{reviewStep}/2 {reviewStep===1?"选择业务场景":"选择人群与定位目标"}</h3><span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Check className="size-3.5 text-primary"/>已提交</span></div>
      <dl className="space-y-4 p-3">{keys.map((key,i)=><div key={key}><dt className="text-sm text-muted-foreground">{i+1}、{fieldLabels[key]}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{values[key]||"未补充"}</dd></div>)}</dl>
      <nav aria-label="澄清表单分页" className="flex items-center justify-between gap-3 border-t p-3"><Button variant="outline" size="sm" disabled={reviewStep===1} onClick={()=>setReviewStep(1)}><ChevronLeft className="size-4"/>上一步</Button><span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">{reviewStep} / 2</span><Button variant="outline" size="sm" disabled={reviewStep===2} onClick={()=>setReviewStep(2)}>下一步<ChevronRight className="size-4"/></Button></nav>
    </section>;
  }
  return <section className="max-w-[600px] overflow-hidden rounded-xl border bg-card shadow-xs">
    <button className="flex w-full items-center justify-between gap-3 p-3 text-left text-base font-medium transition-colors hover:bg-muted/50" aria-expanded={!state.collapsed} onClick={()=>onChange({collapsed:!state.collapsed})}>{step}/2 {step===1?"选择业务场景":"选择人群与定位目标"}{state.collapsed?<ChevronDown className="size-4"/>:<ChevronUp className="size-4"/>}</button>
    {!state.collapsed&&<div className="space-y-4 border-t p-3">{step===1?<>
      <FieldSet><FieldLegend variant="label">1、选择业务场景模版</FieldLegend><RadioGroup aria-label="业务场景模版" value={values.scenario} onValueChange={v=>set("scenario",String(v))}>{scenarios.map((item,index)=><FieldLabel key={item.name} htmlFor={`${scenarioId}-${index}`}><Field orientation="horizontal"><FieldContent><FieldTitle>{item.name}{item.name==="业务扩张"&&<Badge>推荐</Badge>}</FieldTitle><FieldDescription>{item.description}</FieldDescription></FieldContent><RadioGroupItem id={`${scenarioId}-${index}`} value={item.name} aria-label={item.name}/></Field></FieldLabel>)}</RadioGroup></FieldSet>
      <label className="block text-sm font-medium">2、补充关注点（可选）<Input className="mt-2" placeholder="请输入" value={values.focus} onChange={e=>set("focus",e.target.value)}/></label>
      <Button onClick={()=>onChange({formStep:2})}>下一步</Button>
    </>:<>
      <Choices label="1、薪酬口径" value={values.basis} options={["年度现金总收入","标准薪酬"]} onChange={v=>set("basis",v)}/>
      <div><label className="mb-2 block text-sm font-medium" id="industry-label">2、行业类别</label><Select value={values.industry||null} onValueChange={v=>set("industry",String(v??""))}><SelectTrigger aria-labelledby="industry-label" className="w-full"><SelectValue placeholder="请选择"/></SelectTrigger><SelectContent>{["高科技行业","制造行业","家电行业","全行业"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
      {["overall","management","professional","strategic"].map((key,i)=><Choices key={key} label={`${i+3}、${fieldLabels[key]}`} value={values[key]} options={["P10","P25","P50","P75","P100"]} onChange={v=>set(key,v)}/>)}
      {!values.industry&&<p className="text-xs text-muted-foreground">请选择行业类别后提交。</p>}
      <div className="flex gap-2"><Button variant="outline" onClick={()=>onChange({formStep:1})}>上一步</Button><Button disabled={!values.industry} onClick={onSubmit}>提交</Button></div>
    </>}</div>}
  </section>;
}
function Choices({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(value:string)=>void}) {
  return <fieldset><legend className="mb-3 text-sm font-medium">{label}</legend><RadioGroup aria-label={label} value={value} onValueChange={v=>onChange(String(v))} className="flex flex-wrap gap-x-4 gap-y-3">{options.map(option=><label key={option} className="flex cursor-pointer items-center gap-2 text-sm"><RadioGroupItem value={option}/>{option}</label>)}</RadioGroup></fieldset>;
}
