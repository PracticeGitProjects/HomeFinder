import { test, expect } from '../resources/fixtures/test.fixture';
import { ReferEarnActions } from '../resources/actions/referEarn.actions';

test('User can access refer and earn dashboard page', async ({ page }) => {
    test.slow();
    await page.goto('/');
    const referEarnActions = new ReferEarnActions(page);
    console.log('TC_001 Current URL:', page.url());

    referEarnActions.clickReferEarnTab();

    await referEarnActions.enterCity('Bangalore');

    await referEarnActions.clickReferButton();

    await expect(referEarnActions.basicPropertyDetailsHeader).toBeVisible();

});