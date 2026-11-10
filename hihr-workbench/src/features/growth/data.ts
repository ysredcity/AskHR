import type { ConversationScene, ArtifactTarget } from "@/agent-ui/immersive/contracts";
import { person, employeePerformance, development } from "@/features/hr/data";
const qualification = development.find(item => item.category === "任职认证");
export const growthProfile = {
  name: person.name, organization: `${person.department} / ${person.team}`, role: `${person.title} · ${person.level}`, tenure: `入职日期 ${person.date}`,
  performance: `${employeePerformance.period}绩效 ${employeePerformance.rating} · 目标完成率 ${employeePerformance.completion}%`,
  qualification: qualification ? `${qualification.name}：${qualification.detail}` : "任职资格信息待补充",
  evaluation: `${person.name}目前担任${person.department}${person.team}的${person.title}（${person.level}），于 ${person.date} 入职。${employeePerformance.period}绩效为 ${employeePerformance.rating}，目标完成率 ${employeePerformance.completion}%。主管评价：${employeePerformance.feedback} 结合当前“从产品设计到 AI 产品规划”的发展方向，建议围绕数据验证、产品战略与业务洞察、规模化推广安排学习和实践；任职认证进度以“我的发展”记录为准。`,
};
export const growthProfileSummary = `### 个人综合信息

**${growthProfile.name}** · ${growthProfile.organization}

${growthProfile.role} · ${growthProfile.tenure}

- **绩效**：${growthProfile.performance}
- **任职资格**：${growthProfile.qualification}

### 职业发展综合评价

${growthProfile.evaluation}`;
export const profileSteps = ["梳理个人任职与绩效信息", "对照产品经历与技能评价", "归纳发展重点与待澄清条件"];


export const targetDirections = ["同二级序列方向", "跨二级序列方向", "管理发展方向"] as const;
export type TargetDirection = typeof targetDirections[number];
export const targetPositions = [
  { name: "资深产品经理 P7", direction: targetDirections[0], recommended: false, reason: "衔接当前高级产品经理P6与AI产品规划发展方向，重点提升数据验证、产品战略和规模化推广能力。", focus: "产品战略、数据验证与规模化推广" },
  { name: "AI 产品经理 P7", direction: targetDirections[0], recommended: true, reason: "衔接当前从产品设计到AI产品规划的发展方向，结合产品落地与跨团队协作优势，深化AI场景规划和效果验证能力。", focus: "AI场景规划与产品效果验证" },
  { name: "产品规划专家 P7", direction: targetDirections[0], recommended: false, reason: "强化产品组合规划与业务洞察。", focus: "产品组合规划与业务洞察" },
  { name: "产品运营专家 P7", direction: targetDirections[0], recommended: false, reason: "围绕主管反馈中的数据验证与规模化推广，拓展产品增长和运营策略能力。", focus: "产品增长、运营策略与数据验证" },
  { name: "业务分析专家 P7", direction: targetDirections[1], recommended: true, reason: "发挥业务问题理解与跨团队协作优势，拓展数据分析和经营洞察能力。", focus: "数据分析、经营洞察与业务建模" },
  { name: "用户体验专家 P7", direction: targetDirections[1], recommended: false, reason: "拓展用户研究、体验策略与设计系统能力。", focus: "用户研究与体验策略" },
  { name: "解决方案专家 P7", direction: targetDirections[1], recommended: false, reason: "拓展客户需求诊断与整体方案设计能力。", focus: "客户需求诊断与解决方案设计" },
  { name: "产品团队负责人", direction: targetDirections[2], recommended: true, reason: "以跨团队协作优势为基础，逐步补充目标管理、团队培养及资源协调能力。", focus: "团队目标管理、人才培养与资源协调" },
  { name: "产品部门负责人", direction: targetDirections[2], recommended: false, reason: "面向组织经营与多团队产品战略管理。", focus: "组织经营与多团队战略管理" },
  { name: "项目团队负责人", direction: targetDirections[2], recommended: false, reason: "发展项目统筹、交付管理及团队领导能力。", focus: "项目统筹、交付管理与团队领导" },
];
export const defaultTarget = targetPositions[0];
export const targetPaths = [
  { label: "首要推荐", value: "primary" },
  { label: "同二级序列", value: targetDirections[0] },
  { label: "跨二级序列", value: targetDirections[1] },
  { label: "管理发展通道", value: targetDirections[2] },
] as const;
export type Conditions = { goal: string; targetRole: string; direction: TargetDirection; days: number; hours: number; role: string };
export type Action = { id: string; title: string; detail: string; resource: string; outcome: string; support: string; manual?: boolean };
export type Plan = { page?: import("./catalog").GrowthPage; conditions: Conditions; actions: Action[]; revision: number; start: string };
export type GrowthSession = { clarified?: Conditions; authorization?: "granted" | "declined"; prompt: string; phase: "profile" | "plan"; profileReady: boolean; conditions: Conditions; missing: string[]; plan?: Plan; previous?: Plan; messages: { user: string; answer: string; kind?: "submit" }[]; pending?: Plan; submitting?: boolean; submitStep?: number; submitted?: { plan: Plan; at: string }; running: boolean; progress: number; opened: boolean };
export const growthSteps = ["核对岗位与已有基础", "安排阶段目标与行动", "补充学习资源和导师支持", "检查时间与目标覆盖"];
export const growthQuestions = [
  { id: "growth-light", content: "能帮我把成长计划安排得更轻量一些吗？" },
  { id: "growth-practice", content: "可以帮我增加实践任务吗？" },
  { id: "growth-period", content: "能把计划缩短到60天吗？" },
];
export const isGrowthRequest = (input: string) => /新员工.{0,8}成长计划|制定.{0,8}成长计划|规划入职成长方案/.test(input);
export function parseConditions(input: string, base?: Conditions): Conditions {
  const days = input.match(/(-?\d+(?:\.\d+)?)\s*天/);
  const hours = input.match(/(?:每周|一周)[^\d一二两四-]*?(-?\d+(?:\.\d+)?|一|两|二|四)\s*(?:个)?小时/);
  const numbers: Record<string, number> = { 一: 1, 两: 2, 二: 2, 四: 4 };
  const targetInput = input.match(/(?:目标岗位(?:改为|改成|是|为)?|岗位改为|岗位改成|向|往)\s*([^，。；\n]{2,30}?)(?:发展|[，。；]|$)/);
  const matchedTarget = targetPositions.find(position => input.includes(position.name));
  const directionInput = /管理(?:方向|发展)|往管理|向管理/.test(input) ? targetDirections[2] : /跨二级/.test(input) ? targetDirections[1] : /同二级/.test(input) ? targetDirections[0] : undefined;
  const direction = matchedTarget?.direction ?? directionInput ?? base?.direction ?? defaultTarget.direction;
  const targetRole = matchedTarget?.name ?? (targetInput && !/^(管理方向|管理发展方向|管理)$/.test(targetInput[1]) ? targetInput[1].trim() : undefined) ?? (directionInput ? targetPositions.find(position => position.direction === directionInput && position.recommended)!.name : base?.targetRole ?? defaultTarget.name);
  const customGoal = input.match(/(?:目标改为|目标改成|目标是)\s*([^，。；\n]{2,40})/);
  const role = input.match(/(?:当前岗位是|当前岗位改为|当前岗位改成|我是)\s*([^，。；\n]{2,20})/);
  return { targetRole, direction, goal: customGoal?.[1] ?? (/独立承担/.test(input) ? "独立承担任务" : /提升专项/.test(input) ? "提升专项能力" : base?.goal ?? "适应当前岗位"), days: days ? Number(days[1]) : base?.days ?? 90, hours: hours ? numbers[hours[1]] ?? Number(hours[1]) : base?.hours ?? 2, role: role?.[1] ?? base?.role ?? growthProfile.role };
}
export function createGrowthSession(prompt: string): GrowthSession {
  const conditions = parseConditions(prompt);
  const invalid = !Number.isInteger(conditions.days) || conditions.days < 3 || conditions.days > 365 || conditions.hours <= 0 || conditions.hours > 40;
  return { prompt, phase: "profile", profileReady: false, conditions: invalid ? { ...conditions, days: 90, hours: 2 } : conditions, missing: [!/目标岗位|资深产品经理 P7|AI 产品经理 P7|产品团队负责人/.test(prompt) && "targetRole", !/\d+\s*天/.test(prompt) && "days", !/(每周|一周).{0,12}小时/.test(prompt) && "hours"].filter(Boolean).concat(invalid ? ["days", "hours"] : []).filter((value, index, all) => all.indexOf(value) === index) as string[], messages: [], running: true, progress: 0, opened: false };
}
export const actionTemplates: Action[] = [
  { id: "understand", title: "理解岗位与业务", detail: "结合岗位职责，梳理当前团队的业务流程、关键协作人及交付要求；跟随导师观察一次工作评审。", resource: "学习主题：团队业务资料、岗位职责与协作流程", outcome: "一份岗位业务流程图，与导师核对关键节点", support: "导师待确认 · 每两周一次，核对业务理解" },
  { id: "practice", title: "在指导下完成小任务", detail: "与上级约定一个范围明确的岗位任务，拆解步骤，在指导下完成交付并记录反馈。", resource: "学习主题：岗位方法与团队已有交付案例", outcome: "一份小任务交付成果，按事先约定的标准评审", support: "导师待确认 · 任务中期反馈及成果评审" },
  { id: "deliver", title: "逐步独立交付并复盘", detail: "独立推进一项范围可控的岗位交付，记录问题、处理过程及改进点。", resource: "学习主题：项目复盘方法与问题分析", outcome: "一份交付复盘，与直属上级确认下一阶段重点", support: "直属上级待确认 · 阶段复盘；导师待确认 · 专业支持" },
];
export function buildPlan(conditions: Conditions, actions = actionTemplates): Plan {
  return { conditions, actions: actions.map(a => ({ ...a, detail: `${a.detail} 面向目标岗位${conditions.targetRole}，重点练习${targetPositions.find(position => position.name === conditions.targetRole)?.focus ?? "目标岗位所需能力"}。` })), revision: 1, start: new Date().toLocaleDateString("sv-SE") };
}
export const resourceTopics = [
  { name: "岗位与业务入门", text: "学习主题：岗位职责、团队业务资料与协作流程", type: "课程主题" },
  { name: "需求分析方法", text: "学习主题：问题界定、需求分析与验收标准", type: "课程主题" },
  { name: "团队交付复盘", text: "案例学习：选择团队已有交付案例，梳理方法和改进点", type: "案例主题" },
];
export function phaseRange(index: number, total: number, days: number) {
  return `第 ${Math.floor(index * days / total) + 1}–${Math.floor((index + 1) * days / total)} 天`;
}
export const previewName = "成长计划_预览版.html";
export const finalName = "成长计划_审批稿.html";
export function growthArtifact(id: string): ArtifactTarget {
  return { type: "file-preview", title: previewName, fileName: `${id}.growth.html`, fileType: "HTML", content: id };
}
/** 提交审批后的审批稿：只读快照，审批通过后计划才生效。 */
export function growthFinalArtifact(id: string): ArtifactTarget {
  return { type: "file-preview", title: finalName, fileName: `${id}.final.growth.html`, fileType: "HTML", content: id };
}
export const submitSteps = ["校验计划内容与时间安排", "创建成长计划审批流", "生成只读审批稿", "确认审批状态与生效条件"];
const submitDetails = ["检查各项学习、挑战任务、多岗历练与辅导设置是否完整，时间是否落在计划周期内。", "以当前定稿方案创建审批流，发起人为本人，提交后进入待审批状态。", "固化本次提交审批的计划内容，生成只读审批稿供核对。", "计划审批通过后正式生效，再按生效计划安排学习、实践和辅导提醒；当前尚未生效。"];
export const isSubmitIntent = (input: string) => {
  const text = input.trim();
  return (/提交/.test(text) && !/不|别|暂缓|先不|取消|怎么|如何|吗/.test(text)) || /^(好的?|可以|确认|没问题|同意|行)[。！!～~]?$/.test(text);
};
export const submittedCurrent = (state: GrowthSession) => !!state.submitted && !!state.plan && state.submitted.plan.revision === state.plan.revision;
function baseGrowthScene(id: string, state: GrowthSession): ConversationScene {
  const complete = !!state.plan && !state.running;
  const profiling = state.phase === "profile";
  const initial = complete ? "已将成长目标、学习实践和导师支持整合为一份计划。可以先查看整体安排，再按需要调整。\n\n任职与评价依据来自场景资料，目标、周期和投入以确认条件为准；导师默认为直属上级，辅导尚未预约。" : "补充关键信息后即可生成完整计划，也可以直接采用建议值。";
  const profileDetails = ["核对当前员工的组织、岗位、入职日期，以及“我的绩效”和“我的发展”中的评价与任职认证进度。", "结合主管反馈与当前学习发展记录，区分产品落地、跨团队协作优势与待提升方向。", "将数据验证、产品战略与业务洞察、规模化推广作为待讨论重点，确认目标岗位、周期与可投入时间；不将发展建议视为晋升承诺。"];
  const details = [
    `以当前${state.conditions.role}岗位与目标岗位${state.conditions.targetRole}为对照，核对用户提供的条件；未提供的入职日期与能力等级保持待确认。`,
    `按${state.conditions.days}天划分理解业务、指导实践、独立交付阶段，为每个阶段设置行动、成果与验收方式。`,
    `将学习主题与实践行动关联，学习投入控制在每周${state.conditions.hours}小时；结合导师与上级的支持角色安排阶段反馈，尚未预约或通知。`,
    "检查各阶段是否覆盖计划周期，目标是否对应可检查的成果，输出同一份可查看、编辑的成长计划。",
  ];
  const entries: GrowthSession["messages"] = [{ user: state.prompt, answer: `${growthProfileSummary}\n\n${initial}` }, ...state.messages];
  const canSubmit = complete && !state.pending && !state.submitting && !submittedCurrent(state);
  const submitAsk = state.submitted ? "\n\n计划在提交审批后有新的修改。确认定稿后回复「提交审批」，我会为最新方案重新发起审批；审批通过后才正式生效。" : "\n\n计划确认定稿后，回复「提交审批」即可为成长计划创建审批流。审批通过后计划正式生效，再按计划节点安排提醒与推送。";
  const suggestions = [{ id: "growth-submit", content: state.submitted ? "确认定稿，重新提交成长计划审批" : "确认定稿，提交成长计划审批" }, ...growthQuestions.slice(0, 2)];
  return { id, turns: entries.map((entry, index) => entry.kind === "submit" ? submitTurn(id, state, entry, index, index === entries.length - 1) : ({
    id: `${id}-turn-${index}`, expert: "人才发展专家", user: { content: entry.user },
    execution: {
      status: state.running ? "running" : "completed",
      duration: state.profileReady && profiling ? "约2秒" : complete ? (index === 0 ? "约2秒" : "刚刚") : undefined,
      summary: state.running ? (profiling ? "正在梳理个人信息与发展评价" : "正在制定你的成长计划") : complete ? (index === 0 ? "成长计划已生成" : "已处理本轮调整要求") : "已整理规划条件",
      reasoning: state.running || complete || state.profileReady ? {
        id: `${id}-basis-${index}`,
        content: profiling ? "梳理依据：先核对任职、绩效和资格信息，再结合产品经历与技能评价归纳成长重点。目标岗位、计划周期和学习投入仍需用户选择，因此资料梳理完成后再呈现澄清问题。" : index === 0
          ? `规划依据：以岗位适应为起点，对照目标岗位“${state.conditions.targetRole}”拆解为可执行、可验收的阶段行动；结合${state.conditions.days}天周期及每周${state.conditions.hours}小时投入安排学习与实践。资料不足的部分标记待确认，不推断绩效或能力等级。`
          : "调整依据：核对本轮要求与当前周期、投入及岗位目标的关系；仅更新相关内容，保留手工编辑。涉及方向变化时先确认，无法识别的要求明确说明未应用。",
        running: state.running,
      } : undefined,
      steps: profiling ? profileSteps.map((title, i) => ({ id: `${id}-profile-${i}`, title, detail: profileDetails[i], status: !state.running || i < state.progress ? "completed" as const : i === state.progress ? "running" as const : "pending" as const })) : index === 0 && (state.running || state.plan) ? growthSteps.map((title, i) => ({
        id: `${id}-step-${i}`, title, detail: details[i],
        status: !state.running || i < state.progress ? "completed" : i === state.progress ? "running" : "pending",
        actions: complete && i === growthSteps.length - 1 ? [{ label: previewName, type: "file", target: growthArtifact(id) }] : undefined,
      })) : complete ? [{ id: `${id}-revision-${index}`, title: "核对调整要求与计划状态", detail: entry.answer, status: "completed" }] : [],
    },
    productBlock: canSubmit && index === entries.length - 1 ? { id: `${id}-questions-${index}`, type: "follow-up-suggestions", data: { suggestions: suggestions.map(question => ({ ...question, label: question.content })) } } : undefined,
    assistant: state.running ? undefined : { content: entry.answer + (canSubmit && index === entries.length - 1 ? submitAsk : ""), timestamp: "刚刚", attachments: complete && index === entries.length - 1 ? [{ id: `${id}-plan`, name: previewName, size: 4096, target: growthArtifact(id) }] : undefined },
  })) };
}
export function growthScene(id: string, state: GrowthSession): ConversationScene {
  if (!state.clarified) return baseGrowthScene(id, state);
  const initial = baseGrowthScene(id, { ...state, conditions: state.clarified, phase: "profile", running: false, plan: undefined, messages: [] }).turns[0];
  const authorization: ConversationScene["turns"][number] = {
    id: `${id}-authorization`, expert: "人才发展专家", user: { content: "" },
    execution: { status: "completed", summary: state.authorization ? "已记录数据授权选择" : "需要确认数据授权", steps: [] },
    assistant: { timestamp: "刚刚", content: state.authorization === "granted" ? "已同意授权，将结合敏感信息进行分析，仅用于本次成长计划。" : state.authorization === "declined" ? "未授权敏感信息访问，将仅基于已有档案和已确认条件制定计划。" : "目标岗位与时间安排已确认。接下来需要分析岗位差距并制定成长计划。为使分析更具体，是否允许使用你的敏感信息（会议记录与文档协作数据）？授权仅用于本次成长分析；不同意也可基于已有档案继续。" },
  };
  const continuation = state.authorization ? baseGrowthScene(id, state).turns.map((turn, i) => i === 0 ? { ...turn, id: `${id}-generation`, user: { content: state.authorization === "granted" ? "同意授权并继续" : "仅使用已有档案继续" }, assistant: turn.assistant ? { ...turn.assistant, content: turn.assistant.content.replace(`${growthProfileSummary}\n\n`, "") } : undefined } : turn) : [];
  return { id, turns: [initial, authorization, ...continuation] };
}

function submitTurn(id: string, state: GrowthSession, entry: GrowthSession["messages"][number], index: number, last: boolean): ConversationScene["turns"][number] {
  const running = !!state.submitting && last;
  const step = state.submitStep ?? 0;
  return {
    id: `${id}-turn-${index}`, expert: "人才发展专家", user: { content: entry.user },
    execution: {
      status: running ? "running" : "completed", duration: running ? undefined : "约2秒",
      summary: running ? "正在提交成长计划审批" : "审批流程已创建，等待审批",
      steps: submitSteps.map((title, i) => ({ id: `${id}-submit-${index}-${i}`, title, detail: submitDetails[i],
        status: !running || i < step ? "completed" as const : i === step ? "running" as const : "pending" as const,
        actions: !running && i === 2 ? [{ label: finalName, type: "file" as const, target: growthFinalArtifact(id) }] : undefined })),
    },
    assistant: running ? undefined : { content: entry.answer, timestamp: "刚刚", attachments: [{ id: `${id}-final-${index}`, name: finalName, size: 4096, target: growthFinalArtifact(id) }] },
  };
}

export const growthIntent = {
  prompt: "请帮我制定新员工成长计划", expert: "人才发展专家", skill: "成长计划", source: "我的成长 · 新员工专区",
  snapshot: `## 个人与岗位\n\n规划对象：${growthProfile.name}\n岗位：${growthProfile.role}\n组织：${growthProfile.organization}\n导师与直属上级：待确认\n\n## 关注事项\n\n${growthProfile.tenure}；${growthProfile.performance}；${growthProfile.qualification}\n\n## 建议行动\n\n${growthProfile.evaluation}`,
};
