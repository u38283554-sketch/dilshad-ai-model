import React from 'react';
import {
  PenTool,
  FileSearch,
  Lightbulb,
  GraduationCap,
  Sparkles,
  Layers,
  Code2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenUploadModal?: () => void;
}

interface SuggestionCard {
  id: string;
  category: string;
  title: string;
  prompt: string;
  icon: React.ReactNode;
  color: string;
  isUploadTrigger?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectPrompt,
  onOpenUploadModal,
}) => {
  const suggestions: SuggestionCard[] = [
    {
      id: 'sug_1',
      category: 'Write something',
      title: 'Create a professional email',
      prompt: 'Draft a high-impact, professional executive proposal email for a B2B AI partnership.',
      icon: <PenTool className="h-4 w-4 text-indigo-400" />,
      color: 'from-indigo-500/10 to-indigo-500/5',
    },
    {
      id: 'sug_2',
      category: 'Analyze a file',
      title: 'Upload a PDF and summarize it',
      prompt: 'Please analyze this PDF, extract the key obligations, risk flags, and provide an executive summary.',
      icon: <FileSearch className="h-4 w-4 text-emerald-400" />,
      color: 'from-emerald-500/10 to-emerald-500/5',
      isUploadTrigger: true,
    },
    {
      id: 'sug_3',
      category: 'Generate ideas',
      title: 'Give me 10 business ideas',
      prompt: 'Give me 10 high-potential, defensible business ideas for the 2026 AI-native market with TAM sizing.',
      icon: <Lightbulb className="h-4 w-4 text-amber-400" />,
      color: 'from-amber-500/10 to-amber-500/5',
    },
    {
      id: 'sug_4',
      category: 'Learn something',
      title: 'Explain quantum computing simply',
      prompt: 'Explain quantum computing in simple terms with everyday analogies, covering superposition and qubits.',
      icon: <GraduationCap className="h-4 w-4 text-cyan-400" />,
      color: 'from-cyan-500/10 to-cyan-500/5',
    },
    {
      id: 'sug_5',
      category: 'Create content',
      title: 'Write a product description',
      prompt: 'Write a magnetic, high-converting product description for a minimalist mechanical studio keyboard.',
      icon: <Sparkles className="h-4 w-4 text-pink-400" />,
      color: 'from-pink-500/10 to-pink-500/5',
    },
    {
      id: 'sug_6',
      category: 'Engineering & Code',
      title: 'React TypeScript Component',
      prompt: 'Write a production-ready React component with TypeScript and custom debounced search filter.',
      icon: <Code2 className="h-4 w-4 text-purple-400" />,
      color: 'from-purple-500/10 to-purple-500/5',
    },
  ];

  const handleCardClick = (card: SuggestionCard) => {
    if (card.isUploadTrigger && onOpenUploadModal) {
      onOpenUploadModal();
    } else {
      onSelectPrompt(card.prompt);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 text-center max-w-4xl mx-auto">
      {/* Brand Icon & Glowing Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative mb-6"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-2xl shadow-indigo-500/25">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-neutral-950">
            <Sparkles className="h-8 w-8 text-indigo-400" />
          </div>
        </div>
        <div className="absolute -top-1 -right-2 flex items-center gap-1 rounded-full bg-indigo-900/90 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 shadow-md">
          <Zap className="h-2.5 w-2.5 text-indigo-400" />
          <span>v2.5</span>
        </div>
      </motion.div>

      {/* Main Headings */}
      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100 mb-2"
      >
        Hello, I’m <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">Dilshad AI</span>.
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-lg sm:text-xl font-medium text-neutral-300 mb-3"
      >
        How can I help you today?
      </motion.p>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-sm text-neutral-400 max-w-lg mb-10 leading-relaxed"
      >
        Your intelligent AI assistant for ideas, writing, research, files, images and everyday workflows.
      </motion.p>

      {/* Suggestion Cards Grid */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full text-left"
      >
        {suggestions.map((card) => (
          <button
            key={card.id}
            id={`btn-suggestion-${card.id}`}
            onClick={() => handleCardClick(card)}
            className="group relative flex flex-col justify-between p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700/60 group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-300">
                {card.category}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors mb-1">
                “{card.title}”
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {card.prompt}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-end">
              <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Start prompt <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
};
