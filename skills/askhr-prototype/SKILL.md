---
name: askhr-prototype
description: 在 AskHR / HiHR 企业人资 AI 工作台原型（HR-Portal 仓库、hihr-workbench 工程）中继续迭代时使用：新增或修改首页、服务大厅、我的成长、团队洞察、HR数据运营、待办、薪酬智参页面，新增对话场景或产物，调整 Copilot、Composer、产物面板、导航，修改经典或 Liquid Glass 主题样式，以及交付验证和发版。只要用户在这个仓库里提到页面、交互、组件、样式、主题、玻璃、场景、截图检查、版本或 Release，即使没有提到 skill，也应使用。不用于从零新建其他产品（那种情况用 pangea-design-ai）。
metadata:
  version: 0.3.0
---

# AskHR Prototype

AskHR 是企业人资 AI 工作台的桌面端交互原型：一个 React 工程（`hihr-workbench/`），包含 AskHR 主应用和逻辑子应用「薪酬智参」，前端预设数据驱动。本 skill 固化它的产品结构、交互规则、主题配方和交付流程，供后续增量迭代使用。

**事实源分工**：

- 本 skill：**当前**规则与做法。
- 代码：组件 API、数据契约、实际数值。规则与代码冲突时，先按代码现状理解，再向用户确认是否要改。
- `CONTEXT.md`（仓库根目录）：决策**历史**、原因、撤回经过、变更记录。
- 冲突优先级：用户当前指令 > 本 skill > 代码现状 > 旧文档（`docs/`、`hihr-workbench/docs/` 中的早期方案）。

## 铁律

1. **纯前端预设数据**：不接后端、不引入请求库或状态管理库，不做鉴权与持久化。
2. **业务页面触发 AI 只预填、不执行**：打开右侧 Copilot，带入专家、技能、来源和数据快照，用户点发送后才执行。
3. **对话与产物组件只有一套**：主对话、Copilot、薪酬智参复用同一套组件和数据，不复制出第二套实现。
4. **颜色只用语义 Token**，不写裸 hex / rgb；Glass 样式写在 `liquid-glass.css`，选择器一律挂在 `:root[data-askhr-appearance="glass"]` 下，经典主题保持不受影响。
5. **主题改动不改布局逻辑**：组件只为样式补 `data-slot` 挂钩属性。
6. **不恢复已撤回方向**：动手前对照 [do-not-restore.md](references/do-not-restore.md)；用户提出的需求命中清单时，先说明历史结论，等用户确认后再做。
7. **界面用真实业务语言**：不出现「原型演示」「演示数据」之类字样；原型边界只写在文档里。
8. **未接通的入口可以不跳转**：不为了「每个都能点」补业务弹窗或假流程。
9. **「恢复上一版」只撤回对应改动**，不回退其他业务成果。
10. **在用户自己的分支上工作，不合并 main**：commit、push、合并、发版都只在用户明确要求时做，也不主动提醒或建议这些操作。

## 按任务读取

只读当前任务需要的文件，不要通读 references。

| 任务 | 必读 | 主要改动位置 |
| --- | --- | --- |
| 理解产品结构、导航、入口 | [product-map.md](references/product-map.md) | — |
| 新增 / 修改业务页面或 Tab | product-map + [interaction-rules.md](references/interaction-rules.md) | `features/hr/views.tsx`、`panorama*.ts(x)`、`data.ts` |
| 页面触发 AI、Copilot、专家与上下文 | interaction-rules | `features/hr/store.tsx`、`business-intent.ts`、`employee-copilot.tsx` |
| 新增 / 修改对话场景、执行过程、澄清、产物 | [scene-authoring.md](references/scene-authoring.md) + [pangea-baseline.md](references/pangea-baseline.md) | `components/agent-layout/conversation-data.ts` |
| 经典主题的布局、按钮、卡片、响应式 | [visual-system.md](references/visual-system.md) | 对应组件、`workspace-layout.ts` |
| Liquid Glass 主题样式 | [glass-theme.md](references/glass-theme.md) | `features/appearance/liquid-glass.css` |
| 找文件 | [file-map.md](references/file-map.md) | — |
| 分支、验证、提交、发版 | [release.md](references/release.md) | — |

路径均相对 `hihr-workbench/src/`，除非另有说明。

## 改动流程

1. **了解现状**：读 `CONTEXT.md` 顶部「当前基线」，跑 `git status`，确认当前分支，不覆盖未提交的他人改动。
2. **判断改动大小**：
   - 样式、文案、单点交互微调：直接改。
   - 新增页面、新增 Tab、新增对话场景、改变入口或信息结构：先用几行说明结构（放在哪、入口、专家与上下文、步骤与产物、与现有规则的关系），等用户确认后再写代码。
3. **确认分支**：每位用户固定一个个人分支 `user/<名字>`，所有需求都在上面改，不为每个需求新开分支。当前在个人分支就直接工作；在 `main` 上时切到该用户的个人分支，没有就创建（不知道名字时问一次）。分支规则见 [release.md](references/release.md#分支)。
4. **改代码**：按上表的 reference 和文件改；新增的玻璃表面、`data-slot` 挂钩按 glass-theme.md 的写法。
5. **验证**：
   - `cd hihr-workbench && npm run gate`（lint、Token、场景、askhr 规则检查、TypeScript、构建）。
   - 涉及界面时，启动 dev server 后运行截图脚本自检，至少看改动涉及的主题和宽度：`node ../skills/askhr-prototype/scripts/shoot.mjs --only <页面>`（用法见 release.md）。
   - 交互改动还要实际走一遍相关链路：主应用发送、页面预填 Copilot、历史会话打开、产物打开与关闭、窄窗口、主题切换。
6. **自动启动预览**：每次改动代码后都要保证预览可用，不需要用户另外提出。
   - 先确认 dev server 是否已在运行：`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5174/` 返回 200 即可复用，不要重复启动。
   - 没在运行时，在 `hihr-workbench/` 下以**后台进程**启动：`npm run dev -- --host 127.0.0.1 --port 5174`。不要在前台运行阻塞会话。缺少 `node_modules` 时先 `npm ci`。
   - 端口被占用、Vite 换了端口时，以终端输出的地址为准。
   - 预览页面报错或空白时，先自行定位修复，不把报错原样丢给用户。
   - 最后告诉用户可以打开的地址，并给出与改动对应的入口，例如 `http://127.0.0.1:5174/?appearance=glass`，以及「左侧导航 → 团队洞察 → 人才流动」这类到达路径（业务页面没有独立 URL）。
   - 只改文档、skill 或脚本时不需要启动预览。
7. **记录**：做出新决策、撤回旧方向或改变规则时，同时更新本 skill 对应 reference（当前规则）和 `CONTEXT.md`（变更记录：日期、分支、原因、回退点）。

## 维护本 skill

- 规则变了改 skill；为什么变、什么时候变写进 `CONTEXT.md`。同一条规则不在两处重复正文。
- 改了 `scripts/` 后，在 `hihr-workbench` 下跑一次 `npm run check:askhr`，确认当前代码仍为 0 报错。
- 升级版本时改 frontmatter 的 `metadata.version`。
