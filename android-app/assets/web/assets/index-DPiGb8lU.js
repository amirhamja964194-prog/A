const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-B3he6ffy.js","assets/rolldown-runtime-SbdDWaPq.js","assets/CameraCaptureModal-BrBUPzTn.js","assets/vendor-icons-C2dQ58iJ.js","assets/vendor-react-BxUMW0g_.js","assets/LiveTeacherModal-DcKGboof.js","assets/OfflineStudyLibraryModal-CbXWM_T9.js","assets/AppUpdateModal-DOQOW7xz.js","assets/StudentProfileModal-ByUg8XUH.js","assets/DictionaryWorkspace-DbjoKOr9.js","assets/HistoryDrawer-CVBOsMKN.js","assets/AdminModal-n_BZzCmQ.js","assets/OfflineAiPackModal-BkUEDgA9.js"])))=>i.map(i=>d[i]);
import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { n as require_client, t as require_jsx_runtime } from "./vendor-react-BxUMW0g_.js";
import { $ as Copy, A as Paperclip, B as Lock, E as RefreshCw, H as ListChecks, J as FileDown, L as Menu, M as Moon, N as Mic, O as Plus, P as MicOff, Q as Cpu, R as Megaphone, S as Send, T as RotateCcw, V as LoaderCircle, W as Highlighter, Z as Download, _ as Sparkles, _t as AudioLines, at as CircleArrowUp, b as ShieldCheck, ct as ChevronLeft, f as Trophy, g as Square, h as Sun, ht as BookMarked, i as WifiOff, it as CircleCheck, j as NotebookText, lt as Check, m as Trash2, mt as BookOpenCheck, n as X, nt as CircleX, o as VolumeX, ot as CircleAlert, p as TriangleAlert, pt as BookOpen, q as FileText, r as Wrench, rt as CircleQuestionMark, s as Volume2, st as ChevronRight, ut as Camera, v as Smartphone, vt as ArrowRight, x as Share2, yt as require_react } from "./vendor-icons-C2dQ58iJ.js";
import { a as doc, c as serverTimestamp, d as onAuthStateChanged, f as signInWithPopup, i as setDoc, l as GoogleAuthProvider, m as initializeApp, n as getDocFromServer, o as getFirestore, p as signOut, r as onSnapshot, s as initializeFirestore, t as getDoc, u as getAuth } from "./vendor-firebase-BCZNHdeX.js";
// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// \0vite/preload-helper.js
var import_client = require_client();
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					const handleSettle = (e) => {
						link.removeEventListener("load", handleSettle);
						link.removeEventListener("error", handleSettle);
						if (e.type === "error") rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`));
						else res(e);
					};
					link.addEventListener("load", handleSettle);
					link.addEventListener("error", handleSettle);
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
// ../../@vite-plugin-pwa/virtual:pwa-register
var autoUpdateMode = "true";
var selfDestroying = "false";
var auto = autoUpdateMode === "true";
var autoDestroy = selfDestroying === "true";
function registerSW(options = {}) {
	const { immediate = false, onNeedReload, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError } = options;
	let wb;
	let registerPromise;
	let sendSkipWaitingMessage;
	const updateServiceWorker = async (_reloadPage = true) => {
		await registerPromise;
		if (!auto) sendSkipWaitingMessage?.();
	};
	async function register() {
		if ("serviceWorker" in navigator) {
			wb = await __vitePreload(async () => {
				const { Workbox } = await import("./workbox-window.prod.es5-CzJxx9q2.js");
				return { Workbox };
			}, []).then(({ Workbox }) => {
				return new Workbox("/sw.js", {
					scope: "/",
					type: "classic"
				});
			}).catch((e) => {
				onRegisterError?.(e);
			});
			if (!wb) return;
			sendSkipWaitingMessage = () => {
				wb?.messageSkipWaiting();
			};
			if (!autoDestroy) {
				if (auto) {
					wb.addEventListener("activated", (event) => {
						if (event.isUpdate || event.isExternal) {
							if (onNeedReload) onNeedReload();
							else window.location.reload();
						}
					});
					wb.addEventListener("installed", (event) => {
						if (!event.isUpdate) onOfflineReady?.();
					});
				} else {
					let onNeedRefreshCalled = false;
					const showSkipWaitingPrompt = () => {
						onNeedRefreshCalled = true;
						wb?.addEventListener("controlling", (event) => {
							if (event.isUpdate) {
								if (onNeedReload) onNeedReload();
								else window.location.reload();
							}
						});
						onNeedRefresh?.();
					};
					wb.addEventListener("installed", (event) => {
						if (typeof event.isUpdate === "undefined") {
							if (typeof event.isExternal !== "undefined") {
								if (event.isExternal) showSkipWaitingPrompt();
								else !onNeedRefreshCalled && onOfflineReady?.();
							} else !onNeedRefreshCalled && onOfflineReady?.();
						} else if (!event.isUpdate) onOfflineReady?.();
					});
					wb.addEventListener("waiting", showSkipWaitingPrompt);
				}
			}
			wb.register({ immediate }).then((r) => {
				if (onRegisteredSW) onRegisteredSW("/sw.js", r);
				else onRegistered?.(r);
			}).catch((e) => {
				onRegisterError?.(e);
			});
		}
	}
	registerPromise = register();
	return updateServiceWorker;
}
// firebase-applet-config.json
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var firebase_applet_config_default = {
	projectId: "alien-signifier-xv0ns",
	appId: "1:1069981582649:web:1ff096081715062653d4e8",
	apiKey: "AIzaSyDZLqygFZWApjELRAQpvd-pXelMlrHWnuI",
	authDomain: "alien-signifier-xv0ns.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-wbsecaiteacher-6a23cf18-3065-457f-867e-9eba113e6c43",
	storageBucket: "alien-signifier-xv0ns.firebasestorage.app",
	messagingSenderId: "1069981582649",
	measurementId: "",
	oAuthClientId: "1069981582649-jot55qagdi4ah0mqc057o50ph2m4ut6c.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
// src/types.ts
var DEFAULT_APP_CONFIG = {
	configVersion: 1,
	updateTitle: "New App Update Available",
	updateNotes: "",
	appName: "Wbsec",
	attributionText: "Made by Amir",
	welcomeTitle: "",
	welcomeSubtitle: "Start Live Mode to talk directly with your English or Bengali teacher in real time, tap the mic to dictate, or attach a textbook photo.",
	dictionaryTitle: "Bengali Dictionary",
	dictionarySubtitle: "Look up pronunciation, Bengali meaning, Sandhi Vicched, grammar identity, and example sentences.",
	accentColor: "blue",
	pageBackground: "default",
	fontScale: "normal",
	announcementBanner: "",
	apkDownloadUrl: "",
	maintenanceMode: false,
	maintenanceMessage: "App maintenance is in progress. Please check back shortly.",
	enableTeacher: true,
	enableLiveMode: true,
	enableDictionary: true,
	enableVoiceInput: true,
	enableVoiceOutput: true,
	enablePdfExport: true,
	enableCamera: true,
	defaultClass: "Class 8",
	defaultVoice: "Kore",
	defaultLiveRole: "bengali",
	temperature: .2,
	conciseAnswers: true,
	customTeacherPrompt: "",
	customLivePrompt: "",
	samplePrompts: [
		"সালোকসংশ্লেষ প্রক্রিয়াটি সহজভাবে বুঝিয়ে দাও।",
		"নিউটনের গতির তৃতীয় সূত্র উদাহরণসহ ব্যাখ্যা করো।",
		"সালোকসংশ্লেষের ওপর একটি PDF তৈরি করো।"
	],
	sampleWords: [
		"বিদ্যালয়",
		"সূর্যোদয়",
		"অন্বেষণ",
		"জিজ্ঞাসা",
		"দিগন্ত",
		"Resilience"
	],
	updatedAt: 0
};
var DEFAULT_STUDENT_PROFILE = {
	name: "",
	school: "",
	favoriteSubject: "",
	avatarType: "preset",
	avatarPreset: "boy-scholar",
	avatarColor: "cyan",
	onboardingCompleted: false,
	updatedAt: 0
};
var ADMIN_EMAILS = ["mursalimmondal630@gmail.com", "k40242412@gmail.com"];
var APP_SETTINGS_COLLECTION = "appSettings";
var APP_SETTINGS_DOC_ID = "live";
var APP_SETTINGS_PATH = `${APP_SETTINGS_COLLECTION}/${APP_SETTINGS_DOC_ID}`;
var app = initializeApp(firebase_applet_config_default);
function createResilientFirestore() {
	try {
		return initializeFirestore(app, { experimentalAutoDetectLongPolling: true }, firebase_applet_config_default.firestoreDatabaseId);
	} catch {
		return getFirestore(app, firebase_applet_config_default.firestoreDatabaseId);
	}
}
var db = createResilientFirestore();
var auth = getAuth(app);
var googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
function handleFirestoreError(error, operationType, path) {
	const errInfo = {
		error: error instanceof Error ? error.message : String(error),
		authInfo: {
			userId: auth.currentUser?.uid ?? null,
			email: auth.currentUser?.email ?? null,
			emailVerified: auth.currentUser?.emailVerified ?? null,
			isAnonymous: auth.currentUser?.isAnonymous ?? null,
			tenantId: auth.currentUser?.tenantId ?? null,
			providerInfo: auth.currentUser?.providerData?.map((provider) => ({
				providerId: provider.providerId,
				email: provider.email
			})) || []
		},
		operationType,
		path
	};
	console.error("Firestore Error: ", JSON.stringify(errInfo));
	throw new Error(JSON.stringify(errInfo));
}
async function testConnection() {
	if (typeof navigator !== "undefined" && !navigator.onLine) return;
	try {
		await getDocFromServer(doc(db, "test", "connection"));
	} catch (error) {
		if ((error?.code || "") !== "unavailable" && error instanceof Error && error.message.includes("the client is offline")) console.error("Please check your Firebase configuration.");
	}
}
testConnection();
var ALLOWED_CLASSES = /* @__PURE__ */ new Set([
	"Class 5",
	"Class 6",
	"Class 7",
	"Class 8",
	"Class 9",
	"Class 10"
]);
var ALLOWED_VOICES = /* @__PURE__ */ new Set([
	"Kore",
	"Puck",
	"Zephyr",
	"Charon",
	"Fenrir"
]);
var ALLOWED_LIVE_ROLES = /* @__PURE__ */ new Set([
	"english",
	"bengali",
	"bilingual"
]);
var ALLOWED_ACCENT_COLORS = /* @__PURE__ */ new Set([
	"blue",
	"emerald",
	"indigo",
	"violet",
	"rose",
	"amber"
]);
var ALLOWED_PAGE_BACKGROUNDS = /* @__PURE__ */ new Set([
	"default",
	"yellow",
	"blue",
	"emerald",
	"rose",
	"violet"
]);
var ALLOWED_FONT_SCALES = /* @__PURE__ */ new Set(["normal", "large"]);
function toEpochMillis(val, fallback) {
	if (typeof val === "number" && Number.isFinite(val)) return val;
	if (val && typeof val === "object" && "toMillis" in val && typeof val.toMillis === "function") return val.toMillis();
	return fallback;
}
function sanitizeAppConfigForClient(raw, base = DEFAULT_APP_CONFIG) {
	const src = raw ?? {};
	const str = (val, fallback, maxLen) => typeof val === "string" ? val.trim().slice(0, maxLen) : fallback;
	const sanitizeApkUrl = (val, fallback) => {
		if (typeof val !== "string") return fallback;
		const trimmed = val.trim().slice(0, 500);
		if (!trimmed) return "";
		try {
			const parsed = new URL(trimmed);
			return parsed.protocol === "https:" ? parsed.toString() : fallback;
		} catch {
			return fallback;
		}
	};
	const bool = (val, fallback) => typeof val === "boolean" ? val : fallback;
	const rawClass = typeof src.defaultClass === "string" ? src.defaultClass : base.defaultClass;
	const defaultClass = ALLOWED_CLASSES.has(rawClass) ? rawClass : base.defaultClass;
	const rawVoice = typeof src.defaultVoice === "string" ? src.defaultVoice : base.defaultVoice;
	const defaultVoice = ALLOWED_VOICES.has(rawVoice) ? rawVoice : base.defaultVoice;
	const rawRole = typeof src.defaultLiveRole === "string" ? src.defaultLiveRole : base.defaultLiveRole;
	const defaultLiveRole = ALLOWED_LIVE_ROLES.has(rawRole) ? rawRole : base.defaultLiveRole;
	const rawAccent = typeof src.accentColor === "string" ? src.accentColor : base.accentColor;
	const accentColor = ALLOWED_ACCENT_COLORS.has(rawAccent) ? rawAccent : base.accentColor;
	const rawPageBg = typeof src.pageBackground === "string" ? src.pageBackground : base.pageBackground;
	const pageBackground = ALLOWED_PAGE_BACKGROUNDS.has(rawPageBg) ? rawPageBg : base.pageBackground;
	const rawScale = typeof src.fontScale === "string" ? src.fontScale : base.fontScale;
	const fontScale = ALLOWED_FONT_SCALES.has(rawScale) ? rawScale : base.fontScale;
	const rawVersion = typeof src.configVersion === "number" && Number.isFinite(src.configVersion) && src.configVersion >= 1 ? Math.min(1e6, Math.floor(src.configVersion)) : base.configVersion || 1;
	const rawTemp = typeof src.temperature === "number" && Number.isFinite(src.temperature) ? Math.round(Math.min(1, Math.max(0, src.temperature)) * 100) / 100 : base.temperature;
	const sanitizeList = (list, fallback, maxItems, maxLen) => {
		if (!Array.isArray(list)) return fallback;
		const cleaned = list.filter((item) => typeof item === "string").map((item) => item.trim().slice(0, maxLen)).filter(Boolean).slice(0, maxItems);
		return cleaned.length > 0 ? cleaned : fallback;
	};
	return {
		configVersion: rawVersion,
		updateTitle: str(src.updateTitle, base.updateTitle, 80) || DEFAULT_APP_CONFIG.updateTitle,
		updateNotes: str(src.updateNotes, base.updateNotes, 600),
		appName: str(src.appName, base.appName, 40) || DEFAULT_APP_CONFIG.appName,
		attributionText: str(src.attributionText, base.attributionText, 50) || DEFAULT_APP_CONFIG.attributionText,
		welcomeTitle: str(src.welcomeTitle, base.welcomeTitle, 100),
		welcomeSubtitle: str(src.welcomeSubtitle, base.welcomeSubtitle, 280) || DEFAULT_APP_CONFIG.welcomeSubtitle,
		dictionaryTitle: str(src.dictionaryTitle, base.dictionaryTitle, 60) || DEFAULT_APP_CONFIG.dictionaryTitle,
		dictionarySubtitle: str(src.dictionarySubtitle, base.dictionarySubtitle, 240) || DEFAULT_APP_CONFIG.dictionarySubtitle,
		accentColor,
		pageBackground,
		fontScale,
		announcementBanner: str(src.announcementBanner, base.announcementBanner, 240),
		apkDownloadUrl: sanitizeApkUrl(src.apkDownloadUrl, base.apkDownloadUrl || ""),
		maintenanceMode: bool(src.maintenanceMode, base.maintenanceMode),
		maintenanceMessage: str(src.maintenanceMessage, base.maintenanceMessage, 240) || DEFAULT_APP_CONFIG.maintenanceMessage,
		enableTeacher: bool(src.enableTeacher, base.enableTeacher),
		enableLiveMode: bool(src.enableLiveMode, base.enableLiveMode),
		enableDictionary: bool(src.enableDictionary, base.enableDictionary),
		enableVoiceInput: bool(src.enableVoiceInput, base.enableVoiceInput),
		enableVoiceOutput: bool(src.enableVoiceOutput, base.enableVoiceOutput),
		enablePdfExport: bool(src.enablePdfExport, base.enablePdfExport),
		enableCamera: bool(src.enableCamera, base.enableCamera),
		defaultClass,
		defaultVoice,
		defaultLiveRole,
		temperature: rawTemp,
		conciseAnswers: bool(src.conciseAnswers, base.conciseAnswers),
		customTeacherPrompt: str(src.customTeacherPrompt, base.customTeacherPrompt, 600),
		customLivePrompt: str(src.customLivePrompt, base.customLivePrompt, 600),
		samplePrompts: sanitizeList(src.samplePrompts, base.samplePrompts, 6, 160),
		sampleWords: sanitizeList(src.sampleWords, base.sampleWords, 10, 60),
		updatedAt: toEpochMillis(src.updatedAt, base.updatedAt || Date.now())
	};
}
function isAuthorizedAdminUser(user) {
	if (!user || !user.emailVerified || !user.email) return false;
	return ADMIN_EMAILS.includes(user.email.toLowerCase());
}
async function signInAdminWithGoogle() {
	const user = (await signInWithPopup(auth, googleProvider)).user;
	if (!isAuthorizedAdminUser(user)) {
		const signedEmail = user.email || "unknown account";
		await signOut(auth).catch(() => {});
		throw new Error(`Signed in as ${signedEmail}, but only authorized Admin accounts (${ADMIN_EMAILS.join(" or ")}) can publish updates.`);
	}
	await ensureAdminDirectoryRecord(user);
	return user;
}
async function signOutFirebaseAdmin() {
	await signOut(auth);
}
async function ensureAdminDirectoryRecord(user) {
	const adminPath = `admins/${user.uid}`;
	const adminRef = doc(db, "admins", user.uid);
	try {
		const snap = await getDoc(adminRef);
		if (!snap.exists()) await setDoc(adminRef, {
			uid: user.uid,
			email: user.email || "mursalimmondal630@gmail.com",
			role: "admin",
			displayName: (user.displayName || "Amir").slice(0, 100),
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
		else await setDoc(adminRef, {
			uid: user.uid,
			email: user.email || "mursalimmondal630@gmail.com",
			role: "admin",
			displayName: (user.displayName || "Amir").slice(0, 100),
			createdAt: snap.data().createdAt ?? serverTimestamp(),
			updatedAt: serverTimestamp()
		}, { merge: true });
	} catch (error) {
		handleFirestoreError(error, "write", adminPath);
	}
}
async function getLatestFirestoreConfig() {
	const ref = doc(db, APP_SETTINGS_COLLECTION, APP_SETTINGS_DOC_ID);
	try {
		const snap = await getDocFromServer(ref);
		if (!snap.exists()) return null;
		return sanitizeAppConfigForClient(snap.data(), DEFAULT_APP_CONFIG);
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);
		if (msg.includes("permission") || msg.includes("PERMISSION_DENIED")) handleFirestoreError(error, "get", APP_SETTINGS_PATH);
		return null;
	}
}
function subscribeLiveAppSettings(onUpdate, onPermissionError) {
	const ref = doc(db, APP_SETTINGS_COLLECTION, APP_SETTINGS_DOC_ID);
	return onSnapshot(ref, (snapshot) => {
		if (!snapshot.exists()) return;
		onUpdate(sanitizeAppConfigForClient(snapshot.data(), DEFAULT_APP_CONFIG));
	}, (error) => {
		const code = error?.code || "";
		const msg = error instanceof Error ? error.message : String(error);
		if (code === "permission-denied" || msg.includes("permission") || msg.includes("PERMISSION_DENIED")) try {
			handleFirestoreError(error, "get", APP_SETTINGS_PATH);
		} catch (structuredErr) {
			if (onPermissionError && structuredErr instanceof Error) onPermissionError(structuredErr);
		}
	});
}
async function publishAppSettingsToFirestore(config, requestedVersion) {
	const user = auth.currentUser;
	if (!user || !isAuthorizedAdminUser(user)) throw new Error(`Please connect an authorized Admin Google account (${ADMIN_EMAILS.join(" or ")}) before publishing cloud updates to students.`);
	const ref = doc(db, APP_SETTINGS_COLLECTION, APP_SETTINGS_DOC_ID);
	let remoteVersion = 0;
	try {
		const existingSnap = await getDocFromServer(ref);
		if (existingSnap.exists()) {
			const existingData = existingSnap.data();
			if (typeof existingData.configVersion === "number" && Number.isFinite(existingData.configVersion)) remoteVersion = Math.floor(existingData.configVersion);
		}
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);
		if (msg.includes("permission") || msg.includes("PERMISSION_DENIED")) handleFirestoreError(error, "get", APP_SETTINGS_PATH);
	}
	const nextVersion = Math.min(1e6, Math.max(requestedVersion, remoteVersion + 1, 1));
	const clean = sanitizeAppConfigForClient({
		...config,
		configVersion: nextVersion
	}, DEFAULT_APP_CONFIG);
	const firestorePayload = {
		configVersion: clean.configVersion,
		updateTitle: clean.updateTitle,
		updateNotes: clean.updateNotes,
		appName: clean.appName,
		attributionText: clean.attributionText,
		welcomeTitle: clean.welcomeTitle,
		welcomeSubtitle: clean.welcomeSubtitle,
		dictionaryTitle: clean.dictionaryTitle,
		dictionarySubtitle: clean.dictionarySubtitle,
		accentColor: clean.accentColor,
		pageBackground: clean.pageBackground,
		fontScale: clean.fontScale,
		announcementBanner: clean.announcementBanner,
		apkDownloadUrl: clean.apkDownloadUrl,
		maintenanceMode: clean.maintenanceMode,
		maintenanceMessage: clean.maintenanceMessage,
		enableTeacher: clean.enableTeacher,
		enableLiveMode: clean.enableLiveMode,
		enableDictionary: clean.enableDictionary,
		enableVoiceInput: clean.enableVoiceInput,
		enableVoiceOutput: clean.enableVoiceOutput,
		enablePdfExport: clean.enablePdfExport,
		enableCamera: clean.enableCamera,
		defaultClass: clean.defaultClass,
		defaultVoice: clean.defaultVoice,
		defaultLiveRole: clean.defaultLiveRole,
		temperature: clean.temperature,
		conciseAnswers: clean.conciseAnswers,
		customTeacherPrompt: clean.customTeacherPrompt,
		customLivePrompt: clean.customLivePrompt,
		samplePrompts: clean.samplePrompts,
		sampleWords: clean.sampleWords,
		updatedAt: serverTimestamp(),
		updatedByUid: user.uid
	};
	try {
		await setDoc(ref, firestorePayload);
		return {
			...clean,
			updatedAt: Date.now()
		};
	} catch (error) {
		handleFirestoreError(error, "write", APP_SETTINGS_PATH);
	}
}
// src/components/FormattedBengaliText.tsx
var import_jsx_runtime = require_jsx_runtime();
function tokenizeInline(line) {
	const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
	const segments = [];
	for (const token of tokens) {
		if (!token) continue;
		if (token.startsWith("**") && token.endsWith("**") && token.length > 4) segments.push({
			text: token.slice(2, -2),
			kind: "bold"
		});
		else if (token.startsWith("`") && token.endsWith("`") && token.length > 2) segments.push({
			text: token.slice(1, -1),
			kind: "code"
		});
		else segments.push({
			text: token,
			kind: "text"
		});
	}
	return segments;
}
function findHighlightIntervals(plainText, highlights) {
	if (!plainText || highlights.length === 0) return [];
	const sortedPhrases = [...highlights].map((h) => h.trim()).filter((h) => h.length >= 2).sort((a, b) => b.length - a.length);
	const candidates = [];
	for (const phrase of sortedPhrases) {
		let searchFrom = 0;
		while (searchFrom < plainText.length) {
			const idx = plainText.indexOf(phrase, searchFrom);
			if (idx === -1) break;
			candidates.push({
				start: idx,
				end: idx + phrase.length,
				phrase
			});
			searchFrom = idx + phrase.length;
		}
	}
	candidates.sort((a, b) => a.start - b.start || b.end - a.end);
	const merged = [];
	for (const item of candidates) {
		const last = merged[merged.length - 1];
		if (!last || item.start >= last.end) merged.push(item);
	}
	return merged;
}
function extractSentenceAtPoint(clientX, clientY, fallbackEl) {
	let targetText = "";
	let offset = 0;
	const docWithCaret = document;
	if (typeof docWithCaret.caretPositionFromPoint === "function") {
		const pos = docWithCaret.caretPositionFromPoint(clientX, clientY);
		if (pos && pos.offsetNode.nodeType === Node.TEXT_NODE) {
			const parentBlock = pos.offsetNode.parentElement?.closest("p, li, h3, h4");
			if (parentBlock) {
				targetText = parentBlock.textContent || "";
				const preRange = document.createRange();
				preRange.selectNodeContents(parentBlock);
				preRange.setEnd(pos.offsetNode, pos.offset);
				offset = preRange.toString().length;
			}
		}
	} else if (typeof document.caretRangeFromPoint === "function") {
		const range = document.caretRangeFromPoint(clientX, clientY);
		if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
			const parentBlock = range.startContainer.parentElement?.closest("p, li, h3, h4");
			if (parentBlock) {
				targetText = parentBlock.textContent || "";
				const preRange = document.createRange();
				preRange.selectNodeContents(parentBlock);
				preRange.setEnd(range.startContainer, range.startOffset);
				offset = preRange.toString().length;
			}
		}
	}
	if (!targetText && fallbackEl) {
		targetText = (fallbackEl.closest("p, li, h3, h4") || fallbackEl).textContent || "";
		offset = Math.floor(targetText.length / 2);
	}
	const trimmed = targetText.trim();
	if (!trimmed) return "";
	const clampedOffset = Math.max(0, Math.min(offset, targetText.length));
	const delimiters = /[।.?!\n]/;
	let start = clampedOffset;
	while (start > 0 && !delimiters.test(targetText[start - 1])) start--;
	let end = clampedOffset;
	while (end < targetText.length && !delimiters.test(targetText[end])) end++;
	if (end < targetText.length && /[।.?!]/.test(targetText[end])) end++;
	const sentence = targetText.slice(start, end).trim();
	return sentence.length >= 2 ? sentence : trimmed;
}
function renderInlineWithHighlights(line, highlights, onClickMark) {
	const segments = tokenizeInline(line);
	if (segments.length === 0) return [];
	const intervals = findHighlightIntervals(segments.map((s) => s.text).join(""), highlights);
	if (intervals.length === 0) return segments.map((seg, idx) => {
		if (seg.kind === "bold") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-slate-900 dark:text-white",
			children: seg.text
		}, idx);
		if (seg.kind === "code") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[0.9em]",
			children: seg.text
		}, idx);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: seg.text }, idx);
	});
	const nodes = [];
	let cursor = 0;
	let intervalIdx = 0;
	segments.forEach((seg, segIdx) => {
		const segStart = cursor;
		const segEnd = segStart + seg.text.length;
		let localPos = segStart;
		const wrapKind = (content, key) => {
			if (seg.kind === "bold") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "font-semibold text-slate-900 dark:text-white",
				children: content
			}, key);
			if (seg.kind === "code") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[0.9em]",
				children: content
			}, key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: content }, key);
		};
		while (intervalIdx < intervals.length && intervals[intervalIdx].end <= localPos) intervalIdx++;
		while (localPos < segEnd) {
			const activeInterval = intervals[intervalIdx];
			if (!activeInterval || activeInterval.start >= segEnd) {
				const tailText = seg.text.slice(localPos - segStart);
				if (tailText) nodes.push(wrapKind(tailText, `${segIdx}-tail-${localPos}`));
				localPos = segEnd;
				break;
			}
			if (localPos < activeInterval.start) {
				const beforeText = seg.text.slice(localPos - segStart, activeInterval.start - segStart);
				if (beforeText) nodes.push(wrapKind(beforeText, `${segIdx}-pre-${localPos}`));
				localPos = activeInterval.start;
			}
			const markEnd = Math.min(segEnd, activeInterval.end);
			const highlightedText = seg.text.slice(localPos - segStart, markEnd - segStart);
			if (highlightedText) {
				const phraseToRemove = activeInterval.phrase;
				nodes.push(wrapKind(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
					"data-highlight": phraseToRemove,
					onClick: (e) => {
						if (!onClickMark) return;
						e.stopPropagation();
						const sel = window.getSelection()?.toString().trim();
						if (sel && sel.length >= 2) return;
						onClickMark(phraseToRemove, e.currentTarget.getBoundingClientRect());
					},
					title: "Tap to remove highlight",
					className: "bg-yellow-200/95 dark:bg-yellow-400/35 text-slate-900 dark:text-yellow-100 rounded-xs px-0.5 box-decoration-clone cursor-pointer transition-colors hover:bg-yellow-300 dark:hover:bg-yellow-400/50",
					children: highlightedText
				}), `${segIdx}-mark-${localPos}`));
			}
			localPos = markEnd;
			if (localPos >= activeInterval.end) intervalIdx++;
		}
		cursor = segEnd;
	});
	return nodes;
}
function FormattedBengaliText({ text, highlights = [], interactive = false, onAddHighlight, onRemoveHighlight }) {
	const containerRef = (0, import_react.useRef)(null);
	const longPressTimerRef = (0, import_react.useRef)(null);
	const pointerStartRef = (0, import_react.useRef)(null);
	const [floatingBar, setFloatingBar] = (0, import_react.useState)(null);
	const clearLongPressTimer = (0, import_react.useCallback)(() => {
		if (longPressTimerRef.current !== null) {
			window.clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
	}, []);
	const showBarFromRect = (0, import_react.useCallback)((phrase, mode, rect) => {
		const container = containerRef.current;
		if (!container) return;
		const containerRect = container.getBoundingClientRect();
		const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
		const rawX = rect.left + rect.width / 2 - containerRect.left;
		const clampedX = Math.max(115, Math.min(rawX, Math.max(115, containerRect.width - 115)));
		const spaceAbove = rect.top;
		const placeBelow = isCoarsePointer || spaceAbove < 90;
		const rawY = placeBelow ? rect.bottom - containerRect.top + 8 : rect.top - containerRect.top - 8;
		setFloatingBar({
			phrase,
			mode,
			x: clampedX,
			y: rawY,
			placeBelow
		});
	}, []);
	const inspectActiveSelection = (0, import_react.useCallback)(() => {
		if (!interactive || !onAddHighlight) return;
		const container = containerRef.current;
		if (!container) return;
		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
		const anchorNode = sel.anchorNode;
		const focusNode = sel.focusNode;
		if (!anchorNode || !focusNode || !container.contains(anchorNode) || !container.contains(focusNode)) return;
		const selectedText = sel.toString().trim();
		if (selectedText.length < 2) return;
		const rect = sel.getRangeAt(0).getBoundingClientRect();
		if (rect.width === 0 && rect.height === 0) return;
		const alreadyHighlighted = highlights.some((h) => h.trim() === selectedText || h.includes(selectedText) && selectedText.length >= 4);
		const matchingHighlight = alreadyHighlighted ? highlights.find((h) => h.trim() === selectedText || h.includes(selectedText)) || selectedText : selectedText;
		showBarFromRect(matchingHighlight, alreadyHighlighted ? "remove" : "add", rect);
	}, [
		highlights,
		interactive,
		onAddHighlight,
		showBarFromRect
	]);
	(0, import_react.useEffect)(() => {
		if (!interactive) return;
		const onSelectionChange = () => {
			const sel = window.getSelection();
			if (!sel || sel.isCollapsed) {
				setFloatingBar((prev) => prev?.mode === "add" ? null : prev);
				return;
			}
			inspectActiveSelection();
		};
		const onDocPointerDown = (e) => {
			const target = e.target;
			if (containerRef.current && target && !containerRef.current.contains(target)) setFloatingBar(null);
		};
		document.addEventListener("selectionchange", onSelectionChange);
		document.addEventListener("pointerdown", onDocPointerDown);
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange);
			document.removeEventListener("pointerdown", onDocPointerDown);
			clearLongPressTimer();
		};
	}, [
		clearLongPressTimer,
		inspectActiveSelection,
		interactive
	]);
	const handlePointerDown = (e) => {
		if (!interactive || !onAddHighlight) return;
		if (e.target?.closest("[data-highlight-toolbar=\"true\"]")) return;
		clearLongPressTimer();
		const clientX = e.clientX;
		const clientY = e.clientY;
		const targetEl = e.target;
		pointerStartRef.current = {
			x: clientX,
			y: clientY
		};
		longPressTimerRef.current = window.setTimeout(() => {
			longPressTimerRef.current = null;
			const sel = window.getSelection();
			if ((sel?.toString().trim() || "").length >= 2 && sel && sel.rangeCount > 0) {
				inspectActiveSelection();
				return;
			}
			const sentence = extractSentenceAtPoint(clientX, clientY, targetEl);
			if (sentence.length >= 2) {
				const existing = highlights.find((h) => h.trim() === sentence || sentence.includes(h.trim()));
				const anchorRect = new DOMRect(clientX - 40, clientY - 12, 80, 24);
				showBarFromRect(existing || sentence, existing ? "remove" : "add", anchorRect);
			}
		}, 460);
	};
	const handlePointerMove = (e) => {
		if (!pointerStartRef.current) return;
		const dx = Math.abs(e.clientX - pointerStartRef.current.x);
		const dy = Math.abs(e.clientY - pointerStartRef.current.y);
		if (dx > 10 || dy > 10) clearLongPressTimer();
	};
	const handlePointerUpOrCancel = () => {
		clearLongPressTimer();
		pointerStartRef.current = null;
		window.setTimeout(() => {
			inspectActiveSelection();
		}, 20);
	};
	const handleMarkClick = (0, import_react.useCallback)((phrase, rect) => {
		if (!interactive || !onRemoveHighlight) return;
		showBarFromRect(phrase, "remove", rect);
	}, [
		interactive,
		onRemoveHighlight,
		showBarFromRect
	]);
	const handleConfirmHighlight = () => {
		if (!floatingBar) return;
		if (floatingBar.mode === "add") floatingBar.phrase.split(/\r?\n/).map((p) => p.trim()).filter((p) => p.length >= 2).forEach((part) => onAddHighlight?.(part));
		else onRemoveHighlight?.(floatingBar.phrase);
		try {
			window.getSelection()?.removeAllRanges();
		} catch {}
		setFloatingBar(null);
	};
	const elements = (0, import_react.useMemo)(() => {
		const lines = text.split(/\r?\n/);
		const rendered = [];
		let listBuffer = null;
		const markHandler = interactive ? handleMarkClick : void 0;
		const flushList = (keyPrefix) => {
			if (!listBuffer) return;
			if (listBuffer.ordered) rendered.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "list-decimal pl-6 space-y-2 text-[16px] leading-[1.7] text-slate-800 dark:text-slate-200",
				children: listBuffer.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "pl-1",
					children: renderInlineWithHighlights(item, highlights, markHandler)
				}, idx))
			}, `${keyPrefix}-ol`));
			else rendered.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-disc pl-6 space-y-2 text-[16px] leading-[1.7] text-slate-800 dark:text-slate-200",
				children: listBuffer.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "pl-1",
					children: renderInlineWithHighlights(item, highlights, markHandler)
				}, idx))
			}, `${keyPrefix}-ul`));
			listBuffer = null;
		};
		lines.forEach((rawLine, index) => {
			const line = rawLine.trim();
			if (!line) {
				flushList(`line-${index}`);
				return;
			}
			if (line.startsWith("### ")) {
				flushList(`line-${index}`);
				rendered.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-base font-semibold text-slate-900 dark:text-white pt-3 pb-1 border-b border-slate-100 dark:border-slate-800",
					children: renderInlineWithHighlights(line.slice(4), highlights, markHandler)
				}, `h4-${index}`));
				return;
			}
			if (line.startsWith("## ") || line.startsWith("# ")) {
				flushList(`line-${index}`);
				const content = line.startsWith("## ") ? line.slice(3) : line.slice(2);
				rendered.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold text-slate-900 dark:text-white pt-3 pb-1 border-b border-slate-100 dark:border-slate-800",
					children: renderInlineWithHighlights(content, highlights, markHandler)
				}, `h3-${index}`));
				return;
			}
			const unorderedMatch = line.match(/^[-*•]\s+(.*)$/);
			if (unorderedMatch) {
				if (!listBuffer || listBuffer.ordered) {
					flushList(`line-${index}`);
					listBuffer = {
						ordered: false,
						items: []
					};
				}
				listBuffer.items.push(unorderedMatch[1]);
				return;
			}
			const orderedMatch = line.match(/^(?:\d+|[০-৯]+)[.)]\s+(.*)$/);
			if (orderedMatch) {
				if (!listBuffer || !listBuffer.ordered) {
					flushList(`line-${index}`);
					listBuffer = {
						ordered: true,
						items: []
					};
				}
				listBuffer.items.push(orderedMatch[1]);
				return;
			}
			flushList(`line-${index}`);
			rendered.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[16px] leading-[1.7] text-slate-800 dark:text-slate-200",
				children: renderInlineWithHighlights(line, highlights, markHandler)
			}, `p-${index}`));
		});
		flushList("end");
		return rendered;
	}, [
		handleMarkClick,
		highlights,
		interactive,
		text
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUpOrCancel,
		onPointerCancel: handlePointerUpOrCancel,
		className: "relative space-y-3.5 w-full select-text",
		children: [elements, interactive && floatingBar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-highlight-toolbar": "true",
			style: {
				left: `${floatingBar.x}px`,
				top: `${floatingBar.y}px`,
				transform: floatingBar.placeBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)"
			},
			className: "absolute z-30 max-w-[min(300px,calc(100vw-2rem))] rounded-xl bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 shadow-xl p-1.5 flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onPointerDown: (e) => e.stopPropagation(),
				onClick: handleConfirmHighlight,
				className: `min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${floatingBar.mode === "add" ? "bg-yellow-400 text-slate-950 hover:bg-yellow-300" : "bg-rose-600 text-white hover:bg-rose-500"}`,
				children: floatingBar.mode === "add" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlighter, { className: "w-3.5 h-3.5 shrink-0" }), "Highlight Yellow"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 shrink-0" }), "Remove Highlight"] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onPointerDown: (e) => e.stopPropagation(),
				onClick: () => {
					try {
						window.getSelection()?.removeAllRanges();
					} catch {}
					setFloatingBar(null);
				},
				"aria-label": "Cancel highlight",
				className: "min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/70 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
			})]
		})]
	});
}
// src/components/InteractiveQuizCard.tsx
var BN_NUMS = [
	"০",
	"১",
	"২",
	"৩",
	"৪",
	"৫",
	"৬",
	"৭",
	"৮",
	"৯"
];
function toBnNumber(n) {
	return String(n).replace(/[0-9]/g, (d) => BN_NUMS[Number(d)] ?? d);
}
var InteractiveQuizCard = ({ quiz, isBusy = false, onRequestNewQuiz }) => {
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [showResult, setShowResult] = (0, import_react.useState)(false);
	const isBengali = quiz.language !== "en";
	const optionLabels = isBengali ? [
		"ক",
		"খ",
		"গ",
		"ঘ"
	] : [
		"A",
		"B",
		"C",
		"D"
	];
	const totalQuestions = quiz.questions.length;
	const currentQ = quiz.questions[currentIndex];
	const answeredCount = (0, import_react.useMemo)(() => Object.keys(answers).length, [answers]);
	const correctCount = (0, import_react.useMemo)(() => quiz.questions.reduce((acc, q, idx) => {
		return acc + (answers[idx] === q.correctIndex ? 1 : 0);
	}, 0), [answers, quiz.questions]);
	if (!currentQ || totalQuestions === 0) return null;
	const selectedOption = answers[currentIndex];
	const hasAnsweredCurrent = selectedOption !== void 0;
	const isCurrentCorrect = hasAnsweredCurrent && selectedOption === currentQ.correctIndex;
	const isLastQuestion = currentIndex === totalQuestions - 1;
	const progressPercent = Math.round((currentIndex + 1) / totalQuestions * 100);
	const scorePercent = Math.round(correctCount / totalQuestions * 100);
	const handleSelectOption = (optionIdx) => {
		if (hasAnsweredCurrent) return;
		setAnswers((prev) => ({
			...prev,
			[currentIndex]: optionIdx
		}));
	};
	const handleNext = () => {
		if (isLastQuestion) setShowResult(true);
		else setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
	};
	const handlePrev = () => {
		setCurrentIndex((prev) => Math.max(0, prev - 1));
	};
	const handleRetry = () => {
		setAnswers({});
		setCurrentIndex(0);
		setShowResult(false);
	};
	const fmtNum = (n) => isBengali ? toBnNumber(n) : String(n);
	if (showResult) {
		const remark = scorePercent >= 80 ? isBengali ? "অসাধারণ পারফরম্যান্স! তোমার প্রস্তুতি দারুণ।" : "Outstanding performance! You nailed this topic." : scorePercent >= 50 ? isBengali ? "খুব ভালো হয়েছে! ভুল উত্তরগুলো দেখে আরেকবার অনুশীলন করো।" : "Good job! Review the missed questions to score 100%." : isBengali ? "চেষ্টা চালিয়ে যাও! নিচের ব্যাখ্যাগুলো পড়ে আবার কুইজ দাও।" : "Keep practicing! Read the explanations below and try again.";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-fuchsia-400/40 dark:border-cyan-400/35 bg-white dark:bg-[#101325]/95 shadow-lg dark:shadow-[0_12px_36px_rgba(6,182,212,0.14)] overflow-hidden max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 sm:px-5 py-4 bg-gradient-to-r from-fuchsia-600/15 via-violet-600/15 to-cyan-500/15 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white",
						children: quiz.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-600 dark:text-slate-300",
						children: [
							isBengali ? "কুইজের ফলাফল সম্পন্ন" : "Quiz Completed",
							" · ",
							quiz.className
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-600 to-cyan-600 dark:from-fuchsia-400 dark:to-cyan-300 bg-clip-text text-transparent tabular-nums",
						children: [
							fmtNum(correctCount),
							" / ",
							fmtNum(totalQuestions),
							" (",
							fmtNum(scorePercent),
							"%)"
						]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 sm:p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5",
						children: remark
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5 max-h-[340px] overflow-y-auto pr-1",
						children: quiz.questions.map((q, idx) => {
							const picked = answers[idx];
							const isRight = picked === q.correctIndex;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-xl border p-3 text-xs sm:text-sm space-y-1.5 ${isRight ? "border-emerald-300/70 dark:border-emerald-500/35 bg-emerald-50/70 dark:bg-emerald-950/25" : "border-rose-300/70 dark:border-rose-500/35 bg-rose-50/70 dark:bg-rose-950/25"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [isRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-semibold text-slate-900 dark:text-white leading-snug",
										children: [
											fmtNum(idx + 1),
											". ",
											q.question
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pl-6 space-y-0.5 text-xs",
									children: [
										!isRight && picked !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-rose-700 dark:text-rose-300",
											children: [
												isBengali ? "তোমার উত্তর:" : "Your answer:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold",
													children: [
														"(",
														optionLabels[picked],
														") ",
														q.options[picked]
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-emerald-700 dark:text-emerald-300",
											children: [
												isBengali ? "সঠিক উত্তর:" : "Correct answer:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold",
													children: [
														"(",
														optionLabels[q.correctIndex],
														") ",
														q.options[q.correctIndex]
													]
												})
											]
										}),
										q.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-600 dark:text-slate-300 pt-0.5 leading-relaxed",
											children: q.explanation
										})
									]
								})]
							}, q.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2.5 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleRetry,
							className: "min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-4 h-4" }), isBengali ? "আবার চেষ্টা করো" : "Retry Quiz"]
						}), onRequestNewQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: isBusy,
							onClick: () => onRequestNewQuiz(quiz.topic),
							className: "min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 hover:brightness-110 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), isBengali ? "এই টপিকে নতুন কুইজ বানাও" : "New Quiz on This Topic"]
						})]
					})
				]
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-fuchsia-400/40 dark:border-cyan-400/35 bg-white dark:bg-[#101325]/95 shadow-lg dark:shadow-[0_10px_32px_rgba(168,85,247,0.14)] overflow-hidden max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 sm:px-5 py-3.5 bg-gradient-to-r from-fuchsia-600/12 via-violet-600/12 to-cyan-500/12 border-b border-slate-200 dark:border-white/10 space-y-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate",
							children: quiz.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 truncate",
							children: [
								quiz.topic,
								" · ",
								quiz.className,
								quiz.source === "offline" ? " · অফলাইন" : ""
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0 text-xs font-bold tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/10 text-slate-800 dark:text-cyan-200 border border-slate-200 dark:border-white/10",
						children: isBengali ? `প্রশ্ন ${fmtNum(currentIndex + 1)} / ${fmtNum(totalQuestions)}` : `Q ${currentIndex + 1} / ${totalQuestions}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30",
						children: isBengali ? `স্কোর: ${fmtNum(correctCount)}/${fmtNum(answeredCount)}` : `Score: ${correctCount}/${answeredCount}`
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-400 transition-all duration-300",
					style: { width: `${progressPercent}%` }
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 sm:p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[15px] sm:text-[16.5px] font-bold text-slate-900 dark:text-white leading-relaxed",
					children: [
						fmtNum(currentIndex + 1),
						". ",
						currentQ.question
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-2.5",
					children: currentQ.options.map((optionText, optIdx) => {
						const isPicked = selectedOption === optIdx;
						const isCorrectOpt = optIdx === currentQ.correctIndex;
						let optionClasses = "border-slate-200 dark:border-white/12 bg-slate-50/70 dark:bg-[#171a2f]/90 hover:border-fuchsia-400 dark:hover:border-cyan-400/70 hover:bg-white dark:hover:bg-[#1d213b] text-slate-800 dark:text-slate-100";
						let badgeClasses = "bg-white dark:bg-white/10 text-slate-700 dark:text-cyan-200 border border-slate-200 dark:border-white/15";
						if (hasAnsweredCurrent) {
							if (isCorrectOpt) {
								optionClasses = "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/55 text-emerald-950 dark:text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.2)]";
								badgeClasses = "bg-emerald-500 text-white border border-emerald-400";
							} else if (isPicked) {
								optionClasses = "border-rose-500 dark:border-rose-400 bg-rose-50 dark:bg-rose-950/55 text-rose-950 dark:text-rose-100";
								badgeClasses = "bg-rose-500 text-white border border-rose-400";
							} else optionClasses = "border-slate-200/70 dark:border-white/8 bg-slate-50/40 dark:bg-[#131628]/60 text-slate-500 dark:text-slate-400 opacity-75";
						}
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: hasAnsweredCurrent,
							onClick: () => handleSelectOption(optIdx),
							className: `w-full text-left px-3.5 py-3 rounded-xl border transition-all flex items-center gap-3 active:scale-[0.99] disabled:cursor-default ${optionClasses}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 transition-colors ${badgeClasses}`,
									children: optionLabels[optIdx]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-sm sm:text-[15px] font-medium leading-snug",
									children: optionText
								}),
								hasAnsweredCurrent && isCorrectOpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" }),
								hasAnsweredCurrent && isPicked && !isCorrectOpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" })
							]
						}, `${currentQ.id}-opt-${optIdx}`);
					})
				}),
				hasAnsweredCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl border px-3.5 py-3 text-xs sm:text-sm space-y-1 ${isCurrentCorrect ? "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/35 text-emerald-900 dark:text-emerald-100" : "border-amber-300 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/35 text-amber-950 dark:text-amber-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpenCheck, { className: "w-4 h-4 shrink-0" }), isCurrentCorrect ? isBengali ? "সঠিক উত্তর! খুব ভালো হয়েছে।" : "Correct! Great job." : isBengali ? `ভুল হয়েছে — সঠিক উত্তর হলো (${optionLabels[currentQ.correctIndex]}) ${currentQ.options[currentQ.correctIndex]}` : `Incorrect — Correct answer is (${optionLabels[currentQ.correctIndex]}) ${currentQ.options[currentQ.correctIndex]}`]
					}), currentQ.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "leading-relaxed opacity-90",
						children: currentQ.explanation
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80 dark:border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handlePrev,
							disabled: currentIndex === 0,
							className: "min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 inline-flex items-center gap-1 disabled:opacity-40 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3.5 h-3.5" }), isBengali ? "আগের" : "Prev"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden sm:flex items-center gap-1 pl-1",
							children: quiz.questions.map((q, idx) => {
								const ans = answers[idx];
								const isActive = idx === currentIndex;
								let dotClass = "bg-slate-200 dark:bg-white/15 text-slate-600 dark:text-slate-300";
								if (ans !== void 0) dotClass = ans === q.correctIndex ? "bg-emerald-500 text-white" : "bg-rose-500 text-white";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCurrentIndex(idx),
									className: `w-6 h-6 rounded-md text-[11px] font-bold transition-all ${dotClass} ${isActive ? "ring-2 ring-cyan-400 ring-offset-1 dark:ring-offset-[#101325]" : ""}`,
									children: fmtNum(idx + 1)
								}, q.id);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleNext,
						className: `min-h-[38px] px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all ${hasAnsweredCurrent ? "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white shadow-md hover:brightness-110" : "border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"}`,
						children: isLastQuestion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-4 h-4" }), isBengali ? "ফলাফল দেখুন" : "View Result"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [hasAnsweredCurrent ? isBengali ? "পরের প্রশ্ন" : "Next Question" : isBengali ? "স্কিপ করুন" : "Skip", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })] })
					})]
				})
			]
		})]
	});
};
// src/components/StudentAvatar.tsx
var AVATAR_COLOR_OPTIONS = [
	{
		id: "cyan",
		label: "Sky Cyan",
		bgClass: "from-cyan-500 via-sky-500 to-blue-600",
		ringClass: "ring-cyan-400/70",
		swatchClass: "bg-gradient-to-br from-cyan-400 to-blue-600"
	},
	{
		id: "violet",
		label: "Royal Violet",
		bgClass: "from-fuchsia-500 via-purple-500 to-indigo-600",
		ringClass: "ring-fuchsia-400/70",
		swatchClass: "bg-gradient-to-br from-fuchsia-500 to-indigo-600"
	},
	{
		id: "rose",
		label: "Coral Rose",
		bgClass: "from-rose-500 via-pink-500 to-orange-500",
		ringClass: "ring-rose-400/70",
		swatchClass: "bg-gradient-to-br from-rose-500 to-orange-500"
	},
	{
		id: "emerald",
		label: "Mint Green",
		bgClass: "from-emerald-400 via-teal-500 to-cyan-600",
		ringClass: "ring-emerald-400/70",
		swatchClass: "bg-gradient-to-br from-emerald-400 to-teal-600"
	},
	{
		id: "amber",
		label: "Warm Gold",
		bgClass: "from-amber-400 via-orange-500 to-rose-500",
		ringClass: "ring-amber-400/70",
		swatchClass: "bg-gradient-to-br from-amber-400 to-orange-500"
	},
	{
		id: "indigo",
		label: "Midnight Blue",
		bgClass: "from-indigo-500 via-blue-600 to-slate-800",
		ringClass: "ring-indigo-400/70",
		swatchClass: "bg-gradient-to-br from-indigo-500 to-slate-800"
	}
];
var AVATAR_PRESET_OPTIONS = [
	{
		id: "boy-scholar",
		label: "ছাত্র (Boy)"
	},
	{
		id: "girl-scholar",
		label: "ছাত্রী (Girl)"
	},
	{
		id: "initial",
		label: "অক্ষর (Letter)"
	},
	{
		id: "astronaut",
		label: "মহাকাশ"
	},
	{
		id: "owl",
		label: "জ্ঞানী পেঁচা"
	},
	{
		id: "rocket",
		label: "রকেট"
	},
	{
		id: "atom",
		label: "বিজ্ঞান"
	},
	{
		id: "book",
		label: "বইপ্রেমী"
	},
	{
		id: "palette",
		label: "আর্ট"
	},
	{
		id: "star",
		label: "স্টার"
	}
];
function getAvatarColorOption(color) {
	return AVATAR_COLOR_OPTIONS.find((c) => c.id === color) ?? AVATAR_COLOR_OPTIONS[0];
}
function getStudentInitial(name) {
	const clean = (name || "").trim();
	if (!clean) return "S";
	return (Array.from(clean)[0] || "S").toUpperCase();
}
async function compressAvatarImageFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("ছবিটি পড়া যায়নি। অন্য একটি ছবি চেষ্টা করো।"));
		reader.onload = (e) => {
			const rawUrl = e.target?.result;
			if (typeof rawUrl !== "string") {
				reject(/* @__PURE__ */ new Error("অবৈধ ছবি ফাইল।"));
				return;
			}
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("এই ছবিটি সাপোর্ট করছে না। JPG বা PNG বেছে নাও।"));
			img.onload = () => {
				const size = 256;
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(rawUrl);
					return;
				}
				const minSide = Math.min(img.width, img.height);
				const sx = Math.floor((img.width - minSide) / 2);
				const sy = Math.floor((img.height - minSide) / 2);
				ctx.fillStyle = "#0f172a";
				ctx.fillRect(0, 0, size, size);
				ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
				resolve(canvas.toDataURL("image/jpeg", .84));
			};
			img.src = rawUrl;
		};
		reader.readAsDataURL(file);
	});
}
function renderPresetArtwork(preset, initial) {
	switch (preset) {
		case "boy-scholar": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "58",
					r: "18",
					fill: "#1e293b",
					fillOpacity: "0.88"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M22 50 L32 58 L42 50",
					fill: "#ffffff",
					fillOpacity: "0.92"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "30",
					r: "14",
					fill: "#fde6d0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M17 29 C17 18 23 13 32 13 C41 13 47 18 47 29 C44 23 39 21 32 21 C25 21 20 23 17 29 Z",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "26.5",
					cy: "31",
					r: "2",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "37.5",
					cy: "31",
					r: "2",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M27.5 37.5 Q32 41 36.5 37.5",
					fill: "none",
					stroke: "#9a3412",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: "32,7 48,13 32,19 16,13",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "44",
					y: "13",
					width: "2",
					height: "9",
					rx: "1",
					fill: "#fbbf24"
				})
			]
		});
		case "girl-scholar": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 32 C16 17 23 12 32 12 C41 12 48 17 48 32 L49 48 C43 52 21 52 15 48 Z",
					fill: "#1e1b4b"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "58",
					r: "18",
					fill: "#312e81",
					fillOpacity: "0.9"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "31",
					r: "13.5",
					fill: "#fde6d0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M18.5 29 C21 20 28 18 32 19 C36 18 43 20 45.5 29 C41 24 36 22 32 23 C28 22 23 24 18.5 29 Z",
					fill: "#1e1b4b"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "27",
					cy: "32",
					r: "2",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "37",
					cy: "32",
					r: "2",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "23.5",
					cy: "35",
					r: "2",
					fill: "#fda4af",
					fillOpacity: "0.55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "40.5",
					cy: "35",
					r: "2",
					fill: "#fda4af",
					fillOpacity: "0.55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M28 38 Q32 41.2 36 38",
					fill: "none",
					stroke: "#9a3412",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "19",
					cy: "25",
					r: "3",
					fill: "#f43f5e"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "45",
					cy: "25",
					r: "3",
					fill: "#f43f5e"
				})
			]
		});
		case "astronaut": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "57",
					r: "19",
					fill: "#f8fafc"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "26",
					y: "48",
					width: "12",
					height: "8",
					rx: "2.5",
					fill: "#38bdf8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "30",
					r: "16",
					fill: "#f8fafc"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "20",
					y: "21",
					width: "24",
					height: "17",
					rx: "8.5",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M24 25 Q28 22 33 24",
					fill: "none",
					stroke: "#38bdf8",
					strokeWidth: "2.5",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "49",
					cy: "14",
					r: "2",
					fill: "#fde047"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "14",
					cy: "18",
					r: "1.5",
					fill: "#ffffff"
				})
			]
		});
		case "owl": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "32",
					cy: "38",
					rx: "18",
					ry: "19",
					fill: "#fef3c7",
					fillOpacity: "0.95"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 25 L22 15 L29 22 Z",
					fill: "#b45309"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M48 25 L42 15 L35 22 Z",
					fill: "#b45309"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24.5",
					cy: "30",
					r: "7",
					fill: "#ffffff",
					stroke: "#b45309",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "39.5",
					cy: "30",
					r: "7",
					fill: "#ffffff",
					stroke: "#b45309",
					strokeWidth: "2.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24.5",
					cy: "30",
					r: "3",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "39.5",
					cy: "30",
					r: "3",
					fill: "#0f172a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: "32,34 28.5,40 35.5,40",
					fill: "#f59e0b"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M23 47 Q32 52 41 47",
					fill: "none",
					stroke: "#b45309",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				})
			]
		});
		case "rocket": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M32 10 C40 18 42 30 40 42 L24 42 C22 30 24 18 32 10 Z",
					fill: "#f8fafc"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M32 10 C36 14 38 18 39 22 L25 22 C26 18 28 14 32 10 Z",
					fill: "#f43f5e"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "30",
					r: "4.5",
					fill: "#0ea5e9",
					stroke: "#e2e8f0",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M24 35 L16 44 L24 43 Z",
					fill: "#f43f5e"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M40 35 L48 44 L40 43 Z",
					fill: "#f43f5e"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M27 44 L32 55 L37 44 Z",
					fill: "#fbbf24"
				})
			]
		});
		case "atom": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "32",
					cy: "32",
					rx: "22",
					ry: "9",
					fill: "none",
					stroke: "#ffffff",
					strokeWidth: "2.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "32",
					cy: "32",
					rx: "22",
					ry: "9",
					fill: "none",
					stroke: "#ffffff",
					strokeWidth: "2.4",
					transform: "rotate(60 32 32)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "32",
					cy: "32",
					rx: "22",
					ry: "9",
					fill: "none",
					stroke: "#ffffff",
					strokeWidth: "2.4",
					transform: "rotate(120 32 32)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "32",
					r: "5",
					fill: "#fde047"
				})
			]
		});
		case "book": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M14 20 Q23 17 32 22 L32 47 Q23 42 14 45 Z",
					fill: "#ffffff",
					fillOpacity: "0.95"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M50 20 Q41 17 32 22 L32 47 Q41 42 50 45 Z",
					fill: "#e2e8f0",
					fillOpacity: "0.95"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "19",
					y1: "28",
					x2: "28",
					y2: "29",
					stroke: "#64748b",
					strokeWidth: "2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "19",
					y1: "34",
					x2: "28",
					y2: "35",
					stroke: "#64748b",
					strokeWidth: "2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "36",
					y1: "29",
					x2: "45",
					y2: "28",
					stroke: "#64748b",
					strokeWidth: "2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "36",
					y1: "35",
					x2: "45",
					y2: "34",
					stroke: "#64748b",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			]
		});
		case "palette": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M32 13 C20 13 12 22 12 33 C12 44 20 51 30 51 C34 51 36 48 35 45 C34 42 36 40 39 40 L44 40 C49 40 52 36 52 31 C52 20 43 13 32 13 Z",
					fill: "#fef3c7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "23",
					cy: "27",
					r: "3.2",
					fill: "#ef4444"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "22",
					r: "3.2",
					fill: "#3b82f6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "42",
					cy: "26",
					r: "3.2",
					fill: "#10b981"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "22",
					cy: "37",
					r: "3.2",
					fill: "#a855f7"
				})
			]
		});
		case "star": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 64 64",
			className: "w-full h-full",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "32,11 38.4,24 52.8,26 42.4,36.2 44.8,50.5 32,43.7 19.2,50.5 21.6,36.2 11.2,26 25.6,24",
				fill: "#fde047",
				stroke: "#ffffff",
				strokeWidth: "2",
				strokeLinejoin: "round"
			})
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-bold text-white leading-none select-none drop-shadow-xs",
			children: initial
		});
	}
}
var SIZE_CLASSES = {
	xs: "w-6 h-6 text-[11px]",
	sm: "w-8 h-8 text-xs",
	md: "w-11 h-11 text-base",
	lg: "w-16 h-16 text-2xl",
	xl: "w-22 h-22 text-3xl"
};
function StudentAvatar({ profile, size = "sm", className = "" }) {
	const [imgFailed, setImgFailed] = (0, import_react.useState)(false);
	const colorOpt = getAvatarColorOption(profile.avatarColor || "cyan");
	const initial = getStudentInitial(profile.name);
	const showCustomImg = profile.avatarType === "custom" && Boolean(profile.customAvatarDataUrl) && !imgFailed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative rounded-full overflow-hidden shrink-0 inline-flex items-center justify-center bg-gradient-to-br ${colorOpt.bgClass} ring-2 ${colorOpt.ringClass} ${SIZE_CLASSES[size]} ${className}`,
		children: showCustomImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: profile.customAvatarDataUrl,
			alt: profile.name ? `${profile.name} avatar` : "Student avatar",
			referrerPolicy: "no-referrer",
			onError: () => setImgFailed(true),
			className: "w-full h-full object-cover"
		}) : renderPresetArtwork(profile.avatarPreset || "initial", initial)
	});
}
// src/offline/offlineQuiz.ts
var BENGALI_DIGITS$1 = {
	"০": "0",
	"১": "1",
	"২": "2",
	"৩": "3",
	"৪": "4",
	"৫": "5",
	"৬": "6",
	"৭": "7",
	"৮": "8",
	"৯": "9"
};
function normalizeDigits(text) {
	return text.replace(/[০-৯]/g, (d) => BENGALI_DIGITS$1[d] ?? d);
}
var QUIZ_INTENT_REGEX = /(?:\b(?:quiz|quize|quizzes|kuij|kwiz|mcq|mcqs|mock\s*test|multiple\s*choice|objective\s*questions?)\b|কুইজ|কুইয|এমসিকিউ|বহুনির্বাচনী|মক\s*টেস্ট|অবজেক্টিভ\s*প্রশ্ন|৪\s*অপশন|চারটি\s*অপশন|চারটা\s*অপশন)/i;
function detectQuizRequest(rawText) {
	const text = (rawText ?? "").trim();
	if (!text || !QUIZ_INTENT_REGEX.test(text)) return {
		isQuiz: false,
		count: 5,
		topic: ""
	};
	const normalized = normalizeDigits(text);
	let count = 5;
	for (const pattern of [/(\d{1,2})\s*(?:টি|টা|খানা|questions?|qs?|quiz|mcq|প্রশ্ন|কুইজ|prosh?no|prosno)/i, /(?:questions?|quiz|কুইজ|প্রশ্ন)\s*(?:of|:|-)?\s*(\d{1,2})\b/i]) {
		const match = normalized.match(pattern);
		if (match?.[1]) {
			const parsed = Number.parseInt(match[1], 10);
			if (Number.isFinite(parsed) && parsed >= 2 && parsed <= 15) {
				count = Math.max(3, Math.min(15, parsed));
				break;
			}
		}
	}
	const cleanedTopic = text.replace(/\b(?:make|create|generate|give|take|start|build|prepare|ask|me|a|an|the|some|new|fresh|quiz|quize|quizzes|kuij|kwiz|mcq|mcqs|mock\s*test|multiple\s*choice|questions?|question|prosno|proshno|banao|banaw|baniye|banie|dao|daw|toiri|koro|kor|niye|nie|opor|upor|er|on|about|for|of|with|4\s*options?)\b/gi, " ").replace(/(?:কুইজ|কুইয|এমসিকিউ|বহুনির্বাচনী|মক\s*টেস্ট|প্রশ্ন|প্রশ্নোত্তর|তৈরি\s*করো|তৈরি\s*করে\s*দাও|তৈরি\s*করুন|বানাও|বানিয়ে\s*দাও|বানিয়ে\s*দাও|বানিয়ে|বানিয়ে|দাও|করো|করুন|নিয়ে|নিয়ে|উপর|ওপর|এর|নতুন|একটি|একটা|চারটি\s*অপশন|অপশনসহ)/g, " ").replace(/[০-৯0-9]+\s*(?:টি|টা|খানা)?/g, " ").replace(/[.,?!।:;'"()[\]{}/\\-]+/g, " ").replace(/\s+/g, " ").trim();
	return {
		isQuiz: true,
		count,
		topic: cleanedTopic
	};
}
function formatQuizAsMarkdown(quiz) {
	const labels = quiz.language === "en" ? [
		"A",
		"B",
		"C",
		"D"
	] : [
		"ক",
		"খ",
		"গ",
		"ঘ"
	];
	const lines = [
		`# ${quiz.title}`,
		`বিষয়: **${quiz.topic}** · ${quiz.className} · মোট প্রশ্ন: ${quiz.questions.length}টি`,
		""
	];
	quiz.questions.forEach((q, idx) => {
		lines.push(`### ${idx + 1}. ${q.question}`);
		q.options.forEach((opt, optIdx) => {
			lines.push(`- **(${labels[optIdx]})** ${opt}`);
		});
		lines.push("");
	});
	lines.push("---");
	lines.push(quiz.language === "en" ? "## Answer Key & Explanations" : "## উত্তরমালা ও ব্যাখ্যা");
	lines.push("");
	quiz.questions.forEach((q, idx) => {
		const correctLetter = labels[q.correctIndex] ?? labels[0];
		const correctText = q.options[q.correctIndex] ?? "";
		lines.push(`${idx + 1}. **(${correctLetter}) ${correctText}** — ${q.explanation}`);
	});
	return lines.join("\n");
}
var OFFLINE_QUIZ_BANKS = [
	{
		id: "photosynthesis",
		title: "সালোকসংশ্লেষ (Photosynthesis) কুইজ",
		topic: "সালোকসংশ্লেষ",
		language: "bn",
		keywords: [
			"সালোকসংশ্লেষ",
			"photosynthesis",
			"উদ্ভিদ",
			"ক্লোরোফিল",
			"পাতা",
			"saloksongshlesh",
			"botany"
		],
		questions: [
			{
				question: "সালোকসংশ্লেষ প্রক্রিয়ার প্রধান স্থান কোনটি?",
				options: [
					"উদ্ভিদের মূল",
					"সবুজ পাতার মেসোফিল কলা",
					"উদ্ভিদের কাণ্ডের বাকল",
					"ফুলের পাপড়ি"
				],
				correctIndex: 1,
				explanation: "সবুজ পাতার মেসোফিল কলার ক্লোরোপ্লাস্টেই ক্লোরোফিল থাকে, যেখানে সালোকসংশ্লেষ ঘটে।"
			},
			{
				question: "সালোকসংশ্লেষে উপজাত হিসেবে কোন গ্যাস নির্গত হয়?",
				options: [
					"কার্বন ডাই-অক্সাইড",
					"নাইট্রোজেন",
					"অক্সিজেন",
					"মিথেন"
				],
				correctIndex: 2,
				explanation: "জলের আলোক-বিশ্লেষণের (Photolysis) ফলে সালোকসংশ্লেষে অক্সিজেন (O₂) গ্যাস নির্গত হয়।"
			},
			{
				question: "সালোকসংশ্লেষের আলোক দশা (Light Phase) ক্লোরোপ্লাস্টের কোথায় ঘটে?",
				options: [
					"স্ট্রোমাতে",
					"গ্রানাতে",
					"মাইটোকন্ড্রিয়াতে",
					"নিউক্লিয়াসে"
				],
				correctIndex: 1,
				explanation: "ক্লোরোপ্লাস্টের গ্রানা অঞ্চলের থাইলাকয়েড পর্দায় আলোক-নির্ভর দশা সম্পন্ন হয়।"
			},
			{
				question: "সালোকসংশ্লেষের জন্য প্রয়োজনীয় প্রধান কাঁচামাল কোন দুটি?",
				options: [
					"অক্সিজেন ও গ্লুকোজ",
					"কার্বন ডাই-অক্সাইড ও জল",
					"নাইট্রোজেন ও খনিজ লবণ",
					"হাইড্রোজেন ও শ্বেতসার"
				],
				correctIndex: 1,
				explanation: "উদ্ভিদ বায়ু থেকে CO₂ এবং মাটি থেকে H₂O শোষণ করে সূর্যালোকের উপস্থিতিতে গ্লুকোজ তৈরি করে।"
			},
			{
				question: "কোন রঞ্জক পদার্থ সূর্যালোক শোষণে প্রধান ভূমিকা পালন করে?",
				options: [
					"হিমোগ্লোবিন",
					"মেলানিন",
					"ক্লোরোফিল",
					"বিলিরুবিন"
				],
				correctIndex: 2,
				explanation: "সবুজ রঞ্জক ক্লোরোফিল সূর্যের ফোটন কণা শোষণ করে রাসায়নিক শক্তিতে রূপান্তর করে।"
			},
			{
				question: "সালোকসংশ্লেষের অন্ধকার দশা (Calvin Cycle) কোথায় ঘটে?",
				options: [
					"ক্লোরোপ্লাস্টের স্ট্রোমাতে",
					"ক্লোরোপ্লাস্টের গ্রানাতে",
					"রাইবোজোমে",
					"গলগি বডিতে"
				],
				correctIndex: 0,
				explanation: "অন্ধকার দশায় CO₂ বিজারিত হয়ে গ্লুকোজ তৈরি হয় এবং এটি স্ট্রোমাতে সম্পন্ন হয়।"
			}
		]
	},
	{
		id: "physics",
		title: "ভৌতবিজ্ঞান ও নিউটনের গতিসূত্র কুইজ",
		topic: "ভৌতবিজ্ঞান ও গতিসূত্র",
		language: "bn",
		keywords: [
			"নিউটন",
			"গতি",
			"বল",
			"ভৌতবিজ্ঞান",
			"বিজ্ঞান",
			"আলো",
			"তাপ",
			"বিদ্যুৎ",
			"physics",
			"newton",
			"science",
			"force",
			"light",
			"bigyan"
		],
		questions: [
			{
				question: "নিউটনের কোন গতিসূত্র থেকে বলের পরিমাপ (F = ma) পাওয়া যায়?",
				options: [
					"প্রথম গতিসূত্র",
					"দ্বিতীয় গতিসূত্র",
					"তৃতীয় গতিসূত্র",
					"মহাকর্ষ সূত্র"
				],
				correctIndex: 1,
				explanation: "নিউটনের দ্বিতীয় গতিসূত্র অনুযায়ী ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক, যা থেকে F = ma আসে।"
			},
			{
				question: "SI পদ্ধতিতে বলের একক কী?",
				options: [
					"জুল (Joule)",
					"ওয়াট (Watt)",
					"নিউটন (Newton)",
					"পাস্কাল (Pascal)"
				],
				correctIndex: 2,
				explanation: "SI পদ্ধতিতে বলের পরম একক নিউটন (N) এবং CGS পদ্ধতিতে ডাইন (dyne)।"
			},
			{
				question: "রকেট উড্ডয়ন নিউটনের কোন সূত্রের ওপর ভিত্তি করে কাজ করে?",
				options: [
					"প্রথম সূত্র",
					"দ্বিতীয় সূত্র",
					"তৃতীয় সূত্র",
					"আর্কিমিডিসের সূত্র"
				],
				correctIndex: 2,
				explanation: "প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে—এই তৃতীয় সূত্র মেনেই রকেট ওপরে ওঠে।"
			},
			{
				question: "শূন্য মাধ্যমে আলোর বেগ কত?",
				options: [
					"৩ × ১০⁵ কিমি/সেকেন্ড",
					"৩ × ১০⁸ কিমি/সেকেন্ড",
					"৩০০ মিটার/সেকেন্ড",
					"১৫ × ১০⁴ কিমি/সেকেন্ড"
				],
				correctIndex: 0,
				explanation: "শূন্য মাধ্যমে আলোর বেগ প্রায় ৩ × ১০⁸ মিটার/সেকেন্ড বা ৩ × ১০⁵ কিলোমিটার/সেকেন্ড।"
			},
			{
				question: "বস্তুর জাড্য ধর্ম (Inertia) নিউটনের কোন সূত্র থেকে জানা যায়?",
				options: [
					"তৃতীয় সূত্র",
					"দ্বিতীয় সূত্র",
					"প্রথম সূত্র",
					"ওহমের সূত্র"
				],
				correctIndex: 2,
				explanation: "প্রথম গতিসূত্রকে জাড্যের সূত্রও বলা হয়, কারণ বাইরে থেকে বল প্রয়োগ না করলে বস্তু তার স্থিতি বা গতি বজায় রাখে।"
			},
			{
				question: "রোধের (Resistance) SI একক কী?",
				options: [
					"অ্যাম্পিয়ার",
					"ভোল্ট",
					"ওহম (Ω)",
					"কুলম্ব"
				],
				correctIndex: 2,
				explanation: "তড়িৎ প্রবাহে বাধার পরিমাপ হলো রোধ, যার SI একক ওহম (Ohm, Ω)।"
			}
		]
	},
	{
		id: "chemistry",
		title: "রসায়ন (Chemistry) কুইজ",
		topic: "রসায়ন",
		language: "bn",
		keywords: [
			"রসায়ন",
			"রসায়ন",
			"পরমাণু",
			"অ্যাসিড",
			"ক্ষার",
			"অণু",
			"chemistry",
			"atom",
			"acid",
			"base",
			"element"
		],
		questions: [
			{
				question: "পরমাণুর নিউক্লিয়াসে কোন দুটি কণা থাকে?",
				options: [
					"ইলেকট্রন ও প্রোটন",
					"প্রোটন ও নিউট্রন",
					"ইলেকট্রন ও নিউট্রন",
					"শুধু ইলেকট্রন"
				],
				correctIndex: 1,
				explanation: "পরমাণুর কেন্দ্রে নিউক্লিয়াসে ধনাত্মক প্রোটন এবং নিস্তড়িৎ নিউট্রন থাকে।"
			},
			{
				question: "বিশুদ্ধ জলের pH মান কত?",
				options: [
					"০",
					"৫",
					"৭",
					"১৪"
				],
				correctIndex: 2,
				explanation: "বিশুদ্ধ জল প্রশম (Neutral), তাই ২৫°C উষ্ণতায় এর pH মান ৭।"
			},
			{
				question: "অ্যাসিড নীল লিটমাস কাগজের রং পরিবর্তন করে কী করে?",
				options: [
					"সবুজ",
					"হলুদ",
					"লাল",
					"সাদা"
				],
				correctIndex: 2,
				explanation: "অ্যাসিড নীল লিটমাসকে লাল করে এবং ক্ষার লাল লিটমাসকে নীল করে।"
			},
			{
				question: "খাবার নুনের রাসায়নিক সংকেত কোনটি?",
				options: [
					"H₂O",
					"NaCl",
					"CO₂",
					"HCl"
				],
				correctIndex: 1,
				explanation: "সাধারণ খাবার নুনের রাসায়নিক নাম সোডিয়াম ক্লোরাইড (NaCl)।"
			},
			{
				question: "ইলেকট্রন আবিষ্কার করেন কোন বিজ্ঞানী?",
				options: [
					"জে. জে. থমসন",
					"রাদারফোর্ড",
					"চ্যাডউইক",
					"ডাল্টন"
				],
				correctIndex: 0,
				explanation: "১৮৯৭ সালে বিজ্ঞানী জে. জে. থমসন ক্যাথোড রশ্মি পরীক্ষার মাধ্যমে ইলেকট্রন আবিষ্কার করেন।"
			}
		]
	},
	{
		id: "biology",
		title: "জীবনবিজ্ঞান (Life Science) কুইজ",
		topic: "জীবনবিজ্ঞান",
		language: "bn",
		keywords: [
			"জীবনবিজ্ঞান",
			"জীববিজ্ঞান",
			"কোষ",
			"হৃদপিণ্ড",
			"রক্ত",
			"মানবদেহ",
			"পরিবেশ",
			"biology",
			"cell",
			"human",
			"blood",
			"life science"
		],
		questions: [
			{
				question: "কোষের ‘শক্তিঘর’ (Powerhouse of the cell) কাকে বলা হয়?",
				options: [
					"রাইবোজোম",
					"মাইটোকন্ড্রিয়া",
					"লাইসোজোম",
					"গলগি বডি"
				],
				correctIndex: 1,
				explanation: "মাইটোকন্ড্রিয়ায় কোষীয় শ্বসনের মাধ্যমে ATP শক্তি উৎপন্ন হয়, তাই একে কোষের শক্তিঘর বলে।"
			},
			{
				question: "মানবদেহে অক্সিজেন পরিবহন করে রক্তের কোন উপাদান?",
				options: [
					"শ্বেত রক্তকণিকা",
					"অণুচক্রিকা",
					"লোহিত রক্তকণিকার হিমোগ্লোবিন",
					"প্লাজমা প্রোটিন"
				],
				correctIndex: 2,
				explanation: "লোহিত রক্তকণিকায় থাকা হিমোগ্লোবিন অক্সিহিমোগ্লোবিন রূপে সারা দেহে অক্সিজেন পরিবহন করে।"
			},
			{
				question: "কোন ভিটামিনের অভাবে রাতকানা রোগ হয়?",
				options: [
					"ভিটামিন A",
					"ভিটামিন B",
					"ভিটামিন C",
					"ভিটামিন D"
				],
				correctIndex: 0,
				explanation: "ভিটামিন A (রেটিনল)-এর অভাবে চোখের রড কোষ ঠিকমতো কাজ করে না, ফলে রাতকানা রোগ হয়।"
			},
			{
				question: "মানুষের হৃৎপিণ্ডে কয়টি প্রকোষ্ঠ (Chamber) থাকে?",
				options: [
					"২টি",
					"৩টি",
					"৪টি",
					"৫টি"
				],
				correctIndex: 2,
				explanation: "মানুষের হৃৎপিণ্ড ৪টি প্রকোষ্ঠে বিভক্ত—ডান অলিন্দ, বাম অলিন্দ, ডান নিলয় এবং বাম নিলয়।"
			},
			{
				question: "কোষ আবিষ্কার করেন কোন বিজ্ঞানী?",
				options: [
					"রবার্ট হুক",
					"চার্লস ডারউইন",
					"লুই পাস্তুর",
					"গ্রেগর মেন্ডেল"
				],
				correctIndex: 0,
				explanation: "১৬৬৫ সালে রবার্ট হুক কর্কের পাতলা ছিদ্র পরীক্ষা করে প্রথম কোষ (Cell) আবিষ্কার করেন।"
			}
		]
	},
	{
		id: "history",
		title: "ইতিহাস (History) কুইজ",
		topic: "ইতিহাস",
		language: "bn",
		keywords: [
			"ইতিহাস",
			"history",
			"itihas",
			"স্বাধীনতা",
			"পলাশী",
			"সিপাহী",
			"গান্ধী",
			"সুভাষ",
			"নেতাজি",
			"মুঘল",
			"বঙ্গভঙ্গ"
		],
		questions: [
			{
				question: "পলাশীর যুদ্ধ কত সালে সংঘটিত হয়?",
				options: [
					"১৭৫৭ সালে",
					"১৭৬৪ সালে",
					"১৮৫৭ সালে",
					"১৯০৫ সালে"
				],
				correctIndex: 0,
				explanation: "১৭৫৭ সালের ২৩ জুন নবাব সিরাজউদ্দৌলা ও ব্রিটিশ ইস্ট ইন্ডিয়া কোম্পানির মধ্যে পলাশীর যুদ্ধ হয়।"
			},
			{
				question: "সিপাহী বিদ্রোহ (মহাবিদ্রোহ) প্রথম কোথায় শুরু হয়?",
				options: [
					"কলকাতা",
					"ব্যারাকপুর ও মিরাট",
					"মাদ্রাজ",
					"বোম্বাই"
				],
				correctIndex: 1,
				explanation: "১৮৫৭ সালে ব্যারাকপুরে মঙ্গল পাণ্ডের বিদ্রোহ এবং ১০ মে মিরাটে ব্যাপকভাবে সিপাহী বিদ্রোহ শুরু হয়।"
			},
			{
				question: "বঙ্গভঙ্গ কোন বছর কার্যকর হয়?",
				options: [
					"১৯০৫ সালে",
					"১৯১১ সালে",
					"১৯১৯ সালে",
					"১৯৪২ সালে"
				],
				correctIndex: 0,
				explanation: "লর্ড কার্জনের নির্দেশে ১৯০৫ সালের ১৬ অক্টোবর বঙ্গভঙ্গ কার্যকর হয়।"
			},
			{
				question: "‘আজাদ হিন্দ ফৌজ’-এর সর্বাধিনায়ক কে ছিলেন?",
				options: [
					"ভগৎ সিং",
					"নেতাজি সুভাষচন্দ্র বসু",
					"ক্ষুদিরাম বসু",
					"বাল গঙ্গাধর তিলক"
				],
				correctIndex: 1,
				explanation: "নেতাজি সুভাষচন্দ্র বসু ১৯৪৩ সালে সিঙ্গাপুরে আজাদ হিন্দ ফৌজের দায়িত্ব গ্রহণ করেন।"
			},
			{
				question: "ভারত ছাড়ো আন্দোলন কোন সালে শুরু হয়?",
				options: [
					"১৯২০ সালে",
					"১৯৩০ সালে",
					"১৯৪২ সালে",
					"১৯৪৭ সালে"
				],
				correctIndex: 2,
				explanation: "১৯৪২ সালের ৮ আগস্ট মহাত্মা গান্ধীর নেতৃত্বে ভারত ছাড়ো আন্দোলন শুরু হয়।"
			}
		]
	},
	{
		id: "geography",
		title: "ভূগোল (Geography) কুইজ",
		topic: "ভূগোল",
		language: "bn",
		keywords: [
			"ভূগোল",
			"ভুগোল",
			"geography",
			"vugol",
			"bhugol",
			"পশ্চিমবঙ্গ",
			"নদী",
			"পর্বত",
			"পৃথিবী",
			"বায়ুমণ্ডল",
			"ভারত",
			"সুন্দরবন"
		],
		questions: [
			{
				question: "পশ্চিমবঙ্গের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?",
				options: [
					"টাইগার হিল",
					"সান্দাকফু",
					"ফালুট",
					"অযোধ্যা পাহাড়"
				],
				correctIndex: 1,
				explanation: "দার্জিলিং জেলার সিঙ্গালিলা পর্বতশ্রেণির সান্দাকফু (৩,৬৩৬ মিটার) পশ্চিমবঙ্গের সর্বোচ্চ শৃঙ্গ।"
			},
			{
				question: "পৃথিবীর বৃহত্তম ব-দ্বীপ (Delta) কোনটি?",
				options: [
					"নীল নদের ব-দ্বীপ",
					"গঙ্গা-ব্রহ্মপুত্র (সুন্দরবন) ব-দ্বীপ",
					"মিসিসিপি ব-দ্বীপ",
					"আমাজন ব-দ্বীপ"
				],
				correctIndex: 1,
				explanation: "পশ্চিমবঙ্গ ও বাংলাদেশ জুড়ে বিস্তৃত গঙ্গা-ব্রহ্মপুত্র ব-দ্বীপ পৃথিবীর বৃহত্তম ব-দ্বীপ।"
			},
			{
				question: "বায়ুমণ্ডলের কোন স্তরে ওজোন স্তর অবস্থিত?",
				options: [
					"ট্রপোস্ফিয়ার",
					"স্ট্র্যাটোস্ফিয়ার",
					"মেসোস্ফিয়ার",
					"থার্মোস্ফিয়ার"
				],
				correctIndex: 1,
				explanation: "স্ট্র্যাটোস্ফিয়ারে থাকা ওজোন স্তর সূর্যের ক্ষতিকর অতিবেগুনি রশ্মি শোষণ করে পৃথিবীকে রক্ষা করে।"
			},
			{
				question: "ভারতের দীর্ঘতম নদী কোনটি?",
				options: [
					"গঙ্গা",
					"গোদাবরী",
					"নর্মদা",
					"কাবেরী"
				],
				correctIndex: 0,
				explanation: "গঙ্গা (প্রায় ২,৫২৫ কিমি) ভারতের দীর্ঘতম ও প্রধান নদী।"
			},
			{
				question: "পশ্চিমবঙ্গের ‘দুঃখ’ বলা হয় কোন নদীকে?",
				options: [
					"তিস্তা",
					"দামোদর",
					"হুগলি",
					"অজয়"
				],
				correctIndex: 1,
				explanation: "অতীতে প্রতি বছর ভয়াবহ বন্যার কারণে দামোদর নদকে ‘বাংলার দুঃখ’ বলা হতো।"
			}
		]
	},
	{
		id: "bengali",
		title: "বাংলা ব্যাকরণ ও সাহিত্য কুইজ",
		topic: "বাংলা ব্যাকরণ ও সাহিত্য",
		language: "bn",
		keywords: [
			"বাংলা",
			"ব্যাকরণ",
			"সন্ধি",
			"সমাস",
			"কারক",
			"রবীন্দ্রনাথ",
			"সাহিত্য",
			"কবিতা",
			"bengali",
			"bangla",
			"sandhi",
			"somash",
			"grammar"
		],
		questions: [
			{
				question: "‘বিদ্যালয়’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?",
				options: [
					"বিদ্যা + লয়",
					"বিদ্যা + আলয়",
					"বিদ্ + আলয়",
					"বিদ্য + আলয়"
				],
				correctIndex: 1,
				explanation: "আ + আ = আ স্বরসন্ধির নিয়মে বিদ্যা + আলয় = বিদ্যালয় হয়।"
			},
			{
				question: "‘সূর্যোদয়’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?",
				options: [
					"সূর্য + উদয়",
					"সূর্য + ওদয়",
					"সূর্যো + দয়",
					"সূর + উদয়"
				],
				correctIndex: 0,
				explanation: "অ + উ = ও নিয়মে সূর্য + উদয় = সূর্যোদয় গঠিত হয়।"
			},
			{
				question: "রবীন্দ্রনাথ ঠাকুর কোন কাব্যগ্রন্থের জন্য নোবেল পুরস্কার পান?",
				options: [
					"সোনার তরী",
					"বলাকা",
					"গীতাঞ্জলি",
					"চিত্রা"
				],
				correctIndex: 2,
				explanation: "১৯১৩ সালে ইংরেজি অনুবাদ Song Offerings (গীতাঞ্জলি)-এর জন্য রবীন্দ্রনাথ ঠাকুর সাহিত্যে নোবেল পান।"
			},
			{
				question: "বাংলা ব্যাকরণে কারক মোট কয় প্রকার?",
				options: [
					"৪ প্রকার",
					"৫ প্রকার",
					"৬ প্রকার",
					"৮ প্রকার"
				],
				correctIndex: 2,
				explanation: "বাংলা ব্যাকরণে কারক ৬ প্রকার: কর্তৃ, কর্ম, করণ, নিমিত্ত/সম্প্রদান, অপাদান এবং অধিকরণ কারক।"
			},
			{
				question: "‘নীরদ’ শব্দের অর্থ কী?",
				options: [
					"আকাশ",
					"মেঘ",
					"সাগর",
					"বাতাস"
				],
				correctIndex: 1,
				explanation: "নীর (জল) দান করে যে = নীরদ, যার অর্থ মেঘ।"
			}
		]
	},
	{
		id: "english",
		title: "English Grammar Quiz",
		topic: "English Grammar",
		language: "en",
		keywords: [
			"english",
			"tense",
			"voice",
			"narration",
			"article",
			"preposition",
			"ইংরেজি",
			"ইংলিশ"
		],
		questions: [
			{
				question: "Choose the correct article: \"He is ___ honest boy.\"",
				options: [
					"a",
					"an",
					"the",
					"no article"
				],
				correctIndex: 1,
				explanation: "The \"h\" in \"honest\" is silent, so it starts with a vowel sound and takes \"an\"."
			},
			{
				question: "Identify the tense: \"She has been reading since morning.\"",
				options: [
					"Present Continuous",
					"Present Perfect",
					"Present Perfect Continuous",
					"Past Continuous"
				],
				correctIndex: 2,
				explanation: "\"has been + verb-ing\" with \"since morning\" shows Present Perfect Continuous Tense."
			},
			{
				question: "Change to Passive Voice: \"The boy writes a letter.\"",
				options: [
					"A letter is written by the boy.",
					"A letter was written by the boy.",
					"A letter is writing by the boy.",
					"The boy is written a letter."
				],
				correctIndex: 0,
				explanation: "Simple Present active (\"writes\") changes to \"is/am/are + past participle (written)\"."
			},
			{
				question: "Fill in the blank: \"The cat jumped ___ the table.\"",
				options: [
					"in",
					"onto",
					"between",
					"among"
				],
				correctIndex: 1,
				explanation: "\"onto\" indicates movement to a position on top of a surface."
			},
			{
				question: "Which word is an Abstract Noun?",
				options: [
					"River",
					"Gold",
					"Kindness",
					"Teacher"
				],
				correctIndex: 2,
				explanation: "\"Kindness\" names a quality/feeling that cannot be touched, making it an abstract noun."
			}
		]
	}
];
function generateMathOfflineQuiz(className, count) {
	const safeCount = Math.max(3, Math.min(10, count));
	const questions = [];
	const templates = [
		() => {
			const a = 12 + Math.floor(Math.random() * 18);
			const b = 6 + Math.floor(Math.random() * 14);
			const ans = a * b;
			const opts = [
				ans,
				ans + a,
				ans - b,
				ans + 10
			];
			return buildShuffledMathQ(`${a} × ${b} = কত?`, ans, opts, `${a} কে ${b} দিয়ে গুণ করলে ${ans} হয়।`);
		},
		() => {
			const n = 7 + Math.floor(Math.random() * 13);
			const ans = n * n;
			const opts = [
				ans,
				ans + n,
				ans - 2,
				(n + 1) * (n + 1)
			];
			return buildShuffledMathQ(`${n}-এর বর্গ (${n}²) কত?`, ans, opts, `${n} × ${n} = ${ans}।`);
		},
		() => {
			const p = [
				10,
				20,
				25,
				50
			][Math.floor(Math.random() * 4)];
			const base = (2 + Math.floor(Math.random() * 8)) * 40;
			const ans = base * p / 100;
			const opts = [
				ans,
				ans + 10,
				ans + 20,
				Math.max(2, ans - 10)
			];
			return buildShuffledMathQ(`${base}-এর ${p}% কত?`, ans, opts, `${base} × (${p}/100) = ${ans}।`);
		},
		() => {
			const x = 3 + Math.floor(Math.random() * 11);
			const c = 4 + Math.floor(Math.random() * 9);
			const rhs = 2 * x + c;
			const opts = [
				x,
				x + 2,
				x - 1,
				x + 4
			];
			return buildShuffledMathQ(`যদি 2x + ${c} = ${rhs} হয়, তবে x-এর মান কত?`, x, opts, `2x = ${rhs} - ${c} = ${rhs - c}, তাই x = ${rhs - c} ÷ 2 = ${x}।`);
		},
		() => {
			const side = 5 + Math.floor(Math.random() * 11);
			const ans = side * 4;
			const opts = [
				ans,
				side * side,
				side * 2,
				ans + 4
			];
			return buildShuffledMathQ(`একটি বর্গক্ষেত্রের প্রতিটি বাহুর দৈর্ঘ্য ${side} সেমি হলে তার পরিসীমা কত?`, ans, opts, `বর্গক্ষেত্রের পরিসীমা = 4 × বাহু = 4 × ${side} = ${ans} সেমি।`);
		},
		() => {
			const a = 30 + Math.floor(Math.random() * 50);
			const b = 40 + Math.floor(Math.random() * 50);
			const ans = 180 - (a + b);
			const opts = [
				ans,
				ans + 10,
				Math.abs(ans - 15),
				90
			];
			return buildShuffledMathQ(`একটি ত্রিভুজের দুটি কোণ ${a}° ও ${b}° হলে তৃতীয় কোণটি কত?`, ans, opts, `ত্রিভুজের তিন কোণের সমষ্টি ১৮০°। তাই তৃতীয় কোণ = ১৮০° - (${a}° + ${b}°) = ${ans}°।`);
		}
	];
	for (let i = 0; i < safeCount; i++) {
		const gen = templates[i % templates.length];
		questions.push({
			id: `off-math-${Date.now()}-${i}`,
			...gen()
		});
	}
	return {
		title: "গণিত (Mathematics) কুইজ",
		topic: "গণিত",
		className,
		language: "bn",
		questions,
		source: "offline"
	};
}
function buildShuffledMathQ(question, correctVal, rawOptions, explanation) {
	const unique = /* @__PURE__ */ new Set([correctVal]);
	for (const val of rawOptions) {
		if (unique.size >= 4) break;
		if (Number.isFinite(val)) unique.add(val);
	}
	let bump = 3;
	while (unique.size < 4) {
		unique.add(correctVal + bump);
		bump += 3;
	}
	const arr = Array.from(unique).slice(0, 4);
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	const correctIndex = Math.max(0, arr.indexOf(correctVal));
	return {
		question,
		options: [
			String(arr[0]),
			String(arr[1]),
			String(arr[2]),
			String(arr[3])
		],
		correctIndex,
		explanation
	};
}
function generateOfflineQuiz(topicPrompt, className, requestedCount = 5) {
	const lower = topicPrompt.toLowerCase();
	const safeCount = Math.max(3, Math.min(10, requestedCount));
	if (/গণিত|অঙ্ক|অংক|math|algebra|geometry|বীজগণিত|জ্যামিতি|পাটিগণিত/i.test(lower)) return generateMathOfflineQuiz(className, safeCount);
	let bestPack = null;
	let bestScore = 0;
	for (const pack of OFFLINE_QUIZ_BANKS) {
		let score = 0;
		for (const kw of pack.keywords) if (lower.includes(kw.toLowerCase())) score += kw.length;
		if (score > bestScore) {
			bestScore = score;
			bestPack = pack;
		}
	}
	if (bestPack) {
		const picked = bestPack.questions.slice(0, safeCount).map((q, idx) => ({
			id: `off-${bestPack.id}-${Date.now()}-${idx}`,
			...q
		}));
		return {
			title: bestPack.title,
			topic: bestPack.topic,
			className,
			language: bestPack.language,
			questions: picked,
			source: "offline"
		};
	}
	const mixedPool = [
		OFFLINE_QUIZ_BANKS[0].questions[0],
		OFFLINE_QUIZ_BANKS[1].questions[0],
		OFFLINE_QUIZ_BANKS[4].questions[0],
		OFFLINE_QUIZ_BANKS[5].questions[0],
		OFFLINE_QUIZ_BANKS[6].questions[0],
		OFFLINE_QUIZ_BANKS[3].questions[0],
		OFFLINE_QUIZ_BANKS[2].questions[1]
	];
	const displayTopic = topicPrompt.trim() || "WBBSE সাধারণ কুইজ";
	return {
		title: `${displayTopic} — অফলাইন WBBSE কুইজ`,
		topic: displayTopic,
		className,
		language: "bn",
		questions: mixedPool.slice(0, safeCount).map((q, idx) => ({
			id: `off-mix-${Date.now()}-${idx}`,
			...q
		})),
		source: "offline"
	};
}
// src/hooks/useVoicePlayer.ts
function cleanForSpeech(rawText) {
	return rawText.replace(/\*\*/g, "").replace(/[#`>_~]/g, "").replace(/\n{2,}/g, ". ").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}
function useVoicePlayer(defaultVoice = "Kore") {
	const [voice, setVoice] = (0, import_react.useState)(defaultVoice);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const audioRef = (0, import_react.useRef)(null);
	const objectUrlRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const stop = (0, import_react.useCallback)(() => {
		if (abortRef.current) {
			abortRef.current.abort();
			abortRef.current = null;
		}
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = "";
			audioRef.current = null;
		}
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
		if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
		setActiveId(null);
		setIsLoading(false);
		setIsPlaying(false);
	}, []);
	const fallbackBrowserSpeak = (0, import_react.useCallback)((text, id) => {
		if (typeof window === "undefined" || !("speechSynthesis" in window)) {
			setActiveId(null);
			setIsLoading(false);
			setIsPlaying(false);
			return;
		}
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		const isAscii = /^[\x00-\x7F]+$/.test(text);
		utterance.lang = isAscii ? "en-IN" : "bn-IN";
		const voices = window.speechSynthesis.getVoices?.() ?? [];
		const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(isAscii ? "en-in" : "bn")) || voices.find((v) => v.lang.toLowerCase().startsWith(isAscii ? "en" : "hi"));
		if (matchedVoice) utterance.voice = matchedVoice;
		utterance.rate = .96;
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
	const speak = (0, import_react.useCallback)(async (text, id, overrideVoice) => {
		const cleaned = cleanForSpeech(text);
		if (!cleaned) return;
		if (activeId === id && (isPlaying || isLoading)) {
			stop();
			return;
		}
		stop();
		if (typeof navigator !== "undefined" && !navigator.onLine) {
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
		}, 1e4);
		try {
			const res = await fetch("/api/tts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: cleaned,
					voiceName: overrideVoice ?? voice
				}),
				signal: controller.signal
			});
			window.clearTimeout(timeoutId);
			if (!res.ok) throw new Error("TTS request failed");
			const data = await res.json();
			if (!data.audioBase64) throw new Error("No audio returned");
			if (controller.signal.aborted) return;
			const binaryStr = atob(data.audioBase64);
			const bytes = new Uint8Array(binaryStr.length);
			for (let i = 0; i < binaryStr.length; i += 1) bytes[i] = binaryStr.charCodeAt(i);
			const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });
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
			if (err?.name === "AbortError" && !timedOut) return;
			setIsLoading(false);
			fallbackBrowserSpeak(cleaned, id);
		}
	}, [
		activeId,
		isPlaying,
		isLoading,
		voice,
		stop,
		fallbackBrowserSpeak
	]);
	(0, import_react.useEffect)(() => {
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
		stop
	};
}
// src/utils/pdfGenerator.ts
function escapeHtml(input) {
	return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function formatInlineHtml(text) {
	return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong style=\"font-weight:600;color:#0f172a;\">$1</strong>").replace(/`([^`]+)`/g, "<code style=\"background:#f1f5f9;padding:2px 5px;border-radius:4px;font-family:monospace;font-size:0.9em;color:#1e293b;\">$1</code>");
}
function markdownToBlocks(markdown) {
	const blocks = [];
	const lines = markdown.split(/\r?\n/);
	let listEl = null;
	let listOrdered = false;
	const flushList = () => {
		if (listEl) {
			blocks.push(listEl);
			listEl = null;
		}
	};
	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line) {
			flushList();
			continue;
		}
		if (line.startsWith("### ")) {
			flushList();
			const h4 = document.createElement("h4");
			h4.style.cssText = "font-size:15px;font-weight:600;color:#0f172a;margin:14px 0 6px;padding-bottom:4px;border-bottom:1px solid #e2e8f0;";
			h4.innerHTML = formatInlineHtml(line.slice(4));
			blocks.push(h4);
			continue;
		}
		if (line.startsWith("## ") || line.startsWith("# ")) {
			flushList();
			const content = line.startsWith("## ") ? line.slice(3) : line.slice(2);
			const h3 = document.createElement("h3");
			h3.style.cssText = "font-size:17px;font-weight:700;color:#0f172a;margin:18px 0 8px;padding-bottom:5px;border-bottom:1px solid #e2e8f0;";
			h3.innerHTML = formatInlineHtml(content);
			blocks.push(h3);
			continue;
		}
		const unorderedMatch = line.match(/^[-*•]\s+(.*)$/);
		if (unorderedMatch) {
			if (!listEl || listOrdered) {
				flushList();
				listEl = document.createElement("ul");
				listEl.style.cssText = "margin:6px 0 10px;padding-left:22px;list-style-type:disc;font-size:14px;line-height:1.75;color:#1e293b;";
				listOrdered = false;
			}
			const li = document.createElement("li");
			li.style.cssText = "margin-bottom:5px;";
			li.innerHTML = formatInlineHtml(unorderedMatch[1]);
			listEl.appendChild(li);
			continue;
		}
		const orderedMatch = line.match(/^(?:\d+|[০-৯]+)[.)]\s+(.*)$/);
		if (orderedMatch) {
			if (!listEl || !listOrdered) {
				flushList();
				listEl = document.createElement("ol");
				listEl.style.cssText = "margin:6px 0 10px;padding-left:22px;list-style-type:decimal;font-size:14px;line-height:1.75;color:#1e293b;";
				listOrdered = true;
			}
			const li = document.createElement("li");
			li.style.cssText = "margin-bottom:5px;";
			li.innerHTML = formatInlineHtml(orderedMatch[1]);
			listEl.appendChild(li);
			continue;
		}
		flushList();
		const p = document.createElement("p");
		p.style.cssText = "margin:0 0 10px;font-size:14px;line-height:1.75;color:#1e293b;";
		p.innerHTML = formatInlineHtml(line);
		blocks.push(p);
	}
	flushList();
	return blocks;
}
function extractPdfTitle(markdown, fallback = "Wbsec Study Notes") {
	const lines = markdown.split(/\r?\n/);
	for (const raw of lines) {
		const trimmed = raw.trim();
		if (trimmed.startsWith("# ")) return trimmed.slice(2).replace(/\*\*/g, "").trim();
		if (trimmed.startsWith("## ")) return trimmed.slice(3).replace(/\*\*/g, "").trim();
	}
	return fallback;
}
function makeSafeFilename(title, fallback = "wbsec-notes") {
	return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || fallback}.pdf`;
}
async function renderElementsToPaginatedPdf(elements, filename) {
	if (document.fonts && document.fonts.ready) await document.fonts.ready;
	const PAGE_WIDTH_PX = 794;
	const PAGE_HEIGHT_PX = 1122;
	const CONTENT_PADDING_X = 52;
	const CONTENT_TOP_PAD = 44;
	const CONTENT_BOTTOM_PAD = 54;
	const MAX_CONTENT_HEIGHT = 1024;
	const measurer = document.createElement("div");
	measurer.style.cssText = `position:fixed;left:-10000px;top:0;width:690px;background:#ffffff;color:#0f172a;font-family:"Noto Sans Bengali","DM Sans",sans-serif;`;
	document.body.appendChild(measurer);
	const pages = [[]];
	let currentHeight = 0;
	for (const el of elements) {
		const clone = el.cloneNode(true);
		measurer.appendChild(clone);
		const computed = window.getComputedStyle(clone);
		const marginTop = parseFloat(computed.marginTop) || 0;
		const marginBottom = parseFloat(computed.marginBottom) || 0;
		const totalElHeight = clone.offsetHeight + marginTop + marginBottom;
		measurer.removeChild(clone);
		const activePage = pages[pages.length - 1];
		if (activePage.length > 0 && currentHeight + totalElHeight > MAX_CONTENT_HEIGHT) {
			pages.push([el]);
			currentHeight = totalElHeight;
		} else {
			activePage.push(el);
			currentHeight += totalElHeight;
		}
	}
	document.body.removeChild(measurer);
	const [{ jsPDF }, { default: html2canvas }] = await Promise.all([__vitePreload(() => import("./jspdf.es.min-B3he6ffy.js").then((n) => n.t), __vite__mapDeps([0,1])), __vitePreload(() => import("./html2canvas-pro.esm-DekFSLnq.js"), [])]);
	const pdf = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4"
	});
	const stage = document.createElement("div");
	stage.style.cssText = `position:fixed;left:-10000px;top:0;width:${PAGE_WIDTH_PX}px;background:#ffffff;font-family:"Noto Sans Bengali","DM Sans",sans-serif;`;
	document.body.appendChild(stage);
	try {
		for (let i = 0; i < pages.length; i += 1) {
			const pageSheet = document.createElement("div");
			pageSheet.style.cssText = `width:${PAGE_WIDTH_PX}px;height:${PAGE_HEIGHT_PX}px;padding:${CONTENT_TOP_PAD}px ${CONTENT_PADDING_X}px ${CONTENT_BOTTOM_PAD}px;background:#ffffff;color:#0f172a;box-sizing:border-box;position:relative;font-family:"Noto Sans Bengali","DM Sans",sans-serif;`;
			for (const block of pages[i]) pageSheet.appendChild(block);
			const footer = document.createElement("div");
			footer.style.cssText = `position:absolute;left:${CONTENT_PADDING_X}px;right:${CONTENT_PADDING_X}px;bottom:22px;padding-top:8px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:11px;color:#64748b;`;
			footer.innerHTML = `<span>Wbsec · Made by Amir</span><span>Page ${i + 1} of ${pages.length}</span>`;
			pageSheet.appendChild(footer);
			stage.innerHTML = "";
			stage.appendChild(pageSheet);
			const imgData = (await html2canvas(pageSheet, {
				scale: 2,
				backgroundColor: "#ffffff",
				useCORS: true,
				logging: false
			})).toDataURL("image/jpeg", .94);
			if (i > 0) pdf.addPage();
			pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
		}
		const nativeBridge = typeof window !== "undefined" ? window.WbsecNative : void 0;
		if (nativeBridge?.saveBase64File) try {
			const dataUri = pdf.output("datauristring");
			const base64 = dataUri.includes(",") ? dataUri.split(",")[1] : dataUri;
			if (nativeBridge.saveBase64File(base64, filename)) return;
		} catch {}
		pdf.save(filename);
	} finally {
		document.body.removeChild(stage);
	}
}
async function generateStudyPdf(options) {
	const filename = options.filename || makeSafeFilename(options.title);
	const header = document.createElement("div");
	header.style.cssText = "margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #0f172a;";
	header.innerHTML = `
    <div style="font-size:11px;font-weight:600;color:#007AFF;margin-bottom:4px;">Wbsec · Made by Amir</div>
    <div style="font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">${escapeHtml(options.title)}</div>
    <div style="font-size:12px;color:#64748b;margin-top:6px;">${escapeHtml(options.subtitle)}</div>
  `;
	await renderElementsToPaginatedPdf([header, ...markdownToBlocks(options.markdown)], filename);
	return filename;
}
async function generateConversationPdf(messages, classNameLevel) {
	const filename = makeSafeFilename(`wbsec-${classNameLevel}-notes`);
	const today = new Intl.DateTimeFormat("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(/* @__PURE__ */ new Date());
	const header = document.createElement("div");
	header.style.cssText = "margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #0f172a;";
	header.innerHTML = `
    <div style="font-size:11px;font-weight:600;color:#007AFF;margin-bottom:4px;">Wbsec · Made by Amir</div>
    <div style="font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">AI Teacher Study Notes</div>
    <div style="font-size:12px;color:#64748b;margin-top:6px;">West Bengal Board (WBBSE) · ${escapeHtml(classNameLevel)} · ${escapeHtml(today)}</div>
  `;
	const blocks = [header];
	for (const msg of messages) {
		if (!msg.text.trim()) continue;
		const roleBanner = document.createElement("div");
		roleBanner.style.cssText = "margin-top:16px;margin-bottom:6px;font-size:12px;font-weight:700;color:" + (msg.role === "user" ? "#334155" : "#007AFF") + ";";
		roleBanner.textContent = msg.role === "user" ? "Student Question" : "Wbsec AI Teacher";
		blocks.push(roleBanner);
		blocks.push(...markdownToBlocks(msg.text));
	}
	await renderElementsToPaginatedPdf(blocks, filename);
	return filename;
}
async function generateDictionaryPdf(entry) {
	const filename = makeSafeFilename(`wbsec-dictionary-${entry.word}`, "wbsec-dictionary");
	const markdown = [
		`## ১. উচ্চারণ`,
		entry.pronunciation,
		`## ২. অর্থ`,
		entry.meaning,
		`## ৩. সন্ধি বিচ্ছেদ`,
		entry.sandhiVicched,
		`## ৪. ব্যাকরণগত পরিচয়`,
		entry.grammar,
		`## ৫. বাক্য রচনা`,
		...entry.exampleSentences.map((s) => `- ${s}`)
	].join("\n\n");
	return generateStudyPdf({
		title: entry.word,
		subtitle: "Bengali Dictionary & Grammar Entry · WBBSE",
		markdown,
		filename
	});
}
// src/components/TeacherWorkspace.tsx
var CameraCaptureModal = (0, import_react.lazy)(() => __vitePreload(() => import("./CameraCaptureModal-BrBUPzTn.js").then((m) => ({ default: m.CameraCaptureModal })), __vite__mapDeps([2,1,3,4])));
var LiveTeacherModal = (0, import_react.lazy)(() => __vitePreload(() => import("./LiveTeacherModal-DcKGboof.js").then((m) => ({ default: m.LiveTeacherModal })), __vite__mapDeps([5,1,3,4])));
var OfflineStudyLibraryModal = (0, import_react.lazy)(() => __vitePreload(() => import("./OfflineStudyLibraryModal-CbXWM_T9.js").then((m) => ({ default: m.OfflineStudyLibraryModal })), __vite__mapDeps([6,1,3,4])));
var CLASS_LEVELS = [
	"Class 5",
	"Class 6",
	"Class 7",
	"Class 8",
	"Class 9",
	"Class 10"
];
var VOICE_OPTIONS = [
	{
		value: "Kore",
		label: "Kore (Warm)"
	},
	{
		value: "Puck",
		label: "Puck (Bright)"
	},
	{
		value: "Zephyr",
		label: "Zephyr (Calm)"
	},
	{
		value: "Charon",
		label: "Charon (Deep)"
	}
];
var SAMPLE_PROMPTS = [
	"সালোকসংশ্লেষ প্রক্রিয়াটি সহজভাবে বুঝিয়ে দাও।",
	"নিউটনের গতির তৃতীয় সূত্র উদাহরণসহ ব্যাখ্যা করো।",
	"সালোকসংশ্লেষের ওপর একটি PDF তৈরি করো।"
];
async function processImageFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read the selected image file."));
		reader.onload = (e) => {
			const rawDataUrl = e.target?.result;
			if (typeof rawDataUrl !== "string") {
				reject(/* @__PURE__ */ new Error("Invalid image data."));
				return;
			}
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Unsupported or corrupted image file."));
			img.onload = () => {
				const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
				const targetW = Math.round(img.width * scale);
				const targetH = Math.round(img.height * scale);
				const canvas = document.createElement("canvas");
				canvas.width = targetW;
				canvas.height = targetH;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					const base64 = rawDataUrl.split(",")[1] || "";
					resolve({
						dataUrl: rawDataUrl,
						base64,
						mimeType: file.type || "image/jpeg",
						name: file.name,
						sizeBytes: file.size
					});
					return;
				}
				ctx.drawImage(img, 0, 0, targetW, targetH);
				const outputMime = "image/jpeg";
				const compressedUrl = canvas.toDataURL(outputMime, .8);
				const base64 = compressedUrl.split(",")[1] || "";
				const sizeBytes = Math.round(base64.length * 3 / 4);
				resolve({
					dataUrl: compressedUrl,
					base64,
					mimeType: outputMime,
					name: file.name,
					sizeBytes
				});
			};
			img.src = rawDataUrl;
		};
		reader.readAsDataURL(file);
	});
}
function TeacherWorkspace({ classNameLevel, onClassChange, messages, draftText, onDraftTextChange, image, onImageChange, isStreaming, error, validationError, onSendMessage, onStopStreaming, onReset, latestCompletedAssistantId, shouldAutoSpeakLatest, onHandledAutoSpeak, isSpeechSupported, isListening, isTranscribing = false, interimTranscript, speechLang, onSpeechLangChange, speechError, onToggleListening, onStopListening, onSaveLiveTranscripts, onAddHighlight, onRemoveHighlight, isOnline = true, offlineAiReady = false, offlineAiTier = null, onOpenOfflineAiPack, openLiveCounter = 0, onOpenOfflineTopic, studentProfile, onOpenProfile, appConfig = DEFAULT_APP_CONFIG }) {
	const fileInputRef = (0, import_react.useRef)(null);
	const messagesEndRef = (0, import_react.useRef)(null);
	const [cameraModalOpen, setCameraModalOpen] = (0, import_react.useState)(false);
	const [liveModalOpen, setLiveModalOpen] = (0, import_react.useState)(false);
	const [liveInitialMode, setLiveInitialMode] = (0, import_react.useState)("voice");
	const [offlineLibraryOpen, setOfflineLibraryOpen] = (0, import_react.useState)(false);
	const isClass8OfflineOnly = !isOnline && offlineAiTier === "class8";
	const effectiveCanCamera = appConfig.enableCamera && !isClass8OfflineOnly;
	const effectiveCanLive = appConfig.enableLiveMode && !isClass8OfflineOnly;
	const effectiveCanQuiz = !isClass8OfflineOnly;
	const openLiveMode = (mode) => {
		if (!effectiveCanLive) return;
		stopVoice();
		if (isListening) onStopListening();
		setLiveInitialMode(mode);
		setLiveModalOpen(true);
	};
	(0, import_react.useEffect)(() => {
		if (openLiveCounter > 0 && appConfig.enableLiveMode) {
			setLiveInitialMode("voice");
			setLiveModalOpen(true);
		}
	}, [openLiveCounter, appConfig.enableLiveMode]);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [fileError, setFileError] = (0, import_react.useState)(null);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [autoSpeak, setAutoSpeak] = (0, import_react.useState)(false);
	const [exportingPdfId, setExportingPdfId] = (0, import_react.useState)(null);
	const [quizMakerOpen, setQuizMakerOpen] = (0, import_react.useState)(false);
	const [quizTopicInput, setQuizTopicInput] = (0, import_react.useState)("");
	const [quizQuestionCount, setQuizQuestionCount] = (0, import_react.useState)(5);
	const { voice, setVoice, activeId: activeVoiceId, isLoading: isVoiceLoading, isPlaying: isVoicePlaying, speak, stop: stopVoice } = useVoicePlayer(appConfig.defaultVoice);
	(0, import_react.useEffect)(() => {
		setVoice(appConfig.defaultVoice);
	}, [appConfig.defaultVoice, setVoice]);
	(0, import_react.useEffect)(() => {
		if (!appConfig.enableLiveMode && liveModalOpen) setLiveModalOpen(false);
	}, [appConfig.enableLiveMode, liveModalOpen]);
	(0, import_react.useEffect)(() => {
		if (!appConfig.enableVoiceOutput && autoSpeak) {
			setAutoSpeak(false);
			stopVoice();
		}
	}, [
		appConfig.enableVoiceOutput,
		autoSpeak,
		stopVoice
	]);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: isStreaming ? "auto" : "smooth",
			block: "end"
		});
	}, [messages, isStreaming]);
	(0, import_react.useEffect)(() => {
		if (!latestCompletedAssistantId || !shouldAutoSpeakLatest) return;
		const msg = messages.find((m) => m.id === latestCompletedAssistantId);
		if (msg && msg.role === "model" && msg.text.trim()) speak(msg.text, msg.id);
		onHandledAutoSpeak();
	}, [
		latestCompletedAssistantId,
		shouldAutoSpeakLatest,
		messages,
		speak,
		onHandledAutoSpeak
	]);
	const handleFileSelected = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setFileError("Please select a valid image file (JPG, PNG, or WebP).");
			return;
		}
		setFileError(null);
		try {
			onImageChange(await processImageFile(file));
		} catch (err) {
			setFileError(err instanceof Error ? err.message : "Unable to process image.");
		}
	};
	const handleCopy = async (id, text) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedId(id);
			setTimeout(() => setCopiedId((prev) => prev === id ? null : prev), 2e3);
		} catch {}
	};
	const handleSendClick = () => {
		if (isListening) {
			onStopListening();
			if (!draftText.trim() && !image) return;
		}
		if (isTranscribing && !draftText.trim() && !image) return;
		onSendMessage({ speakReply: autoSpeak });
	};
	const handleDownloadMessagePdf = async (msg) => {
		const markdownSource = msg.quiz ? formatQuizAsMarkdown(msg.quiz) : msg.text;
		if (!markdownSource.trim() || exportingPdfId) return;
		setExportingPdfId(msg.id);
		try {
			const title = msg.quiz?.title || msg.pdf?.title || extractPdfTitle(msg.text, `${classNameLevel} Study Notes`);
			const filename = msg.pdf?.filename || makeSafeFilename(title);
			await generateStudyPdf({
				title,
				subtitle: `West Bengal Board (WBBSE) · ${classNameLevel}`,
				markdown: markdownSource,
				filename
			});
		} finally {
			setExportingPdfId(null);
		}
	};
	const handleExportChatPdf = async () => {
		if (messages.length === 0 || exportingPdfId) return;
		setExportingPdfId("full-chat");
		try {
			await generateConversationPdf(messages.map((m) => m.quiz ? {
				...m,
				text: formatQuizAsMarkdown(m.quiz)
			} : m), classNameLevel);
		} finally {
			setExportingPdfId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "AI Teacher Chat",
		onDragOver: (e) => {
			e.preventDefault();
			setIsDragging(true);
		},
		onDragLeave: () => setIsDragging(false),
		onDrop: (e) => {
			e.preventDefault();
			setIsDragging(false);
			if (appConfig.enableCamera) handleFileSelected(e.dataTransfer.files?.[0]);
		},
		className: `flex-1 min-h-0 bg-[var(--app-card-bg)] dark:backdrop-blur-xl sm:border rounded-none sm:rounded-3xl flex flex-col overflow-hidden transition-colors dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)] ${isDragging ? "border-[var(--app-accent)] dark:border-fuchsia-400 ring-2 ring-fuchsia-500/30" : "border-slate-200/90 dark:border-white/10"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 px-2 sm:px-5 py-1 sm:py-1.5 border-b border-slate-200/80 dark:border-white/10 bg-[var(--app-card-bg)] flex items-center justify-between gap-1 flex-nowrap overflow-x-auto taskbar-scroll",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-1.5 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "class-select",
							className: "sr-only",
							children: "Select Class"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "class-select",
							value: isClass8OfflineOnly ? "Class 8" : classNameLevel,
							onChange: (e) => onClassChange(e.target.value),
							disabled: isClass8OfflineOnly,
							className: "h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] dark:focus:border-sky-500 focus:outline-none disabled:opacity-80",
							children: (isClass8OfflineOnly ? ["Class 8"] : CLASS_LEVELS).map((lvl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: lvl,
								children: isClass8OfflineOnly ? "Class 8 (100MB)" : lvl
							}, lvl))
						}),
						!isClass8OfflineOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOfflineLibraryOpen(true),
							className: `h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border text-[11px] sm:text-xs font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${!isOnline ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600" : "bg-[var(--app-surface-subtle)] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[var(--app-accent)] hover:text-[var(--app-accent)]"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookMarked, { className: "w-3.5 h-3.5 shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sm:hidden",
									children: "নোটস"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "অফলাইন নোটস"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-1.5 shrink-0",
					children: [appConfig.enableVoiceOutput && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "voice-select",
							className: "sr-only",
							children: "AI Voice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "voice-select",
							value: voice,
							onChange: (e) => setVoice(e.target.value),
							className: "h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--app-accent)] dark:focus:border-sky-500 focus:outline-none max-w-[68px] sm:max-w-none",
							title: "Select AI Teacher Voice",
							children: VOICE_OPTIONS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v.value,
								children: v.value
							}, v.value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const next = !autoSpeak;
								setAutoSpeak(next);
								if (!next && (isVoicePlaying || isVoiceLoading)) stopVoice();
							},
							"aria-pressed": autoSpeak,
							"aria-label": autoSpeak ? "Auto Voice On" : "Auto Voice Off",
							title: autoSpeak ? "Voice On" : "Voice Off",
							className: `h-7 sm:h-8 px-2 rounded-lg border text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${autoSpeak ? "bg-[var(--app-accent-soft)] border-[var(--app-accent)]/40 dark:border-sky-500/50 text-[var(--app-accent)] dark:text-sky-400" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"}`,
							children: autoSpeak ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Voice On"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Voice Off"
							})] })
						})
					] }), messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [appConfig.enablePdfExport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleExportChatPdf,
						disabled: isStreaming || exportingPdfId === "full-chat",
						"aria-label": "Export conversation as PDF",
						title: "Download full chat as PDF",
						className: "h-7 sm:h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap disabled:opacity-50 shrink-0",
						children: [exportingPdfId === "full-chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "PDF"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							stopVoice();
							if (isListening) onStopListening();
							onReset();
						},
						disabled: isStreaming,
						"aria-label": "Start new chat",
						title: "Clear chat",
						className: "h-7 sm:h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap disabled:opacity-50 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Clear"
						})]
					})] })]
				})]
			}),
			!isOnline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 px-3 sm:px-5 py-2 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800/70 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: isClass8OfflineOnly ? "অনলি ক্লাস ৮ (১০০ MB) মোড চালু — শুধু Class 8-এর মেসেজ, ভয়েস ও PDF কাজ করবে (অন্য কিছু নয়)।" : offlineAiTier === "pro" ? "অফলাইন প্রো (৫০০ MB) চালু — সব ফিচার ও গুছিয়ে বিস্তারিত উত্তর চলছে!" : offlineAiTier === "standard" ? "অফলাইন ফাস্ট (২৫০ MB) চালু — সব ফিচার ও সুপার ফাস্ট উত্তর চলছে!" : "অফলাইন মোড চালু — WBBSE নোটস, অঙ্ক সমাধান ও PDF ব্যবহার করুন, অথবা 100/250/500 MB AI প্যাক ডাউনলোড করুন।"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [onOpenOfflineAiPack && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onOpenOfflineAiPack,
						className: "min-h-[28px] px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0",
						children: offlineAiTier === "pro" ? "500 MB AI ✓" : offlineAiTier === "standard" ? "250 MB AI ✓" : offlineAiTier === "class8" ? "Class 8 (100 MB) ✓" : "Offline AI প্যাক"
					}), !isClass8OfflineOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOfflineLibraryOpen(true),
						className: "min-h-[28px] px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0",
						children: "পাঠ্যবই নোটস খুলুন"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-h-0 overflow-y-auto px-2 sm:px-6 py-2.5 sm:py-5 space-y-3 sm:space-y-5",
				children: messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-full flex flex-col justify-start sm:justify-center max-w-3xl mx-auto py-1 sm:py-4 space-y-3.5 sm:space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center text-center space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "wbsec-ai-orb",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight",
									children: appConfig.welcomeTitle.trim() || `${appConfig.appName} AI Assistant`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed",
									children: appConfig.welcomeSubtitle.trim() || DEFAULT_APP_CONFIG.welcomeSubtitle
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 max-w-2xl mx-auto w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "wbsec-mini-orb mt-1",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "wbsec-bubble-ai px-4 py-3 text-sm text-slate-900 dark:text-slate-100 leading-relaxed flex-1",
								children: studentProfile?.name?.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"নমস্কার, ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-cyan-700 dark:text-cyan-300",
										children: studentProfile.name.trim()
									}),
									"! আমি তোমার ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										appConfig.appName,
										" AI Teacher (",
										isClass8OfflineOnly ? "Class 8" : classNameLevel,
										")"
									] }),
									"।",
									" ",
									isClass8OfflineOnly ? "এখন অনলি ক্লাস ৮ (১০০ MB) মোডে আছো — নিচে মেসেজ লেখো, ভয়েস ব্যবহার করো বা PDF নাও।" : "আজ কী পড়বে বলো — নিচে প্রশ্ন লিখো অথবা মাইক, ক্যামেরা, কুইজ ও লাইভ বাটন ব্যবহার করো।"
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"নমস্কার! আমি আপনার ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										appConfig.appName,
										" AI Teacher (",
										isClass8OfflineOnly ? "Class 8" : classNameLevel,
										")"
									] }),
									"।",
									" ",
									isClass8OfflineOnly ? "এখন অনলি ক্লাস ৮ (১০০ MB) মোড চালু — শুধু মেসেজ, ভয়েস ও PDF ব্যবহার করুন।" : "নিচে যেকোনো প্রশ্ন লিখুন অথবা মাইক, ক্যামেরা, ফাইল ও লাইভ বাটন ব্যবহার করুন।"
								] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-2.5",
							children: [effectiveCanQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setQuizMakerOpen((prev) => !prev),
								className: "min-h-[42px] px-4 py-2 rounded-xl border border-amber-400/60 dark:border-amber-400/50 bg-amber-50/80 dark:bg-amber-950/35 hover:border-amber-500 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" }), "কুইজ তৈরি করুন (Quiz)"]
							}), onOpenOfflineAiPack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onOpenOfflineAiPack,
								className: `min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all ${offlineAiReady ? "border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200" : "border-slate-200 dark:border-white/15 bg-[var(--app-surface-subtle)] hover:border-fuchsia-400 text-slate-900 dark:text-slate-100"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400 shrink-0" }), offlineAiTier === "pro" ? "Offline AI (500 MB) ✓" : offlineAiTier === "standard" ? "Offline AI (250 MB) ✓" : offlineAiTier === "class8" ? "Class 8 (100 MB) ✓" : "অফলাইন AI প্যাক (100–500 MB)"]
							})]
						}),
						quizMakerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-amber-400/40 dark:border-amber-400/35 bg-white/95 dark:bg-[#12162b]/95 p-4 space-y-3 shadow-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-500 dark:text-amber-300" }), "যেকোনো টপিক লিখো — ৪ অপশনের কুইজ তৈরি হয়ে যাবে"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuizMakerOpen(false),
										"aria-label": "Close quiz maker",
										className: "p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: (e) => {
										e.preventDefault();
										const topic = quizTopicInput.trim();
										if (!topic) return;
										setQuizMakerOpen(false);
										setQuizTopicInput("");
										onSendMessage({
											overrideText: `${topic} নিয়ে ${quizQuestionCount}টি কুইজ প্রশ্ন বানাও`,
											speakReply: autoSpeak
										});
									},
									className: "flex flex-col sm:flex-row gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: quizTopicInput,
											onChange: (e) => setQuizTopicInput(e.target.value),
											placeholder: "টপিক লিখো (যেমন: সালোকসংশ্লেষ, পলাশীর যুদ্ধ, গণিত, Tense)...",
											className: "flex-1 min-h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0b0e1e] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-cyan-400"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: quizQuestionCount,
											onChange: (e) => setQuizQuestionCount(Number(e.target.value)),
											"aria-label": "Number of quiz questions",
											className: "min-h-[42px] px-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0b0e1e] text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 5,
													children: "৫টি প্রশ্ন"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 8,
													children: "৮টি প্রশ্ন"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 10,
													children: "১০টি প্রশ্ন"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "submit",
											disabled: !quizTopicInput.trim() || isStreaming,
											className: "min-h-[42px] px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-600 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 disabled:opacity-50 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "w-4 h-4" }), "কুইজ বানাও"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: [
										"সালোকসংশ্লেষ",
										"নিউটনের গতিসূত্র",
										"পলাশীর যুদ্ধ",
										"পশ্চিমবঙ্গের ভূগোল",
										"বাংলা সন্ধি",
										"গণিত",
										"English Tense"
									].map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: isStreaming,
										onClick: () => {
											setQuizMakerOpen(false);
											onSendMessage({
												overrideText: `${preset} নিয়ে ${quizQuestionCount}টি কুইজ প্রশ্ন বানাও`,
												speakReply: autoSpeak
											});
										},
										className: "px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:border-cyan-400 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors",
										children: preset
									}, preset))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-medium text-slate-500 dark:text-slate-400 text-center",
								children: "Try asking:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5",
								children: (appConfig.samplePrompts.length > 0 ? appConfig.samplePrompts : SAMPLE_PROMPTS).map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onSendMessage({
										overrideText: sample,
										speakReply: autoSpeak
									}),
									className: "text-left p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-[var(--app-surface-subtle)] hover:bg-white dark:hover:bg-[#181b2e] hover:border-fuchsia-400/70 dark:hover:border-cyan-400/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed transition-all",
									children: sample
								}, sample))
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl mx-auto space-y-3 sm:space-y-4",
					children: [
						messages.map((msg) => {
							if (msg.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "wbsec-msg-enter flex items-start justify-end gap-1.5 sm:gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "wbsec-bubble-user max-w-[88%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 space-y-1.5",
									children: [
										studentProfile?.name?.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-semibold text-slate-500 dark:text-cyan-200/80",
											children: studentProfile.name.trim()
										}),
										msg.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: msg.image.dataUrl,
											alt: msg.image.name || "Attached textbook photo",
											referrerPolicy: "no-referrer",
											className: "max-h-52 rounded-xl object-contain bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10"
										}),
										msg.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[14.5px] sm:text-[15px] leading-relaxed text-slate-900 dark:text-slate-50 whitespace-pre-wrap",
											children: msg.text
										})
									]
								}), studentProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onOpenProfile?.(),
									title: "আমার প্রোফাইল",
									"aria-label": "Open student profile",
									className: "mt-0.5 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
										profile: studentProfile,
										size: "xs"
									})
								})]
							}, msg.id);
							const isThisVoiceActive = activeVoiceId === msg.id;
							const isCurrentlyStreamingMsg = isStreaming && msg.id === messages[messages.length - 1]?.id;
							const msgHighlights = msg.highlights ?? [];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "wbsec-msg-enter flex items-start gap-2 sm:gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "wbsec-mini-orb mt-1 shrink-0",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "wbsec-bubble-ai px-3 sm:px-4 py-2.5 sm:py-3.5 space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold text-slate-900 dark:text-white",
														children: [appConfig.appName, " Teacher"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: classNameLevel }),
													msgHighlights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-amber-700 dark:text-yellow-300 font-medium tabular-nums",
														children: [msgHighlights.length, " highlighted"]
													})] }),
													isCurrentlyStreamingMsg && !msg.text && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-cyan-600 dark:text-cyan-400 font-medium",
														children: "Thinking..."
													})] })
												]
											}), msg.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormattedBengaliText, {
												text: msg.text,
												highlights: msgHighlights,
												interactive: !isCurrentlyStreamingMsg,
												onAddHighlight: (phrase) => onAddHighlight?.(msg.id, phrase),
												onRemoveHighlight: (phrase) => onRemoveHighlight?.(msg.id, phrase)
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2 max-w-md animate-pulse py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-slate-200 dark:bg-white/10 rounded w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-slate-200 dark:bg-white/10 rounded w-1/2" })]
											})]
										}),
										!isCurrentlyStreamingMsg && msg.quiz && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveQuizCard, {
											quiz: msg.quiz,
											isBusy: isStreaming,
											onRequestNewQuiz: (topic) => onSendMessage({
												overrideText: `${topic} নিয়ে নতুন ৫টি কুইজ প্রশ্ন বানাও`,
												speakReply: autoSpeak
											})
										}),
										!isCurrentlyStreamingMsg && msg.pdf && appConfig.enablePdfExport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 max-w-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-9 h-9 rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-400 flex items-center justify-center shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-semibold text-slate-900 dark:text-slate-100 truncate",
														children: msg.pdf.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-slate-500 dark:text-slate-400 truncate",
														children: [msg.pdf.filename, " · Ready"]
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleDownloadMessagePdf(msg),
												disabled: exportingPdfId === msg.id,
												className: "min-h-[40px] px-3.5 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60",
												children: exportingPdfId === msg.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "Creating PDF..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "w-3.5 h-3.5" }), "Download PDF"] })
											})]
										}),
										!isCurrentlyStreamingMsg && msg.text && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 pt-0.5 flex-nowrap overflow-x-auto taskbar-scroll",
											children: [
												appConfig.enableVoiceOutput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => speak(msg.text, msg.id),
													className: `h-7 sm:h-8 px-2.5 rounded-lg border text-[11px] sm:text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${isThisVoiceActive && (isVoicePlaying || isVoiceLoading) ? "bg-[var(--app-accent-soft)] border-[var(--app-accent)]/40 dark:border-sky-500/50 text-[var(--app-accent)] dark:text-sky-400" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"}`,
													children: isThisVoiceActive && isVoiceLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }), "Voice..."] }) : isThisVoiceActive && isVoicePlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3 h-3 text-rose-600 dark:text-rose-400" }), "Stop"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-3 h-3" }), "Listen"] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleCopy(msg.id, msg.quiz ? formatQuizAsMarkdown(msg.quiz) : msg.text),
													className: "h-7 sm:h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0",
													children: copiedId === msg.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-600 dark:text-emerald-400" }), "Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3 h-3" }), "Copy"] })
												}),
												!msg.pdf && appConfig.enablePdfExport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleDownloadMessagePdf(msg),
													disabled: exportingPdfId === msg.id,
													className: "h-7 sm:h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60",
													children: exportingPdfId === msg.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }), "PDF..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "w-3 h-3" }), "PDF"] })
												}),
												!msg.quiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: isStreaming,
													onClick: () => onSendMessage({ overrideText: "উপরের বিষয়টি নিয়ে ৫টি কুইজ প্রশ্ন বানাও (প্রতিটিতে ৪টি অপশনসহ)।" }),
													className: "h-7 sm:h-8 px-2.5 rounded-lg border border-amber-300/70 dark:border-amber-500/40 text-[11px] sm:text-xs font-medium text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "w-3 h-3" }), "কুইজ"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: isStreaming,
													onClick: () => onSendMessage({ overrideText: "উপরের গল্প বা বিষয়টি আরও বড়, পূর্ণাঙ্গ এবং বিস্তারিতভাবে শুরু থেকে শেষ পর্যন্ত সুন্দর করে বুঝিয়ে দাও।" }),
													className: "h-7 sm:h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-[var(--app-accent)] dark:hover:border-sky-500 hover:text-[var(--app-accent)] dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3 h-3" }), "আরও বিস্তারিত"]
												})
											]
										})
									]
								})]
							}, msg.id);
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2.5",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 border-t border-slate-200/80 dark:border-white/10 bg-[var(--app-card-bg)] dark:bg-gradient-to-b dark:from-transparent dark:to-[#05060d]/95 px-2 sm:px-6 py-1.5 sm:py-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl mx-auto space-y-1.5",
					children: [
						(isListening || isTranscribing) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-[var(--app-accent-soft)] dark:bg-fuchsia-950/50 border border-[var(--app-accent)]/30 dark:border-fuchsia-500/40 px-3 py-1.5 text-xs text-slate-700 dark:text-fuchsia-100 flex items-center justify-between gap-2.5",
							"aria-live": "polite",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-semibold text-[var(--app-accent)] dark:text-fuchsia-300 flex items-center gap-1.5",
									children: [isTranscribing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0",
										"aria-hidden": "true"
									}), isTranscribing ? speechLang === "bn-IN" ? "আপনার কথা পরিষ্কারভাবে লেখা হচ্ছে..." : "Transcribing your voice..." : speechLang === "bn-IN" ? "শুনছি — কথা শেষে Done চাপুন" : "Listening — speak now, tap Done when finished"]
								}), interimTranscript && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-700 dark:text-slate-200 truncate",
									children: interimTranscript
								})]
							}), isListening && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onStopListening,
								className: "h-7 px-2.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold shrink-0",
								children: "Done"
							})]
						}),
						image && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/35 bg-slate-50 dark:bg-[#121422] px-2.5 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: image.dataUrl,
									alt: "Attached photo preview",
									referrerPolicy: "no-referrer",
									className: "w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-white/15 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-slate-900 dark:text-slate-100 truncate",
										children: image.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 dark:text-cyan-300",
										children: "Photo attached"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onImageChange(null),
								"aria-label": "Remove attached photo",
								className: "h-7 px-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 inline-flex items-center gap-1 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), "Remove"]
							})]
						}),
						(validationError || fileError || speechError) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5 shrink-0" }), validationError || fileError || speechError]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInputRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: (e) => {
								handleFileSelected(e.target.files?.[0]);
								e.target.value = "";
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "wbsec-neon-input flex items-center gap-1.5 pl-3 pr-1 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "ai-question",
								rows: 1,
								value: draftText,
								onChange: (e) => onDraftTextChange(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										if (!isStreaming) handleSendClick();
									}
								},
								placeholder: "Ask anything...",
								className: "flex-1 min-w-0 max-h-24 py-1.5 bg-transparent text-slate-900 dark:text-white text-sm sm:text-[15px] leading-snug placeholder:text-slate-400 dark:placeholder:text-[#8b92a8] focus:outline-none resize-none"
							}), isStreaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onStopStreaming,
								"aria-label": "Stop response",
								className: "min-w-[38px] h-[34px] sm:h-[38px] px-2.5 sm:px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold inline-flex items-center justify-center gap-1 active:scale-95 transition-all shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3.5 h-3.5 fill-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Stop"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSendClick,
								"aria-label": "Send message",
								className: "wbsec-neon-send min-w-[38px] h-[34px] sm:h-[38px] px-2.5 sm:px-3 rounded-xl inline-flex items-center justify-center active:scale-95 transition-transform shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4 fill-current" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-x-auto taskbar-scroll",
							children: [isSpeechSupported && appConfig.enableVoiceInput && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: onToggleListening,
									disabled: isTranscribing,
									"aria-pressed": isListening,
									title: isListening ? "Stop voice dictation" : "Voice Mic",
									"aria-label": isListening ? "Stop voice dictation" : "Start Bengali voice dictation",
									className: `wbsec-neon-action wbsec-neon-action-mic px-2.5 sm:px-3 disabled:opacity-60 ${isListening ? "ring-2 ring-fuchsia-400/70" : ""}`,
									children: [isTranscribing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin shrink-0" }) : isListening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline text-xs font-semibold",
										children: isTranscribing ? "Writing..." : isListening ? "Stop" : "Voice"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center rounded-lg bg-slate-200/80 dark:bg-[#121422] border border-slate-200 dark:border-white/10 p-0.5 text-[10.5px] sm:text-[11px]",
									role: "group",
									"aria-label": "Voice language",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: isListening,
										onClick: () => onSpeechLangChange("bn-IN"),
										className: `h-[26px] sm:h-[28px] px-1.5 sm:px-2 rounded-md font-semibold transition-colors whitespace-nowrap ${speechLang === "bn-IN" ? "bg-white dark:bg-fuchsia-600 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"} disabled:opacity-60`,
										children: "বাংলা"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: isListening,
										onClick: () => onSpeechLangChange("en-IN"),
										className: `h-[26px] sm:h-[28px] px-1.5 sm:px-2 rounded-md font-semibold transition-colors whitespace-nowrap ${speechLang === "en-IN" ? "bg-white dark:bg-fuchsia-600 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"} disabled:opacity-60`,
										children: "EN"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 sm:gap-2.5 shrink-0",
								children: [effectiveCanCamera && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setCameraModalOpen(true),
									title: "Camera",
									"aria-label": "Take a photo with camera",
									className: "wbsec-neon-action wbsec-neon-action-camera px-2.5 sm:px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline text-xs font-semibold",
										children: "Camera"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => fileInputRef.current?.click(),
									title: "Attach Book Photo",
									"aria-label": "Upload an image",
									className: "wbsec-neon-action wbsec-neon-action-attach px-2.5 sm:px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline text-xs font-semibold",
										children: "Attach"
									})]
								})] }), effectiveCanLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => openLiveMode("voice"),
									title: "AI Live (সরাসরি কথা ও টেক্সট লাইভ)",
									"aria-label": "Open AI Live Teacher Mode",
									className: "wbsec-neon-action wbsec-neon-action-live px-2.5 sm:px-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] sm:text-xs font-bold whitespace-nowrap",
										children: isOnline ? "AI Live" : "Offline Live"
									})]
								})]
							})]
						})
					]
				})
			}),
			effectiveCanCamera && cameraModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraCaptureModal, {
					isOpen: true,
					onClose: () => setCameraModalOpen(false),
					onCapture: (captured) => {
						setFileError(null);
						onImageChange(captured);
					},
					onFallbackUpload: () => fileInputRef.current?.click()
				})
			}),
			appConfig.enableLiveMode && liveModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTeacherModal, {
					isOpen: true,
					onClose: (liveItems) => {
						setLiveModalOpen(false);
						if (liveItems.length > 0) onSaveLiveTranscripts?.(liveItems);
					},
					classNameLevel,
					voice,
					onVoiceChange: setVoice,
					defaultLiveRole: appConfig.defaultLiveRole,
					initialInteractionMode: liveInitialMode,
					enableCamera: appConfig.enableCamera,
					studentName: studentProfile?.name,
					onOpenOfflineAiPack
				})
			}),
			offlineLibraryOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineStudyLibraryModal, {
					isOpen: true,
					onClose: () => setOfflineLibraryOpen(false),
					isOnline,
					onSelectTopic: (title, answer) => {
						onOpenOfflineTopic?.(title, answer);
					}
				})
			})
		]
	});
}
// src/components/StudentOnboardingModal.tsx
var CLASS_OPTIONS = [
	"Class 5",
	"Class 6",
	"Class 7",
	"Class 8",
	"Class 9",
	"Class 10"
];
function StudentOnboardingModal({ isOpen, appName, initialClass, onComplete }) {
	const [name, setName] = (0, import_react.useState)("");
	const [selectedClass, setSelectedClass] = (0, import_react.useState)(initialClass);
	const [avatarType, setAvatarType] = (0, import_react.useState)("preset");
	const [avatarPreset, setAvatarPreset] = (0, import_react.useState)("boy-scholar");
	const [avatarColor, setAvatarColor] = (0, import_react.useState)("cyan");
	const [customAvatarDataUrl, setCustomAvatarDataUrl] = (0, import_react.useState)(void 0);
	const [error, setError] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setSelectedClass(initialClass);
	}, [initialClass]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const t = window.setTimeout(() => {
			inputRef.current?.focus();
		}, 180);
		return () => window.clearTimeout(t);
	}, [isOpen]);
	if (!isOpen) return null;
	const previewProfile = {
		name: name.trim(),
		className: selectedClass,
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
			setError("অনুগ্রহ করে একটি সঠিক ছবি (JPG বা PNG) বেছে নাও।");
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
		const cleaned = name.trim();
		if (!cleaned) {
			setError("অনুগ্রহ করে তোমার নাম লেখো যাতে AI Teacher তোমাকে নামে ডাকতে পারে।");
			inputRef.current?.focus();
			return;
		}
		if (cleaned.length > 40) {
			setError("নামটি ৪০ অক্ষরের মধ্যে লেখো।");
			return;
		}
		onComplete({
			name: cleaned,
			className: selectedClass,
			school: "",
			favoriteSubject: "",
			avatarType,
			avatarPreset,
			avatarColor,
			customAvatarDataUrl: avatarType === "custom" ? customAvatarDataUrl : void 0,
			onboardingCompleted: true,
			updatedAt: Date.now()
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "student-onboarding-title",
		className: "fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl bg-white dark:bg-[#0d1124] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden my-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 pt-6 pb-4 text-center bg-gradient-to-b from-cyan-50/90 via-white to-white dark:from-indigo-950/60 dark:via-[#0d1124] dark:to-[#0d1124]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative inline-flex flex-col items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
								profile: previewProfile,
								size: "xl"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => fileInputRef.current?.click(),
								title: "নিজের ছবি দাও",
								"aria-label": "Upload your own photo",
								className: "absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 border-2 border-white dark:border-[#0d1124] flex items-center justify-center shadow-md hover:scale-105 transition-transform",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" })
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "student-onboarding-title",
						className: "mt-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
						children: "Enter Your Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
						children: [appName, "-এ স্বাগতম! তোমার নাম লেখো — AI Teacher এখন থেকে তোমাকে এই নামেই ডাকবে।"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "px-6 pb-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "onboarding-student-name",
								className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
								children: "তোমার নাম (Your Name)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: inputRef,
								id: "onboarding-student-name",
								type: "text",
								maxLength: 40,
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									if (error) setError(null);
								},
								placeholder: "যেমন: অরিত্র, রিয়া, আমির...",
								className: "w-full min-h-[48px] px-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900/90 text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-rose-600 dark:text-rose-400",
								children: error
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
							children: "তোমার ক্লাস বেছে নাও (WBBSE)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-1.5",
							children: CLASS_OPTIONS.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedClass(cls),
								className: `min-h-[38px] rounded-xl text-xs font-semibold border transition-all ${selectedClass === cls ? "border-cyan-500 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25"}`,
								children: cls
							}, cls))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-slate-700 dark:text-slate-300",
								children: "অ্যাভাটার পছন্দ করো (Avatar)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5",
								children: AVATAR_COLOR_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Avatar color ${c.label}`,
									onClick: () => setAvatarColor(c.id),
									className: `w-5 h-5 rounded-full ${c.swatchClass} transition-transform ${avatarColor === c.id ? "scale-115 ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-[#0d1124]" : "opacity-75 hover:opacity-100"}`
								}, c.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-5 gap-2",
							children: AVATAR_PRESET_OPTIONS.slice(0, 5).map((opt) => {
								const isSelected = avatarType === "preset" && avatarPreset === opt.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setAvatarType("preset");
										setAvatarPreset(opt.id);
									},
									className: `p-1.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${isSelected ? "border-cyan-500 bg-cyan-500/10" : "border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/25"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
										profile: {
											name: name.trim() || "S",
											avatarType: "preset",
											avatarPreset: opt.id,
											avatarColor
										},
										size: "sm"
									})
								}, opt.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "w-full min-h-[48px] px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:brightness-110 active:scale-[0.98] transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পড়াশোনা শুরু করি" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 shrink-0" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-center text-slate-500 dark:text-slate-400",
						children: "এই পপআপটি শুধুমাত্র প্রথমবারই আসবে। পরে উপরের প্রোফাইল আইকন থেকে যেকোনো সময় নাম ও অ্যাভাটার পরিবর্তন করা যাবে।"
					})
				]
			})]
		})
	});
}
// src/offline/offlineAiTypes.ts
var OFFLINE_AI_PACKS = {
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
var OFFLINE_AI_PACK_ORDER = [
	"pro",
	"standard",
	"class8"
];
// src/offline/offlineAiEngine.ts
var PACK_META_STORAGE_KEY = "wbsec_offline_ai_pack_meta_v1";
function readStoredPackMeta() {
	try {
		if (typeof localStorage === "undefined") return null;
		const raw = localStorage.getItem(PACK_META_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed.installedTier === "class8" || parsed.installedTier === "standard" || parsed.installedTier === "pro") return {
			installedTier: parsed.installedTier,
			ocrCached: Boolean(parsed.ocrCached),
			lastUpdatedAt: typeof parsed.lastUpdatedAt === "number" ? parsed.lastUpdatedAt : Date.now()
		};
		return null;
	} catch {
		return null;
	}
}
function writeStoredPackMeta(meta) {
	try {
		if (typeof localStorage === "undefined") return;
		if (!meta) localStorage.removeItem(PACK_META_STORAGE_KEY);
		else localStorage.setItem(PACK_META_STORAGE_KEY, JSON.stringify(meta));
	} catch {}
}
function isOfflineAiCacheName(cacheName) {
	const lower = cacheName.toLowerCase();
	return lower.includes("transformers") || lower.includes("wbsec-offline-ai") || lower.includes("huggingface") || lower.includes("jsdelivr-wasm") || lower.includes("tessdata");
}
async function measureOfflineAiCacheBytes() {
	let cachedBytes = 0;
	let storageQuotaBytes = 0;
	let storageUsageBytes = 0;
	try {
		if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
			const est = await navigator.storage.estimate();
			storageQuotaBytes = est.quota ?? 0;
			storageUsageBytes = est.usage ?? 0;
		}
	} catch {}
	try {
		if (typeof caches !== "undefined") {
			const keys = await caches.keys();
			for (const name of keys) {
				if (!isOfflineAiCacheName(name)) continue;
				const cache = await caches.open(name);
				const requests = await cache.keys();
				for (const req of requests) {
					const res = await cache.match(req);
					if (!res) continue;
					const cl = res.headers.get("content-length");
					if (cl) {
						const parsed = parseInt(cl, 10);
						if (Number.isFinite(parsed) && parsed > 0) {
							cachedBytes += parsed;
							continue;
						}
					}
					try {
						const blob = await res.clone().blob();
						cachedBytes += blob.size;
					} catch {}
				}
			}
		}
	} catch {}
	if (cachedBytes === 0 && storageUsageBytes > 20971520) cachedBytes = storageUsageBytes;
	return {
		cachedBytes,
		storageQuotaBytes,
		storageUsageBytes
	};
}
var initialMeta = readStoredPackMeta();
var state = {
	status: initialMeta ? "ready" : "not-downloaded",
	installedTier: initialMeta?.installedTier ?? null,
	activeTier: initialMeta?.installedTier ?? null,
	llmLoaded: false,
	whisperLoaded: false,
	ocrCached: initialMeta?.ocrCached ?? false,
	deviceBackend: null,
	cachedBytes: 0,
	storageQuotaBytes: 0,
	storageUsageBytes: 0,
	progress: {
		stage: "idle",
		stageLabelBn: "",
		file: "",
		percent: 0,
		loadedBytes: 0,
		totalBytes: 0
	},
	error: null,
	lastUpdatedAt: initialMeta?.lastUpdatedAt ?? null
};
var listeners = /* @__PURE__ */ new Set();
var workerInstance = null;
var pendingTasks = /* @__PURE__ */ new Map();
var activeDownloadPromise = null;
function notify() {
	const snapshot = {
		...state,
		progress: { ...state.progress }
	};
	for (const listener of listeners) listener(snapshot);
}
function updateState(patch) {
	state = {
		...state,
		...patch
	};
	notify();
}
function ensureWorker() {
	if (workerInstance) return workerInstance;
	const worker = new Worker(new URL(
		/* @vite-ignore */
		"/assets/offlineAiWorker-B6_A7uqU.js",
		"" + import.meta.url
	), { type: "module" });
	worker.onmessage = (event) => {
		const data = event.data;
		if (!data) return;
		if (data.type === "progress") {
			updateState({ progress: {
				stage: data.stage ?? "llm",
				stageLabelBn: data.stageLabelBn ?? "ডাউনলোড হচ্ছে...",
				file: data.file ?? "",
				percent: data.percent ?? 0,
				loadedBytes: data.loadedBytes ?? 0,
				totalBytes: data.totalBytes ?? 0
			} });
			return;
		}
		if (data.type === "chunk" && data.id) {
			const task = pendingTasks.get(data.id);
			if (task?.onChunk && typeof data.text === "string") task.onChunk(data.text);
			return;
		}
		if (data.id && pendingTasks.has(data.id)) {
			const task = pendingTasks.get(data.id);
			pendingTasks.delete(data.id);
			if (data.type === "error") task.reject(new Error(data.error || "Offline AI error"));
			else {
				if (data.backend) updateState({ deviceBackend: data.backend });
				task.resolve(data);
			}
		}
	};
	worker.onerror = (err) => {
		const message = err.message || "Offline AI worker crashed.";
		for (const [, task] of pendingTasks) task.reject(new Error(message));
		pendingTasks.clear();
		workerInstance = null;
		updateState({
			status: state.installedTier ? "ready" : "error",
			llmLoaded: false,
			whisperLoaded: false,
			error: message
		});
	};
	workerInstance = worker;
	return worker;
}
function sendWorkerRequest(payload, options) {
	const worker = ensureWorker();
	const id = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	return new Promise((resolve, reject) => {
		pendingTasks.set(id, {
			resolve,
			reject,
			onChunk: options?.onChunk
		});
		if (options?.transfer && options.transfer.length > 0) worker.postMessage({
			...payload,
			id
		}, options.transfer);
		else worker.postMessage({
			...payload,
			id
		});
	});
}
function getOfflineAiState() {
	return {
		...state,
		progress: { ...state.progress }
	};
}
function subscribeOfflineAiState(listener) {
	listeners.add(listener);
	listener(getOfflineAiState());
	return () => {
		listeners.delete(listener);
	};
}
function isOfflineAiPackInstalled() {
	return Boolean(state.installedTier);
}
function getInstalledOfflinePack() {
	return state.installedTier ? OFFLINE_AI_PACKS[state.installedTier] : null;
}
function isOfflineFeatureAllowed(feature) {
	const pack = getInstalledOfflinePack();
	if (!pack) return true;
	switch (feature) {
		case "message": return pack.capabilities.allowMessage;
		case "voice": return pack.capabilities.allowVoice;
		case "pdf": return pack.capabilities.allowPdf;
		case "live": return pack.capabilities.allowLive;
		case "quiz": return pack.capabilities.allowQuiz;
		case "camera": return pack.capabilities.allowCamera;
		case "dictionary": return pack.capabilities.allowDictionary;
	}
}
async function refreshOfflineAiStorageInfo() {
	const info = await measureOfflineAiCacheBytes();
	updateState({
		cachedBytes: info.cachedBytes,
		storageQuotaBytes: info.storageQuotaBytes,
		storageUsageBytes: info.storageUsageBytes
	});
}
async function downloadOfflineAiPack(tier) {
	if (activeDownloadPromise) return activeDownloadPromise;
	const pack = OFFLINE_AI_PACKS[tier];
	activeDownloadPromise = (async () => {
		updateState({
			status: "downloading",
			activeTier: tier,
			error: null,
			progress: {
				stage: "llm",
				stageLabelBn: `${pack.nameBn} ডাউনলোড শুরু হচ্ছে (${pack.sizeLabel})...`,
				file: "",
				percent: 1,
				loadedBytes: 0,
				totalBytes: pack.approxBytes
			}
		});
		try {
			if (typeof navigator !== "undefined" && navigator.storage?.persist) await navigator.storage.persist().catch(() => false);
			const result = await sendWorkerRequest({
				type: "load-pack",
				tier,
				localOnly: false,
				loadWhisper: true
			});
			let ocrCached = pack.includeOcr ? state.ocrCached : false;
			if (pack.includeOcr) try {
				updateState({ progress: {
					stage: "ocr",
					stageLabelBn: "অফলাইন বইয়ের ছবি পড়া (OCR) সেভ হচ্ছে...",
					file: "ben+eng.traineddata",
					percent: 96,
					loadedBytes: pack.approxBytes,
					totalBytes: pack.approxBytes
				} });
				const createWorker = await loadTesseractCreateWorker();
				if (createWorker) {
					await (await createWorker(["ben", "eng"])).terminate();
					ocrCached = true;
				}
			} catch {}
			const now = Date.now();
			writeStoredPackMeta({
				installedTier: tier,
				ocrCached,
				lastUpdatedAt: now
			});
			const storageInfo = await measureOfflineAiCacheBytes();
			updateState({
				status: "ready",
				installedTier: tier,
				activeTier: tier,
				llmLoaded: Boolean(result.llmLoaded ?? true),
				whisperLoaded: Boolean(result.whisperLoaded ?? true),
				ocrCached,
				deviceBackend: result.backend ?? state.deviceBackend ?? "wasm",
				cachedBytes: storageInfo.cachedBytes,
				storageQuotaBytes: storageInfo.storageQuotaBytes,
				storageUsageBytes: storageInfo.storageUsageBytes,
				lastUpdatedAt: now,
				error: null,
				progress: {
					stage: "idle",
					stageLabelBn: "সম্পূর্ণ ডাউনলোড সম্পন্ন!",
					file: "",
					percent: 100,
					loadedBytes: storageInfo.cachedBytes,
					totalBytes: storageInfo.cachedBytes
				}
			});
		} catch (err) {
			const msg = err instanceof Error ? err.message : "অফলাইন AI প্যাক ডাউনলোড করা যায়নি। ইন্টারনেট ও ফোনের খালি স্টোরেজ চেক করে আবার চেষ্টা করুন।";
			updateState({
				status: state.installedTier ? "ready" : "error",
				error: msg,
				progress: {
					stage: "idle",
					stageLabelBn: "",
					file: "",
					percent: 0,
					loadedBytes: 0,
					totalBytes: 0
				}
			});
			throw err;
		} finally {
			activeDownloadPromise = null;
		}
	})();
	return activeDownloadPromise;
}
async function deleteOfflineAiPack() {
	if (workerInstance) {
		try {
			await sendWorkerRequest({ type: "unload" });
		} catch {}
		workerInstance.terminate();
		workerInstance = null;
	}
	try {
		if (typeof caches !== "undefined") {
			const keys = await caches.keys();
			await Promise.all(keys.filter((k) => isOfflineAiCacheName(k)).map((k) => caches.delete(k)));
		}
	} catch {}
	writeStoredPackMeta(null);
	const storageInfo = await measureOfflineAiCacheBytes();
	updateState({
		status: "not-downloaded",
		installedTier: null,
		activeTier: null,
		llmLoaded: false,
		whisperLoaded: false,
		ocrCached: false,
		deviceBackend: null,
		cachedBytes: storageInfo.cachedBytes,
		storageQuotaBytes: storageInfo.storageQuotaBytes,
		storageUsageBytes: storageInfo.storageUsageBytes,
		lastUpdatedAt: null,
		error: null,
		progress: {
			stage: "idle",
			stageLabelBn: "",
			file: "",
			percent: 0,
			loadedBytes: 0,
			totalBytes: 0
		}
	});
}
function abortOfflineAiGeneration() {
	if (workerInstance) workerInstance.postMessage({ type: "abort" });
}
async function streamOfflineTeacherChat(options) {
	const tier = state.installedTier;
	if (!tier) throw new Error("Offline AI Pack is not installed yet.");
	const onAbort = () => abortOfflineAiGeneration();
	options.signal?.addEventListener("abort", onAbort, { once: true });
	try {
		if (!state.llmLoaded) updateState({ status: "loading" });
		const pack = OFFLINE_AI_PACKS[tier];
		const maxNewTokens = tier === "pro" ? 520 : tier === "standard" ? 240 : 260;
		const res = await sendWorkerRequest({
			type: "chat",
			tier,
			className: pack.capabilities.onlyClass ?? options.className,
			studentName: options.studentName,
			messages: options.messages,
			contextHint: options.contextHint,
			maxNewTokens
		}, { onChunk: options.onChunk });
		updateState({
			status: "ready",
			llmLoaded: true,
			deviceBackend: res.backend ?? state.deviceBackend,
			error: null
		});
		return (res.text || "").trim();
	} finally {
		options.signal?.removeEventListener("abort", onAbort);
	}
}
async function generateOfflineLiveReply(options) {
	const tier = state.installedTier;
	if (!tier) throw new Error("Offline AI Pack is not installed yet.");
	if (!OFFLINE_AI_PACKS[tier].capabilities.allowLive) throw new Error("অনলি ক্লাস ৮ (১০০ MB) প্যাকে AI Live চালু নেই। লাইভ কথা বলতে ২৫০ MB বা ৫০০ MB প্যাক ডাউনলোড করো।");
	if (!state.llmLoaded) updateState({ status: "loading" });
	const res = await sendWorkerRequest({
		type: "live-reply",
		tier,
		className: options.className,
		liveRole: options.liveRole,
		studentName: options.studentName,
		history: options.history,
		userText: options.userText,
		contextHint: options.contextHint
	}, { onChunk: options.onChunk });
	updateState({
		status: "ready",
		llmLoaded: true,
		deviceBackend: res.backend ?? state.deviceBackend,
		error: null
	});
	return (res.text || "").trim();
}
async function lookupOfflineAiDictionary(word) {
	const tier = state.installedTier;
	if (!tier) return null;
	if (!OFFLINE_AI_PACKS[tier].capabilities.allowDictionary) return null;
	try {
		const jsonMatch = ((await sendWorkerRequest({
			type: "dictionary",
			tier,
			word
		})).text || "").trim().match(/\{[\s\S]*\}/);
		if (!jsonMatch) return null;
		const parsed = JSON.parse(jsonMatch[0]);
		if (!parsed.meaning || typeof parsed.meaning !== "string") return null;
		return {
			word: (parsed.word || word).trim(),
			pronunciation: typeof parsed.pronunciation === "string" && parsed.pronunciation.trim() ? parsed.pronunciation.trim() : word,
			meaning: parsed.meaning.trim(),
			sandhiVicched: typeof parsed.sandhiVicched === "string" && parsed.sandhiVicched.trim() ? parsed.sandhiVicched.trim() : "অফলাইন AI বিশ্লেষণ",
			grammar: typeof parsed.grammar === "string" && parsed.grammar.trim() ? parsed.grammar.trim() : "শব্দ",
			exampleSentences: Array.isArray(parsed.exampleSentences) && parsed.exampleSentences.length > 0 ? parsed.exampleSentences.filter((s) => typeof s === "string" && s.trim().length > 0).slice(0, 2) : [`${word} শব্দটি পড়াশোনায় ব্যবহৃত হয়।`]
		};
	} catch {
		return null;
	}
}
async function transcribeOfflineAudio(pcm16k, language) {
	const tier = state.installedTier;
	if (!tier) throw new Error("Offline Voice Pack is not installed yet.");
	const copy = new Float32Array(pcm16k);
	const res = await sendWorkerRequest({
		type: "transcribe",
		tier,
		audio: copy,
		language
	}, { transfer: [copy.buffer] });
	updateState({ whisperLoaded: true });
	return (res.text || "").trim();
}
async function decodeAudioBlobTo16kPcm(blob) {
	const arrayBuffer = await blob.arrayBuffer();
	const ctx = new (window.AudioContext || window.webkitAudioContext)();
	try {
		const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
		const channelData = decoded.getChannelData(0);
		const inputRate = decoded.sampleRate;
		if (inputRate === 16e3) return new Float32Array(channelData);
		const ratio = inputRate / 16e3;
		const newLength = Math.max(1, Math.round(channelData.length / ratio));
		const output = new Float32Array(newLength);
		let outIdx = 0;
		let inIdx = 0;
		while (outIdx < newLength) {
			const nextIn = Math.min(channelData.length, Math.round((outIdx + 1) * ratio));
			let sum = 0;
			let count = 0;
			for (let i = inIdx; i < nextIn; i += 1) {
				sum += channelData[i];
				count += 1;
			}
			output[outIdx] = count > 0 ? sum / count : 0;
			outIdx += 1;
			inIdx = nextIn;
		}
		return output;
	} finally {
		if (ctx.state !== "closed") ctx.close().catch(() => {});
	}
}
var TESSERACT_CDN_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.esm.min.js";
async function loadTesseractCreateWorker() {
	const mod = await import(
		/* @vite-ignore */
		TESSERACT_CDN_URL
);
	return mod.createWorker ?? mod.default?.createWorker ?? null;
}
async function extractTextFromImageOffline(imageDataUrl) {
	try {
		const createWorker = await loadTesseractCreateWorker();
		if (!createWorker) return "";
		const worker = await createWorker(["ben", "eng"]);
		try {
			return ((await worker.recognize(imageDataUrl))?.data?.text || "").replace(/\s+/g, " ").trim();
		} finally {
			await worker.terminate();
		}
	} catch {
		return "";
	}
}
function formatBytesCompact(bytes) {
	if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
	const gb = bytes / 1073741824;
	if (gb >= 1) return `${gb.toFixed(2)} GB`;
	const mb = bytes / 1048576;
	if (mb >= 1) return `${Math.round(mb)} MB`;
	return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
// src/hooks/useSpeechRecognition.ts
function getSpeechRecognitionConstructor() {
	if (typeof window === "undefined") return null;
	const win = window;
	return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}
function canUseMediaRecorder() {
	return typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}
function pickSupportedAudioMimeType() {
	if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return "";
	for (const type of [
		"audio/webm;codecs=opus",
		"audio/webm",
		"audio/mp4",
		"audio/ogg;codecs=opus"
	]) if (MediaRecorder.isTypeSupported(type)) return type;
	return "";
}
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to read recorded audio."));
		reader.onloadend = () => {
			const result = typeof reader.result === "string" ? reader.result : "";
			resolve(result.includes(",") ? result.split(",")[1] : result);
		};
		reader.readAsDataURL(blob);
	});
}
function mapSpeechError(errorCode) {
	switch (errorCode) {
		case "not-allowed":
		case "service-not-allowed": return "Microphone permission was denied. Please enable microphone access in your browser settings.";
		case "no-speech": return "No speech was detected. Please try speaking again.";
		case "audio-capture": return "No microphone was found on this device.";
		case "network": return "Speech recognition requires an active internet connection.";
		case "aborted": return "";
		default: return "Voice input could not be completed. Please try again or type your text.";
	}
}
function useSpeechRecognition({ defaultLang = "bn-IN", continuous = false, onFinalResult } = {}) {
	const [lang, setLang] = (0, import_react.useState)(defaultLang);
	const [isListening, setIsListening] = (0, import_react.useState)(false);
	const [isTranscribing, setIsTranscribing] = (0, import_react.useState)(false);
	const [interimTranscript, setInterimTranscript] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const mediaStreamRef = (0, import_react.useRef)(null);
	const audioChunksRef = (0, import_react.useRef)([]);
	const maxDurationTimerRef = (0, import_react.useRef)(null);
	const silenceMonitorCleanupRef = (0, import_react.useRef)(null);
	const cancelledRef = (0, import_react.useRef)(false);
	const transcribingRef = (0, import_react.useRef)(false);
	const recognitionRef = (0, import_react.useRef)(null);
	const lastFallbackTextRef = (0, import_react.useRef)("");
	const onFinalResultRef = (0, import_react.useRef)(onFinalResult);
	onFinalResultRef.current = onFinalResult;
	const isSupported = canUseMediaRecorder() || Boolean(getSpeechRecognitionConstructor());
	const cleanupMediaResources = (0, import_react.useCallback)(() => {
		if (maxDurationTimerRef.current !== null) {
			window.clearTimeout(maxDurationTimerRef.current);
			maxDurationTimerRef.current = null;
		}
		if (silenceMonitorCleanupRef.current) {
			silenceMonitorCleanupRef.current();
			silenceMonitorCleanupRef.current = null;
		}
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => track.stop());
			mediaStreamRef.current = null;
		}
		mediaRecorderRef.current = null;
	}, []);
	const stopListening = (0, import_react.useCallback)(() => {
		const recorder = mediaRecorderRef.current;
		if (recorder && recorder.state !== "inactive") {
			try {
				recorder.stop();
			} catch {
				cleanupMediaResources();
				setIsListening(false);
			}
			return;
		}
		const instance = recognitionRef.current;
		if (instance) try {
			instance.stop();
		} catch {}
	}, [cleanupMediaResources]);
	const abortListening = (0, import_react.useCallback)(() => {
		cancelledRef.current = true;
		const recorder = mediaRecorderRef.current;
		if (recorder && recorder.state !== "inactive") try {
			recorder.stop();
		} catch {}
		cleanupMediaResources();
		const instance = recognitionRef.current;
		if (instance) {
			try {
				instance.abort();
			} catch {}
			recognitionRef.current = null;
		}
		setIsListening(false);
		setInterimTranscript("");
	}, [cleanupMediaResources]);
	const startWebSpeechFallback = (0, import_react.useCallback)(() => {
		const RecognitionCtor = getSpeechRecognitionConstructor();
		if (!RecognitionCtor) {
			setError("Voice input is not supported in this browser.");
			return;
		}
		if (recognitionRef.current) {
			try {
				recognitionRef.current.abort();
			} catch {}
			recognitionRef.current = null;
		}
		setError(null);
		setInterimTranscript("");
		lastFallbackTextRef.current = "";
		const recognition = new RecognitionCtor();
		recognition.lang = lang;
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.maxAlternatives = 1;
		recognition.onstart = () => {
			setIsListening(true);
		};
		recognition.onresult = (event) => {
			let finalChunk = "";
			let interimChunk = "";
			for (let i = event.resultIndex; i < event.results.length; i += 1) {
				const result = event.results[i];
				const text = result[0]?.transcript ?? "";
				if (result.isFinal) finalChunk += text;
				else interimChunk += text;
			}
			setInterimTranscript(interimChunk.trim());
			const cleanedFinal = finalChunk.trim();
			if (cleanedFinal && cleanedFinal !== lastFallbackTextRef.current) {
				lastFallbackTextRef.current = cleanedFinal;
				setInterimTranscript("");
				onFinalResultRef.current?.(cleanedFinal);
			}
		};
		recognition.onerror = (event) => {
			const friendly = mapSpeechError(event.error);
			if (friendly) setError(friendly);
			setIsListening(false);
			setInterimTranscript("");
		};
		recognition.onend = () => {
			setIsListening(false);
			setInterimTranscript("");
			recognitionRef.current = null;
		};
		recognitionRef.current = recognition;
		try {
			recognition.start();
		} catch {
			setError("Could not start microphone listening. Please try again.");
			setIsListening(false);
			recognitionRef.current = null;
		}
	}, [lang]);
	const startMediaRecorder = (0, import_react.useCallback)(async () => {
		if (transcribingRef.current) return;
		setError(null);
		setInterimTranscript("");
		cancelledRef.current = false;
		audioChunksRef.current = [];
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: {
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
				channelCount: 1
			} });
			if (cancelledRef.current) {
				stream.getTracks().forEach((t) => t.stop());
				return;
			}
			mediaStreamRef.current = stream;
			const mimeType = pickSupportedAudioMimeType();
			const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
			mediaRecorderRef.current = recorder;
			recorder.ondataavailable = (event) => {
				if (event.data && event.data.size > 0) audioChunksRef.current.push(event.data);
			};
			recorder.onstop = async () => {
				const recordedType = recorder.mimeType || mimeType || "audio/webm";
				const chunks = [...audioChunksRef.current];
				audioChunksRef.current = [];
				cleanupMediaResources();
				setIsListening(false);
				if (cancelledRef.current) {
					setInterimTranscript("");
					return;
				}
				const blob = new Blob(chunks, { type: recordedType });
				if (blob.size < 400) {
					setInterimTranscript("");
					setError("No speech was detected. Please tap the mic and speak clearly.");
					return;
				}
				transcribingRef.current = true;
				setIsTranscribing(true);
				const tryOfflineWhisper = async () => {
					if (!isOfflineAiPackInstalled()) return false;
					const offlineText = (await transcribeOfflineAudio(await decodeAudioBlobTo16kPcm(blob), lang === "en-IN" ? "english" : "bengali")).replace(/\[BLANK_AUDIO\]|\(music\)|\(silence\)/gi, "").trim();
					if (offlineText) {
						onFinalResultRef.current?.(offlineText);
						return true;
					}
					setError("কোনো কথা শোনা যায়নি। একটু জোরে ও স্পষ্ট করে আবার বলুন।");
					return true;
				};
				try {
					if (typeof navigator !== "undefined" && !navigator.onLine) {
						if (!await tryOfflineWhisper()) setError("অফলাইনে ভয়েস টাইপিংয়ের জন্য একবার \"Offline AI\" প্যাক (100 MB / 250 MB / 500 MB) ডাউনলোড করুন, অথবা লিখে প্রশ্ন করুন।");
						return;
					}
					const audioBase64 = await blobToBase64(blob);
					const response = await fetch("/api/transcribe", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							audioBase64,
							mimeType: recordedType,
							lang
						})
					});
					const data = await response.json();
					if (!response.ok) throw new Error(data.error || "Could not transcribe voice input.");
					const cleanText = (data.transcript ?? "").trim();
					if (!cleanText) setError("No speech was detected. Please speak a bit louder and try again.");
					else onFinalResultRef.current?.(cleanText);
				} catch (err) {
					try {
						if (await tryOfflineWhisper()) return;
					} catch {}
					setError(err instanceof Error ? err.message : "Voice transcription failed. Please try again.");
				} finally {
					transcribingRef.current = false;
					setIsTranscribing(false);
					setInterimTranscript("");
				}
			};
			if (!continuous && typeof AudioContext !== "undefined") try {
				const ctx = new AudioContext();
				const src = ctx.createMediaStreamSource(stream);
				const analyser = ctx.createAnalyser();
				analyser.fftSize = 1024;
				src.connect(analyser);
				const dataArray = new Uint8Array(analyser.fftSize);
				let heardSpeech = false;
				let silentSince = performance.now();
				const intervalId = window.setInterval(() => {
					if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
					analyser.getByteTimeDomainData(dataArray);
					let sum = 0;
					for (let i = 0; i < dataArray.length; i += 4) {
						const v = (dataArray[i] - 128) / 128;
						sum += v * v;
					}
					if (Math.sqrt(sum / (dataArray.length / 4)) > .025) {
						heardSpeech = true;
						silentSince = performance.now();
					} else if (heardSpeech && performance.now() - silentSince > 1500) stopListening();
				}, 150);
				silenceMonitorCleanupRef.current = () => {
					window.clearInterval(intervalId);
					try {
						src.disconnect();
					} catch {}
					if (ctx.state !== "closed") ctx.close().catch(() => {});
				};
			} catch {}
			recorder.start(250);
			setIsListening(true);
			maxDurationTimerRef.current = window.setTimeout(() => {
				stopListening();
			}, continuous ? 45e3 : 12e3);
		} catch (err) {
			cleanupMediaResources();
			setIsListening(false);
			setIsTranscribing(false);
			setInterimTranscript("");
			if (err instanceof Error && err.name === "NotAllowedError") setError("Microphone permission was denied. Please enable microphone access in your browser settings.");
			else startWebSpeechFallback();
		}
	}, [
		cleanupMediaResources,
		continuous,
		lang,
		startWebSpeechFallback,
		stopListening
	]);
	const startListening = (0, import_react.useCallback)(() => {
		if (canUseMediaRecorder()) startMediaRecorder();
		else startWebSpeechFallback();
	}, [startMediaRecorder, startWebSpeechFallback]);
	const toggleListening = (0, import_react.useCallback)(() => {
		if (isListening) stopListening();
		else startListening();
	}, [
		isListening,
		startListening,
		stopListening
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			abortListening();
		};
	}, [abortListening]);
	return {
		isSupported,
		isListening,
		isTranscribing,
		interimTranscript,
		lang,
		setLang,
		error,
		clearError: () => setError(null),
		startListening,
		stopListening,
		toggleListening
	};
}
// src/hooks/usePWAInstall.ts
function checkIsNativeApk() {
	if (typeof window === "undefined") return false;
	try {
		if (window.WbsecNative?.isNativeApp?.()) return true;
	} catch {}
	return (window.navigator.userAgent || "").includes("WbsecNativeApp");
}
function checkIsStandalone() {
	if (typeof window === "undefined") return false;
	return checkIsNativeApk() || window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: minimal-ui)").matches || window.navigator.standalone === true || document.referrer.startsWith("android-app://");
}
function checkIsInIframe() {
	if (typeof window === "undefined") return false;
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
function usePWAInstall() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined" && window.__wbsecDeferredInstallPrompt) return window.__wbsecDeferredInstallPrompt;
		return null;
	});
	const [isNativeApk, setIsNativeApk] = (0, import_react.useState)(() => checkIsNativeApk());
	const [isInstalled, setIsInstalled] = (0, import_react.useState)(() => checkIsStandalone());
	const [isIOS, setIsIOS] = (0, import_react.useState)(false);
	const [isInIframe, setIsInIframe] = (0, import_react.useState)(() => checkIsInIframe());
	const [isInstalling, setIsInstalling] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsNativeApk(checkIsNativeApk());
		setIsInstalled(checkIsStandalone());
		setIsInIframe(checkIsInIframe());
		const userAgent = window.navigator.userAgent.toLowerCase();
		const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
		setIsIOS(isIOSDevice);
		if (window.__wbsecDeferredInstallPrompt) setDeferredPrompt(window.__wbsecDeferredInstallPrompt);
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			const promptEvent = e;
			window.__wbsecDeferredInstallPrompt = promptEvent;
			setDeferredPrompt(promptEvent);
		};
		const handlePromptReady = () => {
			if (window.__wbsecDeferredInstallPrompt) setDeferredPrompt(window.__wbsecDeferredInstallPrompt);
		};
		const handleAppInstalled = () => {
			window.__wbsecDeferredInstallPrompt = null;
			setIsInstalled(true);
			setDeferredPrompt(null);
			setIsInstalling(false);
		};
		const mediaQuery = window.matchMedia("(display-mode: standalone)");
		const handleDisplayModeChange = (e) => {
			if (e.matches) {
				setIsInstalled(true);
				setDeferredPrompt(null);
			}
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("wbsec:installprompt-ready", handlePromptReady);
		window.addEventListener("appinstalled", handleAppInstalled);
		window.addEventListener("wbsec:appinstalled", handleAppInstalled);
		mediaQuery.addEventListener?.("change", handleDisplayModeChange);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("wbsec:installprompt-ready", handlePromptReady);
			window.removeEventListener("appinstalled", handleAppInstalled);
			window.removeEventListener("wbsec:appinstalled", handleAppInstalled);
			mediaQuery.removeEventListener?.("change", handleDisplayModeChange);
		};
	}, []);
	const install = (0, import_react.useCallback)(async () => {
		const promptEvent = deferredPrompt || window.__wbsecDeferredInstallPrompt || null;
		if (!promptEvent) return "unavailable";
		setIsInstalling(true);
		try {
			await promptEvent.prompt();
			const { outcome } = await promptEvent.userChoice;
			window.__wbsecDeferredInstallPrompt = null;
			setDeferredPrompt(null);
			if (outcome === "accepted") {
				setIsInstalled(true);
				return "accepted";
			}
			return "dismissed";
		} catch {
			window.__wbsecDeferredInstallPrompt = null;
			setDeferredPrompt(null);
			return "unavailable";
		} finally {
			setIsInstalling(false);
		}
	}, [deferredPrompt]);
	return {
		isInstallable: Boolean(deferredPrompt),
		isInstalled,
		isNativeApk,
		isIOS,
		isInIframe,
		isInstalling,
		install
	};
}
// src/hooks/useOnlineStatus.ts
function useOnlineStatus() {
	const [isOnline, setIsOnline] = (0, import_react.useState)(typeof navigator !== "undefined" ? navigator.onLine : true);
	(0, import_react.useEffect)(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);
	return isOnline;
}
// src/components/PWAInstallButton.tsx
var DIRECT_APP_URL = "https://ais-pre-gnsfryy7ffvuw7nefvpvq7-452431280303.asia-east1.run.app";
function sanitizeHttpsUrl(raw) {
	if (!raw || typeof raw !== "string") return "";
	const trimmed = raw.trim();
	if (!trimmed) return "";
	try {
		const parsed = new URL(trimmed);
		return parsed.protocol === "https:" ? parsed.toString() : "";
	} catch {
		return "";
	}
}
function PWAInstallButton({ apkDownloadUrl } = {}) {
	const { isNativeApk, isIOS, isInIframe } = usePWAInstall();
	const [showGuide, setShowGuide] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [apkMeta, setApkMeta] = (0, import_react.useState)({
		available: true,
		filename: "Wbsec.apk",
		packageName: "com.wbsec.aiteacher",
		versionName: "1.5.0",
		sizeMB: 14.7,
		downloadUrl: "/download/Wbsec.apk"
	});
	const [downloadStarted, setDownloadStarted] = (0, import_react.useState)(false);
	const customAdminApkUrl = (0, import_react.useMemo)(() => sanitizeHttpsUrl(apkDownloadUrl), [apkDownloadUrl]);
	const appOpenUrl = typeof window !== "undefined" && window.location.origin.startsWith("https://") && !isInIframe ? window.location.origin : DIRECT_APP_URL;
	const finalApkHref = customAdminApkUrl || (isInIframe ? `${DIRECT_APP_URL}/download/Wbsec.apk` : "/download/Wbsec.apk");
	(0, import_react.useEffect)(() => {
		if (!showGuide || customAdminApkUrl) return;
		let active = true;
		fetch("/api/apk-info", { cache: "no-store" }).then((res) => res.ok ? res.json() : null).then((data) => {
			if (active && data?.available) setApkMeta(data);
		}).catch(() => {});
		return () => {
			active = false;
		};
	}, [showGuide, customAdminApkUrl]);
	const handleShareOrCopy = async () => {
		if (isNativeApk && window.WbsecNative?.shareText) {
			window.WbsecNative.shareText("Wbsec — AI Teacher Android App", `Wbsec AI Teacher (WBBSE Class 5–10) সম্পূর্ণ নিজস্ব Android অ্যাপ ডাউনলোড করো: ${DIRECT_APP_URL}/download/Wbsec.apk`);
			return;
		}
		try {
			await navigator.clipboard.writeText(appOpenUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			try {
				const input = document.createElement("input");
				input.value = appOpenUrl;
				document.body.appendChild(input);
				input.select();
				document.execCommand("copy");
				document.body.removeChild(input);
				setCopied(true);
				setTimeout(() => setCopied(false), 2e3);
			} catch {}
		}
	};
	if (isNativeApk) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => void handleShareOrCopy(),
		className: "h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0",
		children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copied" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Share" })] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => {
				setDownloadStarted(false);
				setShowGuide(true);
			},
			className: "h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white hover:brightness-110 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Get APK" })]
		})
	}), showGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 dark:bg-slate-950/80 backdrop-blur-sm p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Download Wbsec Android APK",
		onClick: () => setShowGuide(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-md rounded-3xl bg-white dark:bg-[#0d1124] border border-slate-200 dark:border-white/15 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/pwa-192x192.png",
							alt: "Wbsec App Icon",
							width: 48,
							height: 48,
							className: "w-12 h-12 rounded-2xl shadow-md shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: "Wbsec Android App (.apk)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-emerald-700 dark:text-emerald-300 font-semibold",
							children: [
								apkMeta.sizeMB ? `${apkMeta.sizeMB} MB` : "15 MB",
								" · v",
								apkMeta.versionName || "1.5.0",
								" · সম্পূর্ণ নিজস্ব অ্যাপ"
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowGuide(false),
						"aria-label": "Close download dialog",
						className: "min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				!isIOS ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 shrink-0" }), "কোনো Google/Chrome বার বা Site settings থাকবে না"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-emerald-950/90 dark:text-emerald-100/90 leading-relaxed",
								children: [
									"এটি ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "~15 MB" }),
									"-এর সম্পূর্ণ স্বাধীন ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Android APK" }),
									" (Facebook/YouTube-এর মতো নিজস্ব অ্যাপ · Package: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "font-mono text-[11px]",
										children: "com.wbsec.aiteacher"
									}),
									")। সরাসরি ডাউনলোড করে ইনস্টল করো।"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: finalApkHref,
							download: "Wbsec.apk",
							target: isInIframe || Boolean(customAdminApkUrl) ? "_blank" : void 0,
							rel: isInIframe || Boolean(customAdminApkUrl) ? "noopener noreferrer" : void 0,
							onClick: () => setDownloadStarted(true),
							className: "w-full min-h-[46px] rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:brightness-110 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Wbsec.apk ডাউনলোড করো (",
								apkMeta.sizeMB ? `${apkMeta.sizeMB} MB` : "15 MB",
								")"
							] })]
						}),
						downloadStarted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center",
							children: "ডাউনলোড শুরু হয়েছে — নোটিফিকেশন বার বা Downloads ফোল্ডার থেকে Wbsec.apk ট্যাপ করে Install করুন!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "text-xs text-slate-700 dark:text-slate-200 space-y-1.5 list-decimal pl-5 leading-relaxed pt-1 border-t border-emerald-200/80 dark:border-emerald-800/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"উপরের ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Wbsec.apk ডাউনলোড করো" }),
									" বাটনে চাপ দাও (~15 MB ফাইল ডাউনলোড হবে)।"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"ডাউনলোড শেষে ফাইলটিতে ট্যাপ করে ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Install" }),
									" চাপো (প্রথমবার ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Install unknown apps" }),
									" চাইলে একবার ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Allow" }),
									" করে দাও)।"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"আগের ৩০০ KB শর্টকাট থাকলে সেটি Delete করে নতুন ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Wbsec" }),
									" অ্যাপ ব্যবহার করো!"
								] })
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4 shrink-0" }), "iPhone / iPad-এ অ্যাপ ইনস্টল করার নিয়ম:"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-decimal pl-5 leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"লিংকটি ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Safari" }),
							"-তে খুলো এবং নিচের ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Share (□↑)" }),
							" বাটনে চাপো।"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Add to Home Screen" }),
							" সিলেক্ট করে ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Add" }),
							" চাপো।"
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-slate-600 dark:text-slate-400",
						children: "ছাত্রদের WhatsApp-এ সরাসরি APK ডাউনলোড লিংক পাঠাও"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/30 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-800 dark:text-slate-200 truncate flex-1 font-mono",
							children: customAdminApkUrl || `${DIRECT_APP_URL}/download/Wbsec.apk`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const link = customAdminApkUrl || `${DIRECT_APP_URL}/download/Wbsec.apk`;
								navigator.clipboard?.writeText(link).then(() => {
									setCopied(true);
									setTimeout(() => setCopied(false), 2e3);
								}, () => void handleShareOrCopy());
							},
							className: "min-h-[34px] px-3 py-1 rounded-lg bg-[var(--app-accent)] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[var(--app-accent-hover)] transition-colors whitespace-nowrap shrink-0",
							children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), "Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), "Copy"] })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowGuide(false),
					className: "w-full min-h-[42px] rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-white/15 transition-colors",
					children: "বন্ধ করুন"
				})
			]
		})
	})] });
}
function OfflineIndicator() {
	if (useOnlineStatus()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		className: "fixed bottom-16 lg:bottom-3 left-3 z-40 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/95 border border-amber-300 dark:border-amber-800 px-3 py-1.5 text-xs font-medium text-amber-950 dark:text-amber-200 shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "অফলাইন মোড — রিচার্জ ছাড়াই পড়াশোনা চালু আছে" })]
	});
}
// src/offline/offlineKnowledge.ts
var OFFLINE_TEACHER_CACHE_KEY = "wbsec_offline_teacher_cache_v1";
var MAX_CACHED_ANSWERS = 150;
var OFFLINE_SUBJECTS = [
	{
		id: "history",
		label: "ইতিহাস"
	},
	{
		id: "physical_science",
		label: "ভৌত বিজ্ঞান"
	},
	{
		id: "life_science",
		label: "জীবন বিজ্ঞান"
	},
	{
		id: "geography",
		label: "ভূগোল"
	},
	{
		id: "math",
		label: "গণিত"
	},
	{
		id: "bengali",
		label: "বাংলা ব্যাকরণ ও রচনা"
	},
	{
		id: "english",
		label: "English Grammar"
	}
];
var OFFLINE_STUDY_TOPICS = [
	{
		id: "hist-plassey",
		subject: "history",
		subjectLabel: "ইতিহাস",
		classes: "Class 8–10",
		title: "পলাশীর যুদ্ধ (১৭৫৭) — কারণ ও ফলাফল",
		keywords: [
			"পলাশী",
			"পলাশীর যুদ্ধ",
			"plassey",
			"সিরাজ",
			"সিরাজউদ্দৌলা",
			"মীরজাফর",
			"১৭৫৭",
			"1757"
		],
		answer: `**পলাশীর যুদ্ধ (২৩শে জুন, ১৭৫৭)**

**ভূমিকা:**
১৭৫৭ সালের ২৩শে জুন নদিয়া জেলার ভাগীরথী নদীর তীরে পলাশীর প্রান্তরে বাংলার শেষ স্বাধীন নবাব **সিরাজউদ্দৌলা** ও ব্রিটিশ ইস্ট ইন্ডিয়া কোম্পানির (**রবার্ট ক্লাইভ**) মধ্যে ঐতিহাসিক পলাশীর যুদ্ধ সংঘটিত হয়।

**প্রধান কারণসমূহ:**
1. **দস্তকের অপব্যবহার:** ইংরেজ বণিকরা বিনা শুল্কে বাণিজ্যের ছাড়পত্র (দস্তক) ব্যক্তিগত ব্যবসায় অপব্যবহার করায় নবাবের রাজস্ব ক্ষতি হচ্ছিল।
2. **কলকাতায় দুর্গ নির্মাণ:** নবাবের অনুমতি ছাড়াই ইংরেজরা কলকাতায় ফোর্ট উইলিয়াম দুর্গের সংস্কার ও সামরিক প্রস্তুতি শুরু করে।
3. **নবাববিরোধী ষড়যন্ত্র:** নবাবের সেনাপতি **মীরজাফর**, ধনী বণিক জগৎশেঠ, উমিচাঁদ ও রায়দুর্লভ গোপনে ক্লাইভের সাথে হাত মেলান।

**যুদ্ধের ফলাফল ও গুরুত্ব:**
1. মীরজাফরের বিশ্বাসঘাতকতায় নবাব সিরাজউদ্দৌলা পরাজিত ও পরে নিহত হন; মীরমোহন ও মোহনলাল বীরত্বের সাথে যুদ্ধ করে প্রাণ দেন।
2. বাংলার স্বাধীনতার সূর্য অস্তমিত হয় এবং ভারতে **ব্রিটিশ শাসনের ভিত্তি** স্থাপিত হয়।
3. ইংরেজরা মীরজাফরকে নামেমাত্র নবাব করে বাংলার বিপুল সম্পদ লুণ্ঠন শুরু করে (পলাশীর লুণ্ঠন)।`
	},
	{
		id: "hist-buxar",
		subject: "history",
		subjectLabel: "ইতিহাস",
		classes: "Class 8–10",
		title: "বক্সারের যুদ্ধ (১৭৬৪) ও দেওয়ানি লাভ (১৭৬৫)",
		keywords: [
			"বক্সার",
			"বক্সারের যুদ্ধ",
			"buxar",
			"মীরকাশিম",
			"দেওয়ানি",
			"১৭৬৪",
			"১৭৬৫"
		],
		answer: `**বক্সারের যুদ্ধ (২২শে অক্টোবর, ১৭৬৪)**

**পক্ষসমূহ:**
একদিকে বাংলার নবাব **মীরকাশিম**, অযোধ্যার নবাব **সুজাউদ্দৌলা** ও মুঘল সম্রাট **দ্বিতীয় শাহ আলম**-এর সম্মিলিত বাহিনী; অন্যদিকে মেজর হেক্টর মুনরোর নেতৃত্বে ইংরেজ ইস্ট ইন্ডিয়া কোম্পানি।

**কারণ:**
- মীরকাশিম ইংরেজদের দস্তকের অপব্যবহার বন্ধ করতে দেশীয় বণিকদেরও শুল্ক মকুব করেন এবং রাজধানী মুর্শিদাবাদ থেকে মুঙ্গেরে সরিয়ে নেন। এতে ক্ষুব্ধ হয়ে ইংরেজরা যুদ্ধ ঘোষণা করে।

**ফলাফল:**
1. সম্মিলিত ভারতীয় বাহিনী ইংরেজদের কাছে পরাজিত হয়।
2. ১৭৬৫ সালে **এলাহাবাদের সন্ধি** স্বাক্ষরিত হয় এবং ইংরেজরা মুঘল সম্রাটের কাছ থেকে বাংলা, বিহার ও ওড়িশার **দেওয়ানি (রাজস্ব আদায়ের অধিকার)** লাভ করে।
3. এর ফলে বাংলায় **দ্বৈত শাসনব্যবস্থা** চালু হয় (যা ১৭৭২ সালে ওয়ারেন হেস্টিংস বাতিল করেন)।`
	},
	{
		id: "hist-1857",
		subject: "history",
		subjectLabel: "ইতিহাস",
		classes: "Class 8–10",
		title: "১৮৫৭ সালের মহাবিদ্রোহ (সিপাহী বিদ্রোহ)",
		keywords: [
			"মহাবিদ্রোহ",
			"সিপাহী বিদ্রোহ",
			"১৮৫৭",
			"1857",
			"মঙ্গল পাণ্ডে",
			"লক্ষ্মীবাঈ",
			"নানাসাহেব"
		],
		answer: `**১৮৫৭ সালের মহাবিদ্রোহ (সিপাহী বিদ্রোহ)**

**প্রত্যক্ষ কারণ:**
ইংরেজ সেনাবাহিনীতে নতুন **এনফিল্ড রাইফেলের** টোটা দাঁত দিয়ে কাটতে হতো। গুজব ছড়ায় যে তাতে গরু ও শূকরের চর্বি মেশানো আছে। ২৯শে মার্চ ১৮৫৭ ব্যারাকপুরে **মঙ্গল পাণ্ডে** প্রথম বিদ্রোহ ঘোষণা করেন।

**অন্যান্য কারণ:**
- **রাজনৈতিক:** লর্ড ডালহৌসির স্বত্ববিলোপ নীতি (ঝাঁসি, সাতারা, নাগপুর দখল)।
- **অর্থনৈতিক:** কৃষকদের ওপর চড়া ভূমি-রাজস্ব ও দেশীয় কুটির শিল্পের ধ্বংস।
- **সামরিক:** ভারতীয় সিপাহীদের কম বেতন ও পদোন্নতিতে বৈষম্য।

**প্রধান নেতৃবৃন্দ:**
- দিল্লি: বাহাদুর শাহ জাফর | কানপুর: নানাসাহেব ও তাঁতিয়া তোপি | ঝাঁসি: রানি লক্ষ্মীবাঈ | লখনউ: বেগম হজরত মহল | বিহার: কুনওয়ার সিং।

**ফলাফল:**
1. ১৮৫৮ সালে **মহারানির ঘোষণাপত্র** জারি হয় এবং ভারতে ইস্ট ইন্ডিয়া কোম্পানির শাসনের অবসান ঘটে সরাসরি **ব্রিটিশ ক্রাউনের** শাসন শুরু হয়।
2. স্বত্ববিলোপ নীতি বাতিল করা হয় এবং ভারতের গভর্নর-জেনারেলকে **ভাইসরয়** উপাধি দেওয়া হয় (প্রথম ভাইসরয়: লর্ড ক্যানিং)।`
	},
	{
		id: "hist-renaissance",
		subject: "history",
		subjectLabel: "ইতিহাস",
		classes: "Class 9–10",
		title: "বাংলার নবজাগরণ — রাজা রামমোহন রায় ও ঈশ্বরচন্দ্র বিদ্যাসাগর",
		keywords: [
			"নবজাগরণ",
			"রামমোহন",
			"বিদ্যাসাগর",
			"সতীদাহ",
			"বিধবাবিবাহ",
			"ব্রাহ্মসমাজ"
		],
		answer: `**উনিশ শতকে বাংলার নবজাগরণ ও সমাজ সংস্কার**

**১. রাজা রামমোহন রায় (ভারতের প্রথম আধুনিক মানুষ):**
- ১৮১৫ সালে **আত্মীয় সভা** এবং ১৮২৮ সালে **ব্রাহ্মসভা** (পরে ব্রাহ্মসমাজ) প্রতিষ্ঠা করেন।
- তাঁর নিরলস আন্দোলনেই ১৮২৯ সালে লর্ড উইলিয়াম বেন্টিঙ্ক আইন করে **সতীদাহ প্রথা** নিষিদ্ধ করেন।
- তিনি পাশ্চাত্য শিক্ষার প্রসার, সংবাদপত্রের স্বাধীনতা ও নারী অধিকারের পক্ষে সংগ্রাম করেন।

**২. ঈশ্বরচন্দ্র বিদ্যাসাগর:**
- নারীশিক্ষা প্রসারে বাংলায় ৩৫টি বালিকা বিদ্যালয় স্থাপন করেন এবং বেথুন স্কুলের সম্পাদক হিসেবে কাজ করেন।
- তাঁর প্রচেষ্টাতেই ১৮৫৬ সালে লর্ড ডালহৌসি **বিধবাবিবাহ আইন** পাস করেন।
- বাংলা গদ্যের জনক হিসেবে তিনি **বর্ণপরিচয়**, কথামালা, বোধোদয় প্রভৃতি গ্রন্থ রচনা করেন।`
	},
	{
		id: "phy-newton",
		subject: "physical_science",
		subjectLabel: "ভৌত বিজ্ঞান",
		classes: "Class 7–9",
		title: "নিউটনের গতির তিনটি সূত্র ও উদাহরণ",
		keywords: [
			"নিউটন",
			"গতির সূত্র",
			"newton",
			"জড়তা",
			"ভরবেগ",
			"তৃতীয় সূত্র",
			"f=ma"
		],
		answer: `**নিউটনের গতির তিনটি সূত্র**

**১. প্রথম সূত্র (জড়তার সূত্র):**
বাইরে থেকে কোনো বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং সচল বস্তু চিরকাল সমবেগে সরলরেখায় চলতে থাকবে।
- *উদাহরণ:* চলন্ত বাস হঠাৎ ব্রেক কষলে যাত্রীরা গতিজড়তার কারণে সামনের দিকে ঝুঁকে পড়েন।

**২. দ্বিতীয় সূত্র (বলের পরিমাপ):**
কোনো বস্তুর ভরবেগের পরিবর্তনের হার বস্তুটির ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে ভরবেগের পরিবর্তনও সেদিকে ঘটে।
- *গাণিতিক রূপ:* **F = m × a** (বল = ভর × ত্বরণ)। SI একক: **নিউটন (N)**।

**৩. তৃতীয় সূত্র (ক্রিয়া-প্রতিক্রিয়া সূত্র):**
প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীতমুখী প্রতিক্রিয়া আছে।
- *উদাহরণ:* নৌকা থেকে লাফিয়ে পাড়ে নামার সময় নৌকা পিছনে সরে যায়; রকেট জ্বালানি গ্যাস নিচে ছুড়ে ওপরের দিকে ওঠে।`
	},
	{
		id: "phy-ohm",
		subject: "physical_science",
		subjectLabel: "ভৌত বিজ্ঞান",
		classes: "Class 10",
		title: "ওহমের সূত্র, রোধ ও তড়িৎ ক্ষমতা (Ohm’s Law)",
		keywords: [
			"ওহম",
			"ওহমের সূত্র",
			"ohm",
			"রোধ",
			"ভোল্ট",
			"অ্যাম্পিয়ার",
			"v=ir",
			"তড়িৎ"
		],
		answer: `**ওহমের সূত্র (Ohm’s Law)**

**সূত্র:** উষ্ণতা ও অন্যান্য ভৌত অবস্থা অপরিবর্তিত থাকলে কোনো পরিবাহীর মধ্য দিয়ে তড়িৎপ্রবাহ মাত্রা (I) ওই পরিবাহীর দুই প্রান্তের বিভবপ্রভেদের (V) সমানুপাতিক।

**গাণিতিক রূপ:**
- **V = I × R**
- এখানে: **V** = বিভবপ্রভেদ (একক: ভোল্ট, V), **I** = তড়িৎপ্রবাহ মাত্রা (একক: অ্যাম্পিয়ার, A), **R** = পরিবাহীর রোধ (একক: ওহম, Ω)।

**রোধের সমবায়:**
1. **শ্রেণি সমবায়:** R = R₁ + R₂ + R₃ (তুল্য রোধ বাড়ে)।
2. **সমান্তরাল সমবায়:** 1/R = 1/R₁ + 1/R₂ + 1/R₃ (বাড়ির ওয়্যারিংয়ে ব্যবহৃত হয়)।

**তড়িৎ ক্ষমতা ও BOT ইউনিট:**
- ক্ষমতা **P = V × I = I²R = V²/R** (একক: ওয়াট, W)।
- **1 BOT (Unit) = 1 kWh = 1000 ওয়াট × 1 ঘণ্টা**।`
	},
	{
		id: "phy-boyle-charles",
		subject: "physical_science",
		subjectLabel: "ভৌত বিজ্ঞান",
		classes: "Class 10",
		title: "বয়েল ও চার্লসের সূত্র এবং আদর্শ গ্যাস সমীকরণ",
		keywords: [
			"বয়েল",
			"চার্লস",
			"আদর্শ গ্যাস",
			"pv=nrt",
			"boyle",
			"charles",
			"গ্যাস"
		],
		answer: `**গ্যাসের আচরণ — বয়েল ও চার্লসের সূত্র**

**১. বয়েলের সূত্র (স্থির উষ্ণতায়):**
স্থির উষ্ণতায় নির্দিষ্ট ভরের কোনো গ্যাসের আয়তন (V) ওই গ্যাসের চাপের (P) সাথে ব্যস্তানুপাতে পরিবর্তিত হয়।
- **P₁V₁ = P₂V₂ = ধ্রুবক**

**২. চার্লসের সূত্র (স্থির চাপে):**
স্থির চাপে নির্দিষ্ট ভরের কোনো গ্যাসের আয়তন প্রতি 1°C উষ্ণতা বৃদ্ধি বা হ্রাসে 0°C উষ্ণতায় তার আয়তনের 1/273 অংশ বৃদ্ধি বা হ্রাস পায়।
- পরম স্কেলে (কেলভিন, T): **V₁ / T₁ = V₂ / T₂** (যেখানে T = t + 273 K এবং পরম শূন্য উষ্ণতা = -273°C বা 0 K)।

**৩. আদর্শ গ্যাস সমীকরণ:**
- **PV = nRT**
- এখানে n = মোল সংখ্যা, R = সর্বজনীন গ্যাস ধ্রুবক (8.314 J·mol⁻¹·K⁻¹)।`
	},
	{
		id: "phy-light",
		subject: "physical_science",
		subjectLabel: "ভৌত বিজ্ঞান",
		classes: "Class 8–10",
		title: "আলোর প্রতিফলন, প্রতিসরণ ও লেন্স",
		keywords: [
			"আলো",
			"প্রতিফলন",
			"প্রতিসরণ",
			"লেন্স",
			"উত্তল",
			"অবতল",
			"স্নেল",
			"light"
		],
		answer: `**আলোর প্রতিফলন ও প্রতিসরণ**

**১. আলোর প্রতিফলনের সূত্র:**
- আপতিত রশ্মি, প্রতিফলিত রশ্মি ও অভিলম্ব একই সমতলে থাকে।
- আপতন কোণ (i) = প্রতিফলন কোণ (r)।

**২. আলোর প্রতিসরণ ও স্নেলের সূত্র:**
আলো এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে তির্যকভাবে প্রবেশ করলে তার দিক পরিবর্তিত হয়।
- **স্নেলের সূত্র:** sin i / sin r = μ (প্রতিসরাঙ্ক, ধ্রুবক)।

**৩. উত্তল ও অবতল লেন্সের ব্যবহার:**
- **উত্তল লেন্স (অভিসারী):** দীর্ঘদৃষ্টি (Hypermetropia) দূর করতে, বিবর্ধক কাচে ও ক্যামেরায় ব্যবহৃত হয়।
- **অবতল লেন্স (অপসারী):** হ্রস্বদৃষ্টি (Myopia) বা দূরের জিনিস ঝাপসা দেখা দূর করতে চশমায় ব্যবহৃত হয়।`
	},
	{
		id: "phy-acid-base",
		subject: "physical_science",
		subjectLabel: "ভৌত বিজ্ঞান",
		classes: "Class 7–10",
		title: "অ্যাসিড, ক্ষার, লবণ ও pH স্কেল",
		keywords: [
			"অ্যাসিড",
			"ক্ষার",
			"লবণ",
			"ph",
			"acid",
			"base",
			"প্রশমন"
		],
		answer: `**অ্যাসিড, ক্ষার ও লবণ**

**১. অ্যাসিড (Acid):**
- জলীয় দ্রবণে **H⁺ আয়ন** উৎপন্ন করে, স্বাদে টক এবং **নীল লিটমাসকে লাল** করে।
- উদাহরণ: হাইড্রোক্লোরিক অ্যাসিড (HCl), সালফিউরিক অ্যাসিড (H₂SO₄), নাইট্রিক অ্যাসিড (HNO₃)।

**২. ক্ষার (Base / Alkali):**
- জলীয় দ্রবণে **OH⁻ আয়ন** উৎপন্ন করে, স্বাদে কষা/তিক্ত এবং **লাল লিটমাসকে নীল** করে।
- উদাহরণ: সোডিয়াম হাইড্রক্সাইড (NaOH), পটাশিয়াম হাইড্রক্সাইড (KOH)।

**৩. প্রশমন বিক্রিয়া:**
অ্যাসিড + ক্ষার → লবণ + জল।
- উদাহরণ: **HCl + NaOH → NaCl + H₂O**

**৪. pH স্কেল (0 থেকে 14):**
- pH < 7 → আম্লিক (Acidic)
- pH = 7 → প্রশম (যেমন বিশুদ্ধ জল)
- pH > 7 → ক্ষারীয় (Basic)`
	},
	{
		id: "bio-photosynthesis",
		subject: "life_science",
		subjectLabel: "জীবন বিজ্ঞান",
		classes: "Class 7–10",
		title: "সালোকসংশ্লেষ (Photosynthesis) — ধাপ, সমীকরণ ও গুরুত্ব",
		keywords: [
			"সালোকসংশ্লেষ",
			"photosynthesis",
			"ক্লোরোফিল",
			"অক্সিজেন",
			"গ্লুকোজ",
			"উদ্ভিদ"
		],
		answer: `**সালোকসংশ্লেষ (Photosynthesis)**

**সংজ্ঞা:**
যে শারীরবৃত্তীয় প্রক্রিয়ায় সবুজ উদ্ভিদ সূর্যালোক ও **ক্লোরোফিলের** উপস্থিতিতে মাটি থেকে শোষিত জল (H₂O) এবং বায়ুমণ্ডলের কার্বন ডাই-অক্সাইড (CO₂)-এর রাসায়নিক বিক্রিয়ায় **গ্লুকোজ (C₆H₁₂O₆)** জাতীয় খাদ্য তৈরি করে এবং উপজাত হিসেবে **অক্সিজেন (O₂)** ত্যাগ করে, তাকে সালোকসংশ্লেষ বলে।

**রাসায়নিক সমীকরণ:**
**6CO₂ + 12H₂O —(সূর্যালোক ও ক্লোরোফিল)→ C₆H₁₂O₆ + 6O₂↑ + 6H₂O**

**প্রধান দুটি দশা:**
1. **আলোক দশা (Light Phase):** ক্লোরোপ্লাস্টের **গ্রানা** অঞ্চলে ঘটে। সূর্যালোকের সাহায্যে জলের ফটোলাইসিস হয়ে অক্সিজেন মুক্ত হয় এবং ATP ও NADPH তৈরি হয়।
2. **অন্ধকার দশা (Dark Phase / কেলভিন চক্র):** ক্লোরোপ্লাস্টের **স্ট্রোমা** অঞ্চলে ঘটে। এতে CO₂ বিজারিত হয়ে গ্লুকোজ তৈরি হয়।

**গুরুত্ব:**
- পৃথিবীর সমস্ত জীবের জন্য প্রত্যক্ষ বা পরোক্ষ খাদ্য ও শক্তি জোগান দেয়।
- বায়ুমণ্ডলে অক্সিজেন (O₂) ও কার্বন ডাই-অক্সাইড (CO₂)-এর ভারসাম্য বজায় রাখে।`
	},
	{
		id: "bio-cell",
		subject: "life_science",
		subjectLabel: "জীবন বিজ্ঞান",
		classes: "Class 8–10",
		title: "কোষ বিভাজন — মাইটোসিস ও মিয়োসিসের পার্থক্য",
		keywords: [
			"কোষ",
			"মাইটোসিস",
			"মিয়োসিস",
			"mitosis",
			"meiosis",
			"ক্রোমোজোম",
			"কোষ বিভাজন"
		],
		answer: `**কোষ বিভাজন — মাইটোসিস ও মিয়োসিস**

**১. মাইটোসিস (সমবিভাজন):**
- দেহকোষে ঘটে।
- একটি মাতৃকোষ (2n) বিভাজিত হয়ে **২টি সমান অপত্য কোষ (2n)** তৈরি করে।
- ক্রোমোজোম সংখ্যা অপরিবর্তিত থাকে।
- **দশাগুলি:** প্রোফেজ → মেটাফেজ → অ্যানাফেজ → টেলোফেজ (এরপর সাইটোকাইনেসিস)।
- **গুরুত্ব:** জীবদেহের বৃদ্ধি ও ক্ষয়পূরণ ঘটায়।

**২. মিয়োসিস (হ্রাস বিভাজন):**
- জনন মাতৃকোষে (শুক্রাশয় ও ডিম্বাশয়ে) ঘটে।
- একটি মাতৃকোষ (2n) বিভাজিত হয়ে **৪টি হ্যাপ্লয়েড অপত্য কোষ (n)** তৈরি করে।
- ক্রোমোজোম সংখ্যা অর্ধেক হয়ে যায় এবং **ক্রসিং ওভার** ঘটে, ফলে নতুন বৈশিষ্ট্য ও প্রকরণ সৃষ্টি হয়।`
	},
	{
		id: "bio-nervous",
		subject: "life_science",
		subjectLabel: "জীবন বিজ্ঞান",
		classes: "Class 10",
		title: "স্নায়ুতন্ত্র, নিউরন ও প্রতিবর্ত ক্রিয়া (Reflex Action)",
		keywords: [
			"স্নায়ু",
			"নিউরন",
			"প্রতিবর্ত",
			"মস্তিষ্ক",
			"হরমোন",
			"reflex",
			"neuron"
		],
		answer: `**স্নায়ুতন্ত্র ও প্রতিবর্ত ক্রিয়া**

**১. নিউরন (স্নায়ুতন্ত্রের গঠনগত ও কার্যগত একক):**
- প্রধান দুটি অংশ: **কোষদেহ (Cell body)** এবং **প্রবর্ধক (ডেনড্রন ও অ্যাক্সন)**।
- দুটি নিউরনের সংযোগস্থলকে **সাইন্যাপ্স (প্রান্তসন্নিকর্ষ)** বলে।

**২. প্রতিবর্ত ক্রিয়া (Reflex Action):**
বাহ্যিক উদ্দীপনার প্রভাবে মস্তিষ্কের সরাসরি নির্দেশ ছাড়াই **সুষুম্নাকাণ্ড** দ্বারা নিয়ন্ত্রিত স্বতঃস্ফূর্ত ও তাৎক্ষণিক প্রতিক্রিয়াকে প্রতিবর্ত ক্রিয়া বলে।
- *উদাহরণ:* গরম বস্তুতে হাত লাগলে সাথে সাথে হাত সরিয়ে নেওয়া; চোখে হঠাৎ আলো পড়লে চোখের পাতা বন্ধ হয়ে যাওয়া।
- *প্রতিবর্ত পথ:* গ্রাহক → সংজ্ঞাবহ স্নায়ু → সুষুম্নাকাণ্ড → আজ্ঞাবহ স্নায়ু → কারক (পেশি)।`
	},
	{
		id: "bio-genetics",
		subject: "life_science",
		subjectLabel: "জীবন বিজ্ঞান",
		classes: "Class 10",
		title: "মেন্ডেলের বংশগতির সূত্র (একসংকর ও দ্বিসংকর জনন)",
		keywords: [
			"মেন্ডেল",
			"বংশগতি",
			"একসংকর",
			"দ্বিসংকর",
			"জিন",
			"mendel",
			"genetics"
		],
		answer: `**মেন্ডেলের বংশগতির সূত্র**

গ্রেগর জোহান মেন্ডেলকে **বংশগতিবিদ্যার জনক** বলা হয়। তিনি মটরগাছ (Pisum sativum) নিয়ে পরীক্ষা করেন।

**১. একসংকর জনন (Monohybrid Cross) — পৃথকীভবনের সূত্র:**
একজোড়া বিপরীত বৈশিষ্ট্যের (যেমন বিশুদ্ধ লম্বা TT × বিশুদ্ধ বেঁটে tt) মধ্যে সংকরায়ণ।
- F₁ জনুতে সব গাছ সংকর লম্বা (Tt) হয়।
- F₂ জনুতে **ফিনোটাইপ অনুপাত = 3 : 1** (৩টি লম্বা : ১টি বেঁটে) এবং **জিনোটাইপ অনুপাত = 1 : 2 : 1** (TT : Tt : tt)।

**২. দ্বিসংকর জনন (Dihybrid Cross) — স্বাধীন বিন্যাসের সূত্র:**
দুইজোড়া বিপরীত বৈশিষ্ট্যের (হলুদ-গোল × সবুজ-কুঞ্চিত) মধ্যে সংকরায়ণ।
- F₂ জনুতে **ফিনোটাইপ অনুপাত = 9 : 3 : 3 : 1**।`
	},
	{
		id: "geo-river",
		subject: "geography",
		subjectLabel: "ভূগোল",
		classes: "Class 8–10",
		title: "নদীর কাজ — ক্ষয়, বহন ও সঞ্চয়জাত ভূমিরূপ",
		keywords: [
			"নদী",
			"বদ্বীপ",
			"জলপ্রপাত",
			"গিরিখাত",
			"প্লাবনভূমি",
			"ভূগোল",
			"river"
		],
		answer: `**নদীর তিন প্রবাহ ও প্রধান ভূমিরূপ**

**১. উচ্চগতি (ক্ষয়কাজ প্রধান):**
পর্বতের খাড়া ঢালে নদীর স্রোত প্রবল থাকায় নিম্নক্ষয় বেশি হয়।
- *ভূমিরূপ:* V-আকৃতির উপত্যকা, **গিরিখাত ও ক্যানিয়ন**, জলপ্রপাত (যেমন জোগ জলপ্রপাত), মন্থকূপ।

**২. মধ্যগতি (বহন ও পার্শ্বক্ষয় প্রধান):**
সমভূমিতে ঢাল কমে যাওয়ায় নদী এঁকেবেঁকে চলে।
- *ভূমিরূপ:* নদীবাঁক (মিয়েন্ডার), অশ্বক্ষুরাকৃতি হ্রদ, প্লাবনভূমি ও পলল শঙ্কু।

**৩. নিম্নগতি (সঞ্চয়কাজ প্রধান):**
মোহনার কাছে নদীর গতিবেগ খুব কমে যায় এবং পলি জমা হয়।
- *ভূমিরূপ:* **বদ্বীপ (Delta)** (যেমন গঙ্গা-ব্রহ্মপুত্রের সুন্দরবন পৃথিবীর বৃহত্তম বদ্বীপ), খাঁড়ি ও স্বাভাবিক বাঁধ।`
	},
	{
		id: "geo-wb",
		subject: "geography",
		subjectLabel: "ভূগোল",
		classes: "Class 7–10",
		title: "পশ্চিমবঙ্গের ভূ-প্রকৃতি, নদ-নদী ও জলবায়ু",
		keywords: [
			"পশ্চিমবঙ্গ",
			"সুন্দরবন",
			"গঙ্গা",
			"তিস্তা",
			"দামোদর",
			"মৌসুমি",
			"west bengal"
		],
		answer: `**পশ্চিমবঙ্গের ভূগোল (সংক্ষিপ্ত নোটস)**

**১. ভূ-প্রাকৃতিক বিভাগ:**
- **উত্তরের পার্বত্য অঞ্চল:** দার্জিলিং ও কালিম্পং (সর্বোচ্চ শৃঙ্গ: **সান্দাকফু**, ৩৬৩৬ মিটার)।
- **পশ্চিমের মালভূমি অঞ্চল:** পুরুলিয়া, বাঁকুড়া, পশ্চিম মেদিনীপুর (সর্বোচ্চ শৃঙ্গ: গোরগাবুরু, অযোধ্যা পাহাড়)।
- **সমভূমি অঞ্চল:** তরাই-ডুয়ার্স, রাঢ় সমভূমি, গাঙ্গেয় বদ্বীপ ও সুন্দরবন অঞ্চল।

**২. প্রধান নদ-নদী:**
- **উত্তরবঙ্গের বরফগলা নদী:** তিস্তা, তোর্সা, জলঢাকা, মহানন্দা।
- **দক্ষিণবঙ্গের প্রধান নদী:** ভাগীরথী-হুগলি, দামোদর, অজয়, ময়ূরাক্ষী, কংসাবতী, রূপনারায়ণ।
- **সুন্দরবনের জোয়ার-ভাটার নদী:** মাতলা, বিদ্যাধরী, গোসাবা, রায়মঙ্গল।

**৩. জলবায়ু:** ক্রান্তীয় মৌসুমি জলবায়ু (গ্রীষ্মকালে **কালবৈশাখী** ও বর্ষায় দক্ষিণ-পশ্চিম মৌসুমি বায়ুর প্রভাবে প্রচুর বৃষ্টি হয়)।`
	},
	{
		id: "geo-atmosphere",
		subject: "geography",
		subjectLabel: "ভূগোল",
		classes: "Class 9–10",
		title: "বায়ুমণ্ডলের স্তরবিন্যাস ও বিশ্ব উষ্ণায়ন",
		keywords: [
			"বায়ুমণ্ডল",
			"ট্রপোস্ফিয়ার",
			"স্ট্র্যাটোস্ফিয়ার",
			"ওজোন",
			"বিশ্ব উষ্ণায়ন",
			"গ্রিনহাউস"
		],
		answer: `**বায়ুমণ্ডলের প্রধান স্তরসমূহ**

1. **ট্রপোস্ফিয়ার (০–১৮ কিমি):** সর্বনিম্ন স্তর; মেঘ, বৃষ্টি, ঝড়-বজ্রপাত এখানেই ঘটে বলে একে **ক্ষুব্ধমণ্ডল** বলে। প্রতি ১ কিমি উচ্চতায় তাপমাত্রা ৬.৪°C কমে।
2. **স্ট্র্যাটোস্ফিয়ার (১৮–৫০ কিমি):** শান্ত স্তর (**শান্তমণ্ডল**), জেট বিমান চলাচল করে। এই স্তরেই **ওজোন স্তর (O₃)** থাকে যা সূর্যের ক্ষতিকর অতিবেগুনি রশ্মি শোষণ করে।
3. **মেসোস্ফিয়ার (৫০–৮০ কিমি):** সবচেয়ে শীতলতম স্তর; মহাকাশ থেকে আসা উল্কা এখানে পুড়ে ছাই হয়।
4. **থার্মোস্ফিয়ার / আয়নোস্ফিয়ার (৮০–৫০০ কিমি):** বেতার তরঙ্গ প্রতিফলিত হয় এবং মেরুজ্যোতি (Aurora) দেখা যায়।

**বিশ্ব উষ্ণায়ন (Global Warming):**
CO₂, CH₄, CFC প্রভৃতি গ্রিনহাউস গ্যাস বৃদ্ধির ফলে পৃথিবীর গড় তাপমাত্রা বাড়ছে। এর ফলে মেরু অঞ্চলের বরফ গলে সমুদ্রের জলতল বাড়ছে।`
	},
	{
		id: "math-algebra",
		subject: "math",
		subjectLabel: "গণিত",
		classes: "Class 7–10",
		title: "বীজগণিতের সমস্ত প্রয়োজনীয় সূত্র (Algebra Formulas)",
		keywords: [
			"বীজগণিত",
			"সূত্র",
			"algebra",
			"formula",
			"বর্গ",
			"ঘন",
			"উৎপাদক",
			"শ্রীধর আচার্য"
		],
		answer: `**বীজগণিতের প্রয়োজনীয় সূত্রাবলি**

**বর্গের সূত্র (Square Formulas):**
1. (a + b)² = a² + 2ab + b²
2. (a - b)² = a² - 2ab + b²
3. a² - b² = (a + b)(a - b)
4. a² + b² = (a + b)² - 2ab = (a - b)² + 2ab
5. 4ab = (a + b)² - (a - b)²
6. (a + b + c)² = a² + b² + c² + 2(ab + bc + ca)

**ঘনের সূত্র (Cube Formulas):**
7. (a + b)³ = a³ + 3a²b + 3ab² + b³ = a³ + b³ + 3ab(a + b)
8. (a - b)³ = a³ - 3a²b + 3ab² - b³ = a³ - b³ - 3ab(a - b)
9. a³ + b³ = (a + b)(a² - ab + b²)
10. a³ - b³ = (a - b)(a² + ab + b²)

**দ্বিঘাত সমীকরণ (শ্রীধর আচার্যের সূত্র):**
ax² + bx + c = 0 হলে:
**x = (-b ± √(b² - 4ac)) / 2a**
*(অফলাইনে সমাধান পেতে চ্যাটে সরাসরি লিখুন যেমন: \`x^2 - 5x + 6 = 0\`)*`
	},
	{
		id: "math-mensuration",
		subject: "math",
		subjectLabel: "গণিত",
		classes: "Class 8–10",
		title: "পরিমিতি — ক্ষেত্রফল ও আয়তনের সূত্র (Mensuration)",
		keywords: [
			"পরিমিতি",
			"ক্ষেত্রফল",
			"আয়তন",
			"বৃত্ত",
			"গোলক",
			"শঙ্কু",
			"চোঙ",
			"ঘনক",
			"mensuration"
		],
		answer: `**পরিমিতির গুরুত্বপূর্ণ সূত্রাবলি (π ≈ 22/7 বা 3.1416)**

**দ্বিমাত্রিক চিত্র:**
- **আয়তক্ষেত্র:** ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ | পরিসীমা = 2(দৈর্ঘ্য + প্রস্থ)
- **বর্গক্ষেত্র:** ক্ষেত্রফল = বাহু² | কর্ণ = বাহু × √2
- **ত্রিভুজ:** ক্ষেত্রফল = ½ × ভূমি × উচ্চতা | সমবাহু ত্রিভুজ = (√3 / 4) × বাহু²
- **বৃত্ত:** পরিধি = 2πr | ক্ষেত্রফল = πr²

**ত্রিমাত্রিক ঘনবস্তু:**
- **আয়তঘন:** আয়তন = l × b × h | সমগ্রতলের ক্ষেত্রফল = 2(lb + bh + hl)
- **ঘনক:** আয়তন = a³ | সমগ্রতল = 6a² | কর্ণ = a√3
- **লম্ব বৃত্তাকার চোঙ (Cylinder):** আয়তন = πr²h | বক্রতল = 2πrh
- **লম্ব বৃত্তাকার শঙ্কু (Cone):** আয়তন = ⅓πr²h | বক্রতল = πrl (যেখানে l = √(r² + h²))
- **গোলক (Sphere):** আয়তন = (4/3)πr³ | সমগ্রতল = 4πr²`
	},
	{
		id: "math-trig",
		subject: "math",
		subjectLabel: "গণিত",
		classes: "Class 10",
		title: "ত্রিকোণমিতি — সূত্র ও আদর্শ কোণের মান (0° থেকে 90°)",
		keywords: [
			"ত্রিকোণমিতি",
			"trigonometry",
			"sin",
			"cos",
			"tan",
			"পিথাগোরাস"
		],
		answer: `**ত্রিকোণমিতির মৌলিক সূত্র (Class 10 WBBSE)**

**অনুপাত (সমকোণী ত্রিভুজে):**
- sin θ = লম্ব / অতিভুজ | cosec θ = 1 / sin θ
- cos θ = ভূমি / অতিভুজ | sec θ = 1 / cos θ
- tan θ = লম্ব / ভূমি = sin θ / cos θ | cot θ = 1 / tan θ

**তিনটি অভেদ (Identities):**
1. **sin²θ + cos²θ = 1**
2. **sec²θ - tan²θ = 1**
3. **cosec²θ - cot²θ = 1**

**আদর্শ কোণের মান:**
- **0°:** sin = 0, cos = 1, tan = 0
- **30°:** sin = 1/2, cos = √3/2, tan = 1/√3
- **45°:** sin = 1/√2, cos = 1/√2, tan = 1
- **60°:** sin = √3/2, cos = 1/2, tan = √3
- **90°:** sin = 1, cos = 0, tan = অসংজ্ঞাত`
	},
	{
		id: "math-interest",
		subject: "math",
		subjectLabel: "গণিত",
		classes: "Class 8–10",
		title: "সরল সুদ, চক্রবৃদ্ধি সুদ ও লাভ-ক্ষতির সূত্র",
		keywords: [
			"সরল সুদ",
			"চক্রবৃদ্ধি",
			"সুদকষা",
			"লাভ ক্ষতি",
			"শতকরা",
			"interest",
			"profit"
		],
		answer: `**পাটিগণিতের প্রয়োজনীয় সূত্রাবলি**

**১. সরল সুদ (Simple Interest):**
- **I = (P × r × t) / 100**
- সুদ-আসল (A) = P + I
*(P = আসল, r = বার্ষিক সুদের হার %, t = সময় বছর)*

**২. চক্রবৃদ্ধি সুদ (Compound Interest):**
- সমূল চক্রবৃদ্ধি: **A = P(1 + r/100)ⁿ**
- চক্রবৃদ্ধি সুদ = A - P

**৩. লাভ ও ক্ষতি:**
- লাভ = বিক্রয়মূল্য - ক্রয়মূল্য | শতকরা লাভ = (লাভ / ক্রয়মূল্য) × 100
- ক্ষতি = ক্রয়মূল্য - বিক্রয়মূল্য | শতকরা ক্ষতি = (ক্ষতি / ক্রয়মূল্য) × 100`
	},
	{
		id: "ben-karok",
		subject: "bengali",
		subjectLabel: "বাংলা ব্যাকরণ ও রচনা",
		classes: "Class 7–10",
		title: "বাংলা কারক ও বিভক্তি (সহজ চেনার উপায়)",
		keywords: [
			"কারক",
			"বিভক্তি",
			"কর্তৃকারক",
			"কর্মকারক",
			"করণ",
			"অপাদান",
			"অধিকরণ",
			"ব্যাকরণ"
		],
		answer: `**কারক ও বিভক্তি — সহজ মনে রাখার কৌশল**

ক্রিয়াপদকে নিচের প্রশ্নগুলো করলে সহজেই ৬ প্রকার কারক চেনা যায়:

1. **কর্তৃকারক:** ক্রিয়াকে **"কে / কারা"** দিয়ে প্রশ্ন করলে।
   - *উদাহরণ:* **রাম** বই পড়ে। (কে পড়ে? → রাম)
2. **কর্মকারক:** ক্রিয়াকে **"কী / কাকে"** দিয়ে প্রশ্ন করলে।
   - *উদাহরণ:* রাম **বই** পড়ে। (কী পড়ে? → বই)
3. **করণ কারক:** ক্রিয়াকে **"কীসের দ্বারা / কী দিয়ে"** প্রশ্ন করলে।
   - *উদাহরণ:* আমি **কলম দিয়ে** লিখি। (কী দিয়ে? → কলম)
4. **নিমিত্ত কারক:** ক্রিয়াকে **"কীসের জন্য / কার জন্য"** প্রশ্ন করলে।
   - *উদাহরণ:* **বেলা পড়ে এল, জলে** চল। / **তৃষ্ণার্তকে** জল দাও।
5. **অপাদান কারক:** **"কোথা থেকে"** বিচ্যুত, ভীত বা উৎপন্ন হলে।
   - *উদাহরণ:* **গাছ থেকে** পাতা পড়ে। / **তিল থেকে** তেল হয়।
6. **অধিকরণ কারক:** **"কোথায় / কখন"** (স্থান বা সময়) বোঝালে।
   - *উদাহরণ:* **আকাশে** পাখি ওড়ে। / **সকালে** সূর্য ওঠে।`
	},
	{
		id: "ben-samas",
		subject: "bengali",
		subjectLabel: "বাংলা ব্যাকরণ ও রচনা",
		classes: "Class 8–10",
		title: "সমাস — প্রকারভেদ ও মাধ্যমিকের গুরুত্বপূর্ণ উদাহরণ",
		keywords: [
			"সমাস",
			"দ্বন্দ্ব",
			"কর্মধারয়",
			"তৎপুরুষ",
			"বহুব্রীহি",
			"দ্বিগু",
			"অব্যয়ীভাব"
		],
		answer: `**সমাস ও তার প্রধান ৬টি প্রকারভেদ**

অর্থসম্বন্ধ আছে এমন দুই বা ততোধিক পদের এক পদে মিলিত হওয়াকে **সমাস** বলে।

1. **দ্বন্দ্ব সমাস (উভয় পদ প্রধান):** মাতা ও পিতা = **মাতাপিতা**; ভাই ও বোন = **ভাইবোন**।
2. **তৎপুরুষ সমাস (পরপদ প্রধান, বিভক্তি লোপ):** বিদ্যায়ের আলয় = **বিদ্যালয়**; গাছ থেকে পাকা = **গাছপাকা**।
3. **কর্মধারয় সমাস (বিশেষণ + বিশেষ্য, পরপদ প্রধান):** নীল যে পদ্ম = **নীলপদ্ম**; সিংহ চিহ্নিত আসন = **সিংহাসন**; চাঁদের মতো মুখ = **চাঁদমুখ**।
4. **দ্বিগু সমাস (সংখ্যাবাচক পূর্বপদ + সমাহার):** ত্রি (তিন) ফলের সমাহার = **ত্রিফলা**; পঞ্চ বটের সমাহার = **পঞ্চবটী**।
5. **বহুব্রীহি সমাস (তৃতীয় অন্য অর্থ প্রধান):** দশ আনন যার = **দশানন** (রাবণ); বীণা পাণিতে যার = **বীণাপাণি** (সরস্বতী)।
6. **অব্যয়ীভাব সমাস (পূর্বপদ অব্যয় প্রধান):** কণ্ঠের সমীপে = **উপকণ্ঠ**; ভিক্ষার অভাব = **দুর্ভিক্ষ**।`
	},
	{
		id: "ben-essay-science",
		subject: "bengali",
		subjectLabel: "বাংলা ব্যাকরণ ও রচনা",
		classes: "Class 8–10",
		title: "বাংলা প্রবন্ধ রচনা — দৈনন্দিন জীবনে বিজ্ঞান",
		keywords: [
			"রচনা",
			"দৈনন্দিন জীবনে বিজ্ঞান",
			"প্রবন্ধ",
			"বিজ্ঞান রচনা",
			"essay"
		],
		answer: `**প্রবন্ধ রচনা: দৈনন্দিন জীবনে বিজ্ঞান**

**১. ভূমিকা:**
বর্তমান যুগ বিজ্ঞানের যুগ। সকাল থেকে রাত পর্যন্ত আমাদের প্রতিটি পদক্ষেপেই বিজ্ঞানের অবদান জড়িয়ে আছে। ঘুম ভাঙার অ্যালার্ম ঘড়ি থেকে শুরু করে রাতের বৈদ্যুতিক আলো — সবই বিজ্ঞানের দান।

**২. প্রাত্যহিক জীবনে বিজ্ঞানের অবদান:**
- **যোগাযোগ ও যাতায়াত:** রেলগাড়ি, বাস, উড়োজাহাজ, মোবাইল ফোন ও ইন্টারনেট গোটা পৃথিবীকে মানুষের হাতের মুঠোয় এনে দিয়েছে।
- **চিকিৎসা বিজ্ঞান:** এক্স-রে, অ্যান্টিবায়োটিক, টিকা ও আধুনিক অস্ত্রোপচার অসংখ্য প্রাণ রক্ষা করছে।
- **শিক্ষা ও কৃষি:** ছাপাখানা, কম্পিউটার ও স্মার্ট ক্লাসরুম শিক্ষার প্রসার ঘটিয়েছে; উন্নত সার ও সেচব্যবস্থা কৃষি উৎপাদন বাড়িয়েছে।

**৩. বিজ্ঞানের অপব্যবহার:**
যুদ্ধাস্ত্র, পরিবেশ দূষণ ও অতিরিক্ত মোবাইল আসক্তি বিজ্ঞানের ক্ষতিকর দিক। মনে রাখতে হবে, বিজ্ঞান নিজে ভালো বা মন্দ নয় — মানুষের ব্যবহারই তাকে কল্যাণকর বা ধ্বংসাত্মক করে তোলে।

**৪. উপসংহার:**
বিজ্ঞানকে মানবকল্যাণ, শান্তি ও পরিবেশ রক্ষার কাজে ব্যবহার করলেই সভ্যতার প্রকৃত জয় হবে।`
	},
	{
		id: "ben-letter",
		subject: "bengali",
		subjectLabel: "বাংলা ব্যাকরণ ও রচনা",
		classes: "Class 5–10",
		title: "প্রধান শিক্ষকের কাছে ছুটির আবেদনপত্র (ফরম্যাট)",
		keywords: [
			"আবেদনপত্র",
			"চিঠি",
			"ছুটি",
			"প্রধান শিক্ষক",
			"দরখাস্ত",
			"letter"
		],
		answer: `**প্রধান শিক্ষকের কাছে অসুস্থতার কারণে ছুটির আবেদনপত্র**

মাননীয়
প্রধান শিক্ষক মহাশয়,
[তোমার বিদ্যালয়ের নাম]
[ঠিকানা]

**বিষয়:** অসুস্থতার কারণে তিন দিনের ছুটির আবেদন।

মহাশয়,
বিনীত নিবেদন এই যে, আমি আপনার বিদ্যালয়ের [তোমার শ্রেণি, যেমন অষ্টম] শ্রেণির একজন নিয়মিত ছাত্র/ছাত্রী (ক্রমিক সংখ্যা: [রোল নম্বর])। গত [তারিখ] থেকে প্রবল জ্বরে আক্রান্ত থাকায় আমি তিন দিন বিদ্যালয়ে উপস্থিত থাকতে পারিনি।

অতএব, মহাশয়ের নিকট আমার সনির্বন্ধ অনুরোধ, অনুগ্রহ করে আমাকে ওই তিন দিনের ছুটি মঞ্জুর করে বাধিত করবেন।

ইতি —
আপনার একান্ত অনুগত ছাত্র/ছাত্রী,
[তোমার নাম]
শ্রেণি: [শ্রেণি] | বিভাগ: [বিভাগ] | ক্রমিক সংখ্যা: [রোল]
তারিখ: [আজকের তারিখ]`
	},
	{
		id: "eng-tense",
		subject: "english",
		subjectLabel: "English Grammar",
		classes: "Class 5–10",
		title: "English Tense — ১২টি Tense-এর সহজ চার্ট ও উদাহরণ",
		keywords: [
			"tense",
			"টেন্স",
			"present",
			"past",
			"future",
			"english grammar",
			"verb"
		],
		answer: `**English Tense — সহজ নিয়ম ও উদাহরণ**

**১. Present Tense (বর্তমান কাল):**
- **Simple Present:** Subject + V1 (he/she/it হলে s/es) → *He reads a book.*
- **Present Continuous:** Subject + am/is/are + V-ing → *He is reading a book.*
- **Present Perfect:** Subject + have/has + V3 → *He has read the book.*
- **Present Perfect Continuous:** Subject + have/has been + V-ing → *He has been reading for two hours.*

**২. Past Tense (অতীত কাল):**
- **Simple Past:** Subject + V2 → *He read a book yesterday.*
- **Past Continuous:** Subject + was/were + V-ing → *He was reading a book.*
- **Past Perfect:** Subject + had + V3 → *The train had left before we reached.*
- **Past Perfect Continuous:** Subject + had been + V-ing → *He had been reading since morning.*

**৩. Future Tense (ভবিষ্যৎ কাল):**
- **Simple Future:** Subject + shall/will + V1 → *He will read a book.*
- **Future Continuous:** Subject + will be + V-ing → *He will be reading.*
- **Future Perfect:** Subject + will have + V3 → *He will have finished the work.*`
	},
	{
		id: "eng-voice",
		subject: "english",
		subjectLabel: "English Grammar",
		classes: "Class 7–10",
		title: "Voice Change (Active to Passive) — নিয়ম ও উদাহরণ",
		keywords: [
			"voice",
			"voice change",
			"active",
			"passive",
			"ভয়েস"
		],
		answer: `**Voice Change (Active → Passive) এর সহজ নিয়ম**

**মূল সূত্র:** Object-কে Subject বানাও + Tense অনুযায়ী Be-verb + **Verb-এর V3 (Past Participle)** + **by** + Subject-এর Object রূপ।

**Tense অনুযায়ী উদাহরণ:**
1. **Simple Present:** *Rina writes a letter.* → **A letter is written by Rina.**
2. **Present Continuous:** *He is playing football.* → **Football is being played by him.**
3. **Present Perfect:** *She has done the work.* → **The work has been done by her.**
4. **Simple Past:** *They built a bridge.* → **A bridge was built by them.**
5. **Simple Future:** *I will help you.* → **You will be helped by me.**
6. **Imperative (আদেশ):** *Open the door.* → **Let the door be opened.**
7. **Modal Verb:** *We must obey rules.* → **Rules must be obeyed by us.**`
	},
	{
		id: "eng-narration",
		subject: "english",
		subjectLabel: "English Grammar",
		classes: "Class 8–10",
		title: "Narration Change (Direct to Indirect Speech)",
		keywords: [
			"narration",
			"direct",
			"indirect",
			"speech",
			"নারেশন"
		],
		answer: `**Narration Change (Direct → Indirect Speech)**

**Reporting Verb Past Tense হলে Tense পরিবর্তন:**
- Simple Present → Simple Past (*am/is/are → was/were*)
- Present Continuous → Past Continuous
- Present Perfect → Past Perfect (*have/has → had*)
- Simple Past → Past Perfect
- *will → would, can → could, may → might*
- *today → that day, tomorrow → the next day, yesterday → the previous day*

**উদাহরণ:**
1. **Assertive:** He said, "I am busy." → **He said that he was busy.**
2. **Interrogative (Yes/No):** She asked me, "Do you like tea?" → **She asked me if I liked tea.**
3. **Interrogative (Wh):** He said to me, "Where do you live?" → **He asked me where I lived.**
4. **Imperative:** The teacher said, "Work hard." → **The teacher advised us to work hard.**
5. **Universal Truth (বদলায় না):** He said, "The sun rises in the east." → **He said that the sun rises in the east.**`
	}
];
var BENGALI_DIGITS = {
	"০": "0",
	"১": "1",
	"২": "2",
	"৩": "3",
	"৪": "4",
	"৫": "5",
	"৬": "6",
	"৭": "7",
	"৮": "8",
	"৯": "9"
};
function normalizeMathText(input) {
	return input.replace(/[০-৯]/g, (ch) => BENGALI_DIGITS[ch] ?? ch).replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/²/g, "^2").trim();
}
function formatNumber(n) {
	if (!Number.isFinite(n)) return "অসংজ্ঞাত";
	const rounded = Math.round(n * 1e6) / 1e6;
	return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
function evaluateArithmeticExpression(expr) {
	const cleaned = expr.replace(/\s+/g, "");
	if (!cleaned || !/^[0-9+\-*/().^]+$/.test(cleaned)) return null;
	if (!/\d/.test(cleaned)) return null;
	let pos = 0;
	const peek = () => cleaned[pos] ?? "";
	const consume = () => cleaned[pos++] ?? "";
	function parseExpression() {
		let left = parseTerm();
		while (peek() === "+" || peek() === "-") {
			const op = consume();
			const right = parseTerm();
			left = op === "+" ? left + right : left - right;
		}
		return left;
	}
	function parseTerm() {
		let left = parsePower();
		while (peek() === "*" || peek() === "/") {
			const op = consume();
			const right = parsePower();
			if (op === "/") {
				if (right === 0) throw new Error("DIV_ZERO");
				left /= right;
			} else left *= right;
		}
		return left;
	}
	function parsePower() {
		const base = parseUnary();
		if (peek() === "^") {
			consume();
			const exp = parsePower();
			return Math.pow(base, exp);
		}
		return base;
	}
	function parseUnary() {
		if (peek() === "+") {
			consume();
			return parseUnary();
		}
		if (peek() === "-") {
			consume();
			return -parseUnary();
		}
		return parsePrimary();
	}
	function parsePrimary() {
		if (peek() === "(") {
			consume();
			const val = parseExpression();
			if (peek() !== ")") throw new Error("MISMATCH_PAREN");
			consume();
			return val;
		}
		const start = pos;
		while (/[0-9.]/.test(peek())) consume();
		const numStr = cleaned.slice(start, pos);
		if (!numStr || numStr === ".") throw new Error("INVALID_NUM");
		const val = Number(numStr);
		if (!Number.isFinite(val)) throw new Error("INVALID_NUM");
		return val;
	}
	try {
		const result = parseExpression();
		if (pos !== cleaned.length || !Number.isFinite(result)) return null;
		return result;
	} catch {
		return null;
	}
}
function solveOfflineMath(rawQuery) {
	const normalized = normalizeMathText(rawQuery);
	const quadMatch = normalized.replace(/\s+/g, "").match(/^([+-]?\d*\.?\d*)x\^2([+-]\d*\.?\d*x)?([+-]\d+\.?\d*)?=0$/i);
	if (quadMatch) {
		const parseCoeff = (raw, defaultVal) => {
			if (!raw) return defaultVal;
			const stripped = raw.replace(/x$/i, "");
			if (stripped === "" || stripped === "+") return 1;
			if (stripped === "-") return -1;
			return Number(stripped);
		};
		const a = parseCoeff(quadMatch[1], 1);
		const b = quadMatch[2] ? parseCoeff(quadMatch[2], 0) : 0;
		const c = quadMatch[3] ? Number(quadMatch[3]) : 0;
		if (a !== 0 && Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
			const disc = b * b - 4 * a * c;
			if (disc < 0) return `**দ্বিঘাত সমীকরণের সমাধান (অফলাইন গণিত সলভার)**\n\nসমীকরণ: \`${normalized}\`\n- a = ${a}, b = ${b}, c = ${c}\n- নিরূপক (D) = b² - 4ac = ${formatNumber(disc)} < 0\n\n**সিদ্ধান্ত:** নিরূপক ঋণাত্মক হওয়ায় এই সমীকরণের কোনো **বাস্তব বীজ নেই**।`;
			const sqrtD = Math.sqrt(disc);
			const x1 = (-b + sqrtD) / (2 * a);
			const x2 = (-b - sqrtD) / (2 * a);
			return `**দ্বিঘাত সমীকরণের সমাধান (অফলাইন গণিত সলভার)**\n\nসমীকরণ: \`${normalized}\`\n1. সহগসমূহ: a = ${a}, b = ${b}, c = ${c}\n2. নিরূপক (D) = b² - 4ac = (${b})² - 4×(${a})×(${c}) = **${formatNumber(disc)}**\n3. শ্রীধর আচার্যের সূত্র: x = (-b ± √D) / 2a\n\n**উত্তর:**\n- **x₁ = ${formatNumber(x1)}**\n- **x₂ = ${formatNumber(x2)}**`;
		}
	}
	const sqrtMatch = normalized.match(/(?:sqrt|বর্গমূল|√)\s*\(?\s*(\d+(?:\.\d+)?)\s*\)?/i);
	if (sqrtMatch) {
		const num = Number(sqrtMatch[1]);
		if (Number.isFinite(num) && num >= 0) {
			const root = Math.sqrt(num);
			return `**বর্গমূল নির্ণয় (অফলাইন গণিত সলভার)**\n\n- √${num} = **${formatNumber(root)}**\n- যাচাই: ${formatNumber(root)} × ${formatNumber(root)} ≈ ${formatNumber(root * root)}`;
		}
	}
	const pctMatch1 = normalized.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|এর)\s*(\d+(?:\.\d+)?)/i);
	const pctMatch2 = normalized.match(/(\d+(?:\.\d+)?)\s*এর\s*(\d+(?:\.\d+)?)\s*%/i);
	if (pctMatch1 || pctMatch2) {
		const pct = Number(pctMatch1 ? pctMatch1[1] : pctMatch2[2]);
		const total = Number(pctMatch1 ? pctMatch1[2] : pctMatch2[1]);
		if (Number.isFinite(pct) && Number.isFinite(total)) return `**শতকরা হিসাব (অফলাইন গণিত সলভার)**\n\n- ${total}-এর ${pct}% = (${pct} / 100) × ${total}\n- **উত্তর: ${formatNumber(pct / 100 * total)}**`;
	}
	const strippedPrefix = normalized.replace(/^(?:solve|calculate|compute|হিসাব|সমাধান|মান নির্ণয়|কত হয়)[:\s]*/i, "").replace(/[=?]+$/g, "").trim();
	if (/[+\-*/^]/.test(strippedPrefix)) {
		const val = evaluateArithmeticExpression(strippedPrefix);
		if (val !== null) return `**গাণিতিক সমাধান (অফলাইন গণিত সলভার)**\n\n- প্রদত্ত রাশি: \`${strippedPrefix}\`\n- **উত্তর: ${formatNumber(val)}**`;
	}
	return null;
}
function normalizeQuestionText(text) {
	return text.trim().normalize("NFC").replace(/য়/g, "য়").replace(/ড়/g, "ড়").replace(/ঢ়/g, "ঢ়").replace(/[।?!,.;:'"()\-]/g, " ").replace(/\s+/g, " ").toLowerCase();
}
function loadCachedTeacherAnswers() {
	try {
		if (typeof localStorage === "undefined") return [];
		const raw = localStorage.getItem(OFFLINE_TEACHER_CACHE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((item) => Boolean(item) && typeof item.question === "string" && typeof item.answer === "string");
	} catch {
		return [];
	}
}
function saveOfflineTeacherAnswer(question, answer, className) {
	try {
		if (typeof localStorage === "undefined") return;
		const q = question.trim();
		const a = answer.trim();
		if (!q || !a || a.length < 20) return;
		const existing = loadCachedTeacherAnswers();
		const normQ = normalizeQuestionText(q);
		const filtered = existing.filter((item) => normalizeQuestionText(item.question) !== normQ);
		const next = [{
			question: q.slice(0, 300),
			answer: a.slice(0, 12e3),
			className,
			createdAt: Date.now()
		}, ...filtered].slice(0, MAX_CACHED_ANSWERS);
		localStorage.setItem(OFFLINE_TEACHER_CACHE_KEY, JSON.stringify(next));
	} catch {}
}
function answerOfflineQuestion(question, className, hasImage = false) {
	const cleanQ = question.trim();
	if (hasImage && !cleanQ) return { answer: "**অফলাইন মোড:** ছবি পড়ে সমাধান (Photo OCR) করার জন্য ইন্টারনেট প্রয়োজন।\n\nতবে আপনি এখনই **অফলাইন নোটস** বাটনে ক্লিক করে ৭টি বিষয়ের নোটস পড়তে পারেন অথবা সরাসরি অঙ্ক বা প্রশ্ন লিখে উত্তর পেতে পারেন।" };
	const mathSolved = solveOfflineMath(cleanQ);
	if (mathSolved) return {
		answer: `${mathSolved}\n\n---\n*অফলাইন গণিত সলভার (${className}) — ইন্টারনেট ছাড়াই সমাধান*`,
		matchedTopicTitle: "অফলাইন গণিত সলভার"
	};
	const normQ = normalizeQuestionText(cleanQ);
	const queryTokens = normQ.split(" ").filter((w) => w.length >= 2);
	const cached = loadCachedTeacherAnswers();
	let bestCached = null;
	for (const item of cached) {
		const normItem = normalizeQuestionText(item.question);
		if (normItem === normQ) return {
			answer: `${item.answer}\n\n---\n*আপনার ফোনে সেভ করা উত্তর (${item.className}) — ইন্টারনেট ছাড়াই পঠনযোগ্য*`,
			matchedTopicTitle: item.question
		};
		if (queryTokens.length > 0) {
			let hits = 0;
			for (const tok of queryTokens) if (normItem.includes(tok)) hits += 1;
			const ratio = hits / queryTokens.length;
			if (hits >= 2 && ratio >= .5 && (!bestCached || ratio > bestCached.score)) bestCached = {
				item,
				score: ratio
			};
		}
	}
	if (bestCached) return {
		answer: `${bestCached.item.answer}\n\n---\n*আপনার ফোনে সেভ করা উত্তর (${bestCached.item.className}) — ইন্টারনেট ছাড়াই পঠনযোগ্য*`,
		matchedTopicTitle: bestCached.item.question
	};
	let bestTopic = null;
	for (const topic of OFFLINE_STUDY_TOPICS) {
		let score = 0;
		const normTitle = normalizeQuestionText(topic.title);
		const normSubj = normalizeQuestionText(topic.subjectLabel);
		if (normTitle.includes(normQ) || normQ.includes(normTitle)) score += 10;
		for (const kw of topic.keywords) {
			const normKw = normalizeQuestionText(kw);
			if (normKw && normQ.includes(normKw)) score += 5;
		}
		for (const tok of queryTokens) if (normTitle.includes(tok) || normSubj.includes(tok)) score += 2;
		if (score > 0 && (!bestTopic || score > bestTopic.score)) bestTopic = {
			topic,
			score
		};
	}
	if (bestTopic && bestTopic.score >= 4) return {
		answer: `${bestTopic.topic.answer}\n\n---\n*অফলাইন WBBSE পাঠ্যবই নোটস (${bestTopic.topic.subjectLabel} · ${bestTopic.topic.classes}) — রিচার্জ ছাড়াই পঠনযোগ্য*`,
		matchedTopicTitle: bestTopic.topic.title
	};
	return { answer: `**অফলাইন মোড চালু আছে (ইন্টারনেট নেই)**\n\n"${cleanQ}" প্রশ্নের উত্তর এই মুহূর্তে অফলাইন নোটসে সেভ করা নেই। তবে আপনি ইন্টারনেট ছাড়াই নিচের কাজগুলো করতে পারবেন:\n\n1. ওপরের **"অফলাইন নোটস"** বাটনে ক্লিক করে ৭টি বিষয়ের ২৬টি গুরুত্বপূর্ণ WBBSE নোটস পড়ুন।\n2. যেকোনো অঙ্ক সরাসরি লিখুন — যেমন: \`২৫ × ৪ + ১০\`, \`15% of 400\`, \`বর্গমূল 144\`, বা \`x^2 - 5x + 6 = 0\`।\n3. **Dictionary** ট্যাবে গিয়ে ৫৮+ স্কুল শব্দের অর্থ অফলাইনেই দেখুন।\n\n**জনপ্রিয় অফলাইন নোটস:**\n${OFFLINE_STUDY_TOPICS.slice(0, 6).map((t) => `- ${t.title}`).join("\n")}\n\n*(একবার ইন্টারনেট/Wi-Fi পেলে যেকোনো নতুন প্রশ্ন জিজ্ঞেস করলেই তা অটোমেটিক ফোনে সেভ হয়ে যাবে।)*` };
}
// src/offline/offlineDictionary.ts
var OFFLINE_DICT_CACHE_KEY = "wbsec_offline_dict_cache_v1";
var MAX_CACHED_WORDS = 300;
var BUILTIN_OFFLINE_DICTIONARY = [
	{
		word: "বিদ্যালয়",
		pronunciation: "বিদ্-দা-লয় (Bid-da-loy)",
		meaning: "যে স্থানে ছাত্রছাত্রীরা বিদ্যা বা শিক্ষা লাভ করে; পাঠশালা বা স্কুল।",
		sandhiVicched: "বিদ্যা + আলয়",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ, ষষ্ঠী তৎপুরুষ সমাস)",
		exampleSentences: ["প্রতিদিন সকালে সময়মতো বিদ্যালয়ে যাওয়া উচিত।", "আমাদের বিদ্যালয়ে একটি সমৃদ্ধ গ্রন্থাগার আছে।"]
	},
	{
		word: "সূর্যোদয়",
		pronunciation: "শূর্-জো-দয় (Shur-jo-doy)",
		meaning: "সকালে পূর্ব আকাশে সূর্যের উদয় বা ওঠা; প্রভাত।",
		sandhiVicched: "সূর্য + উদয়",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ, স্বরসন্ধি)",
		exampleSentences: ["দার্জিলিংয়ের টাইগার হিল থেকে সূর্যোদয় দেখা দারুণ সুন্দর।", "সূর্যোদয়ের সাথে সাথে পাখিরা গান গাইতে শুরু করে।"]
	},
	{
		word: "অন্বেষণ",
		pronunciation: "অন্-নে-শন (On-ne-shon)",
		meaning: "গভীরভাবে খোঁজ করা, সন্ধান বা গবেষণা করা।",
		sandhiVicched: "অনু + এষণ",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ, স্বরসন্ধি)",
		exampleSentences: ["বিজ্ঞানীরা মহাকাশে প্রাণের অন্বেষণ করছেন।", "সত্যের অন্বেষণই প্রকৃত শিক্ষার উদ্দেশ্য।"]
	},
	{
		word: "জিজ্ঞাসা",
		pronunciation: "জিগ্-গ্যাঁ-শা (Jig-ga-sha)",
		meaning: "জানার প্রবল ইচ্ছা; প্রশ্ন বা কৌতূহল।",
		sandhiVicched: "জ্ঞা + সন্ + অ + আ",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["ছাত্রের মনে যত বেশি জিজ্ঞাসা থাকবে, সে তত দ্রুত শিখবে।", "শিক্ষক মহাশয় আমার সব জিজ্ঞাসার সহজ উত্তর দিলেন।"]
	},
	{
		word: "দিগন্ত",
		pronunciation: "দি-গন্-ত (Di-gon-to)",
		meaning: "দূরে যে রেখায় আকাশ ও পৃথিবী মিলে গেছে বলে মনে হয়; দিকের শেষ প্রান্ত।",
		sandhiVicched: "দিক্ + অন্ত",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ, ব্যঞ্জনসন্ধি)",
		exampleSentences: ["গোধূলি বেলায় দিগন্ত জুড়ে লাল রঙ ছড়িয়ে পড়ে।", "খোলা মাঠের দিগন্তরেখায় সাদা মেঘ ভেসে চলেছে।"]
	},
	{
		word: "Resilience",
		pronunciation: "রি-জি-লি-এন্স (ri-ZIL-yuhns)",
		meaning: "কঠিন পরিস্থিতি বা ব্যর্থতার পর আবার ঘুরে দাঁড়ানোর মানসিক শক্তি; সহনশীলতা ও স্থিতিস্থাপকতা।",
		sandhiVicched: "ইংরেজি শব্দ (ল্যাটিন মূল: re- + salire)",
		grammar: "Noun (Abstract Noun / ভাববাচক বিশেষ্য)",
		exampleSentences: ["Her resilience helped her score top marks in Madhyamik despite all challenges.", "True resilience means learning from mistakes and trying again."]
	},
	{
		word: "সালোকসংশ্লেষ",
		pronunciation: "শা-লো-ক-শঙ্-শ্লেশ",
		meaning: "সূর্যালোক ও ক্লোরোফিলের উপস্থিতিতে সবুজ উদ্ভিদের শর্করা জাতীয় খাদ্য তৈরির জৈব-রাসায়নিক প্রক্রিয়া।",
		sandhiVicched: "স + আলোক + সম্ + শ্লেষ",
		grammar: "বিশেষ্য পদ (বিজ্ঞান পরিভাষা)",
		exampleSentences: ["সালোকসংশ্লেষ প্রক্রিয়ায় উদ্ভিদ পরিবেশে অক্সিজেন ত্যাগ করে।", "সূর্যালোক ছাড়া সালোকসংশ্লেষ সম্ভব নয়।"]
	},
	{
		word: "হিমালয়",
		pronunciation: "হি-মা-লয়",
		meaning: "বরফের আবাসস্থল; এশিয়া মহাদেশের সর্বোচ্চ পর্বতমালা।",
		sandhiVicched: "হিম + আলয়",
		grammar: "সংজ্ঞাবাচক বিশেষ্য (স্বরসন্ধি)",
		exampleSentences: ["ভারতের উত্তরে প্রাচীরের মতো দাঁড়িয়ে আছে হিমালয় পর্বতমালা।", "হিমালয় থেকে গঙ্গা ও ব্রহ্মপুত্র নদের উৎপত্তি হয়েছে।"]
	},
	{
		word: "স্বাধীনতা",
		pronunciation: "শা-ধি-ন-তা",
		meaning: "পরাধীনতার মুক্তি; নিজের ইচ্ছামতো ন্যায়সঙ্গতভাবে চলার অধিকার।",
		sandhiVicched: "স্ব + অধীন + তা",
		grammar: "ভাববাচক বিশেষ্য (তৎসম শব্দ)",
		exampleSentences: ["১৯৪৭ সালের ১৫ই আগস্ট ভারত স্বাধীনতা লাভ করে।", "স্বাধীনতা অর্জনের চেয়ে তা রক্ষা করা বেশি কঠিন।"]
	},
	{
		word: "সংস্কৃতি",
		pronunciation: "শঙ্-স্ক্রি-তি",
		meaning: "কোনো জাতির জীবনধারা, সাহিত্য, শিল্পকলা, ভাষা, আচার-ব্যবহার ও মূল্যবোধের সমষ্টি।",
		sandhiVicched: "সম্ + কৃতি",
		grammar: "বিশেষ্য পদ (ব্যঞ্জনসন্ধি)",
		exampleSentences: ["বাংলার লোকসঙ্গীত আমাদের সংস্কৃতির অমূল্য সম্পদ।", "প্রতিটি জাতির নিজস্ব ঐতিহ্য ও সংস্কৃতি থাকে।"]
	},
	{
		word: "পরিবেশ",
		pronunciation: "পো-রি-বেশ",
		meaning: "আমাদের চারপাশের জল, বায়ু, মাটি, উদ্ভিদ, প্রাণী ও প্রাকৃতিক পারিপার্শ্বিক অবস্থা।",
		sandhiVicched: "পরি + বেশ",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["গাছ লাগিয়ে আমাদের পরিবেশকে দূষণমুক্ত রাখা উচিত।", "সুস্থ জীবনের জন্য নির্মল পরিবেশ অত্যন্ত প্রয়োজন।"]
	},
	{
		word: "বিজ্ঞান",
		pronunciation: "বিগ্-গ্যাঁন",
		meaning: "পর্যবেক্ষণ, পরীক্ষা-নিরীক্ষা ও যুক্তির মাধ্যমে অর্জিত বিশেষ ও সুশৃঙ্খল জ্ঞান।",
		sandhiVicched: "বি + জ্ঞান",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["বিজ্ঞান মানুষের দৈনন্দিন জীবনকে অনেক সহজ করেছে।", "আচার্য জগদীশচন্দ্র বসু ভারতের অন্যতম শ্রেষ্ঠ বিজ্ঞানী।"]
	},
	{
		word: "উন্নতি",
		pronunciation: "উন্-নো-তি",
		meaning: "অগ্রগতি, শ্রীবৃদ্ধি বা আরও ভালো অবস্থায় পৌঁছানো।",
		sandhiVicched: "উৎ + নতি",
		grammar: "বিশেষ্য পদ (ব্যঞ্জনসন্ধি)",
		exampleSentences: ["নিয়মিত অধ্যবসায় করলে পরীক্ষায় নিশ্চিত উন্নতি হয়।", "শিক্ষা ছাড়া কোনো দেশের প্রকৃত উন্নতি সম্ভব নয়।"]
	},
	{
		word: "অধ্যবসায়",
		pronunciation: "ওধ্-ধো-ব-শায়",
		meaning: "কোনো কাজে সফল না হওয়া পর্যন্ত ধৈর্য ও নিষ্ঠার সাথে অবিরাম চেষ্টা চালিয়ে যাওয়া।",
		sandhiVicched: "অধি + অবসায়",
		grammar: "বিশেষ্য পদ (স্বরসন্ধি)",
		exampleSentences: ["অধ্যবসায়ই সাফল্যের মূল চাবিকাঠি।", "ছাত্রজীবনে অধ্যবসায়ের কোনো বিকল্প নেই।"]
	},
	{
		word: "কৃতজ্ঞতা",
		pronunciation: "ক্রি-তগ্-গ-তা",
		meaning: "কেউ উপকার করলে সেই উপকার মনে রাখা ও ধন্যবাদ জানানোর মানসিকতা।",
		sandhiVicched: "কৃতজ্ঞ + তা",
		grammar: "ভাববাচক বিশেষ্য",
		exampleSentences: ["বাবা-মা ও শিক্ষকের প্রতি আমাদের চিরকাল কৃতজ্ঞতা থাকা উচিত।", "তাঁর সাহায্যের জন্য আমি গভীর কৃতজ্ঞতা প্রকাশ করছি।"]
	},
	{
		word: "সদাচার",
		pronunciation: "শ-দা-চার",
		meaning: "সৎ ও ভদ্র আচরণ; শিষ্টাচার।",
		sandhiVicched: "সৎ + আচার",
		grammar: "বিশেষ্য পদ (ব্যঞ্জনসন্ধি)",
		exampleSentences: ["সদাচার মানুষকে সবার কাছে প্রিয় করে তোলে।", "ছোটবেলা থেকেই সদাচার অভ্যাস করা প্রয়োজন।"]
	},
	{
		word: "অত্যন্ত",
		pronunciation: "ওত্-তন্-ত",
		meaning: "খুবই, প্রচণ্ড বা মাত্রাতিরিক্ত।",
		sandhiVicched: "অতি + অন্ত",
		grammar: "বিশেষণের বিশেষণ / অব্যয় (স্বরসন্ধি)",
		exampleSentences: ["আজকের অঙ্কটা অত্যন্ত সহজ ছিল।", "সময়ের মূল্য বোঝা ছাত্রদের জন্য অত্যন্ত জরুরি।"]
	},
	{
		word: "স্বাগত",
		pronunciation: "শা-গ-ত",
		meaning: "সু-আগমন; অতিথিকে আনন্দের সাথে বরণ করে নেওয়া।",
		sandhiVicched: "সু + আগত",
		grammar: "বিশেষণ / বিশেষ্য পদ (স্বরসন্ধি)",
		exampleSentences: ["আমাদের বিদ্যালয়ের বার্ষিক অনুষ্ঠানে সবাইকে স্বাগত।", "অতিথিকে হাসিমুখে স্বাগত জানানো ভদ্রতার লক্ষণ।"]
	},
	{
		word: "ইত্যাদি",
		pronunciation: "ইত্-তা-দি",
		meaning: "এইরকম আরও অনেক কিছু; প্রভৃতি।",
		sandhiVicched: "ইতি + আদি",
		grammar: "অব্যয় পদ (স্বরসন্ধি)",
		exampleSentences: ["আম, জাম, কাঁঠাল, লিচু ইত্যাদি গ্রীষ্মকালীন ফল।", "ব্যাগটিতে খাতা, কলম, পেন্সিল ইত্যাদি রাখা আছে।"]
	},
	{
		word: "পরীক্ষা",
		pronunciation: "পো-রিক্-খা",
		meaning: "জ্ঞান, দক্ষতা বা সত্যতা যাচাই করার প্রক্রিয়া।",
		sandhiVicched: "পরি + ঈক্ষা",
		grammar: "বিশেষ্য পদ (স্বরসন্ধি)",
		exampleSentences: ["মাধ্যমিক পরীক্ষার জন্য সে মন দিয়ে প্রস্তুতি নিচ্ছে।", "পরীক্ষার হলে শান্ত মাথায় প্রশ্ন পড়া উচিত।"]
	},
	{
		word: "মহোৎসব",
		pronunciation: "মো-হোত্-শব",
		meaning: "বিরাট বা মহা আনন্দ-অনুষ্ঠান।",
		sandhiVicched: "মহা + উৎসব",
		grammar: "বিশেষ্য পদ (স্বরসন্ধি)",
		exampleSentences: ["দুর্গাপূজা বাংলার সবচেয়ে বড় মহোৎসব।", "বিদ্যালয়ের শতবর্ষ উপলক্ষে মহোৎসবের আয়োজন করা হয়েছে।"]
	},
	{
		word: "নাবিক",
		pronunciation: "না-বিক",
		meaning: "যিনি জাহাজ বা নৌকা চালান; মাঝি বা জলযানের কর্মী।",
		sandhiVicched: "নৌ + ইক",
		grammar: "বিশেষ্য পদ (স্বরসন্ধি)",
		exampleSentences: ["সাহসী নাবিক ঝড়ের মধ্যেও জাহাজটিকে নিরাপদে বন্দরে নিয়ে এলেন।", "প্রাচীনকালে বাঙালি নাবিকরা বাণিজ্যের জন্য দূরদেশে যেত।"]
	},
	{
		word: "গায়ক",
		pronunciation: "গা-য়ক",
		meaning: "যিনি গান গান; সঙ্গীতশিল্পী।",
		sandhiVicched: "গৈ + অক",
		grammar: "বিশেষ্য পদ (স্বরসন্ধি)",
		exampleSentences: ["অনুষ্ঠানে গায়কের রবীন্দ্রসঙ্গীত সবাইকে মুগ্ধ করল।", "ভালো গায়ক হতে হলে প্রতিদিন রেওয়াজ করতে হয়।"]
	},
	{
		word: "সজ্জন",
		pronunciation: "শজ্-জন",
		meaning: "সৎ, ভদ্র ও চরিত্রবান ব্যক্তি।",
		sandhiVicched: "সৎ + জন",
		grammar: "বিশেষ্য / বিশেষণ পদ (ব্যঞ্জনসন্ধি)",
		exampleSentences: ["সজ্জন ব্যক্তির সঙ্গ মানুষের মনকে উন্নত করে।", "গ্রামে সবাই তাঁকে একজন সজ্জন মানুষ হিসেবে শ্রদ্ধা করে।"]
	},
	{
		word: "উজ্জ্বল",
		pronunciation: "উজ্-জল",
		meaning: "আলোয় ভরা, দীপ্তিময় বা চকচকে।",
		sandhiVicched: "উৎ + জ্বল",
		grammar: "বিশেষণ পদ (ব্যঞ্জনসন্ধি)",
		exampleSentences: ["রাতের আকাশে তারাগুলো উজ্জ্বল হয়ে জ্বলছে।", "ভালো পড়াশোনা করলে ভবিষ্যৎ উজ্জ্বল হয়।"]
	},
	{
		word: "সঞ্চয়",
		pronunciation: "শন্-চয়",
		meaning: "ভবিষ্যতের জন্য জমিয়ে রাখা বা সংগ্রহ করা।",
		sandhiVicched: "সম্ + চয়",
		grammar: "বিশেষ্য পদ (ব্যঞ্জনসন্ধি)",
		exampleSentences: ["বিপদের দিনের জন্য অল্প অল্প সঞ্চয় করা বুদ্ধিমানের কাজ।", "জ্ঞান সঞ্চয় করলে তা কখনো ফুরিয়ে যায় না।"]
	},
	{
		word: "সংবাদ",
		pronunciation: "শঙ্-বাদ",
		meaning: "খবর, বার্তা বা তথ্য।",
		sandhiVicched: "সম্ + বাদ",
		grammar: "বিশেষ্য পদ (ব্যঞ্জনসন্ধি)",
		exampleSentences: ["সকালে সংবাদপত্র পড়া একটি ভালো অভ্যাস।", "পরীক্ষায় প্রথম হওয়ার সংবাদ শুনে বাবা-মা খুব খুশি হলেন।"]
	},
	{
		word: "নমস্কার",
		pronunciation: "ন-মোশ্-কার",
		meaning: "দুই হাত জোড় করে শ্রদ্ধা বা অভিবাদন জানানো।",
		sandhiVicched: "নমঃ + কার",
		grammar: "বিশেষ্য পদ (বিসর্গ সন্ধি)",
		exampleSentences: ["গুরুজনদের দেখলে বিনয়ের সাথে নমস্কার জানানো উচিত।", "সকালে স্কুলে ঢুকে আমরা শিক্ষকদের নমস্কার করি।"]
	},
	{
		word: "আবিষ্কার",
		pronunciation: "আ-বিশ্-কার",
		meaning: "অজানা কোনো সত্য, বস্তু বা যন্ত্র নতুন করে খুঁজে বের করা বা উদ্ভাবন করা।",
		sandhiVicched: "আবিঃ + কার",
		grammar: "বিশেষ্য পদ (বিসর্গ সন্ধি)",
		exampleSentences: ["আলেকজান্ডার ফ্লেমিং পেনিসিলিন আবিষ্কার করেন।", "বিদ্যুতের আবিষ্কার মানবসভ্যতাকে বদলে দিয়েছে।"]
	},
	{
		word: "মনোযোগ",
		pronunciation: "মো-নো-জোগ",
		meaning: "কোনো বিষয়ে মন স্থির করে দেওয়া; একাগ্রতা।",
		sandhiVicched: "মনঃ + যোগ",
		grammar: "বিশেষ্য পদ (বিসর্গ সন্ধি)",
		exampleSentences: ["ক্লাসে শিক্ষকের কথা মনোযোগ দিয়ে শোনা উচিত।", "মনোযোগ দিয়ে পড়লে অল্প সময়েই পড়া মনে থাকে।"]
	},
	{
		word: "নিরীহ",
		pronunciation: "নি-রি-হ",
		meaning: "শান্ত, নির্দোষ ও কারও ক্ষতি করে না এমন।",
		sandhiVicched: "নিঃ + ঈহ",
		grammar: "বিশেষণ পদ (বিসর্গ সন্ধি)",
		exampleSentences: ["হরিণ একটি অত্যন্ত নিরীহ প্রাণী।", "নিরীহ মানুষের ওপর কখনো অত্যাচার করা উচিত নয়।"]
	},
	{
		word: "আশীর্বাদ",
		pronunciation: "আ-শির্-বাদ",
		meaning: "মঙ্গল কামনা করে গুরুজনদের শুভ ইচ্ছা বা দোয়া।",
		sandhiVicched: "আশীঃ + বাদ",
		grammar: "বিশেষ্য পদ (বিসর্গ সন্ধি)",
		exampleSentences: ["পরীক্ষা দিতে যাওয়ার আগে মা-বাবার আশীর্বাদ নেওয়া ভালো।", "শিক্ষকদের আশীর্বাদেই ছাত্ররা জীবনে বড় হয়।"]
	},
	{
		word: "সাহিত্য",
		pronunciation: "শা-হিত্-ত",
		meaning: "কবিতা, গল্প, উপন্যাস, নাটক ও প্রবন্ধের শিল্পসম্মত রচনা।",
		sandhiVicched: "সহিত + য",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["রবীন্দ্রনাথ ঠাকুর বাংলা সাহিত্যকে বিশ্বদরবারে পৌঁছে দিয়েছেন।", "ভালো সাহিত্য পড়লে ভাষার দক্ষতা বাড়ে।"]
	},
	{
		word: "ইতিহাস",
		pronunciation: "ই-তি-হাশ",
		meaning: "অতীতে ঘটে যাওয়া মানবসভ্যতা ও সমাজের ধারাবাহিক সত্য বিবরণ।",
		sandhiVicched: "ইতিহ + আস",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["ইতিহাস পাঠ করলে আমরা অতীতের ভুল থেকে শিক্ষা নিতে পারি।", "বাংলার স্বাধীনতা সংগ্রামের ইতিহাস অত্যন্ত গৌরবময়।"]
	},
	{
		word: "ভূগোল",
		pronunciation: "ভু-গোল",
		meaning: "পৃথিবীর গঠন, জলবায়ু, নদী, পাহাড় ও মানববসতি বিষয়ক শাস্ত্র।",
		sandhiVicched: "ভূ + গোল",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["ভূগোল ক্লাসে আজ আমরা পশ্চিমবঙ্গের নদ-নদী সম্পর্কে শিখেছি।", "মানচিত্র দেখে ভূগোল পড়লে বিষয়টি সহজে বোঝা যায়।"]
	},
	{
		word: "গণিত",
		pronunciation: "গো-নিত",
		meaning: "সংখ্যা, পরিমাণ, জ্যামিতি ও যুক্তি-ভিত্তিক হিসাবশাস্ত্র।",
		sandhiVicched: "গণ্ + ইত",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["প্রতিদিন অনুশীলন করলে গণিত সবচেয়ে প্রিয় বিষয় হয়ে ওঠে।", "গণিত মানুষের যুক্তিবুদ্ধি ও চিন্তাশক্তি বাড়ায়।"]
	},
	{
		word: "ব্যাকরণ",
		pronunciation: "ব্যা-ক-রন",
		meaning: "যে শাস্ত্র পাঠ করলে কোনো ভাষা শুদ্ধভাবে লিখতে, পড়তে ও বলতে পারা যায়।",
		sandhiVicched: "বি + আ + কৃ + অন",
		grammar: "বিশেষ্য পদ (তৎসম শব্দ)",
		exampleSentences: ["শুদ্ধ বাংলা বানান জানতে বাংলা ব্যাকরণ পড়া জরুরি।", "ব্যাকরণ ভাষার শৃঙ্খলা বজায় রাখে।"]
	},
	{
		word: "প্রতিজ্ঞা",
		pronunciation: "প্রো-তিগ্-গ্যাঁ",
		meaning: "কোনো কাজ করার দৃঢ় শপথ বা অঙ্গীকার।",
		sandhiVicched: "প্রতি + জ্ঞা",
		grammar: "বিশেষ্য পদ",
		exampleSentences: ["আমি প্রতিদিন অন্তত দুই ঘণ্টা মন দিয়ে পড়ার প্রতিজ্ঞা করেছি।", "প্রতিজ্ঞা রক্ষা করা মহৎ মানুষের পরিচয়।"]
	},
	{
		word: "শৃঙ্খলা",
		pronunciation: "স্রিঙ্-খ-লা",
		meaning: "নিয়মকানুন মেনে চলা; সুব্যবস্থা।",
		sandhiVicched: "শৃঙ্খল + আ",
		grammar: "বিশেষ্য পদ",
		exampleSentences: ["ছাত্রজীবনে শৃঙ্খলা মেনে চললে জীবনে বড় হওয়া যায়।", "খেলার মাঠে শৃঙ্খলা বজায় রাখা খুব দরকার।"]
	},
	{
		word: "সততা",
		pronunciation: "শ-ত-তা",
		meaning: "সত্যবাদিতা, ন্যায়পরায়ণতা ও অসৎ পথ থেকে দূরে থাকার গুণ।",
		sandhiVicched: "সৎ + তা",
		grammar: "ভাববাচক বিশেষ্য",
		exampleSentences: ["সততাই সর্বোৎকৃষ্ট পন্থা।", "সততার পুরস্কার জীবনে একদিন না একদিন পাওয়া যায়ই।"]
	},
	{
		word: "সময়ানুবর্তিতা",
		pronunciation: "শ-ম-য়া-নু-বোর্ত-তি-তা",
		meaning: "সঠিক সময়ে সঠিক কাজ সম্পন্ন করার অভ্যাস।",
		sandhiVicched: "সময় + অনুবর্তিতা",
		grammar: "ভাববাচক বিশেষ্য",
		exampleSentences: ["সময়ানুবর্তিতা সফল মানুষের অন্যতম প্রধান গুণ।", "বিদ্যালয়ে সময়ানুবর্তিতার শিক্ষা দেওয়া হয়।"]
	},
	{
		word: "ঐতিহ্য",
		pronunciation: "ওই-তিজ্-ঝো",
		meaning: "বংশপরম্পরায় বা যুগ যুগ ধরে চলে আসা গৌরবময় ধারা ও সংস্কৃতি।",
		sandhiVicched: "ইতিহ + য",
		grammar: "বিশেষ্য পদ",
		exampleSentences: ["শান্তিনিকেতন বাংলার শিক্ষা ও সংস্কৃতির এক মহান ঐতিহ্য।", "আমাদের প্রাচীন ঐতিহ্যকে সম্মান জানানো উচিত।"]
	},
	{
		word: "সৌন্দর্য",
		pronunciation: "শৌন্-দোর্-জো",
		meaning: "সুন্দর হওয়ার ভাব বা রূপের মাধুর্য।",
		sandhiVicched: "সুন্দর + য",
		grammar: "ভাববাচক বিশেষ্য",
		exampleSentences: ["সুন্দরবনের প্রাকৃতিক সৌন্দর্য অসাধারণ।", "বাইরের রূপের চেয়ে মনের সৌন্দর্য অনেক বড়।"]
	},
	{
		word: "স্বাস্থ্য",
		pronunciation: "শাশ্-থো",
		meaning: "শরীর ও মনের সুস্থ ও নীরোগ অবস্থা।",
		sandhiVicched: "স্বস্থ + য",
		grammar: "বিশেষ্য পদ",
		exampleSentences: ["স্বাস্থ্যই সকল সুখের মূল।", "নিয়মিত ব্যায়াম ও পুষ্টিকর খাবার স্বাস্থ্য ভালো রাখে।"]
	},
	{
		word: "নদীমাতৃক",
		pronunciation: "নো-দি-মাত্-ত্রিক",
		meaning: "যে দেশের মাটি ও কৃষি প্রধানত নদীর জলের ওপর নির্ভরশীল।",
		sandhiVicched: "নদী মাতা যার (বহুব্রীহি সমাস)",
		grammar: "বিশেষণ পদ",
		exampleSentences: ["পশ্চিমবঙ্গ ও বাংলাদেশ নদীমাতৃক অঞ্চল।", "নদীমাতৃক দেশের পলিমাটি খুব উর্বর হয়।"]
	},
	{
		word: "মহাকর্ষ",
		pronunciation: "ম-হা-কোর্-শো",
		meaning: "মহাবিশ্বের যেকোনো দুটি বস্তুর পরস্পরের প্রতি আকর্ষণ বল।",
		sandhiVicched: "মহা + আকর্ষ",
		grammar: "বিশেষ্য পদ (ভৌত বিজ্ঞান)",
		exampleSentences: ["স্যার আইজ্যাক নিউটন মহাকর্ষ সূত্র আবিষ্কার করেন।", "মহাকর্ষ বলের কারণেই গ্রহগুলো সূর্যের চারপাশে ঘোরে।"]
	},
	{
		word: "অভিকর্ষ",
		pronunciation: "ও-ভি-কোর্-শো",
		meaning: "পৃথিবী যে বল দ্বারা তার কেন্দ্রের দিকে যেকোনো বস্তুকে আকর্ষণ করে।",
		sandhiVicched: "অভি + কর্ষ",
		grammar: "বিশেষ্য পদ (ভৌত বিজ্ঞান)",
		exampleSentences: ["অভিকর্ষ বলের টানে গাছ থেকে ফল মাটিতে পড়ে।", "পৃথিবীতে অভিকর্ষজ ত্বরণের গড় মান ৯.৮ মিটার/সেকেন্ড²।"]
	},
	{
		word: "Education",
		pronunciation: "এ-জু-কে-শন (ej-oo-KAY-shuhn)",
		meaning: "শিক্ষা; জ্ঞান, দক্ষতা ও চরিত্র গঠনের প্রক্রিয়া।",
		sandhiVicched: "ইংরেজি শব্দ (ল্যাটিন মূল: educare)",
		grammar: "Noun (Abstract Noun)",
		exampleSentences: ["Education is the backbone of a nation.", "Good education builds both knowledge and character."]
	},
	{
		word: "Knowledge",
		pronunciation: "ন-লেজ (NOL-ij)",
		meaning: "জ্ঞান; পড়াশোনা ও অভিজ্ঞতার মাধ্যমে অর্জিত সত্য ধারণা।",
		sandhiVicched: "ইংরেজি শব্দ (know + -ledge)",
		grammar: "Noun (Uncountable Noun)",
		exampleSentences: ["Knowledge is power when used wisely.", "Reading books every day increases our knowledge."]
	},
	{
		word: "Perseverance",
		pronunciation: "পার-সি-ভি-য়া-রেন্স (pur-suh-VEER-uhns)",
		meaning: "অধ্যবসায়; বাধা সত্ত্বেও লক্ষ্যে পৌঁছানোর নিরন্তর চেষ্টা।",
		sandhiVicched: "ইংরেজি শব্দ (ল্যাটিন মূল: perseverare)",
		grammar: "Noun (Abstract Noun)",
		exampleSentences: ["Through hard work and perseverance, he passed with distinction.", "Perseverance turns difficult subjects into easy ones."]
	},
	{
		word: "Discipline",
		pronunciation: "ডি-সি-প্লিন (DIS-uh-plin)",
		meaning: "শৃঙ্খলা; নিয়ম ও সময় মেনে চলার অভ্যাস।",
		sandhiVicched: "ইংরেজি শব্দ (ল্যাটিন মূল: disciplina)",
		grammar: "Noun / Verb",
		exampleSentences: ["Discipline is essential for every student.", "Regular study habits teach us self-discipline."]
	},
	{
		word: "Environment",
		pronunciation: "এন-ভাই-রন-মেন্ট (en-VY-ruhn-muhnt)",
		meaning: "পরিবেশ; আমাদের চারপাশের প্রকৃতি ও পারিপার্শ্বিক অবস্থা।",
		sandhiVicched: "ইংরেজি শব্দ (environ + -ment)",
		grammar: "Noun",
		exampleSentences: ["We must plant more trees to protect our environment.", "Plastic pollution harms the natural environment."]
	},
	{
		word: "Curiosity",
		pronunciation: "কিউ-রি-অ-সি-টি (kyoor-ee-OS-i-tee)",
		meaning: "কৌতূহল বা জানার প্রবল আগ্রহ।",
		sandhiVicched: "ইংরেজি শব্দ (curious + -ity)",
		grammar: "Noun (Abstract Noun)",
		exampleSentences: ["Curiosity is the first step toward scientific discovery.", "Ask questions in class to feed your curiosity."]
	},
	{
		word: "Gratitude",
		pronunciation: "গ্র্যা-টি-টিউড (GRAT-i-tood)",
		meaning: "কৃতজ্ঞতা; কারও উপকারের জন্য আন্তরিক ধন্যবাদবোধ।",
		sandhiVicched: "ইংরেজি শব্দ (ল্যাটিন মূল: gratus)",
		grammar: "Noun (Abstract Noun)",
		exampleSentences: ["Always show gratitude to your parents and teachers.", "She expressed her heartfelt gratitude for the help."]
	},
	{
		word: "Photosynthesis",
		pronunciation: "ফো-টো-সিন-থে-সিস (foh-toh-SIN-thuh-sis)",
		meaning: "সালোকসংশ্লেষ; সূর্যালোকের সাহায্যে সবুজ উদ্ভিদের খাদ্য তৈরির প্রক্রিয়া।",
		sandhiVicched: "গ্রিক মূল: photo (আলো) + synthesis (সংশ্লেষ)",
		grammar: "Noun (Science Term)",
		exampleSentences: ["Green plants make glucose and oxygen during photosynthesis.", "Chlorophyll in leaves absorbs sunlight for photosynthesis."]
	},
	{
		word: "Democracy",
		pronunciation: "ডি-ম-ক্র্যা-সি (di-MOK-ruh-see)",
		meaning: "গণতন্ত্র; জনগণের দ্বারা নির্বাচিত শাসনব্যবস্থা।",
		sandhiVicched: "গ্রিক মূল: demos (জনগণ) + kratos (শাসন)",
		grammar: "Noun",
		exampleSentences: ["India is the largest democracy in the world.", "In a democracy, every citizen has equal rights."]
	},
	{
		word: "Gravity",
		pronunciation: "গ্র্যা-ভি-টি (GRAV-i-tee)",
		meaning: "মহাকর্ষ বা অভিকর্ষ বল; যে টানে সব বস্তু পৃথিবীর দিকে পড়ে।",
		sandhiVicched: "ইংরেজি শব্দ (ল্যাটিন মূল: gravitas)",
		grammar: "Noun (Physics Term)",
		exampleSentences: ["Gravity keeps the Moon orbiting around the Earth.", "Because of gravity, a thrown ball always comes back down."]
	},
	{
		word: "Honesty",
		pronunciation: "অ-নেস্-টি (ON-uh-stee)",
		meaning: "সততা; সত্য বলার ও সৎ পথে চলার গুণ।",
		sandhiVicched: "ইংরেজি শব্দ (honest + -y)",
		grammar: "Noun (Abstract Noun)",
		exampleSentences: ["Honesty is the best policy.", "Everyone trusts a student known for honesty."]
	}
];
function normalizeWord(word) {
	return word.trim().normalize("NFC").replace(/য়/g, "য়").replace(/ড়/g, "ড়").replace(/ঢ়/g, "ঢ়").toLowerCase();
}
function loadCachedOfflineDictionary() {
	try {
		if (typeof localStorage === "undefined") return [];
		const raw = localStorage.getItem(OFFLINE_DICT_CACHE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((item) => Boolean(item) && typeof item.word === "string" && typeof item.meaning === "string");
	} catch {
		return [];
	}
}
function saveOfflineDictionaryEntry(entry) {
	try {
		if (typeof localStorage === "undefined" || !entry?.word?.trim()) return;
		const existing = loadCachedOfflineDictionary();
		const norm = normalizeWord(entry.word);
		const next = [entry, ...existing.filter((item) => normalizeWord(item.word) !== norm)].slice(0, MAX_CACHED_WORDS);
		localStorage.setItem(OFFLINE_DICT_CACHE_KEY, JSON.stringify(next));
	} catch {}
}
function getAllOfflineDictionaryWords() {
	const cached = loadCachedOfflineDictionary();
	const seen = /* @__PURE__ */ new Set();
	const words = [];
	for (const item of [...cached, ...BUILTIN_OFFLINE_DICTIONARY]) {
		const norm = normalizeWord(item.word);
		if (!seen.has(norm)) {
			seen.add(norm);
			words.push(item.word);
		}
	}
	return words;
}
function lookupOfflineDictionary(query) {
	const clean = normalizeWord(query);
	if (!clean) return {
		entry: null,
		suggestions: getAllOfflineDictionaryWords().slice(0, 10)
	};
	const allEntries = [...loadCachedOfflineDictionary(), ...BUILTIN_OFFLINE_DICTIONARY];
	for (const item of allEntries) if (normalizeWord(item.word) === clean) return {
		entry: item,
		suggestions: []
	};
	const partialMatches = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of allEntries) {
		const normWord = normalizeWord(item.word);
		const normMeaning = normalizeWord(item.meaning);
		if (seen.has(normWord)) continue;
		if (normWord.includes(clean) || clean.includes(normWord) || normMeaning.includes(clean)) {
			seen.add(normWord);
			partialMatches.push(item);
		}
	}
	if (partialMatches.length === 1 && normalizeWord(partialMatches[0].word).startsWith(clean)) return {
		entry: partialMatches[0],
		suggestions: []
	};
	return {
		entry: null,
		suggestions: partialMatches.length > 0 ? partialMatches.slice(0, 8).map((e) => e.word) : getAllOfflineDictionaryWords().slice(0, 8)
	};
}
// src/App.tsx
var AppUpdateModal = (0, import_react.lazy)(() => __vitePreload(() => import("./AppUpdateModal-DOQOW7xz.js").then((m) => ({ default: m.AppUpdateModal })), __vite__mapDeps([7,1,3,4])));
var StudentProfileModal = (0, import_react.lazy)(() => __vitePreload(() => import("./StudentProfileModal-ByUg8XUH.js").then((m) => ({ default: m.StudentProfileModal })), __vite__mapDeps([8,1,3,4])));
var DictionaryWorkspace = (0, import_react.lazy)(() => __vitePreload(() => import("./DictionaryWorkspace-DbjoKOr9.js").then((m) => ({ default: m.DictionaryWorkspace })), __vite__mapDeps([9,1,3,4])));
var HistoryDrawer = (0, import_react.lazy)(() => __vitePreload(() => import("./HistoryDrawer-CVBOsMKN.js").then((m) => ({ default: m.HistoryDrawer })), __vite__mapDeps([10,1,3,4])));
var AdminModal = (0, import_react.lazy)(() => __vitePreload(() => import("./AdminModal-n_BZzCmQ.js").then((m) => ({ default: m.AdminModal })), __vite__mapDeps([11,1,3,4])));
var OfflineAiPackModal = (0, import_react.lazy)(() => __vitePreload(() => import("./OfflineAiPackModal-BkUEDgA9.js").then((m) => ({ default: m.OfflineAiPackModal })), __vite__mapDeps([12,1,3,4])));
var HISTORY_STORAGE_KEY = "wbsec_study_history_v1";
var THEME_STORAGE_KEY = "wbsec_theme_v2";
var ADMIN_TOKEN_STORAGE_KEY = "wbsec_admin_token_v1";
var APPLIED_VERSION_STORAGE_KEY = "wbsec_applied_config_version_v1";
var APPLIED_CONFIG_STORAGE_KEY = "wbsec_cached_app_config_v1";
var JUST_UPDATED_SESSION_KEY = "wbsec_just_updated_version_v1";
var AUTO_RELOAD_BUILD_KEY = "wbsec_auto_reloaded_build_v1";
var STUDENT_PROFILE_STORAGE_KEY = "wbsec_student_profile_v1";
var CLIENT_BUILD_VERSION = "build-1795347298994";
var MAX_HISTORY_ITEMS = 20;
var FAST_API_SETTINGS = { maxHistoryMessages: 8 };
function getInitialTheme() {
	try {
		const saved = localStorage.getItem(THEME_STORAGE_KEY);
		if (saved === "dark" || saved === "light") return saved;
	} catch {}
	return "dark";
}
function getStoredAppliedVersion() {
	try {
		const raw = localStorage.getItem(APPLIED_VERSION_STORAGE_KEY);
		if (!raw) return null;
		const parsed = parseInt(raw, 10);
		return Number.isFinite(parsed) && parsed >= 1 ? parsed : null;
	} catch {
		return null;
	}
}
function saveAppliedVersion(version) {
	try {
		localStorage.setItem(APPLIED_VERSION_STORAGE_KEY, String(version));
	} catch {}
}
function getStoredAppliedConfig() {
	try {
		const raw = localStorage.getItem(APPLIED_CONFIG_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		return sanitizeAppConfigForClient(parsed, DEFAULT_APP_CONFIG);
	} catch {
		return null;
	}
}
function saveAppliedConfig(config) {
	try {
		localStorage.setItem(APPLIED_CONFIG_STORAGE_KEY, JSON.stringify(config));
	} catch {}
}
function getStoredStudentProfile() {
	try {
		const raw = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
		if (!raw) return DEFAULT_STUDENT_PROFILE;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return DEFAULT_STUDENT_PROFILE;
		return {
			...DEFAULT_STUDENT_PROFILE,
			...parsed,
			name: typeof parsed.name === "string" ? parsed.name.trim().slice(0, 40) : "",
			onboardingCompleted: Boolean(parsed.onboardingCompleted)
		};
	} catch {
		return DEFAULT_STUDENT_PROFILE;
	}
}
function saveStudentProfile(profile) {
	try {
		localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
	} catch {
		try {
			localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify({
				...profile,
				avatarType: "preset",
				customAvatarDataUrl: void 0
			}));
		} catch {}
	}
}
function collectUniqueHighlights(lists) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const list of lists) {
		if (!list) continue;
		for (const phrase of list) {
			const clean = phrase.trim();
			if (clean && !seen.has(clean)) {
				seen.add(clean);
				result.push(clean);
			}
		}
	}
	return result.length > 0 ? result : void 0;
}
function App() {
	const isOnline = useOnlineStatus();
	const [theme, setTheme] = (0, import_react.useState)(getInitialTheme);
	const [mode, setMode] = (0, import_react.useState)("teacher");
	const [appConfig, setAppConfig] = (0, import_react.useState)(() => getStoredAppliedConfig() ?? DEFAULT_APP_CONFIG);
	const [appliedVersion, setAppliedVersion] = (0, import_react.useState)(() => getStoredAppliedVersion() ?? getStoredAppliedConfig()?.configVersion ?? DEFAULT_APP_CONFIG.configVersion);
	const [pendingUpdateConfig, setPendingUpdateConfig] = (0, import_react.useState)(null);
	const [updateModalOpen, setUpdateModalOpen] = (0, import_react.useState)(false);
	const [hasSwUpdate, setHasSwUpdate] = (0, import_react.useState)(false);
	const [isApplyingUpdate, setIsApplyingUpdate] = (0, import_react.useState)(false);
	const [isCheckingUpdate, setIsCheckingUpdate] = (0, import_react.useState)(false);
	const [updateCheckStatus, setUpdateCheckStatus] = (0, import_react.useState)(null);
	const [justUpdatedNotice, setJustUpdatedNotice] = (0, import_react.useState)(null);
	const [offlineReadyNotice, setOfflineReadyNotice] = (0, import_react.useState)(false);
	const dismissedVersionRef = (0, import_react.useRef)(null);
	const isInitialFetchRef = (0, import_react.useRef)(true);
	const [adminModalOpen, setAdminModalOpen] = (0, import_react.useState)(false);
	const [offlineAiModalOpen, setOfflineAiModalOpen] = (0, import_react.useState)(false);
	const [profileModalOpen, setProfileModalOpen] = (0, import_react.useState)(false);
	const [headerMenuOpen, setHeaderMenuOpen] = (0, import_react.useState)(false);
	const headerMenuRef = (0, import_react.useRef)(null);
	const [studentProfile, setStudentProfile] = (0, import_react.useState)(getStoredStudentProfile);
	(0, import_react.useEffect)(() => {
		if (!headerMenuOpen) return;
		const handlePointerDown = (e) => {
			if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) setHeaderMenuOpen(false);
		};
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setHeaderMenuOpen(false);
		};
		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("touchstart", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("touchstart", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [headerMenuOpen]);
	const [openLiveCounter, setOpenLiveCounter] = (0, import_react.useState)(0);
	const [offlineAiState, setOfflineAiState] = (0, import_react.useState)(getOfflineAiState);
	const [adminToken, setAdminToken] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
		} catch {
			return null;
		}
	});
	const [adminUsername, setAdminUsername] = (0, import_react.useState)(null);
	const [adminStats, setAdminStats] = (0, import_react.useState)(null);
	const [firebaseUser, setFirebaseUser] = (0, import_react.useState)(null);
	const [firebaseAuthReady, setFirebaseAuthReady] = (0, import_react.useState)(false);
	const appConfigRef = (0, import_react.useRef)(appConfig);
	appConfigRef.current = appConfig;
	const adminModalOpenRef = (0, import_react.useRef)(adminModalOpen);
	adminModalOpenRef.current = adminModalOpen;
	const isStreamingRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		return subscribeOfflineAiState(setOfflineAiState);
	}, []);
	(0, import_react.useEffect)(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setFirebaseUser(user);
			setFirebaseAuthReady(true);
		});
		return () => unsubscribe();
	}, []);
	(0, import_react.useEffect)(() => {
		const splashEl = document.getElementById("wbsec-splash");
		if (splashEl) {
			const fadeTimer = window.setTimeout(() => {
				splashEl.classList.add("wbsec-splash-hidden");
				window.setTimeout(() => splashEl.remove(), 360);
			}, 280);
			return () => window.clearTimeout(fadeTimer);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const currentUrl = new URL(window.location.href);
			const action = currentUrl.searchParams.get("action");
			if (action === "live") {
				setMode("teacher");
				setOpenLiveCounter((c) => c + 1);
			} else if (action === "dictionary") setMode("dictionary");
			else if (action === "quiz") setMode("teacher");
			if (currentUrl.searchParams.has("_wbsec_upd") || currentUrl.searchParams.has("source") || currentUrl.searchParams.has("action")) {
				currentUrl.searchParams.delete("_wbsec_upd");
				currentUrl.searchParams.delete("source");
				currentUrl.searchParams.delete("action");
				window.history.replaceState({}, "", currentUrl.pathname + currentUrl.search + currentUrl.hash);
			}
		} catch {}
		try {
			const updatedStr = sessionStorage.getItem(JUST_UPDATED_SESSION_KEY);
			if (updatedStr) {
				sessionStorage.removeItem(JUST_UPDATED_SESSION_KEY);
				const ver = parseInt(updatedStr, 10);
				if (Number.isFinite(ver) && ver >= 1) setJustUpdatedNotice(ver);
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!justUpdatedNotice) return;
		const timer = window.setTimeout(() => setJustUpdatedNotice(null), 5500);
		return () => window.clearTimeout(timer);
	}, [justUpdatedNotice]);
	(0, import_react.useEffect)(() => {
		if (!offlineReadyNotice) return;
		const timer = window.setTimeout(() => setOfflineReadyNotice(false), 6e3);
		return () => window.clearTimeout(timer);
	}, [offlineReadyNotice]);
	(0, import_react.useEffect)(() => {
		if (!updateCheckStatus) return;
		const timer = window.setTimeout(() => setUpdateCheckStatus(null), 4500);
		return () => window.clearTimeout(timer);
	}, [updateCheckStatus]);
	const hardRefreshToLatestBuild = (0, import_react.useCallback)(async (targetConfigVer) => {
		try {
			const ver = targetConfigVer || appConfigRef.current.configVersion || 1;
			sessionStorage.setItem(JUST_UPDATED_SESSION_KEY, String(ver));
		} catch {}
		try {
			if ("caches" in window) {
				const keys = await Promise.race([caches.keys(), new Promise((resolve) => setTimeout(() => resolve([]), 1500))]);
				await Promise.all(keys.filter((k) => !isOfflineAiCacheName(k)).map((k) => caches.delete(k)));
			}
		} catch {}
		try {
			if ("serviceWorker" in navigator) {
				const regs = await Promise.race([navigator.serviceWorker.getRegistrations(), new Promise((resolve) => setTimeout(() => resolve([]), 1500))]);
				await Promise.all(regs.map((r) => r.unregister().catch(() => false)));
			}
		} catch {}
		try {
			const nextUrl = new URL(window.location.href);
			nextUrl.searchParams.set("_wbsec_upd", String(Date.now()));
			window.location.replace(nextUrl.toString());
		} catch {
			window.location.reload();
		}
	}, []);
	const autoApplyBuildUpdate = (0, import_react.useCallback)(async (reloadKey, targetConfigVer) => {
		if (typeof navigator !== "undefined" && !navigator.onLine) return false;
		if (isStreamingRef.current || adminModalOpenRef.current) {
			setHasSwUpdate(true);
			setUpdateModalOpen(true);
			return false;
		}
		let attemptCount = 0;
		try {
			const raw = sessionStorage.getItem(AUTO_RELOAD_BUILD_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed?.key === reloadKey && typeof parsed.count === "number") attemptCount = parsed.count;
			}
		} catch {}
		if (attemptCount >= 2) {
			setHasSwUpdate(true);
			return false;
		}
		try {
			sessionStorage.setItem(AUTO_RELOAD_BUILD_KEY, JSON.stringify({
				key: reloadKey,
				count: attemptCount + 1
			}));
		} catch {}
		await hardRefreshToLatestBuild(targetConfigVer);
		return true;
	}, [hardRefreshToLatestBuild]);
	const applyIncomingConfig = (0, import_react.useCallback)((incoming, isInitial = false) => {
		const serverVersion = incoming.configVersion || 1;
		const storedVersion = getStoredAppliedVersion();
		const hasPersonalClass = Boolean(getStoredStudentProfile().className);
		if (storedVersion === null) {
			saveAppliedVersion(serverVersion);
			saveAppliedConfig(incoming);
			setAppliedVersion(serverVersion);
			setAppConfig(incoming);
			if (!hasPersonalClass) setClassNameLevel(incoming.defaultClass);
			return;
		}
		if (serverVersion > storedVersion) {
			saveAppliedVersion(serverVersion);
			saveAppliedConfig(incoming);
			setAppliedVersion(serverVersion);
			setAppConfig(incoming);
			setPendingUpdateConfig(null);
			setUpdateModalOpen(false);
			if (isInitial && !hasPersonalClass) setClassNameLevel(incoming.defaultClass);
			setJustUpdatedNotice(serverVersion);
		} else if (serverVersion === storedVersion) {
			if (isInitial || (incoming.updatedAt || 0) >= (appConfigRef.current.updatedAt || 0)) {
				saveAppliedConfig(incoming);
				setAppliedVersion(storedVersion);
				setAppConfig(incoming);
				if (isInitial && !hasPersonalClass) setClassNameLevel(incoming.defaultClass);
			}
		}
	}, []);
	const checkServerUpdates = (0, import_react.useCallback)(async (isInitial = false) => {
		if (typeof navigator !== "undefined" && !navigator.onLine) return;
		try {
			const ts = Date.now();
			const [cloudCfg, serverPayload, metaPayload] = await Promise.all([
				getLatestFirestoreConfig().catch(() => null),
				fetch(`/api/config?fresh=1&_t=${ts}`, { cache: "no-store" }).then((res) => res.ok ? res.json() : null).catch(() => null),
				fetch(`/build-meta.json?_t=${ts}`, { cache: "no-store" }).then((res) => res.ok ? res.json() : null).catch(() => null)
			]);
			const serverCfg = serverPayload?.config ?? null;
			const remoteBuild = (serverPayload?.buildVersion && serverPayload.buildVersion !== "dev" ? serverPayload.buildVersion : void 0) || metaPayload?.buildId;
			if (remoteBuild && remoteBuild !== "dev" && remoteBuild !== CLIENT_BUILD_VERSION) {
				const targetVer = Math.max(cloudCfg?.configVersion || 0, serverCfg?.configVersion || 0, appConfigRef.current.configVersion || 1) || 1;
				if (await autoApplyBuildUpdate(remoteBuild, targetVer)) return;
			}
			let incoming = null;
			if (cloudCfg && serverCfg) incoming = (cloudCfg.configVersion || 1) >= (serverCfg.configVersion || 1) ? cloudCfg : serverCfg;
			else incoming = cloudCfg || serverCfg;
			if (incoming) applyIncomingConfig(incoming, isInitial);
		} catch {}
	}, [applyIncomingConfig, autoApplyBuildUpdate]);
	(0, import_react.useEffect)(() => {
		if (!firebaseAuthReady) return;
		const unsubscribe = subscribeLiveAppSettings((incoming) => {
			applyIncomingConfig(incoming, false);
		});
		return () => unsubscribe();
	}, [firebaseAuthReady, applyIncomingConfig]);
	(0, import_react.useEffect)(() => {
		if (isInitialFetchRef.current) {
			isInitialFetchRef.current = false;
			checkServerUpdates(true);
		}
		const pollTimer = window.setInterval(() => {
			checkServerUpdates(false);
		}, 45e3);
		const onFocusOrVisible = () => {
			if (document.visibilityState === "visible") checkServerUpdates(false);
		};
		const onBackOnline = () => {
			checkServerUpdates(false);
		};
		window.addEventListener("focus", onFocusOrVisible);
		window.addEventListener("online", onBackOnline);
		document.addEventListener("visibilitychange", onFocusOrVisible);
		return () => {
			window.clearInterval(pollTimer);
			window.removeEventListener("focus", onFocusOrVisible);
			window.removeEventListener("online", onBackOnline);
			document.removeEventListener("visibilitychange", onFocusOrVisible);
		};
	}, [checkServerUpdates]);
	(0, import_react.useEffect)(() => {
		const handleAutoSwRefresh = () => {
			autoApplyBuildUpdate(`sw-${CLIENT_BUILD_VERSION}`);
		};
		const onOfflineReadyEvent = () => {
			setOfflineReadyNotice(true);
		};
		window.addEventListener("wbsec:sw-update-ready", handleAutoSwRefresh);
		window.addEventListener("wbsec:offline-ready", onOfflineReadyEvent);
		if (!("serviceWorker" in navigator)) return () => {
			window.removeEventListener("wbsec:sw-update-ready", handleAutoSwRefresh);
			window.removeEventListener("wbsec:offline-ready", onOfflineReadyEvent);
		};
		let active = true;
		const hadControllerAtMount = Boolean(navigator.serviceWorker.controller);
		const onControllerChange = () => {
			if (!active || !hadControllerAtMount) return;
			handleAutoSwRefresh();
		};
		navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
		navigator.serviceWorker.getRegistration().then((reg) => {
			if (!active || !reg) return;
			if (reg.waiting) handleAutoSwRefresh();
			reg.addEventListener("updatefound", () => {
				const installing = reg.installing;
				if (!installing) return;
				installing.addEventListener("statechange", () => {
					if (installing.state === "installed" && navigator.serviceWorker.controller) handleAutoSwRefresh();
				});
			});
		}).catch(() => {});
		return () => {
			active = false;
			window.removeEventListener("wbsec:sw-update-ready", handleAutoSwRefresh);
			window.removeEventListener("wbsec:offline-ready", onOfflineReadyEvent);
			navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
		};
	}, [autoApplyBuildUpdate]);
	(0, import_react.useEffect)(() => {
		if (!adminToken) {
			setAdminUsername(null);
			setAdminStats(null);
			return;
		}
		fetch("/api/admin/me", { headers: { Authorization: `Bearer ${adminToken}` } }).then((res) => {
			if (!res.ok) throw new Error("Invalid token");
			return res.json();
		}).then((data) => {
			setAdminUsername(data.username || "Amir123");
			if (data.config) {
				const incomingVer = data.config.configVersion || 1;
				if (incomingVer >= (appConfigRef.current.configVersion || 1)) {
					setAppConfig(data.config);
					saveAppliedConfig(data.config);
					saveAppliedVersion(incomingVer);
					setAppliedVersion(incomingVer);
				}
			}
			if (data.stats) setAdminStats(data.stats);
		}).catch(() => {
			setAdminToken(null);
			setAdminUsername(null);
			setAdminStats(null);
			try {
				localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
			} catch {}
		});
	}, [adminToken]);
	(0, import_react.useEffect)(() => {
		document.title = `${appConfig.appName} — AI Teacher & Bengali Dictionary`;
		document.documentElement.setAttribute("data-accent", appConfig.accentColor || "blue");
		document.documentElement.setAttribute("data-bg", appConfig.pageBackground || "default");
		document.documentElement.setAttribute("data-font-scale", appConfig.fontScale || "normal");
	}, [
		appConfig.appName,
		appConfig.accentColor,
		appConfig.pageBackground,
		appConfig.fontScale
	]);
	(0, import_react.useEffect)(() => {
		if (mode === "teacher" && !appConfig.enableTeacher && appConfig.enableDictionary) setMode("dictionary");
		else if (mode === "dictionary" && !appConfig.enableDictionary && appConfig.enableTeacher) setMode("teacher");
	}, [
		mode,
		appConfig.enableTeacher,
		appConfig.enableDictionary
	]);
	(0, import_react.useEffect)(() => {
		const isDark = theme === "dark";
		document.documentElement.classList.toggle("dark", isDark);
		const metaTheme = document.querySelector("meta[name=\"theme-color\"]");
		if (metaTheme) metaTheme.setAttribute("content", isDark ? "#05060d" : "#ffffff");
		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {}
	}, [theme]);
	const toggleTheme = () => {
		setTheme((prev) => prev === "dark" ? "light" : "dark");
	};
	const [classNameLevel, setClassNameLevel] = (0, import_react.useState)(() => getStoredStudentProfile().className ?? (getStoredAppliedConfig() ?? DEFAULT_APP_CONFIG).defaultClass);
	(0, import_react.useEffect)(() => {
		if (!isOnline && offlineAiState.installedTier === "class8" && classNameLevel !== "Class 8") setClassNameLevel("Class 8");
	}, [
		isOnline,
		offlineAiState.installedTier,
		classNameLevel
	]);
	const handleSaveStudentProfile = (0, import_react.useCallback)((nextProfile) => {
		setStudentProfile(nextProfile);
		saveStudentProfile(nextProfile);
		if (nextProfile.className) setClassNameLevel(nextProfile.className);
	}, []);
	const handleClassLevelChange = (0, import_react.useCallback)((nextClass) => {
		setClassNameLevel(nextClass);
		setStudentProfile((prev) => {
			if (!prev.onboardingCompleted) return prev;
			const updated = {
				...prev,
				className: nextClass,
				updatedAt: Date.now()
			};
			saveStudentProfile(updated);
			return updated;
		});
	}, []);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [draftText, setDraftText] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)(null);
	const [isStreaming, setIsStreaming] = (0, import_react.useState)(false);
	isStreamingRef.current = isStreaming;
	const [teacherError, setTeacherError] = (0, import_react.useState)(null);
	const [teacherValidation, setTeacherValidation] = (0, import_react.useState)(null);
	const [latestCompletedAssistantId, setLatestCompletedAssistantId] = (0, import_react.useState)(null);
	const [shouldAutoSpeakLatest, setShouldAutoSpeakLatest] = (0, import_react.useState)(false);
	const streamAbortRef = (0, import_react.useRef)(null);
	const messagesRef = (0, import_react.useRef)(messages);
	messagesRef.current = messages;
	const { isSupported: isSpeechSupported, isListening, isTranscribing, interimTranscript, lang: speechLang, setLang: setSpeechLang, error: speechError, stopListening, toggleListening } = useSpeechRecognition({
		defaultLang: "bn-IN",
		continuous: true,
		onFinalResult: (spokenText) => {
			setDraftText((prev) => prev.trim() ? `${prev.trim()} ${spokenText}` : spokenText);
			setTeacherValidation(null);
		}
	});
	(0, import_react.useEffect)(() => {
		if (mode !== "teacher" && isListening) stopListening();
	}, [
		mode,
		isListening,
		stopListening
	]);
	const [dictWord, setDictWord] = (0, import_react.useState)("");
	const [dictEntry, setDictEntry] = (0, import_react.useState)(null);
	const [dictLoading, setDictLoading] = (0, import_react.useState)(false);
	const [dictError, setDictError] = (0, import_react.useState)(null);
	const [dictValidation, setDictValidation] = (0, import_react.useState)(null);
	const [dictOfflineSuggestions, setDictOfflineSuggestions] = (0, import_react.useState)([]);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
			if (!saved) return [];
			const parsed = JSON.parse(saved);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
		} catch {}
	}, [history]);
	const pushHistory = (item) => {
		setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY_ITEMS));
	};
	const handleStopStreaming = () => {
		if (streamAbortRef.current) {
			streamAbortRef.current.abort();
			streamAbortRef.current = null;
		}
		abortOfflineAiGeneration();
		setIsStreaming(false);
	};
	const handleSendMessage = async (options) => {
		if (isStreaming) return;
		if (isListening) stopListening();
		const textToSend = (options?.overrideText ?? draftText).trim();
		const attachedImage = image;
		const wantsPdf = /\bpdf\b|পিডিএফ/i.test(textToSend);
		if (!textToSend && !attachedImage) {
			setTeacherValidation("Please type a question, tap Talk, or attach a photo first.");
			return;
		}
		setTeacherValidation(null);
		setTeacherError(null);
		setLatestCompletedAssistantId(null);
		setShouldAutoSpeakLatest(Boolean(options?.speakReply));
		const userMsg = {
			id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			role: "user",
			text: textToSend,
			image: attachedImage ? {
				dataUrl: attachedImage.dataUrl,
				base64: attachedImage.base64,
				mimeType: attachedImage.mimeType,
				name: attachedImage.name
			} : void 0,
			createdAt: Date.now()
		};
		const assistantMsgId = `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		const assistantMsg = {
			id: assistantMsgId,
			role: "model",
			text: "",
			createdAt: Date.now()
		};
		const conversationForApi = [...messagesRef.current, userMsg];
		const quizIntent = detectQuizRequest(textToSend);
		const finalizeAssistantMessage = (finalAnswer, cacheOnline = false, quizData) => {
			if (cacheOnline && textToSend) saveOfflineTeacherAnswer(textToSend, finalAnswer, classNameLevel);
			const historyId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
			const pdfMarkdown = quizData ? formatQuizAsMarkdown(quizData) : finalAnswer;
			const pdfMeta = wantsPdf ? (() => {
				const pdfTitle = quizData?.title || extractPdfTitle(finalAnswer, `${classNameLevel} Study Notes`);
				const pdfFilename = makeSafeFilename(pdfTitle);
				generateStudyPdf({
					title: pdfTitle,
					subtitle: `West Bengal Board (WBBSE) · ${classNameLevel}`,
					markdown: pdfMarkdown,
					filename: pdfFilename
				}).catch(() => {});
				return {
					title: pdfTitle,
					filename: pdfFilename
				};
			})() : void 0;
			setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? {
				...m,
				text: finalAnswer,
				historyId,
				...pdfMeta ? { pdf: pdfMeta } : {},
				...quizData ? { quiz: quizData } : {}
			} : m));
			const latestMessagesById = new Map(messagesRef.current.map((m) => [m.id, m]));
			const historyMessages = [...conversationForApi.map((m) => {
				const current = latestMessagesById.get(m.id);
				return {
					id: m.id,
					role: m.role,
					text: m.text || (m.image ? "[Photo attached]" : ""),
					highlights: current?.highlights ?? m.highlights,
					quiz: current?.quiz ?? m.quiz,
					createdAt: m.createdAt
				};
			}), {
				id: assistantMsgId,
				role: "model",
				text: finalAnswer,
				highlights: void 0,
				...quizData ? { quiz: quizData } : {},
				createdAt: Date.now()
			}];
			setLatestCompletedAssistantId(assistantMsgId);
			pushHistory({
				id: historyId,
				type: "teacher",
				className: classNameLevel,
				question: textToSend || "Uploaded Photo Question",
				hasImage: Boolean(attachedImage),
				answer: finalAnswer,
				highlights: collectUniqueHighlights(historyMessages.map((m) => m.highlights)),
				messages: historyMessages,
				createdAt: Date.now()
			});
		};
		setMessages([...conversationForApi, assistantMsg]);
		setDraftText("");
		setImage(null);
		if (quizIntent.isQuiz) {
			const activeStudentName = studentProfile.name.trim();
			const runOfflineQuizPipeline = () => {
				if (isOfflineAiPackInstalled() && !isOfflineFeatureAllowed("quiz")) {
					finalizeAssistantMessage("অনলি ক্লাস ৮ (১০০ MB) প্যাকে কুইজ চালু নেই — এতে শুধু **Class 8-এর মেসেজ, ভয়েস এবং PDF** কাজ করে।\n\nকুইজ, AI Live, ক্যামেরা ও সব ক্লাসের সুবিধা পেতে **২৫০ MB ফাস্ট প্যাক** বা **৫০০ MB প্রো প্যাক** ডাউনলোড করো।", false);
					return;
				}
				const offlineQuiz = generateOfflineQuiz(quizIntent.topic || textToSend, classNameLevel, quizIntent.count);
				const namePrefixBn = activeStudentName ? `${activeStudentName}, তোমার জন্য ` : "";
				const namePrefixEn = activeStudentName ? `${activeStudentName}, ` : "";
				const summary = offlineQuiz.language === "bn" ? `${namePrefixBn}**${offlineQuiz.title}** (অফলাইন মোড) তৈরি হয়েছে! মোট **${offlineQuiz.questions.length}টি প্রশ্ন** ও প্রতিটি প্রশ্নে **৪টি করে অপশন** আছে — নিচে সঠিক উত্তর বেছে নাও:` : `${namePrefixEn}**${offlineQuiz.title}** (Offline Mode) is ready with **${offlineQuiz.questions.length} questions** and **4 options** each:`;
				finalizeAssistantMessage(summary, false, offlineQuiz);
			};
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				runOfflineQuizPipeline();
				return;
			}
			setIsStreaming(true);
			setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? {
				...m,
				text: activeStudentName ? `*${activeStudentName}, তোমার টপিক নিয়ে ৪ অপশনের কুইজ তৈরি করা হচ্ছে...*` : "*তোমার টপিক নিয়ে ৪ অপশনের কুইজ তৈরি করা হচ্ছে...*"
			} : m));
			const quizController = new AbortController();
			streamAbortRef.current = quizController;
			try {
				const recentContext = conversationForApi.slice(0, -1).slice(-4).map((m) => ({
					role: m.role,
					text: m.text.slice(0, 320)
				}));
				const response = await fetch("/api/teacher/quiz", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						className: classNameLevel,
						topicPrompt: textToSend,
						count: quizIntent.count,
						studentName: activeStudentName || void 0,
						recentContext,
						image: attachedImage ? {
							base64: attachedImage.base64,
							mimeType: attachedImage.mimeType
						} : void 0
					}),
					signal: quizController.signal
				});
				const payload = await response.json().catch(() => ({}));
				if (!response.ok || !payload.quiz) throw new Error(payload.error || "কুইজ তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।");
				const baseSummary = payload.summaryText || `**${payload.quiz.title}** তৈরি হয়েছে! প্রতিটি প্রশ্নে ৪টি অপশন আছে — নিচে উত্তর দাও:`;
				finalizeAssistantMessage(activeStudentName ? `${activeStudentName}, ${baseSummary}` : baseSummary, false, payload.quiz);
			} catch (err) {
				if (err?.name === "AbortError") setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
				else if (err instanceof TypeError || typeof navigator !== "undefined" && !navigator.onLine) runOfflineQuizPipeline();
				else {
					setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
					setTeacherError(err instanceof Error ? err.message : "কুইজ তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করো।");
				}
			} finally {
				streamAbortRef.current = null;
				setIsStreaming(false);
			}
			return;
		}
		const runOfflineAnswerPipeline = async () => {
			const installedPack = getInstalledOfflinePack();
			const effectiveOfflineClass = installedPack?.capabilities.onlyClass ?? classNameLevel;
			let effectiveQuery = textToSend;
			let ocrNote = "";
			if (attachedImage) {
				if (installedPack && !installedPack.capabilities.allowCamera) {
					finalizeAssistantMessage("অনলি ক্লাস ৮ (১০০ MB) প্যাকে ক্যামেরা বা বইয়ের ছবি পড়া চালু নেই — এতে শুধু **Class 8-এর মেসেজ, ভয়েস এবং PDF** কাজ করে।\n\nবইয়ের ছবি তুলে সমাধান পেতে **২৫০ MB ফাস্ট প্যাক** বা **৫০০ MB প্রো প্যাক** ডাউনলোড করো।", false);
					return;
				}
				setIsStreaming(true);
				setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? {
					...m,
					text: "*অফলাইনে বইয়ের ছবি থেকে লেখা পড়া হচ্ছে (OCR)...*"
				} : m));
				const extracted = await extractTextFromImageOffline(attachedImage.dataUrl);
				if (extracted) {
					effectiveQuery = [textToSend, extracted].filter(Boolean).join("\n").trim();
					ocrNote = `\n\n*ছবি থেকে পড়া অংশ:* ${extracted.slice(0, 260)}`;
				}
			}
			const localAnswer = answerOfflineQuestion(effectiveQuery, effectiveOfflineClass, Boolean(attachedImage) && !effectiveQuery);
			if (isOfflineAiPackInstalled() && effectiveQuery) {
				setIsStreaming(true);
				const offlineController = new AbortController();
				streamAbortRef.current = offlineController;
				let streamedText = "";
				setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? {
					...m,
					text: ""
				} : m));
				try {
					const historyForOfflineAi = conversationForApi.slice(-6).map((m, idx, arr) => ({
						role: m.role,
						text: idx === arr.length - 1 ? effectiveQuery : m.text || (m.image ? "[Photo attached]" : "")
					}));
					const finalOfflineAiText = (await streamOfflineTeacherChat({
						className: effectiveOfflineClass,
						studentName: studentProfile.name.trim() || void 0,
						messages: historyForOfflineAi,
						contextHint: localAnswer.matchedTopicTitle ? localAnswer.answer : void 0,
						signal: offlineController.signal,
						onChunk: (chunk) => {
							streamedText += chunk;
							const snap = streamedText;
							setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? {
								...m,
								text: snap
							} : m));
						}
					}) || streamedText).trim();
					if (finalOfflineAiText) {
						const packFooter = installedPack?.tier === "pro" ? "অফলাইন AI প্রো (৫০০ MB · গুছানো উত্তর)" : installedPack?.tier === "standard" ? "অফলাইন AI ফাস্ট (২৫০ MB · দ্রুত উত্তর)" : "অফলাইন AI (অনলি ক্লাস ৮ · ১০০ MB)";
						finalizeAssistantMessage(`${finalOfflineAiText}${ocrNote}\n\n---\n*${packFooter}*`, false);
						return;
					}
				} catch {
					if (streamedText.trim()) {
						finalizeAssistantMessage(streamedText.trim(), false);
						return;
					}
				} finally {
					streamAbortRef.current = null;
					setIsStreaming(false);
				}
			}
			setIsStreaming(false);
			finalizeAssistantMessage(`${localAnswer.answer}${ocrNote}`, false);
		};
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			await runOfflineAnswerPipeline();
			return;
		}
		setIsStreaming(true);
		const controller = new AbortController();
		streamAbortRef.current = controller;
		let accumulatedText = "";
		const recentMessages = conversationForApi.slice(-FAST_API_SETTINGS.maxHistoryMessages);
		try {
			const response = await fetch("/api/teacher/stream", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					className: classNameLevel,
					temperature: appConfig.temperature,
					concise: appConfig.conciseAnswers,
					studentName: studentProfile.name.trim() || void 0,
					messages: recentMessages.map((m, idx) => ({
						role: m.role,
						text: m.text,
						image: m.image && idx === recentMessages.length - 1 ? {
							base64: m.image.base64,
							mimeType: m.image.mimeType
						} : void 0
					}))
				}),
				signal: controller.signal
			});
			if (!response.ok) {
				let errMessage = "Failed to get a response from AI Teacher.";
				try {
					const errJson = await response.json();
					if (errJson?.error) errMessage = errJson.error;
				} catch {}
				throw new Error(errMessage);
			}
			const reader = response.body?.getReader();
			if (!reader) throw new Error("Streaming is unavailable in this browser.");
			const decoder = new TextDecoder();
			let sseBuffer = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				sseBuffer += decoder.decode(value, { stream: true });
				const events = sseBuffer.split(/\r?\n\r?\n/);
				sseBuffer = events.pop() ?? "";
				for (const rawEvent of events) {
					const lines = rawEvent.split(/\r?\n/);
					for (const line of lines) {
						if (!line.startsWith("data:")) continue;
						const jsonStr = line.slice(5).trim();
						if (!jsonStr) continue;
						const payload = JSON.parse(jsonStr);
						if (payload.error) throw new Error(payload.error);
						if (payload.text) {
							accumulatedText += payload.text;
							const snapshot = accumulatedText;
							setMessages((prev) => prev.map((m) => m.id === assistantMsgId ? {
								...m,
								text: snapshot
							} : m));
						}
					}
				}
			}
			const finalAnswer = accumulatedText.trim();
			if (finalAnswer) finalizeAssistantMessage(finalAnswer, true);
		} catch (err) {
			if (err?.name === "AbortError") {
				if (accumulatedText.trim()) setLatestCompletedAssistantId(assistantMsgId);
				else setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
			} else if (!accumulatedText.trim()) await runOfflineAnswerPipeline();
			else {
				setMessages((prev) => prev.filter((m) => !(m.id === assistantMsgId && !m.text.trim())));
				setTeacherError(err instanceof Error ? err.message : "Network error. Please check your connection and try again.");
			}
		} finally {
			streamAbortRef.current = null;
			setIsStreaming(false);
		}
	};
	const handleOpenOfflineTopic = (questionTitle, fullAnswer) => {
		if (isStreaming) return;
		setTeacherError(null);
		setTeacherValidation(null);
		const now = Date.now();
		const historyId = `${now}-${Math.random().toString(36).slice(2, 7)}`;
		const uMsg = {
			id: `u-off-${now}`,
			role: "user",
			text: questionTitle,
			historyId,
			createdAt: now
		};
		const mMsg = {
			id: `m-off-${now + 1}`,
			role: "model",
			text: fullAnswer,
			historyId,
			createdAt: now + 1
		};
		const nextConversation = [
			...messagesRef.current,
			uMsg,
			mMsg
		];
		setMessages(nextConversation);
		setLatestCompletedAssistantId(mMsg.id);
		pushHistory({
			id: historyId,
			type: "teacher",
			className: classNameLevel,
			question: questionTitle,
			hasImage: false,
			answer: fullAnswer,
			messages: nextConversation.map((m) => ({
				id: m.id,
				role: m.role,
				text: m.text,
				highlights: m.highlights,
				createdAt: m.createdAt
			})),
			createdAt: now
		});
	};
	const handleDictionarySearch = async (overrideWord) => {
		const targetWord = (overrideWord ?? dictWord).trim();
		if (!targetWord) {
			setDictValidation("Please enter a word to search.");
			return;
		}
		setDictValidation(null);
		setDictError(null);
		setDictOfflineSuggestions([]);
		const runOfflineLookup = async () => {
			if (isOfflineAiPackInstalled() && !isOfflineFeatureAllowed("dictionary")) {
				setDictEntry(null);
				setDictOfflineSuggestions([]);
				setDictError("অনলি ক্লাস ৮ (১০০ MB) প্যাকে অফলাইন ডিকশনারি চালু নেই — এতে শুধু Class 8-এর মেসেজ, ভয়েস ও PDF কাজ করে। ডিকশনারি ও সব ফিচার পেতে ২৫০ MB ফাস্ট বা ৫০০ MB প্রো প্যাক ডাউনলোড করো।");
				return;
			}
			const offlineResult = lookupOfflineDictionary(targetWord);
			if (offlineResult.entry) {
				setDictEntry(offlineResult.entry);
				setDictError(null);
				setDictOfflineSuggestions([]);
				pushHistory({
					id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
					type: "dictionary",
					word: offlineResult.entry.word || targetWord,
					entry: offlineResult.entry,
					createdAt: Date.now()
				});
				return;
			}
			if (isOfflineAiPackInstalled() && isOfflineFeatureAllowed("dictionary")) {
				setDictLoading(true);
				try {
					const aiEntry = await lookupOfflineAiDictionary(targetWord);
					if (aiEntry) {
						setDictEntry(aiEntry);
						setDictError(null);
						setDictOfflineSuggestions([]);
						saveOfflineDictionaryEntry(aiEntry);
						pushHistory({
							id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
							type: "dictionary",
							word: aiEntry.word || targetWord,
							entry: aiEntry,
							createdAt: Date.now()
						});
						return;
					}
				} finally {
					setDictLoading(false);
				}
			}
			setDictEntry(null);
			setDictOfflineSuggestions(offlineResult.suggestions);
			setDictError(`অফলাইন ডিকশনারিতে "${targetWord}" শব্দটি নেই। যেকোনো শব্দের অফলাইন অর্থ পেতে "Offline AI (250 MB / 500 MB)" প্যাক ডাউনলোড করুন, অথবা নিচের শব্দগুলো বেছে নিন।`);
		};
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			await runOfflineLookup();
			return;
		}
		setDictLoading(true);
		try {
			const response = await fetch("/api/dictionary", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					word: targetWord,
					temperature: appConfig.temperature,
					concise: appConfig.conciseAnswers
				})
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Failed to look up the word.");
			setDictEntry(data.entry);
			saveOfflineDictionaryEntry(data.entry);
			pushHistory({
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				type: "dictionary",
				word: data.entry.word || targetWord,
				entry: data.entry,
				createdAt: Date.now()
			});
		} catch {
			await runOfflineLookup();
		} finally {
			setDictLoading(false);
		}
	};
	const handleResetSession = () => {
		if (mode === "teacher") {
			if (isListening) stopListening();
			handleStopStreaming();
			setMessages([]);
			setDraftText("");
			setImage(null);
			setTeacherError(null);
			setTeacherValidation(null);
			setLatestCompletedAssistantId(null);
			setShouldAutoSpeakLatest(false);
		} else {
			setDictWord("");
			setDictEntry(null);
			setDictError(null);
			setDictValidation(null);
		}
	};
	const handleSaveLiveTranscripts = (items) => {
		const valid = items.filter((item) => item.text.trim().length > 0);
		if (valid.length === 0) return;
		const now = Date.now();
		const firstUser = valid.find((item) => item.role === "user")?.text ?? "Live Voice Session";
		const lastModel = [...valid].reverse().find((item) => item.role === "model")?.text ?? "";
		const historyId = lastModel ? `${now}-${Math.random().toString(36).slice(2, 7)}` : void 0;
		const mapped = valid.map((item, idx) => ({
			id: `live-${now}-${idx}`,
			role: item.role,
			text: item.text,
			...historyId ? { historyId } : {},
			createdAt: now + idx
		}));
		setMessages((prev) => [...prev, ...mapped]);
		if (lastModel && historyId) pushHistory({
			id: historyId,
			type: "teacher",
			className: classNameLevel,
			question: firstUser,
			hasImage: false,
			answer: lastModel,
			messages: mapped.map((m) => ({
				id: m.id,
				role: m.role,
				text: m.text,
				highlights: m.highlights,
				createdAt: m.createdAt
			})),
			createdAt: now
		});
	};
	const handleSelectHistory = (item) => {
		if (item.type === "teacher") {
			handleStopStreaming();
			setMode("teacher");
			setClassNameLevel(item.className);
			setDraftText("");
			setImage(null);
			setTeacherError(null);
			setTeacherValidation(null);
			setShouldAutoSpeakLatest(false);
			if (item.messages && item.messages.length > 0) {
				const lastIdx = item.messages.length - 1;
				setMessages(item.messages.map((m, idx) => ({
					id: m.id || `hist-${item.id}-${idx}`,
					role: m.role,
					text: m.text,
					highlights: m.highlights ?? (m.role === "model" && idx === lastIdx ? item.highlights : void 0),
					quiz: m.quiz,
					historyId: item.id,
					createdAt: m.createdAt
				})));
			} else setMessages([{
				id: `hist-u-${item.id}`,
				role: "user",
				text: item.question,
				historyId: item.id,
				createdAt: item.createdAt
			}, {
				id: `hist-m-${item.id}`,
				role: "model",
				text: item.answer,
				highlights: item.highlights,
				historyId: item.id,
				createdAt: item.createdAt
			}]);
		} else {
			setMode("dictionary");
			setDictWord(item.word);
			setDictEntry(item.entry);
			setDictError(null);
			setDictValidation(null);
		}
	};
	const handleAddHighlight = (0, import_react.useCallback)((messageId, rawPhrase) => {
		const phrase = rawPhrase.trim();
		if (!phrase) return;
		const currentMessages = messagesRef.current;
		const targetIndex = currentMessages.findIndex((m) => m.id === messageId);
		const targetMsg = targetIndex >= 0 ? currentMessages[targetIndex] : void 0;
		if (!targetMsg || targetMsg.role !== "model") return;
		const existingHistoryId = targetMsg.historyId;
		let resolvedHistoryId = existingHistoryId;
		setHistory((prevHistory) => {
			let matchedAny = false;
			const updatedHistory = prevHistory.map((item) => {
				if (item.type !== "teacher") return item;
				if (!(existingHistoryId && item.id === existingHistoryId || Boolean(item.messages?.some((m) => m.id === messageId)))) return item;
				matchedAny = true;
				resolvedHistoryId = item.id;
				if (item.messages && item.messages.length > 0) {
					let msgMatched = false;
					const nextMsgs = item.messages.map((m, idx) => {
						if (!(m.id === messageId || !m.id && m.role === "model" && idx === item.messages.length - 1)) return m;
						msgMatched = true;
						const nextHighlights = collectUniqueHighlights([m.highlights, [phrase]]);
						return {
							...m,
							id: m.id || messageId,
							highlights: nextHighlights
						};
					});
					return {
						...item,
						messages: nextMsgs,
						highlights: msgMatched ? collectUniqueHighlights(nextMsgs.map((m) => m.highlights)) : collectUniqueHighlights([item.highlights, [phrase]])
					};
				}
				return {
					...item,
					highlights: collectUniqueHighlights([item.highlights, [phrase]])
				};
			});
			if (matchedAny) return updatedHistory;
			const newHistoryId = existingHistoryId || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
			resolvedHistoryId = newHistoryId;
			const contextSlice = currentMessages.slice(0, targetIndex + 1);
			const lastUserBeforeTarget = [...contextSlice].reverse().find((m) => m.role === "user");
			const historyMessages = contextSlice.map((m) => ({
				id: m.id,
				role: m.role,
				text: m.text || (m.image ? "[Photo attached]" : ""),
				highlights: m.id === messageId ? collectUniqueHighlights([m.highlights, [phrase]]) : m.highlights,
				createdAt: m.createdAt
			}));
			return [{
				id: newHistoryId,
				type: "teacher",
				className: classNameLevel,
				question: lastUserBeforeTarget?.text || "Highlighted Study Note",
				hasImage: Boolean(lastUserBeforeTarget?.image),
				answer: targetMsg.text,
				highlights: collectUniqueHighlights(historyMessages.map((m) => m.highlights)),
				messages: historyMessages,
				createdAt: targetMsg.createdAt || Date.now()
			}, ...updatedHistory].slice(0, MAX_HISTORY_ITEMS);
		});
		setMessages((prev) => prev.map((m) => m.id === messageId ? {
			...m,
			historyId: resolvedHistoryId ?? m.historyId,
			highlights: collectUniqueHighlights([m.highlights, [phrase]])
		} : m));
	}, [classNameLevel]);
	const handleRemoveHighlight = (0, import_react.useCallback)((messageId, rawPhrase) => {
		const phrase = rawPhrase.trim();
		if (!phrase) return;
		const targetHistoryId = messagesRef.current.find((m) => m.id === messageId)?.historyId;
		setMessages((prev) => prev.map((m) => {
			if (m.id !== messageId || !m.highlights) return m;
			const filtered = m.highlights.filter((h) => h !== phrase);
			return {
				...m,
				highlights: filtered.length > 0 ? filtered : void 0
			};
		}));
		setHistory((prevHistory) => prevHistory.map((item) => {
			if (item.type !== "teacher") return item;
			if (!(targetHistoryId && item.id === targetHistoryId || Boolean(item.messages?.some((m) => m.id === messageId)))) return item;
			if (item.messages && item.messages.length > 0) {
				const nextMsgs = item.messages.map((m, idx) => {
					if (!(m.id === messageId || !m.id && m.role === "model" && idx === item.messages.length - 1) || !m.highlights) return m;
					const filtered = m.highlights.filter((h) => h !== phrase);
					return {
						...m,
						highlights: filtered.length > 0 ? filtered : void 0
					};
				});
				return {
					...item,
					messages: nextMsgs,
					highlights: collectUniqueHighlights(nextMsgs.map((m) => m.highlights))
				};
			}
			const filteredItem = item.highlights?.filter((h) => h !== phrase);
			return {
				...item,
				highlights: filteredItem && filteredItem.length > 0 ? filteredItem : void 0
			};
		}));
	}, []);
	const handleRemoveHistoryHighlight = (0, import_react.useCallback)((historyId, rawPhrase) => {
		const phrase = rawPhrase.trim();
		if (!phrase) return;
		setHistory((prevHistory) => prevHistory.map((item) => {
			if (item.type !== "teacher" || item.id !== historyId) return item;
			const nextMsgs = item.messages?.map((m) => {
				if (!m.highlights) return m;
				const filtered = m.highlights.filter((h) => h !== phrase);
				return {
					...m,
					highlights: filtered.length > 0 ? filtered : void 0
				};
			});
			const nextItemHighlights = nextMsgs ? collectUniqueHighlights(nextMsgs.map((m) => m.highlights)) : (() => {
				const filtered = item.highlights?.filter((h) => h !== phrase);
				return filtered && filtered.length > 0 ? filtered : void 0;
			})();
			return {
				...item,
				...nextMsgs ? { messages: nextMsgs } : {},
				highlights: nextItemHighlights
			};
		}));
		setMessages((prev) => prev.map((m) => {
			if (m.historyId !== historyId || !m.highlights) return m;
			const filtered = m.highlights.filter((h) => h !== phrase);
			return {
				...m,
				highlights: filtered.length > 0 ? filtered : void 0
			};
		}));
	}, []);
	const handleAdminLoginSuccess = (payload) => {
		const chosenConfig = (payload.config.configVersion || 1) >= (appConfigRef.current.configVersion || 1) ? payload.config : appConfigRef.current;
		const v = chosenConfig.configVersion || 1;
		setAdminToken(payload.token);
		setAdminUsername(payload.username);
		setAppConfig(chosenConfig);
		saveAppliedConfig(chosenConfig);
		saveAppliedVersion(v);
		setAppliedVersion(v);
		setPendingUpdateConfig(null);
		setUpdateModalOpen(false);
		setClassNameLevel(chosenConfig.defaultClass);
		setAdminStats(payload.stats);
		try {
			localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, payload.token);
		} catch {}
	};
	const handleAdminConfigUpdated = (nextConfig, nextStats) => {
		const v = nextConfig.configVersion || 1;
		setAppConfig(nextConfig);
		saveAppliedConfig(nextConfig);
		saveAppliedVersion(v);
		setAppliedVersion(v);
		setPendingUpdateConfig(null);
		setUpdateModalOpen(false);
		setClassNameLevel(nextConfig.defaultClass);
		if (nextStats) setAdminStats(nextStats);
	};
	const handleConfirmAppUpdate = async () => {
		if (isApplyingUpdate) return;
		setIsApplyingUpdate(true);
		const nextToApply = pendingUpdateConfig ?? appConfigRef.current;
		const targetVer = nextToApply.configVersion || 1;
		saveAppliedConfig(nextToApply);
		saveAppliedVersion(targetVer);
		setAppConfig(nextToApply);
		setAppliedVersion(targetVer);
		await hardRefreshToLatestBuild(targetVer);
	};
	const handleDismissAppUpdate = () => {
		if (pendingUpdateConfig?.configVersion) dismissedVersionRef.current = pendingUpdateConfig.configVersion;
		setUpdateModalOpen(false);
	};
	const handleManualCheckUpdate = async () => {
		if (isCheckingUpdate || isApplyingUpdate) return;
		if (pendingUpdateConfig || hasSwUpdate) {
			setUpdateModalOpen(true);
			return;
		}
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			setUpdateCheckStatus({
				type: "warn",
				text: "অফলাইন মোডে আছেন — নতুন আপডেট চেক করতে একবার ইন্টারনেট অন করুন।"
			});
			return;
		}
		setIsCheckingUpdate(true);
		setUpdateCheckStatus(null);
		try {
			let foundUpdate = false;
			if ("serviceWorker" in navigator) {
				const reg = await Promise.race([navigator.serviceWorker.getRegistration(), new Promise((resolve) => setTimeout(() => resolve(void 0), 2e3))]).catch(() => void 0);
				if (reg) {
					await reg.update().catch(() => {});
					if (reg.waiting || reg.installing) {
						setHasSwUpdate(true);
						foundUpdate = true;
					}
				}
			}
			const ts = Date.now();
			const [cloudCfg, serverPayload, metaPayload] = await Promise.all([
				getLatestFirestoreConfig().catch(() => null),
				fetch(`/api/config?fresh=1&_t=${ts}`, { cache: "no-store" }).then((res) => res.ok ? res.json() : null).catch(() => null),
				fetch(`/build-meta.json?_t=${ts}`, { cache: "no-store" }).then((res) => res.ok ? res.json() : null).catch(() => null)
			]);
			const serverCfg = serverPayload?.config ?? null;
			const remoteBuild = (serverPayload?.buildVersion && serverPayload.buildVersion !== "dev" ? serverPayload.buildVersion : void 0) || metaPayload?.buildId;
			if (remoteBuild && remoteBuild !== "dev" && remoteBuild !== CLIENT_BUILD_VERSION) {
				setHasSwUpdate(true);
				foundUpdate = true;
			}
			let incoming = null;
			if (cloudCfg && serverCfg) incoming = (cloudCfg.configVersion || 1) >= (serverCfg.configVersion || 1) ? cloudCfg : serverCfg;
			else incoming = cloudCfg || serverCfg;
			const currentVer = getStoredAppliedVersion() ?? appliedVersion;
			if (incoming && (incoming.configVersion || 1) > currentVer) {
				setPendingUpdateConfig(incoming);
				dismissedVersionRef.current = null;
				foundUpdate = true;
			} else if (incoming) {
				saveAppliedConfig(incoming);
				setAppConfig(incoming);
			}
			if (foundUpdate) setUpdateModalOpen(true);
			else setUpdateCheckStatus({
				type: "info",
				text: `আপনার অ্যাপটি সম্পূর্ণ আপ-টু-ডেট আছে (v1.0.${incoming?.configVersion ?? appliedVersion}) ✓`
			});
		} catch {
			setUpdateCheckStatus({
				type: "warn",
				text: "এই মুহূর্তে আপডেট সার্ভারের সাথে কানেক্ট করা যায়নি। একটু পর আবার চেষ্টা করুন।"
			});
		} finally {
			setIsCheckingUpdate(false);
		}
	};
	const handleAdminLogout = () => {
		setAdminToken(null);
		setAdminUsername(null);
		setAdminStats(null);
		try {
			localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
		} catch {}
	};
	const openAdminConsole = () => {
		setAdminModalOpen(true);
		if (adminToken) fetch("/api/admin/me", { headers: { Authorization: `Bearer ${adminToken}` } }).then((res) => res.ok ? res.json() : null).then((data) => {
			if (data?.stats) setAdminStats(data.stats);
			if (data?.config) {
				const incomingVer = data.config.configVersion || 1;
				if (incomingVer >= (appConfigRef.current.configVersion || 1)) {
					setAppConfig(data.config);
					saveAppliedConfig(data.config);
					saveAppliedVersion(incomingVer);
					setAppliedVersion(incomingVer);
				}
			}
		}).catch(() => {});
	};
	const showBothDisabled = !appConfig.enableTeacher && !appConfig.enableDictionary;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 h-dvh flex flex-col bg-transparent text-slate-900 dark:text-slate-100 overflow-hidden transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				ref: headerMenuRef,
				className: "relative shrink-0 z-30 wbsec-safe-top bg-[var(--app-header-bg)] backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-2 sm:px-5 lg:px-8 h-11 sm:h-12 flex items-center justify-between gap-1.5 sm:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 sm:gap-3 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#top",
								onClick: (e) => {
									e.preventDefault();
									if (appConfig.enableTeacher) setMode("teacher");
									else if (appConfig.enableDictionary) setMode("dictionary");
								},
								className: "flex items-center gap-1.5 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/pwa-192x192.png",
										alt: "",
										width: 24,
										height: 24,
										className: "w-6 h-6 rounded-lg shrink-0 shadow-xs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[15px] sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap",
										children: appConfig.appName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden xl:inline text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap",
										children: appConfig.attributionText
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleResetSession,
								"aria-label": "New Chat",
								title: "New Chat",
								className: "h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-slate-900 dark:bg-sky-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-slate-800 dark:hover:bg-sky-500 active:scale-[0.97] inline-flex items-center gap-1 transition-all whitespace-nowrap shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Chat"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "hidden lg:flex items-center gap-4 ml-1 text-sm font-medium text-slate-600 dark:text-slate-400 shrink-0",
								children: [appConfig.enableTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode("teacher"),
									className: `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${mode === "teacher" ? "text-slate-900 dark:text-white border-[var(--app-accent)] dark:border-sky-400" : "border-transparent hover:text-slate-900 dark:hover:text-slate-100"}`,
									children: "AI Teacher"
								}), appConfig.enableDictionary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode("dictionary"),
									className: `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${mode === "dictionary" ? "text-slate-900 dark:text-white border-[var(--app-accent)] dark:border-sky-400" : "border-transparent hover:text-slate-900 dark:hover:text-slate-100"}`,
									children: "Dictionary"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 sm:gap-1.5 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden lg:flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setHistoryOpen(true),
										className: "h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-[var(--app-accent)] hover:text-[var(--app-accent)] dark:hover:border-sky-400 dark:hover:text-sky-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookText, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Notes (",
											history.length,
											")"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setOfflineAiModalOpen(true),
										"aria-label": "Offline AI Pack Manager (100 MB, 250 MB, 500 MB)",
										title: "Download or manage Offline AI Packs (100 MB / 250 MB / 500 MB)",
										className: `h-8 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${offlineAiState.status === "downloading" ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-300" : offlineAiState.installedTier ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950" : "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950"}`,
										children: offlineAiState.status === "downloading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"AI ",
											offlineAiState.progress.percent,
											"%"
										] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: offlineAiState.installedTier === "pro" ? "500MB AI ✓" : offlineAiState.installedTier === "standard" ? "250MB AI ✓" : offlineAiState.installedTier === "class8" ? "Class 8 AI ✓" : "Offline AI" })] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void handleManualCheckUpdate(),
										disabled: isCheckingUpdate || isApplyingUpdate,
										"aria-label": "Check for app updates",
										title: pendingUpdateConfig || hasSwUpdate ? "New update ready — tap to update" : "Check for app updates",
										className: `relative h-8 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 ${pendingUpdateConfig || hasSwUpdate ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-white hover:bg-[var(--app-accent-hover)] shadow-xs" : "border-cyan-400/50 dark:border-cyan-500/40 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/50"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 shrink-0 ${isCheckingUpdate ? "animate-spin" : ""}` }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isCheckingUpdate ? "Checking..." : "Update" }),
											(pendingUpdateConfig || hasSwUpdate) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "w-2 h-2 rounded-full bg-amber-300 animate-pulse"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: openAdminConsole,
										"aria-label": adminToken ? "Open Admin Control Panel" : "Admin Login",
										title: adminToken ? `Admin Console (${adminUsername || "Amir123"})` : "Admin Login",
										className: `h-8 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${adminToken ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"}`,
										children: adminToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin" })] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: toggleTheme,
										"aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
										"aria-pressed": theme === "dark",
										title: theme === "dark" ? "Light mode" : "Dark mode",
										className: "h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center justify-center transition-colors shrink-0",
										children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PWAInstallButton, { apkDownloadUrl: appConfig.apkDownloadUrl }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setHeaderMenuOpen((prev) => !prev),
								"aria-expanded": headerMenuOpen,
								"aria-label": "More options (Offline AI, Update, Theme, Admin)",
								title: "আরও অপশন (Offline AI, Update, Theme, Admin)",
								className: `lg:hidden relative h-8 px-2 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors shrink-0 ${headerMenuOpen ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-cyan-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"}`,
								children: [headerMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-4 h-4" }), (pendingUpdateConfig || hasSwUpdate || offlineAiState.status === "downloading") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900 animate-pulse"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setProfileModalOpen(true),
								"aria-label": studentProfile.name ? `${studentProfile.name} — প্রোফাইল ও অ্যাভাটার পরিবর্তন করো` : "প্রোফাইল ও নাম সেট করো",
								title: studentProfile.name ? `${studentProfile.name} (প্রোফাইল বদলাও)` : "আমার প্রোফাইল",
								className: "shrink-0 h-8 pl-0.5 pr-0.5 sm:pr-2 rounded-full border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 hover:border-cyan-400 dark:hover:border-cyan-400 inline-flex items-center gap-1.5 transition-all active:scale-95 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
									profile: studentProfile,
									size: "xs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline max-w-[88px] truncate text-xs font-semibold text-slate-800 dark:text-slate-100",
									children: studentProfile.name || "Profile"
								})]
							})
						]
					})]
				}), headerMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:hidden absolute left-0 right-0 top-full z-40 border-b border-slate-200 dark:border-white/15 bg-white/98 dark:bg-[#0d1020]/98 backdrop-blur-xl shadow-xl px-3 py-2.5",
					"aria-label": "Extra options menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl mx-auto grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setHeaderMenuOpen(false);
									setOfflineAiModalOpen(true);
								},
								className: `min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${offlineAiState.status === "downloading" ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)] dark:text-sky-300" : offlineAiState.installedTier ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" : "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200"}`,
								children: offlineAiState.status === "downloading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"AI ",
									offlineAiState.progress.percent,
									"%"
								] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: offlineAiState.installedTier === "pro" ? "500MB AI ✓" : offlineAiState.installedTier === "standard" ? "250MB AI ✓" : offlineAiState.installedTier === "class8" ? "Class 8 AI ✓" : "Offline AI প্যাক" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setHeaderMenuOpen(false);
									handleManualCheckUpdate();
								},
								disabled: isCheckingUpdate || isApplyingUpdate,
								className: `min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 ${pendingUpdateConfig || hasSwUpdate ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-white shadow-xs" : "border-cyan-400/50 dark:border-cyan-500/40 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 shrink-0 ${isCheckingUpdate ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isCheckingUpdate ? "Checking..." : "App Update" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									toggleTheme();
									setHeaderMenuOpen(false);
								},
								className: "min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-amber-300 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Light Mode" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dark Mode" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setHeaderMenuOpen(false);
									openAdminConsole();
								},
								className: `min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${adminToken ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`,
								children: adminToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin Panel" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin Login" })] })
							})
						]
					})
				})]
			}),
			appConfig.announcementBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 bg-[var(--app-accent-soft)] border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-3.5 h-3.5 text-[var(--app-accent)] dark:text-sky-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: appConfig.announcementBanner })]
			}),
			(pendingUpdateConfig || hasSwUpdate) && !updateModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-900 px-3 py-1.5 flex items-center justify-center gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium text-emerald-900 dark:text-emerald-200",
					children: [
						"Update v1.0.",
						pendingUpdateConfig?.configVersion ?? appliedVersion,
						" is ready"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setUpdateModalOpen(true),
					className: "min-h-[28px] px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 inline-flex items-center gap-1 whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "w-3.5 h-3.5" }), "Update & Restart"]
				})]
			}),
			justUpdatedNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"অ্যাপ আপডেট হয়ে গেছে (v1.0.",
					justUpdatedNotice,
					") — এখন অফলাইনেও ব্যবহার করা যাবে।"
				] })]
			}),
			offlineReadyNotice && !justUpdatedNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "অফলাইন পড়াশোনার জন্য অ্যাপ সেভ হয়ে গেছে — এখন রিচার্জ ছাড়াই চলবে!" })]
			}),
			updateCheckStatus && !justUpdatedNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `shrink-0 px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 ${updateCheckStatus.type === "warn" ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: updateCheckStatus.text })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "top",
				className: "flex-1 min-h-0 max-w-7xl w-full mx-auto px-0 sm:px-5 lg:px-8 py-0 sm:py-2 flex flex-col",
				children: appConfig.maintenanceMode || showBothDisabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 flex items-center justify-center p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-lg font-bold text-slate-900 dark:text-white",
									children: appConfig.maintenanceMode ? "App Maintenance Active" : "Programs Paused by Admin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
									children: appConfig.maintenanceMode ? appConfig.maintenanceMessage : "All study modules are currently disabled by Admin."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: openAdminConsole,
								className: "min-h-[42px] px-4 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), adminToken ? "Open Admin Console" : "Admin Login"]
							})
						]
					})
				}) : mode === "teacher" && appConfig.enableTeacher ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 min-h-0 flex flex-col",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherWorkspace, {
						classNameLevel,
						onClassChange: handleClassLevelChange,
						messages,
						draftText,
						onDraftTextChange: (val) => {
							setDraftText(val);
							if (teacherValidation) setTeacherValidation(null);
						},
						image,
						onImageChange: (img) => {
							setImage(img);
							if (teacherValidation) setTeacherValidation(null);
						},
						isStreaming,
						error: teacherError,
						validationError: teacherValidation,
						onSendMessage: handleSendMessage,
						onStopStreaming: handleStopStreaming,
						onReset: handleResetSession,
						latestCompletedAssistantId,
						shouldAutoSpeakLatest,
						onHandledAutoSpeak: () => setShouldAutoSpeakLatest(false),
						isSpeechSupported,
						isListening,
						isTranscribing,
						interimTranscript,
						speechLang,
						onSpeechLangChange: (nextLang) => setSpeechLang(nextLang),
						speechError,
						onToggleListening: toggleListening,
						onStopListening: stopListening,
						onSaveLiveTranscripts: handleSaveLiveTranscripts,
						onAddHighlight: handleAddHighlight,
						onRemoveHighlight: handleRemoveHighlight,
						isOnline,
						offlineAiReady: Boolean(offlineAiState.installedTier),
						offlineAiTier: offlineAiState.installedTier,
						onOpenOfflineAiPack: () => setOfflineAiModalOpen(true),
						openLiveCounter,
						onOpenOfflineTopic: handleOpenOfflineTopic,
						studentProfile,
						onOpenProfile: () => setProfileModalOpen(true),
						appConfig
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 min-h-0 overflow-y-auto pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DictionaryWorkspace, {
							word: dictWord,
							onWordChange: (val) => {
								setDictWord(val);
								if (dictValidation) setDictValidation(null);
							},
							entry: dictEntry,
							isLoading: dictLoading,
							error: dictError,
							validationError: dictValidation,
							onSearch: handleDictionarySearch,
							isOnline,
							offlineSuggestions: dictOfflineSuggestions,
							appConfig
						})
					})
				})
			}),
			(appConfig.enableTeacher || appConfig.enableDictionary) && !appConfig.maintenanceMode && !showBothDisabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Mobile app navigation",
				className: "lg:hidden shrink-0 z-30 wbsec-safe-bottom bg-[var(--app-header-bg)] backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 h-11 max-w-xl mx-auto px-1",
					children: [
						appConfig.enableTeacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMode("teacher"),
							className: `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${mode === "teacher" ? "text-fuchsia-600 dark:text-cyan-300" : "text-slate-500 dark:text-slate-400"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Teacher" })]
						}),
						appConfig.enableDictionary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMode("dictionary"),
							className: `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${mode === "dictionary" ? "text-fuchsia-600 dark:text-cyan-300" : "text-slate-500 dark:text-slate-400"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dictionary" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setHistoryOpen(true),
							className: "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 active:scale-95 transition-transform",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookText, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Notes (",
								history.length,
								")"
							] })]
						})
					]
				})
			}),
			historyOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryDrawer, {
					isOpen: historyOpen,
					onClose: () => setHistoryOpen(false),
					items: history,
					onSelect: handleSelectHistory,
					onClearAll: () => setHistory([]),
					onRemoveHighlight: handleRemoveHistoryHighlight
				})
			}),
			adminModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminModal, {
					isOpen: adminModalOpen,
					onClose: () => setAdminModalOpen(false),
					token: adminToken,
					adminUsername,
					firebaseUser,
					currentConfig: appConfig,
					stats: adminStats,
					onLoginSuccess: handleAdminLoginSuccess,
					onConfigUpdated: handleAdminConfigUpdated,
					onLogout: handleAdminLogout
				})
			}),
			offlineAiModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineAiPackModal, {
					isOpen: offlineAiModalOpen,
					onClose: () => setOfflineAiModalOpen(false),
					isOnline,
					onOpenLiveOffline: () => {
						setMode("teacher");
						setOpenLiveCounter((c) => c + 1);
					}
				})
			}),
			updateModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppUpdateModal, {
					isOpen: updateModalOpen,
					currentVersion: appliedVersion,
					pendingConfig: pendingUpdateConfig,
					hasSwUpdate,
					isApplying: isApplyingUpdate,
					onConfirmUpdate: handleConfirmAppUpdate,
					onDismiss: handleDismissAppUpdate
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentOnboardingModal, {
				isOpen: !studentProfile.onboardingCompleted && !appConfig.maintenanceMode && !showBothDisabled,
				appName: appConfig.appName,
				initialClass: classNameLevel,
				onComplete: handleSaveStudentProfile
			}),
			profileModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentProfileModal, {
					isOpen: profileModalOpen,
					onClose: () => setProfileModalOpen(false),
					profile: studentProfile,
					currentClass: classNameLevel,
					onSave: handleSaveStudentProfile
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineIndicator, {})
		]
	});
}
// src/components/ErrorBoundary.tsx
var ErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			message: ""
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			message: error instanceof Error ? error.message : String(error)
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("Application ErrorBoundary caught:", error, errorInfo);
	}
	render() {
		if (!this.state.hasError) return this.props.children;
		let displayDetail = this.state.message;
		try {
			const parsed = JSON.parse(this.state.message);
			if (parsed?.error) displayDetail = parsed.path ? `${parsed.error} (${parsed.path})` : parsed.error;
		} catch {}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-dvh flex items-center justify-center bg-[#F5F7FA] dark:bg-slate-950 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6 text-center space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: "Something went wrong"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words",
							children: displayDetail || "An unexpected error occurred while loading the app."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => window.location.reload(),
						className: "min-h-[42px] px-5 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-sm font-semibold inline-flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), "Reload App"]
					})
				]
			})
		});
	}
};
// src/main.tsx
registerSW({
	immediate: true,
	onNeedRefresh() {
		window.dispatchEvent(new CustomEvent("wbsec:sw-update-ready"));
	},
	onOfflineReady() {
		window.dispatchEvent(new CustomEvent("wbsec:offline-ready"));
	},
	onRegisteredSW(_swUrl, registration) {
		if (!registration) return;
		const triggerCheck = () => {
			if (navigator.onLine) registration.update().catch(() => {});
		};
		triggerCheck();
		window.setInterval(triggerCheck, 3e4);
		window.addEventListener("online", triggerCheck);
		window.addEventListener("focus", triggerCheck);
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") triggerCheck();
		});
	}
});
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}) }));
export { publishAppSettingsToFirestore as A, useVoicePlayer as C, compressAvatarImageFile as D, StudentAvatar as E, signOutFirebaseAdmin as M, DEFAULT_APP_CONFIG as N, ADMIN_EMAILS as O, __vitePreload as P, generateDictionaryPdf as S, AVATAR_PRESET_OPTIONS as T, refreshOfflineAiStorageInfo as _, loadCachedTeacherAnswers as a, OFFLINE_AI_PACKS as b, abortOfflineAiGeneration as c, extractTextFromImageOffline as d, formatBytesCompact as f, isOfflineFeatureAllowed as g, isOfflineAiPackInstalled as h, answerOfflineQuestion as i, signInAdminWithGoogle as j, isAuthorizedAdminUser as k, deleteOfflineAiPack as l, getOfflineAiState as m, OFFLINE_STUDY_TOPICS as n, useOnlineStatus as o, generateOfflineLiveReply as p, OFFLINE_SUBJECTS as r, useSpeechRecognition as s, getAllOfflineDictionaryWords as t, downloadOfflineAiPack as u, subscribeOfflineAiState as v, AVATAR_COLOR_OPTIONS as w, OFFLINE_AI_PACK_ORDER as x, transcribeOfflineAudio as y };
