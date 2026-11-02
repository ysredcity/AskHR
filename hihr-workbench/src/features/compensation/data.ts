import type { ConversationScene, ArtifactTarget } from "@/agent-ui/immersive/contracts";
import { diagnosisDefaults, type Diagnosis } from "./competitiveness";
export type Project = { id: string; title: string; mode: string; favorite: boolean; source?: "askhr" | "compensation"; scenes: ConversationScene[]; diagnosis?: Diagnosis; edits?: Record<string,string> };
export const initialProjects: Project[] = [
  ["家电事业部全面现金薪酬竞争力分析", "组织薪酬"],
  ["显示事业部薪酬结构与内部公平性", "组织薪酬"],
  ["数字科技公司关键岗位市场对标", "组织薪酬"],
  ["研发序列薪酬带宽与分布分析", "组织薪酬"],
  ["高级产品经理薪酬定位分析", "个人薪酬"],
].map(([title, mode], i) => ({ id: `salary-${i}`, title, mode, favorite: i === 0, scenes: [] }));
export const distribution = [54, 72, 62, 88, 70, 96];
export function reportText(title: string) {
  return `# ${title}\n\n统计周期：2026 年第三季度 · 口径：年度全面现金薪酬\n\n## 分析摘要\n当前示例数据覆盖 1,248 人，全面现金薪酬中位值 23.6 万元，市场定位 P50，薪酬预算执行率 96.8%。\n\n## 薪酬竞争力\n研发与数字化岗位的市场竞争更为突出，建议优先核对关键岗位的市场样本、职级匹配与薪酬结构。\n\n## 内部公平性\n按岗位序列、职级及任职年限分组比较，区分绩效、城市与岗位稀缺性带来的合理差异。\n\n## 决策建议\n1. 先校准关键岗位的职责和市场对标口径。\n2. 在预算内比较普调与定向调整两种方案。\n3. 调薪建议进入正式审批前，由 HR 复核个人数据与适用政策。\n\n## 数据说明\n当前报告基于前端示例数据，用于展示分析方式；未接入组织真实薪酬与市场调研数据，不作为实际调薪依据。`;
}
export function analysisScene(id: string, prompt: string, title: string): ConversationScene {
  const target: ArtifactTarget = { type: "file-preview", title, fileName: `${title}.md`, fileType: "Markdown", content: reportText(title) };
  return { id, turns: [{ id: `${id}-turn`, user: { content: prompt }, execution: { status: "completed", summary: "已完成薪酬结构、市场对标与内部公平性分析", duration: "3 秒", steps: ["核对分析范围与数据口径", "比较薪酬分布及岗位市场定位", "汇总决策建议与报告"].map((title, i) => ({ id: `${id}-${i}`, title, status: "completed" })) }, assistant: { content: "已整理薪酬分析报告，包含薪酬分布、市场竞争力、内部公平性及预算建议。\n\n当前使用示例数据；正式决策前，请核对组织范围、统计周期和市场样本。你可以继续指定岗位序列或调整预算假设。", timestamp: "刚刚", attachments: [{ id: `${id}-report`, name: `${title}.md`, size: 4096, target }] } }] };
}

export function isSalaryDiagnosis(message: string) {
  return /分析.*显示事业部|显示事业部.*分析|薪酬竞争力分析|查询显示事业部薪酬情况/.test(message);
}

export function createSalaryProject(message: string, mode: string, source: "askhr" | "compensation"): Project {
  const id = `salary-${crypto.randomUUID()}`;
  const title = message.replace(/\[\[[^\]]+\]\]/g, "").trim().slice(0, 36) || `${mode}分析`;
  const diagnosis: Diagnosis | undefined = mode === "组织薪酬" && isSalaryDiagnosis(message)
    ? { stage: 1, progress: 0, running: true, clarification: { ...diagnosisDefaults, basis: "年度现金总收入" }, messages: [message] }
    : undefined;
  return { id, title, mode, source, favorite: false, diagnosis, scenes: [analysisScene(id, message, title)] };
}
