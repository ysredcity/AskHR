import { coeWorkbookHtml, coeSummaryHtml } from "./final-reports";
import { distributionReportHtml } from "./distribution-report";
import { strategyReportHtml } from "./strategy-report";
import type { ConversationScene, ArtifactTarget } from "@/agent-ui/immersive/contracts";
export type Diagnosis = { stage: 0 | 1 | 2 | 3; progress: number; running: boolean; clarification: Record<string,string>; messages: string[]; opened?: number; formStep?: number; collapsed?: boolean; formSubmitted?: boolean };
export const firstSteps = ["意图识别", "执行薪酬数据查询脚本", "读取组织数据", "调用薪酬分析技能", "生成分析结论及报告"];
export const secondSteps = ["读取组织数据", "校验数据质量", "市场对标", "内部公平性分析", "生成报告"];
export const finalSteps = ["复核诊断口径与分析结论", "整理 COE 工作底稿", "提炼 COE 一页摘要", "生成报告文件"];
export const artifactNames = ["战略解码与组织绩效分析.html", "家电事业部全面现金薪酬竞争力分布分析.html", "COE工作底稿.html", "COE一页摘要.html"];
export const diagnosisDefaults = { organization: "显示事业部", period: "2026 年第三季度", population: "研发与产品序列 · P5–P8", market: "国内高科技与制造行业", city: "青岛", basis: "年度全面现金薪酬", target: "市场 P50", budget: "3%", scenario:"业务扩张",focus:"",industry:"",overall:"P50",management:"P50",professional:"P50",strategic:"P50" };
export const fieldLabels: Record<string,string> = { organization:"分析组织",period:"统计周期",population:"目标人群",market:"对标市场",city:"工作城市",basis:"薪酬口径",target:"目标市场分位",budget:"预算增幅假设",scenario:"业务场景",focus:"补充关注点",industry:"行业类别",overall:"整体分位",management:"M序列分位",professional:"P序列分位",strategic:"战略性岗位分位",feedback:"修改要求" };
export function diagnosisArtifact(index:number, _values:Record<string,string>): ArtifactTarget {
  const name=artifactNames[index];
  const render = [strategyReportHtml, distributionReportHtml, coeWorkbookHtml, coeSummaryHtml][index];
  if (!render) throw new Error(`Unknown diagnosis artifact: ${index}`);
  return {type:"file-preview",title:name,fileName:name,fileType:"HTML",content:render()};
}
export const reportRecommendation = [{id:"generate-diagnosis-report",content:"立即生成薪酬诊断报告"}];
const executionDetails: Record<number, string[][]> = {
  1: [
    ["识别组织薪酬竞争力分析诉求", "定位显示事业部及当前可用分析口径"],
    ["准备组织、周期与薪酬字段查询参数", "运行查询脚本，汇总薪酬记录与组织映射"],
    ["读取岗位序列、职级与组织绩效信息", "关联战略目标与关键岗位，确认初步分析范围"],
    ["载入薪酬分析技能与指标定义", "分析薪酬结构及关键岗位分布，标记待澄清项"],
    ["汇总初步发现与需要补充的分析条件", "生成战略解码与组织绩效分析 HTML 制品"],
  ],
  2: [
    ["按已确认人群与薪酬口径读取记录", "关联岗位、职级、城市与绩效维度"],
    ["检查缺失值、重复记录及异常薪酬值", "核对有效样本和统计口径，整理校验结果"],
    ["匹配所选行业和各序列目标分位", "比较现金薪酬中位值与市场基准，计算竞争力指数"],
    ["按岗位序列、职级和任职年限分组", "核对同组薪酬差异，定位需复核的关键岗位"],
    ["汇总市场竞争力、内部差异及预算建议", "生成全面现金薪酬竞争力分布分析 HTML 制品"],
  ],
  3: [
    ["读取用户确认的分析条件及修改要求", "复核数据口径、诊断结论与建议的一致性"],
    ["归集数据校验、对标结果与预算假设", "编制供薪酬团队复核的 COE 工作底稿"],
    ["提炼关键发现、决策选项与后续行动", "整理 COE 一页摘要，突出核心结论"],
    ["组装两份 HTML 报告并核对文件名称", "输出报告制品卡片，保留按需查看与下载入口"],
  ],
};
export function diagnosisScene(projectId:string, stage:number, state:Diagnosis): ConversationScene {
  const steps=stage===1?firstSteps:stage===2?secondSteps:finalSteps;
  const running=state.stage===stage && state.running;
  const content=stage===1?"已完成显示事业部的初步分析：建议优先关注关键研发岗位的市场竞争力、职级间薪酬分布与内部公平性。已整理战略解码与组织绩效分析。":stage===2?"已完成对显示事业部目标人群的薪酬诊断分析，点击家电事业部全面现金薪酬竞争力分布分析查看内容是否符合您的预期，可以在页面中直接编辑或告诉我改哪里，符合要求后告诉我，我来帮你生成最终的报告。":"已生成**显示事业部薪酬诊断报告**，共生成两个文件，打开报告可直接下载，你也可以告诉我需要改哪里。";
  const indices=stage===1?[0]:stage===2?[1]:[2,3];
  const summary=stage===1?"已完成初步分析，待补充业务场景与目标分位":stage===2?"已完成目标人群诊断，等待确认分析结果":"已生成 COE 工作底稿与 COE 一页摘要";
  const tasks=steps.slice(0,running?state.progress+1:steps.length).map((title,i)=>{
    const active=running&&i===state.progress;
    return {
      id:`${stage}-task-${i}`, title, status:active?"running" as const:"completed" as const,
      summary:"",
      steps:[{
        id:`${stage}-${i}-detail`,title:executionDetails[stage][i].join("，")+"。",
        status:active?"running" as const:"completed" as const,
        actions:stage===1&&i===1?[{label:"薪酬数据查询脚本",type:"script" as const}]:stage===1&&i===3?[{label:"薪酬分析",type:"skill" as const}]:i===steps.length-1&&!running?indices.map(index=>({label:artifactNames[index],type:"file" as const,target:diagnosisArtifact(index,state.clarification)})):undefined,
      }],
    };
  });
  return {id:`${projectId}-stage-${stage}`,turns:[{
    id:`${projectId}-turn-${stage}`,user:{content:state.messages[stage-1]??"分析显示事业部"},
    execution:{status:running?"running":"completed",duration:running?undefined:`${steps.length} 秒`,summary:running?`正在${steps[Math.min(state.progress,steps.length-1)]}`:summary,
      reasoning:stage===3?{id:`${projectId}-report-basis`,content:"依据已确认的业务场景、薪酬口径与目标分位复核诊断结论，并分别整理详细复核底稿和管理决策摘要。"}:undefined,
      steps:[],tasks},
    productBlock:stage===2&&state.stage===2&&!running?{id:`${projectId}-report-recommendation`,type:"follow-up-suggestions",data:{suggestions:reportRecommendation}}:undefined,
    assistant:running?undefined:{content,timestamp:"刚刚",attachments:indices.map(i=>({id:`artifact-${i}`,name:artifactNames[i],size:8192,target:diagnosisArtifact(i,state.clarification)}))},
  }]};
}
