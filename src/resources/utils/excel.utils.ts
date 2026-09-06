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

        return XLSX.readFile(
            excelConfig.filePath
        );
    }

    /**
     * Get worksheet by sheet name.
     */
    private static getWorksheet(
        workbook: XLSX.WorkBook,
        sheetName: string
    ): XLSX.WorkSheet {

        const worksheet =
            workbook.Sheets[sheetName];

        if (!worksheet) {
            throw new Error(
                `Sheet '${sheetName}' not found in ${excelConfig.filePath}`
            );
        }

        return worksheet;
    }

    /**
     * Write DB output into one or more Excel columns
     * for a particular testcase.
     *
     * Example:
     *
     * writeToExcel(
     *     'Refer',
     *     'TC_002',
     *     'city,monthly_rent,security_deposit',
     *     dbResult
     * );
     */
    static writeToExcel(
        sheetName: string,
        testCaseName: string,
        columnNames: string,
        dbOutput: Record<string, any>[]
    ): void {

        const workbook =
            ExcelUtils.loadWorkbook();

        const worksheet =
            ExcelUtils.getWorksheet(
                workbook,
                sheetName
            );

        if (!dbOutput || dbOutput.length === 0) {
            throw new Error(
                'Database output is empty. Nothing to write to Excel.'
            );
        }

        // Take the first row returned by the DB
        const dbRow = dbOutput[0];

        // Convert worksheet into rows
        const rows =
            XLSX.utils.sheet_to_json<Record<string, any>>(
                worksheet,
                {
                    defval: ''
                }
            );

        // Find testcase row
        const rowIndex =
            rows.findIndex(
                row =>
                    String(row.testcase_name).trim() ===
                    testCaseName.trim()
            );

        if (rowIndex === -1) {
            throw new Error(
                `Test case '${testCaseName}' not found in sheet '${sheetName}'`
            );
        }

        // Get Excel headers
        const headerRows =
            XLSX.utils.sheet_to_json<any[]>(
                worksheet,
                {
                    header: 1,
                    defval: ''
                }
            );

        const headers = headerRows[0];

        if (!headers || headers.length === 0) {
            throw new Error(
                `No headers found in sheet '${sheetName}'`
            );
        }

        // Create Excel column map
        const columnMap =
            new Map<string, number>();

        headers.forEach(
            (header, index) => {

                const normalizedHeader =
                    ExcelUtils.normalizeValue(header);

                columnMap.set(
                    normalizedHeader,
                    index
                );
            }
        );

        // Excel row number
        // Row 1 = header
        // Row 2 = first testcase
        const excelRowNumber =
            rowIndex + 2;

        // Convert comma-separated column names to array
        const columns =
            columnNames
                .split(',')
                .map(column => column.trim())
                .filter(column => column.length > 0);

        if (columns.length === 0) {
            throw new Error(
                'No Excel column names were provided.'
            );
        }

        // Update every requested column
        for (const columnName of columns) {

            const normalizedColumnName =
                ExcelUtils.normalizeValue(
                    columnName
                );

            const columnIndex =
                columnMap.get(
                    normalizedColumnName
                );

            if (columnIndex === undefined) {
                throw new Error(
                    `Column '${columnName}' not found in sheet '${sheetName}'`
                );
            }

            // Find matching DB field
            const dbKey =
                Object.keys(dbRow).find(
                    key =>
                        ExcelUtils.normalizeValue(key) ===
                        normalizedColumnName
                );

            if (dbKey === undefined) {
                throw new Error(
                    `Column '${columnName}' was not found in database output.`
                );
            }

            const value =
                dbRow[dbKey];

            // Convert column index to Excel column
            const excelColumn =
                XLSX.utils.encode_col(
                    columnIndex
                );

            // Example: B3, C3, D3
            const cellAddress =
                `${excelColumn}${excelRowNumber}`;

            // Write value
            if (typeof value === 'number') {

                worksheet[cellAddress] = {
                    t: 'n',
                    v: value
                };

            } else if (typeof value === 'boolean') {

                worksheet[cellAddress] = {
                    t: 'b',
                    v: value
                };

            } else {

                worksheet[cellAddress] = {
                    t: 's',
                    v: String(value ?? '')
                };
            }
        }

        // Save workbook once
        XLSX.writeFile(
            workbook,
            excelConfig.filePath
        );
    }

    /**
     * Get test data for a particular testcase.
     *
     * Example:
     *
     * const testData =
     *     ExcelUtils.getTestData('Refer', 'TC_002');
     */
    static getTestData(
        sheetName: string,
        testCaseName: string
    ): Record<string, any> {

        const workbook =
            ExcelUtils.loadWorkbook();

        const worksheet =
            ExcelUtils.getWorksheet(
                workbook,
                sheetName
            );

        const rawRows =
            XLSX.utils.sheet_to_json<Record<string, any>>(
                worksheet,
                {
                    defval: ''
                }
            );

        // Normalize Excel column headers
        const rows =
            rawRows.map(row => {

                const normalizedRow: Record<string, any> = {};

                for (
                    const [key, value]
                    of Object.entries(row)
                ) {

                    const normalizedKey =
                        ExcelUtils.normalizeValue(key);

                    normalizedRow[normalizedKey] =
                        value;
                }

                return normalizedRow;
            });

        // Find testcase row
        const testData =
            rows.find(
                row =>
                    String(row.testcase_name).trim() ===
                    testCaseName.trim()
            );

        if (!testData) {
            throw new Error(
                `Test case '${testCaseName}' not found in sheet '${sheetName}'`
            );
        }

        return testData;
    }
}