# 验证、提交与发版

## 目录

- [验证](#验证)
- [截图自检](#截图自检)
- [提交](#提交)
- [发版](#发版)

## 验证

在 `hihr-workbench/` 下：

```sh
npm run gate
```

依次运行：

1. lint（oxlint）；
2. `check:tokens`：裸颜色值；
3. `check:scripts`：场景数据结构、触发词冲突、澄清与确认卡规则；
4. `check:askhr`：Glass 选择器挂载、已撤回功能与禁用文案；
5. TypeScript 与 Vite 构建。

lint 现有 2 条与本工程改动无关的 warning（`components/ui/tabs.tsx`、`public/hairline/kernel.js`），不得新增。构建的 chunk 体积提示是已知问题。

只改文档时不必跑 gate，核对链接与事实即可。

## 截图自检

先启动开发服务：

```sh
cd hihr-workbench
npm run dev -- --host 127.0.0.1 --port 5174
```

再运行截图脚本：

```sh
node ../skills/askhr-prototype/scripts/shoot.mjs [选项]
```

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `--url` | `http://127.0.0.1:5174/` | 开发服务地址 |
| `--themes` | `classic,glass` | 逗号分隔 |
| `--widths` | `1440,920` | 逗号分隔；高度固定 900 |
| `--only` | 全部 | 逗号分隔：`home`、`hall`、`employee`、`team`、`organization`、`copilot`、`artifact` |
| `--dark` | 关闭 | 加上后额外截深色模式 |
| `--out` | `.askhr-shots/`（仓库根目录，已忽略） | 输出目录 |

- 依赖 Playwright。工程里没有装，脚本按顺序查找：环境变量 `PLAYWRIGHT_PATH`（指向 `node_modules/playwright` 目录）→ 能直接 `import('playwright')` 的全局安装。都找不到时会提示安装方式，不会自动安装。
- 截图宽度不超过 1920px，可以直接交给模型查看。查看时一次看一两张，不要一次传全部。
- 无头浏览器的滚动条是浮层式的，截图看不出滚动条显隐，需要读计算样式或在真实浏览器里确认。
- 截图只证明「渲染没出错、布局符合预期」，交互仍要实际点一遍。

## 提交

- 分支命名：样式探索 `experiment/*`，功能 `feature/*`，缺陷 `fix/*`。基于最新 `main` 创建。
- 提交说明写清：改动场景、验证方式、影响范围。
- 不提交 `node_modules`、`dist`、`preview/`、截图、`.env` 或凭据。只 `git add` 本次改动的文件，不用 `git add -A`。
- **只有用户明确要求时才 commit、push 或合并**。

## 发版

发版 = 改版本号 → 提交并合入 `main` → 打标签 → 推送 → 在 GitHub 创建 Release。只有用户明确说「发个 x.y.z」之类时才做。

**版本号规则**（`x.y.z`）：以样式和交互小改为主的版本递增 z；新增页面、场景或较大能力递增 y；大的产品结构调整递增 x。用户指定了版本号时以用户为准。

**步骤**：

1. 确认改动已通过 `npm run gate`，相关截图已检查。
2. 改四处版本号：
   - `hihr-workbench/package.json` 的 `version`；
   - `hihr-workbench/package-lock.json` 顶部两处 `version`（第 3 行与 `packages[""]` 下）；
   - `README.md` 顶部「当前发布版本」一行（并把上一版本列为回退点）；
   - `CONTEXT.md` 的「当前基线」表和「已提交的重要节点」表。
3. 提交到功能分支，`git checkout main && git merge --ff-only <分支>`。不能快进时停下来说明，不要强推。
4. `git tag -a vX.Y.Z -m "AskHR X.Y.Z"`。
5. `git push origin main vX.Y.Z`。
6. 创建 Release：

   ```sh
   gh release create vX.Y.Z --repo ysredcity/AskHR --title "AskHR X.Y.Z" --notes-file <说明文件> --verify-tag
   ```

7. 核对：`git ls-remote origin refs/heads/main 'refs/tags/vX.Y.Z^{}'` 两者指向同一提交；`gh release view vX.Y.Z --repo ysredcity/AskHR` 不是草稿或预发布。

**Release 说明模板**：

```markdown
AskHR X.Y.Z 一句话概述这次改了什么、业务流程与数据是否变化。

## 主要变化

- **改动名称**：具体变化，涉及哪些页面；只在某个主题生效时写明。

## 发布说明

本版本仍是基于预设数据的前端交互原型，未接入真实模型与 HR 业务后端。

验证：`npm run gate` 通过；实际检查过的主题、宽度、页面和链路；没有验证到的部分如实写出。

版本：X.Y.Z；Git 标签：vX.Y.Z；上一版本 vA.B.C 保留为回退点。
```

**网络**：本机曾出现 git 代理 `127.0.0.1:7890` 不可用的情况。此时只对当次命令临时绕过：`git -c http.proxy= -c https.proxy= push ...`，不修改全局配置。
