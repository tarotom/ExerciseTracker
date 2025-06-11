import express from 'express';
import exercisesRoutes from './routes/exercises';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/exercises', exercisesRoutes);

export default app;