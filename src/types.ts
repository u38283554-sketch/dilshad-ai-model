export type Role = 'user' | 'assistant' | 'system';

export type FileType = 'pdf' | 'docx' | 'txt' | 'csv' | 'image' | 'code' | 'audio' | 'other';

export interface Attachment {
  id: string;
  name: string;
  type: FileType;
  size: number;
  url?: string;
  previewUrl?: string;
  data?: string;
  mimeType?: string;
  progress?: number;
  status: 'uploading' | 'completed' | 'error';
  extension?: string;
}

export interface MessageReaction {
  liked?: boolean;
  disliked?: boolean;
  bookmarked?: boolean;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  model?: string;
  reactions?: MessageReaction;
  isStreaming?: boolean;
  reasoning?: string;
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  messages: Message[];
  modelId: string;
  category: 'today' | 'yesterday' | 'older';
  projectId?: string;
}

export interface AIModel {
  id: string;
  name: string;
  badge?: string;
  description: string;
  speed: 'Ultra Fast' | 'Fast' | 'Balanced' | 'Deep Thinker';
  capability: string;
  contextWindow: string;
  iconName: string;
  isPro?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: 'Pro' | 'Free' | 'Enterprise';
  creditsLeft: number;
  maxCredits: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  chatsCount: number;
  filesCount: number;
  updatedAt: number;
}

export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  uploadedAt: number;
  extension: string;
  tags: string[];
  summary?: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: 'Writing' | 'Coding' | 'Analysis' | 'Productivity' | 'Creative';
  icon: string;
  badge?: string;
  samplePrompt: string;
}

export type ActiveView = 'chat' | 'projects' | 'files' | 'tools' | 'auth';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'feature' | 'system' | 'tip';
}
