import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { $ as Copy, C as Search, J as FileDown, N as Mic, P as MicOff, V as LoaderCircle, g as Square, gt as BookA, i as WifiOff, lt as Check, n as X, ot as CircleAlert, s as Volume2, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { C as useVoicePlayer, N as DEFAULT_APP_CONFIG, S as generateDictionaryPdf, s as useSpeechRecognition, t as getAllOfflineDictionaryWords } from "./index-D7mTM5Dt.js";
import { t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
// src/components/DictionaryWorkspace.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE_WORDS = [
	"বিদ্যালয়",
	"সূর্যোদয়",
	"অন্বেষণ",
	"জিজ্ঞাসা",
	"দিগন্ত",
	"Resilience"
];
function DictionaryWorkspace({ word, onWordChange, entry, isLoading, error, validationError, onSearch, isOnline = true, offlineSuggestions = [], appConfig = DEFAULT_APP_CONFIG }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [isExportingPdf, setIsExportingPdf] = (0, import_react.useState)(false);
	const offlineWords = getAllOfflineDictionaryWords();
	const { activeId: activeVoiceId, isLoading: isVoiceLoading, isPlaying: isVoicePlaying, speak } = useVoicePlayer(appConfig.defaultVoice);
	const { isSupported: isSpeechSupported, isListening, isTranscribing, interimTranscript, lang: speechLang, setLang: setSpeechLang, error: speechError, stopListening, toggleListening } = useSpeechRecognition({
		defaultLang: "bn-IN",
		continuous: false,
		onFinalResult: (spokenWord) => {
			const cleaned = spokenWord.replace(/[।.?!,;:'"]+$/g, "").trim();
			if (!cleaned) return;
			onWordChange(cleaned);
			onSearch(cleaned);
		}
	});
	const handleCopyEntry = async () => {
		if (!entry) return;
		const formatted = [
			`শব্দ: ${entry.word}`,
			`১. উচ্চারণ: ${entry.pronunciation}`,
			`২. অর্থ: ${entry.meaning}`,
			`৩. সন্ধি বিচ্ছেদ: ${entry.sandhiVicched}`,
			`৪. ব্যাকরণগত পরিচয়: ${entry.grammar}`,
			`৫. বাক্য রচনা:\n${entry.exampleSentences.map((s, i) => `   ${i + 1}. ${s}`).join("\n")}`
		].join("\n\n");
		try {
			await navigator.clipboard.writeText(formatted);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch {}
	};
	const handleSpeakWord = () => {
		if (!entry) return;
		const script = `${entry.word}। ${entry.meaning}`;
		speak(script, `dict-${entry.word}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": "Dictionary Search",
			className: "lg:col-span-5 bg-[var(--app-card-bg)] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold text-slate-900 dark:text-white tracking-tight",
						children: appConfig.dictionaryTitle.trim() || DEFAULT_APP_CONFIG.dictionaryTitle
					}), !isOnline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 text-[11px] font-semibold shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-3 h-3" }), "অফলাইন"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-slate-600 dark:text-slate-300",
					children: !isOnline ? `অফলাইন ডিকশনারি চালু — ${offlineWords.length}টি বাংলা ও ইংরেজি শব্দ ইন্টারনেট ছাড়াই খুঁজুন।` : appConfig.dictionarySubtitle.trim() || DEFAULT_APP_CONFIG.dictionarySubtitle
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					if (isListening) stopListening();
					onSearch();
				},
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "dict-word-input",
									className: "block text-sm font-medium text-slate-800 dark:text-slate-200",
									children: "Enter Any Bengali or English Word"
								}), isSpeechSupported && appConfig.enableVoiceInput && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs",
									role: "group",
									"aria-label": "Voice lookup language",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: isListening,
										onClick: () => setSpeechLang("bn-IN"),
										className: `min-h-[32px] px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${speechLang === "bn-IN" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"} disabled:opacity-60`,
										children: "বাংলা"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: isListening,
										onClick: () => setSpeechLang("en-IN"),
										className: `min-h-[32px] px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${speechLang === "en-IN" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"} disabled:opacity-60`,
										children: "EN"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "dict-word-input",
										type: "text",
										value: word,
										onChange: (e) => onWordChange(e.target.value),
										placeholder: "e.g., বিদ্যালয় or Knowledge",
										className: "w-full min-h-[48px] pl-4 pr-11 py-3 rounded-xl bg-[var(--app-surface-subtle)] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] dark:focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]/20 transition-colors"
									}), word && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onWordChange(""),
										"aria-label": "Clear word input",
										className: "absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
									})]
								}), isSpeechSupported && appConfig.enableVoiceInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: toggleListening,
									disabled: isTranscribing,
									"aria-pressed": isListening,
									"aria-label": isListening ? "Stop voice word search" : "Speak a word to look up",
									className: `min-h-[48px] min-w-[48px] px-3.5 rounded-xl border inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-all shrink-0 disabled:opacity-60 ${isListening ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[var(--app-accent)] dark:hover:border-sky-500 hover:text-[var(--app-accent)] dark:hover:text-sky-400"}`,
									children: isTranscribing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : isListening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4" })
								})]
							}),
							(isListening || isTranscribing) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-[var(--app-accent-soft)] border border-[var(--app-accent)]/30 dark:border-sky-800 px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between gap-3",
								"aria-live": "polite",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1 space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-semibold text-[var(--app-accent)] dark:text-sky-400 flex items-center gap-1.5",
										children: [isTranscribing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0",
											"aria-hidden": "true"
										}), isTranscribing ? speechLang === "bn-IN" ? "শব্দটি লেখা হচ্ছে..." : "Transcribing word..." : speechLang === "bn-IN" ? "শব্দটি বলুন..." : "Speak an English word..."]
									}), interimTranscript && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-700 dark:text-slate-200 truncate",
										children: interimTranscript
									})]
								}), isListening && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: stopListening,
									className: "min-h-[32px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 shrink-0",
									children: "Stop"
								})]
							}),
							speechError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5",
								role: "alert",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5 shrink-0" }), speechError]
							}),
							!isSpeechSupported && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400",
								children: "Voice input is unavailable in this browser."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-slate-500 dark:text-slate-400",
							children: !isOnline ? `অফলাইনে উপলব্ধ শব্দ (${offlineWords.length}টি):` : "Try a sample word:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-0.5",
							children: (!isOnline ? offlineWords.slice(0, 24) : appConfig.sampleWords.length > 0 ? appConfig.sampleWords : SAMPLE_WORDS).map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									onWordChange(sample);
									onSearch(sample);
								},
								className: "min-h-[34px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap",
								children: sample
							}, sample))
						})]
					}),
					validationError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-3.5 py-2.5 text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2",
						role: "alert",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: validationError })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: isLoading,
						className: "w-full min-h-[48px] px-5 py-3 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 shrink-0" }), isLoading ? "Analyzing Word..." : "Search Word"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			"aria-label": "Dictionary Entry",
			className: "lg:col-span-7 bg-[var(--app-card-bg)] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 min-h-[440px] flex flex-col transition-colors",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col justify-center space-y-5 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-[var(--app-accent)] dark:text-sky-400",
						children: "Analyzing word structure and grammar..."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "Preparing pronunciation, meaning, and Sandhi Vicched"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 animate-pulse",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" })
					]
				})]
			}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col items-center justify-center text-center py-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-slate-900 dark:text-white",
							children: !isOnline ? "অফলাইন ডিকশনারি" : "Could not look up this word"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
							children: error
						})]
					}),
					offlineSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-md space-y-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-slate-500 dark:text-slate-400",
							children: "অফলাইনে এই শব্দগুলো দেখতে ট্যাপ করুন:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap justify-center gap-1.5",
							children: offlineSuggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									onWordChange(s);
									onSearch(s);
								},
								className: "min-h-[34px] px-3 py-1 rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-300 text-xs font-semibold hover:opacity-85 transition-opacity",
								children: s
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSearch(),
						className: "min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
						children: "Try Again"
					})
				]
			}) : entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "Dictionary Entry"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5",
						children: entry.word
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							appConfig.enableVoiceOutput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSpeakWord,
								className: "min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap",
								children: activeVoiceId === `dict-${entry.word}` && isVoiceLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "Loading..."] }) : activeVoiceId === `dict-${entry.word}` && isVoicePlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3.5 h-3.5 text-rose-600 dark:text-rose-400" }), "Stop"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5" }), "Pronounce"] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleCopyEntry,
								className: "min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap",
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" }), "Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), "Copy Entry"] })
							}),
							appConfig.enablePdfExport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: isExportingPdf,
								onClick: async () => {
									if (!entry || isExportingPdf) return;
									setIsExportingPdf(true);
									try {
										await generateDictionaryPdf(entry);
									} finally {
										setIsExportingPdf(false);
									}
								},
								className: "min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap disabled:opacity-60",
								children: isExportingPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "PDF..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "w-3.5 h-3.5" }), "Save PDF"] })
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "divide-y divide-slate-100 dark:divide-slate-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-sm font-semibold text-slate-900 dark:text-white",
								children: "১. উচ্চারণ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed",
								children: entry.pronunciation
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-sm font-semibold text-slate-900 dark:text-white",
								children: "২. অর্থ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed",
								children: entry.meaning
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-sm font-semibold text-slate-900 dark:text-white",
								children: "৩. সন্ধি বিচ্ছেদ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed",
								children: entry.sandhiVicched
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-sm font-semibold text-slate-900 dark:text-white",
								children: "৪. ব্যাকরণগত পরিচয়"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "sm:col-span-2 text-base text-slate-800 dark:text-slate-200 leading-relaxed",
								children: entry.grammar
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-sm font-semibold text-slate-900 dark:text-white",
								children: "৫. বাক্য রচনা"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2 list-disc pl-5 text-base text-slate-800 dark:text-slate-200 leading-relaxed",
									children: entry.exampleSentences.map((sentence, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: sentence }, idx))
								})
							})]
						})
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex flex-col justify-center py-8 space-y-6 max-w-lg mx-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-400 flex items-center justify-center mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookA, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-slate-900 dark:text-white",
							children: "Structured Bengali Lexicon & Grammar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
							children: "Search any Bengali or English word to view a 5-part West Bengal Board grammar breakdown: pronunciation, meaning, Sandhi Vicched, grammatical classification, and example sentences."
						})
					]
				})
			})
		})]
	});
}
export { DictionaryWorkspace };
