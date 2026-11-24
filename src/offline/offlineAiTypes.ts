import type { ClassLevel } from '../types';

export type OfflineAiPackTier = 'class8' | 'standard' | 'pro';

export interface OfflineAiPackCapabilities {
  allowMessage: boolean;
  allowVoice: boolean;
  allowPdf: boolean;
  allowLive: boolean;
  allowQuiz: boolean;
  allowCamera: boolean;
  allowDictionary: boolean;
  onlyClass: ClassLevel | null;
  answerStyle: 'structured' | 'fast' | 'class8-basic';
}

export interface OfflineAiPackDefinition {
  tier: OfflineAiPackTier;
  nameBn: string;
  nameEn: string;
  badgeBn: string;
  sizeLabel: string;
  approxBytes: number;
  llmModelId: string;
  llmLabel: string;
  whisperModelId: string;
  whisperLabel: string;
  includeOcr: boolean;
  descriptionBn: string;
  recommendedForBn: string;
  highlightsBn: string[];
  capabilities: OfflineAiPackCapabilities;
}

export const OFFLINE_AI_PACKS: Record<OfflineAiPackTier, OfflineAiPackDefinition> = {
  pro: {
    tier: 'pro',
    nameBn: 'প্রো ৫০০ MB ফুল অফলাইন AI প্যাক',
    nameEn: 'Pro 500 MB Structured Pack',
    badgeBn: 'গুছিয়ে বিস্তারিত উত্তর',
    sizeLabel: '~500 MB',
    approxBytes: 500 * 1024 * 1024,
    llmModelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
    llmLabel: 'Qwen2.5 0.5B (Structured)',
    whisperModelId: 'onnx-community/whisper-tiny',
    whisperLabel: 'Whisper Voice (বাংলা + EN)',
    includeOcr: true,
    descriptionBn:
      'সব ক্লাস (Class 5–10) ও সব ফিচার — উত্তরগুলো পয়েন্ট করে, শিরোনাম ও উদাহরণ দিয়ে খুব ভালোভাবে গুছিয়ে দেবে।',
    recommendedForBn: 'সেরা গুছানো উত্তর · সব ফিচার',
    highlightsBn: [
      'সব ফিচার: মেসেজ, ভয়েস, PDF, AI Live, কুইজ, ক্যামেরা ও ডিকশনারি',
      'উত্তরগুলো পয়েন্ট, হেডিং ও উদাহরণ দিয়ে সুন্দরভাবে গুছিয়ে দেয়',
      'WBBSE Class 5 থেকে Class 10 সব ক্লাসের জন্য',
    ],
    capabilities: {
      allowMessage: true,
      allowVoice: true,
      allowPdf: true,
      allowLive: true,
      allowQuiz: true,
      allowCamera: true,
      allowDictionary: true,
      onlyClass: null,
      answerStyle: 'structured',
    },
  },
  standard: {
    tier: 'standard',
    nameBn: 'ফাস্ট ২৫০ MB অল-ইন-ওয়ান প্যাক',
    nameEn: 'Fast 250 MB All-in-One Pack',
    badgeBn: 'সুপার ফাস্ট উত্তর',
    sizeLabel: '~250 MB',
    approxBytes: 250 * 1024 * 1024,
    llmModelId: 'onnx-community/SmolLM2-360M-Instruct-ONNX',
    llmLabel: 'SmolLM2 360M (Ultra Fast)',
    whisperModelId: 'onnx-community/whisper-tiny',
    whisperLabel: 'Whisper Lite (বাংলা + EN)',
    includeOcr: true,
    descriptionBn:
      'কম ডেটায় সব ফিচার চলবে (মেসেজ, ভয়েস, PDF, AI Live, কুইজ, ক্যামেরা, ডিকশনারি) এবং উত্তর অনেক ফাস্ট দেবে।',
    recommendedForBn: 'সব ফিচার · অনেক ফাস্ট উত্তর',
    highlightsBn: [
      'সব ফিচার চালু: মেসেজ, ভয়েস, PDF, AI Live, কুইজ, ক্যামেরা ও ডিকশনারি',
      'হালকা ইঞ্জিন হওয়ায় উত্তর অনেক ফাস্ট ও কম সময়ে দেয়',
      'WBBSE Class 5–10 সব ক্লাস ও কম RAM ফোনের জন্য দারুণ',
    ],
    capabilities: {
      allowMessage: true,
      allowVoice: true,
      allowPdf: true,
      allowLive: true,
      allowQuiz: true,
      allowCamera: true,
      allowDictionary: true,
      onlyClass: null,
      answerStyle: 'fast',
    },
  },
  class8: {
    tier: 'class8',
    nameBn: 'অনলি ক্লাস ৮ লাইট প্যাক (১০০ MB)',
    nameEn: 'Only Class 8 Pack (100 MB)',
    badgeBn: 'শুধু Class 8 · ১০০ MB',
    sizeLabel: '~100 MB',
    approxBytes: 100 * 1024 * 1024,
    llmModelId: 'onnx-community/SmolLM2-135M-Instruct-ONNX',
    llmLabel: 'SmolLM2 135M (Class 8)',
    whisperModelId: 'onnx-community/whisper-tiny',
    whisperLabel: 'Voice Lite (বাংলা + EN)',
    includeOcr: false,
    descriptionBn:
      'শুধুমাত্র Class 8-এর ছাত্রছাত্রীদের জন্য সবচেয়ে ছোট প্যাক। এতে শুধু মেসেজ, ভয়েস এবং PDF কাজ করবে — অন্য কোনো ফিচার (Live, Quiz, Camera, Dictionary) থাকবে না।',
    recommendedForBn: 'শুধু Class 8 · মেসেজ, ভয়েস ও PDF',
    highlightsBn: [
      'শুধুমাত্র Class 8 (WBBSE) পড়াশোনা',
      'শুধু মেসেজ চ্যাট, ভয়েস এবং PDF ডাউনলোড চলবে',
      'AI Live, কুইজ, ক্যামেরা বা ডিকশনারি এই প্যাকে বন্ধ থাকবে',
    ],
    capabilities: {
      allowMessage: true,
      allowVoice: true,
      allowPdf: true,
      allowLive: false,
      allowQuiz: false,
      allowCamera: false,
      allowDictionary: false,
      onlyClass: 'Class 8',
      answerStyle: 'class8-basic',
    },
  },
};

export const OFFLINE_AI_PACK_ORDER: OfflineAiPackTier[] = ['pro', 'standard', 'class8'];

export type OfflineAiStatus =
  | 'not-downloaded'
  | 'downloading'
  | 'loading'
  | 'ready'
  | 'error';

export interface OfflineAiDownloadProgress {
  stage: 'llm' | 'whisper' | 'ocr' | 'idle';
  stageLabelBn: string;
  file: string;
  percent: number;
  loadedBytes: number;
  totalBytes: number;
}

export interface OfflineAiState {
  status: OfflineAiStatus;
  installedTier: OfflineAiPackTier | null;
  activeTier: OfflineAiPackTier | null;
  llmLoaded: boolean;
  whisperLoaded: boolean;
  ocrCached: boolean;
  deviceBackend: 'webgpu' | 'wasm' | null;
  cachedBytes: number;
  storageQuotaBytes: number;
  storageUsageBytes: number;
  progress: OfflineAiDownloadProgress;
  error: string | null;
  lastUpdatedAt: number | null;
}

export interface OfflineChatTurn {
  role: 'user' | 'model';
  text: string;
}
