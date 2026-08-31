import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptInput from '../components/TranscriptInput';
import { extractTasks, createTask, transcribeAudio } from '../services/api';
import { Bot, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleExtract = async (input, isAudio = false) => {
    setIsProcessing(true);
    setError(null);
    try {
      let extractedTasks;
      if (isAudio) {
        const result = await transcribeAudio(input);
        extractedTasks = result.tasks;
      } else {
        extractedTasks = await extractTasks(input);
      }
      if (extractedTasks && extractedTasks.length > 0) {
        // Save tasks to the database
        await createTask(extractedTasks);
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('No tasks found in the text.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to extract tasks. Ensure backend is running and OpenAI key is valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Turn chats into <span className="text-blue-600">actionable tasks</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Paste your WhatsApp messages or record a voice note below. Our AI will automatically extract owners, deadlines, and priorities for you.
            <br />
            <span className="inline-block mt-2 font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">
              ✨ Works natively in English, Hindi, and Hinglish!
            </span>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-center gap-3 text-red-700 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-900/10">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-blue-600" />
          </div>
          
          <TranscriptInput onSubmit={handleExtract} disabled={isProcessing} />
          
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-blue-900 font-medium">Extracting tasks with AI...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
