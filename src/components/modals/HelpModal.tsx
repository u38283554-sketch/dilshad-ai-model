import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  BookOpen,
  Mail,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'models' | 'files' | 'account' | 'shortcuts';
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I switch between different Dilshad AI models?',
    answer:
      'Use the model selector dropdown in the top header bar, or press Cmd+K to open the Command Palette and type the model name (e.g. Dilshad AI Pro, Fast, Balanced, Creative).',
    category: 'models',
  },
  {
    question: 'What file types can Dilshad AI analyze?',
    answer:
      'Dilshad AI supports PDFs, Microsoft Word (.docx), Excel spreadsheets (.xlsx, .csv), images (.png, .jpg, .webp), and plain code/text files (.ts, .py, .json, .sql).',
    category: 'files',
  },
  {
    question: 'What are Reasoning Credits and when do they renew?',
    answer:
      'Reasoning credits power Deep Reasoning, complex code synthesis, and multi-file document indexing. They renew automatically on the 1st of every month.',
    category: 'account',
  },
  {
    question: 'What keyboard shortcuts are available?',
    answer:
      'Key shortcuts include Cmd+K for Command Palette, Cmd+N for New Chat, Ctrl+/ to collapse/expand sidebar, Enter to send messages, and Shift+Enter for newlines.',
    category: 'shortcuts',
  },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'guides'>('faq');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast('Support ticket submitted. Our team will respond within 24 hours.');
      setContactSubject('');
      setContactMessage('');
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative flex flex-col w-full max-w-2xl h-[580px] rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-100">Help & Knowledge Center</h3>
                <p className="text-[11px] text-neutral-400">Documentation, FAQs, and Direct Support</p>
              </div>
            </div>
            <button
              id="btn-close-help-modal"
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/30">
            {[
              { id: 'faq', label: 'Frequently Asked Questions', icon: <HelpCircle className="h-3.5 w-3.5" /> },
              { id: 'guides', label: 'Guides & Best Practices', icon: <BookOpen className="h-3.5 w-3.5" /> },
              { id: 'contact', label: 'Contact Support', icon: <Mail className="h-3.5 w-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'faq' | 'contact' | 'guides')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition -mb-[1px] ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* FAQ TAB */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions or topics..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  {filteredFaqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-neutral-800 bg-neutral-950/60 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-3 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-900/80 transition"
                      >
                        <span>{faq.question}</span>
                        {expandedIndex === idx ? (
                          <ChevronUp className="h-4 w-4 text-neutral-400 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                        )}
                      </button>
                      {expandedIndex === idx && (
                        <div className="p-3 pt-0 border-t border-neutral-800/40 text-xs text-neutral-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GUIDES TAB */}
            {activeTab === 'guides' && (
              <div className="space-y-3">
                {[
                  {
                    title: 'Prompt Engineering for Maximum Precision',
                    desc: 'Learn how to structure clear context constraints, role instructions, and few-shot formatting.',
                    readTime: '3 min read',
                  },
                  {
                    title: 'Mastering Multi-File Knowledge Repositories',
                    desc: 'How to index codebases, contracts, and financial spreadsheets with cross-document synthesis.',
                    readTime: '5 min read',
                  },
                  {
                    title: 'Using Specialized Reasoning Models',
                    desc: 'When to choose Dilshad AI Pro vs. Fast vs. Balanced vs. Creative for optimal latency and depth.',
                    readTime: '4 min read',
                  },
                ].map((guide, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-950 transition group cursor-pointer"
                    onClick={() => onShowToast(`Opened guide: "${guide.title}"`)}
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-neutral-100 group-hover:text-indigo-400 transition">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{guide.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 shrink-0 ml-4">
                      <span>{guide.readTime}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-indigo-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Subject / Category
                  </label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Model response formatting question"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-neutral-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe what you experienced or how we can assist..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-neutral-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-neutral-500">
                    Direct inquiries: <a href="mailto:support@dilshad.ai" className="text-indigo-400 hover:underline">support@dilshad.ai</a>
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5" />
                        <span>Send Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
