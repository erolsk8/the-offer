import { test, expect, type Page } from '@playwright/test';

const dummyOffer = {
  name: 'Cool new offer',
  description: 'Mode details about the offer.',
  price: 2999,
};

/**
 * Intercept the network request and provide a mock response.
 * Because original responses are random.
 */
const mockOffersResponse = async (page: Page, body: any): Promise<void> => {
  await page.route(/.*\/offers.*/, (route) => {
    void route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
};

test.beforeEach(async ({ page }) => {
  // App needs to be running for e2e tests to work
  await page.goto('/');
});

test.describe('Offers', () => {
  test('should show one offer', async ({ page }) => {
    await mockOffersResponse(page, [dummyOffer]);

    await page.getByLabel('Please enter your address').fill('Some Address 123');
    await page.getByRole('button', { name: 'Check' }).click();

    const offerContent = page.locator('text=Cool new offer');
    await offerContent.waitFor({ state: 'visible', timeout: 3000 });
    await expect(offerContent).toBeVisible();
    expect(await offerContent.count()).toEqual(1);

    await expect(page.getByRole('heading', { name: dummyOffer.name })).toBeVisible();
    await expect(page.getByText('€ 29,99')).toBeVisible();
  });

  test('should show two offers', async ({ page }) => {
    await mockOffersResponse(page, [dummyOffer, dummyOffer]);

    await page.getByLabel('Please enter your address').fill('Some Address 123');
    await page.getByRole('button', { name: 'Check' }).click();

    const offerContent = page.locator('text=Order Now');
    await expect(offerContent).toHaveCount(2, { timeout: 3000 });
    await expect(offerContent.first()).toBeVisible();
    await expect(offerContent.nth(1)).toBeVisible();
  });

  test('should show message for no offers', async ({ page }) => {
    await mockOffersResponse(page, []);

    await page.getByLabel('Please enter your address').fill('Some Address 123');
    await page.getByRole('button', { name: 'Check' }).click();

    const offerContent = page.locator(
      'text=No offers were found for the provided address, please try a different one.',
    );
    await offerContent.waitFor({ state: 'visible', timeout: 3000 });
    await expect(offerContent).toBeVisible();
  });

  test('should show an error message for invalid address', async ({ page }) => {
    await page.getByLabel('Please enter your address').fill('Invalid Address');
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.getByText('Address must include a number.')).toBeVisible();
  });
});
