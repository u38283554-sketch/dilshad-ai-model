import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageSquare,
  FileText,
  FolderKanban,
  Wrench,
  Sparkles,
  Plus,
  Upload,
  Settings,
  LogOut,
  ArrowRight,
  Command,
  HelpCircle,
} from 'lucide-react';
import { ChatConversation, Project, StoredFile, AITool, ActiveView } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ChatConversation[];
  projects: Project[];
  files: StoredFile[];
  tools: AITool[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onNavigateView: (view: ActiveView) => void;
  onOpenSettings: () => void;
  onOpenHelp?: () => void;
  onOpenUpload: () => void;
  onLogout: () => void;
}

type TabType = 'all' | 'chats' | 'files' | 'projects' | 'tools';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  conversations,
  projects,
  files,
  tools,
  onSelectChat,
  onNewChat,
  onNavigateView,
  onOpenSettings,
  onOpenHelp,
  onOpenUpload,
  onLogout,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or prop
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const q = query.toLowerCase().trim();

  const filteredChats = conversations.filter(
    (c) => c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q))
  );

  const filteredProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  const filteredFiles = files.filter(
    (f) => f.name.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q))
  );

  const filteredTools = tools.filter(
    (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
  );

  // Quick Action Commands
  const quickCommands = [
    {
      id: 'cmd_new_chat',
      title: 'New Chat',
      desc: 'Start a fresh conversation with Dilshad AI',
      icon: <Plus className="h-4 w-4 text-indigo-400" />,
      action: () => {
        onNewChat();
        onClose();
      },
    },
    {
      id: 'cmd_upload_file',
      title: 'Upload File',
      desc: 'Attach PDF, images, or documents',
      icon: <Upload className="h-4 w-4 text-emerald-400" />,
      action: () => {
        onOpenUpload();
        onClose();
      },
    },
    {
      id: 'cmd_open_projects',
      title: 'Open Projects',
      desc: 'Manage organized workspace folders',
      icon: <FolderKanban className="h-4 w-4 text-amber-400" />,
      action: () => {
        onNavigateView('projects');
        onClose();
      },
    },
    {
      id: 'cmd_open_files',
      title: 'Open Files',
      desc: 'View all uploaded documents & media',
      icon: <FileText className="h-4 w-4 text-cyan-400" />,
      action: () => {
        onNavigateView('files');
        onClose();
      },
    },
    {
      id: 'cmd_open_tools',
      title: 'Open AI Tools',
      desc: 'Access specialized Dilshad AI tools',
      icon: <Wrench className="h-4 w-4 text-pink-400" />,
      action: () => {
        onNavigateView('tools');
        onClose();
      },
    },
    {
      id: 'cmd_settings',
      title: 'Open Settings',
      desc: 'Manage themes, models, & shortcuts',
      icon: <Settings className="h-4 w-4 text-neutral-400" />,
      action: () => {
        onOpenSettings();
        onClose();
      },
    },
    {
      id: 'cmd_help',
      title: 'Help & Knowledge Center',
      desc: 'FAQs, guides, and customer support',
      icon: <HelpCircle className="h-4 w-4 text-indigo-400" />,
      action: () => {
        if (onOpenHelp) onOpenHelp();
        onClose();
      },
    },
    {
      id: 'cmd_logout',
      title: 'Logout',
      desc: 'Sign out of current account',
      icon: <LogOut className="h-4 w-4 text-red-400" />,
      action: () => {
        onLogout();
        onClose();
      },
    },
  ].filter((c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800 bg-neutral-950/70">
            <Search className="h-5 w-5 text-indigo-400 shrink-0" />
            <input
              ref={inputRef}
              id="command-palette-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats, files, projects, and commands..."
              className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400 border border-neutral-700">
              ESC
            </kbd>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-800/60 bg-neutral-900/60 text-xs overflow-x-auto">
            {(['all', 'chats', 'files', 'projects', 'tools'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-3 py-1 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
            {/* Quick Commands (when on All or when query matches) */}
            {(activeTab === 'all' || query) && quickCommands.length > 0 && (
              <div>
                <p className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Commands
                </p>
                <div className="space-y-1">
                  {quickCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-neutral-800 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700/60 group-hover:border-indigo-500/50">
                          {cmd.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                            {cmd.title}
                          </p>
                          <p className="text-[11px] text-neutral-400">{cmd.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chats Section */}
            {(activeTab === 'all' || activeTab === 'chats') && filteredChats.length > 0 && (
              <div>
                <p className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Chat Conversations ({filteredChats.length})
                </p>
                <div className="space-y-1">
                  {filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-neutral-800 transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-indigo-400">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white">
                            {chat.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {chat.messages[chat.messages.length - 1]?.content || 'Empty conversation'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono shrink-0 ml-2">
                        {chat.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            {(activeTab === 'all' || activeTab === 'files') && filteredFiles.length > 0 && (
              <div>
                <p className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Files & Documents ({filteredFiles.length})
                </p>
                <div className="space-y-1">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => {
                        onNavigateView('files');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-neutral-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-cyan-400">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">{file.summary || 'Uploaded document'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400 uppercase rounded bg-neutral-800 px-1.5 py-0.5">
                        {file.extension}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {(activeTab === 'all' || activeTab === 'projects') && filteredProjects.length > 0 && (
              <div>
                <p className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Projects ({filteredProjects.length})
                </p>
                <div className="space-y-1">
                  {filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        onNavigateView('projects');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-neutral-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: `${proj.color}33`, border: `1px solid ${proj.color}66` }}
                        >
                          <FolderKanban className="h-3.5 w-3.5" style={{ color: proj.color }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white">
                            {proj.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">{proj.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400">{proj.chatsCount} chats</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Section */}
            {(activeTab === 'all' || activeTab === 'tools') && filteredTools.length > 0 && (
              <div>
                <p className="px-3 py-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  AI Tools ({filteredTools.length})
                </p>
                <div className="space-y-1">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        onNavigateView('tools');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-neutral-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-pink-400">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white">
                            {tool.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">{tool.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/40">
                        {tool.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts Help */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-800 bg-neutral-950 text-[11px] text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 border border-neutral-700">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 border border-neutral-700">↑↓</kbd> Navigate
              </span>
            </div>
            <span>Dilshad AI Command Hub</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
