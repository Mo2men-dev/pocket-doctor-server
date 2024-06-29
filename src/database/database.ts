import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.ENV;
let client: Pool;

if (ENV === 'dev') {
  client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
}

if (ENV === 'test') {
  client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export default client!;
