# 简报卡片 · Hairline

智能推荐 Banner 中使用的三张等轴简报：折角、装订孔、纸面横线区分其身份。静止时卡片有不同倾角，中间卡片是唯一亮边；鼠标指向卡片时它抬起，相邻卡片按距离错开。

- 核心规则：固定命中区域、按距离错峰、限制运动范围、单处亮边、非均匀静止姿态、遮挡正确、共享时钟、圆角、图内无文字。
- 巡游：中间卡片 → 左侧卡片 → 右侧卡片 → 离开恢复。
- 读数：rest / 简报 1 / 简报 2 / 简报 3。
- [独立交互页面](hairline-briefing.html)：点 play，或在地址后加 `?play=1`。
- [八组画面检查](hairline-briefing-look.png)、[运动过程](hairline-briefing-motion.png)、[无标题小图](hairline-briefing-blind.png)。

## 校验结果

静态校验通过，kernel 与 bench 保持原样。八组浏览器画面检查通过：无越界、无闪烁，读数正确，控制台无错误。静止图占视框 33%；折角和装订孔在 240px 图中可辨认。运动过程无穿透或跳变，亮边只落在一张卡片。深浅主题已检查。非空态且没有源 SVG，检查项 13、14 不适用。

首页中已核对：悬停命中简报 2、左右翻页可用、主题切换正常。三条推荐维持相同 Banner 高度。

## 文件与更新

- `briefing.js` 是唯一手绘图形源。
- `hairline-briefing.html` 使用 skill 的固定 bench 和原始 kernel 构建。
- `public/hairline/kernel.js` 是 skill 引擎的未改动副本。
- `scripts/build-hairline.mjs` 将原始引擎与图形封装成宿主适配脚本；`HairlineBriefing` 挂载到 Banner，卸载时销毁图形。
- `node scripts/build-hairline.mjs` 更新项目内的运行时文件；修改图形后须重新运行 skill 的 build / validate / look。
