import {
  AIProvider,
  NormalizedChatRequest,
  NormalizedChatResponse,
  AnalyzeImageRequest,
  AnalyzeFileRequest,
} from './AIProvider';
import { AppError } from '../utils/errors';

export class OpenAIProvider implements AIProvider {
  public readonly name = 'openai';

  public async sendMessage(request: NormalizedChatRequest): Promise<NormalizedChatResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new AppError(
        'OPENAI_API_KEY is not configured on the server. Please provide the key in your environment variables.',
        401
      );
    }
    // Future OpenAI chat completion adapter
    return {
      text: `[OpenAI Provider Ready] Received ${request.messages.length} messages.`,
      provider: 'openai',
      model: request.model || 'gpt-4o',
    };
  }

  public async analyzeImage(_request: AnalyzeImageRequest): Promise<NormalizedChatResponse> {
    throw new AppError('OpenAI image analysis adapter will be activated when OPENAI_API_KEY is set.', 501);
  }

  public async analyzeFile(_request: AnalyzeFileRequest): Promise<NormalizedChatResponse> {
    throw new AppError('OpenAI file analysis adapter will be activated when OPENAI_API_KEY is set.', 501);
  }
}
