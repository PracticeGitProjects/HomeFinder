import { test } from '../../resources/fixtures/test.fixture';
import { ExcelUtils } from '../../resources/utils/excel.utils';
import { executeReferEarnEndToEnd } from '../../resources/flows/referEarnEndToEnd.flow';

test(
    'User can add details upto refer for Bangalore City',
    async ({ page }) => {

        const sheetName = 'Refer';
        const testCaseName = 'TC_003';

        let testFailed = false;
        let originalError: unknown;

        try {
            await executeReferEarnEndToEnd(
                page,
                testCaseName
            );

        } catch (error) {
            testFailed = true;
            originalError = error;

            console.error(
                `Bangalore test failed for ${testCaseName}:`,
                error
            );
        }

        // Write the final status to Excel.
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

            throw excelError;
        }

        // Report the original UI failure to Playwright.
        if (testFailed) {
            throw originalError;
        }

        console.log(
            `Completed Bangalore test: ${testCaseName}`
        );
    }
);