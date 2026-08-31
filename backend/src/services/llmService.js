import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const extractTasksFromText = async (transcript) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Groq API key is missing');
  }
  console.log('GROQ_API_KEY loaded:', process.env.GROQ_API_KEY?.slice(0,8) + '...');

  const today = new Date().toISOString().split('T')[0];

  const prompt = `
Extract actionable tasks from this text. The input may be in English, Hindi, or Hinglish (mixed Hindi-English).
ALWAYS translate and output the extracted task fields in clean English, regardless of the input language.

For each task, return:
- title (short, action-oriented, IN ENGLISH)
- owner (if mentioned, else "unassigned"). Explicitly extract ANY person's name mentioned in relation to the task.
- dueDate (resolve relative dates like "tomorrow", "Monday", "kal" (tomorrow), "parso" (day after tomorrow) using today's calendar date: ${today}. Output the actual calendar date in YYYY-MM-DD format).
- priority (infer from urgency words: "low", "medium", "high")

Example for Hinglish input:
Input: "Rahul ko kal invoice bhejna hai, aur Saturday ko venue book karna hai, urgent hai"
Expected Output (assuming today is 2026-08-31):
[
  {"title": "Send invoice", "owner": "Rahul", "dueDate": "2026-09-01", "priority": "medium"},
  {"title": "Book venue", "owner": "unassigned", "dueDate": "2026-09-05", "priority": "high"}
]

Return ONLY a valid JSON array. Text: ${transcript}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    let rawContent = response.choices[0].message.content.trim();
    console.log('RAW LLM Output:', rawContent);
    
    // Robust JSON parsing: find the first '[' or '{' and the last ']' or '}'
    const jsonMatch = rawContent.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (jsonMatch) {
      rawContent = jsonMatch[0];
    }
    
    return JSON.parse(rawContent);
  } catch (error) {
    console.error('Error extracting tasks:', error);
    if (error.code === 'insufficient_quota') {
      throw new Error('Groq Quota Exceeded. Please check your billing details.');
    }
    if (error.status === 401) {
      throw new Error('Invalid Groq API Key.');
    }
    throw new Error('Failed to parse tasks from LLM response');
  }
};
