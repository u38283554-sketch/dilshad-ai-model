import React, { useState, useEffect } from 'react';
import {
  ChatConversation,
  Message,
  Attachment,
  ActiveView,
  User as UserType,
  Project,
  StoredFile,
} from '../../types';
import {
  INITIAL_CONVERSATIONS,
  AI_MODELS,
  MOCK_PROJECTS,
  MOCK_FILES,
  MOCK_AI_TOOLS,
  MOCK_NOTIFICATIONS,
  MOCK_USER,
} from '../../services/mockData';
import { AIClient } from '../../services/aiClient';
import { getStoredUser, mockLogout } from '../../services/mockAuth';
import { generateId } from '../../lib/utils';

// UI Components
import { Header } from '../header/Header';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatContainer } from '../chat/ChatContainer';
import { ProjectsView } from '../views/ProjectsView';
import { FilesView } from '../views/FilesView';
import { ToolsView } from '../views/ToolsView';
import { CommandPalette } from '../modals/CommandPalette';
import { FileUploadModal } from '../modals/FileUploadModal';
import { SettingsModal } from '../modals/SettingsModal';
import { NotificationsModal } from '../modals/NotificationsModal';
import { HelpModal } from '../modals/HelpModal';
import { AuthModal } from '../auth/AuthModal';

export const AppLayout: React.FC = () => {
  // State
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('dilshad_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [activeChatId, setActiveChatId] = useState<string | null>('chat_today_1');
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [selectedModelId, setSelectedModelId] = useState<string>('dilshad-pro');
  const [user, setUser] = useState<UserType | null>(getStoredUser);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [files, setFiles] = useState<StoredFile[]>(MOCK_FILES);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Modals & Navigation States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Loading / AI Generation
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dilshad_conversations', JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to persist conversations', e);
    }
  }, [conversations]);

  // Ensure dark mode class is permanently present
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Toast Helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Keyboard Shortcuts (Cmd+K, Cmd+N)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const activeChat = conversations.find((c) => c.id === activeChatId) || null;

  // Handler: Start New Chat
  const handleNewChat = () => {
    setActiveChatId(null);
    setActiveView('chat');
  };

  // Handler: Select Existing Chat
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setActiveView('chat');
  };

  // Handler: Send Message
  const handleSendMessage = async (
    content: string,
    attachments: Attachment[] = [],
    options: { webSearch: boolean; deepReasoning: boolean }
  ) => {
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments,
    };

    let targetChatId = activeChatId;
    let currentMessages: Message[] = [];

    if (!targetChatId) {
      // Create new conversation
      const newTitle = content.length > 32 ? `${content.slice(0, 32)}...` : content || 'New Conversation';
      const newChat: ChatConversation = {
        id: generateId(),
        title: newTitle,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        category: 'today',
        modelId: selectedModelId,
        messages: [userMsg],
      };
      setConversations((prev) => [newChat, ...prev]);
      targetChatId = newChat.id;
      setActiveChatId(newChat.id);
      currentMessages = [userMsg];
    } else {
      // Append to active chat
      const chat = conversations.find((c) => c.id === targetChatId);
      currentMessages = chat ? [...chat.messages, userMsg] : [userMsg];
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetChatId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, userMsg],
            };
          }
          return c;
        })
      );
    }

    const assistantMsgId = generateId();
    const activeModel = AI_MODELS.find((m) => m.id === selectedModelId);

    // Initial placeholder message for real-time streaming
    const placeholderAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: activeModel?.name || 'Dilshad AI Pro',
      isStreaming: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetChatId
          ? { ...c, messages: [...c.messages, placeholderAssistantMsg] }
          : c
      )
    );

    setIsLoading(true);

    try {
      const aiResult = await AIClient.sendMessage({
        messages: currentMessages,
        modelId: selectedModelId,
        webSearch: options.webSearch,
        deepReasoning: options.deepReasoning,
        onChunk: (_chunk, fullTextSoFar) => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== targetChatId) return c;
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: fullTextSoFar, isStreaming: true }
                    : m
                ),
              };
            })
          );
        },
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetChatId) return c;
          return {
            ...c,
            updatedAt: Date.now(),
            messages: c.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: aiResult.text,
                    isStreaming: false,
                    model: activeModel?.name || aiResult.model || 'Dilshad AI Pro',
                    tokens: aiResult.tokens,
                  }
                : m
            ),
          };
        })
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate AI response. Please try again.';
      showToast(errorMessage);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetChatId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: `⚠️ **AI Service Notice**\n\n${errorMessage}`,
                    isStreaming: false,
                  }
                : m
            ),
          };
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Regenerate
  const handleRegenerate = async (messageId: string) => {
    if (!activeChat || activeChat.messages.length === 0) return;
    const lastUserMsg = [...activeChat.messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    const assistantMsgId = generateId();
    const activeModel = AI_MODELS.find((m) => m.id === selectedModelId);

    const placeholderAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: activeModel?.name || 'Dilshad AI Pro',
      isStreaming: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              messages: [
                ...c.messages.filter((m) => m.id !== messageId),
                placeholderAssistantMsg,
              ],
            }
          : c
      )
    );

    setIsLoading(true);

    try {
      const historyWithoutTarget = activeChat.messages.filter((m) => m.id !== messageId);
      const aiResult = await AIClient.sendMessage({
        messages: historyWithoutTarget,
        modelId: selectedModelId,
        deepReasoning: true,
        onChunk: (_chunk, fullTextSoFar) => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== activeChat.id) return c;
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: fullTextSoFar, isStreaming: true }
                    : m
                ),
              };
            })
          );
        },
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeChat.id) return c;
          return {
            ...c,
            updatedAt: Date.now(),
            messages: c.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: aiResult.text,
                    isStreaming: false,
                    model: activeModel?.name || aiResult.model || 'Dilshad AI Pro',
                    tokens: aiResult.tokens,
                  }
                : m
            ),
          };
        })
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to regenerate AI response. Please try again.';
      showToast(errorMessage);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeChat.id) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: `⚠️ **AI Service Notice**\n\n${errorMessage}`,
                    isStreaming: false,
                  }
                : m
            ),
          };
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Edit Message
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!activeChat) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          const index = c.messages.findIndex((m) => m.id === messageId);
          if (index !== -1) {
            const updated = [...c.messages];
            updated[index] = { ...updated[index], content: newContent };
            return { ...c, messages: updated };
          }
        }
        return c;
      })
    );
    showToast('Message updated');
  };

  // Handler: Reaction Like/Dislike
  const handleLikeMessage = (messageId: string) => {
    if (!activeChat) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === messageId
                ? { ...m, reactions: { ...m.reactions, liked: !m.reactions?.liked, disliked: false } }
                : m
            ),
          };
        }
        return c;
      })
    );
    showToast('Response rating submitted');
  };

  const handleDislikeMessage = (messageId: string) => {
    if (!activeChat) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === messageId
                ? { ...m, reactions: { ...m.reactions, disliked: !m.reactions?.disliked, liked: false } }
                : m
            ),
          };
        }
        return c;
      })
    );
    showToast('Feedback noted for model improvement');
  };

  // Handler: Rename Chat
  const handleRenameChat = (id: string, newTitle: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)));
    showToast('Conversation renamed');
  };

  // Handler: Delete Chat
  const handleDeleteChat = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
    showToast('Conversation deleted');
  };

  // Handler: Pin Chat
  const handlePinChat = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  // Handler: Clear All Chats
  const handleClearAllChats = () => {
    setConversations([]);
    setActiveChatId(null);
    showToast('All chat logs cleared');
  };

  // Handler: Export Chats
  const handleExportChats = () => {
    const jsonStr = JSON.stringify(conversations, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dilshad_ai_chats_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Conversations exported to JSON');
  };

  // Handler: Create Project
  const handleCreateProject = (name: string, description: string, color: string) => {
    const newProj: Project = {
      id: generateId(),
      name,
      description,
      color,
      chatsCount: 0,
      filesCount: 0,
      updatedAt: Date.now(),
    };
    setProjects((prev) => [newProj, ...prev]);
    showToast(`Project "${name}" created successfully`);
  };

  // Handler: Open Project in Chat
  const handleOpenProjectChat = (projectName: string) => {
    setActiveView('chat');
    handleSendMessage(`Load workspace context for "${projectName}". Summarize the roadmap and current objectives.`, [], {
      webSearch: false,
      deepReasoning: true,
    });
  };

  // Handler: Delete File
  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    showToast('File removed from knowledge repository');
  };

  // Handler: Analyze File in Chat
  const handleAnalyzeFileInChat = (fileName: string) => {
    setActiveView('chat');
    handleSendMessage(`Analyze the uploaded document "${fileName}". Extract the executive summary and key deliverables.`, [], {
      webSearch: false,
      deepReasoning: true,
    });
  };

  // Handler: Auth
  const handleLogout = async () => {
    await mockLogout();
    setUser(null);
    showToast('Signed out of Dilshad AI');
  };

  const handleAuthSuccess = (authenticatedUser: UserType) => {
    setUser(authenticatedUser);
    showToast(`Welcome back, ${authenticatedUser.name}!`);
  };

  const activeModel = AI_MODELS.find((m) => m.id === selectedModelId);

  return (
    <div className="flex h-screen w-screen overflow-hidden dark bg-neutral-950 text-neutral-100">
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeChatId={activeChatId}
        activeView={activeView}
        user={user}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onNavigateView={(view) => setActiveView(view)}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        onPinChat={handlePinChat}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAuth={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative">
        {/* Header */}
        <Header
          currentChatTitle={
            activeView === 'chat'
              ? activeChat?.title || 'New Conversation'
              : activeView === 'projects'
              ? 'Projects & Workspaces'
              : activeView === 'files'
              ? 'Knowledge Base'
              : 'AI Tools & Agents'
          }
          selectedModelId={selectedModelId}
          onSelectModel={(id) => {
            setSelectedModelId(id);
            const m = AI_MODELS.find((item) => item.id === id);
            showToast(`Switched model to ${m?.name}`);
          }}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onNewChat={handleNewChat}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          unreadCount={notifications.filter((n) => !n.read).length}
          user={user}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* View Switcher */}
        {activeView === 'chat' && (
          <ChatContainer
            messages={activeChat ? activeChat.messages : []}
            isLoading={isLoading}
            modelName={activeModel?.name || 'Dilshad AI Pro'}
            onSendMessage={handleSendMessage}
            onRegenerateMessage={handleRegenerate}
            onEditMessage={handleEditMessage}
            onLikeMessage={handleLikeMessage}
            onDislikeMessage={handleDislikeMessage}
            onStopGeneration={() => setIsLoading(false)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeView === 'projects' && (
          <ProjectsView
            projects={projects}
            onCreateProject={handleCreateProject}
            onOpenProjectChat={handleOpenProjectChat}
          />
        )}

        {activeView === 'files' && (
          <FilesView
            files={files}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onAnalyzeFileInChat={handleAnalyzeFileInChat}
            onDeleteFile={handleDeleteFile}
          />
        )}

        {activeView === 'tools' && (
          <ToolsView
            tools={MOCK_AI_TOOLS}
            onSelectTool={(prompt) => {
              setActiveView('chat');
              handleSendMessage(prompt, [], { webSearch: false, deepReasoning: true });
            }}
          />
        )}
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900/95 px-4 py-2.5 text-xs font-semibold text-neutral-100 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        conversations={conversations}
        projects={projects}
        files={files}
        tools={MOCK_AI_TOOLS}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onNavigateView={(view) => setActiveView(view)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onLogout={handleLogout}
      />

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFilesUploaded={(newAttachments) => {
          if (activeChatId) {
            handleSendMessage('Analyze these newly attached documents:', newAttachments, {
              webSearch: false,
              deepReasoning: false,
            });
          }
        }}
        onShowToast={showToast}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        selectedModelId={selectedModelId}
        onSelectModel={setSelectedModelId}
        onClearAllChats={handleClearAllChats}
        onExportChats={handleExportChats}
        onShowToast={showToast}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('All notifications marked as read');
        }}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onShowToast={showToast}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </div>
  );
};
