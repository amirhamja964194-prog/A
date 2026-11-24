import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  GraduationCap,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react';
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

const FAVORITE_SUBJECTS = [
  'বিজ্ঞান (Science)',
  'গণিত (Math)',
  'বাংলা (Bengali)',
  'ইংরেজি (English)',
  'ইতিহাস (History)',
  'ভূগোল (Geography)',
];

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  currentClass: ClassLevel;
  onSave: (nextProfile: StudentProfile) => void;
}

export function StudentProfileModal({
  isOpen,
  onClose,
  profile,
  currentClass,
  onSave,
}: StudentProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(
    profile.className || currentClass,
  );
  const [school, setSchool] = useState(profile.school || '');
  const [favoriteSubject, setFavoriteSubject] = useState(profile.favoriteSubject || '');
  const [avatarType, setAvatarType] = useState<'preset' | 'custom'>(profile.avatarType);
  const [avatarPreset, setAvatarPreset] = useState<StudentAvatarPreset>(
    profile.avatarPreset || 'boy-scholar',
  );
  const [avatarColor, setAvatarColor] = useState<StudentAvatarColor>(
    profile.avatarColor || 'cyan',
  );
  const [customAvatarDataUrl, setCustomAvatarDataUrl] = useState<string | undefined>(
    profile.customAvatarDataUrl,
  );
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(profile.name || '');
    setSelectedClass(profile.className || currentClass);
    setSchool(profile.school || '');
    setFavoriteSubject(profile.favoriteSubject || '');
    setAvatarType(profile.avatarType || 'preset');
    setAvatarPreset(profile.avatarPreset || 'boy-scholar');
    setAvatarColor(profile.avatarColor || 'cyan');
    setCustomAvatarDataUrl(profile.customAvatarDataUrl);
    setError(null);
    setSavedNotice(false);
  }, [isOpen, profile, currentClass]);

  if (!isOpen) return null;

  const previewProfile: StudentProfile = {
    name: name.trim(),
    className: selectedClass,
    school: school.trim(),
    favoriteSubject: favoriteSubject.trim(),
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
      setError('অনুগ্রহ করে একটি সঠিক ছবি (JPG, PNG বা WebP) বেছে নাও।');
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
    const cleanedName = name.trim();
    if (!cleanedName) {
      setError('তোমার নাম খালি রাখা যাবে না।');
      return;
    }
    if (cleanedName.length > 40) {
      setError('নামটি ৪০ অক্ষরের মধ্যে লেখো।');
      return;
    }

    onSave({
      name: cleanedName,
      className: selectedClass,
      school: school.trim().slice(0, 80),
      favoriteSubject: favoriteSubject.trim().slice(0, 40),
      avatarType,
      avatarPreset,
      avatarColor,
      customAvatarDataUrl: avatarType === 'custom' ? customAvatarDataUrl : undefined,
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });
    setSavedNotice(true);
    window.setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[92dvh] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0d1124] border-t sm:border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="student-profile-modal-title"
                className="text-base font-bold text-slate-900 dark:text-white leading-tight"
              >
                আমার প্রোফাইল (Student Profile)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                নাম, অ্যাভাটার ও নিজস্ব তথ্য পরিবর্তন করো
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile settings"
            className="min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-5">
          {/* Live Avatar Showcase & Custom Photo Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
            <div className="relative">
              <StudentAvatar profile={previewProfile} size="xl" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload custom photo"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 border-2 border-white dark:border-[#0d1124] flex items-center justify-center shadow-md hover:scale-105 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {name.trim() || 'Student'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedClass}
                  {school.trim() ? ` · ${school.trim()}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <Camera className="w-3.5 h-3.5" />
                  নিজের ছবি দাও
                </button>
                {avatarType === 'custom' && customAvatarDataUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarType('preset');
                      setCustomAvatarDataUrl(undefined);
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-semibold inline-flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    ছবি সরাও
                  </button>
                )}
              </div>
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
          </div>

          {/* Avatar Color Ring Selector */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              অ্যাভাটারের রঙ (Theme Color)
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {AVATAR_COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAvatarColor(c.id)}
                  aria-label={c.label}
                  className={`w-8 h-8 rounded-full ${c.swatchClass} flex items-center justify-center transition-transform ${
                    avatarColor === c.id
                      ? 'scale-110 ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-[#0d1124]'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {avatarColor === c.id && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Avatars Grid */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              অ্যাভাটার বেছে নাও (Choose Avatar)
            </span>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_PRESET_OPTIONS.map((opt) => {
                const isSelected = avatarType === 'preset' && avatarPreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setAvatarType('preset');
                      setAvatarPreset(opt.id);
                    }}
                    className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/12 shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/25'
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
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-full">
                      {opt.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="profile-student-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              তোমার নাম (AI Teacher এই নামেই ডাকবে)
            </label>
            <input
              id="profile-student-name"
              type="text"
              maxLength={40}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="তোমার নাম লেখো..."
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
            />
            {error && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}
          </div>

          {/* Class Level */}
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-500" />
              তোমার ক্লাস (Class)
            </span>
            <div className="grid grid-cols-3 gap-2">
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

          {/* Optional Personal Info: School & Favorite Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="profile-school-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                স্কুলের নাম (ঐচ্ছিক)
              </label>
              <input
                id="profile-school-name"
                type="text"
                maxLength={80}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="যেমন: রামকৃষ্ণ মিশন..."
                className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-fav-subject"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                প্রিয় বিষয় (ঐচ্ছিক)
              </label>
              <select
                id="profile-fav-subject"
                value={favoriteSubject}
                onChange={(e) => setFavoriteSubject(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:border-cyan-500 outline-none"
              >
                <option value="">পছন্দ করো...</option>
                {FAVORITE_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sticky Footer Actions inside Form */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {savedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>সেভ হয়ে গেছে!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>সেভ করো</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
