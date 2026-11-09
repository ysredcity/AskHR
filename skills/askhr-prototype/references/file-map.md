# 文件索引

路径相对 `hihr-workbench/`。文件职责变化时同步更新本表。

## 工程目录

```text
hihr-workbench/
├── src/
│   ├── App.tsx               # 应用装配、Provider、初始会话
│   ├── agent-ui/             # 来自 pangea-design-ai 的对话契约、渲染、剧本引擎、主题 Token
│   ├── components/
│   │   ├── agent-layout/     # Shell、导航、Composer、Copilot、产物面板、对话流
│   │   └── ui/               # shadcn v4 / Base UI 基础件
│   ├── features/
│   │   ├── hr/               # 人资业务页面、预设数据、状态、业务意图
│   │   ├── compensation/     # 薪酬智参：项目、诊断流程、澄清表单、HTML 报告
│   │   └── appearance/       # 主题状态与 Liquid Glass 样式
│   ├── hooks/                # 共用 Hook
│   ├── lib/                  # 工具函数（cn 等）
│   └── index.css             # 产品样式入口
├── public/                   # 头像、图标、插画等静态资源
├── scripts/agent-ux/         # check-tokens、check-scripts（来自 pangea-design-ai）
└── package.json              # gate 等脚本
```

## 改什么去哪里

| 任务 | 文件 |
| --- | --- |
| 导航、外观菜单、历史列表 | `src/components/agent-layout/sidebar.tsx` |
| 工作区切换、对话入口、Copilot 与产物容器、拖动 | `src/components/agent-layout/agent-shell.tsx` |
| 响应式断点与宽度计算 | `src/components/agent-layout/workspace-layout.ts` |
| Copilot 面板 | `src/components/agent-layout/employee-copilot.tsx` |
| 产物面板框架、Tab 栏 | `src/components/agent-layout/artifact-panel.tsx` |
| 产物容器（检索、网页、文件预览） | `src/components/agent-layout/panel-containers.tsx`、`panel-registry.ts`、`panel-types.ts` |
| Composer | `src/components/agent-layout/composer.tsx` |
| 对话流、执行过程 | `src/components/agent-layout/conversation-flow.tsx`、`conversation-section.tsx` |
| 普通对话场景数据 | `src/components/agent-layout/conversation-data.ts`、`panel-data.ts`、`scenes.ts` |
| 首页、推荐分类 | `src/components/agent-layout/new-conversation-page.tsx` |
| 首页业务轮播 | `src/features/hr/personal-briefing.tsx` |
| 页面 header 的 Tabs 与动作 | `src/features/hr/header-controls.tsx`（`HeaderControls`、`HeaderTabs`、`HeaderActions`） |
| 新员工成长计划数据、共用流程 | `src/features/growth/data.ts`、`flow.tsx` |
| 成长计划页面：内容库与生成、章节、对话框 | `src/features/growth/catalog.ts`、`plan-panel.tsx`、`plan-sections.tsx`、`plan-dialogs.tsx` |
| 产物面板内的对话框挂载点 | `src/components/agent-layout/panel-portal.ts`（`usePanelPortal()`），配合 `DialogContent` 的 `container` |
| 专家、个人数据、服务目录、推荐内容 | `src/features/hr/data.ts` |
| 业务状态、页面触发 AI | `src/features/hr/store.tsx`、`context.ts`、`business-intent.ts` |
| 我的成长、服务大厅、待办页面 | `src/features/hr/views.tsx` |
| 团队洞察、HR数据运营看板 | `src/features/hr/panorama.tsx`、`panorama-data.ts`、`panorama-data.json` |
| 人才九宫格 | `src/features/hr/talent-nine-grid.tsx`、`public/avatars/` |
| 业务图标 | `src/features/hr/icons.ts` |
| 薪酬诊断触发与项目 | `src/features/compensation/data.ts`、`competitiveness.ts`、`diagnosis-flow.tsx` |
| 薪酬 HTML 产物 | `src/features/compensation/strategy-report.ts`、`distribution-report.ts`、`final-reports.ts` 及对应 CSS |
| 报告引用和编辑 | `src/features/compensation/report-notes.ts`、`report-notes.css`、`html-artifact.tsx` |
| 主题状态 | `src/features/appearance/appearance-provider.tsx` |
| Liquid Glass 样式 | `src/features/appearance/liquid-glass.css` |
| 基础 Token | `src/agent-ui/immersive/theme.css`（基线，少改）、`src/index.css`（产品覆盖） |

## 仓库其他位置

| 位置 | 内容 |
| --- | --- |
| `README.md` | 启动方式、产品入口、工程结构 |
| `CONTEXT.md` | 当前基线、决策历史、变更记录 |
| `docs/` | 早期需求、汇报与实施计划（可能含旧命名，以本 skill 和代码为准） |
| `hihr-workbench/docs/` | 原型验证记录、专项实现资料 |
| `skills/askhr-prototype/` | 本 skill |
