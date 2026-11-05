# 视觉规则（经典主题与两套主题共用部分）

经典主题是默认主题，也是 Liquid Glass 的基础：两者共用业务组件和逻辑，Glass 只在样式层覆盖。Glass 专属规则见 [glass-theme.md](glass-theme.md)。

## 主题机制

- 主题状态在 `features/appearance/appearance-provider.tsx`：`<html>` 上的 `data-askhr-appearance="classic" | "glass"` 和 `.dark` 类。
- 新用户默认经典主题；用户主动选择的主题和颜色模式记在 localStorage，URL 参数 `?appearance=` 优先。
- 主题与浅色 / 深色都在导航底部的外观菜单里切换，不另设入口。

## Token

- Token 定义在 `agent-ui/immersive/theme.css`（来自 pangea-design-ai 模板，视为基线，不随意改）；产品级覆盖写在 `src/index.css`。
- 颜色只用语义 Token：`background`、`background-desktop`、`foreground`、`muted`、`accent`、`primary`、`primary-bg`、`secondary`、`card`、`border`、`sidebar-*`、`success`、`warning`、`info`、`destructive`。在 CSS 中用 `var(--x)` 和 `color-mix(in oklch, var(--x) N%, transparent)` 派生，不写裸 hex / rgb（`check:tokens` 会拦）。
- 当前取值要点：`--primary` 为 teal-600；字体 Geist Variable；`--radius` 0.625rem；桌面背景 `--background-desktop` 为 neutral-50；导航悬停填充 `--sidebar-accent`（黑色 4%）。

## 按钮与图标

- 业务页面上的 AI 主按钮：深灰底白字（`bg-foreground text-background hover:bg-foreground/85`）+ `Sparkles` 图标。次级动作 `variant="outline"`，弱动作（查看详情、数据表、指标口径）用 `ghost` 加 `text-muted-foreground`。
- 品牌青绿 `primary` 用于选中态、进度、推荐标签、Composer 发送等对话侧元素，不用于业务页的 AI 按钮。
- 一组按钮里只有一个主操作；危险操作用 `destructive`，不设为默认。
- 图标统一 lucide。lucide 没有的图标用 `createLucideIcon` 定义在 `features/hr/icons.ts`，不直接写裸 SVG、不引入其他图标库。
- 纯图标按钮必须有 `aria-label`，并配 Tooltip 或 `title`。

## 页面骨架

- 业务页面由 `agent-shell.tsx` 提供 52px header，页面通过 `HeaderControls` 把 Tabs 和 header 右侧动作 portal 进去。
  - Tabs 用 `HeaderTabs`，宽度不足时折叠进 Tabs 内部的「…」菜单，当前选中项始终可见。
  - header 右侧动作包在 `HeaderActions` 中。
  - 两者都在 `features/hr/header-controls.tsx`。
- 内容区最大宽度 1240px，左右内边距 40px（窄于 1000px 时 24px）。
- 中间工作区的滚动容器带 `data-slot="workspace-scroll"`，滚动条只在悬停或键盘聚焦时显示（`index.css`）。新增的工作区级滚动容器沿用该属性。

## 卡片与内容

- 服务卡片：描述单行、紧凑；没有底部「进入服务」文字按钮；Agent badge 与悬停「召唤」按钮样式分开。
- 同排卡片等高，高度随内容自适应，不设统一固定高度去裁切内容（人才九宫格同样适用）。
- 竞争力分布等报告内的板块用分割线分隔，减少卡片嵌套。
- 首页 Banner（经典）：轻微左深右浅的绿色水平渐变、加重边框、浅绿日期胶囊配墨绿字、右侧渐隐的业务标签装饰。
- 「值得关注」卡片：顶部蓝绿渐变，底部提亮偏白，与页面背景拉开明度差异。

## 无障碍与动效

- 文字对比度满足 WCAG AA；状态不只靠颜色表达。
- 动效只用于解释空间关系或状态变化，统一尊重 `prefers-reduced-motion`。
- 收起的区域（折叠导航、隐藏面板）用 `inert` / `aria-hidden` 防止被聚焦。

## 范围说明

- 优先验证桌面端和三分区缩放；移动端暂不作为完整交付范围，但窄于 740px 时布局不能错乱。
- 薪酬报告 HTML 产物（战略解码、竞争力分布、COE 报告）的版式属于具体业务场景，按各自设计稿实现，不在本文件规定。
