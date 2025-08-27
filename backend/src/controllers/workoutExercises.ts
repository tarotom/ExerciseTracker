import { Request, Response } from 'express';
import db from '../utils/db';

// POST /workout-exercises
export const addWorkoutExercise = async (req: Request, res: Response) => {
  const { workoutId, exerciseId, sets, reps } = req.body;
  if (!workoutId || !exerciseId || !sets || !reps) {
    res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const exists = await db.get(
      'SELECT id FROM WorkoutExercises WHERE workoutId = ? AND exerciseId = ? AND sets = ? AND reps = ?',
      [workoutId, exerciseId, sets, reps]
    );
    if (!exists) {
      await db.run(
        'INSERT INTO WorkoutExercises (workoutId, exerciseId, sets, reps) VALUES (?, ?, ?, ?)',
        [workoutId, exerciseId, sets, reps]
      );
    }
    res.status(201).json({ message: 'OK' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};