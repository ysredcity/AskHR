import noteStyles from "./report-notes.css?raw";
import { reportChartTemplate } from "./report-chart-templates";
import headerBackground from "@/assets/distribution-report/d1435.png?inline";
import infoIcon from "@/assets/distribution-report/7aef2.svg?inline";
import stylesheet from "./final-reports.css?raw";

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const executiveFocus = "补差预算原则、战略岗位P75定位范围、研发关键序列优先级，以及季度薪酬风险复盘";
const conclusion = "薪酬竞争力偏弱：43.5% 员工于 90%-100% 的 CR 区间（近红），整体流失险高；薪毛比偏高，全岗位薪酬不可行，应优先稳心岗位。";
const rootCause = "建议对 P3-P5 研发序列 CR<0.95 的 42 人实施定向调薪，平均调幅 8%-12%，战略岗位拉看到 P75 预算约 240 万。";
const optimization = "CR>1.1 的 96 人（占 19.4%）建议冻结调薪，其中 CR>1.2 的 22 人建议列入岗位轮换计划。";
const internalDescription = "全公司内部CR均值 0.92，整体偏低 8%。9 个部门中 4 个落入合理区间，研发中心 0.86（14 人内部CR≤0.85）是最大拖累项，营销中心 1.08（5 人内部CR≥1.15）偏高需复核业绩匹配度。";
const externalDescription = '家电事业部整体定位 P42，低于市场中位 8 个分位；分序列看，P 序列 P40 偏弱、M 序列 P52 贴近市场，呈“专业人才弱、管理者强”的结构倒挂——越高职级越明显（P5 仅 P34）。战略性岗位 P38，反低于普通岗 P42，违反“战略岗应高分位”原则。';
const summaryBackground = "本次摘要面向家电事业部2026年业务发展与核心人才决策，基于COE工作底稿提炼形成。分析覆盖451名员工（P序列428人、M序列23人）、9个部门及软件开发、系统架构、智能制造等32名战略岗位，对标高科技行业994条市场薪酬数据。薪酬口径为年度现金总收入，整体以市场P50为基础定位、战略岗位以P75为目标，重点判断外部人才吸引力、内部公平性及薪酬资源与组织SP/BP定位的匹配程度。";
const riskLabels = ["极高风险", "较高风险", "合理区间", "优势区间", "成本风险"];
const riskTones = ["risk-high", "risk-medium", "risk-fair", "risk-advantage", "risk-cost"];

function documentHtml(title: string, content: string, summary = false) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${stylesheet}\n${noteStyles}</style></head><body><article class="final-report ${summary ? "summary-report" : "workbook-report"}" contenteditable="true" aria-label="可编辑分析报告">${content}</article></body></html>`;
}
function header(summary: boolean) {
  return `<header class="report-cover"><img src="${headerBackground}" class="cover-background" alt="" contenteditable="false"><p class="eyebrow">Hirange Compensation Intelligence · Diagnostic Report</p><h1>${summary ? "家电事业部薪酬竞争力速览 · 2026 H1" : "家电事业部薪酬竞争力 · 2026 H1 体检报告"}</h1><p class="cover-subtitle">稳健运营模式：侧重内外公平平衡、人力成本管控，要求“对内有公平、对外有竞争力”。</p><dl class="metadata">${[["报告编号", "RPT-2026-0602-018"], ["报告时间", "2026.07.12"], ["报告部门", "海信集团·COE薪酬中心"], ["分析办法", "AI组织薪酬诊断模型"]].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></header>`;
}
function title(text: string) { return `<h2 class="section-title">${escape(text)}</h2>`; }
function infoTitle(text: string) { return `<h3 class="diagnosis-title">${escape(text)}<img src="${infoIcon}" alt="" width="16" height="16" contenteditable="false"></h3>`; }
function table(headers: string[], rows: string[][], className = "") {
  return `<div class="table-scroll" tabindex="0" aria-label="${escape(headers.join("、"))}明细"><table class="${className}"><thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function note(label: string, text: string) { return `<section class="note"><h4>${label}</h4><p>${escape(text)}</p></section>`; }
function notes() { return `<div class="notes-grid"><div class="full-width">${note("结论", conclusion)}</div>${note("根因分析", rootCause)}${note("优化建议", optimization)}</div>`; }
function distributionChart(full: boolean, internal = false) { return reportChartTemplate(internal ? "internal-full" : full ? "external-full" : "external-compact"); }
function fairnessChart() { return reportChartTemplate("fairness"); }
function resourceChart(full: boolean) { return reportChartTemplate(full ? "resource-full" : "resource-compact"); }
function riskTable() {
  const labels = ["外部 CR < 50%", "50% ≤ 外部 CR < 80%", "80% ≤ 外部 CR < 100%", "100% ≤ 外部 CR < 120%", "外部 CR ≥ 120%", "合计"];
  return table(["成本细项", "人数", "占比", "等级"], labels.map((label, i) => [escape(label), ["62,800", "62,800", "75,430", "58,920", "81,150", "62,800"][i], ["1.4%", "1.4%", "1.4%", "2.3%", "3.1%", "100%"][i], i === 5 ? "" : `<span class="badge badge-${riskTones[i]}">${riskLabels[i]}</span>`]), "risk-table");
}
function resourceTable() {
  const names = ["研发中心", "产品经理部", "数质管理部", "制造中心", "供应链管理部", "供应链管理部", "供应链管理部"];
  return table(["部门", "部门CR", "偏离公司基准", "诊断"], names.map((name, i) => [name, ["0.86", "0.91", "0.94", "0.93", "0.84", "0.84", "0.84"][i], `<span class="gap-${i < 3 ? "negative" : "positive"}">${["-14pct", "-9pct", "-2pct", "+4pct", "+8pct", "+8pct", "+8pct"][i]}</span>`, `<span class="badge badge-resource-${["low", "below", "fair", "fair", "above", "high", "high"][i]}">${["资源严重不足", "资源不足", "基本一致", "基本一致", "资源略倾斜", "资源明显倾斜", "资源明显倾斜"][i]}</span>`]));
}
function appendix() {
  return `<section class="report-section" id="appendix">${title("附录 · 数据口径与溯源")}<div class="two-columns"><section class="text-panel"><h3>A.1 数据源清单</h3><ul><li>个人薪酬数据库 451人；</li><li>行业报告薪酬数据库 994条；</li><li>海信内部薪酬数据库 994条</li></ul></section><section class="text-panel"><h3>A.2 关键计算口径</h3><ul><li>CR（Compa Ratio）=个人年度现金总收入或者薪酬标准 ÷ 同序列同职级的目标薪酬区间（如：P50）；</li><li>分位（Percentile）=个人年度现金总收入或者薪酬标准在市场分布中所处位置；</li><li>薪酬资源倾斜率 = 部门战略岗 CR 中位 ÷ 部门普通岗CR中位；</li></ul></section></div></section>`;
}
function workbookDiagnosis(titleText: string, description: string, chart: string, details: string) {
  return `<section class="diagnosis-card">${infoTitle(titleText)}<p class="diagnosis-description">${escape(description)}</p><div class="chart-and-table">${chart}${details}</div>${notes()}</section>`;
}
export function coeWorkbookHtml() {
  const contents = [["第一章 · 分析背景", "1.1 业务场景｜1.2 分析对象", "background"], ["第二章 · 薪酬诊断", "2.1 外部竞争力｜2.2 内部公平性｜2.3 结构性问题", "diagnosis"], ["第三章 · 风险洞察及优化建议", "3.1 风险表现｜3.2 优化建议", "risks"], ["附录 · 数据口径与溯源", "A.1 数据源｜A.2 计算口径", "appendix"]];
  return documentHtml("COE工作底稿", `${header(false)}<section class="report-section" id="background">${title("报告目录")}<nav class="contents text-panel" aria-label="报告目录" contenteditable="false">${contents.map(([label, detail, id]) => `<a href="#${id}"><strong>${label}</strong><span>${detail}</span></a>`).join("")}</nav>${title("第一章 · 分析背景")}<section class="text-panel"><h3>1.1 分析背景及目的</h3><p>基于公司年度薪酬策略，AI 将当前策略匹配为“稳健运营”模型：核心述，关注内外公平、人力成本双重约束。本次诊断选取全公司内外分位占比 50%，人力成为 30%，保留与留存 20%。</p></section><section class="text-panel"><h3>1.2 分析对象口径</h3>${table(["参数", "目标分位(P50)"], ["分析单元", "样本规模", "薪酬口径", "目标分位", "对标行业"].map(label => [label, "35.4万"]))}</section></section><section class="report-section" id="diagnosis">${title("第二章 · 薪酬诊断")}${workbookDiagnosis("2.1战略性岗位-外部CR差异分析", externalDescription, distributionChart(true), riskTable())}${workbookDiagnosis("2.2战略性岗位-内部CR差异分析", internalDescription, distributionChart(true, true), riskTable())}${workbookDiagnosis("2.3结构性·薪酬资源倾斜", internalDescription, resourceChart(true), resourceTable())}</section><section class="report-section" id="risks">${title("第三章 · 风险洞察及优化建议")}<div class="two-columns">${note("3.1 风险表现", conclusion)}${note("3.2 优化建议", optimization)}</div></section>${appendix()}`);
}
export function coeSummaryHtml() {
  const cards = [
    ["2.1外部市场竞争力", "外部CR区间人员分布", distributionChart(false)],
    ["2.2内部公平性", "各部门内部CR中位", fairnessChart()],
    ["2.3结构性资源倾斜", "各部门相对公司基准偏离", resourceChart(false)],
  ];
  return documentHtml("COE一页摘要", `${header(true)}<section class="report-section">${title("分析背景")}<div class="text-panel summary-background"><p>${summaryBackground}</p></div></section><section class="report-section">${title("薪酬诊断")}<div class="summary-diagnoses">${cards.map(([label, description, chart]) => `<section class="summary-card"><h3>${label}</h3><p class="diagnosis-description">${description}</p>${chart}${note("高管总结", executiveFocus)}</section>`).join("")}</div></section><section class="report-section">${title("总结建议")}<div class="text-panel decision-panel"><h3>核心判断</h3><p>当前薪酬体系整体健康度中等偏弱，主要矛盾不是全面薪酬不足，而是资源未优先配置到研发关键序列、P3-P5中坚层和战略岗位。若延续现有调薪节奏，将进一步放大核心人才引进与保留风险。</p><h3>优先决策</h3><p>P0：启动P3-P5及战略岗位分类补差，初步预算池约1,260万元，战略岗位专项约280万元，最终按人员去重核定；战略岗位执行CR 1.00-1.05，稀缺岗位对标P75。</p><h3>机制建设</h3><p>P1：将市场分位、同岗偏离与职级倒挂校验嵌入招聘定薪、晋升及年度调薪审批；按月监测六维风险，推动研发中心资源偏离由-14pct收敛至-5pct以内。</p></div><p class="decision-callout"><strong>建议CEO确认事项：</strong><span>${executiveFocus}</span></p></section>${appendix()}`, true);
}
