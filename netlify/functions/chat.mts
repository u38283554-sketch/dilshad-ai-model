import { ChatService } from '../../server/services/chatService';
import { sanitizeError } from '../../server/utils/errors';
import { validateChatRequest } from '../../server/utils/validation';

const chatService = new ChatService();

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON request payload.' }, 400);
  }

  try {
    const validatedRequest = validateChatRequest(body);
    const requestUrl = new URL(request.url);
    const requestBody = body as Record<string, unknown>;
    const isStreaming = requestUrl.searchParams.get('stream') === 'true' || requestBody.stream === true;

    if (!isStreaming) {
      const response = await chatService.processChat(validatedRequest);
      return jsonResponse({ ok: true, ...response });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const sendEvent = (event: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          const response = await chatService.streamChat(validatedRequest, (chunk) => {
            sendEvent({ type: 'chunk', text: chunk });
          });
          sendEvent({ type: 'done', ...response });
        } catch (error) {
          const { userMessage, statusCode } = sanitizeError(error);
          sendEvent({ type: 'error', error: userMessage, statusCode });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Cache-Control': 'no-cache, no-transform',
        'Content-Type': 'text/event-stream; charset=utf-8',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    const { userMessage, statusCode } = sanitizeError(error);
    return jsonResponse({ ok: false, error: userMessage }, statusCode);
  }
}

export const config = {
  path: '/api/chat',
};
