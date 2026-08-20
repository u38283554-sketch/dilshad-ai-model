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
    let apiKey = (process.env.GEMINI_API_KEY || '').trim();
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

    if (!apiKey || placeholderPatterns.includes(apiKey.toLowerCase())) {
      throw new AppError(
        'GEMINI_API_KEY is not configured or is missing. Please set your Gemini API Key in the Settings > Secrets menu.',
        401
      );
    }

    return new GoogleGenAI({ apiKey });
  }

  public async sendMessage(request: NormalizedChatRequest): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const model = resolveModelName(request.model);

    const contents = this.buildContents(request);
    const config = this.buildConfig(request);

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
  }

  public async streamMessage(
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const model = resolveModelName(request.model);

    const contents = this.buildContents(request);
    const config = this.buildConfig(request);

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
  }

  public async analyzeImage(request: AnalyzeImageRequest): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const model = resolveModelName(request.model);

    let cleanData = request.image.data;
    let mimeType = request.image.mimeType || 'image/png';

    if (cleanData.startsWith('data:')) {
      const match = cleanData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        cleanData = match[2];
      }
    }

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
  }

  public async analyzeFile(request: AnalyzeFileRequest): Promise<NormalizedChatResponse> {
    const ai = this.getClient();
    const model = resolveModelName(request.model);

    const promptText = `Please analyze the attached document (${request.file.name}):\n\n${request.file.data}\n\nUser Request: ${request.prompt || 'Summarize and extract key insights.'}`;

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
  }

  private buildContents(request: NormalizedChatRequest) {
    const contents: any[] = [];

    for (const msg of request.messages) {
      if (msg.role === 'system') continue;

      const role = msg.role === 'user' ? 'user' : 'model';
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

      contents.push({ role, parts });
    }

    // Ensure we have at least one user turn
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Hello' }],
      });
    }

    return contents;
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
