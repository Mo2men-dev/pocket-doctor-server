import client from '../database/database';

export interface Symptom {
  id?: number;
  name: string;
}

export class SymptomStore {
  async index(): Promise<Symptom[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM symptoms';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get symptoms. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Symptom> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM symptoms WHERE id=($1)';

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find symptom ${id}. Error: ${err}`);
    }
  }

  async create(symptom: Symptom): Promise<Symptom> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO symptoms (name) VALUES ($1) RETURNING *';

      const result = await conn.query(sql, [symptom.name]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new symptom. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Symptom> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM symptoms WHERE id=($1) RETURNING *';

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete symptom ${id}. Error: ${err}`);
    }
  }
}
