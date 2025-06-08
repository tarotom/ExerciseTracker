import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any;

export async function initializeDb() {
  db = await open({
    filename: './workout.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER,
      name TEXT NOT NULL,
      sets INTEGER,
      reps INTEGER,
      weight REAL,
      FOREIGN KEY(workout_id) REFERENCES workouts(id)
    );
  `);
}

export default {
  run: (...args: any[]) => db.run(...args),
  get: (...args: any[]) => db.get(...args),
  all: (...args: any[]) => db.all(...args),
};