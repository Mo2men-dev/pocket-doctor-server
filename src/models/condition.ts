import client from '../database/database';
import { Symptom, SymptomStore } from './symptom';

export interface Condition {
  id?: number;
  name: string;
  description?: string;
}

type ConditionWithSymptoms = { condition: Condition; symptoms: string[] };

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
      // join the conditions, conditions_symptoms, and symptoms tables
      // to get all conditions with their associated symptoms
      // and group the results by condition ID
      // much better than making multiple queries, i would say

      const sql = `
          SELECT c.*, s.name as symptom_name
          FROM conditions c
          LEFT JOIN conditions_symptoms cs ON c.id = cs.condition_id
          LEFT JOIN symptoms s ON cs.symptom_id = s.id
        `;

      const result = await conn.query(sql);

      // here we will create an object with the condition ID as the key
      const conditions: { [key: number]: ConditionWithSymptoms } = {};
      result.rows.forEach((row: any) => {
        const conditionId = row.id;
        if (!conditions[conditionId]) {
          // if the condition doesn't exist in the object
          // add the condition to the object if it doesn't exist
          // initialize the symptoms array
          // and remove the symptom_name key from the condition object

          conditions[conditionId] = {
            condition: { name: row.name, description: row.description },
            symptoms: []
          };
        }
        if (row.symptom_name) {
          // if the symptom_name exists, add it to the symptoms array
          conditions[conditionId].symptoms.push(row.symptom_name);
        }
      });

      conn.release();

      return Object.values(conditions);
    } catch (error) {
      console.error('Failed to get conditions with symptoms:', error);
      throw error; // Rethrow or handle as needed
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

  async getAssociatedSymptoms(id: string): Promise<string[] | null> {
    try {
      const symptomStore = new SymptomStore();
      const allSymptoms: Symptom[] = await symptomStore.index();
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions_symptoms WHERE condition_id=($1)';
      const result = await conn.query(sql, [id]);

      const symptomIds = result.rows.map((r: any) => r.symptom_id);
      const symptoms = allSymptoms
        .filter((s) => symptomIds.includes(s.id))
        .map((s) => s.name);

      conn.release();
      return symptoms;
    } catch (err) {
      throw new Error(
        `Could not find symptoms associated with condition ${id}. Error: ${err}`
      );
    }
  }
}
