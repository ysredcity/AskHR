import reviewIcon from "@/assets/strategy-report/review.svg?inline";
import insightsIcon from "@/assets/strategy-report/insights.svg?inline";
import intentIcon from "@/assets/strategy-report/intent.svg?inline";
import actionsIcon from "@/assets/strategy-report/actions.svg?inline";
import downIcon from "@/assets/strategy-report/down.svg?inline";
import upIcon from "@/assets/strategy-report/up.svg?inline";
import stylesheet from "./strategy-report.css?raw";

const strategyItems = [
  "组织扁平化与区域建设：完成1+7区域中心设置及多国业务整合,实现日立商空团队合署办公。",
  "权责划分与海外分支建设：启动营销服与研发制造板块职责定位管理模式试运行。",
  "干部管理与人才梯队建设：完成135人次干部调整及转身评审落地人才盘点与后备遴选。",
  "薪酬绩效与提效机制优化：完成大区总裁及负责人薪酬体系切换与经营奖金制定，上线HIHR薪酬系统。",
];
const strategyCards = [
  { title: "战略回顾", tone: "review", icon: reviewIcon },
  { title: "内外部洞察", tone: "insights", icon: insightsIcon },
  { title: "战略意图", tone: "intent", icon: intentIcon },
  { title: "关键举措", tone: "actions", icon: actionsIcon },
];

type Metric = { label: string; value: string; unit: string; plan?: string; annual?: string; monthly?: string };
const organizationMetrics: Metric[] = [
  { label: "主营业务收入", value: "15.29", unit: "亿", plan: "100.0%", annual: "28.33%" },
  { label: "利润总额", value: "15.29", unit: "亿", plan: "28.33%", annual: "28.33%" },
  { label: "组织绩效得分", value: "15.29", unit: "分", annual: "28.33%" },
];
const efficiencyMetrics: Metric[] = [
  { label: "人均销售收入", value: "708942.80", unit: "元", plan: "28.33%", annual: "28.33%", monthly: "28.33%" },
  { label: "人均核心利润", value: "29533.50", unit: "万", plan: "28.33%", annual: "28.33%", monthly: "28.33%" },
  { label: "薪毛比", value: "15.2", unit: "%", plan: "28.33%", annual: "28.33%", monthly: "28.33%" },
  { label: "人力成本费用率", value: "3.00", unit: "%", plan: "28.33%", annual: "28.33%", monthly: "28.33%" },
  { label: "人力成本总额", value: "22302.12", unit: "万元", plan: "28.33%", annual: "28.33%", monthly: "28.33%" },
];
const turnoverMetrics: Metric[] = [
  { label: "整体流失率", value: "15.29", unit: "万", annual: "28.33%" },
  { label: "主动流失率", value: "15.29", unit: "万", annual: "28.33%" },
  { label: "SA主动流失率", value: "15.2", unit: "%", annual: "28.33%" },
  { label: "被动流失率", value: "15.2", unit: "亿", annual: "28.33%" },
];

function comparison(label: string, value: string | undefined, direction: "up" | "down") {
  return value ? `<div class="metric-comparison"><dt>${label}</dt><dd><span>${value}</span><img src="${direction === "up" ? upIcon : downIcon}" alt="${direction === "up" ? "上升" : "下降"}" width="12" height="12" contenteditable="false"></dd></div>` : "";
}
function metricCard(metric: Metric) {
  return `<div class="metric-card"><h3>${metric.label}</h3><div class="metric-content"><p class="metric-value"><strong>${metric.value}</strong><span>${metric.unit}</span></p><dl class="metric-comparisons">${comparison("计划完成率", metric.plan, "down")}${comparison("同比", metric.annual, "up")}${comparison("环比", metric.monthly, "up")}</dl></div></div>`;
}
function metricSection(title: string, className: string, metrics: Metric[], subtitle = "") {
  return `<section aria-label="${title}"><h2 class="section-title">${title}${subtitle ? `<span class="section-subtitle">${subtitle}</span>` : ""}</h2><div class="metrics-grid ${className}">${metrics.map(metricCard).join("")}</div></section>`;
}

/** A standalone report: embedded icons and styles also travel with the downloaded HTML. */
export function strategyReportHtml() {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>战略解码与组织绩效分析</title><style>${stylesheet}</style></head><body><main class="strategy-report" contenteditable="true" aria-label="可编辑分析报告"><section aria-label="战略解码"><h2 class="section-title">战略解码</h2><div class="strategy-grid">${strategyCards.map(card => `<section class="strategy-card ${card.tone}"><h3 class="strategy-heading"><span class="strategy-icon" contenteditable="false"><img src="${card.icon}" alt=""></span>${card.title}</h3><ol class="strategy-list">${strategyItems.map((item, index) => `<li><span class="list-marker" aria-hidden="true">${index + 1}、</span>${item}</li>`).join("")}</ol></section>`).join("")}</div></section>${metricSection("组织绩效", "organization-grid", organizationMetrics)}${metricSection("人效指标", "efficiency-grid", efficiencyMetrics, "累计非一线")}${metricSection("流失率", "turnover-grid", turnoverMetrics)}</main></body></html>`;
}
