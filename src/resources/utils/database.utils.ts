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
            port: Number(process.env.SUPABASE_DB_PORT),
            database: process.env.SUPABASE_DB_NAME,
            user: process.env.SUPABASE_DB_USER,
            password: process.env.SUPABASE_DB_PASSWORD
        });

        try {

            await client.connect();

            const result =
                await client.query<T>(
                    query,
                    values
                );

            return result.rows;

        } finally {

            await client.end();
        }
    }
}