// src/index.js
import express from "express";
import pino from 'pino-http';
import cors from 'cors';


const PORT = 3000;

const app = express();

app.use(cors());


app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hey yo!',
  });
});

app.use(/.*/, (req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


