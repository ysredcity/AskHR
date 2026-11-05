#!/usr/bin/env node
// AskHR 标准截图：主题 × 宽度 × 关键页面，用于改动后的视觉自检。需先启动开发服务。
// 用法见 references/release.md「截图自检」。
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index > -1 && args[index + 1] && !args[index + 1].startsWith('--') ? args[index + 1] : fallback
}
const list = (value) => value.split(',').map((item) => item.trim()).filter(Boolean)

const baseUrl = option('url', 'http://127.0.0.1:5174/')
const themes = list(option('themes', 'classic,glass'))
const widths = list(option('widths', '1440,920')).map(Number)
const dark = args.includes('--dark')
const outDir = resolve(option('out', join(scriptDir, '../../../.askhr-shots')))
const NAV = { hall: '服务大厅', employee: '我的成长', team: '团队洞察', organization: 'HR数据运营' }
const ALL_TARGETS = ['home', 'hall', 'employee', 'team', 'organization', 'copilot', 'artifact']
const targets = list(option('only', ALL_TARGETS.join(',')))
const unknown = targets.filter((target) => !ALL_TARGETS.includes(target))
if (unknown.length) {
  console.error(`[shoot] 未知页面：${unknown.join('、')}。可选：${ALL_TARGETS.join('、')}`)
  process.exit(1)
}

async function loadPlaywright() {
  const fromEnv = process.env.PLAYWRIGHT_PATH
  if (fromEnv) return createRequire(import.meta.url)(resolve(fromEnv))
  try {
    return await import('playwright')
  } catch {
    console.error('[shoot] 找不到 Playwright。请设置 PLAYWRIGHT_PATH 指向已安装的 node_modules/playwright 目录，')
    console.error('        或在本机全局安装（例如 npx playwright install chromium 后用其包路径）。脚本不会自动安装。')
    process.exit(1)
  }
}

const { chromium } = await loadPlaywright()
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const withTheme = (theme, hash = '') => {
  const url = new URL(baseUrl)
  url.searchParams.set('appearance', theme)
  url.hash = hash
  return url.toString()
}

async function open(page, theme, hash) {
  await page.goto(withTheme(theme, hash), { waitUntil: 'networkidle' })
  if (dark) await page.evaluate(() => document.documentElement.classList.add('dark'))
  await page.waitForTimeout(800)
}

async function prepare(page, theme, target) {
  if (target === 'artifact') {
    await open(page, theme, '#/compensation')
    await page.locator('textarea, [contenteditable="true"]').first().click()
    await page.keyboard.type('分析显示事业部')
    await page.keyboard.press('Enter')
    await page.locator('[data-slot="artifact-panel"]').first().waitFor({ timeout: 20000 })
    await page.waitForTimeout(800)
    return
  }
  await open(page, theme)
  if (target === 'home') return
  const nav = NAV[target === 'copilot' ? 'employee' : target]
  const navButton = page.getByRole('button', { name: nav }).first()
  if (!(await navButton.isVisible())) await page.getByLabel('展开导航').first().click()
  await navButton.click()
  await page.waitForTimeout(600)
  if (target === 'copilot') {
    await page.getByLabel('打开 AI 对话').click()
    await page.waitForTimeout(600)
  }
}

const results = []
for (const theme of themes) {
  for (const width of widths) {
    for (const target of targets) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: dark ? 'dark' : 'light' })
      const pageErrors = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      const file = join(outDir, `${theme}${dark ? '-dark' : ''}-${width}-${target}.png`)
      try {
        await prepare(page, theme, target)
        await page.mouse.move(2, 898)
        await page.waitForTimeout(300)
        await page.screenshot({ path: file })
        results.push({ file, ok: pageErrors.length === 0, note: pageErrors.join('; ') })
      } catch (error) {
        results.push({ file, ok: false, note: error.message.split('\n')[0] })
      }
      await page.close()
    }
  }
}
await browser.close()

for (const result of results) console.log(`${result.ok ? '✓' : '✗'} ${result.file}${result.note ? `  ${result.note}` : ''}`)
const failed = results.filter((result) => !result.ok).length
console.log(`[shoot] ${results.length - failed}/${results.length} 张成功，输出目录 ${outDir}`)
process.exit(failed ? 1 : 0)
