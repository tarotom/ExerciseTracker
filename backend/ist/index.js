"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./utils/db");
const exercises_1 = __importDefault(require("./routes/exercises"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/exercises', exercises_1.default);
// Initialize DB and start server
(0, db_1.initializeDb)().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
