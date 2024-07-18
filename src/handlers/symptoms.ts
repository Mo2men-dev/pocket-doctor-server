import express, { Request, Response } from 'express';
import { Symptom, SymptomStore } from '../models/symptom';
import { authMiddleware } from '../middleware/auth';

const store = new SymptomStore();

const index = async (_req: Request, res: Response) => {
  try {
    const symptoms = await store.index();
    res.json(symptoms);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const symptom = await store.show(req.params.id);
    res.json(symptom);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const symptom: Symptom = {
      name: req.body.name
    };
    const newSymptom = await store.create(symptom);
    res.json(newSymptom);
  } catch (err) {
    res.status(400);
    console.log(err);
    res.json({ err });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const symptoms = (app: express.Application) => {
  app.get('/symptoms', authMiddleware, index);
  app.get('/symptoms/:id', authMiddleware, show);
  app.post('/symptoms/add', authMiddleware, create);
  app.delete('/symptoms/:id/delete', authMiddleware, destroy);
};

export default symptoms;
