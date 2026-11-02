# AskHR Liquid Glass 外观实验

本轮以外观实验方式调整，不改变页面结构、数据、路由或对话流程。

## 版本保护

- 仓库根目录：`/Users/yangshuo/Code/HR-Portal`
- 原版分支：`main`
- 原版提交：`34d8380`
- 固定标签：`baseline/pre-liquid-glass-2026-11-02`
- 实验分支：`experiment/liquid-glass`
- 仅本地 Git，无远程推送。

原工程未初始化 Git，本次先将已有源代码与文档保存为基线，再创建实验分支。依赖、构建目录、预览截图及已有静态发布目录不纳入源码版本。

## 外观范围

首页（含完整对话）、团队/组织全景、服务大厅，以及这些页面的导航、Copilot 和菜单。个人全景、待办事项、薪酬智参和 HTML 报告保留原版风格。

采用低饱和冷白背景、半透明磨砂表面、亮边、分层阴影和更柔和的圆角。深色模式翻转材质变量，不降低正文对比度。无额外依赖，无背景持续动画；减少动效/透明度偏好及不支持 backdrop-filter 的环境有降级。

参考：用户指定的 https://lollipop.plus/jobs 。浏览器读取该站超时，改为读取公开 HTML 与样式资源，观察到白灰表面、深色主操作和 blur(18px) 透明面板；本轮是 AskHR 的风格探索，非像素级复刻。

## 对比与恢复

- 左下角“原版 / 玻璃”即时切换；仅改变 CSS，保留当前 Tab、对话与草稿。
- 指定原版预览：`http://127.0.0.1:5174/?appearance=classic`
- 指定玻璃预览：`http://127.0.0.1:5174/?appearance=glass`
- 完整回到本轮修改前：在仓库根目录执行 `git checkout main`，刷新浏览器。
- 回到实验版：`git checkout experiment/liquid-glass`，刷新浏览器。
- 后续有未提交修改时，先保存为提交再切分支；不要使用强制覆盖或 reset --hard。

实验 CSS 集中在 `hihr-workbench/src/features/appearance/liquid-glass.css`。组件只增加样式定位属性；独立开关组件为 `liquid-glass-preview.tsx`。

## 验证记录

- 首页、团队人才盘点、服务大厅已进行浏览器视觉检查；服务搜索浮层可用。
- 对比开关切到原版后，团队 Tab 与 Copilot 已预填草稿保持一致；再切玻璃可恢复材质。
- 个人全景的根样式状态为 classic；返回团队为 glass，且人才盘点 Tab 保留。
- 服务大厅深色模式已检查并恢复浅色。
- 定向 oxlint、token 检查、TypeScript/Vite 构建与 git diff --check 通过。
