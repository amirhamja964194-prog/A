import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { W as Highlighter, gt as BookA, m as Trash2, n as X, pt as BookOpen, st as ChevronRight, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
// src/components/HistoryDrawer.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function formatTime(ts) {
	try {
		return new Intl.DateTimeFormat("en-IN", {
			hour: "numeric",
			minute: "2-digit",
			day: "numeric",
			month: "short"
		}).format(new Date(ts));
	} catch {
		return "";
	}
}
function HistoryDrawer({ isOpen, onClose, items, onSelect, onClearAll, onRemoveHighlight }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const highlightedCount = (0, import_react.useMemo)(() => items.filter((item) => item.type === "teacher" && item.highlights && item.highlights.length > 0).length, [items]);
	const visibleItems = (0, import_react.useMemo)(() => {
		if (filter === "highlighted") return items.filter((item) => item.type === "teacher" && item.highlights && item.highlights.length > 0);
		return items;
	}, [filter, items]);
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Recent study notes",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold text-slate-900 dark:text-white",
						children: "Recent Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums",
						children: [
							items.length,
							" saved ",
							items.length === 1 ? "session" : "sessions",
							highlightedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: " · "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [highlightedCount, " with highlights"] })] })
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onClearAll,
							className: "min-h-[44px] px-3 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), "Clear All"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Close recent notes",
							className: "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					})]
				}),
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-2.5 border-b border-slate-100 dark:border-slate-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800",
						role: "tablist",
						"aria-label": "Filter saved notes",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "tab",
							"aria-selected": filter === "all",
							onClick: () => setFilter("all"),
							className: `flex-1 min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${filter === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`,
							children: [
								"All Notes (",
								items.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "tab",
							"aria-selected": filter === "highlighted",
							onClick: () => setFilter("highlighted"),
							className: `flex-1 min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${filter === "highlighted" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlighter, { className: "w-3.5 h-3.5 shrink-0" }),
								"Highlighted (",
								highlightedCount,
								")"
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800",
					children: visibleItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 text-center space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-slate-900 dark:text-white",
							children: filter === "highlighted" ? "No highlighted notes yet" : "No saved notes yet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
							children: filter === "highlighted" ? "Long-press or select any important sentence in an AI Teacher response and tap Highlight Yellow to save it here." : "Questions answered by AI Teacher and words looked up in Dictionary appear here automatically."
						})]
					}) : visibleItems.map((item) => {
						const itemHighlights = item.type === "teacher" && item.highlights ? item.highlights : [];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white dark:bg-slate-900",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									onSelect(item);
									onClose();
								},
								className: "w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-3.5 min-h-[64px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0",
										children: item.type === "teacher" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookA, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium text-slate-900 dark:text-slate-100 truncate",
											children: item.type === "teacher" ? item.question || "Photo Question" : item.word
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate",
											children: [
												item.type === "teacher" ? `${item.className}${item.hasImage ? " · Photo" : ""}` : "Dictionary",
												itemHighlights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"aria-hidden": "true",
													children: " · "
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-amber-700 dark:text-yellow-300 font-medium tabular-nums",
													children: [
														itemHighlights.length,
														" ",
														itemHighlights.length === 1 ? "highlight" : "highlights"
													]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"aria-hidden": "true",
													children: " · "
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: formatTime(item.createdAt)
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" })
								]
							}), itemHighlights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 pb-4 pl-[68px] space-y-2",
								children: itemHighlights.map((phrase, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2 text-xs leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											onSelect(item);
											onClose();
										},
										className: "text-left flex-1 min-w-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
											className: "bg-yellow-200/90 dark:bg-yellow-400/30 text-slate-900 dark:text-yellow-100 rounded-xs px-1 py-0.5 box-decoration-clone",
											children: phrase
										})
									}), onRemoveHighlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onRemoveHighlight(item.id, phrase),
										"aria-label": "Remove saved highlight",
										title: "Remove highlight",
										className: "min-h-[28px] min-w-[28px] inline-flex items-center justify-center rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									})]
								}, `${item.id}-hl-${idx}`))
							})]
						}, item.id);
					})
				})
			]
		})
	});
}
export { HistoryDrawer };
