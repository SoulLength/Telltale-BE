import { Router } from 'express';
import { logger } from '../utils/logger.js';
import { TranslatorAgent } from '../services/TranslatorAgent.js';
import { SynthesizerPolly } from '../services/SynthesizerPolly.js';

const router = Router();
const translatorAgent = new TranslatorAgent(
  process.env.OPENAI_API_URL!,
  process.env.OPENAI_API_MODEL!
);
const synthesizerPolly = new SynthesizerPolly();

router.post('/translate', async (req, res) => {
  try {
    const { from, to, text } = req.body;
    logger.info(`Translation request from ${from} to ${to} for text: ${text}`);
    const translation = await translatorAgent.translate(from, to, text);
    res.json({ translation });
  } catch (error) {
    const msg = "Failed to translate: " + (error as Error).message;
    logger.error(msg);
    res.status(500).json({ error: msg });
  }
});

router.post('/synthesize', async (req, res) => {
  try {
    const { text, language } = req.body;
    logger.info(`Synthesize request for text: ${text} in language: ${language}`);
    const base64Speech = await synthesizerPolly.synthesize(text, language);
    res.json({ base64Speech });
  } catch (error) {
    const msg = "Failed to synthesize: " + (error as Error).message;
    logger.error(msg);
    res.status(500).json({ error: msg });
  }
});

export default router;