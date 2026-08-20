export const AI_CONFIG = {
  defaultProvider: process.env.AI_PROVIDER || 'gemini',
  defaultModel: process.env.AI_MODEL || 'gemini-3.7-flash',
  maxMessageLength: 50000,
  maxHistoryMessages: 30,
  maxFileSizeMB: 20,
};

// Safe mapping of frontend UI model keys to valid backend model identifiers
export const MODEL_MAP: Record<string, string> = {
  'dilshad-core': 'gemini-3.7-flash',
  'dilshad-pro': 'gemini-3.7-flash',
  'dilshad-fast': 'gemini-3.7-flash',
  'dilshad-balanced': 'gemini-3.7-flash',
  'dilshad-creative': 'gemini-3.7-flash',
  'gemini-3.7-flash': 'gemini-3.7-flash',
  'gemini-3.1-pro-preview': 'gemini-3.1-pro-preview',
  'gemini-flash-latest': 'gemini-flash-latest',
};

export function resolveModelName(requestedModel?: string): string {
  if (!requestedModel) {
    return process.env.AI_MODEL || AI_CONFIG.defaultModel;
  }
  if (MODEL_MAP[requestedModel]) {
    return MODEL_MAP[requestedModel];
  }
  // If the model is already a valid Gemini model identifier, use it safely
  if (requestedModel.startsWith('gemini-')) {
    return requestedModel;
  }
  return process.env.AI_MODEL || AI_CONFIG.defaultModel;
}
