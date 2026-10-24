import { expect, Page } from '@playwright/test';
import { ReferEarnActionsEndToEnd } from '../actions/referEarnEndToEnd.actions';
import { ExcelUtils } from '../utils/excel.utils';

export async function executeReferEarnEndToEnd(
    page: Page,
    testCaseName: string
): Promise<void> {

    // Step 1: Open the authenticated application.
    await page.goto('/');

    console.log('Current URL:', page.url());

    // Step 2: Read test data from Excel.
    const testData = ExcelUtils.getTestData(
        'Refer',
        testCaseName
    );

    console.log(
        `Excel test data for ${testCaseName}:`,
        testData
    );

    // Step 3: Initialize the existing action class.
    const actions = new ReferEarnActionsEndToEnd(
        page,
        testCaseName
    );

    // Step 4: Open Refer and Earn.
    await actions.clickReferEarnTab();
    await actions.enterCity();
    await actions.clickReferButton();

    await expect(
        actions.basicPropertyDetailsHeader
    ).toBeVisible();

    // Step 5: Enter basic property details.
    await actions.selectCity();
    await actions.addLocality();
    await actions.clickLocalityFirstOption();
    await actions.selectRelationshipWithProperty();
    await actions.selectListingType();
    await actions.selectPreferredTenants();
    await actions.selectMonthlyRent();
    await actions.selectSecurityDeposit();
    await actions.selectBhkType();
    await actions.selectFurnishing();
    await actions.selectPropertyType();
    await actions.addStreetAddress();
    await actions.addBuildingDetails();
    await actions.addLandmark();
    await actions.clickBasicContinue();

    // Step 6: Enter additional property details.
    await actions.selectParking();
    await actions.selectAmenities();
    await actions.selectDietPreference();
    await actions.selectPetPreference();
    await actions.selectBuiltUpArea();
    await actions.selectFloor();
    await actions.selectAvailableFrom();
    await actions.selectRentalAgreement();
    await actions.selectNearbyLocality();
    await actions.addFeature();
    await actions.addDescription();
    await actions.clickAdditionalContinue();

    // Step 7: Select referral reward.
    await actions.selectReferralReward();
}