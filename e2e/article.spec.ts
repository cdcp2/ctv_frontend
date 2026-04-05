import { expect, test } from '@playwright/test';

test('renders article timestamps in Colombia time and rotates inline ads', async ({ page }) => {
  await page.goto('/article/colombia-time');

  await expect(page.getByRole('heading', { name: 'Noticia E2E con hora Colombia' })).toBeVisible();
  await expect(page.getByText(/10:00/)).toBeVisible();
  await expect(page.getByText(/15:00/)).toHaveCount(0);

  await expect(page.locator('img[alt="Banner inline 1"]')).toBeVisible();
  await expect(page.locator('img[alt="Banner inline 2"]')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('img[alt="Banner footer"]')).toBeVisible();
});
