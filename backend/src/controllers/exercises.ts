import { Request, Response } from 'express';
import db from '../utils/db';

export const getAllExercises = async (req: Request, res: Response) => {
  const exercises = await db.all('SELECT * FROM exercises');
  res.json(exercises);
};

export const getExerciseById = async (req: Request, res: Response) => {
  const exercise = await db.get('SELECT * FROM exercise WHERE id = ?', req.params.id);
  res.json(exercise);
};

// POST /exercise
export const createExercise = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    await db.run(`INSERT INTO Exercises (name) VALUES (?)`, [name]);
    res.status(201).json({ message: 'Exercise created' });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(409).json({ error: 'Exercise already exists' });
      return;
    }

    console.error('Create exercise error: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  const { date, notes } = req.body;
  await db.run('UPDATE exercises SET date = ?, notes = ? WHERE id = ?', [date, notes, req.params.id]);
  res.json({ message: 'Exercise updated' });
};

export const deleteExercise = async (req: Request, res: Response) => {
  await db.run('DELETE FROM exercises WHERE id = ?', req.params.id);
  res.json({ message: 'Exercise deleted' });
};
