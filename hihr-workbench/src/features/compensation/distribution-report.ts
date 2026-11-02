import noteStyles from "./report-notes.css?raw";
import { reportChartTemplate } from "./report-chart-templates";
import headerBackground from "@/assets/distribution-report/d1435.png?inline";
import infoIcon from "@/assets/distribution-report/7aef2.svg?inline";
import alertIcon from "@/assets/distribution-report/a54c0.svg?inline";
import selectArrow from "@/assets/distribution-report/448be.svg?inline";
import arrowIcon from "@/assets/distribution-report/e5d43.svg?inline";
import warningIcon from "@/assets/distribution-report/63904.svg?inline";
import stylesheet from "./distribution-report.css?raw";

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const departments = [
  ["研发中心", "32", "0.86", "2", "14", "普遍偏低", "low"],
  ["产品经理部", "67", "0.91", "2", "4", "偏高", "high"],
  ["数质管理部", "35", "0.94", "0", "0", "合理", "fair"],
  ["制造中心", "35", "0.93", "2", "5", "需关注", "attention"],
  ["供应链管理部", "56", "0.84", "5", "4", "严重偏高", "severe"],
  ["合计", "451", "0.93", "12", "32", "", "total"],
];
const series = ["研发", "研发", "制造", "产品", "质量", "人资", "供应链"];
const grades = ["P4", "P5", "P2", "P3", "P4", "P5", "P3"];
const counts = [12, 32, 34, 12, 34, 34, 34];
const ratios = ["0.86", "0.86", "0.87", "0.89", "0.92", "0.94", "0.86"];
const gaps = ["1.4%", "1.4%", "−3.3%", "−3.3%", "−3.3%", "−3.3%", "−3.3%"];
const conclusion = "薪酬竞争力偏弱：43.5% 员工于 90%-100% 的 CR 区间（近红），整体流失险高；薪毛比偏高，全岗位薪酬不可行，应优先稳心岗位。";
const rootCause = "建议对 P3-P5 研发序列 CR<0.95 的 42 人实施定向调薪，平均调幅 8%-12%，战略岗位拉看到 P75 预算约 240 万。";
const suggestion = "CR>1.1 的 96 人（占 19.4%）建议冻结调薪，其中 CR>1.2 的 22 人建议列入岗位轮换计划。";

function heading(title: string) {
  return `<h2 class="section-title">${escape(title)}<img src="${infoIcon}" width="16" height="16" alt="" title="基于当前分析范围的预设诊断指标" contenteditable="false"></h2>`;
}
function alert(text: string) {
  return `<div class="diagnosis-alert"><img src="${alertIcon}" width="16" height="16" alt="提示" contenteditable="false"><p>${escape(text)}</p></div>`;
}
function notes() {
  return `<div class="analysis-notes"><section class="note conclusion"><h3>结论</h3><p>${escape(conclusion)}</p></section><section class="note"><h3>根因分析</h3><p>${escape(rootCause)}</p></section><section class="note"><h3>优化建议</h3><p>${escape(suggestion)}</p></section></div>`;
}
function table(headers: string[], rows: string[][], className = "", attributes: string[] = []) {
  return `<div class="table-scroll" tabindex="0" aria-label="${escape(headers.join("、"))}明细"><table class="${className}"><thead><tr>${headers.map(label => `<th scope="col">${escape(label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row, i) => `<tr ${attributes[i] ?? ""}>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function gap(value: string, positive = value.startsWith("1")) {
  return `<span class="${positive ? "positive" : "negative"}">${escape(value)}</span>`;
}
function ratioTable(external = false) {
  return table(["序列/岗位", "职级", "人数", `${external ? "外部" : "内部"}CR均值`, "差距"], series.map((item, i) => [
    `${external && (i === 1 || i === 2) ? `<img class="inline-icon" src="${warningIcon}" width="12" height="12" alt="双重偏低">` : ""}${item}`, grades[i], String(counts[i]), ratios[i], gap(gaps[i]),
  ]), "", series.map((item, i) => `data-series="${item}" data-grade="${grades[i]}"`));
}
function filters(items: [string, string, string[]][]) {
  return `<div class="report-filters" contenteditable="false">${items.map(([label, field, options]) => `<label class="filter"><select aria-label="${label}" data-filter="${field}"><option value="">${label}</option>${options.map(option => `<option value="${option}">${option}</option>`).join("")}</select><img src="${selectArrow}" width="12" height="12" alt=""></label>`).join("")}</div>`;
}
function departmentChart() { return reportChartTemplate("department"); }
function heatmap(strategic = false) { return reportChartTemplate(strategic ? "strategic" : "heatmap"); }
function deviationChart() { return reportChartTemplate("deviation"); }
function inversionChart() { return reportChartTemplate("boxplot"); }
const seriesOptions = ["研发", "制造", "产品", "质量", "人资", "供应链"];
function reportSection(title: string, content: string, warning = "", filter = "") {
  return `<section class="analysis-card" aria-label="${escape(title)}">${heading(title)}${warning ? alert(warning) : ""}${filter}${content}${notes()}</section>`;
}
export function distributionReportHtml() {
  const departmentTable = table(["部门", "人数", "内部CR中位", "≥1.15偏高", "≤0.85偏低", "诊断"], departments.map(row => [row[0], row[1], row[2], ...[3, 4].map(index => row[index] !== "0" && row[6] !== "total" ? `<span class="count-link ${index === 4 ? "negative" : "count-high"}">${row[index]}<img src="${arrowIcon}" width="16" height="16" alt=""></span>` : row[index]), row[5] ? `<span class="diagnosis-badge ${row[6]}">${row[5]}</span>` : ""]), "department-table");
  const deviations = table(["岗位", "职级", "最低薪酬员工", "最低薪酬分位值", "最高薪酬员工", "最高薪酬分位值", "差距"], series.map((item, i) => [item, grades[i], "xxx", "26万", "xxx", "26万", gap(gaps[i])]), "deviation-table");
  const pairs = ["17(P4) → 18(P5)", "17(P4) → 18(P5)", "14(P3) → 15(P4)", "14(P3) → 15(P4)", "11(P2) → 13(P3)", "16(P4) → 17(P4)", "13(P3) → 14(P3)", "13(P3) → 14(P3)", "13(P3) → 14(P3)"];
  const inversion = table(["职级对", "P1低职级实薪", "P高职级实薪", "差距"], pairs.map((pair, i) => [pair, "18万", "26万", `<span class="${i > 5 ? "negative" : "warning-text"}">${i > 5 ? "+14%" : i === 1 ? "−.4%" : "−1.4%"}</span>`]));
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>家电事业部全面现金薪酬竞争力分布分析</title><style>${stylesheet}\n${noteStyles}</style></head><body><article class="distribution-report" contenteditable="true" aria-label="可编辑分析报告"><header class="report-header"><img class="header-background" src="${headerBackground}" alt="" contenteditable="false"><div class="header-content"><h1>家电事业部全面现金薪酬竞争力分布分析</h1><p class="report-subtitle">稳健运营模式：侧重内外公平平衡、人力成本管控，要求“对内有公平、对外有竞争力”。</p><div class="overview-grid"><div class="overview-card"><h2>业务场景</h2><p><span class="scenario-badge">稳健运营</span></p></div><div class="overview-card"><h2>目标分位组合</h2><p class="target-tags"><span>P50</span><span>M3</span><span>战略岗 P7</span></p></div><div class="overview-card"><h2>组织绩效得分</h2><p><strong>92</strong> 分</p></div><div class="overview-card"><h2>主动流失率</h2><p><strong>8.7%</strong></p></div><div class="overview-card"><h2>人力成本费用率</h2><p><strong>17.8%</strong></p></div></div></div></header><div class="report-analysis"><nav class="report-tabs" aria-label="分析维度" contenteditable="false"><div role="tablist"><button type="button" role="tab" aria-selected="true" aria-controls="market-analysis" id="market-tab">外部·市场竞争力</button><button type="button" role="tab" aria-selected="false">内部·公平性诊断</button><button type="button" role="tab" aria-selected="false">结构性·薪酬资源倾斜</button></div></nav><main class="report-main" id="market-analysis" role="tabpanel" aria-labelledby="market-tab">${reportSection("部门间薪酬差异", `<div class="chart-table">${departmentChart()}${departmentTable}</div>`)}${reportSection("P序列/岗位×职级-内部CR差异分析", `<div class="chart-table">${heatmap()}${ratioTable()}</div>`, '研发软件/硬件 P4-P5 是热力图最红的“角”——43 人外部 CR ≤ 0.85 集中分布，是公司核心人才流失高发区。', filters([["全部二级序列", "series", seriesOptions], ["全部三级序列", "grade", ["P1", "P2", "P3", "P4", "P5"]], ["全部岗位", "series", seriesOptions]]))}${reportSection("战略性岗位-内部CR差异分析", `<div class="chart-table">${heatmap(true)}${ratioTable(true)}</div>`, "战略岗内部CR均值 0.84，32 人全部低于目标 1.0，是公司核心战略风险。", filters([["全部一级部门", "series", seriesOptions], ["全部二级序列", "grade", ["P1", "P2", "P3", "P4", "P5"]]]))}${reportSection("同岗位偏离例数分析（±30%）", `<div class="chart-table">${deviationChart()}${deviations}</div>`, "战略岗外部CR均值 0.84，32 人全部低于目标 1.0，是公司核心战略风险。")}${reportSection("职级倒挂", `<div class="chart-table inversion-split">${inversionChart()}${inversion}</div>`, "P4→P5 重点关注 2 例显著倒挂，会直接导致 P5 资深员工流失，建议本季度内闭环。", filters([["全部二级序列", "grade", ["P2", "P3", "P4", "P5"]], ["全部三级序列", "series", seriesOptions]]))}</main></div></article></body></html>`;
}
