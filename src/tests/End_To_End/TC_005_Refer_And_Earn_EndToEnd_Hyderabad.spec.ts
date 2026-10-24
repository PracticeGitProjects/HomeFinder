import { test, expect } from '../../resources/fixtures/test.fixture';
import { ReferEarnActionsEndToEnd } from '../../resources/actions/referEarnEndToEnd.actions';
import { ExcelUtils } from '../../resources/utils/excel.utils';

test(
    'User can add details upto refer for Hyderabad City',
    async ({ page }) => {

        const sheetName = 'Refer';
        const testCaseName = 'TC_005';

        let testFailed = false;
        let originalError: unknown;

        try {
            // Step 1: Open the authenticated application.
            // auth.json is loaded by playwright.config.ts.
            await page.goto('/');

            console.log('Current URL:', page.url());

            // Step 2: Fetch Hyderabad test data from Excel.
            const testData = ExcelUtils.getTestData(
                sheetName,
                testCaseName
            );

            console.log(
                `Excel test data for ${testCaseName}:`,
                testData
            );

            // Step 3: Initialize Refer and Earn actions.
            const referEarnActionsEndToEnd =
                new ReferEarnActionsEndToEnd(
                    page,
                    testCaseName
                );

            // Step 4: Open Refer and Earn.
            await referEarnActionsEndToEnd.clickReferEarnTab();

            await referEarnActionsEndToEnd.enterCity();

            await referEarnActionsEndToEnd.clickReferButton();

            await expect(
                referEarnActionsEndToEnd.basicPropertyDetailsHeader
            ).toBeVisible();

            // Step 5: Enter basic property details.
            await referEarnActionsEndToEnd.selectCity();

            await referEarnActionsEndToEnd.addLocality();

            await referEarnActionsEndToEnd.clickLocalityFirstOption();

            await referEarnActionsEndToEnd.selectRelationshipWithProperty();

            await referEarnActionsEndToEnd.selectListingType();

            await referEarnActionsEndToEnd.selectPreferredTenants();

            await referEarnActionsEndToEnd.selectMonthlyRent();

            await referEarnActionsEndToEnd.selectSecurityDeposit();

            await referEarnActionsEndToEnd.selectBhkType();

            await referEarnActionsEndToEnd.selectFurnishing();

            await referEarnActionsEndToEnd.selectPropertyType();

            await referEarnActionsEndToEnd.addStreetAddress();

            await referEarnActionsEndToEnd.addBuildingDetails();

            await referEarnActionsEndToEnd.addLandmark();

            await referEarnActionsEndToEnd.clickBasicContinue();

            // Step 6: Enter additional property details.
            await referEarnActionsEndToEnd.selectParking();

            await referEarnActionsEndToEnd.selectAmenities();

            await referEarnActionsEndToEnd.selectDietPreference();

            await referEarnActionsEndToEnd.selectPetPreference();

            await referEarnActionsEndToEnd.selectBuiltUpArea();

            await referEarnActionsEndToEnd.selectFloor();

            await referEarnActionsEndToEnd.selectAvailableFrom();

            await referEarnActionsEndToEnd.selectRentalAgreement();

            await referEarnActionsEndToEnd.selectNearbyLocality();

            await referEarnActionsEndToEnd.addFeature();

            await referEarnActionsEndToEnd.addDescription();

            await referEarnActionsEndToEnd.clickAdditionalContinue();

            // Step 7: Select referral reward.
            await referEarnActionsEndToEnd.selectReferralReward();

        } catch (error) {
            testFailed = true;
            originalError = error;

            console.error(
                `Hyderabad test failed for ${testCaseName}:`,
                error
            );
        }

        // Step 8: Write the final result to Excel.
        try {
            ExcelUtils.writeTestResult(
                sheetName,
                testCaseName,
                testFailed ? 'Fail' : 'Pass'
            );
        } catch (excelError) {
            console.error(
                `Failed to write Excel status for ${testCaseName}:`,
                excelError
            );

            // Fail the test if Excel writing fails.
            throw excelError;
        }

        // Step 9: Keep the original UI failure visible to Playwright.
        if (testFailed) {
            throw originalError;
        }

        console.log(
            `Completed Refer a Home flow for ${testCaseName}`
        );
    }
);