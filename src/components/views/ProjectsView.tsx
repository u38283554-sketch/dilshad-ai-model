import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  MoreVertical,
  ArrowRight,
  X,
} from 'lucide-react';
import { Project } from '../../types';
import { formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsViewProps {
  projects: Project[];
  onCreateProject: (name: string, description: string, color: string) => void;
  onOpenProjectChat: (projectName: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onCreateProject,
  onOpenProjectChat,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject(name.trim(), description.trim(), color);
    setName('');
    setDescription('');
    setIsCreateOpen(false);
  };

  const projectColors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#06b6d4', '#8b5cf6'];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-indigo-950 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-800/60">
              Workspaces
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
            Projects & Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Group relevant documents, system prompts, and memory context for specialized initiatives.
          </p>
        </div>

        <button
          id="btn-create-project"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 hover:bg-neutral-900 hover:border-neutral-700 transition-all shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl font-bold"
                    style={{ backgroundColor: `${proj.color}22`, border: `1px solid ${proj.color}55` }}
                  >
                    <FolderKanban className="h-5 w-5" style={{ color: proj.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-100 group-hover:text-white">
                      {proj.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatDate(proj.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-6">
                {proj.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80">
              <div className="flex items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                  {proj.chatsCount} chats
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-emerald-400" />
                  {proj.filesCount} files
                </span>
              </div>

              <button
                onClick={() => onOpenProjectChat(proj.name)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                <span>Launch in AI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <h3 className="font-bold text-sm text-neutral-100">Create New Project</h3>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Q4 Growth Architecture"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-neutral-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Description & Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly state context and key goals for Dilshad AI memory..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-neutral-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-2">
                    {projectColors.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        className={`h-7 w-7 rounded-full border-2 transition ${
                          color === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    Create Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
