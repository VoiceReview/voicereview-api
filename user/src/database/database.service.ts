import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
    private m_pool: Pool; // the database connection pool

    constructor() {
        this.m_pool = new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: parseInt(process.env.POSTGRES_PORT)
        });
    }

    /**
     * Method to execute a parameterized query
     * @param text the query string with $1, $2, etc. placeholders
     * @param params the values to substitute the placeholders with 
     * @returns a promise that resolves to a QueryResult 
     * @note cast the result to the appropriate type
     */
    async query(text: string, params: any[]): Promise<QueryResult> {
        const start = Date.now();
        const res = await this.m_pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    }
}
