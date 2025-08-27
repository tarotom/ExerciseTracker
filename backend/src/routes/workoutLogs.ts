import express from 'express';
import { createWorkoutLog, getWorkoutLogs } from '../controllers/workoutLogs';
const router = express.Router();

router.post('/', createWorkoutLog);
router.get('/', getWorkoutLogs);

export default router;