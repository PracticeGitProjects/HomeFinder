import { test, expect } from '../resources/fixtures/test.fixture';
import { ReferEarnActionsEndToEnd } from '../resources/actions/referEarnEndToEnd.actions';
import { ExcelUtils } from '../resources/utils/excel.utils';
import { DatabaseUtils } from '../resources/utils/database.utils';

test(
    'User can add details upto refer for Mumbai City',
    async ({ page }) => {

        const testCaseName = 'TC_002';

        // =====================================================
        // 1. PAGE IS ALREADY AUTHENTICATED
        // =====================================================
        //
        // auth.json is automatically loaded by playwright.config.ts
        //
        await page.goto('/');

        console.log('Current URL:', page.url());


        // =====================================================
        // 2. EXECUTE DB QUERY
        // =====================================================

        const dbResult =
            await DatabaseUtils.executeQuery(`
                SELECT
                    city
                FROM public.properties
                WHERE id = 2;
            `);

        console.log(
            `DB Result for ${testCaseName}:`,
            dbResult
        );


        // =====================================================
        // 3. WRITE DB VALUE INTO EXCEL
        // =====================================================

        ExcelUtils.writeToExcel(
            'Refer',
            testCaseName,
            'city',
            dbResult
        );


        // =====================================================
        // 4. CREATE ACTION CLASS
        // =====================================================

        const referEarnActionsEndToEnd =
            new ReferEarnActionsEndToEnd(
                page,
                testCaseName
            );


        // =====================================================
        // 5. Test steps
        // =====================================================
    
        await referEarnActionsEndToEnd.clickReferEarnTab();
    
        await referEarnActionsEndToEnd.enterCity();
    
        await referEarnActionsEndToEnd.clickReferButton();
    
        await expect(
            referEarnActionsEndToEnd.basicPropertyDetailsHeader
        ).toBeVisible();
    
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
    
        await referEarnActionsEndToEnd.selectReferralReward();


});