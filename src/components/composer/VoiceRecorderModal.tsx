import React, { useState, useEffect } from 'react';
import { Mic, Square, Sparkles, X, Check, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
}

const MOCK_SPEECH_STREAM = [
  'Summarize the core competitive advantages',
  'Summarize the core competitive advantages of our new product line',
  'Summarize the core competitive advantages of our new product line and draft an executive email for our investors.',
];

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady,
}) => {
  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [bars, setBars] = useState<number[]>([40, 65, 20, 85, 95, 30, 70, 50, 90, 60, 45, 80]);

  useEffect(() => {
    if (!isOpen) {
      setIsRecording(true);
      setSeconds(0);
      setTranscript('');
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const waveTimer = setInterval(() => {
      setBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 80) + 15));
    }, 150);

    const textTimer1 = setTimeout(() => setTranscript(MOCK_SPEECH_STREAM[0]), 1200);
    const textTimer2 = setTimeout(() => setTranscript(MOCK_SPEECH_STREAM[1]), 2500);
    const textTimer3 = setTimeout(() => setTranscript(MOCK_SPEECH_STREAM[2]), 4000);

    return () => {
      clearInterval(timer);
      clearInterval(waveTimer);
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
    };
  }, [isOpen]);

  const handleFinish = () => {
    setIsRecording(false);
    const finalResult = transcript || 'Analyze our Q3 sales performance and recommend 3 pricing optimizations.';
    onTranscriptReady(finalResult);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
                <Mic className="h-4 w-4 animate-pulse" />
              </div>
              <h3 className="font-semibold text-neutral-100 text-sm">Voice Input to Dilshad AI</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Waveform Visualization */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-1.5 h-20 w-full px-4">
              {bars.map((height, idx) => (
                <motion.div
                  key={idx}
                  className="w-1.5 rounded-full bg-gradient-to-t from-indigo-600 via-indigo-400 to-cyan-300"
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.15 }}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>00:{seconds < 10 ? `0${seconds}` : seconds}</span>
              <span>• Listening...</span>
            </div>
          </div>

          {/* Real-time transcription box */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 min-h-[70px] text-xs text-neutral-300 leading-relaxed">
            {transcript ? (
              <span className="font-medium text-neutral-200">"{transcript}"</span>
            ) : (
              <span className="text-neutral-500 italic">Speak clearly into your microphone...</span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-neutral-800 px-4 py-2.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              id="btn-voice-insert"
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition"
            >
              <Check className="h-4 w-4" />
              <span>Insert into Chat</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
