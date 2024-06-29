import client from '../database/database';
import { Symptom, SymptomStore } from './symptom';

export interface Condition {
  id?: number;
  name: string;
  description?: string;
}

type ConditionWithSymptoms = { condition: Condition; symptoms: Symptom[] };

export class ConditionStore {
  async index(): Promise<Condition[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get conditions. Error: ${err}`);
    }
  }

  async indexWithSymptoms(): Promise<ConditionWithSymptoms[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions';

      // get all conditions with associated symptoms
      const result = await conn.query(sql);
      const conditions = result.rows;
      const conditionIds = conditions.map((c: any) => c.id);
      const conditionsWithSymptoms = await Promise.all(
        conditionIds.map((id: number) => this.showWithSymptoms(id.toString()))
      );

      conn.release();
      return conditionsWithSymptoms.map((c) => c);
    } catch (err) {
      throw new Error(`Could not get conditions. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Condition> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions WHERE id=($1)';

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find condition ${id}. Error: ${err}`);
    }
  }

  async showWithSymptoms(id: string): Promise<ConditionWithSymptoms> {
    try {
      let res = {} as ConditionWithSymptoms;
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions WHERE id=($1)';

      const result = await conn.query(sql, [id]);

      // get the associated symptoms
      const associatedSymptoms = await this.getAssociatedSymptoms(id);

      conn.release();
      res.condition = result.rows[0];
      if (associatedSymptoms) {
        res.symptoms = associatedSymptoms;
      } else {
        res.symptoms = [];
      }

      return res;
    } catch (err) {
      throw new Error(`Could not find condition ${id}. Error: ${err}`);
    }
  }

  async search(name: string): Promise<Condition[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions WHERE name ILIKE $1';

      const result = await conn.query(sql, ['%' + name + '%']);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not find conditions with name ${name}. Error: ${err}`
      );
    }
  }

  async create(condition: Condition): Promise<Condition> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO conditions (name, description) VALUES($1, $2) RETURNING *';

      const result = await conn.query(sql, [
        condition.name,
        condition.description
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new condition. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Condition> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM conditions WHERE id=($1) RETURNING *';

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete condition ${id}. Error: ${err}`);
    }
  }

  async getAssociatedSymptoms(id: string): Promise<Condition[] | null> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions_symptoms WHERE condition_id=($1)';
      const result = await conn.query(sql, [id]);

      const associatedSymptoms = result.rows;
      const symptomIds = associatedSymptoms.map((s: any) => s.symptom_id);
      const symptoms = await Promise.all(
        symptomIds.map((id: number) => new SymptomStore().show(id.toString()))
      );

      conn.release();
      return symptoms;
    } catch (err) {
      throw new Error(
        `Could not find symptoms associated with condition ${id}. Error: ${err}`
      );
    }
  }
}
