import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface ThinkingIndicatorProps {
  modelName?: string;
}

const THINKING_STEPS = [
  'Dilshad AI is thinking...',
  'Analyzing context & intent...',
  'Synthesizing deep knowledge...',
  'Formulating structured response...',
];

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ modelName = 'Dilshad AI Pro' }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % THINKING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3.5 py-4 px-2"
    >
      {/* Dilshad AI Avatar with pulsating aura */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
        <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-neutral-950">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
        </span>
      </div>

      <div className="flex-1 space-y-3 pt-0.5">
        {/* Model header & status pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-200">{modelName}</span>
          <div className="flex items-center gap-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
            <Brain className="h-3 w-3 animate-spin" />
            <span>{THINKING_STEPS[stepIndex]}</span>
          </div>
        </div>

        {/* Pulsing Dots & Skeleton Bars */}
        <div className="space-y-2 rounded-2xl bg-neutral-900/40 border border-neutral-800/50 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 pb-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"></span>
            <span className="text-xs text-neutral-400 ml-2 font-mono">Generating tokens...</span>
          </div>

          {/* Skeleton lines with gradient shimmer */}
          <div className="space-y-2 pt-1">
            <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-800/60" />
            <div className="h-3 w-full animate-pulse rounded bg-neutral-800/40" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-neutral-800/30" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
