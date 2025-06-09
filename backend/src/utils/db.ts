import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any;

export async function initializeDb() {
  db = await open({
    filename: './workout.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    -- 🧩 Workout Templates
    CREATE TABLE IF NOT EXISTS Workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      notes TEXT
    );

    -- 🧩 Exercises (reusable library)
    CREATE TABLE IF NOT EXISTS Exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      notes TEXT
    );

    -- 🔗 Workout ↔ Exercises (template)
    CREATE TABLE IF NOT EXISTS WorkoutExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER,
      targetReps TEXT,
      notes TEXT,
      FOREIGN KEY (workoutId) REFERENCES Workouts(id),
      FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
    );

    -- 🗓️ Logged Workouts (user's past workout instances)
    CREATE TABLE IF NOT EXISTS WorkoutLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER, -- optional, if based on a template
      date TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (workoutId) REFERENCES Workouts(id)
    );

    -- 📈 Logged Exercises (user's actual performance)
    CREATE TABLE IF NOT EXISTS WorkoutLogExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutLogId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER,
      reps TEXT,       -- could also use JSON if needed
      weight TEXT,     -- optional: text for flexibility (e.g., "30–40 kg")
      notes TEXT,
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