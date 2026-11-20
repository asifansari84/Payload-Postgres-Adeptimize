import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('shows the homepage headline and scrolls to the introduction', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Adeptimize/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /Industry Experts Delivering Marketing Excellence/,
    )

    await page.getByRole('link', { name: 'Explore Adeptimize' }).click()
    await expect(page).toHaveURL(/#adeptimize-introduction$/)
    await expect(page.locator('#adeptimize-introduction')).toBeInViewport()
  })
})
