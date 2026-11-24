import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { E as RefreshCw, d as Upload, n as X, ot as CircleAlert, ut as Camera, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
// src/components/CameraCaptureModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function CameraCaptureModal({ isOpen, onClose, onCapture, onFallbackUpload }) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [facingMode, setFacingMode] = (0, import_react.useState)("environment");
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const [isStarting, setIsStarting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		let cancelled = false;
		async function startCamera() {
			setIsStarting(true);
			setCameraError(null);
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				setCameraError("Live camera access is unavailable in this browser. You can upload a photo from your device instead.");
				setIsStarting(false);
				return;
			}
			try {
				if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: { ideal: facingMode },
						width: { ideal: 1600 },
						height: { ideal: 1200 }
					},
					audio: false
				});
				if (cancelled) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}
				streamRef.current = stream;
				if (videoRef.current) videoRef.current.srcObject = stream;
			} catch {
				if (!cancelled) setCameraError("Camera permission was denied or no camera was detected. You can upload a photo directly from your device.");
			} finally {
				if (!cancelled) setIsStarting(false);
			}
		}
		startCamera();
		return () => {
			cancelled = true;
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}
		};
	}, [isOpen, facingMode]);
	if (!isOpen) return null;
	const handleCapture = () => {
		const video = videoRef.current;
		if (!video || !video.videoWidth || !video.videoHeight) return;
		const scale = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
		const width = Math.round(video.videoWidth * scale);
		const height = Math.round(video.videoHeight * scale);
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.drawImage(video, 0, 0, width, height);
		const dataUrl = canvas.toDataURL("image/jpeg", .88);
		const base64 = dataUrl.split(",")[1] || "";
		const sizeBytes = Math.round(base64.length * 3 / 4);
		onCapture({
			dataUrl,
			base64,
			mimeType: "image/jpeg",
			name: `camera-note-${(/* @__PURE__ */ new Date()).toISOString().slice(11, 19).replace(/:/g, "-")}.jpg`,
			sizeBytes
		});
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-sm p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Take a photo of your textbook or question",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold text-slate-900 dark:text-white",
					children: "Camera Capture"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]",
					"aria-label": "Close camera",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5 space-y-4",
				children: cameraError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-700 dark:text-slate-300 leading-relaxed",
							children: cameraError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								onClose();
								onFallbackUpload();
							},
							className: "min-h-[44px] px-5 py-2.5 rounded-xl bg-[#007AFF] text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-[#0066D6] transition-colors whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" }), "Choose Photo from Device"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[4/3] w-full rounded-xl bg-slate-900 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						autoPlay: true,
						playsInline: true,
						muted: true,
						className: "w-full h-full object-cover"
					}), isStarting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white text-sm",
						children: "Starting camera..."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFacingMode((prev) => prev === "environment" ? "user" : "environment"),
						className: "min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium inline-flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), "Switch Camera"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleCapture,
						disabled: isStarting,
						className: "min-h-[44px] flex-1 px-5 py-2.5 rounded-xl bg-[#007AFF] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#0066D6] active:scale-[0.98] disabled:opacity-50 transition-all whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), "Capture Photo"]
					})]
				})] })
			})]
		})
	});
}
export { CameraCaptureModal };
