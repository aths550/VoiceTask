import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';
import extractTasksRouter from './routes/extractTasks.js';
import transcribeRouter from './routes/transcribe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: '*', // Permissive for local MVP development
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/extract-tasks', extractTasksRouter);
app.use('/api/transcribe', transcribeRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
