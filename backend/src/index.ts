import express from 'express';
import { initializeDb } from './utils/db';
import exercisesRoutes from './routes/exercises';
import cors from 'cors';
import * as dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

app.use(cors());
app.use(express.json());
app.use('/exercises', exercisesRoutes);

// Initialize DB and start server
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});