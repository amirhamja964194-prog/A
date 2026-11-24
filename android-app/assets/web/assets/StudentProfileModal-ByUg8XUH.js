import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { K as GraduationCap, lt as Check, m as Trash2, n as X, u as User, ut as Camera, w as Save, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { D as compressAvatarImageFile, E as StudentAvatar, T as AVATAR_PRESET_OPTIONS, w as AVATAR_COLOR_OPTIONS } from "./index-DPiGb8lU.js";
import { t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
// src/components/StudentProfileModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CLASS_OPTIONS = [
	"Class 5",
	"Class 6",
	"Class 7",
	"Class 8",
	"Class 9",
	"Class 10"
];
var FAVORITE_SUBJECTS = [
	"বিজ্ঞান (Science)",
	"গণিত (Math)",
	"বাংলা (Bengali)",
	"ইংরেজি (English)",
	"ইতিহাস (History)",
	"ভূগোল (Geography)"
];
function StudentProfileModal({ isOpen, onClose, profile, currentClass, onSave }) {
	const [name, setName] = (0, import_react.useState)(profile.name);
	const [selectedClass, setSelectedClass] = (0, import_react.useState)(profile.className || currentClass);
	const [school, setSchool] = (0, import_react.useState)(profile.school || "");
	const [favoriteSubject, setFavoriteSubject] = (0, import_react.useState)(profile.favoriteSubject || "");
	const [avatarType, setAvatarType] = (0, import_react.useState)(profile.avatarType);
	const [avatarPreset, setAvatarPreset] = (0, import_react.useState)(profile.avatarPreset || "boy-scholar");
	const [avatarColor, setAvatarColor] = (0, import_react.useState)(profile.avatarColor || "cyan");
	const [customAvatarDataUrl, setCustomAvatarDataUrl] = (0, import_react.useState)(profile.customAvatarDataUrl);
	const [error, setError] = (0, import_react.useState)(null);
	const [savedNotice, setSavedNotice] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		setName(profile.name || "");
		setSelectedClass(profile.className || currentClass);
		setSchool(profile.school || "");
		setFavoriteSubject(profile.favoriteSubject || "");
		setAvatarType(profile.avatarType || "preset");
		setAvatarPreset(profile.avatarPreset || "boy-scholar");
		setAvatarColor(profile.avatarColor || "cyan");
		setCustomAvatarDataUrl(profile.customAvatarDataUrl);
		setError(null);
		setSavedNotice(false);
	}, [
		isOpen,
		profile,
		currentClass
	]);
	if (!isOpen) return null;
	const previewProfile = {
		name: name.trim(),
		className: selectedClass,
		school: school.trim(),
		favoriteSubject: favoriteSubject.trim(),
		avatarType,
		avatarPreset,
		avatarColor,
		customAvatarDataUrl,
		onboardingCompleted: true,
		updatedAt: Date.now()
	};
	const handlePhotoUpload = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setError("অনুগ্রহ করে একটি সঠিক ছবি (JPG, PNG বা WebP) বেছে নাও।");
			return;
		}
		setError(null);
		try {
			const compressed = await compressAvatarImageFile(file);
			setCustomAvatarDataUrl(compressed);
			setAvatarType("custom");
		} catch (err) {
			setError(err instanceof Error ? err.message : "ছবি আপলোড করা যায়নি।");
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const cleanedName = name.trim();
		if (!cleanedName) {
			setError("তোমার নাম খালি রাখা যাবে না।");
			return;
		}
		if (cleanedName.length > 40) {
			setError("নামটি ৪০ অক্ষরের মধ্যে লেখো।");
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
			customAvatarDataUrl: avatarType === "custom" ? customAvatarDataUrl : void 0,
			onboardingCompleted: true,
			updatedAt: Date.now()
		});
		setSavedNotice(true);
		window.setTimeout(() => {
			onClose();
		}, 450);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "student-profile-modal-title",
		className: "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "w-full sm:max-w-lg max-h-[92dvh] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0d1124] border-t sm:border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "student-profile-modal-title",
						className: "text-base font-bold text-slate-900 dark:text-white leading-tight",
						children: "আমার প্রোফাইল (Student Profile)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "নাম, অ্যাভাটার ও নিজস্ব তথ্য পরিবর্তন করো"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close profile settings",
					className: "min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
								profile: previewProfile,
								size: "xl"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => fileInputRef.current?.click(),
								"aria-label": "Upload custom photo",
								className: "absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 border-2 border-white dark:border-[#0d1124] flex items-center justify-center shadow-md hover:scale-105 transition-transform",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 text-center sm:text-left space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-bold text-slate-900 dark:text-white truncate",
									children: name.trim() || "Student"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400",
									children: [selectedClass, school.trim() ? ` · ${school.trim()}` : ""]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-center sm:justify-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => fileInputRef.current?.click(),
										className: "min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5" }), "নিজের ছবি দাও"]
									}), avatarType === "custom" && customAvatarDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setAvatarType("preset");
											setCustomAvatarDataUrl(void 0);
										},
										className: "min-h-[36px] px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-semibold inline-flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), "ছবি সরাও"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => {
										handlePhotoUpload(e.target.files?.[0]);
										e.target.value = "";
									}
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
							children: "অ্যাভাটারের রঙ (Theme Color)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-2.5",
							children: AVATAR_COLOR_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAvatarColor(c.id),
								"aria-label": c.label,
								className: `w-8 h-8 rounded-full ${c.swatchClass} flex items-center justify-center transition-transform ${avatarColor === c.id ? "scale-110 ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-[#0d1124]" : "opacity-80 hover:opacity-100"}`,
								children: avatarColor === c.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-white drop-shadow-xs" })
							}, c.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
							children: "অ্যাভাটার বেছে নাও (Choose Avatar)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-5 gap-2",
							children: AVATAR_PRESET_OPTIONS.map((opt) => {
								const isSelected = avatarType === "preset" && avatarPreset === opt.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setAvatarType("preset");
										setAvatarPreset(opt.id);
									},
									className: `p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${isSelected ? "border-cyan-500 bg-cyan-500/12 shadow-xs" : "border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/25"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
										profile: {
											name: name.trim() || "S",
											avatarType: "preset",
											avatarPreset: opt.id,
											avatarColor
										},
										size: "sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-full",
										children: opt.label.split(" ")[0]
									})]
								}, opt.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "profile-student-name",
								className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
								children: "তোমার নাম (AI Teacher এই নামেই ডাকবে)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "profile-student-name",
								type: "text",
								maxLength: 40,
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									if (error) setError(null);
								},
								placeholder: "তোমার নাম লেখো...",
								className: "w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-rose-600 dark:text-rose-400",
								children: error
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-3.5 h-3.5 text-cyan-500" }), "তোমার ক্লাস (Class)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: CLASS_OPTIONS.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedClass(cls),
								className: `min-h-[38px] rounded-xl text-xs font-semibold border transition-all ${selectedClass === cls ? "border-cyan-500 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25"}`,
								children: cls
							}, cls))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "profile-school-name",
								className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
								children: "স্কুলের নাম (ঐচ্ছিক)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "profile-school-name",
								type: "text",
								maxLength: 80,
								value: school,
								onChange: (e) => setSchool(e.target.value),
								placeholder: "যেমন: রামকৃষ্ণ মিশন...",
								className: "w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 outline-none"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "profile-fav-subject",
								className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
								children: "প্রিয় বিষয় (ঐচ্ছিক)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "profile-fav-subject",
								value: favoriteSubject,
								onChange: (e) => setFavoriteSubject(e.target.value),
								className: "w-full min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:border-cyan-500 outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "পছন্দ করো..."
								}), FAVORITE_SUBJECTS.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: sub,
									children: sub
								}, sub))]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200/80 dark:border-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors",
							children: "বাতিল"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all",
							children: savedNotice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সেভ হয়ে গেছে!" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সেভ করো" })] })
						})]
					})
				]
			})]
		})
	});
}
export { StudentProfileModal };
