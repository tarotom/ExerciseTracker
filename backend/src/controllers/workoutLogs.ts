import { Request, Response } from 'express';
import db from '../utils/db';

// POST /workout-logs
export const createWorkoutLog = async (req: Request, res: Response) => {
  const { workoutId, date, notes, exercises } = req.body;
  if (!date || !Array.isArray(exercises) || exercises.length === 0) {
    res.status(400).json({ error: 'Date and at least one exercise are required' });
  }
  try {
    const result = await db.run(
      'INSERT INTO WorkoutLogs (workoutId, date, notes) VALUES (?, ?, ?)',
      [workoutId || null, date, notes || null]
    );
    const workoutLogId = result.lastID;

    // Insert performed sets for each exercise
    for (const ex of exercises) {
      if (!Array.isArray(ex.performedSets) || ex.performedSets.length === 0) continue;
      for (let setIdx = 0; setIdx < ex.performedSets.length; setIdx++) {
        const set = ex.performedSets[setIdx];
        await db.run(
          'INSERT INTO WorkoutLogExercises (workoutLogId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?)',
          [
            workoutLogId,
            ex.id,
            setIdx + 1,
            set.reps,
            set.weight || null,
          ]
        );
      }
    }

    res.status(201).json({ message: 'Workout logged', workoutLogId });
  } catch (err: any) {
    console.error('Failed to log workout:', err);
    res.status(500).json({ error: 'Failed to log workout', details: err.message });
  }
};