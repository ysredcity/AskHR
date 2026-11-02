import type { PanelView } from "./panel-types";
import { policyText, incomeText, teamReport } from "@/features/hr/data";
export const hrPolicy: PanelView = {
  type: "file-preview",
  title: "员工休假管理办法",
  fileName: "员工休假管理办法.md",
  fileType: "政策",
  content: policyText,
};
export const hrIncome: PanelView = {
  type: "file-preview",
  title: "9 月工资变化分析",
  fileName: "9月收入明细.md",
  fileType: "工资条",
  content: incomeText,
};
export const hrTeam: PanelView = {
  type: "file-preview",
  title: "团队出勤分析",
  fileName: "团队出勤分析.md",
  fileType: "分析报告",
  content: teamReport,
};
export const hrLeave: PanelView = {
  type: "file-preview",
  title: "休假申请单",
  fileName: "休假申请单.hr",
  fileType: "业务表单",
  content: "",
};
export const hrJobs: PanelView = {
  type: "file-preview",
  title: "内部岗位匹配分析",
  fileName: "内部岗位匹配分析.md",
  fileType: "岗位分析",
  content:
    "# 内部岗位匹配分析\n\n## AI 产品经理\n优势：产品规划、内部业务理解与跨团队协作经验。\n\n建议补齐：模型评估方法、AI 数据治理与效果验证案例。\n\n## 建议下一步\n完善一个 AI 产品实践项目，再核对岗位任职要求。投递前需确认职位和简历。",
};
