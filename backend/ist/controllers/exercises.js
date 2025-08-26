"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExercise = exports.updateExercise = exports.createExercise = exports.getExerciseById = exports.getAllExercises = void 0;
const db_1 = __importDefault(require("../utils/db"));

const getAllExercises = async (req, res) => {
    const exercises = await db_1.default.all('SELECT * FROM exercises');
    res.json(exercises);
};
exports.getAllExercises = getAllExercises;

const getExerciseById = async (req, res) => {
    const exercise = await db_1.default.get('SELECT * FROM exercise WHERE id = ?', req.params.id);
    res.json(exercise);
};
exports.getExerciseById = getExerciseById;

const createExercise = async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
    }
    console.log("name in back = ", name);
    try {
        await db_1.default.run(`INSERT INTO Exercises (name) VALUES (?)`, [name]);
        res.status(201).json({ message: 'Exercise created' });
    }
    catch (error) {
        if (error.message.includes('UNIQUE')) {
            res.status(409).json({ error: 'Exercise already exists' });
        }
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to create exercise' });
    }
    console.log('Success: inserted row with id');
    res.status(201).json({ message: 'Exercise created' });
};
exports.createExercise = createExercise;

const updateExercise = async (req, res) => {
    const { date, notes } = req.body;
    await db_1.default.run('UPDATE exercises SET date = ?, notes = ? WHERE id = ?', [date, notes, req.params.id]);
    res.json({ message: 'Exercise updated' });
};
exports.updateExercise = updateExercise;

const deleteExercise = async (req, res) => {
    await db_1.default.run('DELETE FROM exercises WHERE id = ?', req.params.id);
    res.json({ message: 'Exercise deleted' });
};
exports.deleteExercise = deleteExercise;
