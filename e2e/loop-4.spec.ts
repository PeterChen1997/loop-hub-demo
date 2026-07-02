import { test, expect } from '@playwright/test'

/**
 * Issue #4: [REQ-007128] React+Vite迁移+GitHub Pages
 *
 * 被测应用是 React + Vite SPA，配置了 base: '/loop-hub-demo/'。
 * 该测试针对「运行中的构建产物」跑（vite preview 或 GitHub Pages），
 * 通过 E2E_BASE_URL 覆盖目标地址：
 *   - 本地: pnpm build && pnpm preview  → http://localhost:4173/loop-hub-demo/
 *   - 线上: E2E_BASE_URL=https://peterchen1997.github.io/loop-hub-demo/
 * 因为是模块化打包 + 子路径 base，无法用 file:// 直接打开 index.html。
 */
const BASE_URL =
  process.env.E2E_BASE_URL ?? 'http://localhost:4173/loop-hub-demo/'

const KNOWN_QUOTES = [
  '千里之行，始于足下。',
  '不积跬步，无以至千里；不积小流，无以成江海。',
  '学而不思则罔，思而不学则殆。',
  '知之者不如好之者，好之者不如乐之者。',
  '路漫漫其修远兮，吾将上下而求索。',
  '天行健，君子以自强不息。',
  '博学之，审问之，慎思之，明辨之，笃行之。',
  '不患人之不己知，患不知人也。',
]

test.describe('Issue #4: [REQ-007128] React+Vite迁移+GitHub Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('核心用户路径：React 应用挂载并渲染时钟页面', async ({ page }) => {
    // WHY: 迁移后仍是同一个「全屏时钟」页面，React 必须成功挂载到 #root
    await expect(page).toHaveTitle('全屏时钟')
    await expect(page.locator('#root')).not.toBeEmpty()
  })

  test('时钟：显示 HH:MM:SS 且每秒自动跳动', async ({ page }) => {
    // WHY: 时钟功能的核心是「实时走动」，静态显示不满足需求
    const time = page.locator('#time')
    await expect(time).toBeVisible()
    await expect(time).toHaveText(/^\d{2}:\d{2}:\d{2}$/)

    const first = await time.textContent()
    // 等待超过 1 秒，秒数必须前进（证明 setInterval 定时更新在生效）
    await expect
      .poll(async () => time.textContent(), { timeout: 3000 })
      .not.toBe(first)
  })

  test('日期：显示 年月日 + 星期', async ({ page }) => {
    // WHY: 日期需与原版一致，为中文「YYYY年M月D日 星期X」格式
    const date = page.locator('#date')
    await expect(date).toBeVisible()
    await expect(date).toHaveText(/\d{4}年\d{1,2}月\d{1,2}日\s*星期[日一二三四五六]/)
  })

  test('一言：渲染一条预置名言', async ({ page }) => {
    // WHY: 一言名言功能迁移后应从预置集合中取一条渲染，非空且合法
    const quote = page.locator('#quote')
    await expect(quote).toBeVisible()
    const text = (await quote.textContent())?.trim() ?? ''
    expect(text.length).toBeGreaterThan(0)
    expect(KNOWN_QUOTES).toContain(text)
  })
})
