import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import RecordButton from './RecordButton';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export default function TranscriptInput({ onSubmit, disabled }) {
  const [text, setText] = useState('');
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled || isRecording) return;
    onSubmit(text);
  };

  const handleAudioStop = async () => {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      // The parent component will handle the audio blob
      if (onSubmit) {
        onSubmit(audioBlob, true); // true indicates it's an audio submission
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative">
        <div className="absolute top-4 left-4 text-slate-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a message like: 'Remind Rahul to send the invoice by tomorrow...'"
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all resize-none text-slate-700 min-h-[160px]"
          disabled={disabled || isRecording}
        />
        {isRecording && (
          <div className="absolute inset-0 bg-red-50/90 rounded-2xl flex flex-col items-center justify-center border-2 border-red-200 z-10">
            <div className="flex items-center gap-3 text-red-600 font-semibold mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Recording Voice Note...
            </div>
            <p className="text-sm text-red-500">Speak clearly, then click stop to transcribe</p>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-2">
        <RecordButton 
          isRecording={isRecording} 
          onStart={startRecording} 
          onStop={handleAudioStop} 
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!text.trim() || disabled || isRecording}
        className="self-end flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>Extract Tasks</span>
        <Send className="w-4 h-4" />
      </button>
      </div>
    </form>
  );
}
