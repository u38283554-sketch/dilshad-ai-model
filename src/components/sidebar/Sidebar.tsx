import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  MessageSquare,
  FolderKanban,
  FileText,
  Wrench,
  Pin,
  MoreHorizontal,
  Edit2,
  Trash2,
  Share2,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  Keyboard,
  HelpCircle,
  LogOut,
  Check,
  X,
  Search,
} from 'lucide-react';
import { ChatConversation, User as UserType, ActiveView } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  conversations: ChatConversation[];
  activeChatId: string | null;
  activeView: ActiveView;
  user: UserType | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onNavigateView: (view: ActiveView) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onPinChat: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHelp?: () => void;
  onOpenCommandPalette: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeChatId,
  activeView,
  user,
  isOpen,
  onToggleOpen,
  onSelectChat,
  onNewChat,
  onNavigateView,
  onRenameChat,
  onDeleteChat,
  onPinChat,
  onOpenSettings,
  onOpenHelp,
  onOpenCommandPalette,
  onOpenAuth,
  onLogout,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartRename = (chat: ChatConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
    setOpenMenuChatId(null);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  // Group conversations
  const todayChats = conversations.filter((c) => c.category === 'today');
  const yesterdayChats = conversations.filter((c) => c.category === 'yesterday');
  const olderChats = conversations.filter((c) => c.category === 'older');

  const renderChatItem = (chat: ChatConversation) => {
    const isActive = activeChatId === chat.id && activeView === 'chat';
    const isEditing = editingChatId === chat.id;

    return (
      <div
        key={chat.id}
        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all ${
          isActive
            ? 'bg-neutral-800/90 text-white font-medium shadow-sm border border-neutral-700/50'
            : 'text-neutral-300 hover:bg-neutral-800/40 hover:text-neutral-100'
        }`}
        onClick={() => {
          if (!isEditing) {
            onSelectChat(chat.id);
            onCloseMobileDrawer();
          }
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <MessageSquare
            className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-neutral-400 group-hover:text-neutral-300'}`}
          />
          {isEditing ? (
            <form
              onSubmit={(e) => handleSaveRename(chat.id, e)}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 flex-1 min-w-0"
            >
              <input
                type="text"
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleSaveRename(chat.id)}
                className="w-full rounded-md bg-neutral-950 px-2 py-0.5 text-xs text-white border border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded p-1 text-emerald-400 hover:bg-neutral-700"
              >
                <Check className="h-3 w-3" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="truncate">{chat.title}</span>
              {chat.pinned && <Pin className="h-2.5 w-2.5 text-indigo-400 shrink-0 fill-indigo-400/40" />}
            </div>
          )}
        </div>

        {/* 3-Dot Action Menu */}
        {!isEditing && (
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              id={`btn-chat-menu-${chat.id}`}
              onClick={() => setOpenMenuChatId(openMenuChatId === chat.id ? null : chat.id)}
              className={`rounded-lg p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white transition ${
                openMenuChatId === chat.id ? 'opacity-100 bg-neutral-700 text-white' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>

            {/* Popup Menu */}
            {openMenuChatId === chat.id && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-neutral-800 bg-neutral-900 p-1 shadow-2xl z-30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPinChat(chat.id);
                    setOpenMenuChatId(null);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                  <Pin className="h-3 w-3" />
                  <span>{chat.pinned ? 'Unpin chat' : 'Pin chat'}</span>
                </button>
                <button
                  onClick={(e) => handleStartRename(chat, e)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                    setOpenMenuChatId(null);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-neutral-950/90 backdrop-blur-xl border-r border-neutral-800/80 select-none">
      {/* Top Header & Brand */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-neutral-800/60">
        <div
          onClick={() => onNavigateView('chat')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-neutral-950">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-neutral-100 group-hover:text-white leading-tight">
              Dilshad AI
            </h1>
            <span className="text-[10px] font-semibold text-neutral-400">Assistant Pro</span>
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          id="btn-collapse-sidebar"
          onClick={onToggleOpen}
          className="hidden md:flex rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Mobile Close */}
        <button
          onClick={onCloseMobileDrawer}
          className="md:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Primary Navigation & New Chat Button */}
      <div className="p-3 space-y-2 border-b border-neutral-800/60">
        <button
          id="btn-sidebar-new-chat"
          onClick={() => {
            onNewChat();
            onCloseMobileDrawer();
          }}
          className="w-full flex items-center justify-between rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Chat</span>
          </div>
          <kbd className="hidden sm:inline-block rounded bg-indigo-700/60 px-1.5 py-0.5 text-[9px] font-mono">
            ⌘N
          </kbd>
        </button>

        {/* Quick View Links */}
        <div className="space-y-0.5 pt-1">
          {[
            { id: 'chat', label: 'Chats', icon: <MessageSquare className="h-3.5 w-3.5" /> },
            { id: 'projects', label: 'Projects', icon: <FolderKanban className="h-3.5 w-3.5" /> },
            { id: 'files', label: 'Files', icon: <FileText className="h-3.5 w-3.5" /> },
            { id: 'tools', label: 'AI Tools', icon: <Wrench className="h-3.5 w-3.5" /> },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => {
                onNavigateView(nav.id as ActiveView);
                onCloseMobileDrawer();
              }}
              className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
                activeView === nav.id
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              }`}
            >
              {nav.icon}
              <span>{nav.label}</span>
            </button>
          ))}

          {/* Quick Search in Sidebar */}
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-3.5 w-3.5" />
              <span>Search...</span>
            </div>
            <kbd className="text-[10px] font-mono text-neutral-500">⌘K</kbd>
          </button>
        </div>
      </div>

      {/* Chat History Grouped List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TODAY */}
        {todayChats.length > 0 && (
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Today
            </p>
            <div className="space-y-0.5">{todayChats.map(renderChatItem)}</div>
          </div>
        )}

        {/* YESTERDAY */}
        {yesterdayChats.length > 0 && (
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Yesterday
            </p>
            <div className="space-y-0.5">{yesterdayChats.map(renderChatItem)}</div>
          </div>
        )}

        {/* OLDER */}
        {olderChats.length > 0 && (
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Older
            </p>
            <div className="space-y-0.5">{olderChats.map(renderChatItem)}</div>
          </div>
        )}
      </div>

      {/* User Profile & Dropdown (Bottom) */}
      <div ref={profileRef} className="relative p-3 border-t border-neutral-800/60 bg-neutral-950/90">
        <button
          id="btn-sidebar-profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center justify-between p-2 rounded-xl border border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-900 transition group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt="User avatar"
                className="h-8 w-8 rounded-xl object-cover border border-neutral-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white">
                {user?.name || 'Dilshad Developer'}
              </p>
              <p className="text-[10px] text-neutral-400 truncate">{user?.email || 'dilshad@workspace.ai'}</p>
            </div>
          </div>
          <span className="rounded bg-indigo-950 border border-indigo-800/60 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
            {user?.tier || 'PRO'}
          </span>
        </button>

        {/* Profile Menu Popup */}
        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-3 right-3 mb-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-1.5 shadow-2xl z-40"
            >
              <div className="px-3 py-2 border-b border-neutral-800 text-xs">
                <p className="font-bold text-neutral-100">{user?.name || 'Dilshad Developer'}</p>
                <p className="text-[10px] text-neutral-400">{user?.email || 'dilshad@workspace.ai'}</p>
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Profile & Account</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    onOpenCommandPalette();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <Keyboard className="h-3.5 w-3.5" />
                  <span>Keyboard Shortcuts</span>
                </button>

                <button
                  id="btn-sidebar-help-support"
                  onClick={() => {
                    if (onOpenHelp) {
                      onOpenHelp();
                    }
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Help & Support</span>
                </button>
              </div>

              <div className="border-t border-neutral-800 pt-1">
                {user ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-indigo-400 hover:bg-indigo-950/40"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-20 ${
          isOpen ? 'w-64 lg:w-72' : 'w-0 overflow-hidden'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Floating expand trigger if desktop sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          className="hidden md:flex fixed top-4 left-4 z-30 items-center justify-center h-9 w-9 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 shadow-xl hover:bg-neutral-800 hover:text-white transition"
          title="Expand Sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobileDrawer}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
