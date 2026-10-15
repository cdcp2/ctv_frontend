import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  for (const format of ['texto', 'html']) {
    test(`párrafos ${format} a ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto(`/article/parrafos-${format}`);
      // Astro's development toolbar overlaps the cookie buttons on small screens.
      await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
      await page.getByRole('button', { name: 'No, gracias' }).click();
      const content = page.locator('.article-content');
      const paragraphs = content.locator(':scope > p');
      await expect(paragraphs).toHaveCount(3);
      await expect(content.locator('br')).toHaveCount(1);

      // Check actual browser geometry, not just the existence of paragraph tags.
      const boxes = await paragraphs.evaluateAll(nodes => nodes.map(node => {
        const rect = node.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom };
      }));
      expect(boxes[1].top - boxes[0].bottom).toBeGreaterThanOrEqual(16);
      expect(boxes[2].top - boxes[1].bottom).toBeGreaterThanOrEqual(16);

      const breakPosition = await content.locator('br').evaluate(br => {
        const before = document.createRange();
        before.selectNodeContents(br.previousSibling!);
        const after = document.createRange();
        after.selectNodeContents(br.nextSibling!);
        const beforeRects = before.getClientRects();
        return {
          previousBottom: beforeRects[beforeRects.length - 1].bottom,
          nextTop: after.getClientRects()[0].top,
        };
      });
      expect(breakPosition.nextTop).toBeGreaterThan(breakPosition.previousBottom);

      if (format === 'texto') {
        await expect(paragraphs.last()).toContainText('5 < 10 & 20 > 15');
      } else {
        await expect(content.locator('strong')).toHaveText('texto destacado');
        await expect(content.getByRole('link', { name: 'un enlace' })).toHaveAttribute('href', '/');
      }
      expect(await content.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      const screenshotPath = testInfo.outputPath(`parrafos-${format}-${viewport.width}.png`);
      await content.screenshot({ path: screenshotPath });
      await testInfo.attach(`parrafos-${format}-${viewport.width}`, {
        path: screenshotPath,
        contentType: 'image/png',
      });
    });
  }
}
