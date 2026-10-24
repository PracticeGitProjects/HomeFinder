import { test as base, expect } from '@playwright/test';
import { LoginActions } from '../actions/login.actions';

type TestFixtures = {
    loggedIn: void;
};

export const test = base.extend<TestFixtures>({

    loggedIn: async ({ page }, use) => {

        const loginActions = new LoginActions(page);

        // Open login page
        await page.goto('/login');

        // Enter login credentials
        await loginActions.enterEmail(
            process.env.TEST_USER_EMAIL!
        );

        await loginActions.enterEmailPassword(
            process.env.TEST_USER_PASSWORD!
        );

        await loginActions.clickSignInButton();

        // Wait until login processing is complete
        await page.waitForLoadState('networkidle');

        // Verify that authentication actually happened
        const loginLink = page
            .getByRole('banner')
            .getByRole('link', { name: 'Login' });

        await expect(loginLink).not.toBeVisible();

        console.log(
            'Login successful. Current URL:',
            page.url()
        );

        // Save authenticated state
        await page.context().storageState({
            path: 'src/resources/auth/auth.json'
        });

        console.log(
            'Authentication state saved to auth.json'
        );

        await use();
    },
});

export { expect };