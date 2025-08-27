import express from 'express';
import exercisesRoutes from './routes/exercises';
import workoutsRouter from './routes/workouts';
import workoutLogsRouter from './routes/workoutLogs';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/exercises', exercisesRoutes);
app.use('/workouts', workoutsRouter);
app.use('/workout-logs', workoutLogsRouter);

export default app;