import { PollyClient, SynthesizeSpeechCommand, LanguageCode } from '@aws-sdk/client-polly';
import { voiceMap } from '../utils/maps.js';

export class SynthesizerPolly {
    private readonly client: PollyClient;
    
    constructor() {
        this.client = new PollyClient();
    }

    public async synthesize(text: string, languageCode: LanguageCode): Promise<string | undefined> {
        const command = new SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: "mp3",
            Engine: "neural",
            LanguageCode: languageCode,
            VoiceId: voiceMap[languageCode]
        });
        const response = await this.client.send(command);

        if (response.AudioStream) {
            return await response.AudioStream.transformToString('base64');
        }
    }
}