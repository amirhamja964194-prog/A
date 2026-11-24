import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { B as Lock, D as Radio, F as MessageSquare, G as HardDrive, H as ListChecks, J as FileDown, Q as Cpu, V as LoaderCircle, Z as Download, _ as Sparkles, i as WifiOff, it as CircleCheck, m as Trash2, n as X, ot as CircleAlert, pt as BookOpen, s as Volume2, t as Zap, ut as Camera, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { _ as refreshOfflineAiStorageInfo, b as OFFLINE_AI_PACKS, f as formatBytesCompact, l as deleteOfflineAiPack, m as getOfflineAiState, u as downloadOfflineAiPack, v as subscribeOfflineAiState, x as OFFLINE_AI_PACK_ORDER } from "./index-DPiGb8lU.js";
import { t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
// src/components/OfflineAiPackModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function OfflineAiPackModal({ isOpen, onClose, isOnline, onOpenLiveOffline }) {
	const [aiState, setAiState] = (0, import_react.useState)(getOfflineAiState);
	const [selectedTier, setSelectedTier] = (0, import_react.useState)(() => getOfflineAiState().installedTier ?? "standard");
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		return subscribeOfflineAiState((next) => {
			setAiState(next);
			if (next.installedTier) setSelectedTier(next.installedTier);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			refreshOfflineAiStorageInfo();
			setConfirmDelete(false);
		}
	}, [isOpen]);
	if (!isOpen) return null;
	const isDownloading = aiState.status === "downloading";
	const isInstalled = Boolean(aiState.installedTier);
	const installedPack = aiState.installedTier ? OFFLINE_AI_PACKS[aiState.installedTier] : null;
	const selectedPack = OFFLINE_AI_PACKS[selectedTier];
	const selectedCaps = selectedPack.capabilities;
	const handleDownload = async () => {
		if (!isOnline || isDownloading) return;
		try {
			await downloadOfflineAiPack(selectedTier);
		} catch {}
	};
	const handleDelete = async () => {
		if (isDownloading || isDeleting) return;
		setIsDeleting(true);
		try {
			await deleteOfflineAiPack();
			setConfirmDelete(false);
		} finally {
			setIsDeleting(false);
		}
	};
	const freeBytes = aiState.storageQuotaBytes > aiState.storageUsageBytes ? aiState.storageQuotaBytes - aiState.storageUsageBytes : 0;
	const selectedFeatureChecklist = [
		{
			icon: MessageSquare,
			label: selectedCaps.onlyClass ? `${selectedCaps.onlyClass} মেসেজ চ্যাট` : "যেকোনো প্রশ্নের AI উত্তর",
			sub: selectedCaps.answerStyle === "structured" ? "গুছিয়ে বিস্তারিত উত্তর" : selectedCaps.answerStyle === "fast" ? "অনেক ফাস্ট উত্তর" : "শুধু Class 8 চ্যাট",
			enabled: selectedCaps.allowMessage
		},
		{
			icon: Volume2,
			label: "ভয়েস শোনা ও মাইক",
			sub: "বাংলা + English",
			enabled: selectedCaps.allowVoice
		},
		{
			icon: FileDown,
			label: "PDF নোটস ডাউনলোড",
			sub: "রিচার্জ ছাড়াই",
			enabled: selectedCaps.allowPdf
		},
		{
			icon: Radio,
			label: "AI Live সরাসরি কথা",
			sub: selectedCaps.allowLive ? "চালু থাকবে" : "শুধু 250 / 500 MB প্যাকে",
			enabled: selectedCaps.allowLive
		},
		{
			icon: ListChecks,
			label: "কুইজ (Quiz)",
			sub: selectedCaps.allowQuiz ? "৪ অপশনের কুইজ" : "শুধু 250 / 500 MB প্যাকে",
			enabled: selectedCaps.allowQuiz
		},
		{
			icon: Camera,
			label: "বইয়ের ছবি (Camera OCR)",
			sub: selectedCaps.allowCamera ? "ছবি তুলে উত্তর" : "শুধু 250 / 500 MB প্যাকে",
			enabled: selectedCaps.allowCamera
		},
		{
			icon: BookOpen,
			label: "অফলাইন ডিকশনারি",
			sub: selectedCaps.allowDictionary ? "অর্থ, সন্ধি ও বাক্য" : "শুধু 250 / 500 MB প্যাকে",
			enabled: selectedCaps.allowDictionary
		},
		{
			icon: Sparkles,
			label: selectedCaps.onlyClass ? "শুধুমাত্র Class 8" : "সব ক্লাস (Class 5–10)",
			sub: selectedCaps.onlyClass ? "অন্য ক্লাস বন্ধ" : "WBBSE সম্পূর্ণ সিলেবাস",
			enabled: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Offline AI Pack Manager",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl max-h-[90vh] rounded-2xl bg-[var(--app-card-bg)] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isInstalled ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" : "bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-400"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate",
									children: "অফলাইন AI প্যাক (100 MB · 250 MB · 500 MB)"
								}), isInstalled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold whitespace-nowrap",
									children: "Ready Offline"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-600 dark:text-slate-400 truncate",
								children: "তোমার প্রয়োজন ও স্টোরেজ অনুযায়ী অফলাইন প্যাক বেছে নাও — একবার ডাউনলোড করলে রিচার্জ ছাড়াই চলবে"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close offline AI pack manager",
						className: "min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-4",
					children: [
						isInstalled && installedPack && !isDownloading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200 dark:border-emerald-800/70 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-bold text-emerald-950 dark:text-emerald-100",
											children: [installedPack.nameBn, " ফোনে সেভ করা আছে!"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed",
											children: [
												"AI Brain: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: installedPack.llmLabel }),
												" · Voice:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: installedPack.whisperLabel }),
												installedPack.capabilities.onlyClass ? " · শুধু Class 8 (মেসেজ, ভয়েস ও PDF)" : aiState.ocrCached ? " · Book Photo OCR: চালু" : "",
												aiState.cachedBytes > 0 ? ` · ব্যবহৃত জায়গা: ${formatBytesCompact(aiState.cachedBytes)}` : ""
											]
										})]
									})]
								})
							}), onOpenLiveOffline && installedPack.capabilities.allowLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									onClose();
									onOpenLiveOffline();
								},
								className: "w-full min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4" }), "এখনই লাইভ ভয়েস টিচার শুরু করুন (অফলাইন / অনলাইন)"]
							})]
						}),
						isDownloading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-sky-50 dark:bg-sky-950/45 border border-sky-200 dark:border-sky-800/80 p-4 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 text-[var(--app-accent)] animate-spin shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate",
											children: aiState.progress.stageLabelBn || "অফলাইন AI মডেল ডাউনলোড হচ্ছে..."
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-[var(--app-accent)] dark:text-sky-400 tabular-nums shrink-0",
										children: [aiState.progress.percent, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-[var(--app-accent)] transition-all duration-300 rounded-full",
										style: { width: `${Math.max(3, Math.min(100, aiState.progress.percent))}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate max-w-[65%] font-mono",
										children: aiState.progress.file || "প্রস্তুত হচ্ছে..."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums font-semibold",
										children: aiState.progress.loadedBytes > 0 ? `${formatBytesCompact(aiState.progress.loadedBytes)} / ${formatBytesCompact(aiState.progress.totalBytes || selectedPack.approxBytes)}` : selectedPack.sizeLabel
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-600 dark:text-slate-400",
									children: "দয়া করে ডাউনলোড শেষ হওয়া পর্যন্ত এই ট্যাবটি খোলা রাখুন। ফোনে সেভ হয়ে গেলে আর কখনো ডেটা লাগবে না।"
								})
							]
						}),
						aiState.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 p-3.5 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: aiState.error })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: "অফলাইন AI প্যাক বেছে নিন (এককালীন ডেটা খরচ)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-2.5",
								children: OFFLINE_AI_PACK_ORDER.map((tier) => {
									const pack = OFFLINE_AI_PACKS[tier];
									const isSelected = selectedTier === tier;
									const isThisInstalled = aiState.installedTier === tier;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: isDownloading,
										onClick: () => setSelectedTier(tier),
										className: `text-left rounded-xl border p-3.5 transition-all space-y-2 disabled:opacity-60 ${isSelected ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)]/50 ring-1 ring-[var(--app-accent)]" : "border-slate-200 dark:border-slate-700 bg-[var(--app-surface-subtle)] hover:border-slate-300 dark:hover:border-slate-600"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-bold text-slate-900 dark:text-white leading-snug",
															children: pack.nameBn
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: `px-2 py-0.5 rounded-md text-[10.5px] font-bold inline-flex items-center gap-1 ${tier === "pro" ? "bg-fuchsia-100 dark:bg-fuchsia-950/70 text-fuchsia-700 dark:text-fuchsia-300" : tier === "standard" ? "bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300" : "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300"}`,
															children: [tier === "standard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3 h-3" }), pack.badgeBn]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] font-semibold text-[var(--app-accent)] dark:text-sky-400 mt-0.5",
														children: pack.recommendedForBn
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2.5 py-0.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold whitespace-nowrap shrink-0",
													children: pack.sizeLabel
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed",
												children: pack.descriptionBn
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
														children: pack.llmLabel
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
														children: pack.whisperLabel
													}),
													isThisInstalled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold",
														children: "ইনস্টল করা আছে ✓"
													})
												]
											})
										]
									}, tier);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: [selectedPack.nameBn, " — এই প্যাকে যা যা চলবে"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
								children: selectedFeatureChecklist.map((feat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `rounded-xl border p-2.5 flex items-start gap-2 ${feat.enabled ? "border-slate-200/80 dark:border-slate-800 bg-[var(--app-surface-subtle)]" : "border-slate-200/50 dark:border-slate-800/60 bg-slate-100/60 dark:bg-slate-900/40 opacity-60"}`,
									children: [feat.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(feat.icon, { className: "w-4 h-4 text-[var(--app-accent)] dark:text-sky-400 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11.5px] font-semibold text-slate-900 dark:text-slate-100 leading-tight",
											children: feat.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug",
											children: feat.sub
										})]
									})]
								}, feat.label))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "w-4 h-4 text-slate-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"অফলাইন AI ক্যাশ:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-slate-900 dark:text-white",
										children: formatBytesCompact(aiState.cachedBytes)
									}),
									freeBytes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										" ",
										"· ফোনে খালি জায়গা:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-slate-900 dark:text-white",
											children: formatBytesCompact(freeBytes)
										})
									] })
								] })]
							}), aiState.deviceBackend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-semibold uppercase text-emerald-700 dark:text-emerald-400",
								children: ["Engine: ", aiState.deviceBackend]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 sm:px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-[var(--app-surface-subtle)] flex flex-wrap items-center justify-between gap-2.5 shrink-0",
					children: [isInstalled ? confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void handleDelete(),
							disabled: isDeleting || isDownloading,
							className: "min-h-[40px] px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50",
							children: [isDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), "হ্যাঁ, ডিলিট করুন"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConfirmDelete(false),
							className: "min-h-[40px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200",
							children: "বাতিল"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setConfirmDelete(true),
						disabled: isDownloading,
						className: "min-h-[40px] px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/70 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), "প্যাক মুছুন (জায়গা খালি করুন)"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: isOnline ? "ডাউনলোড বোতামে চাপ দিলে তবেই ডেটা খরচ হবে।" : "ডাউনলোডের জন্য একবার Wi-Fi / ডেটা অন করুন।"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void handleDownload(),
						disabled: !isOnline || isDownloading,
						className: "min-h-[42px] px-5 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ml-auto",
						children: isDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
							"ডাউনলোড হচ্ছে (",
							aiState.progress.percent,
							"%)"
						] }) : !isOnline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-4 h-4" }), "ইন্টারনেট নেই (ডাউনলোডের জন্য অনলাইন হোন)"] }) : aiState.installedTier === selectedTier ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }),
							"পুনরায় যাচাই / আপডেট করুন (",
							selectedPack.sizeLabel,
							")"
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }),
							"ডাউনলোড করুন (",
							selectedPack.sizeLabel,
							")"
						] })
					})]
				})
			]
		})
	});
}
export { OfflineAiPackModal };
