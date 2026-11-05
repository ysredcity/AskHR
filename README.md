# AskHR · 企业人资 AI 工作台

AskHR 是面向企业内部人资业务的桌面端交互原型，以统一 AI 对话入口连接个人、团队、HR 数据运营及传统业务服务。当前为同一套 React 工程，包含 AskHR 主应用与产品逻辑上的「薪酬智参」子应用。

当前发布版本：**1.1.1**，Git 标签 `v1.1.1`，发布记录见 [GitHub Release](https://github.com/ysredcity/AskHR/releases/tag/v1.1.1)。历史版本 [v1.1.0](https://github.com/ysredcity/AskHR/releases/tag/v1.1.0)、[v1.0.0](https://github.com/ysredcity/AskHR/releases/tag/v1.0.0) 保留为回退点。

仓库：[ysredcity/AskHR](https://github.com/ysredcity/AskHR)（私有）。继续开发时的当前规则见 [askhr-prototype skill](./skills/askhr-prototype/SKILL.md)，决策历史与变更记录见 [CONTEXT.md](./CONTEXT.md)。本文反映当前代码；早期需求、计划及子目录说明可能保留旧名称或旧交互，发生冲突时以当前代码和本文为准。

## 本地运行

依赖 Node.js `^20.19.0 || >=22.12.0`（来自当前 Vite 版本的 engines 要求）及 npm。根目录不直接运行前端，应用目录为 `hihr-workbench/`。

```sh
cd hihr-workbench
npm ci
npm run dev -- --host 127.0.0.1 --port 5174
```

开发服务占用端口时，以终端实际输出为准。

| 地址 | 用途 |
| --- | --- |
| `http://127.0.0.1:5174/` | AskHR 首页 |
| `http://127.0.0.1:5174/?appearance=classic` | 经典主题 |
| `http://127.0.0.1:5174/?appearance=glass` | Liquid Glass 主题 |
| `http://127.0.0.1:5174/#/compensation` | 薪酬智参首页；静态托管优先使用 hash 地址 |

薪酬智参也兼容开发环境下的 `/compensation` 和 `?page=compensation` 入口。主要业务页面使用内部状态切换，并非每个页面都有独立 URL。

## 产品入口与场景

| 入口 | 当前内容与交互 |
| --- | --- |
| 首页 · 新对话 | 欢迎语、Composer、专家选择、分类推荐指令、人资窗口期轮播和基础待办 |
| 服务大厅 | 员工自助、管理者自助、HR 自助；分类、搜索、收藏及部分 Agent 召唤入口 |
| 我的成长 | 个人信息、新员工专区、我的假勤、我的收入、我的绩效、我的发展 |
| 团队洞察 | 人才招聘、人才盘点、团队发展、团队出勤、团队状态、团队结构 |
| HR数据运营 | 招聘、薪酬、共享运营、干部、人才发展、绩效、股权 HRBP、HRD |
| 待办事项 | 位于导航底部外观菜单右侧的 Bell 图标；有待办时显示红点 |
| 薪酬智参 | 从服务大厅 HR 自助 → 薪酬管理 → 组织薪酬洞察进入；支持分析项目、收藏及薪酬诊断流程 |

### 三类对话入口

1. **主应用 Agent：** 首页发送或左侧历史对话打开后，使用完整对话工作区，保留 AskHR 导航。
2. **业务页面 Copilot：** 我的成长、团队洞察、HR 数据运营等页面的 AI 按钮打开右侧面板，预填专家、技能、提示词及数据上下文，用户发送后才执行。右下角浮动入口也可打开面板；对话与主工作区共用组件和历史列表。支持侧栏、浮窗及进入完整对话界面。
3. **薪酬智参子应用：** 服务入口在浏览器新页签打开首页，不显示 AskHR 左导航；其发起的对话同样不显示左导航，顶部首页图标返回子应用首页。它仍使用同一工程及共享对话组件。

### 薪酬竞争力分析体验路径

- 子应用路径：进入薪酬智参「组织薪酬」，输入 `分析显示事业部`。
- 主应用路径：在「组织薪酬洞察」入口点击「召唤」，带入薪酬专家；选择或输入 `查询显示事业部薪酬情况` 并发送。
- 两条路径复用薪酬诊断逻辑，主应用路径正常显示 AskHR 左导航。
- 初步执行 → 初步结论与自动打开的「战略解码与组织绩效分析.html」→ 两步澄清表单 → 诊断结果与自动打开的「家电事业部全面现金薪酬竞争力分布分析.html」→ 确认生成报告 → 「COE工作底稿.html」「COE一页摘要.html」。最后两个产物不自动打开。
- 澄清表单提交后可分页回看两步字段，不额外生成重复的用户消息。执行过程在答案产生后自动折叠，推荐问题位于回复操作栏下方。
- 报告中的部分结论、根因和建议区域支持引用到 Composer、编辑、保存与取消。最终产物提供 PDF / Word 导出菜单展示；当前不执行真实导出或下载。

## 工程结构

```text
HR-Portal/
├── README.md                     # 项目入口说明
├── CONTEXT.md                    # 决策历史与变更记录
├── AGENTS.md / CLAUDE.md         # AI 工具入口，指向 skill
├── skills/askhr-prototype/       # 开发 skill：当前规则、检查与截图脚本、发版步骤
├── docs/                         # 需求、方案、汇报与实施计划
└── hihr-workbench/               # 唯一前端工程
    ├── src/
    │   ├── App.tsx               # 应用装配、Provider 和初始会话
    │   ├── agent-ui/             # 沉浸式对话契约、渲染、脚本引擎和主题
    │   ├── components/
    │   │   ├── agent-layout/     # Shell、导航、Composer、Copilot、产物面板
    │   │   └── ui/               # shadcn / Base UI 基础组件
    │   ├── features/
    │   │   ├── hr/               # 人资业务页面、预设数据、状态和业务意图
    │   │   ├── compensation/     # 薪酬项目、诊断流程、澄清表单、HTML 报告
    │   │   └── appearance/       # 主题状态与 Liquid Glass 样式
    │   ├── hooks/                # 共用 Hook
    │   ├── lib/                  # 工具函数
    │   └── index.css             # 产品样式及专题样式入口
    ├── public/                   # 本地头像、图标、插画等静态资源
    ├── scripts/                  # Token、场景检查及插画构建脚本
    ├── docs/                     # 原型验证和专项实现资料
    └── package.json
```

### 常见修改位置

| 任务 | 文件入口（相对 `hihr-workbench/`） |
| --- | --- |
| 导航、外观菜单、历史列表 | `src/components/agent-layout/sidebar.tsx` |
| 工作区切换、对话入口、产物容器及拖动 | `src/components/agent-layout/agent-shell.tsx` |
| 响应式断点与宽度计算 | `src/components/agent-layout/workspace-layout.ts` |
| 首页、业务轮播 | `src/components/agent-layout/new-conversation-page.tsx`、`src/features/hr/personal-briefing.tsx` |
| 专家、个人数据、服务目录及推荐内容 | `src/features/hr/data.ts` |
| 业务状态与页面触发 AI | `src/features/hr/store.tsx`、`context.ts`、`business-intent.ts` |
| 个人页面、服务大厅、待办 | `src/features/hr/views.tsx` |
| 团队与 HR 数据运营看板 | `src/features/hr/panorama.tsx`、`panorama-data.ts`、`panorama-data.json` |
| 人才九宫格 | `src/features/hr/talent-nine-grid.tsx`、`public/avatars/` |
| 普通对话场景与匹配 | `src/components/agent-layout/scenes.ts`、`conversation-data.ts`、`src/agent-ui/script-engine/` |
| 薪酬诊断触发与项目 | `src/features/compensation/data.ts`、`competitiveness.ts`、`diagnosis-flow.tsx` |
| 薪酬 HTML 产物 | `src/features/compensation/strategy-report.ts`、`distribution-report.ts`、`final-reports.ts` 及对应 CSS |
| 报告引用和编辑 | `src/features/compensation/report-notes.ts`、`report-notes.css`、`html-artifact.tsx` |
| 主题切换与玻璃样式 | `src/features/appearance/appearance-provider.tsx`、`liquid-glass.css` |

## 数据与能力边界

- 当前是前端预设数据原型，没有接入真实模型、HR 业务后端或后端权限服务。执行过程、分析结论和报告主要由本地场景驱动。
- 会话、项目、表单及业务状态主要保存在 React 内存中；刷新不保证保留。主题与颜色模式偏好保存于 localStorage，主题 URL 参数优先。
- 新用户默认经典主题；主动选择的主题会记忆。经典与 Liquid Glass 共用业务组件和逻辑。
- 部分服务入口、详情、报告非首个分析 Tab 和导出选项刻意保留为无跳转或菜单展示，不代表已接入业务系统。
- 人才九宫格照片是本地示意头像，不代表姓名所对应员工的真实照片；来源说明见 `public/avatars/README.md`。
- 优先验证桌面使用及三分区缩放，暂未将移动端作为完整产品交付范围。

## 检查与交付

```sh
cd hihr-workbench
npm run gate
```

`gate` 依次运行 lint、Token 检查、场景检查、AskHR 规则检查（Glass 选择器挂载、已撤回功能）、TypeScript 与 Vite 构建。也可独立执行 `npm run lint`、`npm run check:tokens`、`npm run check:scripts`、`npm run check:askhr`、`npm run build`。界面截图自检见 [release.md](./skills/askhr-prototype/references/release.md#截图自检)。构建产物为 `hihr-workbench/dist/`，通过 `npm run preview` 本地查看；当前不自动部署。

涉及交互的改动还需实际验证：主应用发送、GUI 预填 Copilot、历史会话打开、产物打开与关闭、窄窗口及主题切换。只改文档时核对链接与事实即可。

## 团队协作

先读 [askhr-prototype skill](./skills/askhr-prototype/SKILL.md) 和 [CONTEXT.md](./CONTEXT.md) 再进行较大调整。使用 AI 工具开发时，工具会通过根目录的 `AGENTS.md` / `CLAUDE.md` 找到 skill。基线为提交 `4ba5b2b`，标签 `baseline/askhr-2026-11-04`，位于 `main`。后续样式探索使用独立分支，例如：

```sh
git switch main
git pull --ff-only
git switch -c experiment/glass-next
```

提交中说明改动场景、验证方式及影响范围；重大决策同步更新 `CONTEXT.md`。不要将依赖目录、构建产物、临时截图、`.env` 或凭据提交到仓库。
