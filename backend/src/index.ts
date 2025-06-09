import express from 'express';
import workoutRoutes from './routes/workouts';
import bodyParser from 'body-parser';
import { initializeDb } from './utils/db';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use('/api/workouts', workoutRoutes);
app.use(cors());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Frontend connected successfully! ' +Math.random() });
});

// Initialize DB and start server
initializeDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});