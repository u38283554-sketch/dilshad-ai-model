import { AppError } from './errors';
import { NormalizedChatRequest } from '../providers/AIProvider';
import { AI_CONFIG } from '../config/ai';

export function validateChatRequest(body: unknown): NormalizedChatRequest {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid request payload', 400);
  }

  const req = body as Record<string, unknown>;

  if (!Array.isArray(req.messages) || req.messages.length === 0) {
    throw new AppError('Messages array is required and cannot be empty', 400);
  }

  for (const msg of req.messages) {
    if (!msg || typeof msg !== 'object') {
      throw new AppError('Invalid message format in array', 400);
    }
    if (typeof msg.content !== 'string') {
      throw new AppError('Message content must be a string', 400);
    }
    if (msg.content.length > AI_CONFIG.maxMessageLength) {
      throw new AppError(`Message exceeds maximum permitted length of ${AI_CONFIG.maxMessageLength} characters`, 400);
    }
  }

  return {
    messages: req.messages as NormalizedChatRequest['messages'],
    model: typeof req.model === 'string' ? req.model : undefined,
    temperature: typeof req.temperature === 'number' ? req.temperature : undefined,
    systemInstruction: typeof req.systemInstruction === 'string' ? req.systemInstruction : undefined,
    webSearch: Boolean(req.webSearch),
    deepReasoning: Boolean(req.deepReasoning),
    conversationId: typeof req.conversationId === 'string' ? req.conversationId : undefined,
  };
}
