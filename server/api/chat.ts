import { Request, Response, Router } from 'express';
import { ChatService } from '../services/chatService';
import { validateChatRequest } from '../utils/validation';
import { sanitizeError } from '../utils/errors';

export const chatRouter = Router();
const chatService = new ChatService();

chatRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const isStreaming = req.query.stream === 'true' || req.body?.stream === true;

  try {
    const validatedRequest = validateChatRequest(req.body);

    if (isStreaming) {
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      try {
        const finalResponse = await chatService.streamChat(validatedRequest, (chunk: string) => {
          res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
        });

        res.write(`data: ${JSON.stringify({ type: 'done', ...finalResponse })}\n\n`);
        res.end();
      } catch (streamErr) {
        const { userMessage, statusCode } = sanitizeError(streamErr);
        res.write(
          `data: ${JSON.stringify({ type: 'error', error: userMessage, statusCode })}\n\n`
        );
        res.end();
      }
    } else {
      // Standard JSON response
      const response = await chatService.processChat(validatedRequest);
      res.json({
        ok: true,
        ...response,
      });
    }
  } catch (err) {
    const { userMessage, statusCode } = sanitizeError(err);
    if (!res.headersSent) {
      res.status(statusCode).json({
        ok: false,
        error: userMessage,
      });
    } else {
      res.end();
    }
  }
});
