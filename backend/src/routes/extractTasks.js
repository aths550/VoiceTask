import express from 'express';
import { extractTasksFromText } from '../services/llmService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Valid text input is required' });
  }

  try {
    const tasks = await extractTasksFromText(text);
    res.json({ tasks });
  } catch (error) {
    console.error('Extraction error:', error);
    const isParseError = error.message.includes('parse tasks');
    const isQuotaError = error.message.includes('Quota') || error.message.includes('Key');
    
    res.status(isParseError ? 422 : 500).json({ 
      error: isParseError ? 'Could not understand tasks from text. Try again.' : (isQuotaError ? error.message : 'Failed to extract tasks'),
      details: error.message 
    });
  }
});

export default router;
