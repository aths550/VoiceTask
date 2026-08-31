import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import fs from 'fs';
import { extractTasksFromText } from '../services/llmService.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  try {
    // Add the original extension so Groq accepts the file type
    const originalPath = req.file.path;
    const extension = req.file.originalname.split('.').pop() || 'webm';
    const tempPath = originalPath + "." + extension;
    fs.renameSync(originalPath, tempPath);

    const audioStream = fs.createReadStream(tempPath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-large-v3',
    });

    const transcriptText = transcription.text;
    console.log('Transcription:', transcriptText);

    if (!transcriptText || transcriptText.trim() === '') {
      fs.unlinkSync(tempPath);
      return res.status(400).json({ error: 'Could not transcribe any text from the audio.' });
    }

    const extractedTasks = await extractTasksFromText(transcriptText);

    res.json({
      text: transcriptText,
      tasks: extractedTasks,
    });
  } catch (error) {
    console.error('Transcription Error:', error);
    res.status(500).json({ 
      error: 'Failed to transcribe audio or extract tasks', 
      details: error.message 
    });
  } finally {
    // Clean up both possible paths
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    const tempPath2 = req.file.path + "." + (req.file.originalname.split('.').pop() || 'webm');
    if (fs.existsSync(tempPath2)) {
      fs.unlinkSync(tempPath2);
    }
  }
});

export default router;
