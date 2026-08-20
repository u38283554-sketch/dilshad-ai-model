import React, { useState } from 'react';
import {
  Sparkles,
  FileSearch,
  Code2,
  PenTool,
  Lightbulb,
  Database,
  ArrowRight,
  Search,
} from 'lucide-react';
import { AITool } from '../../types';
import { motion } from 'motion/react';

interface ToolsViewProps {
  tools: AITool[];
  onSelectTool: (samplePrompt: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ tools, onSelectTool }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Analysis', 'Coding', 'Writing', 'Productivity', 'Creative'];

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSearch':
        return <FileSearch className="h-5 w-5 text-emerald-400" />;
      case 'Code2':
        return <Code2 className="h-5 w-5 text-purple-400" />;
      case 'PenTool':
        return <PenTool className="h-5 w-5 text-indigo-400" />;
      case 'Lightbulb':
        return <Lightbulb className="h-5 w-5 text-amber-400" />;
      case 'Database':
        return <Database className="h-5 w-5 text-cyan-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-pink-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-md bg-indigo-950 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-800/60">
            Specialized Agents
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
          AI Tools & Domain Experts
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          One-click specialized agents fine-tuned for analysis, code audits, copy architecture, and strategic modeling.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 hover:bg-neutral-900 hover:border-indigo-500/50 transition-all shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700/60 group-hover:scale-105 transition-transform">
                  {getToolIcon(tool.icon)}
                </div>
                {tool.badge && (
                  <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-neutral-700/50">
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-neutral-100 group-hover:text-white mb-1">
                {tool.name}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800/80">
              <button
                onClick={() => onSelectTool(tool.samplePrompt)}
                className="w-full flex items-center justify-between rounded-xl bg-neutral-950/80 hover:bg-indigo-600 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white transition group/btn"
              >
                <span>Launch in Dilshad AI</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
