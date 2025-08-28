import { Request, Response } from 'express';
import db from '../utils/db';

export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const workouts = await db.all('SELECT * FROM Workouts');
    const workoutsWithExercises = [];
    for (const workout of workouts) {
      const exercises = await db.all(
        `SELECT we.exerciseId as id, e.name, we.sets, we.reps
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
    // TODO: should use the workoutExercises controller function here instead
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

export const updateWorkout = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, exercises } = req.body;
  if (!name || !Array.isArray(exercises) || exercises.length === 0) {
    res.status(400).json({ error: 'Name and at least one exercise are required' });
  }
  try {
    // Update workout name/description
    await db.run(
      'UPDATE Workouts SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );

    // Fetch current exercises for this workout
    const current = await db.all(
      'SELECT exerciseId, sets, reps FROM WorkoutExercises WHERE workoutId = ?',
      [id]
    );

    // Helper to check if an exercise is already present (by exerciseId, sets, reps)
    const isPresent = (ex: any) =>
      current.some(
        (c: any) =>
          c.exerciseId === ex.id &&
          String(c.sets) === String(ex.sets) &&
          String(c.reps) === String(ex.reps)
      );

    // Insert only new exercises
    for (const ex of exercises) {
      if (!isPresent(ex)) {
        await db.run(
          'INSERT INTO WorkoutExercises (workoutId, exerciseId, sets, reps) VALUES (?, ?, ?, ?)',
          [id, ex.id, ex.sets, ex.reps]
        );
      }
    }

    // Remove exercises that are not in the new list
    for (const c of current) {
      if (
        !exercises.some(
          (ex: any) =>
            c.exerciseId === ex.id &&
            String(c.sets) === String(ex.sets) &&
            String(c.reps) === String(ex.reps)
        )
      ) {
        await db.run(
          'DELETE FROM WorkoutExercises WHERE workoutId = ? AND exerciseId = ? AND sets = ? AND reps = ?',
          [id, c.exerciseId, c.sets, c.reps]
        );
      }
    }

    res.json({ message: 'Workout updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update workout', details: err.message });
  }
};

export const deleteWorkout = async (req: Request, res: Response): Promise<void> => {
  await db.run('DELETE FROM Workouts WHERE id = ?', req.params.id);
  res.json({ message: 'Workout deleted' });
};