import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any;

export async function initializeDb() {
  const env = process.env.NODE_ENV;
  const defaultPath =
    env === 'test'
      ? './db/test.sqlite'
      : env === 'production'
      ? './db/prod.sqlite'
      : './db/dev.sqlite';

  db = await open({
    filename: process.env.DATABASE_PATH || defaultPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    -- 🧩 Workout Templates
    CREATE TABLE IF NOT EXISTS Workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    -- 🧩 Exercises (reusable library)
    CREATE TABLE IF NOT EXISTS Exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    -- 🔗 Workout ↔ Exercises (template details)
    CREATE TABLE IF NOT EXISTS WorkoutExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER,
      targetReps TEXT,
      FOREIGN KEY (workoutId) REFERENCES Workouts(id),
      FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
    );

    -- 🗓️ Logged Workouts (user's past workout sessions)
    CREATE TABLE IF NOT EXISTS WorkoutLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER, -- optional if based on a template
      date TEXT NOT NULL,
      notes TEXT
    );

    -- 📈 Logged Exercises (user's actual exercise performance)
    CREATE TABLE IF NOT EXISTS WorkoutLogExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutLogId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER,
      reps TEXT,
      weight TEXT,
      notes TEXT, -- Only here and in WorkoutLogs
      FOREIGN KEY (workoutLogId) REFERENCES WorkoutLogs(id),
      FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
    );
  `);
}

export default {
  run: (...args: any[]) => db.run(...args),
  get: (...args: any[]) => db.get(...args),
  all: (...args: any[]) => db.all(...args),
};