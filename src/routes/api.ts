import { Router } from 'express';
import multer from 'multer';
import { logger } from '../utils/logger.js';
import { TranslatorAgent } from '../services/TranslatorAgent.js';
import { SynthesizerPolly } from '../services/SynthesizerPolly.js';
import { TranscriberGroq } from '../services/TranscriberGroq.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const translatorAgent = new TranslatorAgent(
  process.env.OPENAI_API_URL!,
  process.env.OPENAI_API_MODEL!
);
const synthesizerPolly = new SynthesizerPolly();
const transcriberGroq = new TranscriberGroq(process.env.GROQ_API_KEY!);

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

router.post('/transcribe', upload.single('file'), async (req, res) => {
    try {
        const { lang } = req.body;
        const buffer = req.file?.buffer;
        if (!buffer) { res.status(400).json({ error: 'No audio file provided' }); return; }
        logger.info(`Transcribe request for language: ${lang}`);
        const transcript = await transcriberGroq.transcribe(buffer, lang);
        res.json({ transcript });
    } catch (error) {
        const msg = "Failed to transcribe: " + (error as Error).message;
        logger.error(msg);
        res.status(500).json({ error: msg });
    }
});

export default router;