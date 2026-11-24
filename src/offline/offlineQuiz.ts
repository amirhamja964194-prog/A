import type { ClassLevel, QuizData, QuizQuestion } from '../types';

export interface QuizIntentResult {
  isQuiz: boolean;
  count: number;
  topic: string;
}

const BENGALI_DIGITS: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

function normalizeDigits(text: string): string {
  return text.replace(/[০-৯]/g, (d) => BENGALI_DIGITS[d] ?? d);
}

const QUIZ_INTENT_REGEX =
  /(?:\b(?:quiz|quize|quizzes|kuij|kwiz|mcq|mcqs|mock\s*test|multiple\s*choice|objective\s*questions?)\b|কুইজ|কুইয|এমসিকিউ|বহুনির্বাচনী|মক\s*টেস্ট|অবজেক্টিভ\s*প্রশ্ন|৪\s*অপশন|চারটি\s*অপশন|চারটা\s*অপশন)/i;

export function detectQuizRequest(rawText: string): QuizIntentResult {
  const text = (rawText ?? '').trim();
  if (!text || !QUIZ_INTENT_REGEX.test(text)) {
    return { isQuiz: false, count: 5, topic: '' };
  }

  const normalized = normalizeDigits(text);
  let count = 5;

  const countPatterns = [
    /(\d{1,2})\s*(?:টি|টা|খানা|questions?|qs?|quiz|mcq|প্রশ্ন|কুইজ|prosh?no|prosno)/i,
    /(?:questions?|quiz|কুইজ|প্রশ্ন)\s*(?:of|:|-)?\s*(\d{1,2})\b/i,
  ];

  for (const pattern of countPatterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      const parsed = Number.parseInt(match[1], 10);
      if (Number.isFinite(parsed) && parsed >= 2 && parsed <= 15) {
        count = Math.max(3, Math.min(15, parsed));
        break;
      }
    }
  }

  // Extract clean topic label for UI display and offline matching
  const cleanedTopic = text
    .replace(
      /\b(?:make|create|generate|give|take|start|build|prepare|ask|me|a|an|the|some|new|fresh|quiz|quize|quizzes|kuij|kwiz|mcq|mcqs|mock\s*test|multiple\s*choice|questions?|question|prosno|proshno|banao|banaw|baniye|banie|dao|daw|toiri|koro|kor|niye|nie|opor|upor|er|on|about|for|of|with|4\s*options?)\b/gi,
      ' ',
    )
    .replace(
      /(?:কুইজ|কুইয|এমসিকিউ|বহুনির্বাচনী|মক\s*টেস্ট|প্রশ্ন|প্রশ্নোত্তর|তৈরি\s*করো|তৈরি\s*করে\s*দাও|তৈরি\s*করুন|বানাও|বানিয়ে\s*দাও|বানিয়ে\s*দাও|বানিয়ে|বানিয়ে|দাও|করো|করুন|নিয়ে|নিয়ে|উপর|ওপর|এর|নতুন|একটি|একটা|চারটি\s*অপশন|অপশনসহ)/g,
      ' ',
    )
    .replace(/[০-৯0-9]+\s*(?:টি|টা|খানা)?/g, ' ')
    .replace(/[.,?!।:;'"()[\]{}/\\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    isQuiz: true,
    count,
    topic: cleanedTopic,
  };
}

export function formatQuizAsMarkdown(quiz: QuizData): string {
  const labels = quiz.language === 'en' ? ['A', 'B', 'C', 'D'] : ['ক', 'খ', 'গ', 'ঘ'];
  const lines: string[] = [
    `# ${quiz.title}`,
    `বিষয়: **${quiz.topic}** · ${quiz.className} · মোট প্রশ্ন: ${quiz.questions.length}টি`,
    '',
  ];

  quiz.questions.forEach((q, idx) => {
    lines.push(`### ${idx + 1}. ${q.question}`);
    q.options.forEach((opt, optIdx) => {
      lines.push(`- **(${labels[optIdx]})** ${opt}`);
    });
    lines.push('');
  });

  lines.push('---');
  lines.push(quiz.language === 'en' ? '## Answer Key & Explanations' : '## উত্তরমালা ও ব্যাখ্যা');
  lines.push('');

  quiz.questions.forEach((q, idx) => {
    const correctLetter = labels[q.correctIndex] ?? labels[0];
    const correctText = q.options[q.correctIndex] ?? '';
    lines.push(
      `${idx + 1}. **(${correctLetter}) ${correctText}** — ${q.explanation}`,
    );
  });

  return lines.join('\n');
}

interface OfflineQuizPack {
  id: string;
  title: string;
  topic: string;
  language: 'bn' | 'en';
  keywords: string[];
  questions: Omit<QuizQuestion, 'id'>[];
}

const OFFLINE_QUIZ_BANKS: OfflineQuizPack[] = [
  {
    id: 'photosynthesis',
    title: 'সালোকসংশ্লেষ (Photosynthesis) কুইজ',
    topic: 'সালোকসংশ্লেষ',
    language: 'bn',
    keywords: ['সালোকসংশ্লেষ', 'photosynthesis', 'উদ্ভিদ', 'ক্লোরোফিল', 'পাতা', 'saloksongshlesh', 'botany'],
    questions: [
      {
        question: 'সালোকসংশ্লেষ প্রক্রিয়ার প্রধান স্থান কোনটি?',
        options: ['উদ্ভিদের মূল', 'সবুজ পাতার মেসোফিল কলা', 'উদ্ভিদের কাণ্ডের বাকল', 'ফুলের পাপড়ি'],
        correctIndex: 1,
        explanation: 'সবুজ পাতার মেসোফিল কলার ক্লোরোপ্লাস্টেই ক্লোরোফিল থাকে, যেখানে সালোকসংশ্লেষ ঘটে।',
      },
      {
        question: 'সালোকসংশ্লেষে উপজাত হিসেবে কোন গ্যাস নির্গত হয়?',
        options: ['কার্বন ডাই-অক্সাইড', 'নাইট্রোজেন', 'অক্সিজেন', 'মিথেন'],
        correctIndex: 2,
        explanation: 'জলের আলোক-বিশ্লেষণের (Photolysis) ফলে সালোকসংশ্লেষে অক্সিজেন (O₂) গ্যাস নির্গত হয়।',
      },
      {
        question: 'সালোকসংশ্লেষের আলোক দশা (Light Phase) ক্লোরোপ্লাস্টের কোথায় ঘটে?',
        options: ['স্ট্রোমাতে', 'গ্রানাতে', 'মাইটোকন্ড্রিয়াতে', 'নিউক্লিয়াসে'],
        correctIndex: 1,
        explanation: 'ক্লোরোপ্লাস্টের গ্রানা অঞ্চলের থাইলাকয়েড পর্দায় আলোক-নির্ভর দশা সম্পন্ন হয়।',
      },
      {
        question: 'সালোকসংশ্লেষের জন্য প্রয়োজনীয় প্রধান কাঁচামাল কোন দুটি?',
        options: ['অক্সিজেন ও গ্লুকোজ', 'কার্বন ডাই-অক্সাইড ও জল', 'নাইট্রোজেন ও খনিজ লবণ', 'হাইড্রোজেন ও শ্বেতসার'],
        correctIndex: 1,
        explanation: 'উদ্ভিদ বায়ু থেকে CO₂ এবং মাটি থেকে H₂O শোষণ করে সূর্যালোকের উপস্থিতিতে গ্লুকোজ তৈরি করে।',
      },
      {
        question: 'কোন রঞ্জক পদার্থ সূর্যালোক শোষণে প্রধান ভূমিকা পালন করে?',
        options: ['হিমোগ্লোবিন', 'মেলানিন', 'ক্লোরোফিল', 'বিলিরুবিন'],
        correctIndex: 2,
        explanation: 'সবুজ রঞ্জক ক্লোরোফিল সূর্যের ফোটন কণা শোষণ করে রাসায়নিক শক্তিতে রূপান্তর করে।',
      },
      {
        question: 'সালোকসংশ্লেষের অন্ধকার দশা (Calvin Cycle) কোথায় ঘটে?',
        options: ['ক্লোরোপ্লাস্টের স্ট্রোমাতে', 'ক্লোরোপ্লাস্টের গ্রানাতে', 'রাইবোজোমে', 'গলগি বডিতে'],
        correctIndex: 0,
        explanation: 'অন্ধকার দশায় CO₂ বিজারিত হয়ে গ্লুকোজ তৈরি হয় এবং এটি স্ট্রোমাতে সম্পন্ন হয়।',
      },
    ],
  },
  {
    id: 'physics',
    title: 'ভৌতবিজ্ঞান ও নিউটনের গতিসূত্র কুইজ',
    topic: 'ভৌতবিজ্ঞান ও গতিসূত্র',
    language: 'bn',
    keywords: ['নিউটন', 'গতি', 'বল', 'ভৌতবিজ্ঞান', 'বিজ্ঞান', 'আলো', 'তাপ', 'বিদ্যুৎ', 'physics', 'newton', 'science', 'force', 'light', 'bigyan'],
    questions: [
      {
        question: 'নিউটনের কোন গতিসূত্র থেকে বলের পরিমাপ (F = ma) পাওয়া যায়?',
        options: ['প্রথম গতিসূত্র', 'দ্বিতীয় গতিসূত্র', 'তৃতীয় গতিসূত্র', 'মহাকর্ষ সূত্র'],
        correctIndex: 1,
        explanation: 'নিউটনের দ্বিতীয় গতিসূত্র অনুযায়ী ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক, যা থেকে F = ma আসে।',
      },
      {
        question: 'SI পদ্ধতিতে বলের একক কী?',
        options: ['জুল (Joule)', 'ওয়াট (Watt)', 'নিউটন (Newton)', 'পাস্কাল (Pascal)'],
        correctIndex: 2,
        explanation: 'SI পদ্ধতিতে বলের পরম একক নিউটন (N) এবং CGS পদ্ধতিতে ডাইন (dyne)।',
      },
      {
        question: 'রকেট উড্ডয়ন নিউটনের কোন সূত্রের ওপর ভিত্তি করে কাজ করে?',
        options: ['প্রথম সূত্র', 'দ্বিতীয় সূত্র', 'তৃতীয় সূত্র', 'আর্কিমিডিসের সূত্র'],
        correctIndex: 2,
        explanation: 'প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে—এই তৃতীয় সূত্র মেনেই রকেট ওপরে ওঠে।',
      },
      {
        question: 'শূন্য মাধ্যমে আলোর বেগ কত?',
        options: ['৩ × ১০⁵ কিমি/সেকেন্ড', '৩ × ১০⁸ কিমি/সেকেন্ড', '৩০০ মিটার/সেকেন্ড', '১৫ × ১০⁴ কিমি/সেকেন্ড'],
        correctIndex: 0,
        explanation: 'শূন্য মাধ্যমে আলোর বেগ প্রায় ৩ × ১০⁸ মিটার/সেকেন্ড বা ৩ × ১০⁵ কিলোমিটার/সেকেন্ড।',
      },
      {
        question: 'বস্তুর জাড্য ধর্ম (Inertia) নিউটনের কোন সূত্র থেকে জানা যায়?',
        options: ['তৃতীয় সূত্র', 'দ্বিতীয় সূত্র', 'প্রথম সূত্র', 'ওহমের সূত্র'],
        correctIndex: 2,
        explanation: 'প্রথম গতিসূত্রকে জাড্যের সূত্রও বলা হয়, কারণ বাইরে থেকে বল প্রয়োগ না করলে বস্তু তার স্থিতি বা গতি বজায় রাখে।',
      },
      {
        question: 'রোধের (Resistance) SI একক কী?',
        options: ['অ্যাম্পিয়ার', 'ভোল্ট', 'ওহম (Ω)', 'কুলম্ব'],
        correctIndex: 2,
        explanation: 'তড়িৎ প্রবাহে বাধার পরিমাপ হলো রোধ, যার SI একক ওহম (Ohm, Ω)।',
      },
    ],
  },
  {
    id: 'chemistry',
    title: 'রসায়ন (Chemistry) কুইজ',
    topic: 'রসায়ন',
    language: 'bn',
    keywords: ['রসায়ন', 'রসায়ন', 'পরমাণু', 'অ্যাসিড', 'ক্ষার', 'অণু', 'chemistry', 'atom', 'acid', 'base', 'element'],
    questions: [
      {
        question: 'পরমাণুর নিউক্লিয়াসে কোন দুটি কণা থাকে?',
        options: ['ইলেকট্রন ও প্রোটন', 'প্রোটন ও নিউট্রন', 'ইলেকট্রন ও নিউট্রন', 'শুধু ইলেকট্রন'],
        correctIndex: 1,
        explanation: 'পরমাণুর কেন্দ্রে নিউক্লিয়াসে ধনাত্মক প্রোটন এবং নিস্তড়িৎ নিউট্রন থাকে।',
      },
      {
        question: 'বিশুদ্ধ জলের pH মান কত?',
        options: ['০', '৫', '৭', '১৪'],
        correctIndex: 2,
        explanation: 'বিশুদ্ধ জল প্রশম (Neutral), তাই ২৫°C উষ্ণতায় এর pH মান ৭।',
      },
      {
        question: 'অ্যাসিড নীল লিটমাস কাগজের রং পরিবর্তন করে কী করে?',
        options: ['সবুজ', 'হলুদ', 'লাল', 'সাদা'],
        correctIndex: 2,
        explanation: 'অ্যাসিড নীল লিটমাসকে লাল করে এবং ক্ষার লাল লিটমাসকে নীল করে।',
      },
      {
        question: 'খাবার নুনের রাসায়নিক সংকেত কোনটি?',
        options: ['H₂O', 'NaCl', 'CO₂', 'HCl'],
        correctIndex: 1,
        explanation: 'সাধারণ খাবার নুনের রাসায়নিক নাম সোডিয়াম ক্লোরাইড (NaCl)।',
      },
      {
        question: 'ইলেকট্রন আবিষ্কার করেন কোন বিজ্ঞানী?',
        options: ['জে. জে. থমসন', 'রাদারফোর্ড', 'চ্যাডউইক', 'ডাল্টন'],
        correctIndex: 0,
        explanation: '১৮৯৭ সালে বিজ্ঞানী জে. জে. থমসন ক্যাথোড রশ্মি পরীক্ষার মাধ্যমে ইলেকট্রন আবিষ্কার করেন।',
      },
    ],
  },
  {
    id: 'biology',
    title: 'জীবনবিজ্ঞান (Life Science) কুইজ',
    topic: 'জীবনবিজ্ঞান',
    language: 'bn',
    keywords: ['জীবনবিজ্ঞান', 'জীববিজ্ঞান', 'কোষ', 'হৃদপিণ্ড', 'রক্ত', 'মানবদেহ', 'পরিবেশ', 'biology', 'cell', 'human', 'blood', 'life science'],
    questions: [
      {
        question: 'কোষের ‘শক্তিঘর’ (Powerhouse of the cell) কাকে বলা হয়?',
        options: ['রাইবোজোম', 'মাইটোকন্ড্রিয়া', 'লাইসোজোম', 'গলগি বডি'],
        correctIndex: 1,
        explanation: 'মাইটোকন্ড্রিয়ায় কোষীয় শ্বসনের মাধ্যমে ATP শক্তি উৎপন্ন হয়, তাই একে কোষের শক্তিঘর বলে।',
      },
      {
        question: 'মানবদেহে অক্সিজেন পরিবহন করে রক্তের কোন উপাদান?',
        options: ['শ্বেত রক্তকণিকা', 'অণুচক্রিকা', 'লোহিত রক্তকণিকার হিমোগ্লোবিন', 'প্লাজমা প্রোটিন'],
        correctIndex: 2,
        explanation: 'লোহিত রক্তকণিকায় থাকা হিমোগ্লোবিন অক্সিহিমোগ্লোবিন রূপে সারা দেহে অক্সিজেন পরিবহন করে।',
      },
      {
        question: 'কোন ভিটামিনের অভাবে রাতকানা রোগ হয়?',
        options: ['ভিটামিন A', 'ভিটামিন B', 'ভিটামিন C', 'ভিটামিন D'],
        correctIndex: 0,
        explanation: 'ভিটামিন A (রেটিনল)-এর অভাবে চোখের রড কোষ ঠিকমতো কাজ করে না, ফলে রাতকানা রোগ হয়।',
      },
      {
        question: 'মানুষের হৃৎপিণ্ডে কয়টি প্রকোষ্ঠ (Chamber) থাকে?',
        options: ['২টি', '৩টি', '৪টি', '৫টি'],
        correctIndex: 2,
        explanation: 'মানুষের হৃৎপিণ্ড ৪টি প্রকোষ্ঠে বিভক্ত—ডান অলিন্দ, বাম অলিন্দ, ডান নিলয় এবং বাম নিলয়।',
      },
      {
        question: 'কোষ আবিষ্কার করেন কোন বিজ্ঞানী?',
        options: ['রবার্ট হুক', 'চার্লস ডারউইন', 'লুই পাস্তুর', 'গ্রেগর মেন্ডেল'],
        correctIndex: 0,
        explanation: '১৬৬৫ সালে রবার্ট হুক কর্কের পাতলা ছিদ্র পরীক্ষা করে প্রথম কোষ (Cell) আবিষ্কার করেন।',
      },
    ],
  },
  {
    id: 'history',
    title: 'ইতিহাস (History) কুইজ',
    topic: 'ইতিহাস',
    language: 'bn',
    keywords: ['ইতিহাস', 'history', 'itihas', 'স্বাধীনতা', 'পলাশী', 'সিপাহী', 'গান্ধী', 'সুভাষ', 'নেতাজি', 'মুঘল', 'বঙ্গভঙ্গ'],
    questions: [
      {
        question: 'পলাশীর যুদ্ধ কত সালে সংঘটিত হয়?',
        options: ['১৭৫৭ সালে', '১৭৬৪ সালে', '১৮৫৭ সালে', '১৯০৫ সালে'],
        correctIndex: 0,
        explanation: '১৭৫৭ সালের ২৩ জুন নবাব সিরাজউদ্দৌলা ও ব্রিটিশ ইস্ট ইন্ডিয়া কোম্পানির মধ্যে পলাশীর যুদ্ধ হয়।',
      },
      {
        question: 'সিপাহী বিদ্রোহ (মহাবিদ্রোহ) প্রথম কোথায় শুরু হয়?',
        options: ['কলকাতা', 'ব্যারাকপুর ও মিরাট', 'মাদ্রাজ', 'বোম্বাই'],
        correctIndex: 1,
        explanation: '১৮৫৭ সালে ব্যারাকপুরে মঙ্গল পাণ্ডের বিদ্রোহ এবং ১০ মে মিরাটে ব্যাপকভাবে সিপাহী বিদ্রোহ শুরু হয়।',
      },
      {
        question: 'বঙ্গভঙ্গ কোন বছর কার্যকর হয়?',
        options: ['১৯০৫ সালে', '১৯১১ সালে', '১৯১৯ সালে', '১৯৪২ সালে'],
        correctIndex: 0,
        explanation: 'লর্ড কার্জনের নির্দেশে ১৯০৫ সালের ১৬ অক্টোবর বঙ্গভঙ্গ কার্যকর হয়।',
      },
      {
        question: '‘আজাদ হিন্দ ফৌজ’-এর সর্বাধিনায়ক কে ছিলেন?',
        options: ['ভগৎ সিং', 'নেতাজি সুভাষচন্দ্র বসু', 'ক্ষুদিরাম বসু', 'বাল গঙ্গাধর তিলক'],
        correctIndex: 1,
        explanation: 'নেতাজি সুভাষচন্দ্র বসু ১৯৪৩ সালে সিঙ্গাপুরে আজাদ হিন্দ ফৌজের দায়িত্ব গ্রহণ করেন।',
      },
      {
        question: 'ভারত ছাড়ো আন্দোলন কোন সালে শুরু হয়?',
        options: ['১৯২০ সালে', '১৯৩০ সালে', '১৯৪২ সালে', '১৯৪৭ সালে'],
        correctIndex: 2,
        explanation: '১৯৪২ সালের ৮ আগস্ট মহাত্মা গান্ধীর নেতৃত্বে ভারত ছাড়ো আন্দোলন শুরু হয়।',
      },
    ],
  },
  {
    id: 'geography',
    title: 'ভূগোল (Geography) কুইজ',
    topic: 'ভূগোল',
    language: 'bn',
    keywords: ['ভূগোল', 'ভুগোল', 'geography', 'vugol', 'bhugol', 'পশ্চিমবঙ্গ', 'নদী', 'পর্বত', 'পৃথিবী', 'বায়ুমণ্ডল', 'ভারত', 'সুন্দরবন'],
    questions: [
      {
        question: 'পশ্চিমবঙ্গের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?',
        options: ['টাইগার হিল', 'সান্দাকফু', 'ফালুট', 'অযোধ্যা পাহাড়'],
        correctIndex: 1,
        explanation: 'দার্জিলিং জেলার সিঙ্গালিলা পর্বতশ্রেণির সান্দাকফু (৩,৬৩৬ মিটার) পশ্চিমবঙ্গের সর্বোচ্চ শৃঙ্গ।',
      },
      {
        question: 'পৃথিবীর বৃহত্তম ব-দ্বীপ (Delta) কোনটি?',
        options: ['নীল নদের ব-দ্বীপ', 'গঙ্গা-ব্রহ্মপুত্র (সুন্দরবন) ব-দ্বীপ', 'মিসিসিপি ব-দ্বীপ', 'আমাজন ব-দ্বীপ'],
        correctIndex: 1,
        explanation: 'পশ্চিমবঙ্গ ও বাংলাদেশ জুড়ে বিস্তৃত গঙ্গা-ব্রহ্মপুত্র ব-দ্বীপ পৃথিবীর বৃহত্তম ব-দ্বীপ।',
      },
      {
        question: 'বায়ুমণ্ডলের কোন স্তরে ওজোন স্তর অবস্থিত?',
        options: ['ট্রপোস্ফিয়ার', 'স্ট্র্যাটোস্ফিয়ার', 'মেসোস্ফিয়ার', 'থার্মোস্ফিয়ার'],
        correctIndex: 1,
        explanation: 'স্ট্র্যাটোস্ফিয়ারে থাকা ওজোন স্তর সূর্যের ক্ষতিকর অতিবেগুনি রশ্মি শোষণ করে পৃথিবীকে রক্ষা করে।',
      },
      {
        question: 'ভারতের দীর্ঘতম নদী কোনটি?',
        options: ['গঙ্গা', 'গোদাবরী', 'নর্মদা', 'কাবেরী'],
        correctIndex: 0,
        explanation: 'গঙ্গা (প্রায় ২,৫২৫ কিমি) ভারতের দীর্ঘতম ও প্রধান নদী।',
      },
      {
        question: 'পশ্চিমবঙ্গের ‘দুঃখ’ বলা হয় কোন নদীকে?',
        options: ['তিস্তা', 'দামোদর', 'হুগলি', 'অজয়'],
        correctIndex: 1,
        explanation: 'অতীতে প্রতি বছর ভয়াবহ বন্যার কারণে দামোদর নদকে ‘বাংলার দুঃখ’ বলা হতো।',
      },
    ],
  },
  {
    id: 'bengali',
    title: 'বাংলা ব্যাকরণ ও সাহিত্য কুইজ',
    topic: 'বাংলা ব্যাকরণ ও সাহিত্য',
    language: 'bn',
    keywords: ['বাংলা', 'ব্যাকরণ', 'সন্ধি', 'সমাস', 'কারক', 'রবীন্দ্রনাথ', 'সাহিত্য', 'কবিতা', 'bengali', 'bangla', 'sandhi', 'somash', 'grammar'],
    questions: [
      {
        question: '‘বিদ্যালয়’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?',
        options: ['বিদ্যা + লয়', 'বিদ্যা + আলয়', 'বিদ্ + আলয়', 'বিদ্য + আলয়'],
        correctIndex: 1,
        explanation: 'আ + আ = আ স্বরসন্ধির নিয়মে বিদ্যা + আলয় = বিদ্যালয় হয়।',
      },
      {
        question: '‘সূর্যোদয়’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?',
        options: ['সূর্য + উদয়', 'সূর্য + ওদয়', 'সূর্যো + দয়', 'সূর + উদয়'],
        correctIndex: 0,
        explanation: 'অ + উ = ও নিয়মে সূর্য + উদয় = সূর্যোদয় গঠিত হয়।',
      },
      {
        question: 'রবীন্দ্রনাথ ঠাকুর কোন কাব্যগ্রন্থের জন্য নোবেল পুরস্কার পান?',
        options: ['সোনার তরী', 'বলাকা', 'গীতাঞ্জলি', 'চিত্রা'],
        correctIndex: 2,
        explanation: '১৯১৩ সালে ইংরেজি অনুবাদ Song Offerings (গীতাঞ্জলি)-এর জন্য রবীন্দ্রনাথ ঠাকুর সাহিত্যে নোবেল পান।',
      },
      {
        question: 'বাংলা ব্যাকরণে কারক মোট কয় প্রকার?',
        options: ['৪ প্রকার', '৫ প্রকার', '৬ প্রকার', '৮ প্রকার'],
        correctIndex: 2,
        explanation: 'বাংলা ব্যাকরণে কারক ৬ প্রকার: কর্তৃ, কর্ম, করণ, নিমিত্ত/সম্প্রদান, অপাদান এবং অধিকরণ কারক।',
      },
      {
        question: '‘নীরদ’ শব্দের অর্থ কী?',
        options: ['আকাশ', 'মেঘ', 'সাগর', 'বাতাস'],
        correctIndex: 1,
        explanation: 'নীর (জল) দান করে যে = নীরদ, যার অর্থ মেঘ।',
      },
    ],
  },
  {
    id: 'english',
    title: 'English Grammar Quiz',
    topic: 'English Grammar',
    language: 'en',
    keywords: ['english', 'tense', 'voice', 'narration', 'article', 'preposition', 'ইংরেজি', 'ইংলিশ'],
    questions: [
      {
        question: 'Choose the correct article: "He is ___ honest boy."',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 1,
        explanation: 'The "h" in "honest" is silent, so it starts with a vowel sound and takes "an".',
      },
      {
        question: 'Identify the tense: "She has been reading since morning."',
        options: [
          'Present Continuous',
          'Present Perfect',
          'Present Perfect Continuous',
          'Past Continuous',
        ],
        correctIndex: 2,
        explanation: '"has been + verb-ing" with "since morning" shows Present Perfect Continuous Tense.',
      },
      {
        question: 'Change to Passive Voice: "The boy writes a letter."',
        options: [
          'A letter is written by the boy.',
          'A letter was written by the boy.',
          'A letter is writing by the boy.',
          'The boy is written a letter.',
        ],
        correctIndex: 0,
        explanation: 'Simple Present active ("writes") changes to "is/am/are + past participle (written)".',
      },
      {
        question: 'Fill in the blank: "The cat jumped ___ the table."',
        options: ['in', 'onto', 'between', 'among'],
        correctIndex: 1,
        explanation: '"onto" indicates movement to a position on top of a surface.',
      },
      {
        question: 'Which word is an Abstract Noun?',
        options: ['River', 'Gold', 'Kindness', 'Teacher'],
        correctIndex: 2,
        explanation: '"Kindness" names a quality/feeling that cannot be touched, making it an abstract noun.',
      },
    ],
  },
];

function generateMathOfflineQuiz(className: ClassLevel, count: number): QuizData {
  const safeCount = Math.max(3, Math.min(10, count));
  const questions: QuizQuestion[] = [];

  const templates: Array<() => Omit<QuizQuestion, 'id'>> = [
    () => {
      const a = 12 + Math.floor(Math.random() * 18);
      const b = 6 + Math.floor(Math.random() * 14);
      const ans = a * b;
      const opts = [ans, ans + a, ans - b, ans + 10];
      return buildShuffledMathQ(`${a} × ${b} = কত?`, ans, opts, `${a} কে ${b} দিয়ে গুণ করলে ${ans} হয়।`);
    },
    () => {
      const n = 7 + Math.floor(Math.random() * 13);
      const ans = n * n;
      const opts = [ans, ans + n, ans - 2, (n + 1) * (n + 1)];
      return buildShuffledMathQ(`${n}-এর বর্গ (${n}²) কত?`, ans, opts, `${n} × ${n} = ${ans}।`);
    },
    () => {
      const p = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const base = (2 + Math.floor(Math.random() * 8)) * 40;
      const ans = (base * p) / 100;
      const opts = [ans, ans + 10, ans + 20, Math.max(2, ans - 10)];
      return buildShuffledMathQ(`${base}-এর ${p}% কত?`, ans, opts, `${base} × (${p}/100) = ${ans}।`);
    },
    () => {
      const x = 3 + Math.floor(Math.random() * 11);
      const c = 4 + Math.floor(Math.random() * 9);
      const rhs = 2 * x + c;
      const opts = [x, x + 2, x - 1, x + 4];
      return buildShuffledMathQ(
        `যদি 2x + ${c} = ${rhs} হয়, তবে x-এর মান কত?`,
        x,
        opts,
        `2x = ${rhs} - ${c} = ${rhs - c}, তাই x = ${rhs - c} ÷ 2 = ${x}।`,
      );
    },
    () => {
      const side = 5 + Math.floor(Math.random() * 11);
      const ans = side * 4;
      const opts = [ans, side * side, side * 2, ans + 4];
      return buildShuffledMathQ(
        `একটি বর্গক্ষেত্রের প্রতিটি বাহুর দৈর্ঘ্য ${side} সেমি হলে তার পরিসীমা কত?`,
        ans,
        opts,
        `বর্গক্ষেত্রের পরিসীমা = 4 × বাহু = 4 × ${side} = ${ans} সেমি।`,
      );
    },
    () => {
      const a = 30 + Math.floor(Math.random() * 50);
      const b = 40 + Math.floor(Math.random() * 50);
      const ans = 180 - (a + b);
      const opts = [ans, ans + 10, Math.abs(ans - 15), 90];
      return buildShuffledMathQ(
        `একটি ত্রিভুজের দুটি কোণ ${a}° ও ${b}° হলে তৃতীয় কোণটি কত?`,
        ans,
        opts,
        `ত্রিভুজের তিন কোণের সমষ্টি ১৮০°। তাই তৃতীয় কোণ = ১৮০° - (${a}° + ${b}°) = ${ans}°।`,
      );
    },
  ];

  for (let i = 0; i < safeCount; i++) {
    const gen = templates[i % templates.length];
    questions.push({
      id: `off-math-${Date.now()}-${i}`,
      ...gen(),
    });
  }

  return {
    title: 'গণিত (Mathematics) কুইজ',
    topic: 'গণিত',
    className,
    language: 'bn',
    questions,
    source: 'offline',
  };
}

function buildShuffledMathQ(
  question: string,
  correctVal: number,
  rawOptions: number[],
  explanation: string,
): Omit<QuizQuestion, 'id'> {
  const unique = new Set<number>([correctVal]);
  for (const val of rawOptions) {
    if (unique.size >= 4) break;
    if (Number.isFinite(val)) unique.add(val);
  }
  let bump = 3;
  while (unique.size < 4) {
    unique.add(correctVal + bump);
    bump += 3;
  }
  const arr = Array.from(unique).slice(0, 4);
  // Deterministic-friendly shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const correctIndex = Math.max(0, arr.indexOf(correctVal));
  return {
    question,
    options: [String(arr[0]), String(arr[1]), String(arr[2]), String(arr[3])],
    correctIndex,
    explanation,
  };
}

export function generateOfflineQuiz(
  topicPrompt: string,
  className: ClassLevel,
  requestedCount = 5,
): QuizData {
  const lower = topicPrompt.toLowerCase();
  const safeCount = Math.max(3, Math.min(10, requestedCount));

  if (/গণিত|অঙ্ক|অংক|math|algebra|geometry|বীজগণিত|জ্যামিতি|পাটিগণিত/i.test(lower)) {
    return generateMathOfflineQuiz(className, safeCount);
  }

  let bestPack: OfflineQuizPack | null = null;
  let bestScore = 0;

  for (const pack of OFFLINE_QUIZ_BANKS) {
    let score = 0;
    for (const kw of pack.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestPack = pack;
    }
  }

  if (bestPack) {
    const picked = bestPack.questions.slice(0, safeCount).map((q, idx) => ({
      id: `off-${bestPack!.id}-${Date.now()}-${idx}`,
      ...q,
    }));
    return {
      title: bestPack.title,
      topic: bestPack.topic,
      className,
      language: bestPack.language,
      questions: picked,
      source: 'offline',
    };
  }

  // Mixed WBBSE General Knowledge Quiz fallback when offline on an unlisted topic
  const mixedPool: Omit<QuizQuestion, 'id'>[] = [
    OFFLINE_QUIZ_BANKS[0].questions[0],
    OFFLINE_QUIZ_BANKS[1].questions[0],
    OFFLINE_QUIZ_BANKS[4].questions[0],
    OFFLINE_QUIZ_BANKS[5].questions[0],
    OFFLINE_QUIZ_BANKS[6].questions[0],
    OFFLINE_QUIZ_BANKS[3].questions[0],
    OFFLINE_QUIZ_BANKS[2].questions[1],
  ];

  const displayTopic = topicPrompt.trim() || 'WBBSE সাধারণ কুইজ';
  return {
    title: `${displayTopic} — অফলাইন WBBSE কুইজ`,
    topic: displayTopic,
    className,
    language: 'bn',
    questions: mixedPool.slice(0, safeCount).map((q, idx) => ({
      id: `off-mix-${Date.now()}-${idx}`,
      ...q,
    })),
    source: 'offline',
  };
}
