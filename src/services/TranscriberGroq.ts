import Groq from 'groq-sdk';
import { toFile } from 'groq-sdk';
import { logger } from '../utils/logger.js';

export class TranscriberGroq {
    private client: Groq;

    constructor(apiKey: string) {
        this.client = new Groq({ apiKey });
    }

    async transcribe(audioBuffer: Buffer, lang: string): Promise<string> {
        const file = await toFile(audioBuffer, 'recording.webm', { type: 'audio/webm' });
        const response = await this.client.audio.transcriptions.create({
            file,
            model: 'whisper-large-v3',
            temperature: 0,
            language: lang.split('-')[0],
            response_format: "verbose_json"
        });
        logger.info(`Groq transcription response: ${JSON.stringify(response)}`);
        const noSpeechProb = (response as any).segments?.[0]?.no_speech_prob ?? 1;
        if (noSpeechProb > 0.2) return "";
        return response.text.trim();
    }
}