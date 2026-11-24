export type AppMode = 'teacher' | 'dictionary';

export type ClassLevel =
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10';

export type VoicePersona = 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir';

export interface ImageAttachment {
  dataUrl: string;
  base64: string;
  mimeType: string;
  name: string;
  sizeBytes: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  topic: string;
  className: string;
  language: 'bn' | 'en';
  questions: QuizQuestion[];
  source?: 'online' | 'offline';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  highlights?: string[];
  historyId?: string;
  image?: {
    dataUrl: string;
    base64: string;
    mimeType: string;
    name: string;
  };
  pdf?: {
    title: string;
    filename: string;
  };
  quiz?: QuizData;
  createdAt: number;
}

export interface DictionaryEntry {
  word: string;
  pronunciation: string;
  meaning: string;
  sandhiVicched: string;
  grammar: string;
  exampleSentences: string[];
}

export interface TeacherHistoryItem {
  id: string;
  type: 'teacher';
  className: ClassLevel;
  question: string;
  hasImage: boolean;
  answer: string;
  highlights?: string[];
  messages?: Array<{
    id?: string;
    role: 'user' | 'model';
    text: string;
    highlights?: string[];
    quiz?: QuizData;
    createdAt: number;
  }>;
  createdAt: number;
}

export interface DictionaryHistoryItem {
  id: string;
  type: 'dictionary';
  word: string;
  entry: DictionaryEntry;
  createdAt: number;
}

export type LiveRole = 'english' | 'bengali' | 'bilingual';

export type AppAccentColor = 'blue' | 'emerald' | 'indigo' | 'violet' | 'rose' | 'amber';

export type AppPageBackground = 'default' | 'yellow' | 'blue' | 'emerald' | 'rose' | 'violet';

export type AppFontScale = 'normal' | 'large';

export interface AppProgramConfig {
  configVersion: number;
  updateTitle: string;
  updateNotes: string;
  appName: string;
  attributionText: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  dictionaryTitle: string;
  dictionarySubtitle: string;
  accentColor: AppAccentColor;
  pageBackground: AppPageBackground;
  fontScale: AppFontScale;
  announcementBanner: string;
  apkDownloadUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  enableTeacher: boolean;
  enableLiveMode: boolean;
  enableDictionary: boolean;
  enableVoiceInput: boolean;
  enableVoiceOutput: boolean;
  enablePdfExport: boolean;
  enableCamera: boolean;
  defaultClass: ClassLevel;
  defaultVoice: VoicePersona;
  defaultLiveRole: LiveRole;
  temperature: number;
  conciseAnswers: boolean;
  customTeacherPrompt: string;
  customLivePrompt: string;
  samplePrompts: string[];
  sampleWords: string[];
  updatedAt: number;
}

export interface AdminServerStats {
  uptimeSeconds: number;
  dictionaryCacheSize: number;
  activeLiveConnections: number;
  totalAiRequests: number;
}

export const DEFAULT_APP_CONFIG: AppProgramConfig = {
  configVersion: 1,
  updateTitle: 'New App Update Available',
  updateNotes: '',
  appName: 'Wbsec',
  attributionText: 'Made by Amir',
  welcomeTitle: '',
  welcomeSubtitle:
    'Start Live Mode to talk directly with your English or Bengali teacher in real time, tap the mic to dictate, or attach a textbook photo.',
  dictionaryTitle: 'Bengali Dictionary',
  dictionarySubtitle:
    'Look up pronunciation, Bengali meaning, Sandhi Vicched, grammar identity, and example sentences.',
  accentColor: 'blue',
  pageBackground: 'default',
  fontScale: 'normal',
  announcementBanner: '',
  apkDownloadUrl: '',
  maintenanceMode: false,
  maintenanceMessage: 'App maintenance is in progress. Please check back shortly.',
  enableTeacher: true,
  enableLiveMode: true,
  enableDictionary: true,
  enableVoiceInput: true,
  enableVoiceOutput: true,
  enablePdfExport: true,
  enableCamera: true,
  defaultClass: 'Class 8',
  defaultVoice: 'Kore',
  defaultLiveRole: 'bengali',
  temperature: 0.2,
  conciseAnswers: true,
  customTeacherPrompt: '',
  customLivePrompt: '',
  samplePrompts: [
    'সালোকসংশ্লেষ প্রক্রিয়াটি সহজভাবে বুঝিয়ে দাও।',
    'নিউটনের গতির তৃতীয় সূত্র উদাহরণসহ ব্যাখ্যা করো।',
    'সালোকসংশ্লেষের ওপর একটি PDF তৈরি করো।',
  ],
  sampleWords: [
    'বিদ্যালয়',
    'সূর্যোদয়',
    'অন্বেষণ',
    'জিজ্ঞাসা',
    'দিগন্ত',
    'Resilience',
  ],
  updatedAt: 0,
};

export type StudyHistoryItem = TeacherHistoryItem | DictionaryHistoryItem;

export type StudentAvatarPreset =
  | 'initial'
  | 'boy-scholar'
  | 'girl-scholar'
  | 'astronaut'
  | 'owl'
  | 'rocket'
  | 'atom'
  | 'book'
  | 'palette'
  | 'star';

export type StudentAvatarColor =
  | 'cyan'
  | 'violet'
  | 'rose'
  | 'emerald'
  | 'amber'
  | 'indigo';

export interface StudentProfile {
  name: string;
  className?: ClassLevel;
  school?: string;
  favoriteSubject?: string;
  avatarType: 'preset' | 'custom';
  avatarPreset: StudentAvatarPreset;
  avatarColor: StudentAvatarColor;
  customAvatarDataUrl?: string;
  onboardingCompleted: boolean;
  updatedAt: number;
}

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: '',
  school: '',
  favoriteSubject: '',
  avatarType: 'preset',
  avatarPreset: 'boy-scholar',
  avatarColor: 'cyan',
  onboardingCompleted: false,
  updatedAt: 0,
};

