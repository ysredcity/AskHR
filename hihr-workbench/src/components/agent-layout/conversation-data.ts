import { jobs } from "@/features/hr/data";
export type ExecutionStatus = "completed" | "running" | "waiting";
import type { ArtifactTarget } from "./panel-types";
export type ExecutionActionData = {
  label: string;
  type:
    | "skill"
    | "api"
    | "query"
    | "script"
    | "file"
    | "connector"
    | "knowledge"
    | "web";
  target?: ArtifactTarget;
};

export type ReasoningData = {
  id: string;
  content: string;
  running?: boolean;
};

export type ExecutionStepData = {
  id: string;
  title: string;
  detail?: string;
  status: "completed" | "running" | "pending";
  actions?: ExecutionActionData[];
  reasoning?: ReasoningData;
};

export type ExecutionTaskData = {
  id: string;
  title: string;
  summary: string;
  status: "completed" | "running";
  steps: ExecutionStepData[];
};

export type ExecutionData = {
  status: ExecutionStatus;
  summary: string;
  duration?: string;
  showSummary?: boolean;
  flat?: boolean;
  steps: ExecutionStepData[];
  reasoning?: ReasoningData;
  tasks?: ExecutionTaskData[];
};

/** 用户消息里的本地上传文件，渲染为可打开右侧预览的独立 Attachment */
export type MessageAttachment = {
  id: string;
  name: string;
  size: number;
  target?: ArtifactTarget;
};

/** 智能体交付物附件必须带可打开的预览目标。 */
export type AssistantAttachment = MessageAttachment & {
  target: ArtifactTarget;
};

export type ClarificationOption = { label: string; value: string };
export type ClarificationFieldValue =
  string | string[] | { end: string; start: string };

export type ClarificationField =
  | {
      id: string;
      label: string;
      placeholder?: string;
      required?: boolean;
      type: "text" | "textarea";
    }
  | { id: string; label: string; required?: boolean; type: "date-range" }
  | {
      id: string;
      label: string;
      required?: boolean;
      type: "single-select" | "multi-select";
      options: ClarificationOption[];
    };

export type ClarificationFollowUpData = {
  assistant: AssistantMessageData & { kind: "question" };
  execution: ExecutionData;
  id: string;
};

/** 智能体向用户补齐关键信息时推送的结构化表单。 */
export type ClarificationFormData = {
  defaultOpen?: boolean;
  description?: string;
  fields: ClarificationField[];
  followUp?: ClarificationFollowUpData;
  id: string;
  initialValues?: Record<string, ClarificationFieldValue>;
  submitLabel?: string;
  title: string;
};

/** 产品自定义对话块的中立数据载体；具体渲染由应用配置提供。 */
export type ProductConversationBlock = {
  id: string;
  type: string;
  data?: unknown;
};

export type AssistantMessageData = {
  attachments?: AssistantAttachment[];
  clarification?: ClarificationFormData;
  content: string;
  timestamp: string;
  kind?: "answer" | "question";
};

/** 未指定专家时，智能体侧显示的产品身份 */
export const DEFAULT_AGENT_NAME = "AskHR";

export type ApprovalOutcomeData = {
  execution: ExecutionData;
  assistant: AssistantMessageData;
  /** 审批落地后的产物块（结果卡、后续确认卡等）。审批结果必须留在同一轮，不另起 turn。 */
  productBlock?: ProductConversationBlock;
};

export type ConversationTurnData = {
  id: string;
  /** 确认待决时，rich Flow 以会话状态驱动审批提示、卡片和 Composer 禁用。 */
  awaitingApproval?: boolean;
  approvalOutcomes?: {
    approved: ApprovalOutcomeData;
    rejected: ApprovalOutcomeData;
  };
  /**
   * 这一轮由哪个专家执行。等于指定了子智能体，因此显示在智能体消息开头，
   * 而不是用户消息上；缺省时显示产品身份 `DEFAULT_AGENT_NAME`。
   */
  expert?: string;
  user: {
    /** 可内联的上下文与能力写成 `[[类型:名称]]` 标记，渲染为气泡内的 badge */
    content: string;
    attachments?: MessageAttachment[];
    timestamp?: string;
  };
  execution: ExecutionData;
  assistant?: AssistantMessageData;
  productBlock?: ProductConversationBlock;
};

/** 生成与场景数据一致的时间戳格式，用于新发送的消息 */
export function formatTimestamp(date: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}月${pad(date.getDate())}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * `trigger` 让用户用自然语言进入这个已写场景（新对话首句命中即接管），缺省则只能从侧栏点进来。
 * keyword 是子串匹配、**最长命中优先**，所以不要用「出差」「费用」这类宽泛词——
 * 它们会抢占更精确的场景；跨场景重复或互为子串会被 check-scripts 拦下。
 */
export type ConversationScene = {
  trigger?: { type: "keyword" | "regex"; patterns: string[] };
  turns: ConversationTurnData[];
};

import { hrPolicy, hrIncome, hrTeam, hrLeave, hrJobs } from "./panel-data";
const done = (id: string, title: string): ExecutionStepData => ({
  id,
  title,
  status: "completed",
});
const execution = (summary: string): ExecutionData => ({
  status: "completed",
  summary,
  duration: "1.2 秒",
  steps: [done("check", "核对当前用户与查询范围"), done("read", summary)],
});
function makeScene(
  content: string,
  answer: string,
  target?: ArtifactTarget,
  productBlock?: ProductConversationBlock,
): ConversationScene {
  return {
    turns: [
      {
        id: "turn-1",
        user: { content },
        execution: execution(
          target ? "已整理结果与可查看内容" : "已整理办理建议",
        ),
        assistant: {
          content: answer,
          timestamp: "刚刚",
          attachments: target
            ? [
                {
                  id: "result",
                  name:
                    target.type === "image" ? target.fileName : target.title,
                  size: 2048,
                  target,
                },
              ]
            : undefined,
        },
        productBlock,
      },
    ],
  };
}
export const conversationScenes: Record<string, ConversationScene> = {
  policy: {
    trigger: {
      type: "keyword",
      patterns: ["年假余额", "年假政策", "休假制度"],
    },
    ...makeScene(
      "查一下我的年假余额",
      "你的可用年假为 **7.5 天**，年度额度 12 天，已使用 4.5 天。\n\n可以打开下方政策核对办理步骤，也可以直接告诉我你的休假安排。\n\n> 额度与休假规则以考勤记录及有效制度为准。",
      hrPolicy,
    ),
  },
  leave: {
    trigger: { type: "keyword", patterns: ["帮我请", "申请年假", "休假申请"] },
    ...makeScene(
      "帮我请下周五一天年假",
      "我已准备年假申请草稿。请打开申请单核对日期、事由与交接人，确认后再提交。\n\n> 提交后将进入直属上级审批。",
      hrLeave,
      { id: "leave-card", type: "hr-leave" },
    ),
  },
  income: {
    trigger: {
      type: "keyword",
      patterns: ["工资变化", "工资为什么", "收入明细"],
    },
    ...makeScene(
      "分析一下我的工资变化",
      "9 月实发收入为 **18,380 元**，比 8 月减少 **320 元**。\n\n主要变化：绩效工资减少 400 元，个人所得税减少 80 元。详细项目和计算口径已放在下方明细。\n\n> 如对明细有疑问，可联系薪酬服务专员。",
      hrIncome,
    ),
  },
  team: {
    trigger: { type: "keyword", patterns: ["团队出勤", "出勤分析"] },
    ...makeScene(
      "分析团队出勤并生成关注事项",
      "产品与体验组平均出勤率为 **97.2%**，有 **2 项**需要关注：一条缺卡记录与一项连续加班提醒。\n\n建议先核对异常，再与对应成员沟通。已整理报告，可查看明细与口径。",
      hrTeam,
    ),
  },
  jobs: {
    trigger: {
      type: "keyword",
      patterns: ["内部岗位", "岗位匹配", "适合我的"],
    },
    ...makeScene(
      "看看适合我的内部岗位",
      "结合你的产品规划与内部业务经验，建议重点了解 **AI 产品经理** 岗位。\n\n优势是业务理解和跨团队协作；建议补充模型评估与 AI 产品效果验证案例。匹配分析仅供参考，实际任职条件以职位详情为准。",
      hrJobs,
    ),
  },
  progress: {
    trigger: {
      type: "keyword",
      patterns: ["办理进度", "我的申请", "证明办到"],
    },
    ...makeScene(
      "查询我的申请进度",
      "我可以帮你核对申请记录。请打开“我的申请”查看最新状态；尚未创建的业务不会显示为已提交。",
      undefined,
      {
        id: "applications-link",
        type: "hr-navigation",
        data: { service: "applications", label: "查看我的申请" },
      },
    ),
  },
};
export function createDraftScene(
  content: string,
  _expert?: string,
  attachments?: MessageAttachment[],
): ConversationScene {
  const text = content.trim();
  if (/调休|病假|产假|半天/.test(text))
    return makeScene(
      text,
      "当前填单入口支持整天年假。这项安排需要确认假期类型、时间段与适用规则，不能直接套用年假草稿。可以先从服务大厅咨询或查看假勤页面。",
      undefined,
      {
        id: "leave-guidance",
        type: "hr-navigation",
        data: { route: "hall", label: "查看服务大厅" },
      },
    );
  let selected: ConversationScene | undefined;
  if (/请假|年假申请|调休/.test(text)) selected = conversationScenes.leave;
  else if (/工资|薪酬|收入/.test(text) && !/证明/.test(text))
    selected = conversationScenes.income;
  else if (/年假|假期|政策|制度/.test(text))
    selected = conversationScenes.policy;
  else if (/出勤|缺卡|考勤/.test(text)) selected = conversationScenes.team;
  else if (/岗位|职位|投递|机会/.test(text)) selected = conversationScenes.jobs;
  else if (/证明/.test(text))
    return makeScene(
      text,
      "可以申请在职证明或收入证明。请在申请页选择类型、填写用途并确认，提交后可在“我的申请”查看办理进度。",
      undefined,
      {
        id: "proof-link",
        type: "hr-navigation",
        data: { service: "proof", label: "申请证明" },
      },
    );
  else if (/进度|申请记录/.test(text)) selected = conversationScenes.progress;
  else if (/报告|分析/.test(text))
    return makeScene(
      text,
      "已准备分析范围与口径核对材料。以下报告聚焦团队出勤情况。若要分析其他业务，请补充数据来源与指标。",
      hrTeam,
    );
  else if (/发展|学习|课程|绩效/.test(text))
    return makeScene(
      text,
      "建议先明确本阶段目标，再选择学习与实践动作。\n\n1. 梳理当前岗位要求与已有成果。\n2. 选择一个可衡量的实践项目。\n3. 与上级约定反馈时间。\n\n可以打开员工自助查看对应学习、绩效与发展内容。",
      undefined,
      {
        id: "employee-link",
        type: "hr-navigation",
        data: { route: "employee", label: "进入员工自助" },
      },
    );
  if (selected === conversationScenes.jobs) {
    const job = jobs.find((j) => text.includes(j.title));
    if (job) {
      const target: ArtifactTarget = {
        type: "file-preview",
        title: `${job.title} · 匹配分析`,
        fileName: `${job.title}匹配分析.md`,
        fileType: "岗位分析",
        content: `# ${job.title} · 岗位匹配分析\n\n部门：${job.dept}\n\n岗位要求：${job.skills.join("、")}。\n\n## 建议\n结合产品规划、用户体验与数字化项目经验梳理相关成果，重点核对该岗位对${job.skills[0]}的要求。\n\n投递前请完善简历并确认具体职位。`,
      };
      return makeScene(
        text,
        `已按 **${job.title}** 整理岗位要求与经验核对建议。岗位来自${job.dept}，请打开分析查看详细要求；匹配建议供职业发展参考。`,
        target,
      );
    }
  }
  if (selected) {
    return {
      ...selected,
      turns: selected.turns.map((turn, i) =>
        i === 0 ? { ...turn, user: { content: text, attachments } } : turn,
      ),
    };
  }
  return makeScene(
    text,
    "这项业务还需要进一步确定办理范围。请补充**具体事项和希望完成的结果**，例如“开收入证明”或“修改联系电话”。\n\n你可以查询年假政策、发起请假申请、了解收入变化、分析团队出勤或寻找内部岗位，其他服务可先从服务大厅查找。",
    undefined,
    {
      id: "hall-link",
      type: "hr-navigation",
      data: { route: "hall", label: "查看服务大厅" },
    },
  );
}
