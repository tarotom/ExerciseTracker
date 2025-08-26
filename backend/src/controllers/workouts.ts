import { Request, Response } from 'express';
import db from '../utils/db';

export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const workouts = await db.all('SELECT * FROM Workouts');
    const workoutsWithExercises = [];
    for (const workout of workouts) {
      const exercises = await db.all(
        `SELECT we.id, e.name, we.sets, we.reps
         FROM WorkoutExercises we
         JOIN Exercises e ON we.exerciseId = e.id
         WHERE we.workoutId = ?`,
        [workout.id]
      );
      workoutsWithExercises.push({
        ...workout,
        exercises,
      });
    }
    res.json(workoutsWithExercises);
  } catch (err) {
    console.error('Failed to fetch workouts:', err);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

// TODO: maybe add the included exercises here too?
export const getWorkoutById = async (req: Request, res: Response): Promise<void> => {
  const workout = await db.get('SELECT * FROM Workouts WHERE id = ?', req.params.id);
  res.json(workout);
};

export const createWorkout = async (req: Request, res: Response): Promise<void> => {
  const { name, description, exercises } = req.body;
  console.log('req.body in createWorkout:', req.body);
  if (!name || !Array.isArray(exercises) || exercises.length === 0) {
    res.status(400).json({ error: 'Name and at least one exercise are required' });
    return;
  }
  try {
    const result = await db.run(
      'INSERT INTO Workouts (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    const workoutId = result.lastID;
    for (const ex of exercises) {
      await db.run(
        'INSERT INTO WorkoutExercises (workoutId, exerciseId, sets, reps) VALUES (?, ?, ?, ?)',
        [workoutId, ex.id, ex.sets, ex.reps]
      );
    }
    res.status(201).json({ message: 'Workout created', workoutId });
  } catch (err) {
    console.error('Workout creation error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Failed to save workout', details: errorMessage });
  }
};

export const updateWorkout = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;
  await db.run('UPDATE Workouts SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
  res.json({ message: 'Workout updated' });
};

export const deleteWorkout = async (req: Request, res: Response): Promise<void> => {
  await db.run('DELETE FROM Workouts WHERE id = ?', req.params.id);
  res.json({ message: 'Workout deleted' });
};