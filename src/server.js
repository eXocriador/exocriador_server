// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';
import redoc from 'redoc-express';

import { getEnvVar } from './utils/getEnvVar.js';
import { getAllStudents, getStudentById } from './services/students.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use(express.static(path.join(__dirname, 'public')));

  // === / (головна сторінка) ===
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // === /docs (Redoc UI) ===
  const swaggerPath = path.resolve('src', 'docs', 'swagger.json');

  app.get('/docs', redoc({
    title: 'Exocriador API Docs 🦎',
    specUrl: '/swagger.json',
  }));

  app.get('/swagger.json', (req, res) => {
    res.sendFile(swaggerPath);
  });

  // === /students ===
  app.get('/students', async (req, res, next) => {
    try {
      const students = await getAllStudents();
      res.status(200).json({
        status: 200,
        message: "Successfully found students!",
        data: students
      });
    } catch (err) {
      next(err);
    }
  });

  // === /students/:studentId ===
  app.get('/students/:studentId', async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const student = await getStudentById(studentId);

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found student with id ${studentId}!`,
        data: student
      });
    } catch (err) {
      next(err);
    }
  });

  // === 404 Not Found ===
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // === 500 Server Error ===
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📘 API Docs: http://localhost:${PORT}/docs`);
  });
};
