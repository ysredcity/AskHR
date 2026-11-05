#!/usr/bin/env node
// AskHR 规则机检（零依赖）。在 hihr-workbench 下通过 `npm run check:askhr` 调用。
// 1. Glass 选择器挂载：liquid-glass.css 中每条规则的选择器都必须以主题根选择器开头。
// 2. 已撤回方向与禁用文案：src/ 与 package.json 中不得出现已撤回功能、禁用文案或禁用依赖。
// 用法：node check-askhr.mjs [--app <hihr-workbench 目录>]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const argIndex = process.argv.indexOf('--app')
const appDir = resolve(argIndex > -1 ? process.argv[argIndex + 1] : join(scriptDir, '../../../hihr-workbench'))
const srcDir = join(appDir, 'src')
if (!existsSync(srcDir)) {
  console.error(`[check-askhr] 找不到 ${srcDir}，请用 --app 指定 hihr-workbench 目录`)
  process.exit(1)
}

const GLASS_FILE = join(srcDir, 'features/appearance/liquid-glass.css')
// 已知且接受的例外：index.css 中首页 Composer 阴影规则同时覆盖两套主题。
const GLASS_ELSEWHERE_ALLOWED = new Set(['src/index.css'])
const GLASS_ROOTS = [':root[data-askhr-appearance="glass"]', ':root.dark[data-askhr-appearance="glass"]']

// 已撤回功能与禁用文案。新增条目时同步更新 references/do-not-restore.md。
const FORBIDDEN_TEXT = [
  { pattern: /勋章墙/, reason: '「我的勋章墙」已删除' },
  { pattern: /活水/, reason: '活水平台已删除' },
  { pattern: /原型演示|演示数据/, reason: '界面不出现原型 / 演示字样' },
  { pattern: /CEO\s*一页摘要/, reason: '现名「COE 一页摘要」' },
]
const FORBIDDEN_IMPORT = [
  { pattern: /from\s+['"]@visactor\/vchart|import\(\s*['"]@visactor\/vchart/, reason: 'VChart 迁移已撤回，不引入 @visactor/vchart' },
]
const FORBIDDEN_DEPENDENCY = [{ name: '@visactor/vchart', reason: 'VChart 迁移已撤回' }]

const errors = []
const warnings = []
const rel = (file) => relative(appDir, file)

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, files)
    else if (/\.(tsx?|css|json)$/.test(name)) files.push(full)
  }
  return files
}

/** 去掉注释但保留换行，便于报告行号 */
function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
}

/** 按顶层逗号拆分选择器列表（忽略括号内的逗号） */
function splitSelectors(prelude) {
  const parts = []
  let depth = 0
  let current = ''
  for (const char of prelude) {
    if (char === '(' || char === '[') depth++
    if (char === ')' || char === ']') depth--
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else current += char
  }
  parts.push(current)
  return parts.map((part) => part.trim()).filter(Boolean)
}

/** 遍历 CSS 规则：@media / @supports 递归进入，@keyframes 等其他 at-rule 跳过 */
function checkGlassRules(css, file) {
  let index = 0
  const lineAt = (offset) => css.slice(0, offset).split('\n').length
  function parseBlock(end) {
    while (index < end) {
      const open = css.indexOf('{', index)
      if (open === -1 || open >= end) return
      const prelude = css.slice(index, open).trim()
      const preludeStart = index + css.slice(index, open).search(/\S/)
      let depth = 1
      let cursor = open + 1
      while (depth > 0 && cursor < css.length) {
        if (css[cursor] === '{') depth++
        else if (css[cursor] === '}') depth--
        cursor++
      }
      const close = cursor - 1
      if (/^@(media|supports|layer|container)\b/.test(prelude)) {
        index = open + 1
        parseBlock(close)
      } else if (!prelude.startsWith('@')) {
        for (const selector of splitSelectors(prelude)) {
          if (!GLASS_ROOTS.some((root) => selector.startsWith(root))) {
            errors.push(`${rel(file)}:${lineAt(preludeStart)} 选择器未挂在 Glass 主题根下：${selector}`)
          }
        }
      }
      index = close + 1
    }
  }
  parseBlock(css.length)
}

// 1. Glass 选择器挂载
if (!existsSync(GLASS_FILE)) errors.push(`缺少 ${rel(GLASS_FILE)}`)
else checkGlassRules(stripCssComments(readFileSync(GLASS_FILE, 'utf8')), GLASS_FILE)

const files = walk(srcDir)
for (const file of files) {
  if (file === GLASS_FILE || !file.endsWith('.css') || GLASS_ELSEWHERE_ALLOWED.has(rel(file))) continue
  const css = stripCssComments(readFileSync(file, 'utf8'))
  if (css.includes('data-askhr-appearance="glass"')) {
    warnings.push(`${rel(file)} 含 Glass 选择器；Glass 规则应优先写在 liquid-glass.css`)
  }
}

// 2. 已撤回方向与禁用文案
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return
    for (const rule of FORBIDDEN_TEXT) {
      if (rule.pattern.test(line)) errors.push(`${rel(file)}:${lineIndex + 1} ${rule.reason}：${trimmed.slice(0, 80)}`)
    }
    if (/\.tsx?$/.test(file)) {
      for (const rule of FORBIDDEN_IMPORT) {
        if (rule.pattern.test(line)) errors.push(`${rel(file)}:${lineIndex + 1} ${rule.reason}`)
      }
    }
  })
}
const pkg = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'))
for (const rule of FORBIDDEN_DEPENDENCY) {
  if (pkg.dependencies?.[rule.name] || pkg.devDependencies?.[rule.name]) errors.push(`package.json 依赖 ${rule.name}：${rule.reason}`)
}

for (const warning of warnings) console.warn(`[check-askhr] 提示：${warning}`)
if (errors.length) {
  for (const error of errors) console.error(`[check-askhr] ${error}`)
  console.error(`[check-askhr] ${errors.length} 处问题。规则见 skills/askhr-prototype/references/glass-theme.md 与 do-not-restore.md`)
  process.exit(1)
}
console.log(`[check-askhr] 通过：Glass 选择器挂载正常，未发现已撤回功能或禁用文案（扫描 ${files.length} 个文件）`)
