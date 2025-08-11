import { open } from 'sqlite';
import { Database } from 'sqlite3';
import * as path from 'path';

(async () => {
  const db = await open({
    filename: path.resolve(__dirname, '../db/test.sqlite'), // adjust path if needed
    driver: Database,
  });

  await db.exec(`DROP TABLE IF EXISTS WorkoutExercises_old;`);

  // Change sets and reps columns to TEXT in WorkoutExercises table
  await db.exec(`
    ALTER TABLE WorkoutExercises RENAME TO WorkoutExercises_old;
  `);

  await db.exec(`
    CREATE TABLE WorkoutExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER,
      exerciseId INTEGER,
      sets TEXT,
      reps TEXT,
      FOREIGN KEY(workoutId) REFERENCES workouts(id),
      FOREIGN KEY(exerciseId) REFERENCES exercises(id)
    );
  `);

  await db.exec(`
    INSERT INTO WorkoutExercises (id, workoutId, exerciseId, sets, reps)
    SELECT id, workoutId, exerciseId, sets, reps FROM WorkoutExercises_old;
  `);

  await db.exec(`
    DROP TABLE WorkoutExercises_old;
  `);

//   console.log('✅ Migration complete: sets and reps are now TEXT');
  await db.close();
})();
