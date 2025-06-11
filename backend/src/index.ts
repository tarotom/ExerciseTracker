import dotenv from 'dotenv';
import { initializeDb } from './utils/db';
import app from './app';

const port = process.env.PORT || 3000;

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Initialize DB and start server
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});