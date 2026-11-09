# 新员工成长计划 Implementation Plan

**Goal:** 在 AskHR 中交付一份可生成、编辑、修订和撤销的成长计划。

**Architecture:** HR Provider 保存会话内计划状态；主对话与 Copilot 复用同一 GrowthFlow，继续使用 ConversationSurface、ConversationFlow、Composer 与现有 file-preview 产物容器。计划按阶段整合目标、实践、资源和辅导。

**Tech Stack:** React、TypeScript、已有 Base UI 基础组件；前端预设数据，无外部请求。

### Task 1: 数据与计划状态
- 新增 `hihr-workbench/src/features/growth/data.ts`：条件解析、阶段模板、计划产物、修订与撤销数据。
- 修改 HR store 保存各会话状态，避免切换模式时丢失。

### Task 2: 共用对话与产物
- 新增 GrowthFlow，复用 ConversationFlow 和 Composer；条件不足时最多三个问题，一次生成。
- 在 ConversationPage、EmployeeCopilot 接入同一流程。
- 在 HRFileBody 接入计划编辑内容，产物键保持稳定。
- 支持自然语言调整、局部编辑、方向修改确认、手工修改保护与最近一次撤销。

### Task 3: 入口
- 新员工专区新增按钮，预填人才发展专家及岗位快照，发送前不执行。
- 首页专属请求触发同一场景。

### Task 4: 验证
- 运行 npm run gate。
- 启动或复用 5174 预览；运行 shoot.mjs。
- 用浏览器验证预填、生成、修订、撤销、模式切换、窄屏与主题。
- 更新 skill 与 CONTEXT，保留既有未提交修改，不提交或推送。
