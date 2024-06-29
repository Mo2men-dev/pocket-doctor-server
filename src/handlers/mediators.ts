import express, { Request, Response } from 'express';
import { Mediator, MediatorStore } from '../models/mediator';
import { Condition, ConditionStore } from '../models/condition';
import { Symptom, SymptomStore } from '../models/symptom';

const store = new MediatorStore();
const conditionStore = new ConditionStore();
const symptomStore = new SymptomStore();

const index = async (_req: Request, res: Response) => {
  try {
    const mediators = await store.index();
    res.json(mediators);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const mediator: Mediator = {
      condition_id: req.body.condition_id,
      symptom_id: req.body.symptom_id
    };

    const newMediator = await store.create(mediator);
    res.json(newMediator);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const searchConditions = async (req: Request, res: Response) => {
  try {
    const mediators = await store.searchConditions(req.params.condition_name);
    res.json(mediators);
  } catch (err) {
    res.status(400);
    console.log(err);
    res.json({ err });
  }
};

const searchSymptoms = async (req: Request, res: Response) => {
  try {
    const mediators = await store.searchSymptoms(req.params.symptom_name);
    res.json(mediators);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const createFromName = async (req: Request, res: Response) => {
  try {
    let cond_id: number | undefined;
    let symp_id: number | undefined;

    const condition_name = req.body.condition_name;
    const symptom_name = req.body.symptom_name;

    const cond = await store.searchConditions(condition_name);
    const symp = await store.searchSymptoms(symptom_name);

    if (cond.length === 0) {
      const condition: Condition = {
        name: condition_name
      };

      const newCondition = await conditionStore.create(condition);
      cond_id = newCondition.id;
    } else {
      cond_id = cond[0].condition_id;
    }

    if (symp.length === 0) {
      const symptom: Symptom = {
        name: symptom_name
      };

      const newSymptom = await symptomStore.create(symptom);
      symp_id = newSymptom.id;
    } else {
      symp_id = symp[0].symptom_id;
    }

    const mediator: Mediator = {
      condition_id: cond_id!,
      symptom_id: symp_id!
    };

    const newMediator = await store.create(mediator);
    res.json(newMediator);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const mediator = (app: express.Application) => {
  app.get('/mediator', index);
  app.get('/mediator/conditions/:condition_name', searchConditions);
  app.get('/mediator/symptoms/:symptom_name', searchSymptoms);
  app.post('/mediator/add', create);
};

export default mediator;
