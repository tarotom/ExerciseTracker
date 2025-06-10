"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exercises_1 = require("../controllers/exercises");
const router = express_1.default.Router();
router.get('/', exercises_1.getAllExercises);
router.get('/:id', exercises_1.getExerciseById);
router.post('/', exercises_1.createExercise);
router.put('/:id', exercises_1.updateExercise);
router.delete('/:id', exercises_1.deleteExercise);
exports.default = router;
