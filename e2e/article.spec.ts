import { expect, test } from '@playwright/test';

test('renders article timestamps in Colombia time and rotates inline ads', async ({ page }) => {
  // Keep the first ad in place until its lazy-loaded image has entered the viewport.
  const now = new Date('2026-10-15T12:00:00Z');
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.goto('/article/colombia-time');

  await expect(page.getByRole('heading', { name: 'Noticia E2E con hora Colombia' })).toBeVisible();
  await expect(page.getByText(/10:00/)).toBeVisible();
  await expect(page.getByText(/15:00/)).toHaveCount(0);

  await page.locator('.manual-ad-slot[data-position="article_inline"]').scrollIntoViewIfNeeded();
  await expect(page.locator('img[alt="Banner inline 1"]')).toBeVisible();
  await page.clock.runFor(2100);
  await expect(page.locator('img[alt="Banner inline 2"]')).toBeVisible({ timeout: 5000 });
  await page.locator('.manual-ad-slot[data-position="article_footer"]').scrollIntoViewIfNeeded();
  await expect(page.locator('img[alt="Banner footer"]')).toBeVisible();
});
