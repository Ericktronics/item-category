import { 
  Pool, 
  PoolClient, 
  QueryResult, 
  QueryResultRow 
} from "pg";
import { config } from "dotenv";

config({
  path: "./.env",
});

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE || "my_database",
        user: process.env.PGUSER || "my_user",
        password: process.env.PGPASSWORD,
      }
);

// Optional: simple wrapper for queries
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

// Optional: get a client for transactions
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

// Graceful shutdown helper
export async function closePool(): Promise<void> {
  await pool.end();
}
