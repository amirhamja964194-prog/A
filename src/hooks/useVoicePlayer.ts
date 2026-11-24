import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoicePersona } from '../types';

function cleanForSpeech(rawText: string): string {
  return rawText
    .replace(/\*\*/g, '')
    .replace(/[#`>_~]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function useVoicePlayer(defaultVoice: VoicePersona = 'Kore') {
  const [voice, setVoice] = useState<VoicePersona>(defaultVoice);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveId(null);
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  const fallbackBrowserSpeak = useCallback((text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setActiveId(null);
      setIsLoading(false);
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const isAscii = /^[\x00-\x7F]+$/.test(text);
    const targetLang = isAscii ? 'en-IN' : 'bn-IN';
    utterance.lang = targetLang;
    const voices = window.speechSynthesis.getVoices?.() ?? [];
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(isAscii ? 'en-in' : 'bn')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(isAscii ? 'en' : 'hi'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.rate = 0.96;
    utterance.onend = () => {
      setActiveId(null);
      setIsLoading(false);
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setActiveId(null);
      setIsLoading(false);
      setIsPlaying(false);
    };
    setActiveId(id);
    setIsLoading(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    async (text: string, id: string, overrideVoice?: VoicePersona) => {
      const cleaned = cleanForSpeech(text);
      if (!cleaned) return;

      if (activeId === id && (isPlaying || isLoading)) {
        stop();
        return;
      }

      stop();

      // When offline, use device built-in speech synthesis immediately with zero delay
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        fallbackBrowserSpeak(cleaned, id);
        return;
      }

      setActiveId(id);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;
      let timedOut = false;
      const timeoutId = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, 10000);

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleaned,
            voiceName: overrideVoice ?? voice,
          }),
          signal: controller.signal,
        });
        window.clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error('TTS request failed');
        }

        const data = (await res.json()) as {
          audioBase64?: string;
          mimeType?: string;
        };

        if (!data.audioBase64) {
          throw new Error('No audio returned');
        }

        if (controller.signal.aborted) return;

        const binaryStr = atob(data.audioBase64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i += 1) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          stop();
        };
        audio.onerror = () => {
          stop();
        };

        setIsLoading(false);
        setIsPlaying(true);
        await audio.play();
      } catch (err) {
        window.clearTimeout(timeoutId);
        if ((err as Error)?.name === 'AbortError' && !timedOut) return;
        setIsLoading(false);
        fallbackBrowserSpeak(cleaned, id);
      }
    },
    [activeId, isPlaying, isLoading, voice, stop, fallbackBrowserSpeak],
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    voice,
    setVoice,
    activeId,
    isLoading,
    isPlaying,
    speak,
    stop,
  };
}
