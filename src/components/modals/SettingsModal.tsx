import React, { useState } from 'react';
import {
  X,
  User,
  Sliders,
  Sparkles,
  Keyboard,
  Shield,
  Check,
  Zap,
  Trash2,
  Download,
  Volume2,
} from 'lucide-react';
import { AI_MODELS } from '../../services/mockData';
import { User as UserType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  onClearAllChats: () => void;
  onExportChats: () => void;
  onShowToast: (msg: string) => void;
}

type SettingsTab = 'general' | 'models' | 'account' | 'shortcuts' | 'privacy';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedModelId,
  onSelectModel,
  onClearAllChats,
  onExportChats,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [temperature, setTemperature] = useState(0.7);
  const [soundEffects, setSoundEffects] = useState(true);
  const [streamAnimation, setStreamAnimation] = useState(true);
  const [customInstructions, setCustomInstructions] = useState(
    'Respond concisely with high technical precision, practical examples, and clean markdown tables when applicable.'
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative flex flex-col md:flex-row w-full max-w-3xl h-[560px] rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        >
          {/* Left Tab Navigation */}
          <div className="w-full md:w-56 border-r border-neutral-800 bg-neutral-950/60 p-4 shrink-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400">
                <Sliders className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-neutral-100">Preferences</h2>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'general', label: 'General & Audio', icon: <Sliders className="h-4 w-4" /> },
                { id: 'models', label: 'AI Model & Tone', icon: <Sparkles className="h-4 w-4" /> },
                { id: 'account', label: 'Account & Plan', icon: <User className="h-4 w-4" /> },
                { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: <Keyboard className="h-4 w-4" /> },
                { id: 'privacy', label: 'Data & Privacy', icon: <Shield className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-neutral-900">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-100 capitalize">
                {activeTab.replace('-', ' ')} Settings
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Appearance Theme
                    </label>
                    <div className="p-3.5 rounded-xl border border-indigo-500/40 bg-indigo-950/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 border border-neutral-800 text-indigo-400 font-bold text-xs">
                          ✦
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-100">Obsidian Dark (Standard)</p>
                          <p className="text-[11px] text-neutral-400">
                            Ultra-clean dark system tuned for code synthesis and visual ergonomics.
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-indigo-900/80 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-700/50">
                        Default
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800/80 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-neutral-200">Sound Effects & Audio Feedback</p>
                        <p className="text-[11px] text-neutral-400">Play subtle acoustic feedback on send and completion</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={soundEffects}
                        onChange={(e) => setSoundEffects(e.target.checked)}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-neutral-200">Stream Token Animations</p>
                        <p className="text-[11px] text-neutral-400">Smooth character and reasoning animation flow</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={streamAnimation}
                        onChange={(e) => setStreamAnimation(e.target.checked)}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Models Tab */}
              {activeTab === 'models' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      Default AI Model
                    </label>
                    <div className="space-y-2">
                      {AI_MODELS.map((model) => (
                        <div
                          key={model.id}
                          onClick={() => onSelectModel(model.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            selectedModelId === model.id
                              ? 'border-indigo-500 bg-indigo-950/40'
                              : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-indigo-400">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-neutral-200">{model.name}</p>
                                {model.badge && (
                                  <span className="rounded bg-indigo-900/60 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                                    {model.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-400">{model.description}</p>
                            </div>
                          </div>
                          {selectedModelId === model.id && <Check className="h-4 w-4 text-indigo-400" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Creativity & Temperature ({temperature})
                      </label>
                      <span className="text-[11px] text-neutral-400">
                        {temperature < 0.4 ? 'Strict & Precise' : temperature > 0.8 ? 'Highly Creative' : 'Balanced'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Custom System Instructions
                    </label>
                    <textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-950">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                      alt="User avatar"
                      className="h-12 w-12 rounded-xl object-cover border border-neutral-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-neutral-100">{user?.name || 'Dilshad User'}</h4>
                        <span className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-2 py-0.5 text-[10px] font-bold text-black uppercase">
                          {user?.tier || 'Pro'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">{user?.email || 'dilshad@workspace.ai'}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-300">Monthly Reasoning Credits</span>
                      <span className="font-mono text-indigo-400 font-bold">
                        {user?.creditsLeft.toLocaleString() || '8,450'} / {user?.maxCredits.toLocaleString() || '10,000'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-[84%]" />
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Credits reset on the 1st of every month. Pro tier includes unlimited fast generation.
                    </p>
                  </div>

                  <button
                    onClick={() => onShowToast('Plan upgraded! Enterprise Tier unlocked.')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Upgrade to Enterprise Unlimited</span>
                  </button>
                </div>
              )}

              {/* Shortcuts Tab */}
              {activeTab === 'shortcuts' && (
                <div className="space-y-3">
                  {[
                    { key: 'Ctrl / Cmd + K', action: 'Open Global Search & Command Palette' },
                    { key: 'Enter', action: 'Send message' },
                    { key: 'Shift + Enter', action: 'Insert new line in composer' },
                    { key: 'Esc', action: 'Close active modal or command palette' },
                    { key: 'Ctrl + /', action: 'Toggle Sidebar Expand / Collapse' },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs"
                    >
                      <span className="text-neutral-300">{s.action}</span>
                      <kbd className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 font-mono text-[11px] text-neutral-300">
                        {s.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 space-y-2">
                    <p className="text-xs font-bold text-neutral-200">Export All Chat Logs</p>
                    <p className="text-[11px] text-neutral-400">
                      Download a complete structured JSON/Markdown export of all conversations.
                    </p>
                    <button
                      onClick={onExportChats}
                      className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export Data (.json)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 space-y-2">
                    <p className="text-xs font-bold text-red-300">Delete Conversation History</p>
                    <p className="text-[11px] text-red-400/80">
                      Permanently wipe all stored chats from frontend local state. This action cannot be undone.
                    </p>
                    <button
                      onClick={onClearAllChats}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear All Chats</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-neutral-800 bg-neutral-950/50">
              <button
                onClick={() => {
                  onShowToast('Settings saved successfully');
                  onClose();
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
