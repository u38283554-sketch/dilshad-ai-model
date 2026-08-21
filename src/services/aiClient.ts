import { Attachment, Message } from '../types';

export interface SendMessageOptions {
  messages: Message[];
  modelId?: string;
  webSearch?: boolean;
  deepReasoning?: boolean;
  systemInstruction?: string;
  onChunk?: (chunk: string, fullTextSoFar: string) => void;
}

export interface SendMessageResult {
  text: string;
  provider: string;
  model: string;
  reasoning?: string;
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
}

export class AIClient {
  /**
   * Sends chat messages to the server-side AI backend at /api/chat.
   * Streams progressive chunks when onChunk callback is provided.
   */
  public static async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    const { messages, modelId, webSearch, deepReasoning, systemInstruction, onChunk } = options;

    // Convert frontend messages to normalized format
    const normalizedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content || '',
      attachments: m.attachments?.map((att: Attachment) => ({
        id: att.id,
        name: att.name,
        type: att.type,
        mimeType: att.mimeType,
        data: att.data,
        size: att.size,
      })),
    }));

    const payload = {
      messages: normalizedMessages,
      model: modelId,
      webSearch,
      deepReasoning,
      systemInstruction,
      stream: Boolean(onChunk),
    };

    // If streaming requested and ReadableStream is available
    if (onChunk && typeof window !== 'undefined' && window.ReadableStream) {
      try {
        const response = await fetch('/api/chat?stream=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorJson = await response.json().catch(() => ({}));
          throw new Error(errorJson.error || `Server responded with HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported on this response');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let resultMetadata: Partial<SendMessageResult> = {};
        let buffer = '';

        let streamError: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data:')) {
              const dataStr = trimmed.replace(/^data:\s*/, '');
              if (!dataStr) continue;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.type === 'chunk' && typeof parsed.text === 'string') {
                  fullText += parsed.text;
                  onChunk(parsed.text, fullText);
                } else if (parsed.type === 'done') {
                  resultMetadata = {
                    provider: parsed.provider,
                    model: parsed.model,
                    tokens: parsed.usage
                      ? {
                          prompt: parsed.usage.promptTokens,
                          completion: parsed.usage.completionTokens,
                          total: parsed.usage.totalTokens,
                        }
                      : undefined,
                  };
                } else if (parsed.type === 'error') {
                  streamError = parsed.error || 'AI generation encountered an error.';
                }
              } catch (e) {
                if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                  console.warn('[SSE Parse]', e.message);
                }
              }
            }
          }
        }

        if (streamError) {
          throw new Error(streamError);
        }

        return {
          text: fullText || 'No response generated.',
          provider: resultMetadata.provider || 'gemini',
          model: resultMetadata.model || modelId || 'gemini-3.7-flash',
          tokens: resultMetadata.tokens,
        };
      } catch (streamErr) {
        const errorMsg = streamErr instanceof Error ? streamErr.message : String(streamErr);
        // If the error was an authentication or specific known error, rethrow directly
        if (
          errorMsg.includes('API Key') ||
          errorMsg.includes('GEMINI_API_KEY') ||
          errorMsg.includes('Unauthorized') ||
          errorMsg.includes('401')
        ) {
          throw streamErr;
        }
        console.warn('Streaming error, falling back to standard JSON generation:', errorMsg);
        // Fallback to standard non-streaming post below
      }
    }

    // Standard POST fallback
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.error || `Server responded with HTTP ${res.status}`);
    }

    return {
      text: data.text || '',
      provider: data.provider || 'gemini',
      model: data.model || modelId || 'gemini-3.7-flash',
      tokens: data.usage
        ? {
            prompt: data.usage.promptTokens,
            completion: data.usage.completionTokens,
            total: data.usage.totalTokens,
          }
        : undefined,
    };
  }
}
