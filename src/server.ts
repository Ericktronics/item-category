import type { Request, Response } from 'express';
import { query } from './db-con/db';
import app from './index';
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;


async function main() {
  try {
    const result = await query('SELECT NOW() as now');
    console.log('DB time:', result.rows[0].now);
  } catch (err) {
    console.error('Error querying the database:', err);
    process.exit(1);
  }
}


app.get('/api/healthCheck', (req: Request, res: Response) => {
  main();
  res.json({ message: 'Hello from TypeScript + Express!' });
});


app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});