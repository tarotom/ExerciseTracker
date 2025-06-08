import { Request, Response } from 'express';
import db from '../utils/db';

export const getAllWorkouts = async (req: Request, res: Response) => {
  const workouts = await db.all('SELECT * FROM workouts');
  res.json(workouts);
};

export const getWorkoutById = async (req: Request, res: Response) => {
  const workout = await db.get('SELECT * FROM workouts WHERE id = ?', req.params.id);
  res.json(workout);
};

export const createWorkout = async (req: Request, res: Response) => {
  const { date, notes } = req.body;
  await db.run('INSERT INTO workouts (date, notes) VALUES (?, ?)', [date, notes]);
  res.status(201).json({ message: 'Workout created' });
};

export const updateWorkout = async (req: Request, res: Response) => {
  const { date, notes } = req.body;
  await db.run('UPDATE workouts SET date = ?, notes = ? WHERE id = ?', [date, notes, req.params.id]);
  res.json({ message: 'Workout updated' });
};

export const deleteWorkout = async (req: Request, res: Response) => {
  await db.run('DELETE FROM workouts WHERE id = ?', req.params.id);
  res.json({ message: 'Workout deleted' });
};