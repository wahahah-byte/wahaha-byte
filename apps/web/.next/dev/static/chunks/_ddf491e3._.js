(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/HeaderNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeaderNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const LINKS = [
    {
        href: "/",
        label: "To Do",
        activeColor: "var(--color-active-highlight)"
    },
    {
        href: "/recurring",
        label: "Routines",
        activeColor: "var(--color-active-highlight-alt)"
    },
    {
        href: "/archive",
        label: "Archive",
        activeColor: "var(--color-accent)"
    }
];
function HeaderNav() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    if (pathname === "/login" || pathname === "/register") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "hidden sm:flex items-center gap-1",
        children: LINKS.map((l)=>{
            const active = pathname === l.href;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: l.href,
                className: "px-3 py-1.5 transition-colors",
                style: {
                    color: active ? l.activeColor : "var(--color-fg-muted)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: active ? 600 : 500,
                    borderBottom: active ? `1px solid ${l.activeColor}` : "1px solid transparent"
                },
                children: l.label
            }, l.href, false, {
                fileName: "[project]/apps/web/src/components/HeaderNav.tsx",
                lineNumber: 21,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/HeaderNav.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(HeaderNav, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = HeaderNav;
var _c;
__turbopack_context__.k.register(_c, "HeaderNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/context/PointsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PointsProvider",
    ()=>PointsProvider,
    "usePoints",
    ()=>usePoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const PointsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function PointsProvider({ children }) {
    _s();
    const [balance, setBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profilePictureUrl, setProfilePictureUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stagedPoints, setStagedPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [unsubmittedPoints, setUnsubmittedPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [dailySubmitted, setDailySubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [recurringSubmittedToday, setRecurringSubmittedToday] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    function updateStaged(delta, reset = false) {
        if (reset) setStagedPoints(0);
        else setStagedPoints((p)=>p + delta);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PointsContext.Provider, {
        value: {
            balance,
            username,
            profilePictureUrl,
            stagedPoints,
            unsubmittedPoints,
            dailySubmitted,
            recurringSubmittedToday,
            setBalance,
            setUsername,
            setProfilePictureUrl,
            setUnsubmittedPoints,
            setDailySubmitted,
            setRecurringSubmittedToday,
            updateStaged
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/context/PointsContext.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(PointsProvider, "RR+msOADbSxN8DMqATr9+2r/cTs=");
_c = PointsProvider;
function usePoints() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PointsContext);
    if (!ctx) throw new Error("usePoints must be used within PointsProvider");
    return ctx;
}
_s1(usePoints, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "PointsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/context/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const STORAGE_KEY = "theme";
function readInitialTheme() {
    if (typeof document === "undefined") return "dark";
    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "light" ? "light" : "dark";
}
function ThemeProvider({ children }) {
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(readInitialTheme);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            document.documentElement.setAttribute("data-theme", theme);
            try {
                localStorage.setItem(STORAGE_KEY, theme);
            } catch  {}
        }
    }["ThemeProvider.useEffect"], [
        theme
    ]);
    const setTheme = (t)=>setThemeState(t);
    const toggleTheme = ()=>setThemeState((t)=>t === "dark" ? "light" : "dark");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            toggleTheme,
            setTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/context/ThemeContext.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "zMS9yxijOQjYzp01l3MGiUQauu8=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
_s1(useTheme, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/api/users.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUsersApi",
    ()=>createUsersApi
]);
function createUsersApi(client) {
    return {
        getMe: ()=>client.authedGet("/api/users/me"),
        submitPoints: (taskIds)=>client.authedPost("/api/points/submit", {
                taskIds
            }),
        deleteProfilePicture: ()=>client.authedDelete("/api/users/me/profile-picture")
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createApiClient",
    ()=>createApiClient
]);
async function buildHeaders(config, auth, extra, withJsonContentType = true) {
    const headers = {};
    if (withJsonContentType) headers["Content-Type"] = "application/json";
    const tz = config.getTimezoneOffset?.();
    if (typeof tz === "number") headers["X-Timezone-Offset"] = String(tz);
    if (auth && config.getToken) {
        const token = await config.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    if (extra) Object.assign(headers, extra);
    return headers;
}
async function parseError(res) {
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        return Array.isArray(json) ? json.join(" ") : String(json);
    } catch  {
        return text || res.statusText;
    }
}
async function formDataRequest(config, path, form, method) {
    let res;
    try {
        const headers = await buildHeaders(config, true, undefined, false);
        res = await fetch(`${config.baseUrl}${path}`, {
            method,
            body: form,
            headers
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Network error";
        return {
            data: null,
            error: msg,
            status: 0
        };
    }
    if (!res.ok) return {
        data: null,
        error: await parseError(res),
        status: res.status
    };
    if (res.status === 204) return {
        data: null,
        error: null
    };
    try {
        return {
            data: await res.json(),
            error: null
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Response parse error";
        return {
            data: null,
            error: msg,
            status: res.status
        };
    }
}
async function apiFetch(config, path, init, auth) {
    let res;
    try {
        const headers = await buildHeaders(config, auth, init.headers);
        res = await fetch(`${config.baseUrl}${path}`, {
            ...init,
            headers
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Network error";
        return {
            data: null,
            error: msg,
            status: 0
        };
    }
    if (!res.ok) {
        return {
            data: null,
            error: await parseError(res),
            status: res.status
        };
    }
    if (res.status === 204) return {
        data: null,
        error: null
    };
    try {
        return {
            data: await res.json(),
            error: null
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Response parse error";
        return {
            data: null,
            error: msg,
            status: res.status
        };
    }
}
function createApiClient(config) {
    return {
        get: (path, init)=>apiFetch(config, path, {
                method: "GET",
                ...init
            }, false),
        post: (path, body, init)=>apiFetch(config, path, {
                method: "POST",
                body: JSON.stringify(body),
                ...init
            }, false),
        authedGet: (path, init)=>apiFetch(config, path, {
                method: "GET",
                ...init
            }, true),
        authedPost: (path, body, init)=>apiFetch(config, path, {
                method: "POST",
                body: JSON.stringify(body),
                ...init
            }, true),
        authedPut: (path, body, init)=>apiFetch(config, path, {
                method: "PUT",
                body: JSON.stringify(body),
                ...init
            }, true),
        authedPatch: (path, body, init)=>apiFetch(config, path, {
                method: "PATCH",
                ...body !== undefined ? {
                    body: JSON.stringify(body)
                } : {},
                ...init
            }, true),
        authedDelete: (path, init)=>apiFetch(config, path, {
                method: "DELETE",
                ...init
            }, true),
        authedPostFormData: async (path, form)=>formDataRequest(config, path, form, "POST"),
        authedPutFormData: async (path, form)=>formDataRequest(config, path, form, "PUT")
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient,
    "authedDelete",
    ()=>authedDelete,
    "authedGet",
    ()=>authedGet,
    "authedPatch",
    ()=>authedPatch,
    "authedPost",
    ()=>authedPost,
    "authedPostFormData",
    ()=>authedPostFormData,
    "authedPut",
    ()=>authedPut,
    "authedPutFormData",
    ()=>authedPutFormData,
    "get",
    ()=>get,
    "post",
    ()=>post
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/api/client.ts [app-client] (ecmascript)");
;
const isBrowser = ("TURBOPACK compile-time value", "object") !== "undefined";
const apiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createApiClient"])({
    baseUrl: ("TURBOPACK compile-time truthy", 1) ? "/backend" : "TURBOPACK unreachable",
    getToken: ()=>("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("auth_token") : "TURBOPACK unreachable",
    getTimezoneOffset: ()=>("TURBOPACK compile-time truthy", 1) ? new Date().getTimezoneOffset() : "TURBOPACK unreachable"
});
const { get, post, authedGet, authedPost, authedPut, authedPatch, authedDelete, authedPostFormData, authedPutFormData } = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/imageResize.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Client-side image resize for profile picture uploads. Phone cameras shoot
// 5–10 MB JPEGs we never need at full resolution — a profile picture renders
// at a few hundred pixels at most. Resizing in the browser before the upload
// avoids storing and serving the raw image, and keeps the request well under
// the backend's 1 MB cap.
__turbopack_context__.s([
    "resizeImage",
    ()=>resizeImage
]);
const DEFAULTS = {
    maxDimension: 256,
    quality: 0.85,
    type: "image/jpeg"
};
// Loads the file into a real <img> first so the browser handles every format
// it natively understands (JPEG, PNG, WebP, GIF, AVIF, HEIC on Safari…).
function loadImage(file) {
    return new Promise((resolve, reject)=>{
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = ()=>{
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = ()=>{
            URL.revokeObjectURL(url);
            reject(new Error("Could not read image"));
        };
        img.src = url;
    });
}
async function resizeImage(file, options = {}) {
    const { maxDimension, quality, type } = {
        ...DEFAULTS,
        ...options
    };
    const img = await loadImage(file);
    const { naturalWidth: w, naturalHeight: h } = img;
    // Don't upscale — if the source is already smaller than the target, just
    // re-encode at the target type/quality so we still get a size win.
    const scale = Math.min(1, maxDimension / Math.max(w, h));
    const targetW = Math.round(w * scale);
    const targetH = Math.round(h * scale);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context is unavailable");
    // imageSmoothingQuality is implementation-specific but "high" gives a
    // markedly better downscale than the default. JPEG-only flag — harmless
    // for PNG.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetW, targetH);
    return new Promise((resolve, reject)=>{
        canvas.toBlob((blob)=>blob ? resolve(blob) : reject(new Error("Canvas encoding failed")), type, quality);
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/api/users.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usersApi",
    ()=>usersApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/api/users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$imageResize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/imageResize.ts [app-client] (ecmascript)");
;
;
;
const sharedUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUsersApi"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"]);
const usersApi = {
    ...sharedUsers,
    uploadProfilePicture: async (file)=>{
        const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$imageResize$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resizeImage"])(file, {
            maxDimension: 256,
            type: "image/jpeg",
            quality: 0.85
        });
        const form = new FormData();
        form.append("file", blob, "profile.jpg");
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].authedPostFormData("/api/users/me/profile-picture", form);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/constants.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/tasks/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "CATEGORY_COLOR",
    ()=>CATEGORY_COLOR,
    "COUNTER_UNITS",
    ()=>COUNTER_UNITS,
    "FILTERS",
    ()=>FILTERS,
    "PER_CATEGORY_RECURRING_DAILY_CAP",
    ()=>PER_CATEGORY_RECURRING_DAILY_CAP,
    "PER_CATEGORY_REGULAR_DAILY_CAP",
    ()=>PER_CATEGORY_REGULAR_DAILY_CAP,
    "PER_TASK_VALUE_CAP",
    ()=>PER_TASK_VALUE_CAP,
    "PRIORITY_DOT",
    ()=>PRIORITY_DOT,
    "RECURRING_CAP",
    ()=>RECURRING_CAP,
    "RECURRING_FILTERS",
    ()=>RECURRING_FILTERS,
    "REGULAR_CAP",
    ()=>REGULAR_CAP,
    "maxPointsFor",
    ()=>maxPointsFor
]);
const CATEGORIES = [
    "Career",
    "Design",
    "Dev",
    "Finance",
    "Fitness",
    "Habits",
    "Health",
    "Learning",
    "Other",
    "Personal",
    "Productivity",
    "Study",
    "Work"
];
const CATEGORY_COLOR = {
    Career: "#e0cc84",
    Design: "#eeaacf",
    Dev: "#94d9d6",
    Finance: "#9ed4a6",
    Fitness: "#f2b88c",
    Habits: "#ccaae8",
    Health: "#8ed9be",
    Learning: "#94bce8",
    Other: "#b8b8c2",
    Personal: "#f0a8bb",
    Productivity: "#cce870",
    Study: "#aeaee0",
    Work: "#b4c4d8"
};
const PRIORITY_DOT = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e"
};
const FILTERS = [
    {
        label: "All",
        shortLabel: "All",
        value: "all"
    },
    {
        label: "Pending",
        shortLabel: "Pending",
        value: "pending"
    },
    {
        label: "In Progress",
        shortLabel: "Active",
        value: "in_progress"
    },
    {
        label: "Completed",
        shortLabel: "Done",
        value: "completed"
    }
];
const RECURRING_FILTERS = [
    {
        label: "All",
        shortLabel: "All",
        value: "all"
    },
    {
        label: "Today",
        shortLabel: "Today",
        value: "today"
    },
    {
        label: "Upcoming",
        shortLabel: "Upcoming",
        value: "upcoming"
    },
    {
        label: "Missed",
        shortLabel: "Missed",
        value: "missed"
    }
];
const REGULAR_CAP = 200;
const RECURRING_CAP = 200;
const PER_CATEGORY_REGULAR_DAILY_CAP = 50;
const PER_CATEGORY_RECURRING_DAILY_CAP = 50;
const PER_TASK_VALUE_CAP = {
    Career: 25,
    Dev: 25,
    Design: 25,
    Learning: 25,
    Study: 25,
    Work: 25,
    Finance: 20,
    Health: 20,
    Productivity: 20,
    Fitness: 15,
    Personal: 15,
    Other: 15,
    Habits: 10
};
function maxPointsFor(category) {
    return PER_TASK_VALUE_CAP[category] ?? 25;
}
const COUNTER_UNITS = [
    "words",
    "pages",
    "chapters",
    "minutes",
    "hours",
    "workouts",
    "km",
    "miles",
    "steps",
    "glasses",
    "calories",
    "items",
    "tasks"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/MobileEdgeDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileEdgeDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/PointsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const ITEMS = [
    {
        href: "/",
        label: "To Do"
    },
    {
        href: "/recurring",
        label: "Routines"
    },
    {
        href: "/archive",
        label: "Archive"
    }
];
const DRAWER_WIDTH = 220; // wide enough for icon + uppercase label side-by-side
const COMMIT_FRACTION = 0.5; // drag must cross this fraction of DRAWER_WIDTH to commit
const AXIS_DEADZONE = 8;
function MobileEdgeDrawer() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { username, profilePictureUrl, balance, unsubmittedPoints, dailySubmitted, recurringSubmittedToday, setBalance, setUsername, setProfilePictureUrl, setDailySubmitted, setRecurringSubmittedToday } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePoints"])();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [hasToken, setHasToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [accountMenuOpen, setAccountMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileEdgeDrawer.useEffect": ()=>{
            const token = !!localStorage.getItem("auth_token");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasToken(token);
            if (!token) return;
            // Mobile no longer renders <AuthHeader>, so this drawer is responsible
            // for hydrating the points context on every route change.
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usersApi"].getMe().then({
                "MobileEdgeDrawer.useEffect": ({ data })=>{
                    if (!data) return;
                    setBalance(data.currentBalance);
                    setUsername(data.username);
                    setProfilePictureUrl(data.profilePictureUrl ?? null);
                    setDailySubmitted(data.pointsSubmittedToday ?? 0);
                    setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
                }
            }["MobileEdgeDrawer.useEffect"]);
        }
    }["MobileEdgeDrawer.useEffect"], [
        pathname,
        setBalance,
        setUsername,
        setProfilePictureUrl,
        setDailySubmitted,
        setRecurringSubmittedToday
    ]);
    // Close the account popup whenever the drawer itself closes — covers
    // swipe-to-close, backdrop tap, route change, and Escape key.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileEdgeDrawer.useEffect": ()=>{
            if (!open) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setAccountMenuOpen(false);
            }
        }
    }["MobileEdgeDrawer.useEffect"], [
        open
    ]);
    const [dragX, setDragX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Track viewport so we can disable the drawer + its document-level swipe
    // listeners on desktop (>=1024px), where DesktopSidebar replaces it.
    const [isDesktop, setIsDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Defer the portal until after hydration so server (no DOM) and first client
    // render both return null — otherwise React sees a mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileEdgeDrawer.useEffect": ()=>{
            setMounted(true);
        }
    }["MobileEdgeDrawer.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileEdgeDrawer.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const mq = window.matchMedia("(min-width: 880px)");
            const update = {
                "MobileEdgeDrawer.useEffect.update": ()=>setIsDesktop(mq.matches)
            }["MobileEdgeDrawer.useEffect.update"];
            update();
            mq.addEventListener("change", update);
            return ({
                "MobileEdgeDrawer.useEffect": ()=>mq.removeEventListener("change", update)
            })["MobileEdgeDrawer.useEffect"];
        }
    }["MobileEdgeDrawer.useEffect"], []);
    // Escape closes (mostly defensive — mobile-only component).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileEdgeDrawer.useEffect": ()=>{
            if (!open) return;
            function onKey(e) {
                if (e.key === "Escape") setOpen(false);
            }
            document.addEventListener("keydown", onKey);
            return ({
                "MobileEdgeDrawer.useEffect": ()=>document.removeEventListener("keydown", onKey)
            })["MobileEdgeDrawer.useEffect"];
        }
    }["MobileEdgeDrawer.useEffect"], [
        open
    ]);
    // Lock body scroll while the drawer is open so the page underneath doesn't scroll.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileEdgeDrawer.useEffect": ()=>{
            if (!open) return;
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return ({
                "MobileEdgeDrawer.useEffect": ()=>{
                    document.body.style.overflow = prev;
                }
            })["MobileEdgeDrawer.useEffect"];
        }
    }["MobileEdgeDrawer.useEffect"], [
        open
    ]);
    // Document-level open gesture: when the drawer is closed, any horizontal
    // right-swipe on the page opens the drawer. Swipes that begin on a row that
    // is currently revealed are owned by the row's swipe-to-close gesture and
    // must not also trigger the drawer; swipes elsewhere in the task list panel
    // (closed rows, empty area) do open the drawer. The bottom action bar, the
    // filter strip + handle, and any open modal opt out via the
    // data-edge-drawer-block attributes so their gestures stay intact.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileEdgeDrawer.useEffect": ()=>{
            if (open || isDesktop) return;
            const dragXRef = {
                current: null
            };
            function onStart(e) {
                if (e.touches.length > 1) return;
                const t = e.touches[0];
                const target = e.target;
                // A revealed row's right-swipe must close that row, not open the drawer.
                if (target?.closest('.task-row-wrapper[data-revealed="true"]')) return;
                // Bottom action bar, filter tray + handle, and any open modal mark
                // themselves with this attribute so their gestures aren't hijacked.
                if (target?.closest("[data-edge-drawer-block]")) return;
                // Some elements (the FilterTray handle pill) are visually narrow but
                // sit in a row a user is likely reaching for — block the entire
                // horizontal band at that Y.
                const rowBlockers = document.querySelectorAll("[data-edge-drawer-block-row]");
                for(let i = 0; i < rowBlockers.length; i++){
                    const r = rowBlockers[i].getBoundingClientRect();
                    if (t.clientY >= r.top && t.clientY <= r.bottom) return;
                }
                dragRef.current = {
                    startX: t.clientX,
                    startY: t.clientY,
                    startedOpen: false,
                    locked: null
                };
                dragXRef.current = null;
            }
            function onMove(e) {
                const d = dragRef.current;
                if (!d) return;
                const t = e.touches[0];
                const dx = t.clientX - d.startX;
                const dy = t.clientY - d.startY;
                if (d.locked === null) {
                    if (Math.abs(dx) < AXIS_DEADZONE && Math.abs(dy) < AXIS_DEADZONE) return;
                    // The closed-drawer open gesture is right-swipe only. A leftward
                    // horizontal motion shouldn't render a transparent backdrop or fight
                    // with a task row's reveal swipe.
                    if (Math.abs(dx) > Math.abs(dy) && dx > 0) {
                        d.locked = "h";
                    } else {
                        d.locked = "v";
                        dragRef.current = null;
                        return;
                    }
                }
                if (d.locked === "h") {
                    const targetX = Math.max(-DRAWER_WIDTH, Math.min(0, -DRAWER_WIDTH + dx));
                    dragXRef.current = targetX;
                    setDragX(targetX);
                }
            }
            function onEnd() {
                const d = dragRef.current;
                if (!d) return;
                dragRef.current = null;
                const final = dragXRef.current;
                dragXRef.current = null;
                setDragX(null);
                if (d.locked !== "h" || final === null) return;
                const openIfPast = -DRAWER_WIDTH + DRAWER_WIDTH * COMMIT_FRACTION;
                if (final > openIfPast) setOpen(true);
            }
            document.addEventListener("touchstart", onStart, {
                passive: true
            });
            document.addEventListener("touchmove", onMove, {
                passive: true
            });
            document.addEventListener("touchend", onEnd);
            document.addEventListener("touchcancel", onEnd);
            return ({
                "MobileEdgeDrawer.useEffect": ()=>{
                    document.removeEventListener("touchstart", onStart);
                    document.removeEventListener("touchmove", onMove);
                    document.removeEventListener("touchend", onEnd);
                    document.removeEventListener("touchcancel", onEnd);
                }
            })["MobileEdgeDrawer.useEffect"];
        }
    }["MobileEdgeDrawer.useEffect"], [
        open,
        isDesktop
    ]);
    const onTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MobileEdgeDrawer.useCallback[onTouchStart]": (e)=>{
            const t = e.touches[0];
            dragRef.current = {
                startX: t.clientX,
                startY: t.clientY,
                startedOpen: open,
                locked: null
            };
        }
    }["MobileEdgeDrawer.useCallback[onTouchStart]"], [
        open
    ]);
    const onTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MobileEdgeDrawer.useCallback[onTouchMove]": (e)=>{
            const d = dragRef.current;
            if (!d) return;
            const t = e.touches[0];
            const dx = t.clientX - d.startX;
            const dy = t.clientY - d.startY;
            if (d.locked === null) {
                if (Math.abs(dx) < AXIS_DEADZONE && Math.abs(dy) < AXIS_DEADZONE) return;
                if (Math.abs(dx) > Math.abs(dy)) {
                    d.locked = "h";
                    // Hide the account popup the moment the drawer starts dragging so
                    // it doesn't translate along with the panel mid-swipe.
                    setAccountMenuOpen(false);
                } else {
                    d.locked = "v";
                    dragRef.current = null;
                    return;
                }
            }
            if (d.locked === "h") {
                const baseX = d.startedOpen ? 0 : -DRAWER_WIDTH;
                const targetX = Math.max(-DRAWER_WIDTH, Math.min(0, baseX + dx));
                setDragX(targetX);
            }
        }
    }["MobileEdgeDrawer.useCallback[onTouchMove]"], []);
    const onTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MobileEdgeDrawer.useCallback[onTouchEnd]": ()=>{
            const d = dragRef.current;
            dragRef.current = null;
            if (!d) return;
            const final = dragX;
            setDragX(null);
            if (d.locked !== "h" || final === null) return;
            // Snap based on how far past the threshold we've dragged.
            const openIfPast = -DRAWER_WIDTH + DRAWER_WIDTH * COMMIT_FRACTION;
            const closeIfBefore = -DRAWER_WIDTH * COMMIT_FRACTION;
            if (d.startedOpen) {
                // open → close requires dragging left past the close threshold
                if (final < closeIfBefore) setOpen(false);
            } else {
                // closed → open requires dragging right past the open threshold
                if (final > openIfPast) setOpen(true);
            }
        }
    }["MobileEdgeDrawer.useCallback[onTouchEnd]"], [
        dragX
    ]);
    if (!mounted) return null;
    // On desktop the static DesktopSidebar replaces this drawer entirely.
    if (isDesktop) return null;
    if (pathname === "/login" || pathname === "/register") return null;
    // Where the drawer's left edge sits — interpolated during a drag, snapped otherwise.
    const drawerX = dragX !== null ? dragX : open ? 0 : -DRAWER_WIDTH;
    const visibleFraction = (drawerX + DRAWER_WIDTH) / DRAWER_WIDTH;
    const isActive = open || dragX !== null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                className: "sm:hidden",
                onClick: ()=>setOpen(false),
                onTouchStart: onTouchStart,
                onTouchMove: onTouchMove,
                onTouchEnd: onTouchEnd,
                onTouchCancel: onTouchEnd,
                style: {
                    position: "fixed",
                    inset: 0,
                    background: `rgba(0, 0, 0, ${0.4 * visibleFraction})`,
                    transition: dragX !== null ? "none" : "background 0.22s",
                    zIndex: 39
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 252,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Page navigation",
                className: "sm:hidden",
                style: {
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: DRAWER_WIDTH,
                    background: "var(--color-header)",
                    borderRight: "1px solid var(--color-border-soft)",
                    boxShadow: isActive ? "2px 0 14px rgba(0, 0, 0, 0.25)" : "none",
                    transform: `translateX(${drawerX}px)`,
                    transition: dragX !== null ? "none" : "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                    zIndex: 40,
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: `calc(12px + env(safe-area-inset-top, 0px))`,
                    paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))`,
                    overflow: "hidden"
                },
                onTouchStart: onTouchStart,
                onTouchMove: onTouchMove,
                onTouchEnd: onTouchEnd,
                onTouchCancel: onTouchEnd,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column"
                    },
                    children: [
                        !hasToken && (()=>{
                            const active = pathname === "/avatar";
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/avatar",
                                onClick: ()=>setOpen(false),
                                className: "flex items-center",
                                style: {
                                    height: 44,
                                    gap: 12,
                                    padding: "0 16px",
                                    color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                    background: active ? "var(--color-active-highlight-bg)" : "transparent",
                                    borderLeft: `2px solid ${active ? "var(--color-active-highlight)" : "transparent"}`,
                                    textDecoration: "none",
                                    lineHeight: 1,
                                    transition: "background 0.18s, color 0.18s"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 18,
                                            flexShrink: 0
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AvatarIcon, {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                            lineNumber: 324,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 323,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                            fontWeight: active ? 600 : 500
                                        },
                                        children: "Avatar"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 326,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                lineNumber: 307,
                                columnNumber: 15
                            }, this);
                        })(),
                        ITEMS.map((item)=>{
                            const active = pathname === item.href;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                onClick: ()=>setOpen(false),
                                className: "flex items-center",
                                style: {
                                    height: 44,
                                    gap: 12,
                                    padding: "0 16px",
                                    color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                    background: active ? "var(--color-active-highlight-bg)" : "transparent",
                                    borderLeft: `2px solid ${active ? "var(--color-active-highlight)" : "transparent"}`,
                                    textDecoration: "none",
                                    lineHeight: 1,
                                    transition: "background 0.18s, color 0.18s"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 18,
                                            flexShrink: 0
                                        },
                                        children: item.label === "To Do" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TasksIcon, {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                            lineNumber: 353,
                                            columnNumber: 45
                                        }, this) : item.label === "Routines" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RecurringIcon, {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                            lineNumber: 354,
                                            columnNumber: 51
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArchiveIcon, {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                            lineNumber: 355,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 352,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                            fontWeight: active ? 600 : 500
                                        },
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 357,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                lineNumber: 335,
                                columnNumber: 15
                            }, this);
                        }),
                        hasToken && balance !== null && (()=>{
                            const regSubmitted = Math.min(dailySubmitted - recurringSubmittedToday, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGULAR_CAP"]);
                            const recSubmitted = Math.min(recurringSubmittedToday, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_CAP"]);
                            const regPct = Math.round(regSubmitted / __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGULAR_CAP"] * 100);
                            const recPct = Math.round(recSubmitted / __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_CAP"] * 100);
                            const regCapped = regSubmitted >= __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGULAR_CAP"];
                            const recCapped = recSubmitted >= __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_CAP"];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "12px 14px 10px",
                                    borderTop: "1px solid var(--color-border-soft)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 9,
                                                    color: "var(--color-fg-subtle)",
                                                    letterSpacing: "0.18em",
                                                    textTransform: "uppercase",
                                                    fontWeight: 600
                                                },
                                                children: "Points"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                lineNumber: 374,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: "var(--color-fg)"
                                                },
                                                children: [
                                                    balance.toLocaleString(),
                                                    unsubmittedPoints > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: "var(--color-warning)",
                                                            marginLeft: 6
                                                        },
                                                        children: [
                                                            "+",
                                                            unsubmittedPoints.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                lineNumber: 375,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CapBar, {
                                        label: "Regular",
                                        cur: regSubmitted,
                                        cap: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGULAR_CAP"],
                                        pct: regPct,
                                        capped: regCapped,
                                        colorVar: "--color-active-highlight"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 384,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CapBar, {
                                        label: "Routines",
                                        cur: recSubmitted,
                                        cap: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_CAP"],
                                        pct: recPct,
                                        capped: recCapped,
                                        colorVar: "--color-active-highlight-alt"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 385,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                lineNumber: 372,
                                columnNumber: 15
                            }, this);
                        })(),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 14px",
                                borderTop: "1px solid var(--color-border-soft)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setAccountMenuOpen((v)=>!v),
                                    "aria-haspopup": "menu",
                                    "aria-expanded": accountMenuOpen,
                                    "aria-label": "Account menu",
                                    style: {
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        background: "#3e3f42",
                                        border: "1px solid #555659",
                                        color: "#ddd",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        padding: 0
                                    },
                                    children: profilePictureUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: profilePictureUrl,
                                        alt: "",
                                        width: 28,
                                        height: 28,
                                        style: {
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block"
                                        },
                                        unoptimized: true
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 425,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "12",
                                                cy: "8",
                                                r: "4",
                                                fill: "currentColor",
                                                opacity: "0.8"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                lineNumber: 428,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M4 20c0-4 3.6-7 8-7s8 3 8 7",
                                                fill: "currentColor",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                lineNumber: 429,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 427,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                    lineNumber: 402,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        flex: 1,
                                        minWidth: 0,
                                        color: "var(--color-fg)",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    },
                                    children: username ?? "Guest"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                    lineNumber: 433,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/settings",
                                    "aria-label": "Settings",
                                    onClick: ()=>setOpen(false),
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 28,
                                        height: 28,
                                        color: "var(--color-fg-muted)",
                                        flexShrink: 0
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsIcon, {}, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                        lineNumber: 461,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                    lineNumber: 447,
                                    columnNumber: 13
                                }, this),
                                accountMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>setAccountMenuOpen(false),
                                            style: {
                                                position: "fixed",
                                                inset: 0,
                                                zIndex: 41
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                            lineNumber: 467,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            role: "menu",
                                            style: {
                                                position: "absolute",
                                                left: 10,
                                                right: 10,
                                                bottom: "calc(100% + 4px)",
                                                background: "var(--color-surface)",
                                                border: "1px solid var(--color-border)",
                                                borderRadius: 4,
                                                boxShadow: "var(--shadow-popover)",
                                                overflow: "hidden",
                                                zIndex: 42
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    role: "menuitem",
                                                    onClick: ()=>{
                                                        toggleTheme();
                                                    },
                                                    style: {
                                                        width: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        padding: "10px 14px",
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "var(--color-fg-muted)",
                                                        fontSize: 11,
                                                        letterSpacing: "0.18em",
                                                        textTransform: "uppercase",
                                                        fontWeight: 500,
                                                        cursor: "pointer",
                                                        textAlign: "left"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Theme"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                            lineNumber: 507,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: "var(--color-active-highlight)",
                                                                fontWeight: 600
                                                            },
                                                            children: theme === "dark" ? "Dark" : "Light"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/avatar",
                                                    role: "menuitem",
                                                    onClick: ()=>{
                                                        setAccountMenuOpen(false);
                                                        setOpen(false);
                                                    },
                                                    style: {
                                                        width: "100%",
                                                        display: "block",
                                                        padding: "10px 14px",
                                                        borderTop: "1px solid var(--color-border-soft)",
                                                        color: "var(--color-fg-muted)",
                                                        fontSize: 11,
                                                        letterSpacing: "0.18em",
                                                        textTransform: "uppercase",
                                                        fontWeight: 500,
                                                        textDecoration: "none"
                                                    },
                                                    children: "Avatar"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                    lineNumber: 512,
                                                    columnNumber: 19
                                                }, this),
                                                hasToken && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    role: "menuitem",
                                                    onClick: ()=>{
                                                        setAccountMenuOpen(false);
                                                        setOpen(false);
                                                        localStorage.removeItem("auth_token");
                                                        window.location.replace("/");
                                                    },
                                                    style: {
                                                        width: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        padding: "10px 14px",
                                                        background: "transparent",
                                                        border: "none",
                                                        borderTop: "1px solid var(--color-border-soft)",
                                                        color: "var(--color-fg-muted)",
                                                        fontSize: 11,
                                                        letterSpacing: "0.18em",
                                                        textTransform: "uppercase",
                                                        fontWeight: 500,
                                                        cursor: "pointer",
                                                        textAlign: "left"
                                                    },
                                                    children: "Sign Out"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                                    lineNumber: 532,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                                            lineNumber: 471,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                            lineNumber: 392,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                    lineNumber: 303,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true), document.body);
}
_s(MobileEdgeDrawer, "UBbVprgbYHXIbVQ/qwy79SL1KmQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePoints"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = MobileEdgeDrawer;
function TasksIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "6",
                x2: "20",
                y2: "6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 575,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "12",
                x2: "20",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 576,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "18",
                x2: "20",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 577,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3,6 4,7 6,5"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 578,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3,12 4,13 6,11"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 579,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3,18 4,19 6,17"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 580,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
        lineNumber: 574,
        columnNumber: 5
    }, this);
}
_c1 = TasksIcon;
function RecurringIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 12a9 9 0 1 1-3-6.7"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 587,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "21 4 21 10 15 10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 588,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
        lineNumber: 586,
        columnNumber: 5
    }, this);
}
_c2 = RecurringIcon;
function ArchiveIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "4",
                width: "18",
                height: "4",
                rx: "1"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 595,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 596,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "10",
                y1: "12",
                x2: "14",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 597,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
        lineNumber: 594,
        columnNumber: 5
    }, this);
}
_c3 = ArchiveIcon;
function AvatarIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "8",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 604,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 20c0-4 3.6-7 8-7s8 3 8 7"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 605,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
        lineNumber: 603,
        columnNumber: 5
    }, this);
}
_c4 = AvatarIcon;
function CapBar({ label, cur, cap, pct, capped, colorVar }) {
    const fill = capped ? "var(--color-success)" : pct >= 75 ? "var(--color-warning)" : `var(${colorVar})`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 9,
                            color: "var(--color-fg-subtle)",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase"
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                        lineNumber: 614,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 9,
                            color: capped ? "var(--color-success)" : "var(--color-fg-muted)",
                            letterSpacing: "0.05em",
                            fontWeight: 600
                        },
                        children: [
                            cur,
                            " / ",
                            cap
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                        lineNumber: 617,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 613,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "100%",
                    height: 3,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "var(--color-track)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: `${pct}%`,
                        height: "100%",
                        background: fill,
                        transition: "width 0.3s"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                    lineNumber: 622,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 621,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
        lineNumber: 612,
        columnNumber: 5
    }, this);
}
_c5 = CapBar;
function SettingsIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 631,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
                lineNumber: 632,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/MobileEdgeDrawer.tsx",
        lineNumber: 630,
        columnNumber: 5
    }, this);
}
_c6 = SettingsIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "MobileEdgeDrawer");
__turbopack_context__.k.register(_c1, "TasksIcon");
__turbopack_context__.k.register(_c2, "RecurringIcon");
__turbopack_context__.k.register(_c3, "ArchiveIcon");
__turbopack_context__.k.register(_c4, "AvatarIcon");
__turbopack_context__.k.register(_c5, "CapBar");
__turbopack_context__.k.register(_c6, "SettingsIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/context/ToastContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastBanner",
    ()=>ToastBanner,
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const AUTO_DISMISS_MS = 5100;
function ToastProvider({ children }) {
    _s();
    const [message, setMessageState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [kind, setKind] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("error");
    const [animKey, setAnimKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const setMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[setMessage]": (msg, k)=>{
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setMessageState(msg);
            setKind(k);
            if (msg) {
                setAnimKey({
                    "ToastProvider.useCallback[setMessage]": (kk)=>kk + 1
                }["ToastProvider.useCallback[setMessage]"]);
                timerRef.current = setTimeout({
                    "ToastProvider.useCallback[setMessage]": ()=>{
                        setMessageState(null);
                        timerRef.current = null;
                    }
                }["ToastProvider.useCallback[setMessage]"], AUTO_DISMISS_MS);
            }
        }
    }["ToastProvider.useCallback[setMessage]"], []);
    const setError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[setError]": (msg)=>setMessage(msg, "error")
    }["ToastProvider.useCallback[setError]"], [
        setMessage
    ]);
    const setSuccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[setSuccess]": (msg)=>setMessage(msg, "success")
    }["ToastProvider.useCallback[setSuccess]"], [
        setMessage
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToastProvider.useEffect": ()=>({
                "ToastProvider.useEffect": ()=>{
                    if (timerRef.current) clearTimeout(timerRef.current);
                }
            })["ToastProvider.useEffect"]
    }["ToastProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: {
            message,
            kind,
            animKey,
            setError,
            setSuccess,
            error: kind === "error" ? message : null
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/context/ToastContext.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(ToastProvider, "9aU3jVae0LkMFDGGK5VATh6tiug=");
_c = ToastProvider;
function useToast() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
_s1(useToast, "/dMy7t63NXD4eYACoT93CePwGrg=");
function ToastBanner() {
    _s2();
    const { message, kind, animKey } = useToast();
    const isError = kind === "error";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-live": "polite",
        style: {
            position: "relative",
            height: 0,
            zIndex: 95,
            pointerEvents: "none"
        },
        children: message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "toast-banner-anim text-xs",
            style: {
                position: "absolute",
                top: 12,
                left: 0,
                right: 0,
                margin: "0 auto",
                maxWidth: 480,
                width: "calc(100% - 32px)",
                background: "var(--color-surface)",
                color: isError ? "var(--color-danger)" : "var(--color-active-highlight-alt)",
                border: `1px solid ${isError ? "rgba(239,68,68,0.35)" : "var(--color-active-highlight-alt-border)"}`,
                borderRadius: 6,
                padding: "10px 14px",
                boxShadow: "var(--shadow-popover)",
                pointerEvents: "auto"
            },
            children: message
        }, animKey, false, {
            fileName: "[project]/apps/web/src/context/ToastContext.tsx",
            lineNumber: 83,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/context/ToastContext.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s2(ToastBanner, "6OplA7/jr1knkthC4CF29xBhAK8=", false, function() {
    return [
        useToast
    ];
});
_c1 = ToastBanner;
var _c, _c1;
__turbopack_context__.k.register(_c, "ToastProvider");
__turbopack_context__.k.register(_c1, "ToastBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_ddf491e3._.js.map