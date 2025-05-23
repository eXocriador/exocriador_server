// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import studentsRouter from './routers/students.js';
import { getEnvVar } from './utils/getEnvVar.js';
// import { logger } from './middlewares/logger.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  // app.use(logger);

  app.use(express.static(path.join(__dirname, 'public')));

  // === / main page  ===
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // === /students router ===
  app.use('/students', studentsRouter);
  // === /error middlewares ===
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/students`);
  });
};
