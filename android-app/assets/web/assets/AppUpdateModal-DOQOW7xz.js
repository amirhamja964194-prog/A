import "./rolldown-runtime-SbdDWaPq.js";
import { E as RefreshCw, V as LoaderCircle, at as CircleArrowUp, n as X, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function AppUpdateModal({ isOpen, currentVersion, pendingConfig, hasSwUpdate, isApplying, onConfirmUpdate, onDismiss }) {
	if (!isOpen) return null;
	const targetVersion = pendingConfig?.configVersion ?? currentVersion;
	const updateTitle = pendingConfig?.updateTitle?.trim() || "নতুন অ্যাপ আপডেট এসেছে (App Update)";
	const rawNotes = pendingConfig?.updateNotes?.trim() || "";
	const noteLines = rawNotes ? rawNotes.split("\n").map((line) => line.trim()).filter(Boolean) : [hasSwUpdate ? "নতুন Neon Dark ডিজাইন, অ্যানিমেটেড AI Orb এবং 100 MB / 250 MB / 500 MB অফলাইন AI প্যাক আপডেট রেডি হয়ে গেছে। একবার আপডেট করলেই নতুন ভার্সন চালু হবে।" : "অ্যাডমিন অ্যাপে নতুন আপডেট পাবলিশ করেছেন।"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm p-3 sm:p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "App Update Available",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl bg-white dark:bg-[#0c0e1c] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-400 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-slate-900 dark:text-white leading-snug",
							children: updateTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5",
							children: [
								"v1.0.",
								currentVersion,
								" → v1.0.",
								targetVersion
							]
						})]
					})]
				}), !isApplying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDismiss,
					"aria-label": "Remind me later",
					className: "min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-slate-700 dark:text-slate-300",
							children: "এই আপডেটে কী নতুন এসেছে:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 p-3.5 space-y-1.5 max-h-52 overflow-y-auto",
							children: noteLines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-800 dark:text-slate-200 leading-relaxed",
								children: line
							}, index))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
						children: "নতুন কোনো লিংকের দরকার নেই — নিচের Update বাটনে ক্লিক করলেই আপনার পুরোনো লিংকে অ্যাপটি অটোমেটিক আপডেট হয়ে রিস্টার্ট হবে।"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onDismiss,
							disabled: isApplying,
							className: "min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50",
							children: "পরে করব (Later)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onConfirmUpdate,
							disabled: isApplying,
							className: "min-h-[46px] px-5 py-2.5 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-70",
							children: isApplying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), "আপডেট হচ্ছে..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), "Update & Restart"] })
						})]
					})
				]
			})]
		})
	});
}
export { AppUpdateModal };
