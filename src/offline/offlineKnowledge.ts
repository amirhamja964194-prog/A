import type { ClassLevel } from '../types';

export type OfflineSubjectId =
  | 'history'
  | 'physical_science'
  | 'life_science'
  | 'geography'
  | 'math'
  | 'bengali'
  | 'english';

export interface OfflineSubjectMeta {
  id: OfflineSubjectId;
  label: string;
}

export interface OfflineStudyTopic {
  id: string;
  subject: OfflineSubjectId;
  subjectLabel: string;
  classes: string;
  title: string;
  keywords: string[];
  answer: string;
}

export interface CachedTeacherAnswer {
  question: string;
  answer: string;
  className: ClassLevel;
  createdAt: number;
}

const OFFLINE_TEACHER_CACHE_KEY = 'wbsec_offline_teacher_cache_v1';
const MAX_CACHED_ANSWERS = 150;

export const OFFLINE_SUBJECTS: OfflineSubjectMeta[] = [
  { id: 'history', label: 'ইতিহাস' },
  { id: 'physical_science', label: 'ভৌত বিজ্ঞান' },
  { id: 'life_science', label: 'জীবন বিজ্ঞান' },
  { id: 'geography', label: 'ভূগোল' },
  { id: 'math', label: 'গণিত' },
  { id: 'bengali', label: 'বাংলা ব্যাকরণ ও রচনা' },
  { id: 'english', label: 'English Grammar' },
];

export const OFFLINE_STUDY_TOPICS: OfflineStudyTopic[] = [
  {
    id: 'hist-plassey',
    subject: 'history',
    subjectLabel: 'ইতিহাস',
    classes: 'Class 8–10',
    title: 'পলাশীর যুদ্ধ (১৭৫৭) — কারণ ও ফলাফল',
    keywords: ['পলাশী', 'পলাশীর যুদ্ধ', 'plassey', 'সিরাজ', 'সিরাজউদ্দৌলা', 'মীরজাফর', '১৭৫৭', '1757'],
    answer: `**পলাশীর যুদ্ধ (২৩শে জুন, ১৭৫৭)**

**ভূমিকা:**
১৭৫৭ সালের ২৩শে জুন নদিয়া জেলার ভাগীরথী নদীর তীরে পলাশীর প্রান্তরে বাংলার শেষ স্বাধীন নবাব **সিরাজউদ্দৌলা** ও ব্রিটিশ ইস্ট ইন্ডিয়া কোম্পানির (**রবার্ট ক্লাইভ**) মধ্যে ঐতিহাসিক পলাশীর যুদ্ধ সংঘটিত হয়।

**প্রধান কারণসমূহ:**
1. **দস্তকের অপব্যবহার:** ইংরেজ বণিকরা বিনা শুল্কে বাণিজ্যের ছাড়পত্র (দস্তক) ব্যক্তিগত ব্যবসায় অপব্যবহার করায় নবাবের রাজস্ব ক্ষতি হচ্ছিল।
2. **কলকাতায় দুর্গ নির্মাণ:** নবাবের অনুমতি ছাড়াই ইংরেজরা কলকাতায় ফোর্ট উইলিয়াম দুর্গের সংস্কার ও সামরিক প্রস্তুতি শুরু করে।
3. **নবাববিরোধী ষড়যন্ত্র:** নবাবের সেনাপতি **মীরজাফর**, ধনী বণিক জগৎশেঠ, উমিচাঁদ ও রায়দুর্লভ গোপনে ক্লাইভের সাথে হাত মেলান।

**যুদ্ধের ফলাফল ও গুরুত্ব:**
1. মীরজাফরের বিশ্বাসঘাতকতায় নবাব সিরাজউদ্দৌলা পরাজিত ও পরে নিহত হন; মীরমোহন ও মোহনলাল বীরত্বের সাথে যুদ্ধ করে প্রাণ দেন।
2. বাংলার স্বাধীনতার সূর্য অস্তমিত হয় এবং ভারতে **ব্রিটিশ শাসনের ভিত্তি** স্থাপিত হয়।
3. ইংরেজরা মীরজাফরকে নামেমাত্র নবাব করে বাংলার বিপুল সম্পদ লুণ্ঠন শুরু করে (পলাশীর লুণ্ঠন)।`,
  },
  {
    id: 'hist-buxar',
    subject: 'history',
    subjectLabel: 'ইতিহাস',
    classes: 'Class 8–10',
    title: 'বক্সারের যুদ্ধ (১৭৬৪) ও দেওয়ানি লাভ (১৭৬৫)',
    keywords: ['বক্সার', 'বক্সারের যুদ্ধ', 'buxar', 'মীরকাশিম', 'দেওয়ানি', '১৭৬৪', '১৭৬৫'],
    answer: `**বক্সারের যুদ্ধ (২২শে অক্টোবর, ১৭৬৪)**

**পক্ষসমূহ:**
একদিকে বাংলার নবাব **মীরকাশিম**, অযোধ্যার নবাব **সুজাউদ্দৌলা** ও মুঘল সম্রাট **দ্বিতীয় শাহ আলম**-এর সম্মিলিত বাহিনী; অন্যদিকে মেজর হেক্টর মুনরোর নেতৃত্বে ইংরেজ ইস্ট ইন্ডিয়া কোম্পানি।

**কারণ:**
- মীরকাশিম ইংরেজদের দস্তকের অপব্যবহার বন্ধ করতে দেশীয় বণিকদেরও শুল্ক মকুব করেন এবং রাজধানী মুর্শিদাবাদ থেকে মুঙ্গেরে সরিয়ে নেন। এতে ক্ষুব্ধ হয়ে ইংরেজরা যুদ্ধ ঘোষণা করে।

**ফলাফল:**
1. সম্মিলিত ভারতীয় বাহিনী ইংরেজদের কাছে পরাজিত হয়।
2. ১৭৬৫ সালে **এলাহাবাদের সন্ধি** স্বাক্ষরিত হয় এবং ইংরেজরা মুঘল সম্রাটের কাছ থেকে বাংলা, বিহার ও ওড়িশার **দেওয়ানি (রাজস্ব আদায়ের অধিকার)** লাভ করে।
3. এর ফলে বাংলায় **দ্বৈত শাসনব্যবস্থা** চালু হয় (যা ১৭৭২ সালে ওয়ারেন হেস্টিংস বাতিল করেন)।`,
  },
  {
    id: 'hist-1857',
    subject: 'history',
    subjectLabel: 'ইতিহাস',
    classes: 'Class 8–10',
    title: '১৮৫৭ সালের মহাবিদ্রোহ (সিপাহী বিদ্রোহ)',
    keywords: ['মহাবিদ্রোহ', 'সিপাহী বিদ্রোহ', '১৮৫৭', '1857', 'মঙ্গল পাণ্ডে', 'লক্ষ্মীবাঈ', 'নানাসাহেব'],
    answer: `**১৮৫৭ সালের মহাবিদ্রোহ (সিপাহী বিদ্রোহ)**

**প্রত্যক্ষ কারণ:**
ইংরেজ সেনাবাহিনীতে নতুন **এনফিল্ড রাইফেলের** টোটা দাঁত দিয়ে কাটতে হতো। গুজব ছড়ায় যে তাতে গরু ও শূকরের চর্বি মেশানো আছে। ২৯শে মার্চ ১৮৫৭ ব্যারাকপুরে **মঙ্গল পাণ্ডে** প্রথম বিদ্রোহ ঘোষণা করেন।

**অন্যান্য কারণ:**
- **রাজনৈতিক:** লর্ড ডালহৌসির স্বত্ববিলোপ নীতি (ঝাঁসি, সাতারা, নাগপুর দখল)।
- **অর্থনৈতিক:** কৃষকদের ওপর চড়া ভূমি-রাজস্ব ও দেশীয় কুটির শিল্পের ধ্বংস।
- **সামরিক:** ভারতীয় সিপাহীদের কম বেতন ও পদোন্নতিতে বৈষম্য।

**প্রধান নেতৃবৃন্দ:**
- দিল্লি: বাহাদুর শাহ জাফর | কানপুর: নানাসাহেব ও তাঁতিয়া তোপি | ঝাঁসি: রানি লক্ষ্মীবাঈ | লখনউ: বেগম হজরত মহল | বিহার: কুনওয়ার সিং।

**ফলাফল:**
1. ১৮৫৮ সালে **মহারানির ঘোষণাপত্র** জারি হয় এবং ভারতে ইস্ট ইন্ডিয়া কোম্পানির শাসনের অবসান ঘটে সরাসরি **ব্রিটিশ ক্রাউনের** শাসন শুরু হয়।
2. স্বত্ববিলোপ নীতি বাতিল করা হয় এবং ভারতের গভর্নর-জেনারেলকে **ভাইসরয়** উপাধি দেওয়া হয় (প্রথম ভাইসরয়: লর্ড ক্যানিং)।`,
  },
  {
    id: 'hist-renaissance',
    subject: 'history',
    subjectLabel: 'ইতিহাস',
    classes: 'Class 9–10',
    title: 'বাংলার নবজাগরণ — রাজা রামমোহন রায় ও ঈশ্বরচন্দ্র বিদ্যাসাগর',
    keywords: ['নবজাগরণ', 'রামমোহন', 'বিদ্যাসাগর', 'সতীদাহ', 'বিধবাবিবাহ', 'ব্রাহ্মসমাজ'],
    answer: `**উনিশ শতকে বাংলার নবজাগরণ ও সমাজ সংস্কার**

**১. রাজা রামমোহন রায় (ভারতের প্রথম আধুনিক মানুষ):**
- ১৮১৫ সালে **আত্মীয় সভা** এবং ১৮২৮ সালে **ব্রাহ্মসভা** (পরে ব্রাহ্মসমাজ) প্রতিষ্ঠা করেন।
- তাঁর নিরলস আন্দোলনেই ১৮২৯ সালে লর্ড উইলিয়াম বেন্টিঙ্ক আইন করে **সতীদাহ প্রথা** নিষিদ্ধ করেন।
- তিনি পাশ্চাত্য শিক্ষার প্রসার, সংবাদপত্রের স্বাধীনতা ও নারী অধিকারের পক্ষে সংগ্রাম করেন।

**২. ঈশ্বরচন্দ্র বিদ্যাসাগর:**
- নারীশিক্ষা প্রসারে বাংলায় ৩৫টি বালিকা বিদ্যালয় স্থাপন করেন এবং বেথুন স্কুলের সম্পাদক হিসেবে কাজ করেন।
- তাঁর প্রচেষ্টাতেই ১৮৫৬ সালে লর্ড ডালহৌসি **বিধবাবিবাহ আইন** পাস করেন।
- বাংলা গদ্যের জনক হিসেবে তিনি **বর্ণপরিচয়**, কথামালা, বোধোদয় প্রভৃতি গ্রন্থ রচনা করেন।`,
  },
  {
    id: 'phy-newton',
    subject: 'physical_science',
    subjectLabel: 'ভৌত বিজ্ঞান',
    classes: 'Class 7–9',
    title: 'নিউটনের গতির তিনটি সূত্র ও উদাহরণ',
    keywords: ['নিউটন', 'গতির সূত্র', 'newton', 'জড়তা', 'ভরবেগ', 'তৃতীয় সূত্র', 'f=ma'],
    answer: `**নিউটনের গতির তিনটি সূত্র**

**১. প্রথম সূত্র (জড়তার সূত্র):**
বাইরে থেকে কোনো বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং সচল বস্তু চিরকাল সমবেগে সরলরেখায় চলতে থাকবে।
- *উদাহরণ:* চলন্ত বাস হঠাৎ ব্রেক কষলে যাত্রীরা গতিজড়তার কারণে সামনের দিকে ঝুঁকে পড়েন।

**২. দ্বিতীয় সূত্র (বলের পরিমাপ):**
কোনো বস্তুর ভরবেগের পরিবর্তনের হার বস্তুটির ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে ভরবেগের পরিবর্তনও সেদিকে ঘটে।
- *গাণিতিক রূপ:* **F = m × a** (বল = ভর × ত্বরণ)। SI একক: **নিউটন (N)**।

**৩. তৃতীয় সূত্র (ক্রিয়া-প্রতিক্রিয়া সূত্র):**
প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীতমুখী প্রতিক্রিয়া আছে।
- *উদাহরণ:* নৌকা থেকে লাফিয়ে পাড়ে নামার সময় নৌকা পিছনে সরে যায়; রকেট জ্বালানি গ্যাস নিচে ছুড়ে ওপরের দিকে ওঠে।`,
  },
  {
    id: 'phy-ohm',
    subject: 'physical_science',
    subjectLabel: 'ভৌত বিজ্ঞান',
    classes: 'Class 10',
    title: 'ওহমের সূত্র, রোধ ও তড়িৎ ক্ষমতা (Ohm’s Law)',
    keywords: ['ওহম', 'ওহমের সূত্র', 'ohm', 'রোধ', 'ভোল্ট', 'অ্যাম্পিয়ার', 'v=ir', 'তড়িৎ'],
    answer: `**ওহমের সূত্র (Ohm’s Law)**

**সূত্র:** উষ্ণতা ও অন্যান্য ভৌত অবস্থা অপরিবর্তিত থাকলে কোনো পরিবাহীর মধ্য দিয়ে তড়িৎপ্রবাহ মাত্রা (I) ওই পরিবাহীর দুই প্রান্তের বিভবপ্রভেদের (V) সমানুপাতিক।

**গাণিতিক রূপ:**
- **V = I × R**
- এখানে: **V** = বিভবপ্রভেদ (একক: ভোল্ট, V), **I** = তড়িৎপ্রবাহ মাত্রা (একক: অ্যাম্পিয়ার, A), **R** = পরিবাহীর রোধ (একক: ওহম, Ω)।

**রোধের সমবায়:**
1. **শ্রেণি সমবায়:** R = R₁ + R₂ + R₃ (তুল্য রোধ বাড়ে)।
2. **সমান্তরাল সমবায়:** 1/R = 1/R₁ + 1/R₂ + 1/R₃ (বাড়ির ওয়্যারিংয়ে ব্যবহৃত হয়)।

**তড়িৎ ক্ষমতা ও BOT ইউনিট:**
- ক্ষমতা **P = V × I = I²R = V²/R** (একক: ওয়াট, W)।
- **1 BOT (Unit) = 1 kWh = 1000 ওয়াট × 1 ঘণ্টা**।`,
  },
  {
    id: 'phy-boyle-charles',
    subject: 'physical_science',
    subjectLabel: 'ভৌত বিজ্ঞান',
    classes: 'Class 10',
    title: 'বয়েল ও চার্লসের সূত্র এবং আদর্শ গ্যাস সমীকরণ',
    keywords: ['বয়েল', 'চার্লস', 'আদর্শ গ্যাস', 'pv=nrt', 'boyle', 'charles', 'গ্যাস'],
    answer: `**গ্যাসের আচরণ — বয়েল ও চার্লসের সূত্র**

**১. বয়েলের সূত্র (স্থির উষ্ণতায়):**
স্থির উষ্ণতায় নির্দিষ্ট ভরের কোনো গ্যাসের আয়তন (V) ওই গ্যাসের চাপের (P) সাথে ব্যস্তানুপাতে পরিবর্তিত হয়।
- **P₁V₁ = P₂V₂ = ধ্রুবক**

**২. চার্লসের সূত্র (স্থির চাপে):**
স্থির চাপে নির্দিষ্ট ভরের কোনো গ্যাসের আয়তন প্রতি 1°C উষ্ণতা বৃদ্ধি বা হ্রাসে 0°C উষ্ণতায় তার আয়তনের 1/273 অংশ বৃদ্ধি বা হ্রাস পায়।
- পরম স্কেলে (কেলভিন, T): **V₁ / T₁ = V₂ / T₂** (যেখানে T = t + 273 K এবং পরম শূন্য উষ্ণতা = -273°C বা 0 K)।

**৩. আদর্শ গ্যাস সমীকরণ:**
- **PV = nRT**
- এখানে n = মোল সংখ্যা, R = সর্বজনীন গ্যাস ধ্রুবক (8.314 J·mol⁻¹·K⁻¹)।`,
  },
  {
    id: 'phy-light',
    subject: 'physical_science',
    subjectLabel: 'ভৌত বিজ্ঞান',
    classes: 'Class 8–10',
    title: 'আলোর প্রতিফলন, প্রতিসরণ ও লেন্স',
    keywords: ['আলো', 'প্রতিফলন', 'প্রতিসরণ', 'লেন্স', 'উত্তল', 'অবতল', 'স্নেল', 'light'],
    answer: `**আলোর প্রতিফলন ও প্রতিসরণ**

**১. আলোর প্রতিফলনের সূত্র:**
- আপতিত রশ্মি, প্রতিফলিত রশ্মি ও অভিলম্ব একই সমতলে থাকে।
- আপতন কোণ (i) = প্রতিফলন কোণ (r)।

**২. আলোর প্রতিসরণ ও স্নেলের সূত্র:**
আলো এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে তির্যকভাবে প্রবেশ করলে তার দিক পরিবর্তিত হয়।
- **স্নেলের সূত্র:** sin i / sin r = μ (প্রতিসরাঙ্ক, ধ্রুবক)।

**৩. উত্তল ও অবতল লেন্সের ব্যবহার:**
- **উত্তল লেন্স (অভিসারী):** দীর্ঘদৃষ্টি (Hypermetropia) দূর করতে, বিবর্ধক কাচে ও ক্যামেরায় ব্যবহৃত হয়।
- **অবতল লেন্স (অপসারী):** হ্রস্বদৃষ্টি (Myopia) বা দূরের জিনিস ঝাপসা দেখা দূর করতে চশমায় ব্যবহৃত হয়।`,
  },
  {
    id: 'phy-acid-base',
    subject: 'physical_science',
    subjectLabel: 'ভৌত বিজ্ঞান',
    classes: 'Class 7–10',
    title: 'অ্যাসিড, ক্ষার, লবণ ও pH স্কেল',
    keywords: ['অ্যাসিড', 'ক্ষার', 'লবণ', 'ph', 'acid', 'base', 'প্রশমন'],
    answer: `**অ্যাসিড, ক্ষার ও লবণ**

**১. অ্যাসিড (Acid):**
- জলীয় দ্রবণে **H⁺ আয়ন** উৎপন্ন করে, স্বাদে টক এবং **নীল লিটমাসকে লাল** করে।
- উদাহরণ: হাইড্রোক্লোরিক অ্যাসিড (HCl), সালফিউরিক অ্যাসিড (H₂SO₄), নাইট্রিক অ্যাসিড (HNO₃)।

**২. ক্ষার (Base / Alkali):**
- জলীয় দ্রবণে **OH⁻ আয়ন** উৎপন্ন করে, স্বাদে কষা/তিক্ত এবং **লাল লিটমাসকে নীল** করে।
- উদাহরণ: সোডিয়াম হাইড্রক্সাইড (NaOH), পটাশিয়াম হাইড্রক্সাইড (KOH)।

**৩. প্রশমন বিক্রিয়া:**
অ্যাসিড + ক্ষার → লবণ + জল।
- উদাহরণ: **HCl + NaOH → NaCl + H₂O**

**৪. pH স্কেল (0 থেকে 14):**
- pH < 7 → আম্লিক (Acidic)
- pH = 7 → প্রশম (যেমন বিশুদ্ধ জল)
- pH > 7 → ক্ষারীয় (Basic)`,
  },
  {
    id: 'bio-photosynthesis',
    subject: 'life_science',
    subjectLabel: 'জীবন বিজ্ঞান',
    classes: 'Class 7–10',
    title: 'সালোকসংশ্লেষ (Photosynthesis) — ধাপ, সমীকরণ ও গুরুত্ব',
    keywords: ['সালোকসংশ্লেষ', 'photosynthesis', 'ক্লোরোফিল', 'অক্সিজেন', 'গ্লুকোজ', 'উদ্ভিদ'],
    answer: `**সালোকসংশ্লেষ (Photosynthesis)**

**সংজ্ঞা:**
যে শারীরবৃত্তীয় প্রক্রিয়ায় সবুজ উদ্ভিদ সূর্যালোক ও **ক্লোরোফিলের** উপস্থিতিতে মাটি থেকে শোষিত জল (H₂O) এবং বায়ুমণ্ডলের কার্বন ডাই-অক্সাইড (CO₂)-এর রাসায়নিক বিক্রিয়ায় **গ্লুকোজ (C₆H₁₂O₆)** জাতীয় খাদ্য তৈরি করে এবং উপজাত হিসেবে **অক্সিজেন (O₂)** ত্যাগ করে, তাকে সালোকসংশ্লেষ বলে।

**রাসায়নিক সমীকরণ:**
**6CO₂ + 12H₂O —(সূর্যালোক ও ক্লোরোফিল)→ C₆H₁₂O₆ + 6O₂↑ + 6H₂O**

**প্রধান দুটি দশা:**
1. **আলোক দশা (Light Phase):** ক্লোরোপ্লাস্টের **গ্রানা** অঞ্চলে ঘটে। সূর্যালোকের সাহায্যে জলের ফটোলাইসিস হয়ে অক্সিজেন মুক্ত হয় এবং ATP ও NADPH তৈরি হয়।
2. **অন্ধকার দশা (Dark Phase / কেলভিন চক্র):** ক্লোরোপ্লাস্টের **স্ট্রোমা** অঞ্চলে ঘটে। এতে CO₂ বিজারিত হয়ে গ্লুকোজ তৈরি হয়।

**গুরুত্ব:**
- পৃথিবীর সমস্ত জীবের জন্য প্রত্যক্ষ বা পরোক্ষ খাদ্য ও শক্তি জোগান দেয়।
- বায়ুমণ্ডলে অক্সিজেন (O₂) ও কার্বন ডাই-অক্সাইড (CO₂)-এর ভারসাম্য বজায় রাখে।`,
  },
  {
    id: 'bio-cell',
    subject: 'life_science',
    subjectLabel: 'জীবন বিজ্ঞান',
    classes: 'Class 8–10',
    title: 'কোষ বিভাজন — মাইটোসিস ও মিয়োসিসের পার্থক্য',
    keywords: ['কোষ', 'মাইটোসিস', 'মিয়োসিস', 'mitosis', 'meiosis', 'ক্রোমোজোম', 'কোষ বিভাজন'],
    answer: `**কোষ বিভাজন — মাইটোসিস ও মিয়োসিস**

**১. মাইটোসিস (সমবিভাজন):**
- দেহকোষে ঘটে।
- একটি মাতৃকোষ (2n) বিভাজিত হয়ে **২টি সমান অপত্য কোষ (2n)** তৈরি করে।
- ক্রোমোজোম সংখ্যা অপরিবর্তিত থাকে।
- **দশাগুলি:** প্রোফেজ → মেটাফেজ → অ্যানাফেজ → টেলোফেজ (এরপর সাইটোকাইনেসিস)।
- **গুরুত্ব:** জীবদেহের বৃদ্ধি ও ক্ষয়পূরণ ঘটায়।

**২. মিয়োসিস (হ্রাস বিভাজন):**
- জনন মাতৃকোষে (শুক্রাশয় ও ডিম্বাশয়ে) ঘটে।
- একটি মাতৃকোষ (2n) বিভাজিত হয়ে **৪টি হ্যাপ্লয়েড অপত্য কোষ (n)** তৈরি করে।
- ক্রোমোজোম সংখ্যা অর্ধেক হয়ে যায় এবং **ক্রসিং ওভার** ঘটে, ফলে নতুন বৈশিষ্ট্য ও প্রকরণ সৃষ্টি হয়।`,
  },
  {
    id: 'bio-nervous',
    subject: 'life_science',
    subjectLabel: 'জীবন বিজ্ঞান',
    classes: 'Class 10',
    title: 'স্নায়ুতন্ত্র, নিউরন ও প্রতিবর্ত ক্রিয়া (Reflex Action)',
    keywords: ['স্নায়ু', 'নিউরন', 'প্রতিবর্ত', 'মস্তিষ্ক', 'হরমোন', 'reflex', 'neuron'],
    answer: `**স্নায়ুতন্ত্র ও প্রতিবর্ত ক্রিয়া**

**১. নিউরন (স্নায়ুতন্ত্রের গঠনগত ও কার্যগত একক):**
- প্রধান দুটি অংশ: **কোষদেহ (Cell body)** এবং **প্রবর্ধক (ডেনড্রন ও অ্যাক্সন)**।
- দুটি নিউরনের সংযোগস্থলকে **সাইন্যাপ্স (প্রান্তসন্নিকর্ষ)** বলে।

**২. প্রতিবর্ত ক্রিয়া (Reflex Action):**
বাহ্যিক উদ্দীপনার প্রভাবে মস্তিষ্কের সরাসরি নির্দেশ ছাড়াই **সুষুম্নাকাণ্ড** দ্বারা নিয়ন্ত্রিত স্বতঃস্ফূর্ত ও তাৎক্ষণিক প্রতিক্রিয়াকে প্রতিবর্ত ক্রিয়া বলে।
- *উদাহরণ:* গরম বস্তুতে হাত লাগলে সাথে সাথে হাত সরিয়ে নেওয়া; চোখে হঠাৎ আলো পড়লে চোখের পাতা বন্ধ হয়ে যাওয়া।
- *প্রতিবর্ত পথ:* গ্রাহক → সংজ্ঞাবহ স্নায়ু → সুষুম্নাকাণ্ড → আজ্ঞাবহ স্নায়ু → কারক (পেশি)।`,
  },
  {
    id: 'bio-genetics',
    subject: 'life_science',
    subjectLabel: 'জীবন বিজ্ঞান',
    classes: 'Class 10',
    title: 'মেন্ডেলের বংশগতির সূত্র (একসংকর ও দ্বিসংকর জনন)',
    keywords: ['মেন্ডেল', 'বংশগতি', 'একসংকর', 'দ্বিসংকর', 'জিন', 'mendel', 'genetics'],
    answer: `**মেন্ডেলের বংশগতির সূত্র**

গ্রেগর জোহান মেন্ডেলকে **বংশগতিবিদ্যার জনক** বলা হয়। তিনি মটরগাছ (Pisum sativum) নিয়ে পরীক্ষা করেন।

**১. একসংকর জনন (Monohybrid Cross) — পৃথকীভবনের সূত্র:**
একজোড়া বিপরীত বৈশিষ্ট্যের (যেমন বিশুদ্ধ লম্বা TT × বিশুদ্ধ বেঁটে tt) মধ্যে সংকরায়ণ।
- F₁ জনুতে সব গাছ সংকর লম্বা (Tt) হয়।
- F₂ জনুতে **ফিনোটাইপ অনুপাত = 3 : 1** (৩টি লম্বা : ১টি বেঁটে) এবং **জিনোটাইপ অনুপাত = 1 : 2 : 1** (TT : Tt : tt)।

**২. দ্বিসংকর জনন (Dihybrid Cross) — স্বাধীন বিন্যাসের সূত্র:**
দুইজোড়া বিপরীত বৈশিষ্ট্যের (হলুদ-গোল × সবুজ-কুঞ্চিত) মধ্যে সংকরায়ণ।
- F₂ জনুতে **ফিনোটাইপ অনুপাত = 9 : 3 : 3 : 1**।`,
  },
  {
    id: 'geo-river',
    subject: 'geography',
    subjectLabel: 'ভূগোল',
    classes: 'Class 8–10',
    title: 'নদীর কাজ — ক্ষয়, বহন ও সঞ্চয়জাত ভূমিরূপ',
    keywords: ['নদী', 'বদ্বীপ', 'জলপ্রপাত', 'গিরিখাত', 'প্লাবনভূমি', 'ভূগোল', 'river'],
    answer: `**নদীর তিন প্রবাহ ও প্রধান ভূমিরূপ**

**১. উচ্চগতি (ক্ষয়কাজ প্রধান):**
পর্বতের খাড়া ঢালে নদীর স্রোত প্রবল থাকায় নিম্নক্ষয় বেশি হয়।
- *ভূমিরূপ:* V-আকৃতির উপত্যকা, **গিরিখাত ও ক্যানিয়ন**, জলপ্রপাত (যেমন জোগ জলপ্রপাত), মন্থকূপ।

**২. মধ্যগতি (বহন ও পার্শ্বক্ষয় প্রধান):**
সমভূমিতে ঢাল কমে যাওয়ায় নদী এঁকেবেঁকে চলে।
- *ভূমিরূপ:* নদীবাঁক (মিয়েন্ডার), অশ্বক্ষুরাকৃতি হ্রদ, প্লাবনভূমি ও পলল শঙ্কু।

**৩. নিম্নগতি (সঞ্চয়কাজ প্রধান):**
মোহনার কাছে নদীর গতিবেগ খুব কমে যায় এবং পলি জমা হয়।
- *ভূমিরূপ:* **বদ্বীপ (Delta)** (যেমন গঙ্গা-ব্রহ্মপুত্রের সুন্দরবন পৃথিবীর বৃহত্তম বদ্বীপ), খাঁড়ি ও স্বাভাবিক বাঁধ।`,
  },
  {
    id: 'geo-wb',
    subject: 'geography',
    subjectLabel: 'ভূগোল',
    classes: 'Class 7–10',
    title: 'পশ্চিমবঙ্গের ভূ-প্রকৃতি, নদ-নদী ও জলবায়ু',
    keywords: ['পশ্চিমবঙ্গ', 'সুন্দরবন', 'গঙ্গা', 'তিস্তা', 'দামোদর', 'মৌসুমি', 'west bengal'],
    answer: `**পশ্চিমবঙ্গের ভূগোল (সংক্ষিপ্ত নোটস)**

**১. ভূ-প্রাকৃতিক বিভাগ:**
- **উত্তরের পার্বত্য অঞ্চল:** দার্জিলিং ও কালিম্পং (সর্বোচ্চ শৃঙ্গ: **সান্দাকফু**, ৩৬৩৬ মিটার)।
- **পশ্চিমের মালভূমি অঞ্চল:** পুরুলিয়া, বাঁকুড়া, পশ্চিম মেদিনীপুর (সর্বোচ্চ শৃঙ্গ: গোরগাবুরু, অযোধ্যা পাহাড়)।
- **সমভূমি অঞ্চল:** তরাই-ডুয়ার্স, রাঢ় সমভূমি, গাঙ্গেয় বদ্বীপ ও সুন্দরবন অঞ্চল।

**২. প্রধান নদ-নদী:**
- **উত্তরবঙ্গের বরফগলা নদী:** তিস্তা, তোর্সা, জলঢাকা, মহানন্দা।
- **দক্ষিণবঙ্গের প্রধান নদী:** ভাগীরথী-হুগলি, দামোদর, অজয়, ময়ূরাক্ষী, কংসাবতী, রূপনারায়ণ।
- **সুন্দরবনের জোয়ার-ভাটার নদী:** মাতলা, বিদ্যাধরী, গোসাবা, রায়মঙ্গল।

**৩. জলবায়ু:** ক্রান্তীয় মৌসুমি জলবায়ু (গ্রীষ্মকালে **কালবৈশাখী** ও বর্ষায় দক্ষিণ-পশ্চিম মৌসুমি বায়ুর প্রভাবে প্রচুর বৃষ্টি হয়)।`,
  },
  {
    id: 'geo-atmosphere',
    subject: 'geography',
    subjectLabel: 'ভূগোল',
    classes: 'Class 9–10',
    title: 'বায়ুমণ্ডলের স্তরবিন্যাস ও বিশ্ব উষ্ণায়ন',
    keywords: ['বায়ুমণ্ডল', 'ট্রপোস্ফিয়ার', 'স্ট্র্যাটোস্ফিয়ার', 'ওজোন', 'বিশ্ব উষ্ণায়ন', 'গ্রিনহাউস'],
    answer: `**বায়ুমণ্ডলের প্রধান স্তরসমূহ**

1. **ট্রপোস্ফিয়ার (০–১৮ কিমি):** সর্বনিম্ন স্তর; মেঘ, বৃষ্টি, ঝড়-বজ্রপাত এখানেই ঘটে বলে একে **ক্ষুব্ধমণ্ডল** বলে। প্রতি ১ কিমি উচ্চতায় তাপমাত্রা ৬.৪°C কমে।
2. **স্ট্র্যাটোস্ফিয়ার (১৮–৫০ কিমি):** শান্ত স্তর (**শান্তমণ্ডল**), জেট বিমান চলাচল করে। এই স্তরেই **ওজোন স্তর (O₃)** থাকে যা সূর্যের ক্ষতিকর অতিবেগুনি রশ্মি শোষণ করে।
3. **মেসোস্ফিয়ার (৫০–৮০ কিমি):** সবচেয়ে শীতলতম স্তর; মহাকাশ থেকে আসা উল্কা এখানে পুড়ে ছাই হয়।
4. **থার্মোস্ফিয়ার / আয়নোস্ফিয়ার (৮০–৫০০ কিমি):** বেতার তরঙ্গ প্রতিফলিত হয় এবং মেরুজ্যোতি (Aurora) দেখা যায়।

**বিশ্ব উষ্ণায়ন (Global Warming):**
CO₂, CH₄, CFC প্রভৃতি গ্রিনহাউস গ্যাস বৃদ্ধির ফলে পৃথিবীর গড় তাপমাত্রা বাড়ছে। এর ফলে মেরু অঞ্চলের বরফ গলে সমুদ্রের জলতল বাড়ছে।`,
  },
  {
    id: 'math-algebra',
    subject: 'math',
    subjectLabel: 'গণিত',
    classes: 'Class 7–10',
    title: 'বীজগণিতের সমস্ত প্রয়োজনীয় সূত্র (Algebra Formulas)',
    keywords: ['বীজগণিত', 'সূত্র', 'algebra', 'formula', 'বর্গ', 'ঘন', 'উৎপাদক', 'শ্রীধর আচার্য'],
    answer: `**বীজগণিতের প্রয়োজনীয় সূত্রাবলি**

**বর্গের সূত্র (Square Formulas):**
1. (a + b)² = a² + 2ab + b²
2. (a - b)² = a² - 2ab + b²
3. a² - b² = (a + b)(a - b)
4. a² + b² = (a + b)² - 2ab = (a - b)² + 2ab
5. 4ab = (a + b)² - (a - b)²
6. (a + b + c)² = a² + b² + c² + 2(ab + bc + ca)

**ঘনের সূত্র (Cube Formulas):**
7. (a + b)³ = a³ + 3a²b + 3ab² + b³ = a³ + b³ + 3ab(a + b)
8. (a - b)³ = a³ - 3a²b + 3ab² - b³ = a³ - b³ - 3ab(a - b)
9. a³ + b³ = (a + b)(a² - ab + b²)
10. a³ - b³ = (a - b)(a² + ab + b²)

**দ্বিঘাত সমীকরণ (শ্রীধর আচার্যের সূত্র):**
ax² + bx + c = 0 হলে:
**x = (-b ± √(b² - 4ac)) / 2a**
*(অফলাইনে সমাধান পেতে চ্যাটে সরাসরি লিখুন যেমন: \`x^2 - 5x + 6 = 0\`)*`,
  },
  {
    id: 'math-mensuration',
    subject: 'math',
    subjectLabel: 'গণিত',
    classes: 'Class 8–10',
    title: 'পরিমিতি — ক্ষেত্রফল ও আয়তনের সূত্র (Mensuration)',
    keywords: ['পরিমিতি', 'ক্ষেত্রফল', 'আয়তন', 'বৃত্ত', 'গোলক', 'শঙ্কু', 'চোঙ', 'ঘনক', 'mensuration'],
    answer: `**পরিমিতির গুরুত্বপূর্ণ সূত্রাবলি (π ≈ 22/7 বা 3.1416)**

**দ্বিমাত্রিক চিত্র:**
- **আয়তক্ষেত্র:** ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ | পরিসীমা = 2(দৈর্ঘ্য + প্রস্থ)
- **বর্গক্ষেত্র:** ক্ষেত্রফল = বাহু² | কর্ণ = বাহু × √2
- **ত্রিভুজ:** ক্ষেত্রফল = ½ × ভূমি × উচ্চতা | সমবাহু ত্রিভুজ = (√3 / 4) × বাহু²
- **বৃত্ত:** পরিধি = 2πr | ক্ষেত্রফল = πr²

**ত্রিমাত্রিক ঘনবস্তু:**
- **আয়তঘন:** আয়তন = l × b × h | সমগ্রতলের ক্ষেত্রফল = 2(lb + bh + hl)
- **ঘনক:** আয়তন = a³ | সমগ্রতল = 6a² | কর্ণ = a√3
- **লম্ব বৃত্তাকার চোঙ (Cylinder):** আয়তন = πr²h | বক্রতল = 2πrh
- **লম্ব বৃত্তাকার শঙ্কু (Cone):** আয়তন = ⅓πr²h | বক্রতল = πrl (যেখানে l = √(r² + h²))
- **গোলক (Sphere):** আয়তন = (4/3)πr³ | সমগ্রতল = 4πr²`,
  },
  {
    id: 'math-trig',
    subject: 'math',
    subjectLabel: 'গণিত',
    classes: 'Class 10',
    title: 'ত্রিকোণমিতি — সূত্র ও আদর্শ কোণের মান (0° থেকে 90°)',
    keywords: ['ত্রিকোণমিতি', 'trigonometry', 'sin', 'cos', 'tan', 'পিথাগোরাস'],
    answer: `**ত্রিকোণমিতির মৌলিক সূত্র (Class 10 WBBSE)**

**অনুপাত (সমকোণী ত্রিভুজে):**
- sin θ = লম্ব / অতিভুজ | cosec θ = 1 / sin θ
- cos θ = ভূমি / অতিভুজ | sec θ = 1 / cos θ
- tan θ = লম্ব / ভূমি = sin θ / cos θ | cot θ = 1 / tan θ

**তিনটি অভেদ (Identities):**
1. **sin²θ + cos²θ = 1**
2. **sec²θ - tan²θ = 1**
3. **cosec²θ - cot²θ = 1**

**আদর্শ কোণের মান:**
- **0°:** sin = 0, cos = 1, tan = 0
- **30°:** sin = 1/2, cos = √3/2, tan = 1/√3
- **45°:** sin = 1/√2, cos = 1/√2, tan = 1
- **60°:** sin = √3/2, cos = 1/2, tan = √3
- **90°:** sin = 1, cos = 0, tan = অসংজ্ঞাত`,
  },
  {
    id: 'math-interest',
    subject: 'math',
    subjectLabel: 'গণিত',
    classes: 'Class 8–10',
    title: 'সরল সুদ, চক্রবৃদ্ধি সুদ ও লাভ-ক্ষতির সূত্র',
    keywords: ['সরল সুদ', 'চক্রবৃদ্ধি', 'সুদকষা', 'লাভ ক্ষতি', 'শতকরা', 'interest', 'profit'],
    answer: `**পাটিগণিতের প্রয়োজনীয় সূত্রাবলি**

**১. সরল সুদ (Simple Interest):**
- **I = (P × r × t) / 100**
- সুদ-আসল (A) = P + I
*(P = আসল, r = বার্ষিক সুদের হার %, t = সময় বছর)*

**২. চক্রবৃদ্ধি সুদ (Compound Interest):**
- সমূল চক্রবৃদ্ধি: **A = P(1 + r/100)ⁿ**
- চক্রবৃদ্ধি সুদ = A - P

**৩. লাভ ও ক্ষতি:**
- লাভ = বিক্রয়মূল্য - ক্রয়মূল্য | শতকরা লাভ = (লাভ / ক্রয়মূল্য) × 100
- ক্ষতি = ক্রয়মূল্য - বিক্রয়মূল্য | শতকরা ক্ষতি = (ক্ষতি / ক্রয়মূল্য) × 100`,
  },
  {
    id: 'ben-karok',
    subject: 'bengali',
    subjectLabel: 'বাংলা ব্যাকরণ ও রচনা',
    classes: 'Class 7–10',
    title: 'বাংলা কারক ও বিভক্তি (সহজ চেনার উপায়)',
    keywords: ['কারক', 'বিভক্তি', 'কর্তৃকারক', 'কর্মকারক', 'করণ', 'অপাদান', 'অধিকরণ', 'ব্যাকরণ'],
    answer: `**কারক ও বিভক্তি — সহজ মনে রাখার কৌশল**

ক্রিয়াপদকে নিচের প্রশ্নগুলো করলে সহজেই ৬ প্রকার কারক চেনা যায়:

1. **কর্তৃকারক:** ক্রিয়াকে **"কে / কারা"** দিয়ে প্রশ্ন করলে।
   - *উদাহরণ:* **রাম** বই পড়ে। (কে পড়ে? → রাম)
2. **কর্মকারক:** ক্রিয়াকে **"কী / কাকে"** দিয়ে প্রশ্ন করলে।
   - *উদাহরণ:* রাম **বই** পড়ে। (কী পড়ে? → বই)
3. **করণ কারক:** ক্রিয়াকে **"কীসের দ্বারা / কী দিয়ে"** প্রশ্ন করলে।
   - *উদাহরণ:* আমি **কলম দিয়ে** লিখি। (কী দিয়ে? → কলম)
4. **নিমিত্ত কারক:** ক্রিয়াকে **"কীসের জন্য / কার জন্য"** প্রশ্ন করলে।
   - *উদাহরণ:* **বেলা পড়ে এল, জলে** চল। / **তৃষ্ণার্তকে** জল দাও।
5. **অপাদান কারক:** **"কোথা থেকে"** বিচ্যুত, ভীত বা উৎপন্ন হলে।
   - *উদাহরণ:* **গাছ থেকে** পাতা পড়ে। / **তিল থেকে** তেল হয়।
6. **অধিকরণ কারক:** **"কোথায় / কখন"** (স্থান বা সময়) বোঝালে।
   - *উদাহরণ:* **আকাশে** পাখি ওড়ে। / **সকালে** সূর্য ওঠে।`,
  },
  {
    id: 'ben-samas',
    subject: 'bengali',
    subjectLabel: 'বাংলা ব্যাকরণ ও রচনা',
    classes: 'Class 8–10',
    title: 'সমাস — প্রকারভেদ ও মাধ্যমিকের গুরুত্বপূর্ণ উদাহরণ',
    keywords: ['সমাস', 'দ্বন্দ্ব', 'কর্মধারয়', 'তৎপুরুষ', 'বহুব্রীহি', 'দ্বিগু', 'অব্যয়ীভাব'],
    answer: `**সমাস ও তার প্রধান ৬টি প্রকারভেদ**

অর্থসম্বন্ধ আছে এমন দুই বা ততোধিক পদের এক পদে মিলিত হওয়াকে **সমাস** বলে।

1. **দ্বন্দ্ব সমাস (উভয় পদ প্রধান):** মাতা ও পিতা = **মাতাপিতা**; ভাই ও বোন = **ভাইবোন**।
2. **তৎপুরুষ সমাস (পরপদ প্রধান, বিভক্তি লোপ):** বিদ্যায়ের আলয় = **বিদ্যালয়**; গাছ থেকে পাকা = **গাছপাকা**।
3. **কর্মধারয় সমাস (বিশেষণ + বিশেষ্য, পরপদ প্রধান):** নীল যে পদ্ম = **নীলপদ্ম**; সিংহ চিহ্নিত আসন = **সিংহাসন**; চাঁদের মতো মুখ = **চাঁদমুখ**।
4. **দ্বিগু সমাস (সংখ্যাবাচক পূর্বপদ + সমাহার):** ত্রি (তিন) ফলের সমাহার = **ত্রিফলা**; পঞ্চ বটের সমাহার = **পঞ্চবটী**।
5. **বহুব্রীহি সমাস (তৃতীয় অন্য অর্থ প্রধান):** দশ আনন যার = **দশানন** (রাবণ); বীণা পাণিতে যার = **বীণাপাণি** (সরস্বতী)।
6. **অব্যয়ীভাব সমাস (পূর্বপদ অব্যয় প্রধান):** কণ্ঠের সমীপে = **উপকণ্ঠ**; ভিক্ষার অভাব = **দুর্ভিক্ষ**।`,
  },
  {
    id: 'ben-essay-science',
    subject: 'bengali',
    subjectLabel: 'বাংলা ব্যাকরণ ও রচনা',
    classes: 'Class 8–10',
    title: 'বাংলা প্রবন্ধ রচনা — দৈনন্দিন জীবনে বিজ্ঞান',
    keywords: ['রচনা', 'দৈনন্দিন জীবনে বিজ্ঞান', 'প্রবন্ধ', 'বিজ্ঞান রচনা', 'essay'],
    answer: `**প্রবন্ধ রচনা: দৈনন্দিন জীবনে বিজ্ঞান**

**১. ভূমিকা:**
বর্তমান যুগ বিজ্ঞানের যুগ। সকাল থেকে রাত পর্যন্ত আমাদের প্রতিটি পদক্ষেপেই বিজ্ঞানের অবদান জড়িয়ে আছে। ঘুম ভাঙার অ্যালার্ম ঘড়ি থেকে শুরু করে রাতের বৈদ্যুতিক আলো — সবই বিজ্ঞানের দান।

**২. প্রাত্যহিক জীবনে বিজ্ঞানের অবদান:**
- **যোগাযোগ ও যাতায়াত:** রেলগাড়ি, বাস, উড়োজাহাজ, মোবাইল ফোন ও ইন্টারনেট গোটা পৃথিবীকে মানুষের হাতের মুঠোয় এনে দিয়েছে।
- **চিকিৎসা বিজ্ঞান:** এক্স-রে, অ্যান্টিবায়োটিক, টিকা ও আধুনিক অস্ত্রোপচার অসংখ্য প্রাণ রক্ষা করছে।
- **শিক্ষা ও কৃষি:** ছাপাখানা, কম্পিউটার ও স্মার্ট ক্লাসরুম শিক্ষার প্রসার ঘটিয়েছে; উন্নত সার ও সেচব্যবস্থা কৃষি উৎপাদন বাড়িয়েছে।

**৩. বিজ্ঞানের অপব্যবহার:**
যুদ্ধাস্ত্র, পরিবেশ দূষণ ও অতিরিক্ত মোবাইল আসক্তি বিজ্ঞানের ক্ষতিকর দিক। মনে রাখতে হবে, বিজ্ঞান নিজে ভালো বা মন্দ নয় — মানুষের ব্যবহারই তাকে কল্যাণকর বা ধ্বংসাত্মক করে তোলে।

**৪. উপসংহার:**
বিজ্ঞানকে মানবকল্যাণ, শান্তি ও পরিবেশ রক্ষার কাজে ব্যবহার করলেই সভ্যতার প্রকৃত জয় হবে।`,
  },
  {
    id: 'ben-letter',
    subject: 'bengali',
    subjectLabel: 'বাংলা ব্যাকরণ ও রচনা',
    classes: 'Class 5–10',
    title: 'প্রধান শিক্ষকের কাছে ছুটির আবেদনপত্র (ফরম্যাট)',
    keywords: ['আবেদনপত্র', 'চিঠি', 'ছুটি', 'প্রধান শিক্ষক', 'দরখাস্ত', 'letter'],
    answer: `**প্রধান শিক্ষকের কাছে অসুস্থতার কারণে ছুটির আবেদনপত্র**

মাননীয়
প্রধান শিক্ষক মহাশয়,
[তোমার বিদ্যালয়ের নাম]
[ঠিকানা]

**বিষয়:** অসুস্থতার কারণে তিন দিনের ছুটির আবেদন।

মহাশয়,
বিনীত নিবেদন এই যে, আমি আপনার বিদ্যালয়ের [তোমার শ্রেণি, যেমন অষ্টম] শ্রেণির একজন নিয়মিত ছাত্র/ছাত্রী (ক্রমিক সংখ্যা: [রোল নম্বর])। গত [তারিখ] থেকে প্রবল জ্বরে আক্রান্ত থাকায় আমি তিন দিন বিদ্যালয়ে উপস্থিত থাকতে পারিনি।

অতএব, মহাশয়ের নিকট আমার সনির্বন্ধ অনুরোধ, অনুগ্রহ করে আমাকে ওই তিন দিনের ছুটি মঞ্জুর করে বাধিত করবেন।

ইতি —
আপনার একান্ত অনুগত ছাত্র/ছাত্রী,
[তোমার নাম]
শ্রেণি: [শ্রেণি] | বিভাগ: [বিভাগ] | ক্রমিক সংখ্যা: [রোল]
তারিখ: [আজকের তারিখ]`,
  },
  {
    id: 'eng-tense',
    subject: 'english',
    subjectLabel: 'English Grammar',
    classes: 'Class 5–10',
    title: 'English Tense — ১২টি Tense-এর সহজ চার্ট ও উদাহরণ',
    keywords: ['tense', 'টেন্স', 'present', 'past', 'future', 'english grammar', 'verb'],
    answer: `**English Tense — সহজ নিয়ম ও উদাহরণ**

**১. Present Tense (বর্তমান কাল):**
- **Simple Present:** Subject + V1 (he/she/it হলে s/es) → *He reads a book.*
- **Present Continuous:** Subject + am/is/are + V-ing → *He is reading a book.*
- **Present Perfect:** Subject + have/has + V3 → *He has read the book.*
- **Present Perfect Continuous:** Subject + have/has been + V-ing → *He has been reading for two hours.*

**২. Past Tense (অতীত কাল):**
- **Simple Past:** Subject + V2 → *He read a book yesterday.*
- **Past Continuous:** Subject + was/were + V-ing → *He was reading a book.*
- **Past Perfect:** Subject + had + V3 → *The train had left before we reached.*
- **Past Perfect Continuous:** Subject + had been + V-ing → *He had been reading since morning.*

**৩. Future Tense (ভবিষ্যৎ কাল):**
- **Simple Future:** Subject + shall/will + V1 → *He will read a book.*
- **Future Continuous:** Subject + will be + V-ing → *He will be reading.*
- **Future Perfect:** Subject + will have + V3 → *He will have finished the work.*`,
  },
  {
    id: 'eng-voice',
    subject: 'english',
    subjectLabel: 'English Grammar',
    classes: 'Class 7–10',
    title: 'Voice Change (Active to Passive) — নিয়ম ও উদাহরণ',
    keywords: ['voice', 'voice change', 'active', 'passive', 'ভয়েস'],
    answer: `**Voice Change (Active → Passive) এর সহজ নিয়ম**

**মূল সূত্র:** Object-কে Subject বানাও + Tense অনুযায়ী Be-verb + **Verb-এর V3 (Past Participle)** + **by** + Subject-এর Object রূপ।

**Tense অনুযায়ী উদাহরণ:**
1. **Simple Present:** *Rina writes a letter.* → **A letter is written by Rina.**
2. **Present Continuous:** *He is playing football.* → **Football is being played by him.**
3. **Present Perfect:** *She has done the work.* → **The work has been done by her.**
4. **Simple Past:** *They built a bridge.* → **A bridge was built by them.**
5. **Simple Future:** *I will help you.* → **You will be helped by me.**
6. **Imperative (আদেশ):** *Open the door.* → **Let the door be opened.**
7. **Modal Verb:** *We must obey rules.* → **Rules must be obeyed by us.**`,
  },
  {
    id: 'eng-narration',
    subject: 'english',
    subjectLabel: 'English Grammar',
    classes: 'Class 8–10',
    title: 'Narration Change (Direct to Indirect Speech)',
    keywords: ['narration', 'direct', 'indirect', 'speech', 'নারেশন'],
    answer: `**Narration Change (Direct → Indirect Speech)**

**Reporting Verb Past Tense হলে Tense পরিবর্তন:**
- Simple Present → Simple Past (*am/is/are → was/were*)
- Present Continuous → Past Continuous
- Present Perfect → Past Perfect (*have/has → had*)
- Simple Past → Past Perfect
- *will → would, can → could, may → might*
- *today → that day, tomorrow → the next day, yesterday → the previous day*

**উদাহরণ:**
1. **Assertive:** He said, "I am busy." → **He said that he was busy.**
2. **Interrogative (Yes/No):** She asked me, "Do you like tea?" → **She asked me if I liked tea.**
3. **Interrogative (Wh):** He said to me, "Where do you live?" → **He asked me where I lived.**
4. **Imperative:** The teacher said, "Work hard." → **The teacher advised us to work hard.**
5. **Universal Truth (বদলায় না):** He said, "The sun rises in the east." → **He said that the sun rises in the east.**`,
  },
];

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

function normalizeMathText(input: string): string {
  return input
    .replace(/[০-৯]/g, (ch) => BENGALI_DIGITS[ch] ?? ch)
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/²/g, '^2')
    .trim();
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return 'অসংজ্ঞাত';
  const rounded = Math.round(n * 1e6) / 1e6;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function evaluateArithmeticExpression(expr: string): number | null {
  const cleaned = expr.replace(/\s+/g, '');
  if (!cleaned || !/^[0-9+\-*/().^]+$/.test(cleaned)) return null;
  if (!/\d/.test(cleaned)) return null;

  let pos = 0;

  const peek = () => cleaned[pos] ?? '';
  const consume = () => cleaned[pos++] ?? '';

  function parseExpression(): number {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parsePower();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parsePower();
      if (op === '/') {
        if (right === 0) throw new Error('DIV_ZERO');
        left /= right;
      } else {
        left *= right;
      }
    }
    return left;
  }

  function parsePower(): number {
    const base = parseUnary();
    if (peek() === '^') {
      consume();
      const exp = parsePower();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parseUnary(): number {
    if (peek() === '+') {
      consume();
      return parseUnary();
    }
    if (peek() === '-') {
      consume();
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    if (peek() === '(') {
      consume();
      const val = parseExpression();
      if (peek() !== ')') throw new Error('MISMATCH_PAREN');
      consume();
      return val;
    }
    const start = pos;
    while (/[0-9.]/.test(peek())) {
      consume();
    }
    const numStr = cleaned.slice(start, pos);
    if (!numStr || numStr === '.') throw new Error('INVALID_NUM');
    const val = Number(numStr);
    if (!Number.isFinite(val)) throw new Error('INVALID_NUM');
    return val;
  }

  try {
    const result = parseExpression();
    if (pos !== cleaned.length || !Number.isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

export function solveOfflineMath(rawQuery: string): string | null {
  const normalized = normalizeMathText(rawQuery);

  const quadMatch = normalized
    .replace(/\s+/g, '')
    .match(/^([+-]?\d*\.?\d*)x\^2([+-]\d*\.?\d*x)?([+-]\d+\.?\d*)?=0$/i);
  if (quadMatch) {
    const parseCoeff = (raw: string | undefined, defaultVal: number): number => {
      if (!raw) return defaultVal;
      const stripped = raw.replace(/x$/i, '');
      if (stripped === '' || stripped === '+') return 1;
      if (stripped === '-') return -1;
      return Number(stripped);
    };
    const a = parseCoeff(quadMatch[1], 1);
    const b = quadMatch[2] ? parseCoeff(quadMatch[2], 0) : 0;
    const c = quadMatch[3] ? Number(quadMatch[3]) : 0;

    if (a !== 0 && Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
      const disc = b * b - 4 * a * c;
      if (disc < 0) {
        return `**দ্বিঘাত সমীকরণের সমাধান (অফলাইন গণিত সলভার)**\n\nসমীকরণ: \`${normalized}\`\n- a = ${a}, b = ${b}, c = ${c}\n- নিরূপক (D) = b² - 4ac = ${formatNumber(disc)} < 0\n\n**সিদ্ধান্ত:** নিরূপক ঋণাত্মক হওয়ায় এই সমীকরণের কোনো **বাস্তব বীজ নেই**।`;
      }
      const sqrtD = Math.sqrt(disc);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      return `**দ্বিঘাত সমীকরণের সমাধান (অফলাইন গণিত সলভার)**\n\nসমীকরণ: \`${normalized}\`\n1. সহগসমূহ: a = ${a}, b = ${b}, c = ${c}\n2. নিরূপক (D) = b² - 4ac = (${b})² - 4×(${a})×(${c}) = **${formatNumber(disc)}**\n3. শ্রীধর আচার্যের সূত্র: x = (-b ± √D) / 2a\n\n**উত্তর:**\n- **x₁ = ${formatNumber(x1)}**\n- **x₂ = ${formatNumber(x2)}**`;
    }
  }

  const sqrtMatch = normalized.match(/(?:sqrt|বর্গমূল|√)\s*\(?\s*(\d+(?:\.\d+)?)\s*\)?/i);
  if (sqrtMatch) {
    const num = Number(sqrtMatch[1]);
    if (Number.isFinite(num) && num >= 0) {
      const root = Math.sqrt(num);
      return `**বর্গমূল নির্ণয় (অফলাইন গণিত সলভার)**\n\n- √${num} = **${formatNumber(root)}**\n- যাচাই: ${formatNumber(root)} × ${formatNumber(root)} ≈ ${formatNumber(root * root)}`;
    }
  }

  const pctMatch1 = normalized.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|এর)\s*(\d+(?:\.\d+)?)/i);
  const pctMatch2 = normalized.match(/(\d+(?:\.\d+)?)\s*এর\s*(\d+(?:\.\d+)?)\s*%/i);
  if (pctMatch1 || pctMatch2) {
    const pct = Number(pctMatch1 ? pctMatch1[1] : pctMatch2![2]);
    const total = Number(pctMatch1 ? pctMatch1[2] : pctMatch2![1]);
    if (Number.isFinite(pct) && Number.isFinite(total)) {
      const val = (pct / 100) * total;
      return `**শতকরা হিসাব (অফলাইন গণিত সলভার)**\n\n- ${total}-এর ${pct}% = (${pct} / 100) × ${total}\n- **উত্তর: ${formatNumber(val)}**`;
    }
  }

  const strippedPrefix = normalized
    .replace(/^(?:solve|calculate|compute|হিসাব|সমাধান|মান নির্ণয়|কত হয়)[:\s]*/i, '')
    .replace(/[=?]+$/g, '')
    .trim();

  if (/[+\-*/^]/.test(strippedPrefix)) {
    const val = evaluateArithmeticExpression(strippedPrefix);
    if (val !== null) {
      return `**গাণিতিক সমাধান (অফলাইন গণিত সলভার)**\n\n- প্রদত্ত রাশি: \`${strippedPrefix}\`\n- **উত্তর: ${formatNumber(val)}**`;
    }
  }

  return null;
}

function normalizeQuestionText(text: string): string {
  return text
    .trim()
    .normalize('NFC')
    .replace(/য়/g, 'য়')
    .replace(/ড়/g, 'ড়')
    .replace(/ঢ়/g, 'ঢ়')
    .replace(/[।?!,.;:'"()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function loadCachedTeacherAnswers(): CachedTeacherAnswer[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(OFFLINE_TEACHER_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CachedTeacherAnswer =>
        Boolean(item) &&
        typeof item.question === 'string' &&
        typeof item.answer === 'string',
    );
  } catch {
    return [];
  }
}

export function saveOfflineTeacherAnswer(
  question: string,
  answer: string,
  className: ClassLevel,
): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const q = question.trim();
    const a = answer.trim();
    if (!q || !a || a.length < 20) return;

    const existing = loadCachedTeacherAnswers();
    const normQ = normalizeQuestionText(q);
    const filtered = existing.filter((item) => normalizeQuestionText(item.question) !== normQ);
    const next: CachedTeacherAnswer[] = [
      { question: q.slice(0, 300), answer: a.slice(0, 12000), className, createdAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_CACHED_ANSWERS);
    localStorage.setItem(OFFLINE_TEACHER_CACHE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors
  }
}

export function answerOfflineQuestion(
  question: string,
  className: ClassLevel,
  hasImage = false,
): { answer: string; matchedTopicTitle?: string } {
  const cleanQ = question.trim();

  if (hasImage && !cleanQ) {
    return {
      answer:
        '**অফলাইন মোড:** ছবি পড়ে সমাধান (Photo OCR) করার জন্য ইন্টারনেট প্রয়োজন।\n\nতবে আপনি এখনই **অফলাইন নোটস** বাটনে ক্লিক করে ৭টি বিষয়ের নোটস পড়তে পারেন অথবা সরাসরি অঙ্ক বা প্রশ্ন লিখে উত্তর পেতে পারেন।',
    };
  }

  const mathSolved = solveOfflineMath(cleanQ);
  if (mathSolved) {
    return {
      answer: `${mathSolved}\n\n---\n*অফলাইন গণিত সলভার (${className}) — ইন্টারনেট ছাড়াই সমাধান*`,
      matchedTopicTitle: 'অফলাইন গণিত সলভার',
    };
  }

  const normQ = normalizeQuestionText(cleanQ);
  const queryTokens = normQ.split(' ').filter((w) => w.length >= 2);

  const cached = loadCachedTeacherAnswers();
  let bestCached: { item: CachedTeacherAnswer; score: number } | null = null;
  for (const item of cached) {
    const normItem = normalizeQuestionText(item.question);
    if (normItem === normQ) {
      return {
        answer: `${item.answer}\n\n---\n*আপনার ফোনে সেভ করা উত্তর (${item.className}) — ইন্টারনেট ছাড়াই পঠনযোগ্য*`,
        matchedTopicTitle: item.question,
      };
    }
    if (queryTokens.length > 0) {
      let hits = 0;
      for (const tok of queryTokens) {
        if (normItem.includes(tok)) hits += 1;
      }
      const ratio = hits / queryTokens.length;
      if (hits >= 2 && ratio >= 0.5 && (!bestCached || ratio > bestCached.score)) {
        bestCached = { item, score: ratio };
      }
    }
  }

  if (bestCached) {
    return {
      answer: `${bestCached.item.answer}\n\n---\n*আপনার ফোনে সেভ করা উত্তর (${bestCached.item.className}) — ইন্টারনেট ছাড়াই পঠনযোগ্য*`,
      matchedTopicTitle: bestCached.item.question,
    };
  }

  let bestTopic: { topic: OfflineStudyTopic; score: number } | null = null;
  for (const topic of OFFLINE_STUDY_TOPICS) {
    let score = 0;
    const normTitle = normalizeQuestionText(topic.title);
    const normSubj = normalizeQuestionText(topic.subjectLabel);

    if (normTitle.includes(normQ) || normQ.includes(normTitle)) {
      score += 10;
    }
    for (const kw of topic.keywords) {
      const normKw = normalizeQuestionText(kw);
      if (normKw && normQ.includes(normKw)) {
        score += 5;
      }
    }
    for (const tok of queryTokens) {
      if (normTitle.includes(tok) || normSubj.includes(tok)) {
        score += 2;
      }
    }
    if (score > 0 && (!bestTopic || score > bestTopic.score)) {
      bestTopic = { topic, score };
    }
  }

  if (bestTopic && bestTopic.score >= 4) {
    return {
      answer: `${bestTopic.topic.answer}\n\n---\n*অফলাইন WBBSE পাঠ্যবই নোটস (${bestTopic.topic.subjectLabel} · ${bestTopic.topic.classes}) — রিচার্জ ছাড়াই পঠনযোগ্য*`,
      matchedTopicTitle: bestTopic.topic.title,
    };
  }

  const suggestedTitles = OFFLINE_STUDY_TOPICS.slice(0, 6)
    .map((t) => `- ${t.title}`)
    .join('\n');

  return {
    answer: `**অফলাইন মোড চালু আছে (ইন্টারনেট নেই)**\n\n"${cleanQ}" প্রশ্নের উত্তর এই মুহূর্তে অফলাইন নোটসে সেভ করা নেই। তবে আপনি ইন্টারনেট ছাড়াই নিচের কাজগুলো করতে পারবেন:\n\n1. ওপরের **"অফলাইন নোটস"** বাটনে ক্লিক করে ৭টি বিষয়ের ২৬টি গুরুত্বপূর্ণ WBBSE নোটস পড়ুন।\n2. যেকোনো অঙ্ক সরাসরি লিখুন — যেমন: \`২৫ × ৪ + ১০\`, \`15% of 400\`, \`বর্গমূল 144\`, বা \`x^2 - 5x + 6 = 0\`।\n3. **Dictionary** ট্যাবে গিয়ে ৫৮+ স্কুল শব্দের অর্থ অফলাইনেই দেখুন।\n\n**জনপ্রিয় অফলাইন নোটস:**\n${suggestedTitles}\n\n*(একবার ইন্টারনেট/Wi-Fi পেলে যেকোনো নতুন প্রশ্ন জিজ্ঞেস করলেই তা অটোমেটিক ফোনে সেভ হয়ে যাবে।)*`,
  };
}
