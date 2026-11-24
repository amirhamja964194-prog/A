import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { D as Radio, E as RefreshCw, I as MessageSquareText, N as Mic, P as MicOff, Q as Cpu, S as Send, U as ImagePlus, V as LoaderCircle, Z as Download, _t as AudioLines, c as Video, g as Square, k as PhoneOff, l as VideoOff, n as X, ot as CircleAlert, s as Volume2, ut as Camera, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { c as abortOfflineAiGeneration, d as extractTextFromImageOffline, g as isOfflineFeatureAllowed, h as isOfflineAiPackInstalled, i as answerOfflineQuestion, m as getOfflineAiState, o as useOnlineStatus, p as generateOfflineLiveReply, v as subscribeOfflineAiState, y as transcribeOfflineAudio } from "./index-DPiGb8lU.js";
import { t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
// src/hooks/useLiveTeacher.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function downsampleBuffer(buffer, inputSampleRate, targetSampleRate) {
	if (inputSampleRate === targetSampleRate) return buffer;
	const ratio = inputSampleRate / targetSampleRate;
	const newLength = Math.max(1, Math.round(buffer.length / ratio));
	const result = new Float32Array(newLength);
	let offsetResult = 0;
	let offsetBuffer = 0;
	while (offsetResult < result.length) {
		const nextOffsetBuffer = Math.min(buffer.length, Math.round((offsetResult + 1) * ratio));
		let accum = 0;
		let count = 0;
		for (let i = offsetBuffer; i < nextOffsetBuffer; i += 1) {
			accum += buffer[i];
			count += 1;
		}
		result[offsetResult] = count > 0 ? accum / count : 0;
		offsetResult += 1;
		offsetBuffer = nextOffsetBuffer;
	}
	return result;
}
function floatTo16BitPcmBase64(samples) {
	const bytes = new Uint8Array(samples.length * 2);
	const view = new DataView(bytes.buffer);
	for (let i = 0; i < samples.length; i += 1) {
		const clamped = Math.max(-1, Math.min(1, samples[i]));
		const int16 = clamped < 0 ? clamped * 32768 : clamped * 32767;
		view.setInt16(i * 2, int16, true);
	}
	let binary = "";
	const chunkSize = 32768;
	for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	return btoa(binary);
}
function base64PcmToFloat32(base64) {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	const view = new DataView(bytes.buffer);
	const sampleCount = Math.floor(bytes.byteLength / 2);
	const out = new Float32Array(sampleCount);
	for (let i = 0; i < sampleCount; i += 1) out[i] = view.getInt16(i * 2, true) / 32768;
	return out;
}
function createAudioContext(preferredSampleRate, latencyHint) {
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	try {
		return new AudioCtx({
			sampleRate: preferredSampleRate,
			latencyHint
		});
	} catch {
		try {
			return new AudioCtx({ latencyHint });
		} catch {
			return new AudioCtx();
		}
	}
}
function useLiveTeacher() {
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)(null);
	const [isMuted, setIsMuted] = (0, import_react.useState)(false);
	const [isTeacherSpeaking, setIsTeacherSpeaking] = (0, import_react.useState)(false);
	const [micLevel, setMicLevel] = (0, import_react.useState)(0);
	const [interimUserText, setInterimUserText] = (0, import_react.useState)("");
	const [transcripts, setTranscripts] = (0, import_react.useState)([]);
	const wsRef = (0, import_react.useRef)(null);
	const mediaStreamRef = (0, import_react.useRef)(null);
	const inputAudioCtxRef = (0, import_react.useRef)(null);
	const outputAudioCtxRef = (0, import_react.useRef)(null);
	const processorRef = (0, import_react.useRef)(null);
	const sourceNodeRef = (0, import_react.useRef)(null);
	const silentGainRef = (0, import_react.useRef)(null);
	const sessionRunIdRef = (0, import_react.useRef)(0);
	const manualStopRef = (0, import_react.useRef)(false);
	const isMutedRef = (0, import_react.useRef)(false);
	isMutedRef.current = isMuted;
	const hadErrorRef = (0, import_react.useRef)(false);
	const isTeacherSpeakingRef = (0, import_react.useRef)(false);
	const teacherSpeakEndTimeRef = (0, import_react.useRef)(0);
	const activeTurnRoleRef = (0, import_react.useRef)(null);
	const lastMicMeterTimeRef = (0, import_react.useRef)(0);
	const lastMicMeterValRef = (0, import_react.useRef)(0);
	const zeroPcmBase64Ref = (0, import_react.useRef)(null);
	const nextPlayTimeRef = (0, import_react.useRef)(0);
	const activeSourcesRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const clearAudioPlayback = (0, import_react.useCallback)(() => {
		for (const src of activeSourcesRef.current) try {
			src.stop();
			src.disconnect();
		} catch {}
		activeSourcesRef.current.clear();
		if (outputAudioCtxRef.current) nextPlayTimeRef.current = outputAudioCtxRef.current.currentTime;
		else nextPlayTimeRef.current = 0;
		isTeacherSpeakingRef.current = false;
		setIsTeacherSpeaking(false);
	}, []);
	const stopSession = (0, import_react.useCallback)((preserveError = false) => {
		manualStopRef.current = true;
		sessionRunIdRef.current += 1;
		clearAudioPlayback();
		if (processorRef.current) {
			processorRef.current.onaudioprocess = null;
			try {
				processorRef.current.disconnect();
			} catch {}
			processorRef.current = null;
		}
		if (sourceNodeRef.current) {
			try {
				sourceNodeRef.current.disconnect();
			} catch {}
			sourceNodeRef.current = null;
		}
		if (silentGainRef.current) {
			try {
				silentGainRef.current.disconnect();
			} catch {}
			silentGainRef.current = null;
		}
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((t) => t.stop());
			mediaStreamRef.current = null;
		}
		if (inputAudioCtxRef.current) {
			if (inputAudioCtxRef.current.state !== "closed") inputAudioCtxRef.current.close().catch(() => {});
			inputAudioCtxRef.current = null;
		}
		if (outputAudioCtxRef.current) {
			if (outputAudioCtxRef.current.state !== "closed") outputAudioCtxRef.current.close().catch(() => {});
			outputAudioCtxRef.current = null;
		}
		if (wsRef.current) {
			const ws = wsRef.current;
			wsRef.current = null;
			if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) try {
				ws.close();
			} catch {}
		}
		setMicLevel(0);
		setInterimUserText("");
		setIsTeacherSpeaking(false);
		if (!preserveError) setStatus("idle");
	}, [clearAudioPlayback]);
	const schedulePcmAudio = (0, import_react.useCallback)((base64Data) => {
		const ctx = outputAudioCtxRef.current;
		if (!ctx || ctx.state === "closed") return;
		if (ctx.state === "suspended") ctx.resume().catch(() => {});
		try {
			const float32 = base64PcmToFloat32(base64Data);
			if (float32.length === 0) return;
			const audioBuffer = ctx.createBuffer(1, float32.length, 24e3);
			audioBuffer.getChannelData(0).set(float32);
			const src = ctx.createBufferSource();
			src.buffer = audioBuffer;
			src.connect(ctx.destination);
			const now = ctx.currentTime;
			const startTime = nextPlayTimeRef.current <= now + .005 ? now + .09 : nextPlayTimeRef.current;
			nextPlayTimeRef.current = startTime + audioBuffer.duration;
			activeSourcesRef.current.add(src);
			if (!isTeacherSpeakingRef.current) {
				isTeacherSpeakingRef.current = true;
				setIsTeacherSpeaking(true);
			}
			src.onended = () => {
				activeSourcesRef.current.delete(src);
				if (activeSourcesRef.current.size === 0) {
					isTeacherSpeakingRef.current = false;
					teacherSpeakEndTimeRef.current = performance.now();
					setIsTeacherSpeaking(false);
				}
			};
			src.start(startTime);
		} catch {}
	}, []);
	const appendTranscript = (0, import_react.useCallback)((role, text, imageDataUrl) => {
		const cleaned = text.trim();
		if (!cleaned && !imageDataUrl) return;
		const sameActiveTurn = !imageDataUrl && activeTurnRoleRef.current === role;
		activeTurnRoleRef.current = imageDataUrl ? null : role;
		setTranscripts((prev) => {
			const last = prev[prev.length - 1];
			if (sameActiveTurn && last && last.role === role && !last.imageDataUrl) {
				if (last.text === cleaned || last.text.endsWith(cleaned)) return prev;
				if (cleaned.startsWith(last.text)) return [...prev.slice(0, -1), {
					...last,
					text: cleaned
				}];
				const needsSpace = !/\s$/.test(last.text) && !/^[.,!?।]/.test(cleaned);
				const merged = `${last.text}${needsSpace ? " " : ""}${cleaned}`;
				return [...prev.slice(0, -1), {
					...last,
					text: merged
				}];
			}
			return [...prev, {
				id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				role,
				text: cleaned,
				imageDataUrl
			}];
		});
	}, []);
	const startSession = (0, import_react.useCallback)(async (options) => {
		stopSession();
		const runId = ++sessionRunIdRef.current;
		manualStopRef.current = false;
		hadErrorRef.current = false;
		setError(null);
		setTranscripts([]);
		setIsMuted(false);
		isMutedRef.current = false;
		setStatus("connecting");
		try {
			if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone capture is unavailable in this browser.");
			const stream = await navigator.mediaDevices.getUserMedia({ audio: {
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
				channelCount: 1
			} });
			if (sessionRunIdRef.current !== runId) {
				stream.getTracks().forEach((t) => t.stop());
				return;
			}
			mediaStreamRef.current = stream;
			const inputCtx = createAudioContext(16e3, "interactive");
			const outputCtx = createAudioContext(24e3, "playback");
			inputAudioCtxRef.current = inputCtx;
			outputAudioCtxRef.current = outputCtx;
			nextPlayTimeRef.current = outputCtx.currentTime;
			await Promise.all([inputCtx.state === "suspended" ? inputCtx.resume().catch(() => {}) : Promise.resolve(), outputCtx.state === "suspended" ? outputCtx.resume().catch(() => {}) : Promise.resolve()]);
			if (sessionRunIdRef.current !== runId) {
				stream.getTracks().forEach((t) => t.stop());
				if (inputCtx.state !== "closed") inputCtx.close().catch(() => {});
				if (outputCtx.state !== "closed") outputCtx.close().catch(() => {});
				return;
			}
			const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
			const query = new URLSearchParams({
				className: options.className,
				voiceName: options.voiceName,
				liveRole: options.liveRole,
				voiceOnly: options.voiceOnly ? "1" : "0",
				...options.studentName?.trim() ? { studentName: options.studentName.trim() } : {}
			});
			const ws = new WebSocket(`${protocol}//${window.location.host}/api/live?${query.toString()}`);
			wsRef.current = ws;
			ws.onopen = () => {
				if (sessionRunIdRef.current !== runId || wsRef.current !== ws) {
					try {
						ws.close();
					} catch {}
					return;
				}
				try {
					const source = inputCtx.createMediaStreamSource(stream);
					const processor = inputCtx.createScriptProcessor(4096, 1, 1);
					const silentGain = inputCtx.createGain();
					silentGain.gain.value = 0;
					sourceNodeRef.current = source;
					processorRef.current = processor;
					silentGainRef.current = silentGain;
					processor.onaudioprocess = (event) => {
						if (sessionRunIdRef.current !== runId || wsRef.current !== ws || ws.readyState !== WebSocket.OPEN) return;
						const rawChannel = event.inputBuffer.getChannelData(0);
						if (isMutedRef.current) {
							if (lastMicMeterValRef.current !== 0) {
								lastMicMeterValRef.current = 0;
								setMicLevel(0);
							}
							return;
						}
						let sumSq = 0;
						for (let i = 0; i < rawChannel.length; i += 8) sumSq += rawChannel[i] * rawChannel[i];
						const rms = Math.sqrt(sumSq / Math.max(1, rawChannel.length / 8));
						const nextLevel = Math.min(1, rms * 5);
						const nowMs = performance.now();
						if (nowMs - lastMicMeterTimeRef.current >= 90 && Math.abs(nextLevel - lastMicMeterValRef.current) > .03) {
							lastMicMeterTimeRef.current = nowMs;
							lastMicMeterValRef.current = nextLevel;
							setMicLevel(nextLevel);
						}
						if (ws.bufferedAmount > 256e3) return;
						const downsampled = downsampleBuffer(rawChannel, inputCtx.sampleRate, 16e3);
						const shouldGate = isTeacherSpeakingRef.current || nowMs - teacherSpeakEndTimeRef.current < 750 ? rms < .15 : rms < .012;
						let pcmBase64;
						if (shouldGate) {
							if (!zeroPcmBase64Ref.current || zeroPcmBase64Ref.current.length === 0) zeroPcmBase64Ref.current = floatTo16BitPcmBase64(new Float32Array(downsampled.length));
							pcmBase64 = zeroPcmBase64Ref.current.length === Math.ceil(downsampled.length * 2 / 3) * 4 ? zeroPcmBase64Ref.current : floatTo16BitPcmBase64(new Float32Array(downsampled.length));
						} else pcmBase64 = floatTo16BitPcmBase64(downsampled);
						try {
							ws.send(JSON.stringify({
								type: "audio",
								data: pcmBase64
							}));
						} catch {}
					};
					source.connect(processor);
					processor.connect(silentGain);
					silentGain.connect(inputCtx.destination);
				} catch (audioErr) {
					hadErrorRef.current = true;
					setError(audioErr instanceof Error ? audioErr.message : "Could not initialize microphone audio stream.");
					setStatus("error");
				}
			};
			ws.onmessage = (event) => {
				if (sessionRunIdRef.current !== runId || wsRef.current !== ws) return;
				let msg;
				try {
					msg = JSON.parse(event.data);
				} catch {
					return;
				}
				switch (msg.type) {
					case "ready":
						activeTurnRoleRef.current = null;
						setStatus("connected");
						break;
					case "audio":
						if (msg.data) schedulePcmAudio(msg.data);
						break;
					case "interrupted":
						activeTurnRoleRef.current = null;
						clearAudioPlayback();
						break;
					case "turnComplete":
						activeTurnRoleRef.current = null;
						break;
					case "interimInput":
						setInterimUserText(msg.text ?? "");
						break;
					case "inputTranscript":
						setInterimUserText("");
						if (msg.text) appendTranscript("user", msg.text);
						break;
					case "outputTranscript":
						if (msg.text) appendTranscript("model", msg.text);
						break;
					case "error":
						hadErrorRef.current = true;
						setError(msg.error || "Live voice connection failed.");
						setStatus("error");
						break;
					case "closed":
						if (!manualStopRef.current && !hadErrorRef.current) {
							hadErrorRef.current = true;
							setError("Live session disconnected. Tap Retry to reconnect.");
							setStatus("error");
						}
						stopSession(hadErrorRef.current);
				}
			};
			ws.onerror = () => {
				if (sessionRunIdRef.current !== runId || wsRef.current !== ws) return;
				hadErrorRef.current = true;
				setError("Could not connect to Live Voice Mode. Please check your connection.");
				setStatus("error");
			};
			ws.onclose = () => {
				if (sessionRunIdRef.current !== runId || wsRef.current !== ws) return;
				if (!manualStopRef.current && !hadErrorRef.current) {
					hadErrorRef.current = true;
					setError("Live connection was interrupted. Tap Retry to reconnect.");
					setStatus("error");
				}
				stopSession(hadErrorRef.current);
			};
		} catch (err) {
			if (sessionRunIdRef.current !== runId) return;
			const message = err instanceof Error && err.name === "NotAllowedError" ? "Microphone permission was denied. Please allow microphone access to use Live Mode." : err instanceof Error ? err.message : "Could not start Live Mode.";
			hadErrorRef.current = true;
			stopSession(true);
			setError(message);
			setStatus("error");
		}
	}, [
		appendTranscript,
		clearAudioPlayback,
		schedulePcmAudio,
		stopSession
	]);
	const sendLiveText = (0, import_react.useCallback)((text) => {
		const cleaned = text.trim();
		if (!cleaned) return;
		const ws = wsRef.current;
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		appendTranscript("user", cleaned);
		ws.send(JSON.stringify({
			type: "text",
			text: cleaned
		}));
	}, [appendTranscript]);
	const sendLiveImage = (0, import_react.useCallback)((options) => {
		const ws = wsRef.current;
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		const caption = options.caption?.trim() || "";
		appendTranscript("user", caption || "Sent book photo", options.dataUrl);
		ws.send(JSON.stringify({
			type: "image",
			data: options.base64,
			mimeType: options.mimeType || "image/jpeg",
			text: caption
		}));
	}, [appendTranscript]);
	const sendLiveVideoFrame = (0, import_react.useCallback)((base64, mimeType = "image/jpeg") => {
		const ws = wsRef.current;
		if (!ws || ws.readyState !== WebSocket.OPEN || !base64) return;
		ws.send(JSON.stringify({
			type: "video",
			data: base64,
			mimeType
		}));
	}, []);
	const toggleMute = (0, import_react.useCallback)(() => {
		setIsMuted((prev) => !prev);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			stopSession();
		};
	}, [stopSession]);
	return {
		status,
		error,
		isMuted,
		isTeacherSpeaking,
		micLevel,
		interimUserText,
		transcripts,
		startSession,
		stopSession,
		toggleMute,
		stopTeacherSpeaking: clearAudioPlayback,
		sendLiveText,
		sendLiveImage,
		sendLiveVideoFrame
	};
}
// src/hooks/useOfflineLiveTeacher.ts
function getBrowserSpeechRecognition() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function cleanSpokenText(raw) {
	return raw.replace(/\*\*/g, "").replace(/[#`>_~]/g, "").replace(/---[\s\S]*$/g, "").replace(/\n{2,}/g, "। ").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}
function downsampleTo16k(input, sampleRate) {
	if (sampleRate === 16e3) return new Float32Array(input);
	const ratio = sampleRate / 16e3;
	const newLength = Math.max(1, Math.round(input.length / ratio));
	const out = new Float32Array(newLength);
	let outIdx = 0;
	let inIdx = 0;
	while (outIdx < newLength) {
		const nextIn = Math.min(input.length, Math.round((outIdx + 1) * ratio));
		let sum = 0;
		let count = 0;
		for (let i = inIdx; i < nextIn; i += 1) {
			sum += input[i];
			count += 1;
		}
		out[outIdx] = count > 0 ? sum / count : 0;
		outIdx += 1;
		inIdx = nextIn;
	}
	return out;
}
function concatFloat32Chunks(chunks) {
	let totalLength = 0;
	for (const c of chunks) totalLength += c.length;
	const merged = new Float32Array(totalLength);
	let offset = 0;
	for (const c of chunks) {
		merged.set(c, offset);
		offset += c.length;
	}
	return merged;
}
function getPersonaSpeechProfile(voice) {
	switch (voice) {
		case "Kore": return {
			rate: .96,
			pitch: 1.06
		};
		case "Puck": return {
			rate: 1.04,
			pitch: 1.12
		};
		case "Charon": return {
			rate: .92,
			pitch: .88
		};
		default: return {
			rate: .95,
			pitch: 1
		};
	}
}
function isGreetingOrShortSmalltalk(text) {
	const clean = text.trim().toLowerCase();
	return /^(hi|hello|hey|good morning|good evening|namaste|salam|assalamu|হ্যালো|হাই|স্যার|নমস্কার|কেমন আছেন|hello teacher|হ্যালো স্যার)[!.?\s]*$/i.test(clean);
}
function useOfflineLiveTeacher() {
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)(null);
	const [isMuted, setIsMuted] = (0, import_react.useState)(false);
	const [isTeacherSpeaking, setIsTeacherSpeaking] = (0, import_react.useState)(false);
	const [isThinking, setIsThinking] = (0, import_react.useState)(false);
	const [micLevel, setMicLevel] = (0, import_react.useState)(0);
	const [interimUserText, setInterimUserText] = (0, import_react.useState)("");
	const [transcripts, setTranscripts] = (0, import_react.useState)([]);
	const sessionRunIdRef = (0, import_react.useRef)(0);
	const activeOptionsRef = (0, import_react.useRef)({
		className: "Class 10",
		voiceName: "Zephyr",
		liveRole: "bengali",
		studentName: ""
	});
	const transcriptsRef = (0, import_react.useRef)([]);
	transcriptsRef.current = transcripts;
	const isMutedRef = (0, import_react.useRef)(false);
	isMutedRef.current = isMuted;
	const isTeacherSpeakingRef = (0, import_react.useRef)(false);
	const isProcessingTurnRef = (0, import_react.useRef)(false);
	const mediaStreamRef = (0, import_react.useRef)(null);
	const audioCtxRef = (0, import_react.useRef)(null);
	const processorRef = (0, import_react.useRef)(null);
	const sourceRef = (0, import_react.useRef)(null);
	const silentGainRef = (0, import_react.useRef)(null);
	const speechRecRef = (0, import_react.useRef)(null);
	const utteranceChunksRef = (0, import_react.useRef)([]);
	const speechStartedAtRef = (0, import_react.useRef)(0);
	const lastVoiceAtRef = (0, import_react.useRef)(0);
	const lastMicMeterAtRef = (0, import_react.useRef)(0);
	const stopTeacherSpeaking = (0, import_react.useCallback)(() => {
		abortOfflineAiGeneration();
		if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
		isTeacherSpeakingRef.current = false;
		setIsTeacherSpeaking(false);
	}, []);
	const speakOfflineReply = (0, import_react.useCallback)((text, runId) => {
		const cleaned = cleanSpokenText(text);
		if (!cleaned) return;
		if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
		window.speechSynthesis.cancel();
		const { voiceName, liveRole } = activeOptionsRef.current;
		const profile = getPersonaSpeechProfile(voiceName);
		const utterance = new SpeechSynthesisUtterance(cleaned);
		const hasBengaliChars = /[\u0980-\u09FF]/.test(cleaned);
		const targetLang = liveRole === "english" && !hasBengaliChars ? "en-IN" : hasBengaliChars ? "bn-IN" : "en-IN";
		utterance.lang = targetLang;
		utterance.rate = profile.rate;
		utterance.pitch = profile.pitch;
		const voices = window.speechSynthesis.getVoices?.() ?? [];
		const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLang.toLowerCase())) || voices.find((v) => v.lang.toLowerCase().startsWith(hasBengaliChars ? "bn" : "en")) || voices.find((v) => v.lang.toLowerCase().startsWith(hasBengaliChars ? "hi" : "en"));
		if (matchedVoice) utterance.voice = matchedVoice;
		utterance.onstart = () => {
			if (sessionRunIdRef.current !== runId) return;
			isTeacherSpeakingRef.current = true;
			setIsTeacherSpeaking(true);
		};
		const finishSpeak = () => {
			if (sessionRunIdRef.current !== runId) return;
			isTeacherSpeakingRef.current = false;
			setIsTeacherSpeaking(false);
		};
		utterance.onend = finishSpeak;
		utterance.onerror = finishSpeak;
		isTeacherSpeakingRef.current = true;
		setIsTeacherSpeaking(true);
		window.speechSynthesis.speak(utterance);
	}, []);
	const appendTranscript = (0, import_react.useCallback)((role, text, imageDataUrl) => {
		const id = `off-live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		setTranscripts((prev) => [...prev, {
			id,
			role,
			text: text.trim(),
			imageDataUrl
		}]);
		return id;
	}, []);
	const updateTranscriptById = (0, import_react.useCallback)((id, text) => {
		setTranscripts((prev) => prev.map((item) => item.id === id ? {
			...item,
			text
		} : item));
	}, []);
	const respondToStudentInput = (0, import_react.useCallback)(async (studentText, runId, options) => {
		const cleanQuestion = studentText.trim();
		if (!cleanQuestion || sessionRunIdRef.current !== runId) return;
		stopTeacherSpeaking();
		isProcessingTurnRef.current = true;
		setIsThinking(true);
		setError(null);
		if (!options?.skipAppendUser) appendTranscript("user", cleanQuestion);
		const { className, liveRole, studentName } = activeOptionsRef.current;
		const cleanName = studentName?.trim() || "";
		try {
			if (isGreetingOrShortSmalltalk(cleanQuestion)) {
				const reply = liveRole === "english" ? `Hello${cleanName ? ` ${cleanName}` : ""}! I am your Wbsec Offline Live Teacher for ${className}. Ask me any question by voice, text, or book photo!` : liveRole === "bilingual" ? `Hello${cleanName ? ` ${cleanName}` : ""}! হ্যালো${cleanName ? ` ${cleanName}` : ""}! আমি তোমার ${className}-এর অফলাইন লাইভ টিচার। তুমি যেকোনো প্রশ্ন বলো বা বইয়ের ছবি দেখাও, আমি বুঝিয়ে দেব!` : `হ্যালো${cleanName ? ` ${cleanName}` : ""}! আমি তোমার ${className}-এর অফলাইন লাইভ টিচার। ইন্টারনেট ছাড়াই তুমি আমাকে যেকোনো প্রশ্ন মুখে বলো, লেখো বা বইয়ের ছবি দেখাও — আমি সহজ করে বুঝিয়ে দেব!`;
				appendTranscript("model", reply);
				setIsThinking(false);
				speakOfflineReply(reply, runId);
				return;
			}
			const localHit = answerOfflineQuestion(cleanQuestion, className, false);
			const hasExactLocalHit = Boolean(localHit.matchedTopicTitle);
			if (isOfflineAiPackInstalled() && isOfflineFeatureAllowed("live")) {
				const modelMsgId = appendTranscript("model", "...");
				let streamed = "";
				const historyTurns = transcriptsRef.current.filter((t) => t.id !== modelMsgId && t.text && t.text !== "...").slice(-6).map((t) => ({
					role: t.role,
					text: t.text
				}));
				try {
					const reply = await generateOfflineLiveReply({
						className,
						liveRole,
						studentName: cleanName || void 0,
						history: historyTurns,
						userText: cleanQuestion,
						contextHint: hasExactLocalHit ? localHit.answer : void 0,
						onChunk: (chunk) => {
							if (sessionRunIdRef.current !== runId) return;
							streamed += chunk;
							updateTranscriptById(modelMsgId, streamed.replace(/[*#`_]/g, "").trim() || "...");
						}
					});
					if (sessionRunIdRef.current !== runId) return;
					const finalReply = reply || cleanSpokenText(localHit.answer);
					updateTranscriptById(modelMsgId, finalReply);
					setIsThinking(false);
					speakOfflineReply(finalReply, runId);
					return;
				} catch {
					const fallbackReply = cleanSpokenText(localHit.answer).slice(0, 650);
					updateTranscriptById(modelMsgId, fallbackReply);
					setIsThinking(false);
					speakOfflineReply(fallbackReply, runId);
					return;
				}
			}
			const spokenVersion = hasExactLocalHit ? cleanSpokenText(localHit.answer).slice(0, 650) : liveRole === "english" ? `I heard: "${cleanQuestion}". For full AI answers to any question offline, please download the Offline AI Pack (250MB Fast or 500MB Pro) once while online. Right now you can ask any math sum or WBBSE syllabus topic like Photosynthesis, Newton's Laws, or Battle of Plassey.` : `আমি শুনেছি: "${cleanQuestion}"। যেকোনো প্রশ্নে অনলাইনের মতো পূর্ণাঙ্গ অফলাইন লাইভ উত্তর পেতে একবার ইন্টারনেট অন করে "Offline AI (250 MB / 500 MB)" প্যাকটি ডাউনলোড করে নিন। এখনই আপনি যেকোনো অঙ্ক (যেমন ২৫ গুণ ১৪) বা পাঠ্যবইয়ের বিষয় যেমন সালোকসংশ্লেষ, নিউটনের সূত্র, পলাশীর যুদ্ধ বা ওহমের সূত্র জিজ্ঞেস করতে পারেন।`;
			appendTranscript("model", spokenVersion);
			setIsThinking(false);
			speakOfflineReply(spokenVersion, runId);
		} finally {
			isProcessingTurnRef.current = false;
			setIsThinking(false);
		}
	}, [
		appendTranscript,
		speakOfflineReply,
		stopTeacherSpeaking,
		updateTranscriptById
	]);
	const flushRecordedUtterance = (0, import_react.useCallback)(async (runId) => {
		if (sessionRunIdRef.current !== runId) return;
		const chunks = utteranceChunksRef.current;
		utteranceChunksRef.current = [];
		speechStartedAtRef.current = 0;
		if (chunks.length === 0 || isProcessingTurnRef.current) return;
		const pcm16k = concatFloat32Chunks(chunks);
		if (pcm16k.length < 5600) return;
		if (!isOfflineAiPackInstalled() || !isOfflineFeatureAllowed("live")) return;
		isProcessingTurnRef.current = true;
		setInterimUserText(activeOptionsRef.current.liveRole === "english" ? "Understanding your voice offline..." : "অফলাইনে আপনার কথা বোঝা হচ্ছে...");
		try {
			const lang = activeOptionsRef.current.liveRole === "english" ? "english" : "bengali";
			const recognized = await transcribeOfflineAudio(pcm16k, lang);
			if (sessionRunIdRef.current !== runId) return;
			setInterimUserText("");
			const cleaned = recognized.replace(/\[BLANK_AUDIO\]|\(music\)|\(silence\)/gi, "").trim();
			if (cleaned.length >= 2) {
				isProcessingTurnRef.current = false;
				await respondToStudentInput(cleaned, runId);
			} else isProcessingTurnRef.current = false;
		} catch {
			if (sessionRunIdRef.current === runId) setInterimUserText("");
			isProcessingTurnRef.current = false;
		}
	}, [respondToStudentInput]);
	const stopSession = (0, import_react.useCallback)((preserveError = false) => {
		sessionRunIdRef.current += 1;
		stopTeacherSpeaking();
		isProcessingTurnRef.current = false;
		setIsThinking(false);
		utteranceChunksRef.current = [];
		speechStartedAtRef.current = 0;
		if (speechRecRef.current) {
			try {
				speechRecRef.current.abort();
			} catch {}
			speechRecRef.current = null;
		}
		if (processorRef.current) {
			processorRef.current.onaudioprocess = null;
			try {
				processorRef.current.disconnect();
			} catch {}
			processorRef.current = null;
		}
		if (sourceRef.current) {
			try {
				sourceRef.current.disconnect();
			} catch {}
			sourceRef.current = null;
		}
		if (silentGainRef.current) {
			try {
				silentGainRef.current.disconnect();
			} catch {}
			silentGainRef.current = null;
		}
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((t) => t.stop());
			mediaStreamRef.current = null;
		}
		if (audioCtxRef.current) {
			if (audioCtxRef.current.state !== "closed") audioCtxRef.current.close().catch(() => {});
			audioCtxRef.current = null;
		}
		setMicLevel(0);
		setInterimUserText("");
		if (!preserveError) setStatus("idle");
	}, [stopTeacherSpeaking]);
	const startBrowserOfflineSpeechLoop = (0, import_react.useCallback)((runId) => {
		const Ctor = getBrowserSpeechRecognition();
		if (!Ctor) return;
		const launch = () => {
			if (sessionRunIdRef.current !== runId) return;
			if (isMutedRef.current || isTeacherSpeakingRef.current || isProcessingTurnRef.current) {
				window.setTimeout(launch, 450);
				return;
			}
			const rec = new Ctor();
			rec.lang = activeOptionsRef.current.liveRole === "english" ? "en-IN" : "bn-IN";
			rec.continuous = false;
			rec.interimResults = true;
			rec.maxAlternatives = 1;
			let finalCaptured = "";
			rec.onresult = (ev) => {
				if (sessionRunIdRef.current !== runId) return;
				let interim = "";
				for (let i = ev.resultIndex; i < ev.results.length; i += 1) {
					const res = ev.results[i];
					const txt = res[0]?.transcript ?? "";
					if (res.isFinal) finalCaptured += txt;
					else interim += txt;
				}
				setInterimUserText(interim.trim());
			};
			rec.onerror = (ev) => {
				if (ev.error === "network") {
					speechRecRef.current = null;
					setInterimUserText("");
					return;
				}
			};
			rec.onend = () => {
				speechRecRef.current = null;
				setInterimUserText("");
				const spoken = finalCaptured.trim();
				if (spoken && sessionRunIdRef.current === runId) respondToStudentInput(spoken, runId).finally(() => {
					if (sessionRunIdRef.current === runId) window.setTimeout(launch, 500);
				});
				else if (sessionRunIdRef.current === runId && (!isOfflineAiPackInstalled() || !isOfflineFeatureAllowed("live"))) window.setTimeout(launch, 700);
			};
			speechRecRef.current = rec;
			try {
				rec.start();
			} catch {
				speechRecRef.current = null;
			}
		};
		launch();
	}, [respondToStudentInput]);
	const startSession = (0, import_react.useCallback)(async (options) => {
		stopSession();
		const runId = ++sessionRunIdRef.current;
		activeOptionsRef.current = options;
		setError(null);
		setTranscripts([]);
		setIsMuted(false);
		isMutedRef.current = false;
		setStatus("connecting");
		if (isOfflineAiPackInstalled() && !isOfflineFeatureAllowed("live")) {
			setStatus("idle");
			setError("অনলি ক্লাস ৮ (১০০ MB) প্যাকে AI Live চালু নেই — এতে শুধু মেসেজ, ভয়েস ও PDF কাজ করে। লাইভ কথা বলতে ২৫০ MB বা ৫০০ MB প্যাক ডাউনলোড করো।");
			return;
		}
		const hasAiPack = isOfflineAiPackInstalled() && isOfflineFeatureAllowed("live");
		try {
			if (navigator.mediaDevices?.getUserMedia) try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
					channelCount: 1
				} });
				if (sessionRunIdRef.current !== runId) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				mediaStreamRef.current = stream;
				const ctx = new (window.AudioContext || window.webkitAudioContext)();
				audioCtxRef.current = ctx;
				if (ctx.state === "suspended") await ctx.resume().catch(() => {});
				const source = ctx.createMediaStreamSource(stream);
				const processor = ctx.createScriptProcessor(4096, 1, 1);
				const silentGain = ctx.createGain();
				silentGain.gain.value = 0;
				sourceRef.current = source;
				processorRef.current = processor;
				silentGainRef.current = silentGain;
				processor.onaudioprocess = (ev) => {
					if (sessionRunIdRef.current !== runId) return;
					const raw = ev.inputBuffer.getChannelData(0);
					if (isMutedRef.current || isTeacherSpeakingRef.current || isProcessingTurnRef.current) {
						setMicLevel(0);
						return;
					}
					let sumSq = 0;
					for (let i = 0; i < raw.length; i += 8) sumSq += raw[i] * raw[i];
					const rms = Math.sqrt(sumSq / Math.max(1, raw.length / 8));
					const nowMs = performance.now();
					if (nowMs - lastMicMeterAtRef.current >= 160) {
						lastMicMeterAtRef.current = nowMs;
						setMicLevel(Math.min(1, rms * 5.5));
					}
					if (hasAiPack) {
						const VOICE_THRESHOLD = .018;
						const SILENCE_MS = 1350;
						const MAX_UTTERANCE_MS = 14e3;
						if (rms >= VOICE_THRESHOLD) {
							if (speechStartedAtRef.current === 0) {
								speechStartedAtRef.current = nowMs;
								setInterimUserText(activeOptionsRef.current.liveRole === "english" ? "Listening..." : "শুনছি...");
							}
							lastVoiceAtRef.current = nowMs;
							utteranceChunksRef.current.push(downsampleTo16k(raw, ctx.sampleRate));
						} else if (speechStartedAtRef.current > 0) {
							utteranceChunksRef.current.push(downsampleTo16k(raw, ctx.sampleRate));
							const silentFor = nowMs - lastVoiceAtRef.current;
							const totalDuration = nowMs - speechStartedAtRef.current;
							if (silentFor >= SILENCE_MS || totalDuration >= MAX_UTTERANCE_MS) flushRecordedUtterance(runId);
						}
					}
				};
				source.connect(processor);
				processor.connect(silentGain);
				silentGain.connect(ctx.destination);
			} catch {
				setError(options.liveRole === "english" ? "Microphone is unavailable. You can still type or snap a book photo in Offline Live Mode." : "মাইক্রোফোন পারমিশন পাওয়া যায়নি। তবে নিচে লিখে বা বইয়ের ছবি তুলে অফলাইন লাইভ টিচারের সাথে কথা বলতে পারবেন।");
			}
			if (sessionRunIdRef.current !== runId) return;
			setStatus("connected");
			if (!hasAiPack) startBrowserOfflineSpeechLoop(runId);
			const greetName = options.studentName?.trim() || "";
			const welcome = options.liveRole === "english" ? hasAiPack ? `Hello${greetName ? ` ${greetName}` : ""}! Offline Live Teacher is ready for ${options.className}! Speak naturally or show a book photo — zero internet needed.` : `Hello${greetName ? ` ${greetName}` : ""}! Offline Live Teacher is connected for ${options.className}. Ask WBBSE notes, math sums, or download the 250 MB / 500 MB Offline AI Pack once for full AI voice conversations.` : hasAiPack ? `নমস্কার${greetName ? ` ${greetName}` : ""}! অফলাইন লাইভ টিচার তৈরি (${options.className})! ইন্টারনেট ছাড়াই সরাসরি কথা বলো বা বইয়ের ছবি দেখাও — আমি উত্তর দেব।` : `নমস্কার${greetName ? ` ${greetName}` : ""}! অফলাইন লাইভ টিচার চালু হয়েছে (${options.className})! এখনই অঙ্ক বা WBBSE নোটস জিজ্ঞেস করো, আর একদম অনলাইনের মতো অফলাইন লাইভ কথা বলার জন্য একবার Offline AI (250 MB / 500 MB) প্যাক ডাউনলোড করে নাও।`;
			appendTranscript("model", welcome);
			speakOfflineReply(welcome, runId);
		} catch (err) {
			if (sessionRunIdRef.current !== runId) return;
			setError(err instanceof Error ? err.message : "Could not start Offline Live Mode.");
			setStatus("error");
		}
	}, [
		appendTranscript,
		flushRecordedUtterance,
		speakOfflineReply,
		startBrowserOfflineSpeechLoop,
		stopSession
	]);
	const sendLiveText = (0, import_react.useCallback)((text) => {
		const clean = text.trim();
		if (!clean || status !== "connected") return;
		respondToStudentInput(clean, sessionRunIdRef.current);
	}, [respondToStudentInput, status]);
	const sendLiveImage = (0, import_react.useCallback)((options) => {
		if (status !== "connected") return;
		const runId = sessionRunIdRef.current;
		const caption = options.caption?.trim() || "";
		appendTranscript("user", caption || (activeOptionsRef.current.liveRole === "english" ? "Sent book photo (Offline OCR)" : "বইয়ের ছবি পাঠানো হয়েছে (অফলাইন স্ক্যান)"), options.dataUrl);
		setIsThinking(true);
		setInterimUserText(activeOptionsRef.current.liveRole === "english" ? "Reading book photo offline..." : "অফলাইনে বইয়ের ছবি পড়া হচ্ছে...");
		extractTextFromImageOffline(options.dataUrl).then(async (extracted) => {
			if (sessionRunIdRef.current !== runId) return;
			setInterimUserText("");
			const combined = [caption, extracted].filter(Boolean).join("\n").trim();
			if (!combined) {
				const msg = activeOptionsRef.current.liveRole === "english" ? "Could not read clear text from that photo offline. Please try a brighter photo or type the question below." : "ছবি থেকে স্পষ্ট লেখা পড়া যায়নি। একটু পরিষ্কার আলোয় ছবি তুলুন অথবা প্রশ্নটি নিচে লিখে পাঠান।";
				appendTranscript("model", msg);
				setIsThinking(false);
				speakOfflineReply(msg, runId);
				return;
			}
			await respondToStudentInput(combined, runId, { skipAppendUser: true });
		});
	}, [
		appendTranscript,
		respondToStudentInput,
		speakOfflineReply,
		status
	]);
	const sendLiveVideoFrame = (0, import_react.useCallback)(() => {}, []);
	const toggleMute = (0, import_react.useCallback)(() => {
		setIsMuted((prev) => !prev);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			stopSession();
		};
	}, [stopSession]);
	return {
		status,
		error,
		isMuted,
		isTeacherSpeaking,
		isThinking,
		micLevel,
		interimUserText,
		transcripts,
		startSession,
		stopSession,
		toggleMute,
		stopTeacherSpeaking,
		sendLiveText,
		sendLiveImage,
		sendLiveVideoFrame
	};
}
// src/components/LiveTeacherModal.tsx
var import_jsx_runtime = require_jsx_runtime();
var LIVE_VOICES = [
	{
		value: "Zephyr",
		label: "Zephyr (Calm)"
	},
	{
		value: "Kore",
		label: "Kore (Warm)"
	},
	{
		value: "Puck",
		label: "Puck (Bright)"
	},
	{
		value: "Charon",
		label: "Charon (Deep)"
	}
];
var WAVE_BAR_HEIGHTS = [
	24,
	38,
	52,
	62,
	52,
	38,
	24
];
function LiveTeacherModal({ isOpen, onClose, classNameLevel, voice, onVoiceChange, defaultLiveRole = "bengali", initialInteractionMode = "voice", enableCamera = true, studentName = "", onOpenOfflineAiPack }) {
	const isOnline = useOnlineStatus();
	const [interactionMode, setInteractionMode] = (0, import_react.useState)(initialInteractionMode);
	const [preferOfflineEngine, setPreferOfflineEngine] = (0, import_react.useState)(false);
	const [offlinePackSupportsLive, setOfflinePackSupportsLive] = (0, import_react.useState)(() => {
		const tier = getOfflineAiState().installedTier;
		return tier === "standard" || tier === "pro";
	});
	const [liveRole, setLiveRole] = (0, import_react.useState)(defaultLiveRole);
	const [quickMessage, setQuickMessage] = (0, import_react.useState)("");
	const [isCameraOpen, setIsCameraOpen] = (0, import_react.useState)(false);
	const [isLiveVideoOn, setIsLiveVideoOn] = (0, import_react.useState)(false);
	const [facingMode, setFacingMode] = (0, import_react.useState)("environment");
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const [isStartingCamera, setIsStartingCamera] = (0, import_react.useState)(false);
	const [cameraResolution, setCameraResolution] = (0, import_react.useState)(null);
	const transcriptEndRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const cameraStreamRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return subscribeOfflineAiState((s) => {
			setOfflinePackSupportsLive(s.installedTier === "standard" || s.installedTier === "pro");
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (isOpen) setInteractionMode(initialInteractionMode);
	}, [isOpen, initialInteractionMode]);
	const useOfflineMode = !isOnline || preferOfflineEngine;
	const isVoiceOnly = interactionMode === "voice";
	const onlineLive = useLiveTeacher();
	const offlineLive = useOfflineLiveTeacher();
	const { status, error, isMuted, isTeacherSpeaking, micLevel, interimUserText, transcripts, startSession, stopSession, toggleMute, stopTeacherSpeaking, sendLiveText, sendLiveImage, sendLiveVideoFrame } = useOfflineMode ? offlineLive : onlineLive;
	const isOfflineThinking = useOfflineMode ? offlineLive.isThinking : false;
	const stopCameraStream = (0, import_react.useCallback)(() => {
		setIsLiveVideoOn(false);
		setCameraResolution(null);
		if (cameraStreamRef.current) {
			cameraStreamRef.current.getTracks().forEach((track) => track.stop());
			cameraStreamRef.current = null;
		}
		if (videoRef.current) videoRef.current.srcObject = null;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			setLiveRole(defaultLiveRole);
			setPreferOfflineEngine(false);
		}
	}, [defaultLiveRole, isOpen]);
	(0, import_react.useEffect)(() => {
		if (!enableCamera) {
			stopCameraStream();
			setIsCameraOpen(false);
		}
	}, [enableCamera, stopCameraStream]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			stopCameraStream();
			setIsCameraOpen(false);
			onlineLive.stopSession();
			offlineLive.stopSession();
			return;
		}
		if (useOfflineMode) {
			onlineLive.stopSession();
			offlineLive.startSession({
				className: classNameLevel,
				voiceName: voice,
				liveRole,
				voiceOnly: isVoiceOnly,
				studentName: studentName.trim() || void 0
			});
		} else {
			offlineLive.stopSession();
			onlineLive.startSession({
				className: classNameLevel,
				voiceName: voice,
				liveRole,
				voiceOnly: isVoiceOnly,
				studentName: studentName.trim() || void 0
			});
		}
		return () => {
			stopCameraStream();
			onlineLive.stopSession();
			offlineLive.stopSession();
		};
	}, [
		isOpen,
		useOfflineMode,
		isVoiceOnly,
		classNameLevel,
		voice,
		liveRole,
		studentName,
		onlineLive.startSession,
		onlineLive.stopSession,
		offlineLive.startSession,
		offlineLive.stopSession,
		stopCameraStream
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen || !isCameraOpen) {
			stopCameraStream();
			return;
		}
		let cancelled = false;
		async function startCamera() {
			setIsStartingCamera(true);
			setCameraError(null);
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				setCameraError("Live camera is unavailable here. Use the Photo button to take or upload a book photo.");
				setIsStartingCamera(false);
				return;
			}
			try {
				if (cameraStreamRef.current) cameraStreamRef.current.getTracks().forEach((track) => track.stop());
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: { ideal: facingMode },
						width: { ideal: 1920 },
						height: { ideal: 1080 },
						frameRate: { ideal: 30 }
					},
					audio: false
				});
				if (cancelled) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}
				const videoTrack = stream.getVideoTracks()[0];
				if (videoTrack && typeof videoTrack.applyConstraints === "function") {
					if ((typeof videoTrack.getCapabilities === "function" ? videoTrack.getCapabilities() : null)?.focusMode?.includes("continuous")) videoTrack.applyConstraints({ advanced: [{ focusMode: "continuous" }] }).catch(() => {});
				}
				cameraStreamRef.current = stream;
				if (videoRef.current) videoRef.current.srcObject = stream;
			} catch {
				if (!cancelled) setCameraError("Camera permission was denied or unavailable. You can still upload or snap a book photo using the Photo button.");
			} finally {
				if (!cancelled) setIsStartingCamera(false);
			}
		}
		startCamera();
		return () => {
			cancelled = true;
			stopCameraStream();
		};
	}, [
		isOpen,
		isCameraOpen,
		facingMode,
		stopCameraStream
	]);
	const captureVideoFrame = (0, import_react.useCallback)((maxDim, quality) => {
		try {
			const video = videoRef.current;
			if (!video || !video.videoWidth || !video.videoHeight) return null;
			const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
			const width = Math.max(1, Math.round(video.videoWidth * scale));
			const height = Math.max(1, Math.round(video.videoHeight * scale));
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) return null;
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
			ctx.drawImage(video, 0, 0, width, height);
			const dataUrl = canvas.toDataURL("image/jpeg", quality);
			const base64 = dataUrl.split(",")[1] || "";
			if (!base64) return null;
			return {
				dataUrl,
				base64,
				mimeType: "image/jpeg"
			};
		} catch {
			return null;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isOpen || !isCameraOpen || !isLiveVideoOn || status !== "connected" || cameraError) return;
		const sendFrame = () => {
			const frame = captureVideoFrame(1024, .8);
			if (frame) sendLiveVideoFrame(frame.base64, frame.mimeType);
		};
		sendFrame();
		const timer = window.setInterval(sendFrame, 1e3);
		return () => window.clearInterval(timer);
	}, [
		isOpen,
		isCameraOpen,
		isLiveVideoOn,
		status,
		cameraError,
		captureVideoFrame,
		sendLiveVideoFrame
	]);
	(0, import_react.useEffect)(() => {
		if (!isVoiceOnly) transcriptEndRef.current?.scrollIntoView({
			behavior: "auto",
			block: "end"
		});
	}, [
		transcripts,
		interimUserText,
		isVoiceOnly
	]);
	if (!isOpen) return null;
	const handleEnd = () => {
		const snapshot = isVoiceOnly ? [] : [...transcripts];
		stopCameraStream();
		setIsCameraOpen(false);
		stopSession();
		onClose(snapshot);
	};
	const handleSendText = (e) => {
		e.preventDefault();
		if (!quickMessage.trim() || status !== "connected") return;
		sendLiveText(quickMessage);
		setQuickMessage("");
	};
	const handleCaptureAndSend = () => {
		if (status !== "connected") return;
		const frame = captureVideoFrame(1920, .92);
		if (!frame) return;
		sendLiveImage({
			base64: frame.base64,
			mimeType: frame.mimeType,
			dataUrl: frame.dataUrl,
			caption: isVoiceOnly ? "" : quickMessage
		});
		setQuickMessage("");
		if (!isLiveVideoOn) setIsCameraOpen(false);
	};
	const handlePhotoFileChange = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file || status !== "connected") return;
		let bitmapUrl = null;
		try {
			bitmapUrl = URL.createObjectURL(file);
			const img = new Image();
			img.src = bitmapUrl;
			await new Promise((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image"));
			});
			const scale = Math.min(1, 1920 / Math.max(img.width, img.height));
			const width = Math.max(1, Math.round(img.width * scale));
			const height = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
			ctx.drawImage(img, 0, 0, width, height);
			const dataUrl = canvas.toDataURL("image/jpeg", .92);
			const base64 = dataUrl.split(",")[1] || "";
			if (!base64) return;
			sendLiveImage({
				base64,
				mimeType: "image/jpeg",
				dataUrl,
				caption: isVoiceOnly ? "" : quickMessage
			});
			setQuickMessage("");
			setCameraError(null);
			setIsCameraOpen(false);
		} catch {
			setCameraError("Could not read that image file. Please try another JPG or PNG photo.");
			setIsCameraOpen(true);
		} finally {
			if (bitmapUrl) URL.revokeObjectURL(bitmapUrl);
		}
	};
	const voiceOrbScale = isMuted ? .94 : isTeacherSpeaking ? 1.07 : 1 + Math.min(.16, micLevel * .18);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 dark:bg-black/82 backdrop-blur-md p-2.5 sm:p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Live Voice Teacher",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-4xl h-[92vh] max-h-[95vh] rounded-3xl bg-white dark:bg-[#090b17] border border-slate-200 dark:border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none hidden dark:block absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-35 blur-3xl",
					style: { background: "radial-gradient(circle, #ff2a54, #7c3aed)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none hidden dark:block absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-35 blur-3xl",
					style: { background: "radial-gradient(circle, #06b6d4, #6366f1)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1f]/90 backdrop-blur-xl flex items-center justify-between gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${status === "connected" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : status === "error" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30" : "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border border-fuchsia-500/30"}`,
							children: status === "connecting" || isOfflineThinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : useOfflineMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "w-4 h-4" }) : isVoiceOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate",
									children: isVoiceOnly ? useOfflineMode ? "AI Live (Offline Direct Voice)" : "AI Live — সরাসরি কথা" : useOfflineMode ? "Text Live (Offline)" : "Text Live — টেক্সট ও ভয়েস"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${useOfflineMode ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"}`,
									children: useOfflineMode ? offlinePackSupportsLive ? "OFFLINE AI" : "OFFLINE" : "LIVE"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate",
								children: status === "connecting" ? useOfflineMode ? "অফলাইন লাইভ টিচার চালু হচ্ছে..." : "লাইভ ভয়েস সংযোগ হচ্ছে..." : isOfflineThinking ? "অফলাইন AI উত্তর তৈরি করছে..." : status === "connected" ? isTeacherSpeaking ? "AI টিচার সরাসরি বলছেন..." : isMuted ? "মাইক্রোফোন মিউট করা আছে" : isVoiceOnly ? "কোনো লেখালেখি নেই — সরাসরি কথা বলুন" : "কথা বলুন অথবা নিচে লিখে পাঠান" : status === "error" ? "সংযোগে সমস্যা হয়েছে" : "প্রস্তুত"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 shrink-0",
						children: [isOnline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPreferOfflineEngine((prev) => !prev),
							title: useOfflineMode ? "Switch back to Online Cloud Live" : "Switch to Offline On-Device Live Teacher",
							className: `min-h-[34px] px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-colors whitespace-nowrap ${useOfflineMode ? "border-amber-400/50 bg-amber-500/15 text-amber-800 dark:text-amber-200" : "border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"}`,
							children: useOfflineMode ? "Online Live" : "Offline Live"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleEnd,
							"aria-label": "Close Live Mode",
							className: "min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 px-4 sm:px-5 py-2.5 bg-slate-50/90 dark:bg-[#0e1124]/90 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/8 border border-slate-200/80 dark:border-white/10",
						role: "tablist",
						"aria-label": "Live interaction mode",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "tab",
							"aria-selected": isVoiceOnly,
							onClick: () => setInteractionMode("voice"),
							className: `min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all whitespace-nowrap ${isVoiceOnly ? "wbsec-btn-neon-voice text-white" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { className: "w-3.5 h-3.5" }), "AI Live (সরাসরি কথা)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "tab",
							"aria-selected": !isVoiceOnly,
							onClick: () => setInteractionMode("text"),
							className: `min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all whitespace-nowrap ${!isVoiceOnly ? "bg-cyan-500 text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.45)]" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareText, { className: "w-3.5 h-3.5" }), "Text Live"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center p-0.5 rounded-xl bg-slate-200/80 dark:bg-white/8 border border-slate-200/70 dark:border-white/10",
							role: "group",
							"aria-label": "Live teacher language",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLiveRole("bengali"),
									className: `min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${liveRole === "bengali" ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
									children: "বাংলা"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLiveRole("english"),
									className: `min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${liveRole === "english" ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
									children: "English"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLiveRole("bilingual"),
									className: `min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${liveRole === "bilingual" ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
									children: "EN + বাংলা"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: voice,
							onChange: (e) => onVoiceChange(e.target.value),
							"aria-label": "Live teacher voice",
							className: "min-h-[34px] px-2.5 py-1 rounded-xl bg-white dark:bg-[#13172e] border border-slate-200 dark:border-white/15 text-xs font-medium text-slate-700 dark:text-slate-100 focus:border-cyan-400 focus:outline-none",
							children: LIVE_VOICES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v.value,
								children: v.label
							}, v.value))
						})]
					})]
				}),
				isVoiceOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex-1 overflow-y-auto px-5 py-6 flex flex-col items-center justify-center text-center gap-5 min-h-[240px]",
					children: [
						useOfflineMode && !offlinePackSupportsLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-lg rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-700/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-left",
								children: [
									"অফলাইনে পূর্ণ AI Live পেতে ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "250 MB (Fast)" }),
									" বা ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "500 MB (Pro)" }),
									" প্যাক ডাউনলোড করুন।"
								]
							}), onOpenOfflineAiPack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									handleEnd();
									onOpenOfflineAiPack();
								},
								className: "min-h-[30px] px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), "ডাউনলোড"]
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-lg rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 px-4 py-3 text-xs sm:text-sm text-rose-700 dark:text-rose-200 flex items-center justify-between gap-3 text-left",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => startSession({
									className: classNameLevel,
									voiceName: voice,
									liveRole,
									voiceOnly: true
								}),
								className: "px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shrink-0",
								children: "Retry"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "wbsec-live-orb-shell my-1",
							children: [status === "connected" && !isMuted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "wbsec-live-ring",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "wbsec-live-ring wbsec-live-ring-2",
								"aria-hidden": "true"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `wbsec-live-orb ${isTeacherSpeaking ? "is-speaking" : ""} ${isMuted ? "is-muted" : ""}`,
								style: { transform: `scale(${voiceOrbScale.toFixed(3)})` },
								"aria-hidden": "true"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 flex items-center justify-center gap-1.5",
							"aria-hidden": "true",
							children: WAVE_BAR_HEIGHTS.map((maxH, idx) => {
								const active = status === "connected" && !isMuted && (isTeacherSpeaking || isOfflineThinking || micLevel > .08);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "wbsec-wave-bar",
									style: {
										height: `${active ? maxH : 12}px`,
										opacity: active ? .95 : .25,
										animationDelay: `${idx * .11}s`,
										animationPlayState: active ? "running" : "paused"
									}
								}, idx);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 max-w-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight",
								children: status === "connecting" ? "AI টিচারের সাথে সংযোগ হচ্ছে..." : isOfflineThinking ? "AI টিচার ভাবছেন..." : isTeacherSpeaking ? "AI টিচার কথা বলছেন..." : isMuted ? "মাইক মিউট করা আছে" : status === "connected" ? liveRole === "english" ? "Listening — Speak directly in English" : liveRole === "bilingual" ? "শুনছি — বাংলা বা ইংরেজিতে সরাসরি কথা বলুন" : "শুনছি — সরাসরি বাংলায় কথা বলুন" : "লাইভ কল প্রস্তুত"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400",
								children: liveRole === "english" ? "Direct voice-to-voice conversation • No typing needed" : "কোনো লেখালেখি নেই • সরাসরি ফোনের মতো কথা বলুন (শুধু বিশুদ্ধ বাংলায় উত্তর পাবেন)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2.5 min-h-[40px]",
							children: [status === "connected" && isTeacherSpeaking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: stopTeacherSpeaking,
								className: "min-h-[40px] px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-[0_0_24px_rgba(244,63,94,0.55)] active:scale-95 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3.5 h-3.5 fill-current" }), "কথা থামান (Stop Voice)"]
							}), status === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => startSession({
									className: classNameLevel,
									voiceName: voice,
									liveRole,
									voiceOnly: true
								}),
								className: "min-h-[42px] px-5 py-2 rounded-full wbsec-btn-neon-voice text-sm font-bold",
								children: "আবার সংযোগ করুন (Reconnect)"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex-1 overflow-y-auto px-4 sm:px-7 py-5 space-y-4 min-h-[140px]",
					children: [
						useOfflineMode && !offlinePackSupportsLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 px-4 py-3 flex flex-wrap items-center justify-between gap-2.5 text-xs text-amber-950 dark:text-amber-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"অফলাইনে পূর্ণ AI লাইভ পেতে ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "250 MB ফাস্ট" }),
									" বা ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "500 MB প্রো" }),
									" প্যাক ডাউনলোড করুন।"
								] })]
							}), onOpenOfflineAiPack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									handleEnd();
									onOpenOfflineAiPack();
								},
								className: "min-h-[32px] px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), "Offline AI প্যাক"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-slate-200 dark:border-white/12 bg-slate-50/80 dark:bg-white/5 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-10 h-10 rounded-full flex items-center justify-center transition-transform ${isTeacherSpeaking ? "bg-fuchsia-600 text-white scale-105 shadow-[0_0_18px_rgba(217,70,239,0.6)]" : isOfflineThinking ? "bg-amber-500 text-white" : status === "connected" && !isMuted ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`,
									style: { boxShadow: status === "connected" && !isMuted && !isTeacherSpeaking && !isOfflineThinking ? `0 0 0 ${Math.round(micLevel * 12)}px rgba(16, 185, 129, 0.28)` : void 0 },
									children: isOfflineThinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : isTeacherSpeaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-5 h-5" }) : isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-slate-900 dark:text-white",
									children: status === "connecting" ? "Starting Text Live..." : isOfflineThinking ? "Offline AI Thinking..." : isTeacherSpeaking ? "Teacher Speaking" : isMuted ? "Mic Muted" : "Listening & Ready to Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400",
									children: liveRole === "english" ? "Speak or type in English — live transcript + voice." : liveRole === "bengali" ? "বাংলায় বলুন বা নিচে লিখুন — সাথে সাথে ভয়েস ও লেখা পাবেন।" : "Speak or type in English or বাংলা."
								})] })]
							}), status === "connected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [isTeacherSpeaking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: stopTeacherSpeaking,
									className: "min-h-[36px] px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-rose-500 whitespace-nowrap shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3 h-3 fill-current" }), "Stop Voice"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => sendLiveText(liveRole === "bengali" ? "হ্যালো স্যার!" : liveRole === "bilingual" ? "Hello teacher! হ্যালো স্যার!" : "Hello teacher!"),
									className: "min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-cyan-400 whitespace-nowrap shrink-0",
									children: liveRole === "bengali" ? "হ্যালো বলুন" : "Say Hi"
								})]
							}) : status === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => startSession({
									className: classNameLevel,
									voiceName: voice,
									liveRole,
									voiceOnly: false
								}),
								className: "min-h-[36px] px-3 py-1.5 rounded-xl wbsec-btn-neon-voice text-xs font-semibold whitespace-nowrap shrink-0",
								children: "Reconnect"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/70 px-4 py-3 text-xs sm:text-sm text-rose-700 dark:text-rose-300 flex items-start justify-between gap-3",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => startSession({
									className: classNameLevel,
									voiceName: voice,
									liveRole,
									voiceOnly: false
								}),
								className: "px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950 shrink-0",
								children: "Retry"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3.5",
							children: [
								transcripts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-start gap-2.5 ${item.role === "user" ? "justify-end" : "justify-start"}`,
									children: [item.role === "model" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "wbsec-mini-orb mt-1 shrink-0",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 dark:text-slate-100 ${item.role === "user" ? "wbsec-bubble-user" : "wbsec-bubble-ai"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1",
												children: item.role === "user" ? "You" : "Wbsec Live Teacher"
											}),
											item.imageDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.imageDataUrl,
												alt: "Book photo sent to live teacher",
												className: "w-full max-w-[220px] max-h-48 rounded-xl border border-slate-200 dark:border-white/15 mb-1.5 object-cover"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.text })
										]
									})]
								}, item.id)),
								interimUserText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "max-w-[85%] rounded-2xl px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/15",
										children: [interimUserText, "..."]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: transcriptEndRef })
							]
						})
					]
				}),
				enableCamera && isCameraOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 px-4 sm:px-5 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0e1124] space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-800 dark:text-slate-100",
									children: liveRole === "bengali" ? "লাইভ এইচডি ক্যামেরা" : "Live HD Camera"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold",
									children: cameraResolution || "HD"
								}),
								isLiveVideoOn && !cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-white animate-pulse" }), "LIVE"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [!cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!useOfflineMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsLiveVideoOn((prev) => !prev),
								disabled: status !== "connected" || isStartingCamera,
								className: `min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border transition-colors disabled:opacity-50 ${isLiveVideoOn ? "bg-rose-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300" : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"}`,
								children: isLiveVideoOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "w-3.5 h-3.5" }), "Stop Video"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "w-3.5 h-3.5" }), "Live Video"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setFacingMode((prev) => prev === "environment" ? "user" : "environment"),
								"aria-label": "Switch camera",
								className: "min-h-[32px] px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/15 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), "Flip"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsCameraOpen(false),
								"aria-label": "Close live camera",
								className: "min-h-[32px] min-w-[32px] inline-flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						})]
					}), cameraError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-600 dark:text-slate-300",
							children: cameraError
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileInputRef.current?.click(),
							className: "min-h-[36px] px-3.5 py-1.5 rounded-lg wbsec-btn-neon-voice text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "w-3.5 h-3.5" }), liveRole === "bengali" ? "ছবি বাছাই করুন" : "Choose Book Photo"]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-44 sm:h-36 sm:w-60 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								autoPlay: true,
								playsInline: true,
								muted: true,
								onLoadedMetadata: (e) => {
									const v = e.currentTarget;
									if (v.videoWidth && v.videoHeight) {
										const minDim = Math.min(v.videoWidth, v.videoHeight);
										setCameraResolution(minDim >= 1e3 ? "HD 1080p" : minDim >= 700 ? "HD 720p" : `${v.videoWidth}×${v.videoHeight}`);
									}
								},
								className: "w-full h-full object-cover"
							}), isStartingCamera && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center bg-slate-900/65 text-white text-xs",
								children: "Starting HD camera..."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-600 dark:text-slate-300",
								children: liveRole === "bengali" ? "বই বা খাতার দিকে ক্যামেরা ধরে \"ছবি তুলে দেখান\" চাপুন, অথবা Live Video চালু করে সরাসরি দেখান।" : "Point the camera at your book and tap \"Snap & Show\", or enable Live Video so your teacher sees continuously."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleCaptureAndSend,
									disabled: status !== "connected" || isStartingCamera,
									className: "flex-1 min-h-[40px] px-3.5 py-2 rounded-xl wbsec-btn-neon-voice text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), liveRole === "bengali" ? "ছবি তুলে দেখান" : "Snap & Show"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => fileInputRef.current?.click(),
									disabled: status !== "connected",
									className: "min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 inline-flex items-center gap-1.5 disabled:opacity-50 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "w-4 h-4" }), "Gallery"]
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 px-4 sm:px-5 py-3.5 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0c0f1f]/95 backdrop-blur-xl space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: "image/*",
						onChange: handlePhotoFileChange,
						className: "hidden"
					}), isVoiceOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-3 sm:gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: toggleMute,
								disabled: status !== "connected",
								"aria-label": isMuted ? "Unmute Mic" : "Mute Mic",
								className: `min-h-[50px] px-4 sm:px-5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${isMuted ? "bg-amber-500/20 border-amber-400/60 text-amber-800 dark:text-amber-200" : "wbsec-neon-action-mic"}`,
								children: isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unmute" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mute" })] })
							}),
							enableCamera && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIsCameraOpen((prev) => !prev),
								disabled: status !== "connected",
								"aria-label": "Show book with camera",
								title: "Camera",
								className: `min-h-[50px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 ${isCameraOpen ? "bg-rose-600 text-white border border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]" : "wbsec-neon-action-camera"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Camera"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => fileInputRef.current?.click(),
								disabled: status !== "connected",
								"aria-label": "Show book photo",
								title: "Book photo",
								className: "min-h-[50px] px-4 py-2.5 rounded-2xl wbsec-neon-action-attach text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Photo"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleEnd,
								className: "min-h-[50px] px-5 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 shadow-[0_0_24px_rgba(244,63,94,0.5)] transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "End Call" })]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSendText,
						className: "flex items-center gap-2",
						children: [enableCamera && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setIsCameraOpen((prev) => !prev),
							disabled: status !== "connected",
							"aria-label": "Open camera in live mode",
							title: "Camera",
							className: `min-h-[42px] px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 ${isCameraOpen ? "bg-rose-600 border-rose-500 text-white" : "wbsec-neon-action-camera"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Camera"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileInputRef.current?.click(),
							disabled: status !== "connected",
							"aria-label": "Send book photo in live mode",
							title: "Upload book photo",
							className: "min-h-[42px] px-3 py-2 rounded-xl wbsec-neon-action-attach text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Photo"
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 wbsec-neon-input px-3 py-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: quickMessage,
								onChange: (e) => setQuickMessage(e.target.value),
								disabled: status !== "connected",
								placeholder: liveRole === "bengali" ? "এখানে প্রশ্ন লিখুন বা কথা বলুন..." : "Type a message or speak...",
								className: "flex-1 min-w-0 min-h-[34px] bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: status !== "connected" || !quickMessage.trim(),
								"aria-label": "Send text in live mode",
								className: "w-9 h-9 rounded-xl wbsec-neon-send inline-flex items-center justify-center disabled:opacity-45 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleMute,
							disabled: status !== "connected",
							className: `flex-1 min-h-[44px] px-4 py-2 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${isMuted ? "bg-amber-500/15 border-amber-400/60 text-amber-800 dark:text-amber-300" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"}`,
							children: isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-4 h-4" }), "Unmute Mic"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4" }), "Mute Mic"] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleEnd,
							className: "flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-rose-500 active:scale-[0.98] transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "w-4 h-4" }), "End Text Live"]
						})]
					})] })]
				})
			]
		})
	});
}
export { LiveTeacherModal };
