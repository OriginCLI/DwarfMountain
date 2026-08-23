import { expect, test } from '@playwright/test'

test('renders the accessible companion shell without console errors', async ({ page }) => {
  const consoleErrors: string[] = []
  const failedResponses: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const location = message.location()
      consoleErrors.push(`${message.text()} @ ${location.url}:${location.lineNumber}`)
    }
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`)
    }
  })

  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByRole('heading', { name: 'Dwarf Eats Mountain Companion' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Prestige', exact: true })).toHaveAttribute('href', '#prestige')
  await page.screenshot({ path: 'docs/verification/foundation-desktop.png', fullPage: true })

  expect({ consoleErrors, failedResponses }).toEqual({ consoleErrors: [], failedResponses: [] })
})

test('keeps the Prestige entry point visible at a compact viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })

  await expect(page.getByRole('link', { name: 'Prestige', exact: true })).toBeVisible()
})
