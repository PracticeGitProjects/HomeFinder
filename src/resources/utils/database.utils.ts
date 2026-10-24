
import { Client, QueryResultRow } from 'pg';

export class DatabaseUtils {

    static async executeQuery<
        T extends QueryResultRow = QueryResultRow
    >(
        query: string,
        values: unknown[] = []
    ): Promise<T[]> {

        const client = new Client({
            host: process.env.SUPABASE_DB_HOST,
            port: Number(process.env.SUPABASE_DB_PORT ?? 5432),
            database: process.env.SUPABASE_DB_NAME,
            user: process.env.SUPABASE_DB_USER,
            password: process.env.SUPABASE_DB_PASSWORD,
            ssl: {
                rejectUnauthorized: false
            }
        });

        try {
            // Validate database configuration
            const requiredEnvVariables = [
                'SUPABASE_DB_HOST',
                'SUPABASE_DB_NAME',
                'SUPABASE_DB_USER',
                'SUPABASE_DB_PASSWORD'
            ];

            const missingVariables = requiredEnvVariables.filter(
                (variable) => !process.env[variable]
            );

            if (missingVariables.length > 0) {
                throw new Error(
                    `Missing database environment variables: ${missingVariables.join(', ')}`
                );
            }

            // Connect to PostgreSQL
            await client.connect();

            // Log database connection details
            const connectionInfo = await client.query<{
                database_name: string;
                current_schema: string;
                server_address: string | null;
            }>(`
                SELECT
                    current_database() AS database_name,
                    current_schema() AS current_schema,
                    inet_server_addr()::text AS server_address;
            `);

            console.log(
                'Database connection information:',
                connectionInfo.rows
            );

            // Execute the requested query
            const result = await client.query<T>(query, values);

            console.log(
                `Database query executed successfully. Rows returned: ${result.rowCount ?? 0}`
            );

            return result.rows;

        } catch (error) {

            console.error('\n========== DATABASE ERROR ==========');
            console.error('SQL query:', query);
            console.error('Query parameters:', values);

            if (error instanceof Error) {

                const pgError = error as Error & {
                    code?: string;
                    detail?: string;
                    hint?: string;
                    where?: string;
                    position?: string;
                    schema?: string;
                    table?: string;
                    column?: string;
                    constraint?: string;
                };

                console.error('Error message:', pgError.message);
                console.error('PostgreSQL error code:', pgError.code);
                console.error('Detail:', pgError.detail);
                console.error('Hint:', pgError.hint);
                console.error('Where:', pgError.where);
                console.error('Position:', pgError.position);
                console.error('Schema:', pgError.schema);
                console.error('Table:', pgError.table);
                console.error('Column:', pgError.column);
                console.error('Constraint:', pgError.constraint);
            } else {
                console.error('Unknown database error:', error);
            }

            console.error('====================================\n');

            throw error;

        } finally {

            // Close the connection safely
            if (client) {
                await client.end().catch((closeError: unknown) => {
                    console.error(
                        'Error while closing database connection:',
                        closeError
                    );
                });
            }
        }
    }
}
