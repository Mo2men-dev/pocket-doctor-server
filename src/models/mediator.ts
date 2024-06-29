import client from '../database/database';

export interface Mediator {
  id?: number;
  condition_id: number;
  symptom_id: number;
}

export class MediatorStore {
  async index(): Promise<Mediator[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM conditions_symptoms';

      const result = await conn.query(sql);

      conn.release();

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Mediators. Error: ${err}`);
    }
  }

  async searchConditions(condition_name: string): Promise<Mediator[]> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT condition_id FROM conditions_symptoms WHERE condition_id=(SELECT conditions.id FROM conditions WHERE conditions.name LIKE $1)';

      const result = await conn.query(sql, ['%' + condition_name + '%']);

      conn.release();

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not find conditions for symptom ${condition_name}. Error: ${err}`
      );
    }
  }

  async searchSymptoms(symptom_name: string): Promise<Mediator[]> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT symptom_id FROM conditions_symptoms WHERE symptom_id=(SELECT id FROM symptoms WHERE name LIKE $1)';

      const result = await conn.query(sql, ['%' + symptom_name + '%']);

      conn.release();

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not find symptoms for condition ${symptom_name}. Error: ${err}`
      );
    }
  }

  async create(mediator: Mediator): Promise<Mediator> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO conditions_symptoms (condition_id, symptom_id) VALUES($1, $2) RETURNING *';

      const result = await conn.query(sql, [
        mediator.condition_id,
        mediator.symptom_id
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new Mediator. Error: ${err}`);
    }
  }
}
