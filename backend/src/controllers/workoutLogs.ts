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

// GET /workout-logs
export const getWorkoutLogs = async (req: Request, res: Response) => {
  try {
    // Get all logs with workout name
    const logs = await db.all(`
      SELECT wl.id, wl.date, wl.notes, w.name as workoutName
      FROM WorkoutLogs wl
      LEFT JOIN Workouts w ON wl.workoutId = w.id
      ORDER BY wl.date DESC
    `);

    // For each log, get its exercises
    for (const log of logs) {
      log.exercises = await db.all(`
        SELECT wle.sets, wle.reps, wle.weight, e.name
        FROM WorkoutLogExercises wle
        JOIN Exercises e ON wle.exerciseId = e.id
        WHERE wle.workoutLogId = ?
        ORDER BY wle.sets ASC
      `, [log.id]);
    }

    res.json(logs);
  } catch (err) {
    console.error('Failed to fetch workout logs:', err);
    res.status(500).json({ error: 'Failed to fetch workout logs' });
  }
};