(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/hooks/useQuickLog.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useQuickLog",
    ()=>useQuickLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/dateUtils.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Idle window before a buffered +/- delta auto-flushes to the API.
const QUICK_LOG_DEBOUNCE_MS = 1500;
function useQuickLog({ task, heatmapCycles, onFlushQuickLog, onDelete }) {
    _s();
    const [pendingLog, setPendingLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const pendingLogRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuickLog.useEffect": ()=>{
            pendingLogRef.current = pendingLog;
        }
    }["useQuickLog.useEffect"], [
        pendingLog
    ]);
    // How much of pendingLog is already mid-flight (sent to the server but not
    // yet reflected via parent appendCycle + our local decrement). Used to
    // compute the un-flushed remainder so concurrent taps during an in-flight
    // flush don't double-send or under-send.
    const inFlightSentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Mirror onFlushQuickLog in a ref so long-lived effect cleanups don't capture
    // a stale prop reference.
    const flushRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onFlushQuickLog);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuickLog.useEffect": ()=>{
            flushRef.current = onFlushQuickLog;
        }
    }["useQuickLog.useEffect"]);
    // Today's committed counter sum (used to compute the displayed total and
    // for the - button's clamp). Reads from heatmapCycles so it stays in sync
    // with what the heatmap renders.
    const todayKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useQuickLog.useMemo[todayKey]": ()=>{
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dateKey"])(d);
        }
    }["useQuickLog.useMemo[todayKey]"], []);
    const cycleSumToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useQuickLog.useMemo[cycleSumToday]": ()=>{
            let sum = 0;
            for (const c of heatmapCycles){
                if (c.checkInDate.split("T")[0] === todayKey && typeof c.counterValue === "number") {
                    sum += c.counterValue;
                }
            }
            return sum;
        }
    }["useQuickLog.useMemo[cycleSumToday]"], [
        heatmapCycles,
        todayKey
    ]);
    // Discard any buffered +/- log before delegating to the parent's delete
    // handler. Without this, the modal's unmount cleanup would flush the
    // remainder against a task that's about to be (or already has been) deleted,
    // surfacing a misleading "Couldn't save log" toast.
    const handleDeleteClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useQuickLog.useCallback[handleDeleteClick]": ()=>{
            pendingLogRef.current = 0;
            inFlightSentRef.current = 0;
            setPendingLog(0);
            onDelete?.();
        }
    }["useQuickLog.useCallback[handleDeleteClick]"], [
        onDelete
    ]);
    const handleStepperIncrement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useQuickLog.useCallback[handleStepperIncrement]": ()=>{
            setPendingLog({
                "useQuickLog.useCallback[handleStepperIncrement]": (p)=>p + 1
            }["useQuickLog.useCallback[handleStepperIncrement]"]);
        }
    }["useQuickLog.useCallback[handleStepperIncrement]"], []);
    const handleStepperDecrement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useQuickLog.useCallback[handleStepperDecrement]": ()=>{
            // Clamp against cycleSumToday so rapid taps can't drive the displayed
            // total below 0. The disabled prop on the - button reflects the
            // last-rendered state, which can lag on fast tap bursts.
            setPendingLog({
                "useQuickLog.useCallback[handleStepperDecrement]": (p)=>cycleSumToday + p - 1 < 0 ? p : p - 1
            }["useQuickLog.useCallback[handleStepperDecrement]"]);
        }
    }["useQuickLog.useCallback[handleStepperDecrement]"], [
        cycleSumToday
    ]);
    // Flush any un-sent buffered delta on unmount or task change so a buffered
    // correction isn't lost. Subtract whatever's already mid-flight — that
    // portion has its own in-flight handler and shouldn't be sent twice.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuickLog.useEffect": ()=>{
            const tid = task.taskId;
            return ({
                "useQuickLog.useEffect": ()=>{
                    const remainder = pendingLogRef.current - inFlightSentRef.current;
                    if (remainder !== 0) flushRef.current?.(tid, remainder);
                    pendingLogRef.current = 0;
                    inFlightSentRef.current = 0;
                }
            })["useQuickLog.useEffect"];
        }
    }["useQuickLog.useEffect"], [
        task.taskId
    ]);
    // Debounced auto-flush. Keep pendingLog at its full value for the duration
    // of the API roundtrip; the displayed sum is cycleSumToday + pendingLog,
    // and during the in-flight period cycleSumToday hasn't moved yet so the
    // display stays stable. When the response lands, the parent's appendCycle
    // adds the cycle (cycleSumToday += delta) and we immediately subtract
    // delta from pendingLog inside the same render (flushSync) — both moves
    // cancel out, so the displayed total is unchanged. No flicker.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuickLog.useEffect": ()=>{
            if (!flushRef.current) return;
            const remainder = pendingLog - inFlightSentRef.current;
            if (remainder === 0) return;
            const tid = task.taskId;
            const timer = setTimeout({
                "useQuickLog.useEffect.timer": async ()=>{
                    const delta = pendingLogRef.current - inFlightSentRef.current;
                    if (delta === 0) return;
                    inFlightSentRef.current += delta;
                    try {
                        const result = await flushRef.current?.(tid, delta);
                        if (!result) {
                            // Failure: pendingLog stays so the user can retry. Drop the
                            // in-flight reservation so future debounce cycles can re-send.
                            inFlightSentRef.current -= delta;
                            return;
                        }
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"])({
                            "useQuickLog.useEffect.timer": ()=>{
                                setPendingLog({
                                    "useQuickLog.useEffect.timer": (p)=>p - delta
                                }["useQuickLog.useEffect.timer"]);
                            }
                        }["useQuickLog.useEffect.timer"]);
                        inFlightSentRef.current -= delta;
                    } catch  {
                        inFlightSentRef.current -= delta;
                    }
                }
            }["useQuickLog.useEffect.timer"], QUICK_LOG_DEBOUNCE_MS);
            return ({
                "useQuickLog.useEffect": ()=>clearTimeout(timer)
            })["useQuickLog.useEffect"];
        }
    }["useQuickLog.useEffect"], [
        pendingLog,
        task.taskId
    ]);
    // Tab/page-close safety net via keepalive fetch. State updates here are
    // best-effort — on actual unload they're discarded harmlessly.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuickLog.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const tid = task.taskId;
            const flush = {
                "useQuickLog.useEffect.flush": ()=>{
                    const remainder = pendingLogRef.current - inFlightSentRef.current;
                    if (remainder === 0) return;
                    inFlightSentRef.current += remainder;
                    flushRef.current?.(tid, remainder, {
                        keepalive: true
                    });
                }
            }["useQuickLog.useEffect.flush"];
            const onVisibility = {
                "useQuickLog.useEffect.onVisibility": ()=>{
                    if (document.visibilityState === "hidden") flush();
                }
            }["useQuickLog.useEffect.onVisibility"];
            window.addEventListener("pagehide", flush);
            document.addEventListener("visibilitychange", onVisibility);
            return ({
                "useQuickLog.useEffect": ()=>{
                    window.removeEventListener("pagehide", flush);
                    document.removeEventListener("visibilitychange", onVisibility);
                }
            })["useQuickLog.useEffect"];
        }
    }["useQuickLog.useEffect"], [
        task.taskId
    ]);
    return {
        pendingLog,
        cycleSumToday,
        handleStepperIncrement,
        handleStepperDecrement,
        handleDeleteClick
    };
}
_s(useQuickLog, "03LCZ5prPloWQGnsM3etnhnRmB8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useEquippedAvatar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearEquippedAvatarCache",
    ()=>clearEquippedAvatarCache,
    "primeEquippedAvatarCache",
    ()=>primeEquippedAvatarCache,
    "useEquippedAvatar",
    ()=>useEquippedAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/avatar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/avatar/hints.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Run each row's avatarItem through applyHints so the modal's chibi
// (which renders directly from this hook's output) picks up RENDER_HINTS
// and CLASS_HINTS the same way the /avatar page does. Without this,
// per-filename / per-class offset overrides only worked on the page that
// did the hint resolution itself, leaving the modal's preview misaligned.
function withHints(rows) {
    return rows.map((r)=>r.avatarItem ? {
            ...r,
            avatarItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyHints"])(r.avatarItem)
        } : r);
}
// Session-scoped cache so multiple TaskDetailModal opens during the same
// page life don't each pay a network round-trip for the user's equipped
// items. Cleared automatically on full reload; callers that mutate equip
// state (e.g. the /avatar page's onCardClick) can call
// `clearEquippedAvatarCache()` so the next modal open re-fetches.
let cache = null;
function clearEquippedAvatarCache() {
    cache = null;
}
function primeEquippedAvatarCache(equipped) {
    cache = withHints(equipped);
}
function useEquippedAvatar() {
    _s();
    const [equipped, setEquipped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(cache);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEquippedAvatar.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const token = localStorage.getItem("auth_token");
            if (!token) return;
            let cancelled = false;
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["avatarApi"].getEquipped().then({
                "useEquippedAvatar.useEffect": ({ data })=>{
                    if (cancelled || !data) return;
                    const resolved = withHints(data);
                    cache = resolved;
                    setEquipped(resolved);
                }
            }["useEquippedAvatar.useEffect"]);
            return ({
                "useEquippedAvatar.useEffect": ()=>{
                    cancelled = true;
                }
            })["useEquippedAvatar.useEffect"];
        }
    }["useEquippedAvatar.useEffect"], []);
    return equipped;
}
_s(useEquippedAvatar, "1pOoTKTfwznvMxmhGTRzfL4zabA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useTaskActions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTaskActions",
    ()=>useTaskActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/PointsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/dateUtils.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// Returns true when a streak increment crosses one of the bonus
// boundaries (3, 7, 14, 30). Used to choose between a stronger and a
// regular haptic pattern on check-in. Replaces the previous
// `tierForStreak` import — the banner that used it is gone, but the
// haptic distinction is still nice for milestone check-ins.
function crossesTierBoundary(prev, next) {
    for (const at of [
        3,
        7,
        14,
        30
    ]){
        if (prev < at && next >= at) return true;
    }
    return false;
}
function vibrate(pattern) {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
    try {
        navigator.vibrate(pattern);
    } catch  {}
}
// useEvent-style helper: returns a stable callback that always invokes the
// latest handler implementation. Lets us hand stable refs to memoized children
// without having to enumerate every closure dep.
function useEvent(handler) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(handler);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useEvent.useLayoutEffect": ()=>{
            ref.current = handler;
        }
    }["useEvent.useLayoutEffect"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEvent.useCallback": (...args)=>ref.current(...args)
    }["useEvent.useCallback"], []);
}
_s(useEvent, "Vi3TWA9iF3H1/zxlHt6Q3d9aZ7Y=");
function useTaskActions({ tasks, setTasks, isAuthenticated, stagedTaskIds, setStagedTaskIds, selectedIds, setSelectedIds, submittedTaskIds, setError, setSuccess, setDetailTask }) {
    _s1();
    const { recurringSubmittedToday, setRecurringSubmittedToday, setDailySubmitted, setBalance, updateStaged } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePoints"])();
    const [advancing, setAdvancing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pausing, setPausing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [slashingId, setSlashingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // After a successful auth-mode check-in we surface a 5s window during which
    // the user can hit "Undo" in the toast. Cleared on dismiss or expiry.
    const [undoableCheckIn, setUndoableCheckIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const undoTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dismissUndoableCheckIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTaskActions.useCallback[dismissUndoableCheckIn]": ()=>{
            if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current);
                undoTimeoutRef.current = null;
            }
            setUndoableCheckIn(null);
        }
    }["useTaskActions.useCallback[dismissUndoableCheckIn]"], []);
    const armUndoToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTaskActions.useCallback[armUndoToast]": (taskId, cycleId, taskTitle)=>{
            if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
            setUndoableCheckIn({
                taskId,
                cycleId,
                taskTitle
            });
            undoTimeoutRef.current = setTimeout({
                "useTaskActions.useCallback[armUndoToast]": ()=>{
                    setUndoableCheckIn(null);
                    undoTimeoutRef.current = null;
                }
            }["useTaskActions.useCallback[armUndoToast]"], 5000);
        }
    }["useTaskActions.useCallback[armUndoToast]"], []);
    const [recurringPopups, setRecurringPopups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    // Tier-up banner removed — streak milestones are conveyed in-place via
    // the streak chip's pop animation (TaskRow) plus the multiplier shown
    // on the StreakDisplay chip inside the detail modal. The dismiss /
    // state plumbing for the banner is gone with it.
    const handleAdvance = useEvent(async function handleAdvance(task) {
        if (advancing === task.taskId) return;
        const canUndo = task.status === "completed" && !submittedTaskIds.has(task.taskId) && !task.pointsAwarded;
        setAdvancing(task.taskId);
        if (!isAuthenticated) {
            if (task.status === "pending" && !task.isRecurring) {
                setTasks({
                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                    ...t,
                                    status: "in_progress"
                                } : t
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
            } else if (task.status === "in_progress") {
                if (task.pointValue) {
                    setStagedTaskIds({
                        "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>[
                                ...prev,
                                task.taskId
                            ]
                    }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                    setSelectedIds({
                        "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>new Set([
                                ...prev,
                                task.taskId
                            ])
                    }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                    updateStaged(task.pointValue);
                }
                setTasks({
                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                    ...t,
                                    status: "completed",
                                    completedAt: new Date().toISOString(),
                                    submitted: false
                                } : t
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
            } else if (canUndo) {
                if (stagedTaskIds.includes(task.taskId)) {
                    setStagedTaskIds({
                        "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.filter({
                                "useTaskActions.useEvent[handleAdvance].handleAdvance": (id)=>id !== task.taskId
                            }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                    }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                    updateStaged(-(task.pointValue ?? 0));
                }
                setSelectedIds({
                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>{
                        const n = new Set(prev);
                        n.delete(task.taskId);
                        return n;
                    }
                }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                setTasks({
                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                    ...t,
                                    status: "in_progress",
                                    completedAt: null
                                } : t
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
            }
            setAdvancing(null);
            return;
        }
        if (task.status === "pending") {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].start(task.taskId);
            setAdvancing(null);
            if (error) {
                setError(error);
                return;
            }
            setTasks({
                "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                        "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                ...t,
                                status: "in_progress"
                            } : t
                    }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
            }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
        } else if (task.status === "in_progress") {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].complete(task.taskId);
            if (error) {
                setAdvancing(null);
                setError(error);
                return;
            }
            if (task.isRecurring && task.recurrenceRule) {
                const recurringRemaining = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_CAP"] - recurringSubmittedToday;
                const nextDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextDueDate"])(task.dueDate, task.recurrenceRule);
                if (recurringRemaining > 0) {
                    const { data: submitData, error: submitError } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usersApi"].submitPoints([
                        task.taskId
                    ]);
                    if (submitError) {
                        setAdvancing(null);
                        setError(submitError);
                        setTasks({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                            ...t,
                                            status: "completed",
                                            completedAt: new Date().toISOString()
                                        } : t
                                }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                        return;
                    }
                    const awarded = submitData.pointsAwarded ?? 0;
                    setRecurringSubmittedToday(submitData.recurringDailyTotal);
                    setDailySubmitted(submitData.dailyTotal);
                    setBalance(submitData.newBalance);
                    if (awarded > 0) {
                        setRecurringPopups({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>new Map(prev).set(task.taskId, awarded)
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                        setTimeout({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": ()=>setRecurringPopups({
                                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>{
                                        const n = new Map(prev);
                                        n.delete(task.taskId);
                                        return n;
                                    }
                                }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"], 1900);
                        await new Promise({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (r)=>setTimeout(r, 420)
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                    }
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].update(task.taskId, {
                    taskId: task.taskId,
                    title: task.title,
                    description: task.description ?? undefined,
                    category: task.category,
                    priority: task.priority,
                    status: "pending",
                    pointValue: task.pointValue,
                    dueDate: nextDue,
                    completedAt: undefined,
                    isRecurring: task.isRecurring,
                    recurrenceRule: task.recurrenceRule,
                    submitted: false
                });
                setAdvancing(null);
                setTasks({
                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                    ...t,
                                    status: "pending",
                                    dueDate: nextDue,
                                    completedAt: null,
                                    submitted: false
                                } : t
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
            } else {
                setAdvancing(null);
                if (task.pointValue) {
                    setStagedTaskIds({
                        "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>[
                                ...prev,
                                task.taskId
                            ]
                    }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                    setSelectedIds({
                        "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>new Set([
                                ...prev,
                                task.taskId
                            ])
                    }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                    updateStaged(task.pointValue);
                }
                setTasks({
                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                    ...t,
                                    status: "completed",
                                    completedAt: new Date().toISOString(),
                                    submitted: false
                                } : t
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
            }
        } else if (canUndo) {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].update(task.taskId, {
                taskId: task.taskId,
                title: task.title,
                description: task.description ?? undefined,
                category: task.category,
                priority: task.priority,
                status: "in_progress",
                pointValue: task.pointValue,
                dueDate: task.dueDate ?? undefined,
                completedAt: undefined,
                isRecurring: task.isRecurring,
                recurrenceRule: task.recurrenceRule ?? undefined,
                submitted: task.submitted
            });
            setAdvancing(null);
            if (error) {
                setError(error);
                return;
            }
            if (stagedTaskIds.includes(task.taskId)) {
                setStagedTaskIds({
                    "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.filter({
                            "useTaskActions.useEvent[handleAdvance].handleAdvance": (id)=>id !== task.taskId
                        }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
                }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
                updateStaged(-(task.pointValue ?? 0));
            }
            setSelectedIds({
                "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>{
                    const n = new Set(prev);
                    n.delete(task.taskId);
                    return n;
                }
            }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
            setTasks({
                "useTaskActions.useEvent[handleAdvance].handleAdvance": (prev)=>prev.map({
                        "useTaskActions.useEvent[handleAdvance].handleAdvance": (t)=>t.taskId === task.taskId ? {
                                ...t,
                                status: "in_progress",
                                completedAt: null
                            } : t
                    }["useTaskActions.useEvent[handleAdvance].handleAdvance"])
            }["useTaskActions.useEvent[handleAdvance].handleAdvance"]);
        } else {
            setAdvancing(null);
        }
    });
    const handleCheckIn = useEvent(async function handleCheckIn(task, counterValue) {
        if (advancing === task.taskId) return;
        setAdvancing(task.taskId);
        const todayIso = ({
            "useTaskActions.useEvent[handleCheckIn].handleCheckIn.todayIso": ()=>{
                const t = new Date();
                return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
            }
        })["useTaskActions.useEvent[handleCheckIn].handleCheckIn.todayIso"]();
        if (!isAuthenticated) {
            let nextDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextDueDate"])(task.dueDate, task.recurrenceRule);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            while((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseLocalDate"])(nextDue).getTime() <= todayDate.getTime()){
                nextDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextDueDate"])(nextDue, task.recurrenceRule);
            }
            const prevCount = task.currentStreakCount ?? 0;
            const newCount = prevCount + 1;
            setRecurringPopups({
                "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (prev)=>new Map(prev).set(task.taskId, task.pointValue)
            }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"]);
            setTimeout({
                "useTaskActions.useEvent[handleCheckIn].handleCheckIn": ()=>setRecurringPopups({
                        "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (prev)=>{
                            const n = new Map(prev);
                            n.delete(task.taskId);
                            return n;
                        }
                    }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"])
            }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"], 1900);
            // Tier transitions used to fire a banner; now only the haptic
            // pattern differentiates a milestone check-in from a regular one.
            const isTierTransition = crossesTierBoundary(prevCount, newCount);
            vibrate(isTierTransition ? [
                15,
                30,
                60
            ] : 20);
            // checkInDate must match the server's convention (local-midnight written
            // as fake-UTC) so consumers comparing `cycle.checkInDate.split("T")[0]`
            // against `todayLocalKey()` see the same date. Using a real UTC
            // toISOString() here drifts the cycle to "tomorrow" on west-of-UTC
            // evenings, which makes wasCheckedInToday read false and leaks back
            // into the Log gate, undo affordance, and heatmap aggregation.
            const checkInDateLocalAsFakeUtc = `${todayIso}T00:00:00Z`;
            const synthCycle = {
                cycleId: -Date.now(),
                taskId: task.taskId,
                checkInDate: checkInDateLocalAsFakeUtc,
                counterValue: counterValue ?? null,
                createdAt: new Date().toISOString(),
                cycleType: "checkin"
            };
            setTasks({
                "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (prev)=>prev.map({
                        "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (t)=>t.taskId === task.taskId ? {
                                ...t,
                                dueDate: nextDue,
                                lastCheckInDate: todayIso,
                                currentStreakCount: newCount,
                                longestStreakCount: Math.max(newCount, t.longestStreakCount ?? 0),
                                recentCycles: [
                                    synthCycle,
                                    ...t.recentCycles ?? []
                                ],
                                subtasks: t.subtasks?.map({
                                    "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (s)=>({
                                            ...s,
                                            completed: false,
                                            setsCompleted: null
                                        })
                                }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"])
                            } : t
                    }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"])
            }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"]);
            setAdvancing(null);
            return;
        }
        const prevCount = task.currentStreakCount ?? 0;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].checkIn(task.taskId, counterValue);
        if (error) {
            setAdvancing(null);
            setError(error);
            return;
        }
        const awarded = data.pointsAwarded;
        setRecurringSubmittedToday(data.recurringDailyTotal);
        setDailySubmitted({
            "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (prev)=>prev + awarded
        }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"]);
        setBalance(data.newBalance);
        if (awarded > 0) {
            setRecurringPopups({
                "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (prev)=>new Map(prev).set(task.taskId, awarded)
            }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"]);
            setTimeout({
                "useTaskActions.useEvent[handleCheckIn].handleCheckIn": ()=>setRecurringPopups({
                        "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (prev)=>{
                            const n = new Map(prev);
                            n.delete(task.taskId);
                            return n;
                        }
                    }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"])
            }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"], 1900);
        }
        const isTierTransition = crossesTierBoundary(prevCount, data.streakCount);
        vibrate(isTierTransition ? [
            15,
            30,
            60
        ] : 20);
        // Note: previously fired a setSuccess toast here when the streak bonus
        // multiplier kicked in. Removed in favour of the in-row streak pop
        // animation (see TaskRow) and the existing multiplier badge on the
        // StreakDisplay chip — the same info is now conveyed without a toast.
        let nextDueDate = data.nextDueDate || task.dueDate;
        if (nextDueDate && task.recurrenceRule) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (task.recurrenceRule === "daily") {
                const nd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseLocalDate"])(nextDueDate);
                if (nd <= today) {
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    nextDueDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
                }
            } else if (task.recurrenceRule !== "weekdays") {
                const nd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseLocalDate"])(nextDueDate);
                if (today > (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrevPeriodStart"])(nd, task.recurrenceRule)) {
                    nextDueDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextDueDate"])(nextDueDate, task.recurrenceRule);
                }
            }
        }
        setAdvancing(null);
        // Append the new cycle to recentCycles so the in-row Undo button (and
        // today-chip / heatmap) can find its cycleId without a refetch.
        // Match the server's local-midnight-as-fake-UTC convention for
        // checkInDate — see the synthCycle comment above for why this matters.
        const checkInDateLocalAsFakeUtc = `${todayIso}T00:00:00Z`;
        const newCycle = {
            cycleId: data.cycleId,
            taskId: task.taskId,
            checkInDate: checkInDateLocalAsFakeUtc,
            counterValue: counterValue ?? null,
            createdAt: new Date().toISOString(),
            cycleType: "checkin"
        };
        setTasks({
            "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (prev)=>prev.map({
                    "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (t)=>t.taskId === task.taskId ? {
                            ...t,
                            status: "pending",
                            dueDate: nextDueDate,
                            lastCheckInDate: todayIso,
                            completedAt: null,
                            submitted: false,
                            currentStreakCount: data.streakCount,
                            longestStreakCount: data.longestCount,
                            recentCycles: [
                                newCycle,
                                ...t.recentCycles ?? []
                            ],
                            subtasks: t.subtasks?.map({
                                "useTaskActions.useEvent[handleCheckIn].handleCheckIn": (s)=>({
                                        ...s,
                                        completed: false,
                                        setsCompleted: null
                                    })
                            }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"])
                        } : t
                }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"])
        }["useTaskActions.useEvent[handleCheckIn].handleCheckIn"]);
        armUndoToast(task.taskId, data.cycleId, task.title);
    });
    const handleUndoCheckIn = useEvent(async function handleUndoCheckIn(task, cycleId) {
        // Demo / unauthenticated: best-effort local rollback. We can't perfectly
        // restore the streak's previous state without server-side history, so we
        // just decrement, roll the dueDate back one period, and clear
        // lastCheckInDate so canCheckInNow() unlocks the task.
        if (!isAuthenticated) {
            setTasks({
                "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn": (prev)=>prev.map({
                        "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn": (t)=>{
                            if (t.taskId !== task.taskId) return t;
                            const cycles = (t.recentCycles ?? []).filter({
                                "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn.cycles": (c)=>c.cycleId !== cycleId
                            }["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn.cycles"]);
                            const newStreak = Math.max(0, (t.currentStreakCount ?? 0) - 1);
                            return {
                                ...t,
                                recentCycles: cycles,
                                currentStreakCount: newStreak,
                                dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrevPeriodStart"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseLocalDate"])(t.dueDate ?? ""), t.recurrenceRule ?? "daily").toISOString().split("T")[0],
                                lastCheckInDate: null
                            };
                        }
                    }["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn"])
            }["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn"]);
            return null;
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].undoCheckIn(task.taskId, cycleId);
        if (error) {
            setError(error);
            return null;
        }
        setBalance(data.newBalance);
        setRecurringSubmittedToday(data.recurringDailyTotal);
        if (data.pointsRefunded > 0) {
            setDailySubmitted({
                "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn": (prev)=>Math.max(0, prev - data.pointsRefunded)
            }["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn"]);
        }
        setTasks({
            "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn": (prev)=>prev.map({
                    "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn": (t)=>{
                        if (t.taskId !== task.taskId) return t;
                        const cycles = (t.recentCycles ?? []).filter({
                            "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn.cycles": (c)=>c.cycleId !== cycleId
                        }["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn.cycles"]);
                        // Empty string from server means "no prior check-in" — clear the local
                        // lastCheckInDate so canCheckInNow() unlocks the task. Otherwise the
                        // slider/check-in button stays disabled.
                        const restoredLastCheckIn = data.previousLastCheckInDate || null;
                        // If the server has no PreviousDueDate snapshot (cycle created before
                        // the rollback fields were added), compute it by rolling t.dueDate back
                        // one period. Without this fallback the task would land in UPCOMING
                        // because dueDate would still point to the post-check-in cycle.
                        const restoredDueDate = data.previousDueDate || (t.dueDate && t.recurrenceRule ? ({
                            "useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn": ()=>{
                                const prev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrevPeriodStart"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseLocalDate"])(t.dueDate), t.recurrenceRule);
                                return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-${String(prev.getDate()).padStart(2, "0")}`;
                            }
                        })["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn"]() : t.dueDate);
                        return {
                            ...t,
                            recentCycles: cycles,
                            currentStreakCount: data.streakCount,
                            longestStreakCount: data.longestCount,
                            dueDate: restoredDueDate,
                            lastCheckInDate: restoredLastCheckIn
                        };
                    }
                }["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn"])
        }["useTaskActions.useEvent[handleUndoCheckIn].handleUndoCheckIn"]);
        return data;
    });
    const handleDeleteLogCycle = useEvent(async function handleDeleteLogCycle(task, cycleId) {
        setTasks({
            "useTaskActions.useEvent[handleDeleteLogCycle].handleDeleteLogCycle": (prev)=>prev.map({
                    "useTaskActions.useEvent[handleDeleteLogCycle].handleDeleteLogCycle": (t)=>t.taskId === task.taskId ? {
                            ...t,
                            recentCycles: (t.recentCycles ?? []).filter({
                                "useTaskActions.useEvent[handleDeleteLogCycle].handleDeleteLogCycle": (c)=>c.cycleId !== cycleId
                            }["useTaskActions.useEvent[handleDeleteLogCycle].handleDeleteLogCycle"])
                        } : t
                }["useTaskActions.useEvent[handleDeleteLogCycle].handleDeleteLogCycle"])
        }["useTaskActions.useEvent[handleDeleteLogCycle].handleDeleteLogCycle"]);
        if (!isAuthenticated) return;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].deleteLogCycle(task.taskId, cycleId);
        if (error) {
            setError(error);
            return;
        }
    });
    const handlePause = useEvent(async function handlePause(task) {
        setPausing(task.taskId);
        if (!isAuthenticated) {
            setTasks({
                "useTaskActions.useEvent[handlePause].handlePause": (prev)=>prev.map({
                        "useTaskActions.useEvent[handlePause].handlePause": (t)=>t.taskId === task.taskId ? {
                                ...t,
                                status: "pending"
                            } : t
                    }["useTaskActions.useEvent[handlePause].handlePause"])
            }["useTaskActions.useEvent[handlePause].handlePause"]);
            setPausing(null);
            return;
        }
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].update(task.taskId, {
            taskId: task.taskId,
            title: task.title,
            description: task.description ?? undefined,
            category: task.category,
            priority: task.priority,
            status: "pending",
            pointValue: task.pointValue,
            dueDate: task.dueDate ?? undefined,
            completedAt: undefined,
            isRecurring: task.isRecurring,
            recurrenceRule: task.recurrenceRule ?? undefined,
            submitted: task.submitted
        });
        setPausing(null);
        if (error) {
            setError(error);
            return;
        }
        setTasks({
            "useTaskActions.useEvent[handlePause].handlePause": (prev)=>prev.map({
                    "useTaskActions.useEvent[handlePause].handlePause": (t)=>t.taskId === task.taskId ? {
                            ...t,
                            status: "pending"
                        } : t
                }["useTaskActions.useEvent[handlePause].handlePause"])
        }["useTaskActions.useEvent[handlePause].handlePause"]);
    });
    const handleDelete = useEvent(async function handleDelete(id) {
        const snapshot = tasks.find({
            "useTaskActions.useEvent[handleDelete].handleDelete.snapshot": (t)=>t.taskId === id
        }["useTaskActions.useEvent[handleDelete].handleDelete.snapshot"]);
        // Dismiss the detail panel up front if it's open on this task, so the
        // user doesn't see a modal full of stale data while the slash animation
        // plays. If the API call later fails we'll re-add the task, but the
        // panel stays closed — the toast surfaces the error instead.
        setDetailTask?.({
            "useTaskActions.useEvent[handleDelete].handleDelete": (curr)=>curr?.taskId === id ? null : curr
        }["useTaskActions.useEvent[handleDelete].handleDelete"]);
        if (!isAuthenticated) {
            if (stagedTaskIds.includes(id) && snapshot?.pointValue) updateStaged(-snapshot.pointValue);
            setStagedTaskIds({
                "useTaskActions.useEvent[handleDelete].handleDelete": (prev)=>prev.filter({
                        "useTaskActions.useEvent[handleDelete].handleDelete": (sid)=>sid !== id
                    }["useTaskActions.useEvent[handleDelete].handleDelete"])
            }["useTaskActions.useEvent[handleDelete].handleDelete"]);
            setSelectedIds({
                "useTaskActions.useEvent[handleDelete].handleDelete": (prev)=>{
                    const n = new Set(prev);
                    n.delete(id);
                    return n;
                }
            }["useTaskActions.useEvent[handleDelete].handleDelete"]);
            setSlashingId(id);
            // Outlast the row-delete animation (1.6s) so the danger underline glides
            // + fades + the row collapses fully before the task is yanked from the
            // list. The previous 550ms matched the old chunky stepped row-delete; the
            // submit-style cream redesign needs a longer window.
            await new Promise({
                "useTaskActions.useEvent[handleDelete].handleDelete": (r)=>setTimeout(r, 1600)
            }["useTaskActions.useEvent[handleDelete].handleDelete"]);
            setSlashingId(null);
            setTasks({
                "useTaskActions.useEvent[handleDelete].handleDelete": (prev)=>prev.filter({
                        "useTaskActions.useEvent[handleDelete].handleDelete": (t)=>t.taskId !== id
                    }["useTaskActions.useEvent[handleDelete].handleDelete"])
            }["useTaskActions.useEvent[handleDelete].handleDelete"]);
            return;
        }
        setSlashingId(id);
        const deletePromise = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].delete(id);
        if (stagedTaskIds.includes(id) && snapshot?.pointValue) updateStaged(-snapshot.pointValue);
        setStagedTaskIds({
            "useTaskActions.useEvent[handleDelete].handleDelete": (prev)=>prev.filter({
                    "useTaskActions.useEvent[handleDelete].handleDelete": (sid)=>sid !== id
                }["useTaskActions.useEvent[handleDelete].handleDelete"])
        }["useTaskActions.useEvent[handleDelete].handleDelete"]);
        setSelectedIds({
            "useTaskActions.useEvent[handleDelete].handleDelete": (prev)=>{
                const n = new Set(prev);
                n.delete(id);
                return n;
            }
        }["useTaskActions.useEvent[handleDelete].handleDelete"]);
        // Outlast the row-delete animation (1.6s) so the danger underline glides
        // + fades + the row collapses fully before the task is yanked from the
        // list. The previous 550ms matched the old chunky stepped row-delete; the
        // submit-style cream redesign needs a longer window.
        await new Promise({
            "useTaskActions.useEvent[handleDelete].handleDelete": (r)=>setTimeout(r, 1600)
        }["useTaskActions.useEvent[handleDelete].handleDelete"]);
        setSlashingId(null);
        setTasks({
            "useTaskActions.useEvent[handleDelete].handleDelete": (prev)=>prev.filter({
                    "useTaskActions.useEvent[handleDelete].handleDelete": (t)=>t.taskId !== id
                }["useTaskActions.useEvent[handleDelete].handleDelete"])
        }["useTaskActions.useEvent[handleDelete].handleDelete"]);
        const { error } = await deletePromise;
        if (error) {
            if (snapshot) setTasks({
                "useTaskActions.useEvent[handleDelete].handleDelete": (prev)=>[
                        snapshot,
                        ...prev
                    ]
            }["useTaskActions.useEvent[handleDelete].handleDelete"]);
            setError(error);
        }
    });
    const handleSkip = useEvent(async function handleSkip(task) {
        if (!isAuthenticated) {
            let nextDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextDueDate"])(task.dueDate, task.recurrenceRule);
            while((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(nextDue))nextDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextDueDate"])(nextDue, task.recurrenceRule);
            setTasks({
                "useTaskActions.useEvent[handleSkip].handleSkip": (prev)=>prev.map({
                        "useTaskActions.useEvent[handleSkip].handleSkip": (t)=>t.taskId === task.taskId ? {
                                ...t,
                                dueDate: nextDue,
                                currentStreakCount: 0
                            } : t
                    }["useTaskActions.useEvent[handleSkip].handleSkip"])
            }["useTaskActions.useEvent[handleSkip].handleSkip"]);
            return;
        }
        setAdvancing(task.taskId);
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].skipCycle(task.taskId);
        if (error) {
            setAdvancing(null);
            setError(error);
            return;
        }
        let nextDue = data.nextDueDate;
        while((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(nextDue))nextDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextDueDate"])(nextDue, task.recurrenceRule);
        if (nextDue !== data.nextDueDate) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].update(task.taskId, {
                taskId: task.taskId,
                title: task.title,
                description: task.description ?? undefined,
                category: task.category,
                priority: task.priority,
                status: task.status,
                pointValue: task.pointValue,
                dueDate: nextDue,
                isRecurring: task.isRecurring,
                recurrenceRule: task.recurrenceRule ?? undefined,
                submitted: task.submitted
            });
        }
        setAdvancing(null);
        setTasks({
            "useTaskActions.useEvent[handleSkip].handleSkip": (prev)=>prev.map({
                    "useTaskActions.useEvent[handleSkip].handleSkip": (t)=>t.taskId === task.taskId ? {
                            ...t,
                            dueDate: nextDue,
                            currentStreakCount: data.streakCount
                        } : t
                }["useTaskActions.useEvent[handleSkip].handleSkip"])
        }["useTaskActions.useEvent[handleSkip].handleSkip"]);
    });
    const handleArchive = useEvent(async function handleArchive(task) {
        const snapshot = task;
        setTasks({
            "useTaskActions.useEvent[handleArchive].handleArchive": (prev)=>prev.filter({
                    "useTaskActions.useEvent[handleArchive].handleArchive": (t)=>t.taskId !== task.taskId
                }["useTaskActions.useEvent[handleArchive].handleArchive"])
        }["useTaskActions.useEvent[handleArchive].handleArchive"]);
        if (!isAuthenticated) return;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].archive(task.taskId);
        if (error) {
            setTasks({
                "useTaskActions.useEvent[handleArchive].handleArchive": (prev)=>[
                        snapshot,
                        ...prev
                    ]
            }["useTaskActions.useEvent[handleArchive].handleArchive"]);
            setError(error);
        }
    });
    // When undo is invoked from the toast, also clear the toast itself.
    const handleUndoCheckInFromToast = useEvent(async function handleUndoCheckInFromToast(task, cycleId) {
        dismissUndoableCheckIn();
        await handleUndoCheckIn(task, cycleId);
    });
    return {
        advancing,
        pausing,
        slashingId,
        recurringPopups,
        handleAdvance,
        handleCheckIn,
        handleUndoCheckIn,
        handleUndoCheckInFromToast,
        handleDeleteLogCycle,
        handlePause,
        handleDelete,
        handleSkip,
        handleArchive,
        undoableCheckIn,
        dismissUndoableCheckIn
    };
}
_s1(useTaskActions, "0Ff4+WKuJ8WGcVvNeFgwGFpJiYo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePoints"],
        useEvent,
        useEvent,
        useEvent,
        useEvent,
        useEvent,
        useEvent,
        useEvent,
        useEvent,
        useEvent
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/usePullToRefresh.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePullToRefresh",
    ()=>usePullToRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const TRIGGER_DISTANCE = 70;
const MAX_PULL = 110;
function usePullToRefresh(containerRef, onRefresh, enabled = true) {
    _s();
    const [pullY, setPullY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const startYRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startXRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lockedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const abortedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Mirror of pullY for synchronous reads inside onTouchEnd; the React state
    // copy lags because state updates are batched and the effect doesn't re-bind
    // on every change (it would race with rapid touch events).
    const pullYRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Snapshot the element each render so the effect re-runs when it goes from
    // null → element (e.g. when a parent gates rendering on a "mounted" flag).
    const el = containerRef.current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePullToRefresh.useEffect": ()=>{
            if (!enabled || !el) return;
            const setPull = {
                "usePullToRefresh.useEffect.setPull": (y, p)=>{
                    pullYRef.current = y;
                    setPullY(y);
                    setPhase(p);
                }
            }["usePullToRefresh.useEffect.setPull"];
            function onTouchStart(e) {
                if (!el || el.scrollTop > 0) {
                    startYRef.current = null;
                    startXRef.current = null;
                    return;
                }
                startYRef.current = e.touches[0].clientY;
                startXRef.current = e.touches[0].clientX;
                lockedRef.current = false;
                abortedRef.current = false;
            }
            function onTouchMove(e) {
                const start = startYRef.current;
                const startX = startXRef.current;
                if (start == null || startX == null || abortedRef.current) return;
                if (!el || el.scrollTop > 0) {
                    startYRef.current = null;
                    startXRef.current = null;
                    setPull(0, "idle");
                    return;
                }
                const dy = e.touches[0].clientY - start;
                const dx = e.touches[0].clientX - startX;
                // Axis lock: if the user has moved more horizontally than vertically
                // by the time they cross the deadzone, treat this as a horizontal
                // gesture (e.g. swipe-to-delete on a row) and abort pull-to-refresh
                // for the rest of the touch.
                if (!lockedRef.current && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
                    abortedRef.current = true;
                    return;
                }
                if (dy <= 0) {
                    if (lockedRef.current) {
                        setPull(0, "idle");
                    }
                    return;
                }
                // Lock the gesture as a pull once the user has moved past a small deadzone
                if (!lockedRef.current && dy > 6) lockedRef.current = true;
                if (!lockedRef.current) return;
                // Damped pull: linear up to TRIGGER, then resistance.
                const damped = dy <= TRIGGER_DISTANCE ? dy : TRIGGER_DISTANCE + (dy - TRIGGER_DISTANCE) * 0.35;
                const clamped = Math.min(damped, MAX_PULL);
                setPull(clamped, clamped >= TRIGGER_DISTANCE ? "ready" : "pulling");
                if (e.cancelable) e.preventDefault();
            }
            async function onTouchEnd() {
                const start = startYRef.current;
                const wasLocked = lockedRef.current;
                const wasAborted = abortedRef.current;
                startYRef.current = null;
                startXRef.current = null;
                lockedRef.current = false;
                abortedRef.current = false;
                if (!wasLocked || start == null || wasAborted) {
                    setPull(0, "idle");
                    return;
                }
                if (pullYRef.current >= TRIGGER_DISTANCE) {
                    setPull(56, "refreshing");
                    try {
                        await onRefresh();
                    } finally{
                        setPull(0, "idle");
                    }
                } else {
                    setPull(0, "idle");
                }
            }
            el.addEventListener("touchstart", onTouchStart, {
                passive: true
            });
            el.addEventListener("touchmove", onTouchMove, {
                passive: false
            });
            el.addEventListener("touchend", onTouchEnd, {
                passive: true
            });
            el.addEventListener("touchcancel", onTouchEnd, {
                passive: true
            });
            return ({
                "usePullToRefresh.useEffect": ()=>{
                    el.removeEventListener("touchstart", onTouchStart);
                    el.removeEventListener("touchmove", onTouchMove);
                    el.removeEventListener("touchend", onTouchEnd);
                    el.removeEventListener("touchcancel", onTouchEnd);
                }
            })["usePullToRefresh.useEffect"];
        }
    }["usePullToRefresh.useEffect"], [
        el,
        onRefresh,
        enabled
    ]);
    return {
        pullY,
        phase,
        triggerDistance: TRIGGER_DISTANCE
    };
}
_s(usePullToRefresh, "TtmB7bOAx0scvOI4i5euHizaC18=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useTaskSubmission.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTaskSubmission",
    ()=>useTaskSubmission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/PointsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function useTaskSubmission({ tasks, isAuthenticated, setError }) {
    _s();
    const { dailySubmitted, recurringSubmittedToday, setDailySubmitted, setBalance, updateStaged } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePoints"])();
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [stagedTaskIds, setStagedTaskIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [submittedTaskIds, setSubmittedTaskIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [filingIds, setFilingIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [recentlyFiledIds, setRecentlyFiledIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [errorIds, setErrorIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCapWarning, setShowCapWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const _regularSubmitted = dailySubmitted - recurringSubmittedToday;
    const _remaining = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGULAR_CAP"] - _regularSubmitted;
    const _recurringRemaining = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_CAP"] - recurringSubmittedToday;
    const _selectedPts = tasks.filter((t)=>selectedIds.has(t.taskId)).reduce((s, t)=>s + t.pointValue, 0);
    const _willAward = Math.min(_selectedPts, Math.max(0, _remaining));
    const _capped = _selectedPts > _remaining;
    const _limitReached = _remaining <= 0;
    const toggleSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTaskSubmission.useCallback[toggleSelect]": (id)=>{
            setSelectedIds({
                "useTaskSubmission.useCallback[toggleSelect]": (prev)=>{
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                }
            }["useTaskSubmission.useCallback[toggleSelect]"]);
        }
    }["useTaskSubmission.useCallback[toggleSelect]"], []);
    async function doSubmit() {
        if (selectedIds.size === 0) return;
        if (!isAuthenticated) {
            const ids = [
                ...selectedIds
            ];
            setIsSubmitting(true);
            setFilingIds(new Set(ids));
            const delay = Math.max(900, (ids.length - 1) * 35 + 900);
            setTimeout(()=>{
                setSubmittedTaskIds((prev)=>new Set([
                        ...prev,
                        ...ids
                    ]));
                setRecentlyFiledIds(new Set(ids));
                setSelectedIds(new Set());
                setStagedTaskIds([]);
                setFilingIds(new Set());
                setIsSubmitting(false);
                updateStaged(0, true);
                setTimeout(()=>setRecentlyFiledIds(new Set()), 600);
            }, delay);
            return;
        }
        if (_remaining <= 0) return;
        const ids = [
            ...selectedIds
        ];
        setIsSubmitting(true);
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usersApi"].submitPoints(ids);
        setIsSubmitting(false);
        if (error) {
            setError(error);
            return;
        }
        const results = data.results ?? [];
        const failedIds = new Set(results.filter((r)=>r.error).map((r)=>r.taskId));
        const succeededIds = ids.filter((id)=>!failedIds.has(id));
        if (data.errors && data.errors.length > 0) {
            const first = data.errors[0];
            const more = data.errors.length - 1;
            setError(more > 0 ? `${first} (+${more} more)` : first);
        }
        if (failedIds.size > 0) {
            setErrorIds(failedIds);
            setTimeout(()=>setErrorIds(new Set()), 700);
        }
        if (succeededIds.length === 0) {
            setSelectedIds((prev)=>{
                const next = new Set(prev);
                for (const id of ids)if (!failedIds.has(id)) next.delete(id);
                return next;
            });
            return;
        }
        setFilingIds(new Set(succeededIds));
        const delay = Math.max(900, (succeededIds.length - 1) * 35 + 900);
        setTimeout(()=>{
            setSubmittedTaskIds((prev)=>new Set([
                    ...prev,
                    ...succeededIds
                ]));
            setRecentlyFiledIds(new Set(succeededIds));
            setSelectedIds((prev)=>{
                const next = new Set(prev);
                for (const id of succeededIds)next.delete(id);
                return next;
            });
            setStagedTaskIds((prev)=>prev.filter((id)=>!succeededIds.includes(id)));
            setFilingIds(new Set());
            setDailySubmitted(data.dailyTotal);
            setBalance(data.newBalance);
            updateStaged(0, true);
            setTimeout(()=>setRecentlyFiledIds(new Set()), 600);
        }, delay);
    }
    function handleSubmit() {
        if (_capped) {
            setShowCapWarning(true);
            return;
        }
        doSubmit();
    }
    return {
        selectedIds,
        setSelectedIds,
        stagedTaskIds,
        setStagedTaskIds,
        submittedTaskIds,
        setSubmittedTaskIds,
        filingIds,
        recentlyFiledIds,
        errorIds,
        isSubmitting,
        showCapWarning,
        setShowCapWarning,
        toggleSelect,
        doSubmit,
        handleSubmit,
        remaining: _remaining,
        recurringRemaining: _recurringRemaining,
        selectedPts: _selectedPts,
        willAward: _willAward,
        capped: _capped,
        limitReached: _limitReached
    };
}
_s(useTaskSubmission, "XDFf47myO9kmGxI7g+1awP/XySk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePoints"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useTasks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTasks",
    ()=>useTasks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockTasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/mockTasks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$penalties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/penalties.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$penalties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/penalties.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ToastContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const isStatusFilterPassthrough = (value)=>value === "all" || value === "pending" || value === "in_progress";
function useTasks({ initialFilterFromUrl }) {
    _s();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const { error, setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [submittedSeed, setSubmittedSeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const penalizedTaskIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useTasks.useMemo[penalizedTaskIds]": ()=>new Set(tasks.filter({
                "useTasks.useMemo[penalizedTaskIds]": (t)=>t.wasPenalized
            }["useTasks.useMemo[penalizedTaskIds]"]).map({
                "useTasks.useMemo[penalizedTaskIds]": (t)=>t.taskId
            }["useTasks.useMemo[penalizedTaskIds]"]))
    }["useTasks.useMemo[penalizedTaskIds]"], [
        tasks
    ]);
    // Always fetch the unfiltered set so the mobile filter pager can render every
    // filter view from the same `tasks` array. The status filter is now applied
    // client-side via buildListItems(activeFilter).
    void initialFilterFromUrl;
    void isStatusFilterPassthrough;
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        pageSize: 50,
        pageNumber: 1,
        isRecurring: false,
        isArchived: false,
        status: undefined
    });
    const setFilterStatus = (_value)=>{
        // No-op: status filtering is now client-side. Kept for API compatibility.
        void _value;
        void setFilters;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTasks.useEffect": ()=>{
            setIsMounted(true);
            const hasToken = !!localStorage.getItem("auth_token");
            setIsAuthenticated(hasToken);
            if (!hasToken) {
                setTasks((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$penalties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processPenalties"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockTasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_TASKS"].filter({
                    "useTasks.useEffect": (t)=>!t.isRecurring && !t.isArchived
                }["useTasks.useEffect"])));
                setLoading(false);
            }
        }
    }["useTasks.useEffect"], []);
    const refetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTasks.useCallback[refetch]": async ()=>{
            if (!isAuthenticated) {
                setTasks((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$penalties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processPenalties"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockTasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_TASKS"].filter({
                    "useTasks.useCallback[refetch]": (t)=>!t.isRecurring && !t.isArchived
                }["useTasks.useCallback[refetch]"])));
                return;
            }
            setError(null);
            const taskResult = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].getAll(filters);
            if (taskResult.error) {
                setError(taskResult.error);
                return;
            }
            const raw = taskResult.data.data;
            setTasks(raw);
            setSubmittedSeed(new Set(raw.filter({
                "useTasks.useCallback[refetch]": (t)=>t.pointsAwarded
            }["useTasks.useCallback[refetch]"]).map({
                "useTasks.useCallback[refetch]": (t)=>t.taskId
            }["useTasks.useCallback[refetch]"])));
        }
    }["useTasks.useCallback[refetch]"], [
        filters,
        isAuthenticated,
        setError
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTasks.useEffect": ()=>{
            if (!isAuthenticated) return;
            setLoading(true);
            refetch().finally({
                "useTasks.useEffect": ()=>setLoading(false)
            }["useTasks.useEffect"]);
        }
    }["useTasks.useEffect"], [
        refetch,
        isAuthenticated
    ]);
    return {
        tasks,
        setTasks,
        loading,
        error,
        setError,
        isMounted,
        isAuthenticated,
        penalizedTaskIds,
        filters,
        setFilterStatus,
        submittedSeed,
        refetch
    };
}
_s(useTasks, "++Oli3OoPIw12n65KQUDHwT7sLg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useLogCounter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLogCounter",
    ()=>useLogCounter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useLogCounter({ isAuthenticated, setTasks, setDetailTask, setError }) {
    _s();
    const [logPromptTask, setLogPromptTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Monotonic negative-id generator for demo-mode synthetic cycles.
    const tempIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(-1);
    const appendCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogCounter.useCallback[appendCycle]": (taskId, cycle)=>{
            setTasks({
                "useLogCounter.useCallback[appendCycle]": (prev)=>prev.map({
                        "useLogCounter.useCallback[appendCycle]": (x)=>x.taskId === taskId ? {
                                ...x,
                                recentCycles: [
                                    cycle,
                                    ...x.recentCycles ?? []
                                ]
                            } : x
                    }["useLogCounter.useCallback[appendCycle]"])
            }["useLogCounter.useCallback[appendCycle]"]);
            setDetailTask({
                "useLogCounter.useCallback[appendCycle]": (curr)=>curr && curr.taskId === taskId ? {
                        ...curr,
                        recentCycles: [
                            cycle,
                            ...curr.recentCycles ?? []
                        ]
                    } : curr
            }["useLogCounter.useCallback[appendCycle]"]);
        }
    }["useLogCounter.useCallback[appendCycle]"], [
        setTasks,
        setDetailTask
    ]);
    // Returns the appended cycle on success, null on failure. Demo mode
    // appends a synthetic cycle locally; auth mode waits for the server's
    // response and only then appends. The caller (typically QuickLogStepper)
    // is responsible for adjusting any local "buffered" delta atomically with
    // the cycle's addition — that's what keeps the displayed sum stable.
    const writeCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogCounter.useCallback[writeCycle]": async (taskId, value, opts)=>{
            if (!isAuthenticated) {
                const tempId = tempIdRef.current--;
                const now = new Date();
                const local = {
                    cycleId: tempId,
                    taskId,
                    checkInDate: now.toISOString(),
                    counterValue: value,
                    createdAt: now.toISOString()
                };
                appendCycle(taskId, local);
                return local;
            }
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].logCounter(taskId, value, opts?.keepalive ? {
                keepalive: true
            } : undefined);
            if (result.error) {
                // 404 means the task is gone — typically because the user deleted it
                // while a flush was in-flight (the modal's unmount cleanup zeros the
                // buffered case, but already-sent requests still land). Silently drop
                // those; toasting "Couldn't save log" against a task that no longer
                // exists is misleading.
                if (result.status === 404) return null;
                // 400 with the "already checked in" message means the user checked in
                // while a +/- buffer was still mid-flight. The cycle is now closed
                // and the buffered delta refers to a finalised cycle, so drop it
                // silently — the toast would surprise a user who just successfully
                // completed their check-in.
                if (result.status === 400 && /already checked in/i.test(result.error)) return null;
                // Tag the toast with the rejected delta so the user knows what to redo.
                // Without this they only see the raw server message ("Bad Request"),
                // which gives no clue that their last +/- run wasn't saved.
                const signed = `${value > 0 ? "+" : ""}${value}`;
                setError(`Couldn't save log (${signed}): ${result.error}`);
                return null;
            }
            if (!result.data) return null;
            appendCycle(taskId, result.data);
            return result.data;
        }
    }["useLogCounter.useCallback[writeCycle]"], [
        isAuthenticated,
        appendCycle,
        setError
    ]);
    const requestLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogCounter.useCallback[requestLog]": (t)=>{
            setLogPromptTask(t);
        }
    }["useLogCounter.useCallback[requestLog]"], []);
    const cancelLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogCounter.useCallback[cancelLog]": ()=>setLogPromptTask(null)
    }["useLogCounter.useCallback[cancelLog]"], []);
    const submitLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogCounter.useCallback[submitLog]": async (value)=>{
            const t = logPromptTask;
            if (!t) return;
            setLogPromptTask(null);
            await writeCycle(t.taskId, value);
        }
    }["useLogCounter.useCallback[submitLog]"], [
        logPromptTask,
        writeCycle
    ]);
    // Stable-identity flush: takes taskId explicitly so the detail modal can
    // safely call it from a useEffect cleanup or unload handler without
    // closure-capturing a stale task. Pass `{ keepalive: true }` from
    // pagehide/visibilitychange handlers so the request survives unload.
    // Resolves to the appended cycle on success, null on failure. Returns
    // a resolved-null promise for delta=0 so the caller can always `await`.
    const flushQuickLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogCounter.useCallback[flushQuickLog]": (taskId, delta, opts)=>{
            if (delta === 0) return Promise.resolve(null);
            return writeCycle(taskId, delta, opts);
        }
    }["useLogCounter.useCallback[flushQuickLog]"], [
        writeCycle
    ]);
    return {
        logPromptTask,
        requestLog,
        cancelLog,
        submitLog,
        flushQuickLog
    };
}
_s(useLogCounter, "HsGpZlT23/LS6FydSZGR0tRMJr4=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useDesktopLayout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDesktopLayout",
    ()=>useDesktopLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useDesktopLayout() {
    _s();
    const [isDesktop, setIsDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDesktopLayout.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const mq = window.matchMedia("(min-width: 880px)");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            const update = {
                "useDesktopLayout.useEffect.update": ()=>setIsDesktop(mq.matches)
            }["useDesktopLayout.useEffect.update"];
            update();
            mq.addEventListener("change", update);
            return ({
                "useDesktopLayout.useEffect": ()=>mq.removeEventListener("change", update)
            })["useDesktopLayout.useEffect"];
        }
    }["useDesktopLayout.useEffect"], []);
    return isDesktop;
}
_s(useDesktopLayout, "I3DqNlxt7Pw4zzIZQic0ZfednQQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useOverdueRestart.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOverdueRestart",
    ()=>useOverdueRestart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useOverdueRestart() {
    _s();
    const [overdueRestartTaskId, setOverdueRestartTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const beginRestart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOverdueRestart.useCallback[beginRestart]": (t)=>{
            setOverdueRestartTaskId(t.taskId);
        }
    }["useOverdueRestart.useCallback[beginRestart]"], []);
    const clearRestart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOverdueRestart.useCallback[clearRestart]": ()=>{
            setOverdueRestartTaskId(null);
        }
    }["useOverdueRestart.useCallback[clearRestart]"], []);
    const isRestart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOverdueRestart.useCallback[isRestart]": (t)=>!!t && overdueRestartTaskId === t.taskId
    }["useOverdueRestart.useCallback[isRestart]"], [
        overdueRestartTaskId
    ]);
    return {
        overdueRestartTaskId,
        beginRestart,
        clearRestart,
        isRestart
    };
}
_s(useOverdueRestart, "cZuuLlgZVUv/UHbCWySYUFYNmNQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useSaveTask.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSaveTask",
    ()=>useSaveTask
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useSaveTask({ detailTask, setDetailTask, setTasks, isAuthenticated, isRestart, onAfterRestart, clearRestart }) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSaveTask.useCallback": async (fields)=>{
            if (!detailTask) return null;
            const finalize = {
                "useSaveTask.useCallback.finalize": (updated)=>{
                    setTasks({
                        "useSaveTask.useCallback.finalize": (prev)=>prev.map({
                                "useSaveTask.useCallback.finalize": (t)=>t.taskId === detailTask.taskId ? updated : t
                            }["useSaveTask.useCallback.finalize"])
                    }["useSaveTask.useCallback.finalize"]);
                    setDetailTask(updated);
                    if (isRestart) {
                        clearRestart();
                        setDetailTask(null);
                        onAfterRestart?.(updated);
                    }
                }
            }["useSaveTask.useCallback.finalize"];
            if (!isAuthenticated) {
                finalize({
                    ...detailTask,
                    ...fields
                });
                return null;
            }
            const req = {
                taskId: detailTask.taskId,
                title: fields.title,
                description: fields.description ?? undefined,
                category: fields.category,
                priority: fields.priority,
                status: detailTask.status,
                pointValue: detailTask.pointValue,
                dueDate: fields.dueDate ?? undefined,
                completedAt: detailTask.completedAt ?? undefined,
                isRecurring: detailTask.isRecurring,
                recurrenceRule: detailTask.recurrenceRule ?? undefined,
                submitted: detailTask.submitted,
                hasCounter: fields.hasCounter ?? detailTask.hasCounter ?? false,
                counterUnit: fields.counterUnit !== undefined ? fields.counterUnit : detailTask.counterUnit ?? null,
                counterGoal: fields.counterGoal !== undefined ? fields.counterGoal : detailTask.counterGoal ?? null
            };
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].update(detailTask.taskId, req);
            if (error) return error;
            finalize({
                ...detailTask,
                ...fields
            });
            return null;
        }
    }["useSaveTask.useCallback"], [
        detailTask,
        setDetailTask,
        setTasks,
        isAuthenticated,
        isRestart,
        onAfterRestart,
        clearRestart
    ]);
}
_s(useSaveTask, "epj4qY15NHsef74wNqHIp5fdZmg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_hooks_7775a007._.js.map