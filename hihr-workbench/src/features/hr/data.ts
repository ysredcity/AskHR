export const employeeTabs = [
  "个人信息",
  "新员工专区",
  "我的假勤",
  "我的收入",
  "我的绩效",
  "我的发展",
] as const;
export const hallRoles = [
  "员工服务",
  "管理者服务",
  "HR 服务",
  "薪酬 COE 服务",
] as const;
export type Route = "home" | "employee" | "team" | "organization" | "hall" | "tasks" | "service" | "compensation";
// 当前登录用户的前端授权工作区；生产接入时由权限服务提供。
export const authorizedWorkspaces: readonly Route[] = ["employee", "team", "organization"];
export const person = {
  name: "王乐山",
  initials: "乐",
  department: "数字化转型办公室",
  team: "产品与体验组",
  title: "高级产品经理",
  level: "P6",
  number: "HX008629",
  date: "2022-06-20",
  city: "青岛",
  email: "leshan.wang@example.com",
};
export const suggestions = [
  "查一下我的年假余额",
  "帮我请下周五一天年假",
  "分析一下我的工资变化",
  "看看适合我的内部岗位",
];
export const skillCategories = [
  { id: "leave", label: "假勤办理", skills: [
    { name: "假期查询", description: "查询年假余额，了解休假政策与办理规则", prompt: "查一下我的年假余额" },
    { name: "请假申请", description: "根据休假安排准备申请，核对信息后提交", prompt: "帮我请下周五一天年假" },
    {"name": "考勤记录", "description": "查看个人出勤记录，核对异常日期", "prompt": "帮我查看本月考勤记录"},
    {"name": "补卡指引", "description": "了解缺卡处理流程与所需材料", "prompt": "缺卡后如何办理补卡？"},
    {"name": "休假进度", "description": "跟进请假申请的审批状态", "prompt": "帮我查看休假申请的办理进度"},
  ] },
  { id: "income", label: "薪酬福利", skills: [
    { name: "收入分析", description: "对比月度工资，了解收入变化与明细", prompt: "分析一下我的工资变化" },
    { name: "证明办理", description: "申请在职证明或收入证明，跟进办理进度", prompt: "帮我申请收入证明" },
    {"name": "工资明细", "description": "查看当月工资构成与扣款项目", "prompt": "帮我查看本月收入明细"},
    { name: "薪酬智参", description: "查询组织薪酬情况，分析竞争力与内部公平性", prompt: "查询显示事业部薪酬情况" },
    {"name": "社保公积金", "description": "了解社保公积金查询渠道与缴纳口径", "prompt": "如何查询我的社保和公积金缴纳记录？"},
  ] },
  { id: "performance", label: "绩效发展", skills: [
    { name: "绩效回顾", description: "梳理绩效目标、进展与反馈", prompt: "帮我回顾本季度绩效目标与反馈" },
    { name: "发展计划", description: "回顾个人发展计划，明确下一步行动", prompt: "帮我回顾个人发展计划并给出下一步行动" },
    {"name": "目标梳理", "description": "整理阶段目标，明确优先级与衡量标准", "prompt": "帮我梳理下一阶段绩效目标"},
    {"name": "学习规划", "description": "结合发展目标制定学习安排", "prompt": "结合我的发展计划推荐学习安排"},
    {"name": "反馈准备", "description": "整理工作成果，准备绩效沟通要点", "prompt": "帮我准备绩效反馈沟通提纲"},
  ] },
  { id: "jobs", label: "内部机会", skills: [
    { name: "岗位推荐", description: "寻找适合你的内部岗位与发展机会", prompt: "看看适合我的内部岗位" },
    { name: "岗位匹配", description: "分析任职要求，梳理匹配优势与能力差距", prompt: "帮我分析 AI 产品经理岗位的匹配情况" },
    {"name": "机会筛选", "description": "按城市、方向与岗位要求筛选机会", "prompt": "帮我筛选青岛的产品经理内部岗位"},
    {"name": "简历优化", "description": "结合目标岗位梳理个人项目与成果", "prompt": "针对 AI 产品经理岗位给我简历优化建议"},
    {"name": "投递跟进", "description": "查看岗位投递记录与当前进度", "prompt": "帮我查看内部岗位投递进度"},
  ] },
  { id: "team", label: "团队管理", skills: [
    { name: "出勤分析", description: "了解团队出勤情况，定位需要关注的事项", prompt: "帮我分析团队出勤情况" },
    { name: "申请跟进", description: "查看申请状态与待处理事项", prompt: "查询我的申请办理进度" },
    {"name": "审批待办", "description": "集中查看需要处理的团队申请", "prompt": "帮我查看待处理的团队审批"},
    {"name": "异常跟进", "description": "梳理缺卡与加班等需关注的事项", "prompt": "帮我梳理团队出勤异常与跟进建议"},
    {"name": "团队概览", "description": "查看团队成员与组织信息", "prompt": "帮我查看团队成员与组织信息"},
  ] },
] as const;
export const initialTasks = [
  {
    id: "T01",
    title: "确认第三季度绩效反馈",
    type: "绩效反馈",
    due: "今天截止",
    priority: true,
    done: false,
  },
  {
    id: "T02",
    title: "审核陈思的年假申请",
    type: "请假审批",
    due: "10 月 26 日",
    priority: false,
    done: false,
  },
  {
    id: "T03",
    title: "补充住房借款收入证明",
    type: "材料补充",
    due: "10 月 28 日",
    priority: false,
    done: false,
  },
];
export const development = [
  {
    name: "AI 产品设计与实践",
    category: "推荐课程",
    detail: "4 课时 · 海信学堂",
    progress: 25,
  },
  {
    name: "产品战略与业务洞察",
    category: "学习计划",
    detail: "6 课时 · 岗位必修",
    progress: 60,
  },
  {
    name: "高级产品经理任职资格",
    category: "任职认证",
    detail: "已满足 4 / 6 项要求",
    progress: 67,
  },
];
export const onboarding = [
  "认识导师与支持伙伴",
  "完成制度与文化学习",
  "制定试用期目标",
  "完成阶段沟通",
  "提交转正自评",
];
export const jobs = [
  {
    id: "J01",
    title: "AI 产品经理",
    dept: "数字科技公司 · 智能应用部",
    city: "青岛",
    level: "P6–P7",
    type: "内部招聘",
    description:
      "负责企业 AI 智能体产品的规划与落地，连接用户需求、模型能力和业务价值。",
    skills: ["产品规划", "AI 应用", "跨团队协作"],
    match: 94,
  },
  {
    id: "J02",
    title: "用户体验设计专家",
    dept: "集团品牌管理部 · 体验设计中心",
    city: "青岛",
    level: "P6–P8",
    type: "内部推荐",
    description: "构建跨业务的一致体验，推动设计系统和关键业务流程的体验升级。",
    skills: ["交互设计", "设计系统", "用户研究"],
    match: 86,
  },
  {
    id: "J03",
    title: "全球数字化项目经理",
    dept: "国际营销总部 · 数字化中心",
    city: "上海",
    level: "P6–P7",
    type: "海外机会",
    description:
      "推进海外区域数字化项目，协同业务团队交付可衡量的增长与效率成果。",
    skills: ["项目管理", "数字化", "英语沟通"],
    match: 79,
  },
  {
    id: "J04",
    title: "产品团队负责人",
    dept: "智慧生活公司 · 产品中心",
    city: "青岛",
    level: "P7–P8",
    type: "管理岗竞聘",
    description: "负责产品团队建设与产品组合规划，推动业务目标和人才发展。",
    skills: ["团队管理", "产品战略", "业务分析"],
    match: 82,
  },
  {
    id: "J05",
    title: "业务创新专家",
    dept: "集团战略发展部",
    city: "北京",
    level: "P7",
    type: "举贤荐能",
    description: "识别业务创新机会，建立验证路径并推动跨组织试点。",
    skills: ["战略分析", "创新实践", "商业建模"],
    match: 76,
  },
];
export const jobTypes = [
  "全部",
  "内部招聘",
  "举贤荐能",
  "海外机会",
  "管理岗竞聘",
  "内部推荐",
];
export type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  role: number;
  kind: "leave" | "proof" | "team" | "report" | "generic";
  agent?: { expert: string; category: string };
};
export const services: Service[] = [
  { id: "compensation", name: "薪酬智参", description: "组织薪酬分析、辅助决策与洞察报告", category: "薪酬管理", role: 2, kind: "report", agent: { expert: "薪酬专家", category: "income" } },
  {
    id: "leave",
    name: "休假申请",
    description: "查余额、选时间，提交休假申请",
    category: "人事服务",
    role: 0,
    kind: "leave",
  },
  {
    id: "proof",
    name: "在职与收入证明",
    description: "在线申请证明，查看办理进度",
    category: "人事服务",
    role: 0,
    kind: "proof",
  },
  {
    id: "applications",
    name: "我的申请",
    description: "查看已提交事项与审批节点",
    category: "人事服务",
    role: 0,
    kind: "generic",
  },
  {
    id: "housing",
    name: "住房借款",
    description: "申请借款、补充材料与还款",
    category: "薪酬福利",
    role: 0,
    kind: "generic",
  },
  {
    id: "benefit",
    name: "社保公积金",
    description: "查询缴费基数与个人缴费记录",
    category: "薪酬福利",
    role: 0,
    kind: "generic",
  },
  {
    id: "performance",
    name: "绩效申诉",
    description: "查看申诉条件并发起反馈",
    category: "绩效与改进",
    role: 0,
    kind: "generic",
  },
  {
    id: "learning",
    name: "学习与认证",
    description: "课程、任职资格与认证记录",
    category: "学习发展",
    role: 0,
    kind: "generic",
  },
  {
    id: "team",
    name: "团队出勤",
    description: "查看团队出勤、假勤与异常",
    category: "日常管理",
    role: 1,
    kind: "team",
  },
  {
    id: "approval",
    name: "审批中心",
    description: "集中处理待我审批的业务",
    category: "日常管理",
    role: 1,
    kind: "generic",
  },
  {
    id: "recruit",
    name: "人才招聘",
    description: "招聘需求、HC 与候选人进展",
    category: "人才管理",
    role: 1,
    kind: "generic",
  },
  {
    id: "talent",
    name: "人才盘点",
    description: "查看人才分布与发展关注项",
    category: "人才管理",
    role: 1,
    kind: "report",
  },
  {
    id: "idp",
    name: "团队发展与 IDP",
    description: "跟踪发展计划与成员成长",
    category: "人才管理",
    role: 1,
    kind: "generic",
  },
  {
    id: "care",
    name: "团队关怀",
    description: "生日、周年与团队关怀事项",
    category: "日常管理",
    role: 1,
    kind: "generic",
  },
  {
    id: "org",
    name: "组织与岗位",
    description: "组织架构、岗位与职级体系",
    category: "组织管理",
    role: 2,
    kind: "generic",
  },
  {
    id: "people",
    name: "员工全旅程",
    description: "入职、转正、异动与离职业务",
    category: "人员管理",
    role: 2,
    kind: "generic",
  },
  {
    id: "payroll",
    name: "薪酬核算",
    description: "核算进度、明细与异常校验",
    category: "薪酬管理",
    role: 2,
    kind: "report",
  },
  {
    id: "hr-report",
    name: "人力资源报告",
    description: "组织与人员数据分析",
    category: "报表分析",
    role: 2,
    kind: "report",
  },
  {
    id: "design",
    name: "薪酬设计",
    description: "结构、标准与薪酬体系",
    category: "薪酬体系",
    role: 3,
    kind: "generic",
  },
  {
    id: "adjust",
    name: "员工定调薪",
    description: "定薪、调薪申请与档案管理",
    category: "定调薪管理",
    role: 3,
    kind: "generic",
  },
  {
    id: "annual",
    name: "年度调薪",
    description: "计划、规则、方案与下发进展",
    category: "定调薪管理",
    role: 3,
    kind: "report",
  },
  {
    id: "insight",
    name: "薪酬洞察",
    description: "分析结构、识别异常、形成报告",
    category: "洞察与分析",
    role: 3,
    kind: "report",
  },
  {
    id: "bonus",
    name: "奖金与福利",
    description: "激励明细、补贴与查阅配置",
    category: "薪酬体系",
    role: 3,
    kind: "generic",
  },
];
export const teamMembers = [
  { name: "陈思", job: "产品经理", status: "请假", rate: "95.2%", hours: 16 },
  { name: "李明", job: "交互设计师", status: "在岗", rate: "100%", hours: 8 },
  { name: "周悦", job: "前端工程师", status: "缺卡", rate: "95.2%", hours: 24 },
  { name: "孙浩", job: "业务分析师", status: "在岗", rate: "100%", hours: 12 },
  { name: "林静", job: "产品运营", status: "在岗", rate: "100%", hours: 6 },
];
export const policyText = `# 员工休假管理办法\n\n> 员工休假管理办法 · 版本：2026.01。\n\n## 年假与申请\n员工可以在可用余额内申请年假，系统按排班计算休假时长。本年度额度 12 天，已休 4.5 天，可用 7.5 天。\n\n## 办理步骤\n1. 选择假期类型和起止日期。\n2. 填写事由及工作交接人。\n3. 检查草稿并确认提交。\n4. 直属上级审批，结果同步申请记录。\n\n## 说明\n资格、额度与休假规则以有效制度及考勤记录为准。`;
export const incomeText = `# 2026 年 9 月收入明细\n\n| 项目 | 8 月 | 9 月 | 变化 |\n|---|---:|---:|---:|\n| 基本工资 | 18,000 | 18,000 | 0 |\n| 绩效工资 | 4,000 | 3,600 | -400 |\n| 津补贴 | 800 | 800 | 0 |\n| 社保公积金 | -2,860 | -2,860 | 0 |\n| 个税 | -1,240 | -1,160 | +80 |\n| 实发 | 18,700 | 18,380 | -320 |\n\n本月实发减少 320 元，主要来自绩效工资减少 400 元、个税减少 80 元。如需核对，请联系薪酬服务专员。`;
export const teamReport = `# 产品与体验组 · 出勤分析\n\n> 统计周期：2026 年 10 月\n\n## 结论\n团队共 24 人，平均出勤率 97.2%，有 2 项出勤异常待处理。\n\n## 关注事项\n- 周悦有一条缺卡记录，需要确认后补卡。\n- 赵远连续两周加班偏高，建议结合排期沟通。\n\n## 统计口径\n按统计期间应出勤时间计算；请假、补卡与排班以源系统为准。\n\n## 建议动作\n核对异常 → 联系成员 → 确认处理 → 更新团队记录。`;
export function parseLeaveDates(text: string) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  let date: Date | undefined;
  const iso = text.match(/(20\d{2}-\d{2}-\d{2})/g);
  if (iso?.length) return { start: iso[0], end: iso[1] ?? iso[0] };
  const chinese = text.match(/(?:(\d{4})年)?(\d{1,2})月(\d{1,2})[日号]?/);
  if (chinese)
    date = new Date(
      Number(chinese[1] || now.getFullYear()),
      Number(chinese[2]) - 1,
      Number(chinese[3]),
      12,
    );
  else if (/明天/.test(text)) {
    date = new Date(now);
    date.setDate(date.getDate() + 1);
  } else if (/后天/.test(text)) {
    date = new Date(now);
    date.setDate(date.getDate() + 2);
  } else {
    const week = text.match(/(下|本|这)周([一二三四五六日天])/);
    if (week) {
      const offset = "一二三四五六日".indexOf(
        week[2] === "天" ? "日" : week[2],
      );
      date = new Date(now);
      date.setDate(
        now.getDate() -
          ((now.getDay() + 6) % 7) +
          (week[1] === "下" ? 7 : 0) +
          offset,
      );
    }
  }
  if (!date) return undefined;
  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const duration = text.match(/(\d+)\s*天/);
  const end = new Date(date);
  end.setDate(date.getDate() + Math.max(0, Number(duration?.[1] ?? 1) - 1));
  return { start: format(date), end: format(end) };
}

export const employeeHighlights = {
  welcome: { eyebrow: "A NEW CHAPTER", title: "从第一天，连接更多可能", description: "认识团队、了解海信，让每一个入职步骤都有方向。" },
  leave: { eyebrow: "WORK & LIFE", title: "认真工作，也从容休息", description: "查看出勤与假期，安排好工作与生活的节奏。" },
  performance: { eyebrow: "MAKE AN IMPACT", title: "让每一份投入，被看见", description: "回顾目标与成果，在持续反馈中找到下一步突破。" },
};

export const hrExperts = [
  {id: "attendance", label: "假勤专家", visualKey: "office"},
  {id: "compensation", label: "薪酬专家", visualKey: "data"},
  {id: "development", label: "人才发展专家", visualKey: "research"},
  {id: "mobility", label: "人才流动专家", visualKey: "travel"},
  {id: "management", label: "人力管理专家", visualKey: "industry"},
] as const;
export const categoryExperts: Record<string, string> = {
  leave: "假勤专家", income: "薪酬专家", performance: "人才发展专家", jobs: "人才流动专家", team: "人力管理专家",
};
export const employeeExperts: Record<string, string> = {
  "个人信息": "人力管理专家", "新员工专区": "人力管理专家", "我的假勤": "假勤专家", "我的收入": "薪酬专家", "我的绩效": "人才发展专家", "我的发展": "人才发展专家",
};

export const personalRecommendations = [
  {
    id: "performance-review", topic: "绩效回顾", expert: "人才发展专家", source: "第三季度绩效与目标记录",
    title: "绩效回顾要点，已为你整理好",
    description: "结合本季度目标与反馈，准备了一份沟通提纲。要一起完善下一阶段的行动吗？",
    points: ["本季度绩效结果 A，目标完成率 108%。", "反馈亮点：推进业务落地，跨团队协作主动。", "下一步建议：补充数据验证案例，明确推广目标。"],
    action: "完善提纲", prompt: "请结合我的第三季度绩效结果 A、目标完成率 108% 和绩效反馈，完善绩效沟通提纲，并提出下一阶段的行动建议。",
  },
  {
    id: "income-summary", topic: "收入简报", expert: "薪酬专家", source: "2026 年 8–9 月收入明细",
    title: "9 月收入变化，已帮你梳理清楚",
    description: "实发较上月减少 320 元，主要变化来自绩效工资和个税。你可以先看摘要，再决定需要核对什么。",
    points: ["9 月实发 18,380 元，8 月实发 18,700 元。", "绩效工资减少 400 元，个人所得税减少 80 元。", "基本工资、津补贴及社保公积金保持不变。"],
    action: "继续核对", prompt: "请基于 2026 年 8–9 月收入明细，解释实发减少 320 元的构成，并整理我需要向薪酬专员核对的问题。",
  },
  {
    id: "learning-plan", topic: "成长建议", expert: "人才发展专家", source: "个人发展计划与学习记录",
    title: "下一步学习，从 AI 产品实践开始",
    description: "结合你的产品岗位与发展计划，建议先推进「AI 产品设计与实践」，把学习与工作项目连接起来。",
    points: ["「AI 产品设计与实践」共 4 课时，当前完成 25%。", "个人发展方向：从产品设计到 AI 产品规划。", "建议先完成课程，再选一个工作场景形成实践案例。"],
    action: "安排学习", prompt: "请根据我的个人发展计划，为「AI 产品设计与实践」课程（4 课时，已完成 25%）制定接下来两周的学习与项目实践安排。",
  },
] as const;
