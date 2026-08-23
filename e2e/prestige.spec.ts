import { expect, test } from '@playwright/test'

const consoleErrorsByPage = new WeakMap<object, string[]>()

test.beforeEach(async ({ page }) => {
  const consoleErrors: string[] = []
  consoleErrorsByPage.set(page, consoleErrors)
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  await page.goto('/#prestige', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
})

test('renders and persists the complete interactive Prestige tree', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Prestige Planner' })).toBeVisible()
  await expect(page.locator('.prestige-node')).toHaveCount(102)
  await expect(page.locator('.prestige-tier')).toHaveCount(6)

  const swiftStart = page.getByRole('button', { name: /Swift Start.*Rank 0 of 3/ })
  await swiftStart.click()
  await expect(page.getByRole('button', { name: /Swift Start.*Rank 1 of 3/ })).toBeVisible()

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: /Swift Start.*Rank 1 of 3/ })).toBeVisible()
  await expect(page.getByText('PP spent').locator('..').getByText('1', { exact: true })).toBeVisible()

  await page.screenshot({ path: 'docs/verification/prestige-desktop.png', fullPage: true })
  expect(consoleErrorsByPage.get(page)).toEqual([])
})

test('makes exact effect and source data keyboard-accessible', async ({ page }) => {
  const swiftStart = page.getByRole('button', { name: /Swift Start.*Rank 0 of 3/ })
  await swiftStart.focus()

  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toContainText('Start the game with 1/2/3 runners.')
  await expect(tooltip).toContainText('Next rank cost 1 PP')
  await expect(tooltip).toContainText('Installed build 24333424')

  await swiftStart.click()
  await page.getByRole('button', { name: 'Decrease Swift Start rank' }).click()
  await expect(page.getByRole('button', { name: /Swift Start.*Rank 0 of 3/ })).toBeVisible()

  const lockedNode = page.getByRole('button', { name: /Cyberdwarf.*Locked.*12 PP spent/ })
  await lockedNode.focus()
  await expect(lockedNode).toHaveAttribute('aria-disabled', 'true')
  await expect(tooltip).toContainText('Tier 2 unlocks at 12 PP spent')

  await page.getByLabel('Ascension Rank').fill('2')
  const ascensionLimited = page.getByRole('button', { name: /Endless Invocations.*Rank 0 of 2/ })
  await ascensionLimited.focus()
  await expect(tooltip).toContainText('Purchase limit: 1 per Ascension Rank, 15 maximum.')
})

test('keeps tier rails usable at a compact viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload({ waitUntil: 'networkidle' })

  await expect(page.getByLabel('Available Prestige Points')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Tier 1' })).toBeVisible()
  await expect(page.locator('.prestige-tree')).toHaveCSS('overflow-x', 'auto')
  await page.screenshot({ path: 'docs/verification/prestige-mobile.png', fullPage: true })
})
