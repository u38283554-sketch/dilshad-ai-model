import { AIProvider } from '../providers/AIProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { GrokProvider } from '../providers/GrokProvider';
import { ClaudeProvider } from '../providers/ClaudeProvider';
import { AppError } from '../utils/errors';

export class AIProviderManager {
  private static instance: AIProviderManager;
  private providers: Map<string, AIProvider> = new Map();

  private constructor() {
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new GrokProvider());
    this.registerProvider(new ClaudeProvider());
  }

  public static getInstance(): AIProviderManager {
    if (!AIProviderManager.instance) {
      AIProviderManager.instance = new AIProviderManager();
    }
    return AIProviderManager.instance;
  }

  public registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  public getProvider(preferredName?: string): AIProvider {
    const target = preferredName || process.env.AI_PROVIDER || 'gemini';
    const provider = this.providers.get(target.toLowerCase());

    if (!provider) {
      // Fallback to Gemini if requested provider is unknown
      const fallback = this.providers.get('gemini');
      if (fallback) return fallback;
      throw new AppError(`AI Provider '${target}' is not registered and no fallback available.`, 500);
    }

    return provider;
  }

  public listAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
