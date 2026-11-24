import type { DictionaryEntry } from '../types';

const OFFLINE_DICT_CACHE_KEY = 'wbsec_offline_dict_cache_v1';
const MAX_CACHED_WORDS = 300;

export const BUILTIN_OFFLINE_DICTIONARY: DictionaryEntry[] = [
  {
    word: 'বিদ্যালয়',
    pronunciation: 'বিদ্-দা-লয় (Bid-da-loy)',
    meaning: 'যে স্থানে ছাত্রছাত্রীরা বিদ্যা বা শিক্ষা লাভ করে; পাঠশালা বা স্কুল।',
    sandhiVicched: 'বিদ্যা + আলয়',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ, ষষ্ঠী তৎপুরুষ সমাস)',
    exampleSentences: [
      'প্রতিদিন সকালে সময়মতো বিদ্যালয়ে যাওয়া উচিত।',
      'আমাদের বিদ্যালয়ে একটি সমৃদ্ধ গ্রন্থাগার আছে।',
    ],
  },
  {
    word: 'সূর্যোদয়',
    pronunciation: 'শূর্-জো-দয় (Shur-jo-doy)',
    meaning: 'সকালে পূর্ব আকাশে সূর্যের উদয় বা ওঠা; প্রভাত।',
    sandhiVicched: 'সূর্য + উদয়',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ, স্বরসন্ধি)',
    exampleSentences: [
      'দার্জিলিংয়ের টাইগার হিল থেকে সূর্যোদয় দেখা দারুণ সুন্দর।',
      'সূর্যোদয়ের সাথে সাথে পাখিরা গান গাইতে শুরু করে।',
    ],
  },
  {
    word: 'অন্বেষণ',
    pronunciation: 'অন্-নে-শন (On-ne-shon)',
    meaning: 'গভীরভাবে খোঁজ করা, সন্ধান বা গবেষণা করা।',
    sandhiVicched: 'অনু + এষণ',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ, স্বরসন্ধি)',
    exampleSentences: [
      'বিজ্ঞানীরা মহাকাশে প্রাণের অন্বেষণ করছেন।',
      'সত্যের অন্বেষণই প্রকৃত শিক্ষার উদ্দেশ্য।',
    ],
  },
  {
    word: 'জিজ্ঞাসা',
    pronunciation: 'জিগ্-গ্যাঁ-শা (Jig-ga-sha)',
    meaning: 'জানার প্রবল ইচ্ছা; প্রশ্ন বা কৌতূহল।',
    sandhiVicched: 'জ্ঞা + সন্ + অ + আ',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'ছাত্রের মনে যত বেশি জিজ্ঞাসা থাকবে, সে তত দ্রুত শিখবে।',
      'শিক্ষক মহাশয় আমার সব জিজ্ঞাসার সহজ উত্তর দিলেন।',
    ],
  },
  {
    word: 'দিগন্ত',
    pronunciation: 'দি-গন্-ত (Di-gon-to)',
    meaning: 'দূরে যে রেখায় আকাশ ও পৃথিবী মিলে গেছে বলে মনে হয়; দিকের শেষ প্রান্ত।',
    sandhiVicched: 'দিক্ + অন্ত',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ, ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'গোধূলি বেলায় দিগন্ত জুড়ে লাল রঙ ছড়িয়ে পড়ে।',
      'খোলা মাঠের দিগন্তরেখায় সাদা মেঘ ভেসে চলেছে।',
    ],
  },
  {
    word: 'Resilience',
    pronunciation: 'রি-জি-লি-এন্স (ri-ZIL-yuhns)',
    meaning: 'কঠিন পরিস্থিতি বা ব্যর্থতার পর আবার ঘুরে দাঁড়ানোর মানসিক শক্তি; সহনশীলতা ও স্থিতিস্থাপকতা।',
    sandhiVicched: 'ইংরেজি শব্দ (ল্যাটিন মূল: re- + salire)',
    grammar: 'Noun (Abstract Noun / ভাববাচক বিশেষ্য)',
    exampleSentences: [
      'Her resilience helped her score top marks in Madhyamik despite all challenges.',
      'True resilience means learning from mistakes and trying again.',
    ],
  },
  {
    word: 'সালোকসংশ্লেষ',
    pronunciation: 'শা-লো-ক-শঙ্-শ্লেশ',
    meaning: 'সূর্যালোক ও ক্লোরোফিলের উপস্থিতিতে সবুজ উদ্ভিদের শর্করা জাতীয় খাদ্য তৈরির জৈব-রাসায়নিক প্রক্রিয়া।',
    sandhiVicched: 'স + আলোক + সম্ + শ্লেষ',
    grammar: 'বিশেষ্য পদ (বিজ্ঞান পরিভাষা)',
    exampleSentences: [
      'সালোকসংশ্লেষ প্রক্রিয়ায় উদ্ভিদ পরিবেশে অক্সিজেন ত্যাগ করে।',
      'সূর্যালোক ছাড়া সালোকসংশ্লেষ সম্ভব নয়।',
    ],
  },
  {
    word: 'হিমালয়',
    pronunciation: 'হি-মা-লয়',
    meaning: 'বরফের আবাসস্থল; এশিয়া মহাদেশের সর্বোচ্চ পর্বতমালা।',
    sandhiVicched: 'হিম + আলয়',
    grammar: 'সংজ্ঞাবাচক বিশেষ্য (স্বরসন্ধি)',
    exampleSentences: [
      'ভারতের উত্তরে প্রাচীরের মতো দাঁড়িয়ে আছে হিমালয় পর্বতমালা।',
      'হিমালয় থেকে গঙ্গা ও ব্রহ্মপুত্র নদের উৎপত্তি হয়েছে।',
    ],
  },
  {
    word: 'স্বাধীনতা',
    pronunciation: 'শা-ধি-ন-তা',
    meaning: 'পরাধীনতার মুক্তি; নিজের ইচ্ছামতো ন্যায়সঙ্গতভাবে চলার অধিকার।',
    sandhiVicched: 'স্ব + অধীন + তা',
    grammar: 'ভাববাচক বিশেষ্য (তৎসম শব্দ)',
    exampleSentences: [
      '১৯৪৭ সালের ১৫ই আগস্ট ভারত স্বাধীনতা লাভ করে।',
      'স্বাধীনতা অর্জনের চেয়ে তা রক্ষা করা বেশি কঠিন।',
    ],
  },
  {
    word: 'সংস্কৃতি',
    pronunciation: 'শঙ্-স্ক্রি-তি',
    meaning: 'কোনো জাতির জীবনধারা, সাহিত্য, শিল্পকলা, ভাষা, আচার-ব্যবহার ও মূল্যবোধের সমষ্টি।',
    sandhiVicched: 'সম্ + কৃতি',
    grammar: 'বিশেষ্য পদ (ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'বাংলার লোকসঙ্গীত আমাদের সংস্কৃতির অমূল্য সম্পদ।',
      'প্রতিটি জাতির নিজস্ব ঐতিহ্য ও সংস্কৃতি থাকে।',
    ],
  },
  {
    word: 'পরিবেশ',
    pronunciation: 'পো-রি-বেশ',
    meaning: 'আমাদের চারপাশের জল, বায়ু, মাটি, উদ্ভিদ, প্রাণী ও প্রাকৃতিক পারিপার্শ্বিক অবস্থা।',
    sandhiVicched: 'পরি + বেশ',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'গাছ লাগিয়ে আমাদের পরিবেশকে দূষণমুক্ত রাখা উচিত।',
      'সুস্থ জীবনের জন্য নির্মল পরিবেশ অত্যন্ত প্রয়োজন।',
    ],
  },
  {
    word: 'বিজ্ঞান',
    pronunciation: 'বিগ্-গ্যাঁন',
    meaning: 'পর্যবেক্ষণ, পরীক্ষা-নিরীক্ষা ও যুক্তির মাধ্যমে অর্জিত বিশেষ ও সুশৃঙ্খল জ্ঞান।',
    sandhiVicched: 'বি + জ্ঞান',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'বিজ্ঞান মানুষের দৈনন্দিন জীবনকে অনেক সহজ করেছে।',
      'আচার্য জগদীশচন্দ্র বসু ভারতের অন্যতম শ্রেষ্ঠ বিজ্ঞানী।',
    ],
  },
  {
    word: 'উন্নতি',
    pronunciation: 'উন্-নো-তি',
    meaning: 'অগ্রগতি, শ্রীবৃদ্ধি বা আরও ভালো অবস্থায় পৌঁছানো।',
    sandhiVicched: 'উৎ + নতি',
    grammar: 'বিশেষ্য পদ (ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'নিয়মিত অধ্যবসায় করলে পরীক্ষায় নিশ্চিত উন্নতি হয়।',
      'শিক্ষা ছাড়া কোনো দেশের প্রকৃত উন্নতি সম্ভব নয়।',
    ],
  },
  {
    word: 'অধ্যবসায়',
    pronunciation: 'ওধ্-ধো-ব-শায়',
    meaning: 'কোনো কাজে সফল না হওয়া পর্যন্ত ধৈর্য ও নিষ্ঠার সাথে অবিরাম চেষ্টা চালিয়ে যাওয়া।',
    sandhiVicched: 'অধি + অবসায়',
    grammar: 'বিশেষ্য পদ (স্বরসন্ধি)',
    exampleSentences: [
      'অধ্যবসায়ই সাফল্যের মূল চাবিকাঠি।',
      'ছাত্রজীবনে অধ্যবসায়ের কোনো বিকল্প নেই।',
    ],
  },
  {
    word: 'কৃতজ্ঞতা',
    pronunciation: 'ক্রি-তগ্-গ-তা',
    meaning: 'কেউ উপকার করলে সেই উপকার মনে রাখা ও ধন্যবাদ জানানোর মানসিকতা।',
    sandhiVicched: 'কৃতজ্ঞ + তা',
    grammar: 'ভাববাচক বিশেষ্য',
    exampleSentences: [
      'বাবা-মা ও শিক্ষকের প্রতি আমাদের চিরকাল কৃতজ্ঞতা থাকা উচিত।',
      'তাঁর সাহায্যের জন্য আমি গভীর কৃতজ্ঞতা প্রকাশ করছি।',
    ],
  },
  {
    word: 'সদাচার',
    pronunciation: 'শ-দা-চার',
    meaning: 'সৎ ও ভদ্র আচরণ; শিষ্টাচার।',
    sandhiVicched: 'সৎ + আচার',
    grammar: 'বিশেষ্য পদ (ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'সদাচার মানুষকে সবার কাছে প্রিয় করে তোলে।',
      'ছোটবেলা থেকেই সদাচার অভ্যাস করা প্রয়োজন।',
    ],
  },
  {
    word: 'অত্যন্ত',
    pronunciation: 'ওত্-তন্-ত',
    meaning: 'খুবই, প্রচণ্ড বা মাত্রাতিরিক্ত।',
    sandhiVicched: 'অতি + অন্ত',
    grammar: 'বিশেষণের বিশেষণ / অব্যয় (স্বরসন্ধি)',
    exampleSentences: [
      'আজকের অঙ্কটা অত্যন্ত সহজ ছিল।',
      'সময়ের মূল্য বোঝা ছাত্রদের জন্য অত্যন্ত জরুরি।',
    ],
  },
  {
    word: 'স্বাগত',
    pronunciation: 'শা-গ-ত',
    meaning: 'সু-আগমন; অতিথিকে আনন্দের সাথে বরণ করে নেওয়া।',
    sandhiVicched: 'সু + আগত',
    grammar: 'বিশেষণ / বিশেষ্য পদ (স্বরসন্ধি)',
    exampleSentences: [
      'আমাদের বিদ্যালয়ের বার্ষিক অনুষ্ঠানে সবাইকে স্বাগত।',
      'অতিথিকে হাসিমুখে স্বাগত জানানো ভদ্রতার লক্ষণ।',
    ],
  },
  {
    word: 'ইত্যাদি',
    pronunciation: 'ইত্-তা-দি',
    meaning: 'এইরকম আরও অনেক কিছু; প্রভৃতি।',
    sandhiVicched: 'ইতি + আদি',
    grammar: 'অব্যয় পদ (স্বরসন্ধি)',
    exampleSentences: [
      'আম, জাম, কাঁঠাল, লিচু ইত্যাদি গ্রীষ্মকালীন ফল।',
      'ব্যাগটিতে খাতা, কলম, পেন্সিল ইত্যাদি রাখা আছে।',
    ],
  },
  {
    word: 'পরীক্ষা',
    pronunciation: 'পো-রিক্-খা',
    meaning: 'জ্ঞান, দক্ষতা বা সত্যতা যাচাই করার প্রক্রিয়া।',
    sandhiVicched: 'পরি + ঈক্ষা',
    grammar: 'বিশেষ্য পদ (স্বরসন্ধি)',
    exampleSentences: [
      'মাধ্যমিক পরীক্ষার জন্য সে মন দিয়ে প্রস্তুতি নিচ্ছে।',
      'পরীক্ষার হলে শান্ত মাথায় প্রশ্ন পড়া উচিত।',
    ],
  },
  {
    word: 'মহোৎসব',
    pronunciation: 'মো-হোত্-শব',
    meaning: 'বিরাট বা মহা আনন্দ-অনুষ্ঠান।',
    sandhiVicched: 'মহা + উৎসব',
    grammar: 'বিশেষ্য পদ (স্বরসন্ধি)',
    exampleSentences: [
      'দুর্গাপূজা বাংলার সবচেয়ে বড় মহোৎসব।',
      'বিদ্যালয়ের শতবর্ষ উপলক্ষে মহোৎসবের আয়োজন করা হয়েছে।',
    ],
  },
  {
    word: 'নাবিক',
    pronunciation: 'না-বিক',
    meaning: 'যিনি জাহাজ বা নৌকা চালান; মাঝি বা জলযানের কর্মী।',
    sandhiVicched: 'নৌ + ইক',
    grammar: 'বিশেষ্য পদ (স্বরসন্ধি)',
    exampleSentences: [
      'সাহসী নাবিক ঝড়ের মধ্যেও জাহাজটিকে নিরাপদে বন্দরে নিয়ে এলেন।',
      'প্রাচীনকালে বাঙালি নাবিকরা বাণিজ্যের জন্য দূরদেশে যেত।',
    ],
  },
  {
    word: 'গায়ক',
    pronunciation: 'গা-য়ক',
    meaning: 'যিনি গান গান; সঙ্গীতশিল্পী।',
    sandhiVicched: 'গৈ + অক',
    grammar: 'বিশেষ্য পদ (স্বরসন্ধি)',
    exampleSentences: [
      'অনুষ্ঠানে গায়কের রবীন্দ্রসঙ্গীত সবাইকে মুগ্ধ করল।',
      'ভালো গায়ক হতে হলে প্রতিদিন রেওয়াজ করতে হয়।',
    ],
  },
  {
    word: 'সজ্জন',
    pronunciation: 'শজ্-জন',
    meaning: 'সৎ, ভদ্র ও চরিত্রবান ব্যক্তি।',
    sandhiVicched: 'সৎ + জন',
    grammar: 'বিশেষ্য / বিশেষণ পদ (ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'সজ্জন ব্যক্তির সঙ্গ মানুষের মনকে উন্নত করে।',
      'গ্রামে সবাই তাঁকে একজন সজ্জন মানুষ হিসেবে শ্রদ্ধা করে।',
    ],
  },
  {
    word: 'উজ্জ্বল',
    pronunciation: 'উজ্-জল',
    meaning: 'আলোয় ভরা, দীপ্তিময় বা চকচকে।',
    sandhiVicched: 'উৎ + জ্বল',
    grammar: 'বিশেষণ পদ (ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'রাতের আকাশে তারাগুলো উজ্জ্বল হয়ে জ্বলছে।',
      'ভালো পড়াশোনা করলে ভবিষ্যৎ উজ্জ্বল হয়।',
    ],
  },
  {
    word: 'সঞ্চয়',
    pronunciation: 'শন্-চয়',
    meaning: 'ভবিষ্যতের জন্য জমিয়ে রাখা বা সংগ্রহ করা।',
    sandhiVicched: 'সম্ + চয়',
    grammar: 'বিশেষ্য পদ (ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'বিপদের দিনের জন্য অল্প অল্প সঞ্চয় করা বুদ্ধিমানের কাজ।',
      'জ্ঞান সঞ্চয় করলে তা কখনো ফুরিয়ে যায় না।',
    ],
  },
  {
    word: 'সংবাদ',
    pronunciation: 'শঙ্-বাদ',
    meaning: 'খবর, বার্তা বা তথ্য।',
    sandhiVicched: 'সম্ + বাদ',
    grammar: 'বিশেষ্য পদ (ব্যঞ্জনসন্ধি)',
    exampleSentences: [
      'সকালে সংবাদপত্র পড়া একটি ভালো অভ্যাস।',
      'পরীক্ষায় প্রথম হওয়ার সংবাদ শুনে বাবা-মা খুব খুশি হলেন।',
    ],
  },
  {
    word: 'নমস্কার',
    pronunciation: 'ন-মোশ্-কার',
    meaning: 'দুই হাত জোড় করে শ্রদ্ধা বা অভিবাদন জানানো।',
    sandhiVicched: 'নমঃ + কার',
    grammar: 'বিশেষ্য পদ (বিসর্গ সন্ধি)',
    exampleSentences: [
      'গুরুজনদের দেখলে বিনয়ের সাথে নমস্কার জানানো উচিত।',
      'সকালে স্কুলে ঢুকে আমরা শিক্ষকদের নমস্কার করি।',
    ],
  },
  {
    word: 'আবিষ্কার',
    pronunciation: 'আ-বিশ্-কার',
    meaning: 'অজানা কোনো সত্য, বস্তু বা যন্ত্র নতুন করে খুঁজে বের করা বা উদ্ভাবন করা।',
    sandhiVicched: 'আবিঃ + কার',
    grammar: 'বিশেষ্য পদ (বিসর্গ সন্ধি)',
    exampleSentences: [
      'আলেকজান্ডার ফ্লেমিং পেনিসিলিন আবিষ্কার করেন।',
      'বিদ্যুতের আবিষ্কার মানবসভ্যতাকে বদলে দিয়েছে।',
    ],
  },
  {
    word: 'মনোযোগ',
    pronunciation: 'মো-নো-জোগ',
    meaning: 'কোনো বিষয়ে মন স্থির করে দেওয়া; একাগ্রতা।',
    sandhiVicched: 'মনঃ + যোগ',
    grammar: 'বিশেষ্য পদ (বিসর্গ সন্ধি)',
    exampleSentences: [
      'ক্লাসে শিক্ষকের কথা মনোযোগ দিয়ে শোনা উচিত।',
      'মনোযোগ দিয়ে পড়লে অল্প সময়েই পড়া মনে থাকে।',
    ],
  },
  {
    word: 'নিরীহ',
    pronunciation: 'নি-রি-হ',
    meaning: 'শান্ত, নির্দোষ ও কারও ক্ষতি করে না এমন।',
    sandhiVicched: 'নিঃ + ঈহ',
    grammar: 'বিশেষণ পদ (বিসর্গ সন্ধি)',
    exampleSentences: [
      'হরিণ একটি অত্যন্ত নিরীহ প্রাণী।',
      'নিরীহ মানুষের ওপর কখনো অত্যাচার করা উচিত নয়।',
    ],
  },
  {
    word: 'আশীর্বাদ',
    pronunciation: 'আ-শির্-বাদ',
    meaning: 'মঙ্গল কামনা করে গুরুজনদের শুভ ইচ্ছা বা দোয়া।',
    sandhiVicched: 'আশীঃ + বাদ',
    grammar: 'বিশেষ্য পদ (বিসর্গ সন্ধি)',
    exampleSentences: [
      'পরীক্ষা দিতে যাওয়ার আগে মা-বাবার আশীর্বাদ নেওয়া ভালো।',
      'শিক্ষকদের আশীর্বাদেই ছাত্ররা জীবনে বড় হয়।',
    ],
  },
  {
    word: 'সাহিত্য',
    pronunciation: 'শা-হিত্-ত',
    meaning: 'কবিতা, গল্প, উপন্যাস, নাটক ও প্রবন্ধের শিল্পসম্মত রচনা।',
    sandhiVicched: 'সহিত + য',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'রবীন্দ্রনাথ ঠাকুর বাংলা সাহিত্যকে বিশ্বদরবারে পৌঁছে দিয়েছেন।',
      'ভালো সাহিত্য পড়লে ভাষার দক্ষতা বাড়ে।',
    ],
  },
  {
    word: 'ইতিহাস',
    pronunciation: 'ই-তি-হাশ',
    meaning: 'অতীতে ঘটে যাওয়া মানবসভ্যতা ও সমাজের ধারাবাহিক সত্য বিবরণ।',
    sandhiVicched: 'ইতিহ + আস',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'ইতিহাস পাঠ করলে আমরা অতীতের ভুল থেকে শিক্ষা নিতে পারি।',
      'বাংলার স্বাধীনতা সংগ্রামের ইতিহাস অত্যন্ত গৌরবময়।',
    ],
  },
  {
    word: 'ভূগোল',
    pronunciation: 'ভু-গোল',
    meaning: 'পৃথিবীর গঠন, জলবায়ু, নদী, পাহাড় ও মানববসতি বিষয়ক শাস্ত্র।',
    sandhiVicched: 'ভূ + গোল',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'ভূগোল ক্লাসে আজ আমরা পশ্চিমবঙ্গের নদ-নদী সম্পর্কে শিখেছি।',
      'মানচিত্র দেখে ভূগোল পড়লে বিষয়টি সহজে বোঝা যায়।',
    ],
  },
  {
    word: 'গণিত',
    pronunciation: 'গো-নিত',
    meaning: 'সংখ্যা, পরিমাণ, জ্যামিতি ও যুক্তি-ভিত্তিক হিসাবশাস্ত্র।',
    sandhiVicched: 'গণ্ + ইত',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'প্রতিদিন অনুশীলন করলে গণিত সবচেয়ে প্রিয় বিষয় হয়ে ওঠে।',
      'গণিত মানুষের যুক্তিবুদ্ধি ও চিন্তাশক্তি বাড়ায়।',
    ],
  },
  {
    word: 'ব্যাকরণ',
    pronunciation: 'ব্যা-ক-রন',
    meaning: 'যে শাস্ত্র পাঠ করলে কোনো ভাষা শুদ্ধভাবে লিখতে, পড়তে ও বলতে পারা যায়।',
    sandhiVicched: 'বি + আ + কৃ + অন',
    grammar: 'বিশেষ্য পদ (তৎসম শব্দ)',
    exampleSentences: [
      'শুদ্ধ বাংলা বানান জানতে বাংলা ব্যাকরণ পড়া জরুরি।',
      'ব্যাকরণ ভাষার শৃঙ্খলা বজায় রাখে।',
    ],
  },
  {
    word: 'প্রতিজ্ঞা',
    pronunciation: 'প্রো-তিগ্-গ্যাঁ',
    meaning: 'কোনো কাজ করার দৃঢ় শপথ বা অঙ্গীকার।',
    sandhiVicched: 'প্রতি + জ্ঞা',
    grammar: 'বিশেষ্য পদ',
    exampleSentences: [
      'আমি প্রতিদিন অন্তত দুই ঘণ্টা মন দিয়ে পড়ার প্রতিজ্ঞা করেছি।',
      'প্রতিজ্ঞা রক্ষা করা মহৎ মানুষের পরিচয়।',
    ],
  },
  {
    word: 'শৃঙ্খলা',
    pronunciation: 'স্রিঙ্-খ-লা',
    meaning: 'নিয়মকানুন মেনে চলা; সুব্যবস্থা।',
    sandhiVicched: 'শৃঙ্খল + আ',
    grammar: 'বিশেষ্য পদ',
    exampleSentences: [
      'ছাত্রজীবনে শৃঙ্খলা মেনে চললে জীবনে বড় হওয়া যায়।',
      'খেলার মাঠে শৃঙ্খলা বজায় রাখা খুব দরকার।',
    ],
  },
  {
    word: 'সততা',
    pronunciation: 'শ-ত-তা',
    meaning: 'সত্যবাদিতা, ন্যায়পরায়ণতা ও অসৎ পথ থেকে দূরে থাকার গুণ।',
    sandhiVicched: 'সৎ + তা',
    grammar: 'ভাববাচক বিশেষ্য',
    exampleSentences: [
      'সততাই সর্বোৎকৃষ্ট পন্থা।',
      'সততার পুরস্কার জীবনে একদিন না একদিন পাওয়া যায়ই।',
    ],
  },
  {
    word: 'সময়ানুবর্তিতা',
    pronunciation: 'শ-ম-য়া-নু-বোর্ত-তি-তা',
    meaning: 'সঠিক সময়ে সঠিক কাজ সম্পন্ন করার অভ্যাস।',
    sandhiVicched: 'সময় + অনুবর্তিতা',
    grammar: 'ভাববাচক বিশেষ্য',
    exampleSentences: [
      'সময়ানুবর্তিতা সফল মানুষের অন্যতম প্রধান গুণ।',
      'বিদ্যালয়ে সময়ানুবর্তিতার শিক্ষা দেওয়া হয়।',
    ],
  },
  {
    word: 'ঐতিহ্য',
    pronunciation: 'ওই-তিজ্-ঝো',
    meaning: 'বংশপরম্পরায় বা যুগ যুগ ধরে চলে আসা গৌরবময় ধারা ও সংস্কৃতি।',
    sandhiVicched: 'ইতিহ + য',
    grammar: 'বিশেষ্য পদ',
    exampleSentences: [
      'শান্তিনিকেতন বাংলার শিক্ষা ও সংস্কৃতির এক মহান ঐতিহ্য।',
      'আমাদের প্রাচীন ঐতিহ্যকে সম্মান জানানো উচিত।',
    ],
  },
  {
    word: 'সৌন্দর্য',
    pronunciation: 'শৌন্-দোর্-জো',
    meaning: 'সুন্দর হওয়ার ভাব বা রূপের মাধুর্য।',
    sandhiVicched: 'সুন্দর + য',
    grammar: 'ভাববাচক বিশেষ্য',
    exampleSentences: [
      'সুন্দরবনের প্রাকৃতিক সৌন্দর্য অসাধারণ।',
      'বাইরের রূপের চেয়ে মনের সৌন্দর্য অনেক বড়।',
    ],
  },
  {
    word: 'স্বাস্থ্য',
    pronunciation: 'শাশ্-থো',
    meaning: 'শরীর ও মনের সুস্থ ও নীরোগ অবস্থা।',
    sandhiVicched: 'স্বস্থ + য',
    grammar: 'বিশেষ্য পদ',
    exampleSentences: [
      'স্বাস্থ্যই সকল সুখের মূল।',
      'নিয়মিত ব্যায়াম ও পুষ্টিকর খাবার স্বাস্থ্য ভালো রাখে।',
    ],
  },
  {
    word: 'নদীমাতৃক',
    pronunciation: 'নো-দি-মাত্-ত্রিক',
    meaning: 'যে দেশের মাটি ও কৃষি প্রধানত নদীর জলের ওপর নির্ভরশীল।',
    sandhiVicched: 'নদী মাতা যার (বহুব্রীহি সমাস)',
    grammar: 'বিশেষণ পদ',
    exampleSentences: [
      'পশ্চিমবঙ্গ ও বাংলাদেশ নদীমাতৃক অঞ্চল।',
      'নদীমাতৃক দেশের পলিমাটি খুব উর্বর হয়।',
    ],
  },
  {
    word: 'মহাকর্ষ',
    pronunciation: 'ম-হা-কোর্-শো',
    meaning: 'মহাবিশ্বের যেকোনো দুটি বস্তুর পরস্পরের প্রতি আকর্ষণ বল।',
    sandhiVicched: 'মহা + আকর্ষ',
    grammar: 'বিশেষ্য পদ (ভৌত বিজ্ঞান)',
    exampleSentences: [
      'স্যার আইজ্যাক নিউটন মহাকর্ষ সূত্র আবিষ্কার করেন।',
      'মহাকর্ষ বলের কারণেই গ্রহগুলো সূর্যের চারপাশে ঘোরে।',
    ],
  },
  {
    word: 'অভিকর্ষ',
    pronunciation: 'ও-ভি-কোর্-শো',
    meaning: 'পৃথিবী যে বল দ্বারা তার কেন্দ্রের দিকে যেকোনো বস্তুকে আকর্ষণ করে।',
    sandhiVicched: 'অভি + কর্ষ',
    grammar: 'বিশেষ্য পদ (ভৌত বিজ্ঞান)',
    exampleSentences: [
      'অভিকর্ষ বলের টানে গাছ থেকে ফল মাটিতে পড়ে।',
      'পৃথিবীতে অভিকর্ষজ ত্বরণের গড় মান ৯.৮ মিটার/সেকেন্ড²।',
    ],
  },
  {
    word: 'Education',
    pronunciation: 'এ-জু-কে-শন (ej-oo-KAY-shuhn)',
    meaning: 'শিক্ষা; জ্ঞান, দক্ষতা ও চরিত্র গঠনের প্রক্রিয়া।',
    sandhiVicched: 'ইংরেজি শব্দ (ল্যাটিন মূল: educare)',
    grammar: 'Noun (Abstract Noun)',
    exampleSentences: [
      'Education is the backbone of a nation.',
      'Good education builds both knowledge and character.',
    ],
  },
  {
    word: 'Knowledge',
    pronunciation: 'ন-লেজ (NOL-ij)',
    meaning: 'জ্ঞান; পড়াশোনা ও অভিজ্ঞতার মাধ্যমে অর্জিত সত্য ধারণা।',
    sandhiVicched: 'ইংরেজি শব্দ (know + -ledge)',
    grammar: 'Noun (Uncountable Noun)',
    exampleSentences: [
      'Knowledge is power when used wisely.',
      'Reading books every day increases our knowledge.',
    ],
  },
  {
    word: 'Perseverance',
    pronunciation: 'পার-সি-ভি-য়া-রেন্স (pur-suh-VEER-uhns)',
    meaning: 'অধ্যবসায়; বাধা সত্ত্বেও লক্ষ্যে পৌঁছানোর নিরন্তর চেষ্টা।',
    sandhiVicched: 'ইংরেজি শব্দ (ল্যাটিন মূল: perseverare)',
    grammar: 'Noun (Abstract Noun)',
    exampleSentences: [
      'Through hard work and perseverance, he passed with distinction.',
      'Perseverance turns difficult subjects into easy ones.',
    ],
  },
  {
    word: 'Discipline',
    pronunciation: 'ডি-সি-প্লিন (DIS-uh-plin)',
    meaning: 'শৃঙ্খলা; নিয়ম ও সময় মেনে চলার অভ্যাস।',
    sandhiVicched: 'ইংরেজি শব্দ (ল্যাটিন মূল: disciplina)',
    grammar: 'Noun / Verb',
    exampleSentences: [
      'Discipline is essential for every student.',
      'Regular study habits teach us self-discipline.',
    ],
  },
  {
    word: 'Environment',
    pronunciation: 'এন-ভাই-রন-মেন্ট (en-VY-ruhn-muhnt)',
    meaning: 'পরিবেশ; আমাদের চারপাশের প্রকৃতি ও পারিপার্শ্বিক অবস্থা।',
    sandhiVicched: 'ইংরেজি শব্দ (environ + -ment)',
    grammar: 'Noun',
    exampleSentences: [
      'We must plant more trees to protect our environment.',
      'Plastic pollution harms the natural environment.',
    ],
  },
  {
    word: 'Curiosity',
    pronunciation: 'কিউ-রি-অ-সি-টি (kyoor-ee-OS-i-tee)',
    meaning: 'কৌতূহল বা জানার প্রবল আগ্রহ।',
    sandhiVicched: 'ইংরেজি শব্দ (curious + -ity)',
    grammar: 'Noun (Abstract Noun)',
    exampleSentences: [
      'Curiosity is the first step toward scientific discovery.',
      'Ask questions in class to feed your curiosity.',
    ],
  },
  {
    word: 'Gratitude',
    pronunciation: 'গ্র্যা-টি-টিউড (GRAT-i-tood)',
    meaning: 'কৃতজ্ঞতা; কারও উপকারের জন্য আন্তরিক ধন্যবাদবোধ।',
    sandhiVicched: 'ইংরেজি শব্দ (ল্যাটিন মূল: gratus)',
    grammar: 'Noun (Abstract Noun)',
    exampleSentences: [
      'Always show gratitude to your parents and teachers.',
      'She expressed her heartfelt gratitude for the help.',
    ],
  },
  {
    word: 'Photosynthesis',
    pronunciation: 'ফো-টো-সিন-থে-সিস (foh-toh-SIN-thuh-sis)',
    meaning: 'সালোকসংশ্লেষ; সূর্যালোকের সাহায্যে সবুজ উদ্ভিদের খাদ্য তৈরির প্রক্রিয়া।',
    sandhiVicched: 'গ্রিক মূল: photo (আলো) + synthesis (সংশ্লেষ)',
    grammar: 'Noun (Science Term)',
    exampleSentences: [
      'Green plants make glucose and oxygen during photosynthesis.',
      'Chlorophyll in leaves absorbs sunlight for photosynthesis.',
    ],
  },
  {
    word: 'Democracy',
    pronunciation: 'ডি-ম-ক্র্যা-সি (di-MOK-ruh-see)',
    meaning: 'গণতন্ত্র; জনগণের দ্বারা নির্বাচিত শাসনব্যবস্থা।',
    sandhiVicched: 'গ্রিক মূল: demos (জনগণ) + kratos (শাসন)',
    grammar: 'Noun',
    exampleSentences: [
      'India is the largest democracy in the world.',
      'In a democracy, every citizen has equal rights.',
    ],
  },
  {
    word: 'Gravity',
    pronunciation: 'গ্র্যা-ভি-টি (GRAV-i-tee)',
    meaning: 'মহাকর্ষ বা অভিকর্ষ বল; যে টানে সব বস্তু পৃথিবীর দিকে পড়ে।',
    sandhiVicched: 'ইংরেজি শব্দ (ল্যাটিন মূল: gravitas)',
    grammar: 'Noun (Physics Term)',
    exampleSentences: [
      'Gravity keeps the Moon orbiting around the Earth.',
      'Because of gravity, a thrown ball always comes back down.',
    ],
  },
  {
    word: 'Honesty',
    pronunciation: 'অ-নেস্-টি (ON-uh-stee)',
    meaning: 'সততা; সত্য বলার ও সৎ পথে চলার গুণ।',
    sandhiVicched: 'ইংরেজি শব্দ (honest + -y)',
    grammar: 'Noun (Abstract Noun)',
    exampleSentences: [
      'Honesty is the best policy.',
      'Everyone trusts a student known for honesty.',
    ],
  },
];

function normalizeWord(word: string): string {
  return word
    .trim()
    .normalize('NFC')
    .replace(/য়/g, 'য়')
    .replace(/ড়/g, 'ড়')
    .replace(/ঢ়/g, 'ঢ়')
    .toLowerCase();
}

export function loadCachedOfflineDictionary(): DictionaryEntry[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(OFFLINE_DICT_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is DictionaryEntry =>
        Boolean(item) && typeof item.word === 'string' && typeof item.meaning === 'string',
    );
  } catch {
    return [];
  }
}

export function saveOfflineDictionaryEntry(entry: DictionaryEntry): void {
  try {
    if (typeof localStorage === 'undefined' || !entry?.word?.trim()) return;
    const existing = loadCachedOfflineDictionary();
    const norm = normalizeWord(entry.word);
    const filtered = existing.filter((item) => normalizeWord(item.word) !== norm);
    const next = [entry, ...filtered].slice(0, MAX_CACHED_WORDS);
    localStorage.setItem(OFFLINE_DICT_CACHE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota/storage errors
  }
}

export function getAllOfflineDictionaryWords(): string[] {
  const cached = loadCachedOfflineDictionary();
  const seen = new Set<string>();
  const words: string[] = [];

  for (const item of [...cached, ...BUILTIN_OFFLINE_DICTIONARY]) {
    const norm = normalizeWord(item.word);
    if (!seen.has(norm)) {
      seen.add(norm);
      words.push(item.word);
    }
  }
  return words;
}

export function lookupOfflineDictionary(query: string): {
  entry: DictionaryEntry | null;
  suggestions: string[];
} {
  const clean = normalizeWord(query);
  if (!clean) {
    return {
      entry: null,
      suggestions: getAllOfflineDictionaryWords().slice(0, 10),
    };
  }

  const allEntries = [...loadCachedOfflineDictionary(), ...BUILTIN_OFFLINE_DICTIONARY];

  for (const item of allEntries) {
    if (normalizeWord(item.word) === clean) {
      return { entry: item, suggestions: [] };
    }
  }

  const partialMatches: DictionaryEntry[] = [];
  const seen = new Set<string>();
  for (const item of allEntries) {
    const normWord = normalizeWord(item.word);
    const normMeaning = normalizeWord(item.meaning);
    if (seen.has(normWord)) continue;
    if (normWord.includes(clean) || clean.includes(normWord) || normMeaning.includes(clean)) {
      seen.add(normWord);
      partialMatches.push(item);
    }
  }

  if (partialMatches.length === 1 && normalizeWord(partialMatches[0].word).startsWith(clean)) {
    return { entry: partialMatches[0], suggestions: [] };
  }

  const suggestions =
    partialMatches.length > 0
      ? partialMatches.slice(0, 8).map((e) => e.word)
      : getAllOfflineDictionaryWords().slice(0, 8);

  return { entry: null, suggestions };
}
