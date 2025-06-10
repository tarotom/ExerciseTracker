"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkout = exports.updateWorkout = exports.createWorkout = exports.getWorkoutById = exports.getAllWorkouts = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getAllWorkouts = async (req, res) => {
    const workouts = await db_1.default.all('SELECT * FROM workouts');
    res.json(workouts);
};
exports.getAllWorkouts = getAllWorkouts;
const getWorkoutById = async (req, res) => {
    const workout = await db_1.default.get('SELECT * FROM workouts WHERE id = ?', req.params.id);
    res.json(workout);
};
exports.getWorkoutById = getWorkoutById;
const createWorkout = async (req, res) => {
    const { date, notes } = req.body;
    await db_1.default.run('INSERT INTO workouts (date, notes) VALUES (?, ?)', [date, notes]);
    res.status(201).json({ message: 'Workout created' });
};
exports.createWorkout = createWorkout;
const updateWorkout = async (req, res) => {
    const { date, notes } = req.body;
    await db_1.default.run('UPDATE workouts SET date = ?, notes = ? WHERE id = ?', [date, notes, req.params.id]);
    res.json({ message: 'Workout updated' });
};
exports.updateWorkout = updateWorkout;
const deleteWorkout = async (req, res) => {
    await db_1.default.run('DELETE FROM workouts WHERE id = ?', req.params.id);
    res.json({ message: 'Workout deleted' });
};
exports.deleteWorkout = deleteWorkout;
