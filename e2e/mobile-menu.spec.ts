import { test, expect } from '@playwright/test';

test.describe('Mobile menu', () => {
  test('should open and close on button click', async ({ page }) => {
    // App needs to be running for e2e tests to work
    await page.goto('/');

    // Resize the window to mobile view
    await page.setViewportSize({ width: 425, height: 720 });

    // Open menu
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await expect(page.getByText('The Verge')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Find Offers' })).not.toBeVisible();

    // Close menu
    await page.getByRole('button', { name: 'Close menu' }).click();
    const findOffersBtn = page.locator('text=Find Offers');
    // Wait for CSS animation to finish
    await findOffersBtn.waitFor({ state: 'visible', timeout: 500 });
    await expect(findOffersBtn).toBeVisible();
  });
});
