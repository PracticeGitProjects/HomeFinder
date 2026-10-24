
import * as XLSX from 'xlsx';
import { excelConfig } from '../config/test.config';

export class ExcelUtils {

    /**
     * Normalize Excel headers, column names and values.
     */
    private static normalizeValue(value: unknown): string {
        return String(value ?? '')
            .replace(/\u00A0/g, ' ')
            .trim()
            .replace(/\s+/g, '_')
            .toLowerCase();
    }

    /**
     * Load the Excel workbook.
     */
    private static loadWorkbook(): XLSX.WorkBook {
        return XLSX.readFile(excelConfig.filePath);
    }

    /**
     * Get worksheet by sheet name.
     */
    private static getWorksheet(
        workbook: XLSX.WorkBook,
        sheetName: string
    ): XLSX.WorkSheet {

        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            throw new Error(
                `Sheet '${sheetName}' not found in ${excelConfig.filePath}`
            );
        }

        return worksheet;
    }

    /**
     * Get test data for a particular testcase.
     */
    static getTestData(
        sheetName: string,
        testCaseName: string
    ): Record<string, any> {

        const workbook = ExcelUtils.loadWorkbook();
        const worksheet = ExcelUtils.getWorksheet(
            workbook,
            sheetName
        );

        const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(
            worksheet,
            { defval: '' }
        );

        const rows = rawRows.map(row => {
            const normalizedRow: Record<string, any> = {};

            for (const [key, value] of Object.entries(row)) {
                normalizedRow[ExcelUtils.normalizeValue(key)] = value;
            }

            return normalizedRow;
        });

        const testData = rows.find(
            row =>
                String(row.testcase_name ?? '').trim() ===
                testCaseName.trim()
        );

        if (!testData) {
            throw new Error(
                `Test case '${testCaseName}' not found in sheet '${sheetName}'`
            );
        }

        return testData;
    }

    /**
     * Write database output into requested Excel columns.
     * Preserves the existing Pune/Mumbai calling convention.
     */
    static writeToExcel(
        sheetName: string,
        testCaseName: string,
        columnNames: string,
        dbOutput: Record<string, any>[]
    ): void {

        const workbook = ExcelUtils.loadWorkbook();
        const worksheet = ExcelUtils.getWorksheet(
            workbook,
            sheetName
        );

        if (!dbOutput || dbOutput.length === 0) {
            throw new Error(
                'Output data is empty. Nothing to write to Excel.'
            );
        }

        const rows = XLSX.utils.sheet_to_json<any[]>(
            worksheet,
            { header: 1, defval: '' }
        );

        const headers = rows[0];

        if (!headers || headers.length === 0) {
            throw new Error(`No headers found in sheet '${sheetName}'`);
        }

        const testcaseColumn = headers.findIndex(
            (header: unknown) =>
                ExcelUtils.normalizeValue(header) === 'testcase_name'
        );

        if (testcaseColumn === -1) {
            throw new Error(
                `Column 'testcase_name' not found in sheet '${sheetName}'`
            );
        }

        const rowIndex = rows.findIndex(
            (row, index) =>
                index > 0 &&
                String(row[testcaseColumn] ?? '').trim() ===
                testCaseName.trim()
        );

        if (rowIndex === -1) {
            throw new Error(
                `Test case '${testCaseName}' not found in sheet '${sheetName}'`
            );
        }

        for (
            const columnName of columnNames
                .split(',')
                .map(column => column.trim())
                .filter(Boolean)
        ) {
            const columnIndex = headers.findIndex(
                (header: unknown) =>
                    ExcelUtils.normalizeValue(header) ===
                    ExcelUtils.normalizeValue(columnName)
            );

            if (columnIndex === -1) {
                throw new Error(
                    `Column '${columnName}' not found in sheet '${sheetName}'`
                );
            }

            const outputKey = Object.keys(dbOutput[0]).find(
                key =>
                    ExcelUtils.normalizeValue(key) ===
                    ExcelUtils.normalizeValue(columnName)
            );

            if (outputKey === undefined) {
                throw new Error(
                    `Output field '${columnName}' was not provided`
                );
            }

            const value = dbOutput[0][outputKey];

            const cellAddress = XLSX.utils.encode_cell({
                r: rowIndex,
                c: columnIndex
            });

            if (typeof value === 'number') {
                worksheet[cellAddress] = { t: 'n', v: value };
            } else if (typeof value === 'boolean') {
                worksheet[cellAddress] = { t: 'b', v: value };
            } else {
                worksheet[cellAddress] = {
                    t: 's',
                    v: String(value ?? '')
                };
            }
        }

        XLSX.writeFile(workbook, excelConfig.filePath);

        console.log(
            `Excel data updated for ${testCaseName}: ${excelConfig.filePath}`
        );
    }

    /**
     * Write Pass/Fail status for a testcase.
     * Creates the status column at the end if it doesn't exist.
     */
    static writeTestResult(
        sheetName: string,
        testCaseName: string,
        status: 'Pass' | 'Fail'
    ): void {

        const workbook = ExcelUtils.loadWorkbook();
        const worksheet = ExcelUtils.getWorksheet(
            workbook,
            sheetName
        );

        const rows = XLSX.utils.sheet_to_json<any[]>(
            worksheet,
            { header: 1, defval: '' }
        );

        const headers = rows[0];

        if (!headers || headers.length === 0) {
            throw new Error(`No headers found in sheet '${sheetName}'`);
        }

        const testcaseColumn = headers.findIndex(
            (header: unknown) =>
                ExcelUtils.normalizeValue(header) === 'testcase_name'
        );

        if (testcaseColumn === -1) {
            throw new Error(
                `Column 'testcase_name' not found in sheet '${sheetName}'`
            );
        }

        const rowIndex = rows.findIndex(
            (row, index) =>
                index > 0 &&
                String(row[testcaseColumn] ?? '').trim() ===
                testCaseName.trim()
        );

        if (rowIndex === -1) {
            throw new Error(
                `Test case '${testCaseName}' not found in sheet '${sheetName}'`
            );
        }

        // Find the existing status column or append one.
        let statusColumn = headers.findIndex(
            (header: unknown) =>
                ExcelUtils.normalizeValue(header) === 'status'
        );

        if (statusColumn === -1) {
            statusColumn = headers.length;

            const headerAddress = XLSX.utils.encode_cell({
                r: 0,
                c: statusColumn
            });

            worksheet[headerAddress] = {
                t: 's',
                v: 'status'
            };
        }

        // Write the result into the matching testcase row.
        const statusAddress = XLSX.utils.encode_cell({
            r: rowIndex,
            c: statusColumn
        });

        worksheet[statusAddress] = {
            t: 's',
            v: status
        };

        // Update the worksheet range.
        const range = worksheet['!ref']
            ? XLSX.utils.decode_range(worksheet['!ref'])
            : {
                s: { r: 0, c: 0 },
                e: { r: 0, c: 0 }
            };

        range.e.r = Math.max(range.e.r, rowIndex);
        range.e.c = Math.max(range.e.c, statusColumn);

        worksheet['!ref'] = XLSX.utils.encode_range(range);

        // Save to the configured workbook path.
        XLSX.writeFile(workbook, excelConfig.filePath);

        console.log('Excel result saved:', {
            filePath: excelConfig.filePath,
            sheetName,
            testCaseName,
            cell: statusAddress,
            status,
            savedValue: worksheet[statusAddress].v
        });

        // Verify the saved value by reopening the workbook.
        const savedWorkbook = XLSX.readFile(excelConfig.filePath);
        const savedWorksheet = ExcelUtils.getWorksheet(
            savedWorkbook,
            sheetName
        );

        const savedCell = savedWorksheet[statusAddress];

        if (!savedCell || savedCell.v !== status) {
            throw new Error(
                `Failed to verify Excel status for ${testCaseName}. ` +
                `Expected '${status}' at ${statusAddress}.`
            );
        }
    }
}
