import { GoogleGenAI } from '@google/genai';
import {
  AIProvider,
  NormalizedChatRequest,
  NormalizedChatResponse,
  AnalyzeImageRequest,
  AnalyzeFileRequest,
} from './AIProvider';
import { DEFAULT_DILSHAD_SYSTEM_PROMPT } from '../config/systemPrompt';
import { resolveModelName } from '../config/ai';
import { AppError } from '../utils/errors';
import { ImageService } from '../services/imageService';
import { FileService } from '../services/fileService';

export class GeminiProvider implements AIProvider {
  public readonly name = 'gemini';

  private getClient(): GoogleGenAI {
    let apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
    if (
      (apiKey.startsWith('"') && apiKey.endsWith('"')) ||
      (apiKey.startsWith("'") && apiKey.endsWith("'"))
    ) {
      apiKey = apiKey.slice(1, -1).trim();
    }

    const placeholderPatterns = [
      '',
      'my_gemini_api_key',
      '<my_gemini_api_key>',
      'your_gemini_api_key',
      '<your_gemini_api_key>',
      'your_api_key',
      'undefined',
      'null',
    ];

    if (apiKey && !placeholderPatterns.includes(apiKey.toLowerCase())) {
      return new GoogleGenAI({ apiKey });
    }

    if (process.env.NETLIFY_AI_GATEWAY_KEY || process.env.GOOGLE_GEMINI_BASE_URL) {
      return new GoogleGenAI({});
    }

    throw new AppError(
      'Gemini is not configured. Set GEMINI_API_KEY in the Netlify environment variables or enable Netlify AI Gateway.',
      401
    );
  }

  public async sendMessage(request: NormalizedChatRequest): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const primaryModel = resolveModelName(request.model);
    const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.1-pro-preview'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );

    const contents = this.buildContents(request);
    const config = this.buildConfig(request);

    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });

        const text = response.text || '';

        return {
          text,
          provider: 'gemini',
          model,
          usage: response.usageMetadata
            ? {
                promptTokens: response.usageMetadata.promptTokenCount,
                completionTokens: response.usageMetadata.candidatesTokenCount,
                totalTokens: response.usageMetadata.totalTokenCount,
              }
            : undefined,
        };
      } catch (err: any) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        // If it's a rate limit or temporary server overload, try fallback candidate model
        if (
          msg.includes('429') ||
          msg.includes('quota') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('503') ||
          msg.includes('500') ||
          msg.includes('404') ||
          msg.includes('UNAVAILABLE')
        ) {
          console.warn(`[GeminiProvider] Model ${model} failed (${msg}). Trying fallback...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        throw err;
      }
    }

    throw lastError;
  }

  public async streamMessage(
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const primaryModel = resolveModelName(request.model);
    const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.1-pro-preview'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );

    const contents = this.buildContents(request);
    const config = this.buildConfig(request);

    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const stream = await ai.models.generateContentStream({
          model,
          contents,
          config,
        });

        let fullText = '';
        let usageMetadata: any = undefined;

        for await (const chunk of stream) {
          const chunkText = chunk.text || '';
          if (chunkText) {
            fullText += chunkText;
            onChunk(chunkText);
          }
          if (chunk.usageMetadata) {
            usageMetadata = chunk.usageMetadata;
          }
        }

        return {
          text: fullText,
          provider: 'gemini',
          model,
          usage: usageMetadata
            ? {
                promptTokens: usageMetadata.promptTokenCount,
                completionTokens: usageMetadata.candidatesTokenCount,
                totalTokens: usageMetadata.totalTokenCount,
              }
            : undefined,
        };
      } catch (err: any) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('429') ||
          msg.includes('quota') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('503') ||
          msg.includes('500') ||
          msg.includes('404') ||
          msg.includes('UNAVAILABLE')
        ) {
          console.warn(`[GeminiProvider Stream] Model ${model} failed (${msg}). Trying fallback...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        throw err;
      }
    }

    throw lastError;
  }

  public async analyzeImage(request: AnalyzeImageRequest): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const primaryModel = resolveModelName(request.model);
    const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-3.7-flash'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );

    let cleanData = request.image.data;
    let mimeType = request.image.mimeType || 'image/png';

    if (cleanData.startsWith('data:')) {
      const match = cleanData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        cleanData = match[2];
      }
    }

    let lastError: any = null;
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanData,
                },
              },
              {
                text: request.prompt || 'Please analyze this image in detail.',
              },
            ],
          },
          config: {
            systemInstruction: DEFAULT_DILSHAD_SYSTEM_PROMPT,
          },
        });

        return {
          text: response.text || '',
          provider: 'gemini',
          model,
        };
      } catch (err: any) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('429') ||
          msg.includes('quota') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('503') ||
          msg.includes('500') ||
          msg.includes('404') ||
          msg.includes('UNAVAILABLE')
        ) {
          console.warn(`[GeminiProvider Image] Model ${model} failed (${msg}). Trying fallback...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }

  public async analyzeFile(request: AnalyzeFileRequest): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const primaryModel = resolveModelName(request.model);
    const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-3.7-flash'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );

    const promptText = `Please analyze the attached document (${request.file.name}):\n\n${request.file.data}\n\nUser Request: ${request.prompt || 'Summarize and extract key insights.'}`;

    let lastError: any = null;
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: promptText,
          config: {
            systemInstruction: DEFAULT_DILSHAD_SYSTEM_PROMPT,
          },
        });

        return {
          text: response.text || '',
          provider: 'gemini',
          model,
        };
      } catch (err: any) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('429') ||
          msg.includes('quota') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('503') ||
          msg.includes('500') ||
          msg.includes('404') ||
          msg.includes('UNAVAILABLE')
        ) {
          console.warn(`[GeminiProvider File] Model ${model} failed (${msg}). Trying fallback...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }

  private buildContents(request: NormalizedChatRequest) {
    const rawTurns: Array<{ role: 'user' | 'model'; parts: any[] }> = [];

    for (const msg of request.messages) {
      if (msg.role === 'system') continue;

      const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model';
      const parts: any[] = [];

      // Extract image attachments
      const imageParts = ImageService.extractImageParts(msg.attachments);
      for (const img of imageParts) {
        parts.push({
          inlineData: {
            mimeType: img.mimeType,
            data: img.data,
          },
        });
      }

      // Extract text/file attachments
      const fileContext = FileService.formatAttachmentContext(msg.attachments);
      const fullText = `${msg.content || ''}${fileContext}`.trim();

      if (fullText.length > 0 || parts.length === 0) {
        parts.push({
          text: fullText || ' ',
        });
      }

      if (parts.length > 0) {
        rawTurns.push({ role, parts });
      }
    }

    // Merge consecutive turns with the same role into a single consolidated turn
    const consolidatedTurns: Array<{ role: 'user' | 'model'; parts: any[] }> = [];
    for (const turn of rawTurns) {
      if (consolidatedTurns.length === 0) {
        // First turn must be user in Gemini multiturn
        if (turn.role === 'model') {
          consolidatedTurns.push({
            role: 'user',
            parts: [{ text: 'Hello' }],
          });
        }
        consolidatedTurns.push(turn);
      } else {
        const lastTurn = consolidatedTurns[consolidatedTurns.length - 1];
        if (lastTurn.role === turn.role) {
          lastTurn.parts.push(...turn.parts);
        } else {
          consolidatedTurns.push(turn);
        }
      }
    }

    // Ensure we have at least one user turn
    if (consolidatedTurns.length === 0) {
      consolidatedTurns.push({
        role: 'user',
        parts: [{ text: 'Hello' }],
      });
    }

    return consolidatedTurns;
  }

  private buildConfig(request: NormalizedChatRequest) {
    const systemInstruction = request.systemInstruction
      ? `${DEFAULT_DILSHAD_SYSTEM_PROMPT}\n\nUser custom instructions:\n${request.systemInstruction}`
      : DEFAULT_DILSHAD_SYSTEM_PROMPT;

    const config: any = {
      systemInstruction,
    };

    if (typeof request.temperature === 'number') {
      config.temperature = request.temperature;
    }

    if (request.webSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    return config;
  }
}
