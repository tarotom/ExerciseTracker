import express from 'express';
import { addWorkoutExercise } from '../controllers/workoutExercises';
const router = express.Router();

router.post('/', addWorkoutExercise);

export default router;