import express from 'express';
import { initializeDb } from './utils/db';
import exercisesRoutes from './routes/exercises';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/exercises', exercisesRoutes);

// Initialize DB and start server
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});