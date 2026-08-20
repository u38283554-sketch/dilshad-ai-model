import {
  AIProvider,
  NormalizedChatRequest,
  NormalizedChatResponse,
  AnalyzeImageRequest,
  AnalyzeFileRequest,
} from './AIProvider';
import { AppError } from '../utils/errors';

export class GrokProvider implements AIProvider {
  public readonly name = 'grok';

  public async sendMessage(request: NormalizedChatRequest): Promise<NormalizedChatResponse> {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new AppError(
        'XAI_API_KEY is not configured on the server. Please provide the key in your environment variables.',
        401
      );
    }
    return {
      text: `[Grok Provider Ready] Received ${request.messages.length} messages.`,
      provider: 'grok',
      model: request.model || 'grok-2',
    };
  }

  public async analyzeImage(_request: AnalyzeImageRequest): Promise<NormalizedChatResponse> {
    throw new AppError('Grok image analysis adapter will be activated when XAI_API_KEY is set.', 501);
  }

  public async analyzeFile(_request: AnalyzeFileRequest): Promise<NormalizedChatResponse> {
    throw new AppError('Grok file analysis adapter will be activated when XAI_API_KEY is set.', 501);
  }
}
