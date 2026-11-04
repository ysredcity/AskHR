export const employeeTabs = [
  "个人信息",
  "新员工专区",
  "我的假勤",
  "我的收入",
  "我的绩效",
  "我的发展",
] as const;
export const hallRoles = ["员工自助", "管理者自助", "HR自助"] as const;
export const hallCategories: readonly (readonly string[])[] = [
  ["全部", "人事服务", "薪酬福利", "学习发展", "绩效与改进"],
  ["全部"],
  ["全部", "薪酬管理", "招聘管理", "人事服务", "人才管理"],
];
export const salaryServiceCategories = ["薪酬洞察", "薪酬设计", "定调薪管理", "年度调薪", "定调薪设置", "奖金管理", "福利管理", "报表管理"] as const;
export type Route = "home" | "employee" | "team" | "organization" | "hall" | "tasks" | "service" | "compensation";
// 当前登录用户的前端授权工作区；生产接入时由权限服务提供。
export const authorizedWorkspaces: readonly Route[] = ["employee", "team", "organization"];
export const person = {
  name: "张益达",
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
  agent?: { expert: string; category?: string };
};
export const services: Service[] = [
  {"id": "service-0-0-0", "name": "创意圆桌", "description": "分享创意，参与交流与共创", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "applications", "name": "我的申请", "description": "查看申请进度与审批记录", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-2", "name": "找外部专家", "description": "查找外部专家与专业资源", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-3", "name": "我的招聘", "description": "查看招聘参与事项与进度", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-4", "name": "调档函", "description": "申请调档函与档案转递", "category": "人事服务", "role": 0, "kind": "proof", "agent": {"expert": "人力管理专家"}},
  {"id": "service-0-0-5", "name": "修改个人信息", "description": "维护个人资料与联系信息", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-6", "name": "档案借用", "description": "申请借用个人档案材料", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-7", "name": "权限申请", "description": "申请业务系统访问权限", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "leave", "name": "休假申请", "description": "查询余额并提交休假申请", "category": "人事服务", "role": 0, "kind": "leave", "agent": {"expert": "假勤专家", "category": "leave"}},
  {"id": "service-0-0-9", "name": "试用期目标制定", "description": "制定试用期目标与考核计划", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-10", "name": "落户申请", "description": "提交落户材料与办理申请", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-11", "name": "离职申请", "description": "发起离职流程与工作交接", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "proof", "name": "在职证明", "description": "申请开具在职证明", "category": "人事服务", "role": 0, "kind": "proof", "agent": {"expert": "人力管理专家"}},
  {"id": "service-0-0-13", "name": "收入证明", "description": "申请开具个人收入证明", "category": "人事服务", "role": 0, "kind": "proof", "agent": {"expert": "薪酬专家", "category": "income"}},
  {"id": "service-0-0-14", "name": "员工补卡", "description": "补充缺卡记录与考勤说明", "category": "人事服务", "role": 0, "kind": "generic", "agent": {"expert": "假勤专家", "category": "leave"}},
  {"id": "service-0-0-15", "name": "产假回岗", "description": "办理产假结束回岗手续", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-16", "name": "专家公寓", "description": "申请专家公寓与入住服务", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-17", "name": "户口借用", "description": "申请借用户口相关材料", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-18", "name": "退休申请", "description": "办理退休申请与资料提交", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-19", "name": "出国境申请", "description": "办理因私出国境申请", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-20", "name": "职称申请", "description": "提交职称申报与评审材料", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-0-21", "name": "外部专家引荐", "description": "推荐外部专家与合作资源", "category": "人事服务", "role": 0, "kind": "generic"},
  {"id": "service-0-1-0", "name": "奖金方案申请", "description": "提交奖金方案与发放计划", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-1", "name": "奖金分配申请", "description": "提交奖金分配明细", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-2", "name": "股权收入", "description": "查询股权激励收入记录", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-3", "name": "住房补贴", "description": "申请住房补贴与资格核验", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-4", "name": "交通补贴", "description": "申请交通补贴与资料维护", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-5", "name": "职称补贴", "description": "申请职称补贴与资格核验", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "housing", "name": "住房借款申请", "description": "提交住房借款申请与材料", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-7", "name": "住房借款提前", "description": "办理住房借款提前还款", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-8", "name": "还款申请", "description": "提交借款还款申请", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "service-0-1-9", "name": "住房借款还清申请", "description": "申请借款结清确认", "category": "薪酬福利", "role": 0, "kind": "generic"},
  {"id": "learning", "name": "学习地图", "description": "查看岗位学习路径与课程", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-1", "name": "考试中心", "description": "参与考试并查询成绩", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-2", "name": "数字化专区", "description": "学习数字化知识与技能", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-3", "name": "任职资格学考", "description": "参与任职资格学习与考试", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-4", "name": "标准查询", "description": "查询岗位任职资格标准", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-5", "name": "认证记录", "description": "查看个人资格认证记录", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-6", "name": "成长空间", "description": "管理学习成果与成长记录", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-7", "name": "人才发展助手", "description": "获取个人发展建议与支持", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-8", "name": "我的IDP", "description": "制定并跟进个人发展计划", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-2-9", "name": "外派意向调研", "description": "填报外派意向与个人偏好", "category": "学习发展", "role": 0, "kind": "generic"},
  {"id": "service-0-3-0", "name": "PBC", "description": "制定绩效目标与业务承诺", "category": "绩效与改进", "role": 0, "kind": "generic"},
  {"id": "service-0-3-1", "name": "工作总结", "description": "记录工作成果与阶段总结", "category": "绩效与改进", "role": 0, "kind": "generic"},
  {"id": "service-0-3-2", "name": "绩效结果反馈", "description": "查看并确认绩效反馈", "category": "绩效与改进", "role": 0, "kind": "generic"},
  {"id": "performance", "name": "绩效申诉", "description": "提交绩效异议与申诉说明", "category": "绩效与改进", "role": 0, "kind": "generic"},
  {"id": "service-1-4-0", "name": "在职人员查询", "description": "查询团队在职人员信息", "category": "团队管理", "role": 1, "kind": "team"},
  {"id": "service-1-4-1", "name": "离职/退休员工查询", "description": "查询离职与退休员工档案", "category": "团队管理", "role": 1, "kind": "team"},
  {"id": "service-1-4-2", "name": "后备人才库", "description": "查看后备人才与培养进展", "category": "团队管理", "role": 1, "kind": "team"},
  {"id": "talent", "name": "人才盘点", "description": "盘点团队人才与发展潜力", "category": "团队管理", "role": 1, "kind": "team"},
  {"id": "service-1-4-4", "name": "外部专家查询", "description": "查询外部专家专业信息", "category": "团队管理", "role": 1, "kind": "team"},
  {"id": "service-1-4-5", "name": "团队绩效考核", "description": "管理团队目标与绩效评价", "category": "团队管理", "role": 1, "kind": "team"},
  {"id": "team", "name": "团队考勤", "description": "查看团队出勤与假勤异常", "category": "团队管理", "role": 1, "kind": "team"},
  {"id": "compensation", "name": "组织薪酬洞察", "description": "分析组织薪酬，辅助决策与报告", "category": "薪酬洞察", "role": 2, "kind": "report", "agent": {"expert": "薪酬专家", "category": "income"}},
  {"id": "service-2-5-1", "name": "行业薪酬洞察", "description": "对标行业薪酬与市场趋势", "category": "薪酬洞察", "role": 2, "kind": "report"},
  {"id": "service-2-5-2", "name": "薪酬洞察报告", "description": "查阅薪酬分析结论与报告", "category": "薪酬洞察", "role": 2, "kind": "report"},
  {"id": "service-2-6-0", "name": "定调薪项目", "description": "管理定薪与调薪业务项目", "category": "薪酬设计", "role": 2, "kind": "generic"},
  {"id": "service-2-6-1", "name": "薪酬结构", "description": "配置收入构成与薪酬结构", "category": "薪酬设计", "role": 2, "kind": "generic"},
  {"id": "service-2-6-2", "name": "薪酬标准表", "description": "维护岗位薪酬标准表", "category": "薪酬设计", "role": 2, "kind": "generic"},
  {"id": "service-2-6-3", "name": "薪酬标准系数表", "description": "维护薪酬标准系数表", "category": "薪酬设计", "role": 2, "kind": "generic"},
  {"id": "service-2-6-4", "name": "薪酬标准系数", "description": "配置薪酬标准计算系数", "category": "薪酬设计", "role": 2, "kind": "generic"},
  {"id": "service-2-6-5", "name": "薪酬体系", "description": "维护组织薪酬体系", "category": "薪酬设计", "role": 2, "kind": "generic"},
  {"id": "service-2-7-0", "name": "定调薪档案", "description": "查询员工定调薪档案", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-1", "name": "定调薪档案历史", "description": "追溯员工历次定调薪记录", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-2", "name": "定调薪数据修正记录", "description": "查看薪酬数据修正明细", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-3", "name": "定调薪类型", "description": "维护定薪与调薪业务类型", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-4", "name": "候选人定薪协作", "description": "协同确认候选人定薪建议", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-5", "name": "候选人定薪申请单", "description": "提交并跟进候选人定薪", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-6", "name": "员工定调薪申请单", "description": "提交员工定薪与调薪申请", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-7", "name": "定调薪方案", "description": "编制并管理定调薪方案", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-8", "name": "调薪确认模板配置", "description": "配置调薪结果确认模板", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-9", "name": "管理日常调薪", "description": "处理日常调薪业务", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-10", "name": "管理日常调薪汇总", "description": "汇总日常调薪业务明细", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-11", "name": "日常调薪汇总_总部", "description": "查看总部日常调薪汇总", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-12", "name": "总裁审批单确认提交", "description": "确认并提交总裁审批单", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-13", "name": "定调薪数据同步", "description": "同步定调薪结果与记录", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-7-14", "name": "定调薪数据同步模板", "description": "维护薪酬数据同步模板", "category": "定调薪管理", "role": 2, "kind": "generic"},
  {"id": "service-2-8-0", "name": "年度调薪计划", "description": "制定年度调薪工作计划", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-8-1", "name": "年度调薪方案(下发)", "description": "下发年度调薪方案", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-8-2", "name": "盘点人员明细", "description": "查看调薪盘点人员明细", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-8-3", "name": "业务部门调薪明细", "description": "查看业务部门调薪明细", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-8-4", "name": "年度调薪规则", "description": "配置年度调薪规则", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-8-5", "name": "年度调薪预算", "description": "编制并管理年度调薪预算", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-8-6", "name": "年度调薪方案(分公司)", "description": "管理分公司年度调薪方案", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-8-7", "name": "年度调薪万案(集团)", "description": "管理集团年度调薪方案", "category": "年度调薪", "role": 2, "kind": "generic"},
  {"id": "service-2-9-0", "name": "业务项目类别", "description": "配置薪酬业务项目分类", "category": "定调薪设置", "role": 2, "kind": "generic"},
  {"id": "service-2-9-1", "name": "业务项目", "description": "维护薪酬业务项目", "category": "定调薪设置", "role": 2, "kind": "generic"},
  {"id": "service-2-9-2", "name": "业务数据", "description": "维护薪酬业务基础数据", "category": "定调薪设置", "role": 2, "kind": "generic"},
  {"id": "service-2-9-3", "name": "调薪辅助决策配置", "description": "配置调薪辅助决策规则", "category": "定调薪设置", "role": 2, "kind": "generic"},
  {"id": "service-2-9-4", "name": "序列系数对应薪酬区间", "description": "维护序列系数与薪酬区间", "category": "定调薪设置", "role": 2, "kind": "generic"},
  {"id": "service-2-9-5", "name": "薪酬标准系数", "description": "维护薪酬标准系数设置", "category": "定调薪设置", "role": 2, "kind": "generic"},
  {"id": "service-2-10-0", "name": "激励明细", "description": "查询奖金与激励分配明细", "category": "奖金管理", "role": 2, "kind": "generic"},
  {"id": "service-2-10-1", "name": "奖金角色查询配置", "description": "配置奖金查询角色与范围", "category": "奖金管理", "role": 2, "kind": "generic"},
  {"id": "service-2-11-0", "name": "交通补贴", "description": "管理交通补贴标准与记录", "category": "福利管理", "role": 2, "kind": "generic"},
  {"id": "service-2-11-1", "name": "职称补贴", "description": "管理职称补贴标准与记录", "category": "福利管理", "role": 2, "kind": "generic"},
  {"id": "service-2-11-2", "name": "特殊薪酬项目", "description": "管理特殊薪酬项目与规则", "category": "福利管理", "role": 2, "kind": "generic"},
  {"id": "service-2-12-0", "name": "定调新报表", "description": "查询定调薪统计报表", "category": "报表管理", "role": 2, "kind": "report"},
  {"id": "service-2-12-1", "name": "日常定调薪推送定调薪当啊日志", "description": "查看日常定调薪推送日志", "category": "报表管理", "role": 2, "kind": "report"},
  {"id": "service-2-13-0", "name": "招聘需求提报", "description": "提交岗位招聘需求", "category": "招聘", "role": 2, "kind": "generic"},
  {"id": "service-2-13-1", "name": "招聘需求查询", "description": "查询招聘需求与审批进度", "category": "招聘", "role": 2, "kind": "generic"},
  {"id": "service-2-13-2", "name": "录用进度查询", "description": "跟进候选人录用进度", "category": "招聘", "role": 2, "kind": "generic"},
  {"id": "service-2-13-3", "name": "面试安排", "description": "安排面试时间与参与人员", "category": "招聘", "role": 2, "kind": "generic"},
  {"id": "service-2-13-4", "name": "待确认需求", "description": "处理待确认招聘需求", "category": "招聘", "role": 2, "kind": "generic"},
  {"id": "service-2-13-5", "name": "待激活需求", "description": "激活已准备的招聘需求", "category": "招聘", "role": 2, "kind": "generic"},
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
    id: "pbc-planning", topic: "绩效 PBC 填写", expert: "人才发展专家", source: "2027 年度 PBC 填写通知",
    window: "11 月 2 日–11 月 15 日",
    title: "新一年的目标，从 PBC 开始",
    description: "2027 年度 PBC 填写已开启，请在窗口期内完成个人目标制定与提交，逾期入口将关闭。",
    entry: "PBC 填写", action: "咨询填写要点",
    prompt: "我准备填写 2027 年度 PBC，办理窗口为 11 月 2 日至 11 月 15 日。请结合我的岗位职责，帮我梳理个人目标、衡量标准和填写要点，提交时间以 HR 通知为准。",
  },
  {
    id: "qualification", topic: "任职资格认证", expert: "人才发展专家", source: "第四季度任职资格认证通知",
    window: "11 月 5 日–11 月 20 日",
    title: "任职资格认证，准备好下一步成长",
    description: "第四季度认证申报已开启，完成自评与举证材料准备，认证通过后将纳入任职资格档案。",
    entry: "认证申请", action: "咨询认证规则",
    prompt: "我准备申请第四季度任职资格认证，办理窗口为 11 月 5 日至 11 月 20 日。请帮我了解认证规则、自评填写要求和举证材料清单，办理安排以 HR 通知为准。",
  },
  {
    id: "professional-title", topic: "职称申请", expert: "人才发展专家", source: "年度职称申报通知",
    window: "11 月 10 日–11 月 30 日",
    title: "职称申报开启，让专业积累被看见",
    description: "年度职称申报窗口已开启，请准备业绩成果与申报材料，评审通过后将对接职级评聘。",
    entry: "职称申请", action: "咨询申报要点",
    prompt: "我准备申请年度职称，办理窗口为 11 月 10 日至 11 月 30 日。请帮我梳理申报条件、业绩成果与材料清单，并指导填写，具体要求以 HR 通知为准。",
  },
] as const;
