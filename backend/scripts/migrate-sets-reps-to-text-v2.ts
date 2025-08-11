import { open } from 'sqlite';
import { Database } from 'sqlite3';
import * as path from 'path';

(async () => {
  const db = await open({
    filename: path.resolve(__dirname, '../db/test.sqlite'), // adjust path if needed
    driver: Database,
  });

  // Rename old table
  await db.exec(`ALTER TABLE WorkoutExercises RENAME TO WorkoutExercises_old;`);

  // Create new table with sets and reps as TEXT
  await db.exec(`
    CREATE TABLE WorkoutExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets TEXT,
      reps TEXT,
      FOREIGN KEY (workoutId) REFERENCES Workouts(id),
      FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
    );
  `);

  // Copy data (convert sets to string if needed)
  const oldRows = await db.all('SELECT * FROM WorkoutExercises_old');
  for (const row of oldRows) {
    await db.run(
      'INSERT INTO WorkoutExercises (id, workoutId, exerciseId, sets, reps) VALUES (?, ?, ?, ?, ?)',
      [row.id, row.workoutId, row.exerciseId, row.sets?.toString() ?? '', row.reps?.toString() ?? '']
    );
  }

  await db.exec('DROP TABLE WorkoutExercises_old;');
  console.log('✅ Migration complete: sets and reps are now TEXT in WorkoutExercises');
  await db.close();
})();
