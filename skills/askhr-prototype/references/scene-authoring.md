# 对话场景写法

新增或修改对话场景、执行过程、澄清表单、产物时读本文件。通用规则（L1/L2/L3、澄清上限、状态语言）见 [pangea-baseline.md](pangea-baseline.md)。

## 目录

- [动手前先写场景说明](#动手前先写场景说明)
- [场景放在哪里](#场景放在哪里)
- [普通场景的写法](#普通场景的写法)
- [产物类型](#产物类型)
- [复杂流程：以薪酬诊断为例](#复杂流程以薪酬诊断为例)
- [自查清单](#自查清单)

## 动手前先写场景说明

新增场景属于较大改动，先给用户一段说明，确认后再写代码。说明需要覆盖：

| 字段 | 说明 |
| --- | --- |
| 入口 | 首页发送、历史对话、页面 Copilot、服务大厅召唤、薪酬智参中的哪一个或几个 |
| 触发提示词 | 用户输入什么会进入这个场景（`trigger.patterns`） |
| 专家与上下文 | 指定哪个专家；带入哪些技能、来源、数据快照 |
| 各轮执行步骤 | 每轮的 L1 摘要与 L3 步骤；只有「先规划、再分头执行、最后汇总」的长链路才用 L2 |
| 答案 | 每轮回复正文要点 |
| 业务卡 | 是否有产品块（如请假卡 `hr-leave`、确认卡、推荐追问） |
| 产物 | 名称、类型、内容来源 |
| 是否自动打开 | 每个产物是否在生成后自动打开右侧面板 |
| 澄清字段 | 是否需要澄清；字段、步数、默认值、推荐项 |
| 用户下一步与结束条件 | 推荐追问、确认动作，以及到哪一步场景结束 |

## 场景放在哪里

| 类型 | 位置 |
| --- | --- |
| 普通对话场景 | `components/agent-layout/conversation-data.ts` 的 `conversationScenes` |
| 场景中引用的产物数据 | `components/agent-layout/panel-data.ts` |
| 页面快照触发的分析回复 | `features/hr/business-intent.ts` 的 `createPanoramaScene`（按快照生成，不需要逐个写场景） |
| 首页推荐、专家、服务目录 | `features/hr/data.ts` |
| 多阶段业务流程（薪酬诊断） | `features/compensation/` |

数据与呈现分离：示例数据只写在数据文件里，不内嵌在 JSX 中。

## 普通场景的写法

```ts
// conversation-data.ts
export const conversationScenes: Record<string, ConversationScene> = {
  myScene: {
    trigger: { type: "keyword", patterns: ["专属动词短语"] },
    ...makeScene(
      "用户的第一句话",
      "智能体的回复正文（Markdown）",
      someArtifactTarget,               // 可选：从 panel-data.ts 引入
      { id: "card", type: "hr-leave" }, // 可选：产品块
    ),
  },
};
```

- `makeScene` 生成单轮场景：两步执行过程（核对范围 + 读取结果）、回复正文、可选的附件和产品块。多轮或复杂执行过程直接写 `turns` 数组，字段类型见 `agent-ui/script-engine/types.ts`。
- `trigger` 是子串匹配、最长命中优先：
  - 用专属的动词短语，不用「出差」「费用」这类宽泛词。
  - 不同场景的触发词不能重复，也不能互为子串；`check:scripts` 会拦下。
- 时间戳用 `formatTimestamp()` 或固定的「刚刚」，与现有数据格式一致。
- 回复正文里，影响判断的边界要写清楚（如「额度以考勤记录为准」「当前仅完成分析，尚未执行任何业务操作」）。不得暗示未执行的操作已经完成。

## 产物类型

右侧面板的产物是 `PanelView`（`components/agent-layout/panel-types.ts`）：

| type | 用途 |
| --- | --- |
| `file-preview` | 文档预览；`fileType: "HTML"` 时按 HTML 渲染（薪酬报告），`"Markdown"` 时按 Markdown 渲染 |
| `browser` | 网页预览 |
| `search-results` | 检索结果列表，点结果在面板内导航到 `browser` |
| `image` | 不进右侧面板，用蒙层图片查看器打开 |

- 执行步骤中的「已生成 X」和回复末尾的附件指向**同一个**产物对象。
- 只有用户能实际查看的产物才可点击；内部调用、脚本、接口步骤只做说明，不伪造入口。

## 复杂流程：以薪酬诊断为例

薪酬诊断是多阶段、有表单、有多个产物的流程，作为写法参考：

- 状态与阶段：`features/compensation/competitiveness.ts`（`Diagnosis` 类型、各阶段步骤名、产物名、`diagnosisScene()`）。
- 流程组件：`features/compensation/diagnosis-flow.tsx`（两步澄清表单、提交后分页回看）。
- 项目与触发：`features/compensation/data.ts`；主应用与子应用两个入口通过项目 `source` 区分导航显示，共用同一流程。
- 阶段：初步执行 → 初步结论 + 自动打开战略解码产物 + 两步澄清 → 诊断结果 + 自动打开竞争力分布产物 → 用户确认生成报告 → 两份最终报告（不自动打开）。

新的复杂流程优先复用这套组织方式和现有渲染器，不新建平行的对话组件。具体报告的版式属于业务场景，按对应设计稿实现，本 skill 不做规定。

## 自查清单

- [ ] 场景说明已经用户确认。
- [ ] 数据写在数据文件，JSX 中没有示例数据。
- [ ] 触发词专属、不与其他场景重复或互为子串。
- [ ] 执行过程层级反映真实复杂度，没有硬造 L2。
- [ ] 澄清字段 ≤ 10、按钮 ≤ 3、主按钮 ≤ 1；提交后转只读。
- [ ] 推荐追问 2–4 个，位于回复操作栏下方。
- [ ] 产物是否自动打开与场景说明一致。
- [ ] 写操作有确认；高风险确认卡字段齐全并设置 `awaitingApproval`（写在场景末轮）。
- [ ] `npm run gate` 通过（其中 `check:scripts` 校验场景数据）。
- [ ] 实际走一遍：从说明里的每个入口进入，确认能走到结束条件。
