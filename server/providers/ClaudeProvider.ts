import {
  AIProvider,
  NormalizedChatRequest,
  NormalizedChatResponse,
  AnalyzeImageRequest,
  AnalyzeFileRequest,
} from './AIProvider';
import { AppError } from '../utils/errors';

export class ClaudeProvider implements AIProvider {
  public readonly name = 'claude';

  public async sendMessage(request: NormalizedChatRequest): Promise<NormalizedChatResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new AppError(
        'ANTHROPIC_API_KEY is not configured on the server. Please provide the key in your environment variables.',
        401
      );
    }
    return {
      text: `[Claude Provider Ready] Received ${request.messages.length} messages.`,
      provider: 'claude',
      model: request.model || 'claude-3-5-sonnet-20241022',
    };
  }

  public async analyzeImage(_request: AnalyzeImageRequest): Promise<NormalizedChatResponse> {
    throw new AppError('Claude image analysis adapter will be activated when ANTHROPIC_API_KEY is set.', 501);
  }

  public async analyzeFile(_request: AnalyzeFileRequest): Promise<NormalizedChatResponse> {
    throw new AppError('Claude file analysis adapter will be activated when ANTHROPIC_API_KEY is set.', 501);
  }
}
