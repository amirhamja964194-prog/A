import { useState } from 'react';
import type {
  StudentAvatarColor,
  StudentAvatarPreset,
  StudentProfile,
} from '../types';

export interface AvatarColorOption {
  id: StudentAvatarColor;
  label: string;
  bgClass: string;
  ringClass: string;
  swatchClass: string;
}

export const AVATAR_COLOR_OPTIONS: AvatarColorOption[] = [
  {
    id: 'cyan',
    label: 'Sky Cyan',
    bgClass: 'from-cyan-500 via-sky-500 to-blue-600',
    ringClass: 'ring-cyan-400/70',
    swatchClass: 'bg-gradient-to-br from-cyan-400 to-blue-600',
  },
  {
    id: 'violet',
    label: 'Royal Violet',
    bgClass: 'from-fuchsia-500 via-purple-500 to-indigo-600',
    ringClass: 'ring-fuchsia-400/70',
    swatchClass: 'bg-gradient-to-br from-fuchsia-500 to-indigo-600',
  },
  {
    id: 'rose',
    label: 'Coral Rose',
    bgClass: 'from-rose-500 via-pink-500 to-orange-500',
    ringClass: 'ring-rose-400/70',
    swatchClass: 'bg-gradient-to-br from-rose-500 to-orange-500',
  },
  {
    id: 'emerald',
    label: 'Mint Green',
    bgClass: 'from-emerald-400 via-teal-500 to-cyan-600',
    ringClass: 'ring-emerald-400/70',
    swatchClass: 'bg-gradient-to-br from-emerald-400 to-teal-600',
  },
  {
    id: 'amber',
    label: 'Warm Gold',
    bgClass: 'from-amber-400 via-orange-500 to-rose-500',
    ringClass: 'ring-amber-400/70',
    swatchClass: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  {
    id: 'indigo',
    label: 'Midnight Blue',
    bgClass: 'from-indigo-500 via-blue-600 to-slate-800',
    ringClass: 'ring-indigo-400/70',
    swatchClass: 'bg-gradient-to-br from-indigo-500 to-slate-800',
  },
];

export interface AvatarPresetOption {
  id: StudentAvatarPreset;
  label: string;
}

export const AVATAR_PRESET_OPTIONS: AvatarPresetOption[] = [
  { id: 'boy-scholar', label: 'ছাত্র (Boy)' },
  { id: 'girl-scholar', label: 'ছাত্রী (Girl)' },
  { id: 'initial', label: 'অক্ষর (Letter)' },
  { id: 'astronaut', label: 'মহাকাশ' },
  { id: 'owl', label: 'জ্ঞানী পেঁচা' },
  { id: 'rocket', label: 'রকেট' },
  { id: 'atom', label: 'বিজ্ঞান' },
  { id: 'book', label: 'বইপ্রেমী' },
  { id: 'palette', label: 'আর্ট' },
  { id: 'star', label: 'স্টার' },
];

export function getAvatarColorOption(color: StudentAvatarColor): AvatarColorOption {
  return AVATAR_COLOR_OPTIONS.find((c) => c.id === color) ?? AVATAR_COLOR_OPTIONS[0];
}

export function getStudentInitial(name?: string): string {
  const clean = (name || '').trim();
  if (!clean) return 'S';
  // Use Array.from so Unicode / Bengali base characters are handled cleanly
  const firstChar = Array.from(clean)[0] || 'S';
  return firstChar.toUpperCase();
}

export async function compressAvatarImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ছবিটি পড়া যায়নি। অন্য একটি ছবি চেষ্টা করো।'));
    reader.onload = (e) => {
      const rawUrl = e.target?.result;
      if (typeof rawUrl !== 'string') {
        reject(new Error('অবৈধ ছবি ফাইল।'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('এই ছবিটি সাপোর্ট করছে না। JPG বা PNG বেছে নাও।'));
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }

        const minSide = Math.min(img.width, img.height);
        const sx = Math.floor((img.width - minSide) / 2);
        const sy = Math.floor((img.height - minSide) / 2);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}

function renderPresetArtwork(preset: StudentAvatarPreset, initial: string) {
  switch (preset) {
    case 'boy-scholar':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <circle cx="32" cy="58" r="18" fill="#1e293b" fillOpacity="0.88" />
          <path d="M22 50 L32 58 L42 50" fill="#ffffff" fillOpacity="0.92" />
          <circle cx="32" cy="30" r="14" fill="#fde6d0" />
          <path
            d="M17 29 C17 18 23 13 32 13 C41 13 47 18 47 29 C44 23 39 21 32 21 C25 21 20 23 17 29 Z"
            fill="#0f172a"
          />
          <circle cx="26.5" cy="31" r="2" fill="#0f172a" />
          <circle cx="37.5" cy="31" r="2" fill="#0f172a" />
          <path
            d="M27.5 37.5 Q32 41 36.5 37.5"
            fill="none"
            stroke="#9a3412"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <polygon points="32,7 48,13 32,19 16,13" fill="#0f172a" />
          <rect x="44" y="13" width="2" height="9" rx="1" fill="#fbbf24" />
        </svg>
      );

    case 'girl-scholar':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path
            d="M16 32 C16 17 23 12 32 12 C41 12 48 17 48 32 L49 48 C43 52 21 52 15 48 Z"
            fill="#1e1b4b"
          />
          <circle cx="32" cy="58" r="18" fill="#312e81" fillOpacity="0.9" />
          <circle cx="32" cy="31" r="13.5" fill="#fde6d0" />
          <path
            d="M18.5 29 C21 20 28 18 32 19 C36 18 43 20 45.5 29 C41 24 36 22 32 23 C28 22 23 24 18.5 29 Z"
            fill="#1e1b4b"
          />
          <circle cx="27" cy="32" r="2" fill="#0f172a" />
          <circle cx="37" cy="32" r="2" fill="#0f172a" />
          <circle cx="23.5" cy="35" r="2" fill="#fda4af" fillOpacity="0.55" />
          <circle cx="40.5" cy="35" r="2" fill="#fda4af" fillOpacity="0.55" />
          <path
            d="M28 38 Q32 41.2 36 38"
            fill="none"
            stroke="#9a3412"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="19" cy="25" r="3" fill="#f43f5e" />
          <circle cx="45" cy="25" r="3" fill="#f43f5e" />
        </svg>
      );

    case 'astronaut':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <circle cx="32" cy="57" r="19" fill="#f8fafc" />
          <rect x="26" y="48" width="12" height="8" rx="2.5" fill="#38bdf8" />
          <circle cx="32" cy="30" r="16" fill="#f8fafc" />
          <rect x="20" y="21" width="24" height="17" rx="8.5" fill="#0f172a" />
          <path
            d="M24 25 Q28 22 33 24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="49" cy="14" r="2" fill="#fde047" />
          <circle cx="14" cy="18" r="1.5" fill="#ffffff" />
        </svg>
      );

    case 'owl':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <ellipse cx="32" cy="38" rx="18" ry="19" fill="#fef3c7" fillOpacity="0.95" />
          <path d="M16 25 L22 15 L29 22 Z" fill="#b45309" />
          <path d="M48 25 L42 15 L35 22 Z" fill="#b45309" />
          <circle cx="24.5" cy="30" r="7" fill="#ffffff" stroke="#b45309" strokeWidth="2.2" />
          <circle cx="39.5" cy="30" r="7" fill="#ffffff" stroke="#b45309" strokeWidth="2.2" />
          <circle cx="24.5" cy="30" r="3" fill="#0f172a" />
          <circle cx="39.5" cy="30" r="3" fill="#0f172a" />
          <polygon points="32,34 28.5,40 35.5,40" fill="#f59e0b" />
          <path d="M23 47 Q32 52 41 47" fill="none" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'rocket':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M32 10 C40 18 42 30 40 42 L24 42 C22 30 24 18 32 10 Z" fill="#f8fafc" />
          <path d="M32 10 C36 14 38 18 39 22 L25 22 C26 18 28 14 32 10 Z" fill="#f43f5e" />
          <circle cx="32" cy="30" r="4.5" fill="#0ea5e9" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M24 35 L16 44 L24 43 Z" fill="#f43f5e" />
          <path d="M40 35 L48 44 L40 43 Z" fill="#f43f5e" />
          <path d="M27 44 L32 55 L37 44 Z" fill="#fbbf24" />
        </svg>
      );

    case 'atom':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <ellipse cx="32" cy="32" rx="22" ry="9" fill="none" stroke="#ffffff" strokeWidth="2.4" />
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="9"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            transform="rotate(60 32 32)"
          />
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="9"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            transform="rotate(120 32 32)"
          />
          <circle cx="32" cy="32" r="5" fill="#fde047" />
        </svg>
      );

    case 'book':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path
            d="M14 20 Q23 17 32 22 L32 47 Q23 42 14 45 Z"
            fill="#ffffff"
            fillOpacity="0.95"
          />
          <path
            d="M50 20 Q41 17 32 22 L32 47 Q41 42 50 45 Z"
            fill="#e2e8f0"
            fillOpacity="0.95"
          />
          <line x1="19" y1="28" x2="28" y2="29" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="19" y1="34" x2="28" y2="35" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="29" x2="45" y2="28" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="35" x2="45" y2="34" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'palette':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path
            d="M32 13 C20 13 12 22 12 33 C12 44 20 51 30 51 C34 51 36 48 35 45 C34 42 36 40 39 40 L44 40 C49 40 52 36 52 31 C52 20 43 13 32 13 Z"
            fill="#fef3c7"
          />
          <circle cx="23" cy="27" r="3.2" fill="#ef4444" />
          <circle cx="32" cy="22" r="3.2" fill="#3b82f6" />
          <circle cx="42" cy="26" r="3.2" fill="#10b981" />
          <circle cx="22" cy="37" r="3.2" fill="#a855f7" />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <polygon
            points="32,11 38.4,24 52.8,26 42.4,36.2 44.8,50.5 32,43.7 19.2,50.5 21.6,36.2 11.2,26 25.6,24"
            fill="#fde047"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'initial':
    default:
      return (
        <span className="font-bold text-white leading-none select-none drop-shadow-xs">
          {initial}
        </span>
      );
  }
}

interface StudentAvatarProps {
  profile: Pick<
    StudentProfile,
    'name' | 'avatarType' | 'avatarPreset' | 'avatarColor' | 'customAvatarDataUrl'
  >;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<StudentAvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-[11px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-base',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-22 h-22 text-3xl',
};

export function StudentAvatar({
  profile,
  size = 'sm',
  className = '',
}: StudentAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const colorOpt = getAvatarColorOption(profile.avatarColor || 'cyan');
  const initial = getStudentInitial(profile.name);
  const showCustomImg =
    profile.avatarType === 'custom' &&
    Boolean(profile.customAvatarDataUrl) &&
    !imgFailed;

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 inline-flex items-center justify-center bg-gradient-to-br ${colorOpt.bgClass} ring-2 ${colorOpt.ringClass} ${SIZE_CLASSES[size]} ${className}`}
    >
      {showCustomImg ? (
        <img
          src={profile.customAvatarDataUrl}
          alt={profile.name ? `${profile.name} avatar` : 'Student avatar'}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        renderPresetArtwork(profile.avatarPreset || 'initial', initial)
      )}
    </div>
  );
}
