import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';
import type {
  ClassLevel,
  StudentAvatarColor,
  StudentAvatarPreset,
  StudentProfile,
} from '../types';
import {
  AVATAR_COLOR_OPTIONS,
  AVATAR_PRESET_OPTIONS,
  StudentAvatar,
  compressAvatarImageFile,
} from './StudentAvatar';

const CLASS_OPTIONS: ClassLevel[] = [
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

interface StudentOnboardingModalProps {
  isOpen: boolean;
  appName: string;
  initialClass: ClassLevel;
  onComplete: (profile: StudentProfile) => void;
}

export function StudentOnboardingModal({
  isOpen,
  appName,
  initialClass,
  onComplete,
}: StudentOnboardingModalProps) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(initialClass);
  const [avatarType, setAvatarType] = useState<'preset' | 'custom'>('preset');
  const [avatarPreset, setAvatarPreset] = useState<StudentAvatarPreset>('boy-scholar');
  const [avatarColor, setAvatarColor] = useState<StudentAvatarColor>('cyan');
  const [customAvatarDataUrl, setCustomAvatarDataUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSelectedClass(initialClass);
  }, [initialClass]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  if (!isOpen) return null;

  const previewProfile: StudentProfile = {
    name: name.trim(),
    className: selectedClass,
    avatarType,
    avatarPreset,
    avatarColor,
    customAvatarDataUrl,
    onboardingCompleted: true,
    updatedAt: Date.now(),
  };

  const handlePhotoUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে একটি সঠিক ছবি (JPG বা PNG) বেছে নাও।');
      return;
    }
    setError(null);
    try {
      const compressed = await compressAvatarImageFile(file);
      setCustomAvatarDataUrl(compressed);
      setAvatarType('custom');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ছবি আপলোড করা যায়নি।');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = name.trim();
    if (!cleaned) {
      setError('অনুগ্রহ করে তোমার নাম লেখো যাতে AI Teacher তোমাকে নামে ডাকতে পারে।');
      inputRef.current?.focus();
      return;
    }
    if (cleaned.length > 40) {
      setError('নামটি ৪০ অক্ষরের মধ্যে লেখো।');
      return;
    }

    onComplete({
      name: cleaned,
      className: selectedClass,
      school: '',
      favoriteSubject: '',
      avatarType,
      avatarPreset,
      avatarColor,
      customAvatarDataUrl: avatarType === 'custom' ? customAvatarDataUrl : undefined,
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-onboarding-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0d1124] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden my-auto">
        {/* Top Welcome Accent Header */}
        <div className="px-6 pt-6 pb-4 text-center bg-gradient-to-b from-cyan-50/90 via-white to-white dark:from-indigo-950/60 dark:via-[#0d1124] dark:to-[#0d1124]">
          <div className="relative inline-flex flex-col items-center">
            <StudentAvatar profile={previewProfile} size="xl" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="নিজের ছবি দাও"
              aria-label="Upload your own photo"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 border-2 border-white dark:border-[#0d1124] flex items-center justify-center shadow-md hover:scale-105 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void handlePhotoUpload(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>

          <h2
            id="student-onboarding-title"
            className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Enter Your Name
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {appName}-এ স্বাগতম! তোমার নাম লেখো — AI Teacher এখন থেকে তোমাকে এই নামেই ডাকবে।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="onboarding-student-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              তোমার নাম (Your Name)
            </label>
            <input
              ref={inputRef}
              id="onboarding-student-name"
              type="text"
              maxLength={40}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="যেমন: অরিত্র, রিয়া, আমির..."
              className="w-full min-h-[48px] px-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
            {error && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}
          </div>

          {/* Quick Class Selection */}
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              তোমার ক্লাস বেছে নাও (WBBSE)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {CLASS_OPTIONS.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`min-h-[38px] rounded-xl text-xs font-semibold border transition-all ${
                    selectedClass === cls
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Avatar Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                অ্যাভাটার পছন্দ করো (Avatar)
              </span>
              <div className="flex items-center gap-1.5">
                {AVATAR_COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={`Avatar color ${c.label}`}
                    onClick={() => setAvatarColor(c.id)}
                    className={`w-5 h-5 rounded-full ${c.swatchClass} transition-transform ${
                      avatarColor === c.id
                        ? 'scale-115 ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-[#0d1124]'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {AVATAR_PRESET_OPTIONS.slice(0, 5).map((opt) => {
                const isSelected = avatarType === 'preset' && avatarPreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setAvatarType('preset');
                      setAvatarPreset(opt.id);
                    }}
                    className={`p-1.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/25'
                    }`}
                  >
                    <StudentAvatar
                      profile={{
                        name: name.trim() || 'S',
                        avatarType: 'preset',
                        avatarPreset: opt.id,
                        avatarColor,
                      }}
                      size="sm"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Submit CTA */}
          <button
            type="submit"
            className="w-full min-h-[48px] px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>পড়াশোনা শুরু করি</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
            এই পপআপটি শুধুমাত্র প্রথমবারই আসবে। পরে উপরের প্রোফাইল আইকন থেকে যেকোনো সময় নাম ও অ্যাভাটার পরিবর্তন করা যাবে।
          </p>
        </form>
      </div>
    </div>
  );
}
