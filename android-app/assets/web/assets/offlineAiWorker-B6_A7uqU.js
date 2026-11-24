// src/offline/offlineAiTypes.ts
const OFFLINE_AI_PACKS = {
	pro: {
		tier: "pro",
		nameBn: "প্রো ৫০০ MB ফুল অফলাইন AI প্যাক",
		nameEn: "Pro 500 MB Structured Pack",
		badgeBn: "গুছিয়ে বিস্তারিত উত্তর",
		sizeLabel: "~500 MB",
		approxBytes: 524288e3,
		llmModelId: "onnx-community/Qwen2.5-0.5B-Instruct",
		llmLabel: "Qwen2.5 0.5B (Structured)",
		whisperModelId: "onnx-community/whisper-tiny",
		whisperLabel: "Whisper Voice (বাংলা + EN)",
		includeOcr: true,
		descriptionBn: "সব ক্লাস (Class 5–10) ও সব ফিচার — উত্তরগুলো পয়েন্ট করে, শিরোনাম ও উদাহরণ দিয়ে খুব ভালোভাবে গুছিয়ে দেবে।",
		recommendedForBn: "সেরা গুছানো উত্তর · সব ফিচার",
		highlightsBn: [
			"সব ফিচার: মেসেজ, ভয়েস, PDF, AI Live, কুইজ, ক্যামেরা ও ডিকশনারি",
			"উত্তরগুলো পয়েন্ট, হেডিং ও উদাহরণ দিয়ে সুন্দরভাবে গুছিয়ে দেয়",
			"WBBSE Class 5 থেকে Class 10 সব ক্লাসের জন্য"
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
			answerStyle: "structured"
		}
	},
	standard: {
		tier: "standard",
		nameBn: "ফাস্ট ২৫০ MB অল-ইন-ওয়ান প্যাক",
		nameEn: "Fast 250 MB All-in-One Pack",
		badgeBn: "সুপার ফাস্ট উত্তর",
		sizeLabel: "~250 MB",
		approxBytes: 262144e3,
		llmModelId: "onnx-community/SmolLM2-360M-Instruct-ONNX",
		llmLabel: "SmolLM2 360M (Ultra Fast)",
		whisperModelId: "onnx-community/whisper-tiny",
		whisperLabel: "Whisper Lite (বাংলা + EN)",
		includeOcr: true,
		descriptionBn: "কম ডেটায় সব ফিচার চলবে (মেসেজ, ভয়েস, PDF, AI Live, কুইজ, ক্যামেরা, ডিকশনারি) এবং উত্তর অনেক ফাস্ট দেবে।",
		recommendedForBn: "সব ফিচার · অনেক ফাস্ট উত্তর",
		highlightsBn: [
			"সব ফিচার চালু: মেসেজ, ভয়েস, PDF, AI Live, কুইজ, ক্যামেরা ও ডিকশনারি",
			"হালকা ইঞ্জিন হওয়ায় উত্তর অনেক ফাস্ট ও কম সময়ে দেয়",
			"WBBSE Class 5–10 সব ক্লাস ও কম RAM ফোনের জন্য দারুণ"
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
			answerStyle: "fast"
		}
	},
	class8: {
		tier: "class8",
		nameBn: "অনলি ক্লাস ৮ লাইট প্যাক (১০০ MB)",
		nameEn: "Only Class 8 Pack (100 MB)",
		badgeBn: "শুধু Class 8 · ১০০ MB",
		sizeLabel: "~100 MB",
		approxBytes: 104857600,
		llmModelId: "onnx-community/SmolLM2-135M-Instruct-ONNX",
		llmLabel: "SmolLM2 135M (Class 8)",
		whisperModelId: "onnx-community/whisper-tiny",
		whisperLabel: "Voice Lite (বাংলা + EN)",
		includeOcr: false,
		descriptionBn: "শুধুমাত্র Class 8-এর ছাত্রছাত্রীদের জন্য সবচেয়ে ছোট প্যাক। এতে শুধু মেসেজ, ভয়েস এবং PDF কাজ করবে — অন্য কোনো ফিচার (Live, Quiz, Camera, Dictionary) থাকবে না।",
		recommendedForBn: "শুধু Class 8 · মেসেজ, ভয়েস ও PDF",
		highlightsBn: [
			"শুধুমাত্র Class 8 (WBBSE) পড়াশোনা",
			"শুধু মেসেজ চ্যাট, ভয়েস এবং PDF ডাউনলোড চলবে",
			"AI Live, কুইজ, ক্যামেরা বা ডিকশনারি এই প্যাকে বন্ধ থাকবে"
		],
		capabilities: {
			allowMessage: true,
			allowVoice: true,
			allowPdf: true,
			allowLive: false,
			allowQuiz: false,
			allowCamera: false,
			allowDictionary: false,
			onlyClass: "Class 8",
			answerStyle: "class8-basic"
		}
	}
};
// src/offline/offlineAiWorker.ts
const TRANSFORMERS_CDN_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js";
let transformersPromise = null;
async function loadTransformers() {
	if (!transformersPromise) transformersPromise = (async () => {
		const mod = await import(
			/* @vite-ignore */
			TRANSFORMERS_CDN_URL
);
		mod.env.allowLocalModels = false;
		mod.env.allowRemoteModels = true;
		mod.env.useBrowserCache = true;
		if (mod.env.backends?.onnx?.wasm) mod.env.backends.onnx.wasm.numThreads = typeof self !== "undefined" && self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 2) : 1;
		return mod;
	})().catch((err) => {
		transformersPromise = null;
		throw err;
	});
	return transformersPromise;
}
let llmPipeline = null;
let loadedLlmModelId = null;
let whisperPipeline = null;
let loadedWhisperModelId = null;
let activeBackend = "wasm";
let currentStopper = null;
async function detectBestDevice() {
	try {
		const nav = navigator;
		if (nav.gpu && typeof nav.gpu.requestAdapter === "function") {
			if (await nav.gpu.requestAdapter()) return "webgpu";
		}
	} catch {}
	return "wasm";
}
function createProgressTracker(stage, stageLabelBn) {
	const fileSizes = /* @__PURE__ */ new Map();
	let lastEmit = 0;
	return (info) => {
		if (!info || !info.file) return;
		if (info.status === "progress" || info.status === "downloading" || info.status === "done") {
			const prev = fileSizes.get(info.file) || {
				loaded: 0,
				total: 0
			};
			const total = typeof info.total === "number" && info.total > 0 ? info.total : prev.total;
			const loaded = info.status === "done" ? total || prev.loaded : typeof info.loaded === "number" ? info.loaded : prev.loaded;
			fileSizes.set(info.file, {
				loaded,
				total
			});
			const now = performance.now();
			if (info.status !== "done" && now - lastEmit < 120) return;
			lastEmit = now;
			let loadedBytes = 0;
			let totalBytes = 0;
			for (const entry of fileSizes.values()) {
				loadedBytes += entry.loaded;
				totalBytes += Math.max(entry.total, entry.loaded);
			}
			const percent = totalBytes > 0 ? Math.min(99, Math.round(loadedBytes / totalBytes * 100)) : Math.round(info.progress || 0);
			self.postMessage({
				type: "progress",
				stage,
				stageLabelBn,
				file: info.file,
				percent,
				loadedBytes,
				totalBytes
			});
		}
	};
}
async function ensureLlmLoaded(tier, localOnly = false) {
	const pack = OFFLINE_AI_PACKS[tier];
	if (llmPipeline && loadedLlmModelId === pack.llmModelId) return llmPipeline;
	if (llmPipeline) {
		try {
			await llmPipeline.dispose();
		} catch {}
		llmPipeline = null;
		loadedLlmModelId = null;
	}
	const { pipeline } = await loadTransformers();
	const preferredDevice = await detectBestDevice();
	const progressCb = createProgressTracker("llm", `অফলাইন AI ব্রেইন লোড হচ্ছে (${pack.llmLabel})...`);
	const loadAttempts = preferredDevice === "webgpu" ? [
		{
			device: "webgpu",
			dtype: "q4f16"
		},
		{
			device: "wasm",
			dtype: "q4f16"
		},
		{
			device: "wasm",
			dtype: "q8"
		}
	] : [{
		device: "wasm",
		dtype: "q4f16"
	}, {
		device: "wasm",
		dtype: "q8"
	}];
	let lastErr = null;
	for (const attempt of loadAttempts) try {
		llmPipeline = await pipeline("text-generation", pack.llmModelId, {
			device: attempt.device,
			dtype: attempt.dtype,
			local_files_only: localOnly,
			progress_callback: progressCb
		});
		activeBackend = attempt.device;
		lastErr = null;
		break;
	} catch (err) {
		lastErr = err;
	}
	if (!llmPipeline) throw lastErr instanceof Error ? lastErr : /* @__PURE__ */ new Error("অফলাইন AI মডেল লোড করা যায়নি। ইন্টারনেট চেক করে আবার চেষ্টা করো।");
	loadedLlmModelId = pack.llmModelId;
	return llmPipeline;
}
async function ensureWhisperLoaded(tier, localOnly = false) {
	const pack = OFFLINE_AI_PACKS[tier];
	if (whisperPipeline && loadedWhisperModelId === pack.whisperModelId) return whisperPipeline;
	if (whisperPipeline) {
		try {
			await whisperPipeline.dispose();
		} catch {}
		whisperPipeline = null;
		loadedWhisperModelId = null;
	}
	const { pipeline } = await loadTransformers();
	const progressCb = createProgressTracker("whisper", `অফলাইন ভয়েস ইঞ্জিন লোড হচ্ছে (${pack.whisperLabel})...`);
	whisperPipeline = await pipeline("automatic-speech-recognition", pack.whisperModelId, {
		device: "wasm",
		dtype: {
			encoder_model: "q8",
			decoder_model_merged: "q8"
		},
		local_files_only: localOnly,
		progress_callback: progressCb
	});
	loadedWhisperModelId = pack.whisperModelId;
	return whisperPipeline;
}
function extractGeneratedAssistantText(output) {
	if (Array.isArray(output) && output.length > 0) {
		const gen = output[0]?.generated_text;
		if (Array.isArray(gen) && gen.length > 0) {
			const lastMsg = gen[gen.length - 1];
			if (typeof lastMsg?.content === "string") return lastMsg.content.trim();
		}
		if (typeof gen === "string") return gen.trim();
	}
	return "";
}
self.onmessage = async (event) => {
	const msg = event.data;
	if (!msg) return;
	if (msg.type === "abort") {
		currentStopper?.interrupt();
		return;
	}
	if (msg.type === "unload") {
		try {
			await llmPipeline?.dispose();
		} catch {}
		try {
			await whisperPipeline?.dispose();
		} catch {}
		llmPipeline = null;
		whisperPipeline = null;
		loadedLlmModelId = null;
		loadedWhisperModelId = null;
		self.postMessage({
			id: msg.id,
			type: "unloaded"
		});
		return;
	}
	try {
		if (msg.type === "load-pack") {
			await ensureLlmLoaded(msg.tier, Boolean(msg.localOnly));
			if (msg.loadWhisper !== false) await ensureWhisperLoaded(msg.tier, Boolean(msg.localOnly));
			self.postMessage({
				id: msg.id,
				type: "pack-ready",
				tier: msg.tier,
				backend: activeBackend,
				llmLoaded: Boolean(llmPipeline),
				whisperLoaded: Boolean(whisperPipeline)
			});
			return;
		}
		if (msg.type === "chat") {
			const { TextStreamer, InterruptableStoppingCriteria } = await loadTransformers();
			const generator = await ensureLlmLoaded(msg.tier, !navigator.onLine);
			const stopper = new InterruptableStoppingCriteria();
			currentStopper = stopper;
			const effectiveClass = msg.tier === "class8" ? "Class 8" : msg.className;
			const styleInstruction = msg.tier === "pro" ? "Organize your answer very neatly and clearly: start with a short intro, use bold headings, clear bullet points or numbered steps, simple school-level examples, and a quick exam takeaway at the end. Keep formulas and dates accurate." : msg.tier === "standard" ? "Give a very fast, direct, accurate, and concise answer in short clear points so the student gets the exact solution immediately." : "You are exclusively a WBBSE Class 8 tutor. Give a simple, clear, concise Class 8 level explanation with key points.";
			const systemPrompt = [
				`You are Wbsec AI Teacher, a friendly, accurate West Bengal Board (WBBSE) tutor for ${effectiveClass} students.`,
				msg.studentName ? `The student's name is ${msg.studentName}. Warmly address them by name naturally.` : "",
				"Answer clearly in the same language the student uses (prefer clear, natural Bengali if asked in Bengali, or English if asked in English).",
				styleInstruction,
				msg.contextHint ? `\nReference study note for accuracy:\n${msg.contextHint.slice(0, 1200)}` : ""
			].filter(Boolean).join("\n");
			const recentTurns = msg.messages.slice(msg.tier === "pro" ? -6 : -4).map((m) => ({
				role: m.role === "model" ? "assistant" : "user",
				content: m.text.slice(0, msg.tier === "pro" ? 1400 : 800)
			}));
			const chatInput = [{
				role: "system",
				content: systemPrompt
			}, ...recentTurns];
			let streamedText = "";
			const streamer = new TextStreamer(generator.tokenizer, {
				skip_prompt: true,
				skip_special_tokens: true,
				callback_function: (tokenText) => {
					streamedText += tokenText;
					self.postMessage({
						id: msg.id,
						type: "chunk",
						text: tokenText
					});
				}
			});
			const isFastPack = msg.tier === "standard" || msg.tier === "class8";
			const defaultTokens = msg.tier === "pro" ? 520 : msg.tier === "standard" ? 240 : 260;
			const output = await generator(chatInput, {
				max_new_tokens: msg.maxNewTokens ?? defaultTokens,
				do_sample: !isFastPack,
				...isFastPack ? {} : {
					temperature: .4,
					top_p: .9
				},
				repetition_penalty: 1.12,
				streamer,
				stopping_criteria: [stopper]
			});
			currentStopper = null;
			const finalText = streamedText.trim() || extractGeneratedAssistantText(output);
			self.postMessage({
				id: msg.id,
				type: "done",
				text: finalText,
				backend: activeBackend
			});
			return;
		}
		if (msg.type === "live-reply") {
			const { TextStreamer, InterruptableStoppingCriteria } = await loadTransformers();
			const generator = await ensureLlmLoaded(msg.tier, !navigator.onLine);
			const stopper = new InterruptableStoppingCriteria();
			currentStopper = stopper;
			const roleRule = msg.liveRole === "english" ? "Reply ONLY in simple, warm spoken English (2 to 4 short sentences)." : msg.liveRole === "bilingual" ? "Reply briefly in BOTH simple English and natural Bengali (2 to 4 short sentences total)." : "Reply ONLY in natural, warm spoken Bengali (2 to 4 short sentences).";
			const systemPrompt = [
				`You are Wbsec Live Voice Teacher talking live to a West Bengal Board (WBBSE) ${msg.className} student.`,
				msg.studentName ? `The student's name is ${msg.studentName}. Address them warmly by name naturally.` : "",
				roleRule,
				"Speak naturally like a real teacher in a voice call. Do NOT use markdown symbols like *, #, or bullet lists. Keep your reply concise and easy to listen to.",
				msg.contextHint ? `\nReference textbook fact:\n${msg.contextHint.slice(0, 900)}` : ""
			].filter(Boolean).join("\n");
			const recentTurns = msg.history.slice(-6).map((m) => ({
				role: m.role === "model" ? "assistant" : "user",
				content: m.text.slice(0, 600)
			}));
			const chatInput = [
				{
					role: "system",
					content: systemPrompt
				},
				...recentTurns,
				{
					role: "user",
					content: msg.userText
				}
			];
			let streamedText = "";
			const streamer = new TextStreamer(generator.tokenizer, {
				skip_prompt: true,
				skip_special_tokens: true,
				callback_function: (tokenText) => {
					streamedText += tokenText;
					self.postMessage({
						id: msg.id,
						type: "chunk",
						text: tokenText
					});
				}
			});
			const isFastLive = msg.tier === "standard";
			const output = await generator(chatInput, {
				max_new_tokens: isFastLive ? 130 : 190,
				do_sample: !isFastLive,
				...isFastLive ? {} : {
					temperature: .48,
					top_p: .9
				},
				repetition_penalty: 1.12,
				streamer,
				stopping_criteria: [stopper]
			});
			currentStopper = null;
			const finalText = (streamedText.trim() || extractGeneratedAssistantText(output)).replace(/[*#`_]/g, "").trim();
			self.postMessage({
				id: msg.id,
				type: "done",
				text: finalText,
				backend: activeBackend
			});
			return;
		}
		if (msg.type === "dictionary") {
			const raw = extractGeneratedAssistantText(await (await ensureLlmLoaded(msg.tier, !navigator.onLine))([{
				role: "system",
				content: "You are a West Bengal Board Bengali & English School Dictionary. Return ONLY valid JSON with keys: \"word\", \"pronunciation\", \"meaning\" (in clear Bengali), \"sandhiVicched\" (Sandhi or root word), \"grammar\" (part of speech in Bengali/English), and \"exampleSentences\" (array of 2 short example sentences). No extra text outside JSON."
			}, {
				role: "user",
				content: `Define the word: "${msg.word}"`
			}], {
				max_new_tokens: 260,
				do_sample: false,
				repetition_penalty: 1.08
			}));
			self.postMessage({
				id: msg.id,
				type: "done",
				text: raw,
				backend: activeBackend
			});
			return;
		}
		if (msg.type === "transcribe") {
			const result = await (await ensureWhisperLoaded(msg.tier, !navigator.onLine))(msg.audio, {
				language: msg.language === "bengali" ? "bengali" : "english",
				task: "transcribe",
				chunk_length_s: 20,
				stride_length_s: 3
			});
			const text = Array.isArray(result) ? result.map((r) => r.text || "").join(" ").trim() : (result?.text || "").trim();
			self.postMessage({
				id: msg.id,
				type: "done",
				text
			});
			return;
		}
	} catch (err) {
		currentStopper = null;
		const message = err instanceof Error ? err.message : "Offline AI worker encountered an error.";
		self.postMessage({
			id: msg.id,
			type: "error",
			error: message
		});
	}
};
