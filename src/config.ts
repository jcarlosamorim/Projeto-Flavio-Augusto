export const GEMINI_MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";
export const GEMINI_VOICE = "Zephyr";
export const AUDIO_CAPTURE_SAMPLE_RATE = 16000;
export const AUDIO_PLAYBACK_SAMPLE_RATE = 24000;
export const AUDIO_BUFFER_SIZE = 4096;
export const AUDIO_QUEUE_MAX_SIZE = 100;

export const DEFAULT_METRICS = {
  currentStep: 0,
  rapport: 0,
  needsDiscovery: 0,
  valueProposition: 0,
  objectionHandling: 0,
  closingProbability: 0,
  feedback: "",
} as const;
