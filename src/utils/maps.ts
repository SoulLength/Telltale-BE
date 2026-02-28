import { LanguageCode, VoiceId } from '@aws-sdk/client-polly';

export const voiceMap: Partial<Record<LanguageCode, VoiceId>> = {
    "it-IT": VoiceId.Bianca,
    "tr-TR": VoiceId.Burcu,
    "en-US": VoiceId.Joanna,
    "ja-JP": VoiceId.Tomoko
};

export const languageMap: Partial<Record<LanguageCode, string>> = {
    "it-IT": "Italian",
    "tr-TR": "Turkish",
    "en-US": "English",
    "ja-JP": "Japanese"
};