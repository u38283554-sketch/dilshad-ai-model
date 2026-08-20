import { Request, Response, Router } from 'express';
import { AIProviderManager } from '../services/AIProviderManager';
import { sanitizeError } from '../utils/errors';

export const filesRouter = Router();
const providerManager = AIProviderManager.getInstance();

filesRouter.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, file } = req.body;
    if (!file || !file.data) {
      res.status(400).json({ ok: false, error: 'File data is required.' });
      return;
    }

    const provider = providerManager.getProvider();
    const result = await provider.analyzeFile({
      prompt: prompt || 'Analyze this document and summarize key insights.',
      file,
    });

    res.json({ ok: true, ...result });
  } catch (err) {
    const { userMessage, statusCode } = sanitizeError(err);
    res.status(statusCode).json({ ok: false, error: userMessage });
  }
});
