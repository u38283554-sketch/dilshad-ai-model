export interface NormalizedAttachment {
  id?: string;
  name: string;
  type: string;
  mimeType?: string;
  data?: string; // base64 encoded data or text content
  size?: number;
}

export interface NormalizedChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  attachments?: NormalizedAttachment[];
}

export interface NormalizedChatRequest {
  messages: NormalizedChatMessage[];
  model?: string;
  temperature?: number;
  systemInstruction?: string;
  webSearch?: boolean;
  deepReasoning?: boolean;
  conversationId?: string;
}

export interface NormalizedChatResponse {
  text: string;
  provider: string;
  model: string;
  reasoning?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AnalyzeImageRequest {
  prompt: string;
  image: {
    mimeType: string;
    data: string; // base64 string
    name?: string;
  };
  model?: string;
}

export interface AnalyzeFileRequest {
  prompt: string;
  file: {
    name: string;
    type: string;
    mimeType?: string;
    data: string;
  };
  model?: string;
}

export interface AIProvider {
  readonly name: string;
  sendMessage(request: NormalizedChatRequest): Promise<NormalizedChatResponse>;
  streamMessage?(
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<NormalizedChatResponse>;
  analyzeImage(request: AnalyzeImageRequest): Promise<NormalizedChatResponse>;
  analyzeFile(request: AnalyzeFileRequest): Promise<NormalizedChatResponse>;
}
