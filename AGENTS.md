# AGENTS.md

本仓库是 **AskHR** 企业人资 AI 工作台的交互原型（前端工程在 `hihr-workbench/`）。在这里做任何页面、交互、样式、主题、对话场景或发版工作前，先按 skill 执行：

**[`skills/askhr-prototype/SKILL.md`](skills/askhr-prototype/SKILL.md)**

- 支持 skill 的工具：加载 `askhr-prototype`。
- 不支持 skill 的工具：先读上面的 `SKILL.md`，再按其中「按任务读取」表只读当前任务需要的 `references/` 文件。

## 速记

1. 纯前端预设数据，不接后端、不引入请求库或状态管理库。
2. 业务页面触发 AI：打开 Copilot 预填上下文，用户发送后才执行。
3. 主对话、Copilot、薪酬智参共用同一套对话与产物组件。
4. 颜色只用语义 Token；Glass 样式写在 `liquid-glass.css`，选择器挂在 `:root[data-askhr-appearance="glass"]` 下，经典主题不受影响。
5. 不恢复 `references/do-not-restore.md` 中的已撤回方向。
6. 改完在 `hihr-workbench/` 下跑 `npm run gate`；涉及界面时用 `scripts/shoot.mjs` 截图自检。
7. 新决策：规则写进 skill，原因与经过写进 `CONTEXT.md`。
8. 不替用户 commit / push / 发版，除非用户明确要求。
