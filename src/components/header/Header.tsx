import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Sparkles,
  Search,
  Plus,
  Bell,
  ChevronDown,
  Zap,
  Check,
  Flame,
  Scale,
  Palette,
  Brain,
} from 'lucide-react';
import { AIModel, User as UserType } from '../../types';
import { AI_MODELS } from '../../services/mockData';

interface HeaderProps {
  currentChatTitle?: string;
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  onOpenMobileDrawer: () => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  user: UserType | null;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentChatTitle = 'New Conversation',
  selectedModelId,
  onSelectModel,
  onOpenMobileDrawer,
  onNewChat,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 2,
  user,
  onOpenSettings,
}) => {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModelIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="h-4 w-4 text-indigo-400" />;
      case 'Zap':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'Flame':
        return <Flame className="h-4 w-4 text-orange-400" />;
      case 'Scale':
        return <Scale className="h-4 w-4 text-emerald-400" />;
      case 'Palette':
        return <Palette className="h-4 w-4 text-pink-400" />;
      default:
        return <Brain className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-neutral-800/80 bg-neutral-950/80 px-3 sm:px-6 backdrop-blur-xl">
      {/* Left: Mobile Menu & Current Title / AI Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          id="btn-mobile-menu"
          onClick={onOpenMobileDrawer}
          className="md:hidden rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-neutral-200 truncate max-w-[130px] sm:max-w-[240px] md:max-w-xs">
            {currentChatTitle}
          </h2>

          {/* AI Status Dot */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-neutral-300">Online</span>
          </div>
        </div>
      </div>

      {/* Center/Right: Model Selector & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Model Selector Dropdown */}
        <div ref={modelDropdownRef} className="relative">
          <button
            id="btn-model-selector"
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 transition shadow-sm"
          >
            {getModelIcon(currentModel.iconName)}
            <span className="hidden xs:inline">{currentModel.name}</span>
            <span className="xs:hidden text-[11px]">Model</span>
            {currentModel.isPro && (
              <span className="hidden sm:inline rounded bg-indigo-900/80 px-1 py-0.2 text-[9px] font-bold text-indigo-300 border border-indigo-700/50">
                PRO
              </span>
            )}
            <ChevronDown className="h-3 w-3 text-neutral-400 ml-0.5" />
          </button>

          {/* Model Options Dropdown */}
          {showModelDropdown && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-neutral-800 bg-neutral-900 p-2 shadow-2xl z-40">
              <div className="px-3 py-2 border-b border-neutral-800">
                <p className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                  Select Dilshad AI Model
                </p>
                <p className="text-[10px] text-neutral-400">
                  Switch reasoning and creativity engines instantly.
                </p>
              </div>

              <div className="py-1 space-y-1">
                {AI_MODELS.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setShowModelDropdown(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                      selectedModelId === model.id
                        ? 'bg-indigo-950/70 border border-indigo-500/50 text-white'
                        : 'hover:bg-neutral-800/80 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 mt-0.5">
                        {getModelIcon(model.iconName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-neutral-100">{model.name}</p>
                          {model.badge && (
                            <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] font-bold text-neutral-400">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate max-w-[190px]">
                          {model.description}
                        </p>
                      </div>
                    </div>

                    {selectedModelId === model.id && (
                      <Check className="h-4 w-4 text-indigo-400 shrink-0 ml-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Search Button */}
        <button
          id="btn-header-search"
          onClick={onOpenSearch}
          title="Search (⌘K)"
          className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline font-sans">Search</span>
          <kbd className="hidden md:inline text-[10px] font-mono text-neutral-500 rounded bg-neutral-800 px-1 py-0.2 border border-neutral-700">
            ⌘K
          </kbd>
        </button>

        {/* New Chat Quick Action */}
        <button
          id="btn-header-new-chat"
          onClick={onNewChat}
          title="New Chat (⌘N)"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
        >
          <Plus className="h-4 w-4" />
          <span>New</span>
        </button>

        {/* Notifications Bell */}
        <button
          id="btn-header-notifications"
          onClick={onOpenNotifications}
          title="Notifications"
          className="relative rounded-xl border border-neutral-800 bg-neutral-900/60 p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <button
          id="btn-header-avatar"
          onClick={onOpenSettings}
          title="Account Settings"
          className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden border border-neutral-700/80 hover:ring-2 hover:ring-indigo-500 transition"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt="Profile avatar"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
