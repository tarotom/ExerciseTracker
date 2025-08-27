import express from 'express';
import exercisesRoutes from './routes/exercises';
import workoutsRouter from './routes/workouts';
import workoutLogsRouter from './routes/workoutLogs';
import workoutExercisesRouter from './routes/workoutExercises';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/exercises', exercisesRoutes);
app.use('/workouts', workoutsRouter);
app.use('/workout-logs', workoutLogsRouter);
app.use('/workout-exercises', workoutExercisesRouter);

export default app;