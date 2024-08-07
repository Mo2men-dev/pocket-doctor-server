import express, { Request, Response } from 'express';
import { Condition, ConditionStore } from '../models/condition';
import { authMiddleware } from '../middleware/auth';

const store = new ConditionStore();

const index = async (_req: Request, res: Response) => {
  try {
    const conditions = await store.index();
    res.json(conditions);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const indexWithSymptoms = async (_req: Request, res: Response) => {
  try {
    const conditions = await store.indexWithSymptoms();
    res.json(conditions);
  } catch (err) {
    res.status(400);
    res.json({ err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const condition = await store.show(req.params.id);
    res.json(condition);
  } catch (err) {
    res.status(400);
    console.log(err);
    res.json({ err: `Could not find condition ${req.params.id}` });
  }
};

const showWithSymptoms = async (req: Request, res: Response) => {
  try {
    const condition = await store.showWithSymptoms(req.params.id);
    res.json(condition);
  } catch (err) {
    res.status(400);
    console.log(err);
    res.json({ err: `Could not find condition ${req.params.id}` });
  }
};

const search = async (req: Request, res: Response) => {
  try {
    const conditions = await store.search(req.params.name);
    res.json(conditions);
  } catch (err) {
    res.status(400);
    console.log(err);
    res.json({ err: `Could not find conditions with name ${req.params.name}` });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const condition: Condition = {
      name: req.body.name,
      description: req.body.description
    };
    const newCondition = await store.create(condition);
    res.json(newCondition);
  } catch (err) {
    res.status(400);
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

const conditions = (app: express.Application) => {
  app.get('/conditions', authMiddleware, index);
  app.get('/conditions/all/symptoms', authMiddleware, indexWithSymptoms);
  app.get('/conditions/:id', authMiddleware, show);
  app.get('/conditions/:id/symptoms', authMiddleware, showWithSymptoms);
  app.get('/conditions/search/:name', authMiddleware, search);
  app.post('/conditions/add', authMiddleware, create);
  app.delete('/conditions/:id/delete', authMiddleware, destroy);
};

export default conditions;
