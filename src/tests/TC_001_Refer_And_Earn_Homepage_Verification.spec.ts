import { test, expect } from '../resources/fixtures/test.fixture';
import { ReferEarnActions } from '../resources/actions/referEarn.actions';

test('User can access refer and earn dashboard page', async ({ page, loggedIn }) => {
    test.slow();
    const referEarnActions = new ReferEarnActions(page);

    referEarnActions.clickReferEarnTab();

    await referEarnActions.enterCity('Bangalore');

    await referEarnActions.clickReferButton();

    await expect(referEarnActions.basicPropertyDetailsHeader).toBeVisible();

});