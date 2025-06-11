import { open } from 'sqlite';
import { Database } from 'sqlite3';

(async () => {
  const db = await open({
    // filename: './db/dev.sqlite', // or whichever DB you're targeting
    filename: './db/test.sqlite',
    driver: Database
  });

  await db.exec(`ALTER TABLE Workouts ADD COLUMN description TEXT`);
  console.log('✅ Migration complete');
  await db.close();
})();