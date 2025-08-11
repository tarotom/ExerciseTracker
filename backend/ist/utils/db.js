"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDb = initializeDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
let db;
async function initializeDb() {
    db = await (0, sqlite_1.open)({
        filename: './workout.db',
        driver: sqlite3_1.default.Database,
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
      sets TEXT,
      reps TEXT,
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
exports.default = {
    run: (...args) => db.run(...args),
    get: (...args) => db.get(...args),
    all: (...args) => db.all(...args),
};
