export class AppError extends Error {
  public statusCode: number;
  public userMessage: string;

  constructor(userMessage: string, statusCode: number = 400, originalError?: unknown) {
    super(typeof originalError === 'string' ? originalError : userMessage);
    this.userMessage = userMessage;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function sanitizeError(err: unknown): { userMessage: string; statusCode: number } {
  if (err instanceof AppError) {
    return {
      userMessage: err.userMessage,
      statusCode: err.statusCode,
    };
  }

  const rawMessage = err instanceof Error ? err.message : String(err);

  if (
    rawMessage.includes('API_KEY') ||
    rawMessage.includes('API key') ||
    rawMessage.includes('unauthorized') ||
    rawMessage.includes('401') ||
    rawMessage.includes('UNAUTHENTICATED') ||
    rawMessage.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') ||
    rawMessage.includes('authentication credential') ||
    rawMessage.includes('API_KEY_INVALID')
  ) {
    return {
      userMessage: 'The AI service requires a valid Gemini API Key. Please verify your GEMINI_API_KEY in the Settings > Secrets menu.',
      statusCode: 401,
    };
  }

  if (
    rawMessage.includes('quota') ||
    rawMessage.includes('rate limit') ||
    rawMessage.includes('429') ||
    rawMessage.includes('RESOURCE_EXHAUSTED')
  ) {
    return {
      userMessage: 'Dilshad AI is currently busy handling high demand. Please try again in a few moments.',
      statusCode: 429,
    };
  }

  if (
    rawMessage.includes('timeout') ||
    rawMessage.includes('ETIMEDOUT') ||
    rawMessage.includes('ECONNRESET')
  ) {
    return {
      userMessage: 'The request timed out while generating a response. Please try again.',
      statusCode: 504,
    };
  }

  return {
    userMessage: 'Dilshad AI is temporarily unavailable. Please try again.',
    statusCode: 500,
  };
}
