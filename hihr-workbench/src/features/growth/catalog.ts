/**
 * 成长计划页面的内容层：按发展主题准备的课程库、案例库、挑战任务与多岗历练模板，
 * 以及从已确认条件生成页面内容、随周期 / 目标岗位变化对齐内容的逻辑。
 * 全部为前端预设示例，不代表已报名课程、已安排岗位或真实案例业绩。
 */
import { employeePerformance, person } from "@/features/hr/data";
import { targetPositions, type Plan, type TargetDirection } from "./data";

export type TopicKey = "ai" | "strategy" | "data" | "scale" | "ux" | "solution" | "insight" | "delivery" | "people";
export type LearningItem = {
  id: string; kind: "course" | "case"; title: string; focus: string; topic: TopicKey;
  summary: string; reason: string; hours: number; startDay: number; endDay: number; source: string;
  libraryId?: string; manual?: boolean;
};
export type ExperienceItem = { id: string; kind: "challenge" | "rotation"; title: string; detail: string; startDay: number; endDay: number; manual?: boolean };
export type Mentoring = { mentor: string; method: string; frequency: string; measures: string };
export type GrowthPage = { target: string; days: number; learning: LearningItem[]; experience: ExperienceItem[]; mentoring: Mentoring };

type LibraryEntry = { id: string; kind: "course" | "case"; topic: TopicKey; title: string; summary: string; hours: number; source: string };
type TopicContent = {
  label: string;
  goal: string; verify: string;
  courses: Omit<LibraryEntry, "id" | "kind" | "topic" | "source">[];
  cases: Omit<LibraryEntry, "id" | "kind" | "topic" | "source">[];
  challenge: { title: string; detail: string };
};

const COURSE_SOURCE = "企业学习平台 · 课程库";
const CASE_SOURCE = "内部标杆案例库";

export const topics: Record<TopicKey, TopicContent> = {
  ai: {
    label: "AI 产品",
    goal: "能为一个业务场景定义 AI 能力边界、价值指标与上线验证方式",
    verify: "一份 AI 场景方案及试点效果复盘",
    courses: [
      { title: "AI 产品经理核心方法", summary: "场景识别、能力边界、人机协作流程与风险控制", hours: 3 },
      { title: "大模型应用评测与迭代", summary: "构建评测集、定义质量指标，持续迭代提示与流程", hours: 2 },
    ],
    cases: [{ title: "智能客服从试点到全量的效果评估", summary: "重点观察：如何定义解决率与满意度指标，如何判断可以扩大试点", hours: 1 }],
    challenge: { title: "AI 场景落地实战", detail: "在当前负责的产品中选定 1 个 AI 辅助场景，完成能力边界定义、评测集搭建与小范围试点，输出试点复盘。" },
  },
  strategy: {
    label: "产品战略",
    goal: "能把业务目标转化为可讨论的产品路线图，并说明优先级取舍依据",
    verify: "一份半年产品路线图及决策说明",
    courses: [
      { title: "产品战略与路线图规划", summary: "从业务目标推导产品方向，路线图分层表达与优先级取舍", hours: 3 },
      { title: "产品组合管理与资源配置", summary: "多产品线价值评估、投入产出分析与组合调整", hours: 2 },
    ],
    cases: [{ title: "从业务问题到产品路线图", summary: "重点观察：路线图如何对齐业务目标，评审中如何回应取舍质疑", hours: 1 }],
    challenge: { title: "产品路线图规划实战", detail: "为当前负责的产品线梳理未来 2 个季度的路线图，明确业务目标、优先级取舍与资源假设，并在部门评审中汇报。" },
  },
  data: {
    label: "数据验证",
    goal: "能对一个产品需求提出假设、指标和验证方法，并用结果支持决策",
    verify: "一份需求验证方案及结果复盘",
    courses: [
      { title: "产品指标体系与实验设计", summary: "北极星指标拆解、A/B 实验设计、样本与显著性判断", hours: 3 },
      { title: "数据分析驱动产品决策", summary: "从数据发现问题、归因分析到形成可执行建议", hours: 2 },
    ],
    cases: [{ title: "AI 产品试点效果评估", summary: "重点观察：如何设定对照组与评估周期，如何处理指标冲突", hours: 1 }],
    challenge: { title: "数据驱动决策实战", detail: "为一个在研需求定义成功指标与验证方法，搭建效果追踪看板，完成一次数据复盘并据此调整后续优先级。" },
  },
  scale: {
    label: "规模化推广",
    goal: "能把一次成功实践提炼为可复用的推广方法，并推动多团队落地",
    verify: "一份推广方案与推广复盘清单",
    courses: [
      { title: "产品推广与变革管理", summary: "推广节奏设计、关键干系人管理与阻力应对", hours: 2 },
      { title: "产品增长与运营策略", summary: "用户分层、增长杠杆识别与运营活动设计", hours: 2 },
    ],
    cases: [{ title: "从单团队试点到多团队推广", summary: "重点观察：推广前需要沉淀哪些标准件，如何评估推广后的使用质量", hours: 1 }],
    challenge: { title: "试点到推广实战", detail: "选择一项已验证的功能或方案，制定推广计划并推动至少 2 个团队落地，沉淀推广清单与复盘结论。" },
  },
  ux: {
    label: "用户体验",
    goal: "能独立规划一轮用户研究，并把洞察转化为体验策略",
    verify: "一份用户研究报告及体验改进方案",
    courses: [
      { title: "用户研究方法与洞察提炼", summary: "访谈、可用性测试与问卷设计，洞察归纳与优先级", hours: 3 },
      { title: "体验策略与设计系统", summary: "体验度量、设计原则沉淀与设计系统治理", hours: 2 },
    ],
    cases: [{ title: "企业应用体验度量体系建设", summary: "重点观察：体验指标如何与业务指标关联", hours: 1 }],
    challenge: { title: "用户研究专项实战", detail: "围绕一条核心业务流程组织 6–8 场用户访谈与可用性测试，输出洞察报告并推动 2 项体验改进上线。" },
  },
  solution: {
    label: "解决方案",
    goal: "能诊断客户需求并设计覆盖业务、产品与实施的整体方案",
    verify: "一份客户方案及评审意见",
    courses: [
      { title: "客户需求诊断与价值主张", summary: "客户访谈、痛点分级与价值主张画布", hours: 2 },
      { title: "解决方案架构与售前方法", summary: "方案结构、实施路径与投入测算", hours: 2 },
    ],
    cases: [{ title: "行业客户数字化方案复盘", summary: "重点观察：方案如何平衡标准产品与定制需求", hours: 1 }],
    challenge: { title: "客户方案设计实战", detail: "参与 1 个客户需求诊断，独立完成方案初稿与实施路径，并通过方案评审。" },
  },
  insight: {
    label: "业务洞察",
    goal: "能用经营数据解释业务表现，并提出有依据的改进方向",
    verify: "一份经营分析专题报告",
    courses: [
      { title: "经营分析与业务洞察", summary: "经营指标体系、驱动因素拆解与专题分析方法", hours: 3 },
      { title: "业务建模与流程分析", summary: "业务流程建模、关键节点识别与改进机会评估", hours: 2 },
    ],
    cases: [{ title: "业务指标异动分析专题", summary: "重点观察：如何从异动定位到业务原因并形成行动建议", hours: 1 }],
    challenge: { title: "经营分析专题实战", detail: "选定一项核心业务指标，完成季度经营分析专题，向业务负责人汇报结论与改进建议。" },
  },
  delivery: {
    label: "项目统筹",
    goal: "能统筹跨部门项目的目标、节奏、资源与风险",
    verify: "一份项目计划及里程碑复盘",
    courses: [
      { title: "跨部门项目管理实务", summary: "项目范围、里程碑、干系人沟通与风险管理", hours: 3 },
      { title: "敏捷交付与协同机制", summary: "迭代节奏、跨团队依赖管理与交付度量", hours: 2 },
    ],
    cases: [{ title: "跨部门重点项目群协同", summary: "重点观察：项目群如何建立统一节奏与升级机制", hours: 1 }],
    challenge: { title: "跨部门项目群实战", detail: "主导 1 个覆盖产品、研发、运营的跨部门项目，建立协同机制与沟通计划，按里程碑通过评审。" },
  },
  people: {
    label: "团队管理",
    goal: "能为小团队设定目标、分配任务并给出成长反馈",
    verify: "一份团队目标与成员发展记录",
    courses: [
      { title: "从骨干到团队负责人", summary: "角色转变、目标设定、授权与绩效沟通", hours: 3 },
      { title: "教练式辅导与人才培养", summary: "辅导对话方法、成长计划制定与反馈技巧", hours: 2 },
    ],
    cases: [{ title: "新任团队负责人的前 90 天", summary: "重点观察：如何建立团队节奏与信任，如何处理首次绩效沟通", hours: 1 }],
    challenge: { title: "团队目标管理实战", detail: "带领 2–3 人的虚拟小组完成一项季度目标，负责任务拆解、过程辅导与成员反馈。" },
  },
};

export const topicOf = (focus: string): TopicKey =>
  /AI/i.test(focus) ? "ai"
  : /战略|规划|组合|路线/.test(focus) ? "strategy"
  : /数据|验证|指标|效果|建模|分析/.test(focus) ? "data"
  : /推广|增长|运营/.test(focus) ? "scale"
  : /用户|体验/.test(focus) ? "ux"
  : /客户|方案|诊断/.test(focus) ? "solution"
  : /洞察|经营|业务/.test(focus) ? "insight"
  : /项目|交付|统筹|资源|协调/.test(focus) ? "delivery"
  : "people";

/** 课程库与案例库：供生成默认内容与「添加」对话框搜索 */
export const library: LibraryEntry[] = (Object.entries(topics) as [TopicKey, TopicContent][]).flatMap(([topic, content]) => [
  ...content.courses.map((course, i) => ({ ...course, id: `course-${topic}-${i}`, kind: "course" as const, topic, source: COURSE_SOURCE })),
  ...content.cases.map((item, i) => ({ ...item, id: `case-${topic}-${i}`, kind: "case" as const, topic, source: CASE_SOURCE })),
]);

const rotations: Record<TargetDirection, { title: string; detail: string }[]> = {
  "同二级序列方向": [
    { title: "需求管理通道历练", detail: "加入需求管理专项，参与需求基线管理、场景需求建模与需求池运营，熟悉需求管理通道的关键活动要求。" },
    { title: "数据产品团队短期轮岗", detail: "到数据产品团队参与一个指标体系建设项目，补齐数据口径定义与效果追踪的实操经验。" },
  ],
  "跨二级序列方向": [
    { title: "业务分析岗位轮岗", detail: "到业务分析团队轮岗，参与月度经营分析与专题研究，熟悉业务分析岗位的工作方法与交付标准。" },
    { title: "客户一线驻场历练", detail: "随客户成功团队驻场一个重点客户，直接参与需求诊断与问题处理，积累一线业务理解。" },
  ],
  "管理发展方向": [
    { title: "代理项目负责人", detail: "在直属上级指导下代理一个中型项目的负责人，承担目标设定、资源协调与项目复盘。" },
    { title: "跨团队协调人历练", detail: "担任跨团队周例会协调人，负责议题收集、决策跟进与问题升级，熟悉团队管理的日常机制。" },
  ],
};

export const mentoringMethods = ["辅导沟通", "方案点评", "案例共研", "阶段复盘"];
export const mentoringFrequencies = ["每周 1 次", "每两周 1 次", "每月 1 次", "每季度 1 次"];
export const supervisor = person.supervisor;
export const mentoringTip = `辅导带教仅设 1 位导师。已按汇报关系自动带出直属上级「${supervisor}」作为导师，可直接修改，不支持新增或删除。`;

/** 目标岗位的发展重点（最多 3 项），来自澄清表单中实际选中的岗位 */
export function pageFocus(plan: Plan) {
  return (targetPositions.find(p => p.name === plan.conditions.targetRole)?.focus ?? "目标岗位能力、实践验证与成果复盘").split(/[、与]/).filter(Boolean).slice(0, 3);
}
export const learningBudget = (plan: Plan) => plan.conditions.days / 7 * plan.conditions.hours;
const roundHalf = (value: number) => Math.max(0.5, Math.round(value * 2) / 2);
const phase = (index: number, total: number, days: number) => ({
  startDay: Math.floor(index * days / total) + 1,
  endDay: Math.max(Math.floor(index * days / total) + 1, Math.floor((index + 1) * days / total)),
});

function generateLearning(plan: Plan): LearningItem[] {
  const focuses = pageFocus(plan);
  const { days, targetRole } = plan.conditions;
  const items: LearningItem[] = [];
  focuses.forEach((focus, i) => {
    const topic = topicOf(focus);
    const content = topics[topic];
    const window = phase(i, focuses.length, days);
    const course = content.courses[0];
    items.push({ id: `course-${i}`, kind: "course", topic, focus, title: course.title, summary: course.summary, hours: course.hours, ...window,
      reason: `为${targetRole}所需的${content.label}能力建立方法基础。`, source: COURSE_SOURCE, libraryId: `course-${topic}-0` });
    if (i < 2) {
      const sample = content.cases[0];
      items.push({ id: `case-${i}`, kind: "case", topic, focus, title: sample.title, summary: sample.summary, hours: sample.hours, ...window,
        reason: `与课程「${course.title}」互补，借鉴同类问题的实际处理过程。`, source: CASE_SOURCE, libraryId: `case-${topic}-0` });
    }
  });
  // 默认安排不超过学习预算的 60%，留出整理与复习时间
  const total = items.reduce((sum, item) => sum + item.hours, 0);
  const ceiling = learningBudget(plan) * 0.6;
  return total > ceiling ? items.map(item => ({ ...item, hours: roundHalf(item.hours * ceiling / total) })) : items;
}

function generateExperience(plan: Plan): ExperienceItem[] {
  const focuses = pageFocus(plan);
  const { days, direction } = plan.conditions;
  const challenges = focuses.map((focus, i) => ({ id: `challenge-${i}`, kind: "challenge" as const, ...topics[topicOf(focus)].challenge, ...phase(i, focuses.length, days) }));
  const list = rotations[direction] ?? rotations["同二级序列方向"];
  const rotation = list.map((item, i) => ({ id: `rotation-${i}`, kind: "rotation" as const, ...item,
    startDay: Math.max(1, Math.floor(days * (i === 0 ? 0.1 : 0.55))), endDay: Math.floor(days * (i === 0 ? 0.5 : 0.95)) }));
  return [...challenges, ...rotation];
}

export function defaultMentoring(): Mentoring {
  return {
    mentor: `${supervisor}（直属上级）`,
    method: "辅导沟通",
    frequency: "每月 1 次",
    measures: "导师与员工每月开展一对一辅导，聚焦当月 1–2 项挑战任务及重要项目，分析解决过程、总结经验与待改进点，同时提供策略指导、资源协调及风险预警。",
  };
}

export function createPage(plan: Plan): GrowthPage {
  return { target: plan.conditions.targetRole, days: plan.conditions.days, learning: generateLearning(plan), experience: generateExperience(plan), mentoring: defaultMentoring() };
}

/** 读取当前计划的页面内容：周期变化时按比例重排时间，目标岗位变化时重新生成默认内容并保留手工添加项 */
export function reconcilePage(plan: Plan): GrowthPage {
  const page = plan.page;
  if (!page) return createPage(plan);
  const { days, targetRole } = plan.conditions;
  const scale = <T extends { startDay: number; endDay: number }>(item: T): T => {
    if (page.days === days) return item;
    const map = (day: number) => Math.max(1, Math.min(days, Math.ceil(day * days / page.days)));
    return { ...item, startDay: map(item.startDay), endDay: Math.max(map(item.startDay), map(item.endDay)) };
  };
  if (page.target !== targetRole) {
    const fresh = createPage(plan);
    return { ...fresh, mentoring: page.mentoring,
      learning: [...fresh.learning, ...page.learning.filter(item => item.manual).map(scale)],
      experience: [...fresh.experience, ...page.experience.filter(item => item.manual).map(scale)] };
  }
  return { ...page, days, learning: page.learning.map(scale), experience: page.experience.map(scale) };
}

/** 对话中「增加实践任务」：追加一条尚未安排的主题挑战任务 */
export function withExtraChallenge(plan: Plan): GrowthPage {
  const page = reconcilePage(plan);
  const used = new Set(page.experience.map(item => item.title));
  const next = (Object.values(topics).map(content => content.challenge)).find(item => !used.has(item.title));
  if (!next) return page;
  return { ...page, experience: [...page.experience, { id: `challenge-extra-${Date.now()}`, kind: "challenge", ...next, ...phase(1, 2, plan.conditions.days) }] };
}
/** 对话中「更轻量」：学习用时减半，保留条目与时间安排 */
export function withLighterLearning(plan: Plan): GrowthPage {
  const page = reconcilePage(plan);
  return { ...page, learning: page.learning.map(item => ({ ...item, hours: roundHalf(item.hours / 2) })) };
}

// —— 分析与发展方向 ——
const feedbackSource = `${employeePerformance.period}主管反馈`;
export function analysis(plan: Plan) {
  const target = plan.conditions.targetRole;
  return {
    strengths: [
      { title: "从业务问题出发推动产品落地", evidence: `${feedbackSource}：能够从真实业务问题出发推进产品落地`, meaning: `可作为${target}所需的复杂需求规划与方案取舍的基础。` },
      { title: "主动推进跨团队协作", evidence: `${feedbackSource}：跨团队协作主动`, meaning: "可支撑多方需求对齐、资源协同与方案推广。" },
      { title: "目标达成稳定", evidence: `${employeePerformance.period}绩效 ${employeePerformance.rating}，目标完成率 ${employeePerformance.completion}%`, meaning: "具备承担更大范围目标的执行基础。" },
    ],
    improvements: [
      { title: "数据验证与效果评估", evidence: `${feedbackSource}：下一阶段建议进一步提升数据验证能力`, meaning: "需要建立假设、指标、验证与复盘的闭环，用数据支撑关键决策。" },
      { title: "规模化推广", evidence: `${feedbackSource}：建议提升规模化推广能力`, meaning: "需要把单点成功沉淀为可复用的方法，推动更多团队落地。" },
    ],
  };
}

export function directionFocus(plan: Plan) {
  return pageFocus(plan).map(focus => {
    const topic = topicOf(focus);
    const backed = topic === "data" || topic === "scale";
    return {
      focus, topic, priority: backed ? "高" : "中",
      relation: topic === "data" ? "主管建议提升数据验证能力" : topic === "scale" ? "主管建议提升规模化推广能力" : `与${plan.conditions.targetRole}的岗位要求相关，具体标准待确认`,
      goal: topics[topic].goal, verify: topics[topic].verify,
    };
  });
}

export function phasePath(plan: Plan) {
  const days = plan.conditions.days;
  return [
    { title: "建立方法", text: "完成重点课程与案例研读，明确各挑战任务的目标与衡量方式" },
    { title: "应用验证", text: "在挑战任务和多岗历练中应用所学，阶段性接受导师点评" },
    { title: "复盘沉淀", text: "整理验证结果与推广经验，形成可复用的方法与成果材料" },
  ].map((item, i) => ({ ...item, ...phase(i, 3, days) }));
}


// —— 日期换算：页面按「第几天」存储，展示为日历日期 ——
export function dayToDate(plan: Plan, day: number) {
  const date = new Date(`${plan.start}T12:00:00`);
  date.setDate(date.getDate() + day - 1);
  return date;
}
export function dateToDay(plan: Plan, date: Date) {
  const start = new Date(`${plan.start}T12:00:00`);
  const target = new Date(date); target.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000) + 1;
}

/** 成长计划的五个步骤：章节标题与吸顶目录共用同一套名称 */
export const steps = [
  { key: "analysis", title: "优劣势分析" },
  { key: "direction", title: "确定发展方向" },
  { key: "learning", title: "配置学习计划" },
  { key: "practice", title: "配置实践计划" },
  { key: "mentoring", title: "辅导带教安排" },
] as const;
export type StepKey = typeof steps[number]["key"];
