import express from 'express';
import { createWorkoutLog } from '../controllers/workoutLogs';
const router = express.Router();

router.post('/', createWorkoutLog);

export default router;