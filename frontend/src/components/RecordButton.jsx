import React from 'react';
import { Mic, Square } from 'lucide-react';

export default function RecordButton({ isRecording, onStart, onStop, disabled }) {
  return (
    <button
      type="button"
      onClick={isRecording ? onStop : onStart}
      disabled={disabled && !isRecording}
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5'
      }`}
      title={isRecording ? "Stop recording" : "Record voice note"}
    >
      {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}
