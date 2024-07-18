import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.ENV;
let client: Pool;

if (ENV === 'prod') {
  client = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432,
    ssl: true
  });
}

if (ENV === 'dev') {
  client = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'pockect_doctor_dev',
    port: 5432
  });
}

if (ENV === 'test') {
  client = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'pockect_doctor_test',
    port: 5432
  });
}

export default client!;
