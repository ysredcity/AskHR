# Liquid Glass 主题配方

Liquid Glass 是可选主题，与经典主题共用全部业务组件和逻辑，只在样式层覆盖。样式集中在 `features/appearance/liquid-glass.css`。具体数值以该文件为准，本文件说明配方和写法。

## 目录

- [写法约定](#写法约定)
- [变量](#变量)
- [背景](#背景)
- [材质分层](#材质分层)
- [形态](#形态)
- [挂钩属性清单](#挂钩属性清单)
- [降级与深色](#降级与深色)
- [禁止](#禁止)
- [新增一个玻璃表面的步骤](#新增一个玻璃表面的步骤)

## 写法约定

- 每条选择器以 `:root[data-askhr-appearance="glass"]` 开头（深色变量用 `:root.dark[data-askhr-appearance="glass"]`）。`@media` / `@supports` 内部同样如此。`npm run check:askhr` 会检查。
- 优先用 `data-slot` 属性定位元素：shadcn / Base UI 基础件自带 `data-slot`（`card`、`button`、`tabs-list`、`tabs-trigger`、`sidebar`、`dropdown-menu-content` 等）；业务组件缺少挂钩时，在组件上补一个语义化的 `data-slot`，不改布局与逻辑。
- 不用 Tailwind 工具类名做选择器（如 `.border-b`、`.bg-card`）：类名一改，样式就静默失效。现存少量此类写法，改到相关位置时顺手换成 `data-slot`。
- Glass 规则只写在 `liquid-glass.css`。`index.css` 中现有一条首页 Composer 阴影规则同时覆盖两套主题，保持原状即可。
- 颜色一律由语义 Token 和 `--glass-*` 变量派生，不写裸色值。

## 变量

定义在 `:root[data-askhr-appearance="glass"]`，深色模式下重新赋值：

| 变量 | 用途 |
| --- | --- |
| `--glass-canvas` / `--glass-blue` / `--glass-violet` / `--glass-mint` / `--glass-pearl` | 背景画布与渐变色 |
| `--glass-ink` / `--glass-muted` | 覆盖 `--foreground` / `--muted-foreground` |
| `--glass-white` / `--glass-shade` | 高光与投影基色 |
| `--glass-border` | 玻璃边框（白色 80%，深色 16%） |
| `--glass-surface` / `--glass-popover` | 卡片底、弹出层底 |
| `--glass-elevation` | 标准玻璃投影：上沿内高光 + 下沿弱高光 + 两层柔和外投影 |

## 背景

- 画布挂在 `[data-slot="sidebar-wrapper"]` 上：浅青绿基调，Composer 附近补淡蓝紫，底部是减淡的蓝灰。不使用视频。
- 工作区 `main` 下的 section 与 `.bg-background-desktop` 设为透明，透出画布。
- 页面 header 透明、无底部分隔线、无模糊。
- 全屏覆盖层（`[data-slot="artifact-overlay"]`、`[data-slot="copilot-overlay"]`）铺同一个画布背景，不露出背后的业务页面。

## 材质分层

原则：**承载正文越多，底色越实**；面板以白色为主，背景渐变只隐约透出，不在面板上形成明显色块。

| 层级 | 元素 | 底色（`--card` 比例） | 模糊 / 饱和度 | 圆角 |
| --- | --- | --- | --- | --- |
| 导航 | 左侧导航 `sidebar` | 38% | 28px / 145% | 24px |
| 卡片 | `card`、`service-card`、`employee-metric`、`home-tasks`、`employee-surface` | 70%→35% 斜向渐变 | 20px / 140% | 22px |
| 输入 | Composer `composer-surface` | 88%→38% 斜向渐变 | 同卡片 | 30px |
| 头部胶囊 | header 内 Tabs、`header-actions`、`header-nav-toggle` | 50% | 20px / 140% | 全圆角 |
| 内容面板 | `copilot-panel`（侧栏）、`artifact-panel` | 92%→86% 纵向渐变 | 32px / 110% | 24px |
| 浮层面板 | Copilot 浮窗 `[data-mode="floating"]` | 94% + 加重投影 | 32px / 110% | 24px |
| 弹出层 | 下拉菜单、Popover、Dialog | 90%（`--glass-popover`） | 28px / 150% | 18px |

交互态：

- 导航项悬停 / 选中：底色 62% + 内高光；顶部入口（含首页）悬停统一为 `--sidebar-accent`。
- 头部胶囊内按钮：自身无描边无底色；悬停、`aria-pressed="true"`、`secondary`、弹出菜单打开时，显示 85% 底色 + 内高光。
- 选中的 Tab：85% 底色 + 轻投影。
- Composer 聚焦：柔和中性灰边框（`--color-neutral-500` 45%）+ 2px 淡光晕。
- 服务卡片悬停：上移 2px、加深投影（减弱动效时不位移）。

## 形态

| 元素 | 规格 |
| --- | --- |
| 左侧导航 | 四周 10px 外边距，悬浮 |
| Copilot 侧栏、产物分栏 | 外边距上 / 右 / 下 10px，靠内容一侧 0 |
| 产物全屏、窄屏（< 740px）Copilot | 四周 10px，外层铺画布背景 |
| Copilot 浮窗 | 无外边距（位置由外层容器决定） |
| 页面 header 胶囊 | 高 36px，内边距 3px；胶囊内按钮高 28px，带文字的按钮左右内边距 12px |
| 展开导航按钮 | 36×36 圆形胶囊 |
| 产物面板 Tab 栏 | 栏高 44px，Tab 高 30px、圆角 10px |
| 面板内分隔线 | `--border` 55% 透明度 |
| 产物拖拽手柄 | 无常驻竖线，悬停 / 拖拽时显示渐变高亮 |

## 挂钩属性清单

业务组件上已有的 `data-slot`（新增时补充到这里）：

| data-slot | 位置 |
| --- | --- |
| `copilot-panel`（含 `data-mode`）、`copilot-history` | `components/agent-layout/employee-copilot.tsx` |
| `copilot-overlay` | `agent-shell.tsx`，窄屏 Copilot 外层 |
| `artifact-panel`（含 `data-fullscreen`）、`panel-tab`（含 `data-active`） | `components/agent-layout/artifact-panel.tsx` |
| `artifact-overlay`、`panel-resize-line`、`header-nav-toggle` | `agent-shell.tsx` |
| `workspace-scroll` | `agent-shell.tsx`、`new-conversation-page.tsx` |
| `header-actions`、`tabs-more` | `features/hr/header-controls.tsx` |
| `composer-surface`、`home-tasks`、`service-card`、`employee-metric`、`task-row` | 对应业务组件 |

类名挂钩：`.employee-surface`、`.panorama-insight`、`.briefing-banner`、`.home-composer`。

## 降级与深色

- 新增玻璃表面要同时加入文件中的两组降级选择器：
  - `@media (prefers-reduced-transparency: reduce)`：改为实底 `var(--card)`，去掉模糊。
  - `@supports not (backdrop-filter: blur(1px))`：改为实底 `var(--card)`。
- 深色模式只在 `:root.dark[data-askhr-appearance="glass"]` 中调整 `--glass-*` 变量，不另写一套规则。
- 新增的减弱动效覆盖写进 `@media (prefers-reduced-motion: reduce)`。

## 禁止

- 面板（Copilot、产物）上出现明显的渐变色块。
- 视频背景、全局蓝绿弥散渐变的旧背景。
- Composer 聚焦用 foreground 色重边框。
- 首页 Banner 四周向内加深的渐变、深绿实底日期胶囊（Glass 下 Banner 沿用经典浅绿配色，保留半透明、模糊与高光）。
- Glass header 恢复填充、模糊或底部分隔线；header Tabs 改成 line 类型或胶囊筛选样式以外的形态。
- 为了玻璃效果修改组件布局、断点或交互逻辑。

## 新增一个玻璃表面的步骤

1. 在材质分层表里确定它属于哪一层，沿用那一层的底色、模糊和圆角，不新造参数。
2. 组件上没有合适挂钩时，补一个语义化 `data-slot`。
3. 在 `liquid-glass.css` 写规则，选择器以主题根开头；同步加入降级选择器。
4. 检查深色模式是否只需靠变量生效。
5. 用截图脚本对比经典与 Glass、浅色与深色，确认经典主题没有变化。
6. 把新的 `data-slot` 补进上面的挂钩属性清单。

## 对话卡片中的默认组件

成长计划澄清及确认卡通过 `data-component-style="default"` 声明内部使用shadcn默认组件外观。Glass的Tabs、输入框及按钮等组件覆盖选择器排除该区域，沿用基础组件样式，不复制默认样式或追加反向覆盖；卡片外部应用主题不变。业务布局和岗位选中态仍由业务组件负责。

对话滚动条使用 conversation-scroll 挂钩，Glass 下轨道与角落透明，仅显示细滑块，避免系统滚动条底带遮住渐变画布。样式局限于对话滚动区，不覆盖所有页面滚动条。
