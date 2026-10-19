import { test, expect } from '@playwright/test';

test('HomeFinder homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(
        'https://homefinder-demo.pages.dev/'
    );

    await expect(page.getByRole('main')).toBeVisible();
});