import { AIProviderManager } from './AIProviderManager';
import { NormalizedChatRequest, NormalizedChatResponse } from '../providers/AIProvider';

export class ChatService {
  private providerManager = AIProviderManager.getInstance();

  public async processChat(request: NormalizedChatRequest): Promise<NormalizedChatResponse> {
    const provider = this.providerManager.getProvider();
    return await provider.sendMessage(request);
  }

  public async streamChat(
    request: NormalizedChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<NormalizedChatResponse> {
    const provider = this.providerManager.getProvider();
    if (provider.streamMessage) {
      return await provider.streamMessage(request, onChunk);
    }
    const response = await provider.sendMessage(request);
    onChunk(response.text);
    return response;
  }
}
