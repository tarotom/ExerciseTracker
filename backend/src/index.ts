import express from 'express';
import workoutRoutes from './routes/workouts';
import bodyParser from 'body-parser';
import { initializeDb } from './utils/db';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use('/api/workouts', workoutRoutes);

// Initialize DB and start server
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});