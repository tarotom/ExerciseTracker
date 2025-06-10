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
// checking inputs, talking to the DB, sending responses
export const createExercise = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  // console.log("req in back = ", req)

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  console.log("name in back = ", name);

  db.run(`INSERT INTO Exercises (name) VALUES (?)`, [name], function (err: any) {
    if (err) {
      console.error('Insert error:', err);
      res.status(500).json({ error: 'Failed to create exercise' });
      return;
    }

    console.log('Success: inserted row with id');
    res.status(201).json({ message: 'Exercise created' });
    return;
  });
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
