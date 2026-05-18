module.exports = [
"[project]/packages/shared/src/api/tasks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTasksApi",
    ()=>createTasksApi
]);
function toQueryString(params) {
    const entries = Object.entries(params).filter(([, v])=>v !== undefined && v !== null && v !== "");
    if (entries.length === 0) return "";
    return "?" + entries.map(([k, v])=>`${k}=${encodeURIComponent(String(v))}`).join("&");
}
function createTasksApi(client) {
    return {
        getAll: (filters = {})=>client.authedGet(`/api/tasks${toQueryString(filters)}`),
        getById: (id)=>client.authedGet(`/api/tasks/${id}`),
        getPending: ()=>client.authedGet(`/api/tasks/pending`),
        create: (dto)=>client.authedPost(`/api/tasks`, dto),
        update: (id, dto)=>client.authedPut(`/api/tasks/${id}`, dto),
        start: (id)=>client.authedPatch(`/api/tasks/${id}/start`),
        complete: (id)=>client.authedPatch(`/api/tasks/${id}/complete`),
        delete: (id)=>client.authedDelete(`/api/tasks/${id}`),
        checkIn: (id, counterValue)=>client.authedPost(`/api/tasks/${id}/checkin`, counterValue !== undefined ? {
                counterValue
            } : {}),
        getCheckInHistory: (id, pageNumber = 1, pageSize = 30)=>client.authedGet(`/api/tasks/${id}/checkin-history?pageNumber=${pageNumber}&pageSize=${pageSize}`),
        updateCheckInCycle: (taskId, cycleId, counterValue)=>client.authedPatch(`/api/tasks/${taskId}/checkin-history/${cycleId}`, {
                counterValue
            }),
        logCounter: (id, counterValue, init)=>client.authedPost(`/api/tasks/${id}/log-counter`, {
                counterValue
            }, init),
        undoCheckIn: (taskId, cycleId)=>client.authedPost(`/api/tasks/${taskId}/checkin/${cycleId}/undo`, {}),
        deleteLogCycle: (taskId, cycleId)=>client.authedDelete(`/api/tasks/${taskId}/checkin-history/${cycleId}`),
        skipCycle: (id)=>client.authedPost(`/api/tasks/${id}/skip-cycle`, {}),
        archive: (id)=>client.authedPatch(`/api/tasks/${id}/archive`),
        unarchive: (id)=>client.authedPatch(`/api/tasks/${id}/unarchive`)
    };
}
}),
"[project]/apps/web/src/lib/api/tasks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tasksApi",
    ()=>tasksApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/api/tasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/client.ts [app-ssr] (ecmascript)");
;
;
const tasksApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTasksApi"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"]);
}),
"[project]/packages/shared/src/api/subtasks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSubtasksApi",
    ()=>createSubtasksApi
]);
function createSubtasksApi(client) {
    return {
        create: (taskId, payload)=>client.authedPost(`/api/tasks/${taskId}/subtasks`, typeof payload === "string" ? {
                title: payload
            } : payload),
        update: (id, fields)=>client.authedPatch(`/api/subtasks/${id}`, fields),
        delete: (id)=>client.authedDelete(`/api/subtasks/${id}`),
        reorder: (taskId, orderedIds)=>client.authedPost(`/api/tasks/${taskId}/subtasks/reorder`, {
                orderedIds
            })
    };
}
}),
"[project]/apps/web/src/lib/api/subtasks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "subtasksApi",
    ()=>subtasksApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$subtasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/api/subtasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/client.ts [app-ssr] (ecmascript)");
;
;
const subtasksApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$subtasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSubtasksApi"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"]);
}),
"[project]/apps/web/src/components/ThreadSubtaskRow.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThreadSubtaskRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const COMMIT_THRESHOLD = 80;
const MAX_DRAG = 160;
const ROW_HEIGHT = 36;
const THREAD_GUTTER = 22;
const GAP_ABOVE = 4;
function ThreadSubtaskRow({ subtask, isFirst, isLast, onToggle, onDelete }) {
    const [dragX, setDragX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const swipeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    function onTouchStart(e) {
        const t = e.touches[0];
        swipeRef.current = {
            startX: t.clientX,
            startY: t.clientY,
            locked: null
        };
    }
    function onTouchMove(e) {
        const s = swipeRef.current;
        if (!s) return;
        const t = e.touches[0];
        const dx = t.clientX - s.startX;
        const dy = t.clientY - s.startY;
        if (s.locked === null) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            s.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        }
        if (s.locked === "h") {
            const leftAmount = Math.max(0, -dx);
            const damped = leftAmount <= COMMIT_THRESHOLD ? leftAmount : COMMIT_THRESHOLD + (leftAmount - COMMIT_THRESHOLD) * 0.4;
            setDragX(Math.min(damped, MAX_DRAG));
        }
    }
    function onTouchEnd() {
        const s = swipeRef.current;
        swipeRef.current = null;
        if (!s || s.locked !== "h") {
            setDragX(0);
            return;
        }
        if (dragX >= COMMIT_THRESHOLD) {
            onDelete();
        } else {
            setDragX(0);
        }
    }
    const ready = dragX >= COMMIT_THRESHOLD;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            height: ROW_HEIGHT
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": true,
                        className: "absolute inset-y-0 right-0 flex items-center justify-end",
                        style: {
                            width: Math.max(dragX, 0),
                            paddingRight: 14,
                            background: ready ? "rgba(239,68,68,0.9)" : "rgba(239,68,68,0.55)",
                            color: "white",
                            transition: dragX === 0 ? "width 0.18s cubic-bezier(0.2,0,0,1), background 0.12s" : "background 0.12s",
                            overflow: "hidden",
                            pointerEvents: "none"
                        },
                        children: dragX > 28 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "14",
                            height: "14",
                            viewBox: "0 0 14 14",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "1.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M5 3V2.2h4V3"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "2",
                                    y1: "3.5",
                                    x2: "12",
                                    y2: "3.5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M3.5 4l0.7 7.5h5.6L10.5 4",
                                    fill: "none"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "6",
                                    y1: "6",
                                    x2: "6",
                                    y2: "10"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "8",
                                    y1: "6",
                                    x2: "8",
                                    y2: "10"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                        lineNumber: 73,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        style: {
                            position: "absolute",
                            inset: 0,
                            paddingLeft: THREAD_GUTTER,
                            gap: 8,
                            background: "var(--color-bg)",
                            transform: dragX > 0 ? `translateX(-${dragX}px)` : undefined,
                            transition: dragX === 0 ? "transform 0.18s cubic-bezier(0.2,0,0,1)" : "none",
                            touchAction: "pan-y",
                            willChange: dragX > 0 ? "transform" : undefined
                        },
                        onTouchStart: onTouchStart,
                        onTouchMove: onTouchMove,
                        onTouchEnd: onTouchEnd,
                        onTouchCancel: onTouchEnd,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onToggle();
                                },
                                className: "flex-shrink-0 flex items-center justify-center cursor-pointer",
                                style: {
                                    width: 28,
                                    height: 28,
                                    background: "transparent",
                                    border: "none",
                                    padding: 0
                                },
                                "aria-label": subtask.completed ? "Uncheck subtask" : "Check subtask",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center justify-center",
                                    style: {
                                        width: 14,
                                        height: 14,
                                        border: `1px solid ${subtask.completed ? "var(--color-success)" : "var(--color-border)"}`,
                                        borderRadius: 2,
                                        background: subtask.completed ? "rgba(74,222,128,0.12)" : "transparent"
                                    },
                                    children: subtask.completed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "6",
                                        viewBox: "0 0 8 6",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                            points: "1,3 3,5 7,1",
                                            style: {
                                                stroke: "var(--color-success)"
                                            },
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                            lineNumber: 138,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                    lineNumber: 127,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                lineNumber: 116,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onToggle();
                                },
                                className: "flex-1 text-xs cursor-pointer select-none truncate",
                                style: {
                                    color: subtask.completed ? "var(--color-fg-muted)" : "var(--color-fg)",
                                    textDecoration: subtask.completed ? "line-through" : "none"
                                },
                                children: subtask.title
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                lineNumber: 144,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onDelete();
                                },
                                title: "Delete subtask",
                                "aria-label": "Delete subtask",
                                className: "flex-shrink-0 flex items-center justify-center",
                                style: {
                                    width: 32,
                                    height: 32,
                                    marginRight: -6,
                                    background: "transparent",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                    color: "var(--color-fg-subtle)",
                                    opacity: 0.55,
                                    transition: "opacity 0.15s ease, color 0.15s ease"
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.opacity = "1";
                                    e.currentTarget.style.color = "var(--color-danger)";
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.opacity = "0.55";
                                    e.currentTarget.style.color = "var(--color-fg-subtle)";
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "12",
                                    height: "12",
                                    viewBox: "0 0 14 14",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "1.4",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M5 3V2.2h4V3"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                            lineNumber: 175,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "2",
                                            y1: "3.5",
                                            x2: "12",
                                            y2: "3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                            lineNumber: 176,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M3.5 4l0.7 7.5h5.6L10.5 4",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                            lineNumber: 177,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "6",
                                            y1: "6",
                                            x2: "6",
                                            y2: "10"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                            lineNumber: 178,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "8",
                                            y1: "6",
                                            x2: "8",
                                            y2: "10"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                            lineNumber: 179,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                    lineNumber: 174,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                                lineNumber: 155,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                        lineNumber: 98,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            (()=>{
                const topOffset = isFirst ? 0 : -GAP_ABOVE;
                const svgHeight = ROW_HEIGHT - topOffset;
                const lineStart = isFirst ? 8 : 0;
                const lineEnd = isLast ? ROW_HEIGHT - topOffset - ROW_HEIGHT / 2 : svgHeight;
                const horizontalY = ROW_HEIGHT - topOffset - ROW_HEIGHT / 2;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    "aria-hidden": true,
                    width: THREAD_GUTTER,
                    height: svgHeight,
                    viewBox: `0 0 ${THREAD_GUTTER} ${svgHeight}`,
                    style: {
                        position: "absolute",
                        left: 0,
                        top: topOffset,
                        color: "var(--color-border-faint)",
                        pointerEvents: "none"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "16",
                            y1: lineStart,
                            x2: "16",
                            y2: lineEnd,
                            stroke: "currentColor",
                            strokeWidth: "1"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "16",
                            y1: horizontalY,
                            x2: "22",
                            y2: horizontalY,
                            stroke: "currentColor",
                            strokeWidth: "1"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                            lineNumber: 209,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
                    lineNumber: 197,
                    columnNumber: 11
                }, this);
            })()
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/ThreadSubtaskRow.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/lib/dateUtils.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/packages/shared/src/time/dateUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canCheckInNow",
    ()=>canCheckInNow,
    "dateKey",
    ()=>dateKey,
    "getCyclesOverdue",
    ()=>getCyclesOverdue,
    "getNextDueDate",
    ()=>getNextDueDate,
    "getNextOccurrenceLabel",
    ()=>getNextOccurrenceLabel,
    "getPrevPeriodStart",
    ()=>getPrevPeriodStart,
    "getUnlockInfo",
    ()=>getUnlockInfo,
    "isCycleClosed",
    ()=>isCycleClosed,
    "isOverdue",
    ()=>isOverdue,
    "parseLocalDate",
    ()=>parseLocalDate,
    "sumTodayCycleCounter",
    ()=>sumTodayCycleCounter,
    "todayLocalKey",
    ()=>todayLocalKey
]);
function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
    return new Date(y, m - 1, d);
}
function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayLocalKey() {
    return dateKey(new Date());
}
function sumTodayCycleCounter(cycles) {
    if (!cycles || cycles.length === 0) return 0;
    const today = todayLocalKey();
    let sum = 0;
    for (const c of cycles){
        if (typeof c.counterValue === "number" && c.checkInDate.split("T")[0] === today) {
            sum += c.counterValue;
        }
    }
    return sum;
}
function normalizeRule(rule) {
    return (rule ?? "").toLowerCase();
}
function getPrevPeriodStart(due, rule) {
    const r = normalizeRule(rule);
    const prev = new Date(due);
    if (r === "daily" || r === "weekdays") prev.setDate(prev.getDate() - 1);
    else if (r === "weekly") prev.setDate(prev.getDate() - 7);
    else if (r === "biweekly") prev.setDate(prev.getDate() - 14);
    else if (r === "monthly") prev.setMonth(prev.getMonth() - 1);
    return prev;
}
function canCheckInNow(dueDate, rule, lastCheckInDate) {
    const r = normalizeRule(rule);
    if (r === "weekdays") {
        const day = new Date().getDay();
        if (day === 0 || day === 6) return false;
    }
    if (!dueDate) return true;
    const due = parseLocalDate(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prevStart = getPrevPeriodStart(due, r);
    if (today <= prevStart) return false;
    if (lastCheckInDate) {
        const last = parseLocalDate(lastCheckInDate);
        if (last > prevStart) return false;
    }
    return true;
}
function getNextDueDate(dueDate, rule) {
    const r = normalizeRule(rule);
    const base = dueDate ? parseLocalDate(dueDate) : new Date();
    base.setHours(12, 0, 0, 0);
    if (r === "daily") base.setDate(base.getDate() + 1);
    else if (r === "weekdays") {
        base.setDate(base.getDate() + 1);
        while(base.getDay() === 0 || base.getDay() === 6)base.setDate(base.getDate() + 1);
    } else if (r === "weekly") base.setDate(base.getDate() + 7);
    else if (r === "biweekly") base.setDate(base.getDate() + 14);
    else if (r === "monthly") base.setMonth(base.getMonth() + 1);
    return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
}
function getNextOccurrenceLabel(dueDate, rule) {
    const r = normalizeRule(rule);
    if (!dueDate) return r.charAt(0).toUpperCase() + r.slice(1);
    const d = parseLocalDate(dueDate);
    if (r === "weekly") d.setDate(d.getDate() + 7);
    if (r === "biweekly") d.setDate(d.getDate() + 14);
    if (r === "monthly") d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}
function getUnlockInfo(dueDate) {
    if (!dueDate) return null;
    const due = parseLocalDate(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return null;
    const dateStr = due.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
    const relative = diffDays === 1 ? "tomorrow" : `in ${diffDays}d`;
    return {
        date: dateStr,
        relative,
        days: diffDays
    };
}
function isCycleClosed(dueDate, lastCheckInDate) {
    if (!lastCheckInDate || !dueDate) return false;
    if (isOverdue(dueDate)) return false;
    const due = parseLocalDate(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today < due;
}
function isOverdue(dueDate) {
    if (!dueDate) return false;
    const due = parseLocalDate(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > due;
}
function getCyclesOverdue(dueDate, rule) {
    if (!dueDate) return 0;
    const r = normalizeRule(rule);
    const due = parseLocalDate(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today <= due) return 0;
    const daysDiff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    if (!r || r === "daily") return daysDiff;
    if (r === "weekly") return Math.floor(daysDiff / 7);
    if (r === "biweekly") return Math.floor(daysDiff / 14);
    if (r === "monthly") {
        return (today.getFullYear() - due.getFullYear()) * 12 + (today.getMonth() - due.getMonth());
    }
    if (r === "weekdays") {
        let count = 0;
        const d = new Date(due);
        while(d < today){
            const dow = d.getDay();
            if (dow !== 0 && dow !== 6) count++;
            d.setDate(d.getDate() + 1);
        }
        return count;
    }
    return daysDiff;
}
}),
"[project]/apps/web/src/lib/assetPath.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assetPath",
    ()=>assetPath
]);
// Prepends the configured base path so absolute paths to files in /public/
// resolve correctly when the app is mounted under a sub-path on GitHub Pages
// (e.g. https://wahahah-byte.github.io/wahaha-byte/).
//
// Next.js' basePath/assetPrefix only auto-rewrites bundle URLs and next/image
// — anything that hits the DOM as a plain string (e.g. <img src=...>, css
// background-image, fetch URLs to /public files) needs this manual prefix.
//
// In dev NEXT_PUBLIC_BASE_PATH is empty, so this is a no-op locally.
const PREFIX = ("TURBOPACK compile-time value", "") ?? "";
function assetPath(p) {
    // Don't double-prefix if a fully-qualified URL was passed in.
    if (/^https?:\/\//i.test(p)) return p;
    if (!p.startsWith("/")) return `${PREFIX}/${p}`;
    return `${PREFIX}${p}`;
}
}),
"[project]/apps/web/src/lib/categoryIcons.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoryIcon",
    ()=>CategoryIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// Pixelated placeholder icons per category. The user plans to replace these
// with custom artwork later — these are rough recognizable silhouettes drawn
// from string-based pixel grids so they render crisp and tint with currentColor.
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/assetPath.ts [app-ssr] (ecmascript)");
;
;
// All icons are drawn on a 10×10 grid so they render at the same visual
// size. Strokes are 2 pixels wide (or solid silhouettes) — no 1-pixel-wide
// diagonals that disappear at 12 px.
const ICONS = {
    Career: [
        "..........",
        "...XXXX...",
        "...XXXX...",
        ".XXXXXXXX.",
        ".XXXXXXXX.",
        ".XX....XX.",
        ".XX....XX.",
        ".XXXXXXXX.",
        ".XXXXXXXX.",
        ".........."
    ],
    Design: [
        "........XX",
        ".......XXX",
        "......XXX.",
        ".....XXX..",
        "....XXX...",
        "...XXX....",
        "..XXX.....",
        ".XXXX.....",
        "XXX.......",
        "XX........"
    ],
    Dev: [
        "..........",
        "....XX..XX",
        "...XX..XX.",
        "..XX..XX..",
        ".XX..XX...",
        "..XX..XX..",
        "...XX..XX.",
        "....XX..XX",
        "..........",
        ".........."
    ],
    Finance: [
        "..........",
        "..XXXXXX..",
        ".XX....XX.",
        "..XXXXXX..",
        ".XX....XX.",
        "..XXXXXX..",
        ".XX....XX.",
        "..XXXXXX..",
        ".XX....XX.",
        "..XXXXXX.."
    ],
    Fitness: [
        "..........",
        "XXX....XXX",
        "XXX....XXX",
        "XXXXXXXXXX",
        "XXXXXXXXXX",
        "XXXXXXXXXX",
        "XXXXXXXXXX",
        "XXX....XXX",
        "XXX....XXX",
        ".........."
    ],
    Habits: [
        "..XXXXXX..",
        ".XXXXXXXX.",
        "XX..XX..XX",
        "XX.XXXX.XX",
        "XXXXXXXXXX",
        "XXXXXXXXXX",
        "XX.XXXX.XX",
        "XX..XX..XX",
        ".XXXXXXXX.",
        "..XXXXXX.."
    ],
    Health: [
        "..........",
        "...XXXX...",
        "...XXXX...",
        "...XXXX...",
        "XXXXXXXXXX",
        "XXXXXXXXXX",
        "...XXXX...",
        "...XXXX...",
        "...XXXX...",
        ".........."
    ],
    Learning: [
        "..........",
        "....XX....",
        "...XXXX...",
        "..XXXXXX..",
        ".XXXXXXXX.",
        "XXXXXXXXXX",
        "....XX....",
        ".XXXXXXXX.",
        ".XXXXXXXX.",
        ".........."
    ],
    Other: [
        "..........",
        "..........",
        "..........",
        "..XX..XX..",
        "..XX..XX..",
        "..XX..XX..",
        "..XX..XX..",
        "..........",
        "..........",
        ".........."
    ],
    Personal: [
        "..........",
        "...XXXX...",
        "..XXXXXX..",
        "..XXXXXX..",
        "...XXXX...",
        "..XXXXXX..",
        ".XXXXXXXX.",
        "XXX.XX.XXX",
        "....XX....",
        "...XXXX..."
    ],
    Productivity: [
        ".....XXXX.",
        "....XXXX..",
        "...XXXX...",
        "..XXXX....",
        ".XXXXXXXX.",
        "....XXXX..",
        "...XXXX...",
        "..XXXX....",
        ".XXXX.....",
        ".XXX......"
    ],
    Study: [
        "..XXXXXX..",
        ".XXXXXXXX.",
        ".XX....XX.",
        ".XX.XX.XX.",
        ".XX....XX.",
        ".XX.XX.XX.",
        ".XX....XX.",
        ".XX.XX.XX.",
        ".XXXXXXXX.",
        "..XXXXXX.."
    ],
    Work: [
        "..XXXXXX..",
        ".XXXXXXXX.",
        "XXXXXXXXXX",
        "XXXXXXXXXX",
        ".XXXXXXXX.",
        "....XX....",
        "....XX....",
        "....XX....",
        "....XX....",
        "...XXXX..."
    ]
};
// PNG assets live in /public/icons. Categories that don't have a PNG fall
// back to the pixel-grid SVG below. Filenames don't always match the
// category name verbatim (e.g. Learning ↔ Learn.png), so this map is
// authoritative.
const ICON_PATHS = {
    Career: "/icons/Careers.png",
    Design: "/icons/Design.png",
    Dev: "/icons/dev.png",
    Finance: "/icons/Finance.png",
    Fitness: "/icons/Fitness.png",
    Habits: "/icons/Habits.png",
    Health: "/icons/Health.png",
    Learning: "/icons/Learn.png",
    Personal: "/icons/Personal.png",
    Productivity: "/icons/Productivity.png",
    Study: "/icons/Study.png",
    Work: "/icons/Work.png"
};
function CategoryIcon({ category, size = 12, color = "currentColor" }) {
    const src = ICON_PATHS[category];
    if (src) {
        return(// eslint-disable-next-line @next/next/no-img-element
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            // Route through assetPath() so the prefix is applied on static builds.
            // Without this, `/icons/Foo.png` 404s on GitHub Pages (and any other
            // host that serves the app under a sub-path) because next.config.ts'
            // basePath only rewrites bundle URLs and next/image — plain <img src>
            // is left untouched and needs the prefix added manually.
            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(src),
            alt: "",
            width: size,
            height: size,
            style: {
                display: "inline-block",
                objectFit: "contain",
                background: "transparent"
            }
        }, void 0, false, {
            fileName: "[project]/apps/web/src/lib/categoryIcons.tsx",
            lineNumber: 201,
            columnNumber: 7
        }, this));
    }
    const pixels = ICONS[category];
    if (!pixels) {
        // Fallback: small dot
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: size,
            height: size,
            viewBox: "0 0 10 10",
            fill: "none",
            shapeRendering: "crispEdges",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "4",
                y: "4",
                width: "2",
                height: "2",
                fill: color
            }, void 0, false, {
                fileName: "[project]/apps/web/src/lib/categoryIcons.tsx",
                lineNumber: 225,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/lib/categoryIcons.tsx",
            lineNumber: 224,
            columnNumber: 7
        }, this);
    }
    const h = pixels.length;
    const w = pixels[0]?.length ?? 10;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: `0 0 ${w} ${h}`,
        fill: "none",
        shapeRendering: "crispEdges",
        preserveAspectRatio: "xMidYMid meet",
        children: pixels.flatMap((row, y)=>Array.from(row).map((char, x)=>char !== "." ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: x,
                    y: y,
                    width: "1",
                    height: "1",
                    fill: color
                }, `${x}-${y}`, false, {
                    fileName: "[project]/apps/web/src/lib/categoryIcons.tsx",
                    lineNumber: 245,
                    columnNumber: 13
                }, this) : null))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/lib/categoryIcons.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/BankBurstEffect.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BankBurstEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
"use client";
;
;
;
// How long the effect should keep rendering after being triggered. Must
// outlast the longest CSS animation defined in globals.css:
//   underline-fade: 1.8s (no delay)
//   popup-fade:     0.3s delay + 1.45s = 1.75s
// 1900ms gives a ~100ms safety pad so the final opacity-0 keyframe is held
// briefly before unmount — otherwise React rips the popup out the instant
// the animation's last frame fires and the eye sees it pop instead of fade.
const PLAY_DURATION_MS = 1900;
function BankBurstEffect({ active, amount = 0 }) {
    const [playing, setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [balanceCenter, setBalanceCenter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Captured `amount` from the trigger so re-renders during the play window
    // don't show "+0" if the parent has already cleared its point state.
    const [snapshotAmount, setSnapshotAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // Holds the pending cleanup timer + the chip we attached the glow class
    // to, so a re-trigger inside the play window can cancel the previous
    // cleanup and replay cleanly instead of yanking the glow mid-pulse.
    const stopTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const glowTargetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!active) return;
        // Re-trigger: cancel any in-flight cleanup first so a previous run
        // doesn't strip the glow class out from under the new run.
        if (stopTimerRef.current !== null) {
            window.clearTimeout(stopTimerRef.current);
            glowTargetRef.current?.classList.remove("bank-stamp-glow");
        }
        // The balance chip only renders for authenticated users (see
        // AuthHeader's early-return on !hasToken). On the static demo / GitHub
        // Pages, querySelector returns null — we still want the row underline
        // to play, just without the balance glow + +N popup attached to a
        // non-existent target. Earlier code bailed here on null and the entire
        // animation went unrendered.
        const target = document.querySelector('[data-coin-target="balance"]');
        if (target) {
            const rect = target.getBoundingClientRect();
            setBalanceCenter({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
            target.classList.add("bank-stamp-glow");
            glowTargetRef.current = target;
        } else {
            setBalanceCenter(null);
            glowTargetRef.current = null;
        }
        setSnapshotAmount(amount);
        setPlaying(true);
        stopTimerRef.current = window.setTimeout(()=>{
            setPlaying(false);
            setBalanceCenter(null);
            glowTargetRef.current?.classList.remove("bank-stamp-glow");
            stopTimerRef.current = null;
            glowTargetRef.current = null;
        }, PLAY_DURATION_MS);
    }, [
        active,
        amount
    ]);
    // Final unmount cleanup — yanks any pending timer + lingering glow so a
    // navigation away during the play window doesn't leak the class.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>{
            if (stopTimerRef.current !== null) {
                window.clearTimeout(stopTimerRef.current);
            }
            glowTargetRef.current?.classList.remove("bank-stamp-glow");
        }, []);
    if (!playing) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                className: "bank-stamp-underline",
                style: {
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 1,
                    // Full success colour as the source; intensity is controlled by
                    // the bank-stamp-underline-fade keyframes (peak 0.55) so layering
                    // a low-alpha rgba on top would make the bar disappear entirely.
                    // Halo stays small + soft to bleed rather than glow.
                    background: "var(--color-success)",
                    boxShadow: "0 0 3px rgba(74, 222, 128, 0.22)",
                    pointerEvents: "none",
                    zIndex: 28
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/BankBurstEffect.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            balanceCenter && snapshotAmount > 0 && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                className: "bank-stamp-popup",
                style: {
                    position: "fixed",
                    left: balanceCenter.x,
                    top: balanceCenter.y,
                    pointerEvents: "none",
                    zIndex: 9999,
                    // Brand green stays so the text is legible; the
                    // bank-stamp-popup-fade keyframes peak at 0.7 so the +N reads
                    // as a soft drift rather than a bright pop.
                    color: "var(--color-success)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    textShadow: "0 0 4px rgba(74, 222, 128, 0.22)"
                },
                children: [
                    "+",
                    snapshotAmount.toLocaleString()
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/BankBurstEffect.tsx",
                lineNumber: 127,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true);
}
}),
"[project]/apps/web/src/components/CheckInBurstEffect.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CheckInBurstEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const PARTICLE_COUNT = 12;
function buildParticles() {
    const cols = [
        "var(--color-active-highlight-alt)",
        "var(--color-success)",
        "var(--color-warning)"
    ];
    return Array.from({
        length: PARTICLE_COUNT
    }, (_, i)=>{
        // Spray upward in a wide cone for visible burst on a row.
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.95);
        const dist = 36 + Math.random() * 28;
        return {
            dx: Math.cos(angle) * dist,
            dy: Math.sin(angle) * dist,
            size: i % 3 === 0 ? 4 : 3,
            delay: Math.floor(Math.random() * 60),
            color: cols[i % cols.length],
            rot: (Math.random() - 0.5) * 90
        };
    });
}
function CheckInBurstEffect({ active }) {
    const [particles, setParticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!active) {
            setParticles(null);
            return;
        }
        setParticles(buildParticles());
        const t = setTimeout(()=>setParticles(null), 900);
        return ()=>clearTimeout(t);
    }, [
        active
    ]);
    if (!particles) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": true,
        style: {
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "visible",
            zIndex: 27
        },
        children: particles.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "checkin-particle",
                style: {
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    ["--p-end"]: `translate(${Math.round(p.dx)}px, ${Math.round(p.dy)}px) rotate(${Math.round(p.rot * 2)}deg) scale(0.4)`,
                    animationDelay: `${p.delay}ms`
                }
            }, i, false, {
                fileName: "[project]/apps/web/src/components/CheckInBurstEffect.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/CheckInBurstEffect.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/TierUpBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currentStreakTier",
    ()=>currentStreakTier,
    "default",
    ()=>TierUpBanner,
    "tierForStreak",
    ()=>tierForStreak
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const VISIBLE_MS = 2200;
function TierUpBanner({ message, onDone }) {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!message) return;
        const t = setTimeout(()=>onDone?.(), VISIBLE_MS);
        return ()=>clearTimeout(t);
    }, [
        message,
        onDone
    ]);
    if (!mounted || !message) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-live": "polite",
        style: {
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0px) + 18px)",
            left: "50%",
            zIndex: 9000,
            pointerEvents: "none",
            animation: "tier-banner-in 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            background: "var(--color-active-highlight-alt-bg, rgba(91,184,224,0.12))",
            border: "1px solid var(--color-active-highlight-alt)",
            borderRadius: 999,
            padding: "8px 16px",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(6px)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": true,
                style: {
                    fontSize: 16,
                    lineHeight: 1
                },
                children: "🔥"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TierUpBanner.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "var(--color-active-highlight-alt)",
                    whiteSpace: "nowrap"
                },
                children: [
                    message.tierLabel,
                    " · ",
                    message.multiplier,
                    " unlocked"
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/TierUpBanner.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, message.id, true, {
        fileName: "[project]/apps/web/src/components/TierUpBanner.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this), document.body);
}
function currentStreakTier(count) {
    if (count < 3) return null;
    if (count >= 30) return {
        tier: 4,
        label: "TIER 4"
    };
    if (count >= 14) return {
        tier: 3,
        label: "TIER 3"
    };
    if (count >= 7) return {
        tier: 2,
        label: "TIER 2"
    };
    return {
        tier: 1,
        label: "TIER 1"
    };
}
function tierForStreak(prev, next) {
    const tiers = [
        {
            at: 3,
            label: "Day 3",
            mult: "1.2×"
        },
        {
            at: 7,
            label: "Week One",
            mult: "1.5×"
        },
        {
            at: 14,
            label: "Two Weeks",
            mult: "1.8×"
        },
        {
            at: 30,
            label: "Month Streak",
            mult: "2.0×"
        }
    ];
    // Pick the highest tier crossed in this transition (handles edge cases like
    // restoring a saved streak that jumps multiple tiers in one step).
    let crossed = null;
    for (const t of tiers)if (prev < t.at && next >= t.at) crossed = t;
    if (!crossed) return null;
    return {
        id: `tier-${next}-${Date.now()}`,
        tierLabel: crossed.label,
        multiplier: crossed.mult,
        streakCount: next
    };
}
}),
"[project]/apps/web/src/components/TaskRow.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$subtasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/subtasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ThreadSubtaskRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ThreadSubtaskRow.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/dateUtils.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$categoryIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/categoryIcons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$BankBurstEffect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/BankBurstEffect.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CheckInBurstEffect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/CheckInBurstEffect.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TierUpBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/TierUpBanner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ThemeContext.tsx [app-ssr] (ecmascript)");
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
;
;
// iOS-style rubber-band damping: maps any |x| asymptotically to RUBBER_C.
// Small excess feels nearly linear; large excess approaches RUBBER_C.
const RUBBER_C = 60;
function rubberBand(x) {
    const abs = Math.abs(x);
    return Math.sign(x) * (abs * RUBBER_C) / (abs + RUBBER_C);
}
function TaskRowImpl({ task, activeFilter, advancing, pausing, slashingId, // recentlyFiledIds is still passed by all parent pages (page.tsx, archive,
// recurring) but is no longer consumed — the filed-badge-enter pop animation
// it drove was removed because it doubled up with the BankBurstEffect on
// submit. Underscored to silence the unused-var lint without touching the
// four call sites.
filingIds, recentlyFiledIds: _recentlyFiledIds, errorIds, selectedIds, submittedTaskIds, recurringPopup, penalizedTaskIds, onRestartOverdue, onAdvance, onCheckIn, onPause, onDelete, onToggleSelect, onOpenDetail, onArchive, onUnarchive, onSubtasksChange, onUndoCheckIn, onLog, isOpenInDetail }) {
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isAuthenticated = ("TURBOPACK compile-time value", "undefined") !== "undefined" && !!localStorage.getItem("auth_token");
    // Streak-chip pop animation. When task.currentStreakCount goes up (a
    // check-in just landed) we tag the streak chip span with a class that
    // plays a one-shot scale + glow keyframe. Replaces the louder
    // setSuccess toast that used to fire from useTaskActions whenever the
    // bonus multiplier kicked in. Only fires on *increments* — initial
    // mount and resets (streak broken) play nothing.
    const streakCountForPop = task.currentStreakCount ?? 0;
    const prevStreakRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(streakCountForPop);
    const [streakJustIncremented, setStreakJustIncremented] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const prev = prevStreakRef.current;
        prevStreakRef.current = streakCountForPop;
        if (streakCountForPop > prev) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStreakJustIncremented(true);
            const t = setTimeout(()=>setStreakJustIncremented(false), 800);
            return ()=>clearTimeout(t);
        }
    }, [
        streakCountForPop
    ]);
    async function handleToggleSubtask(s) {
        const list = task.subtasks ?? [];
        const next = list.map((x)=>x.subtaskId === s.subtaskId ? {
                ...x,
                completed: !x.completed
            } : x);
        onSubtasksChange?.(task.taskId, next);
        if (!isAuthenticated || s.subtaskId < 0) return;
        //TURBOPACK unreachable
        ;
        const error = undefined;
    }
    async function handleDeleteSubtask(s) {
        const list = task.subtasks ?? [];
        const next = list.filter((x)=>x.subtaskId !== s.subtaskId);
        onSubtasksChange?.(task.taskId, next);
        if (!isAuthenticated || s.subtaskId < 0) return;
        //TURBOPACK unreachable
        ;
        const error = undefined;
    }
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const isLightTheme = theme === "light";
    const isInProgress = task.status === "in_progress";
    const isCompleted = task.status === "completed";
    const isGreyedOut = activeFilter === "pending" && (task.isRecurring && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canCheckInNow"])(task.dueDate, task.recurrenceRule, task.lastCheckInDate) || task.status === "in_progress");
    const dot = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIORITY_DOT"][task.priority.toLowerCase()] ?? "var(--color-fg-muted)";
    const isAdvancing = advancing === task.taskId;
    const isFiling = filingIds.has(task.taskId);
    const canUndo = !isFiling && isCompleted && task.submitted === false && !task.pointsAwarded && !submittedTaskIds.has(task.taskId);
    const isSubmitted = isFiling || isCompleted && (task.submitted === true || submittedTaskIds.has(task.taskId) || !!task.pointsAwarded);
    const isSelectable = activeFilter === "completed" && isCompleted && !isSubmitted;
    const overdueRecurring = task.isRecurring && !isInProgress && !isCompleted && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOverdue"])(task.dueDate);
    // The latest cycle is the head of recentCycles (server returns desc by date+id).
    // We surface an inline Undo pill when it's today's "checkin" — and only when
    // the parent wired up onUndoCheckIn (so this stays opt-in for callers).
    const undoableCycle = (()=>{
        if (!task.isRecurring || !onUndoCheckIn) return null;
        const latest = task.recentCycles?.[0];
        if (!latest || latest.cycleType !== "checkin") return null;
        return latest.checkInDate.split("T")[0] === (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["todayLocalKey"])() ? latest : null;
    })();
    const wasCheckedInToday = !!undoableCycle;
    // Cycle closure is a broader signal than "checked in today": it also covers
    // weekly/biweekly/monthly tasks whose most recent check-in landed earlier
    // in the cycle. Use this for affordances that should disappear for the
    // remainder of the cycle (e.g. the Log button), not just for one day.
    const cycleClosed = task.isRecurring && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCycleClosed"])(task.dueDate, task.lastCheckInDate);
    const hasError = errorIds?.has(task.taskId) ?? false;
    const [revealed, setRevealed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const innerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const actionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const wrapper = wrapperRef.current;
        const actions = actionsRef.current;
        if (!wrapper || !actions) return;
        const sync = ()=>{
            wrapper.style.setProperty("--actions-width", `${actions.offsetWidth}px`);
        };
        sync();
        const ro = new ResizeObserver(sync);
        ro.observe(actions);
        return ()=>ro.disconnect();
    }, []);
    // Native non-passive touchmove listener: once the drag commits to horizontal,
    // preventDefault tells the browser "JS owns this gesture" so it won't fire
    // touchcancel and switch to vertical scroll mid-swipe.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const onTouchMoveNative = (e)=>{
            const drag = dragRef.current;
            if (drag && drag.axis === "horizontal") {
                e.preventDefault();
            }
        };
        wrapper.addEventListener("touchmove", onTouchMoveNative, {
            passive: false
        });
        return ()=>wrapper.removeEventListener("touchmove", onTouchMoveNative);
    }, []);
    function handleTouchStart(e) {
        if (e.touches.length > 1) {
            dragRef.current = null;
            return;
        }
        const t = e.touches[0];
        const panelWidth = actionsRef.current?.offsetWidth ?? 0;
        dragRef.current = {
            startX: t.clientX,
            startY: t.clientY,
            startOffset: revealed ? -panelWidth : 0,
            panelWidth,
            axis: "none",
            lastX: t.clientX,
            lastT: performance.now(),
            velocity: 0,
            revealedDispatched: revealed
        };
    }
    function handleTouchMove(e) {
        const drag = dragRef.current;
        if (!drag || e.touches.length > 1) return;
        const t = e.touches[0];
        const dx = t.clientX - drag.startX;
        const dy = t.clientY - drag.startY;
        if (drag.axis === "none") {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                // Right-swipe on a closed row passes through to MobileEdgeDrawer's
                // document handler (open the nav). Only left-swipes — and right-swipes
                // that close an already-revealed row — own the gesture.
                if (dx > 0 && !revealed) {
                    drag.axis = "vertical";
                    dragRef.current = null;
                    return;
                }
                drag.axis = "horizontal";
            } else {
                drag.axis = "vertical";
                dragRef.current = null;
                return;
            }
        }
        if (drag.axis !== "horizontal" || drag.panelWidth === 0) return;
        const now = performance.now();
        const dt = Math.max(1, now - drag.lastT);
        drag.velocity = (t.clientX - drag.lastX) / dt;
        drag.lastX = t.clientX;
        drag.lastT = now;
        const raw = drag.startOffset + dx;
        let offset;
        if (raw < -drag.panelWidth) {
            const excess = raw + drag.panelWidth; // negative
            offset = -drag.panelWidth + rubberBand(excess);
        } else if (raw > 0) {
            // Swiping right past the closed position should stop at closed, not
            // rubber-band past it.
            offset = 0;
        } else {
            offset = raw;
        }
        const inner = innerRef.current;
        if (inner) {
            inner.style.transition = "none";
            inner.style.transform = `translateX(${offset}px)`;
        }
        const wrapper = wrapperRef.current;
        if (wrapper) {
            wrapper.setAttribute("data-dragging", "true");
            const parent = wrapper.parentElement;
            if (parent) {
                parent.style.setProperty("--button-scale", String(-offset / drag.panelWidth));
            }
        }
        if (!drag.revealedDispatched && offset < 0) {
            drag.revealedDispatched = true;
            setRevealed(true);
            window.dispatchEvent(new CustomEvent("task-row-reveal", {
                detail: {
                    id: task.taskId
                }
            }));
        }
    }
    function settleDrag() {
        const drag = dragRef.current;
        dragRef.current = null;
        const inner = innerRef.current;
        const wrapper = wrapperRef.current;
        if (wrapper) {
            wrapper.removeAttribute("data-dragging");
            const parent = wrapper.parentElement;
            if (parent) {
                parent.style.removeProperty("--button-scale");
            }
        }
        if (!drag || drag.axis !== "horizontal" || !inner) {
            if (inner) {
                inner.style.transition = "";
                inner.style.transform = "";
            }
            return;
        }
        const match = inner.style.transform.match(/translateX\((-?[\d.]+)px\)/);
        const offset = match ? parseFloat(match[1]) : drag.startOffset;
        const FLICK = 0.4;
        let willOpen;
        if (drag.velocity < -FLICK) willOpen = true;
        else if (drag.velocity > FLICK) willOpen = false;
        else willOpen = Math.abs(offset) > drag.panelWidth / 2;
        inner.style.transition = "";
        inner.style.transform = "";
        setRevealed(willOpen);
        if (willOpen && !drag.revealedDispatched) {
            window.dispatchEvent(new CustomEvent("task-row-reveal", {
                detail: {
                    id: task.taskId
                }
            }));
        }
    }
    function handleTouchEnd() {
        settleDrag();
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function onOtherReveal(e) {
            const detail = e.detail;
            if (detail && detail.id !== task.taskId) setRevealed(false);
        }
        function onScroll() {
            setRevealed(false);
        }
        function onOutsidePointer(e) {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;
            if (!wrapper.contains(e.target)) setRevealed(false);
        }
        window.addEventListener("task-row-reveal", onOtherReveal);
        window.addEventListener("scroll", onScroll, {
            passive: true,
            capture: true
        });
        window.addEventListener("pointerdown", onOutsidePointer, true);
        return ()=>{
            window.removeEventListener("task-row-reveal", onOtherReveal);
            window.removeEventListener("scroll", onScroll, {
                capture: true
            });
            window.removeEventListener("pointerdown", onOutsidePointer, true);
        };
    }, [
        task.taskId
    ]);
    function handleRowClick() {
        if (revealed) {
            setRevealed(false);
            return;
        }
        onOpenDetail(task);
    }
    const eligibleCheckIn = task.isRecurring && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canCheckInNow"])(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
    const overdueRegular = !task.isRecurring && task.status === "pending" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOverdue"])(task.dueDate);
    const stop = (e)=>e.stopPropagation();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: wrapperRef,
                className: `task-row-wrapper${slashingId === task.taskId ? " task-row-deleting" : ""}${isOpenInDetail ? " task-row-active" : ""}`,
                style: {
                    position: "relative",
                    height: "60px",
                    touchAction: "pan-y",
                    overflow: "visible"
                },
                "data-revealed": revealed ? "true" : undefined,
                onTouchStart: handleTouchStart,
                onTouchMove: handleTouchMove,
                onTouchEnd: handleTouchEnd,
                onTouchCancel: handleTouchEnd,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: actionsRef,
                        className: "task-actions",
                        onClick: (e)=>{
                            e.stopPropagation();
                            // After any action button inside the revealed panel fires, close the
                            // panel — the button's own onClick already ran by the time this bubble
                            // handler fires, so the action goes through and the row settles back.
                            if (e.target.closest("button")) {
                                setRevealed(false);
                            }
                        },
                        style: {
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 0,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "4px",
                            padding: "0 6px",
                            overflow: "hidden"
                        },
                        children: [
                            task.status === "pending" && task.isRecurring && !isInProgress && (()=>{
                                // Counter tasks: replace the Check-in swipe action with Log. Counter
                                // tasks check in via the modal's slider; the swipe action is for
                                // quick log entries throughout the day. Once the cycle is closed
                                // (any cadence — daily/weekly/biweekly/monthly), hide Log so the
                                // user can't append to a finalised cycle.
                                if (task.hasCounter && onLog && !cycleClosed) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onLog(task),
                                        title: "Log entry",
                                        style: {
                                            width: "44px",
                                            height: "44px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            background: "var(--color-surface-deep)",
                                            border: "none"
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.background = "var(--color-active-highlight-bg)",
                                        onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "11",
                                            height: "11",
                                            viewBox: "0 0 10 10",
                                            fill: "none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "5",
                                                    y1: "1.5",
                                                    x2: "5",
                                                    y2: "8.5",
                                                    style: {
                                                        stroke: "var(--color-active-highlight)"
                                                    },
                                                    strokeWidth: "1.5",
                                                    strokeLinecap: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 401,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "1.5",
                                                    y1: "5",
                                                    x2: "8.5",
                                                    y2: "5",
                                                    style: {
                                                        stroke: "var(--color-active-highlight)"
                                                    },
                                                    strokeWidth: "1.5",
                                                    strokeLinecap: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 400,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 393,
                                        columnNumber: 15
                                    }, this);
                                }
                                const eligible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canCheckInNow"])(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: eligible ? ()=>onCheckIn(task) : undefined,
                                    disabled: isAdvancing || !eligible,
                                    title: eligible ? "Check In" : "Not yet available",
                                    style: {
                                        width: "44px",
                                        height: "44px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: eligible ? "pointer" : "not-allowed",
                                        background: "var(--color-surface-deep)",
                                        border: "none",
                                        opacity: isAdvancing || !eligible ? 0.3 : 1
                                    },
                                    onMouseEnter: (e)=>{
                                        if (eligible) e.currentTarget.style.background = "var(--color-active-highlight-alt-bg)";
                                    },
                                    onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                    children: eligible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "11",
                                        height: "11",
                                        viewBox: "0 0 10 10",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                            points: "1,5 4,8 9,2",
                                            style: {
                                                stroke: "var(--color-active-highlight-alt)"
                                            },
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 419,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 418,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "11",
                                        height: "11",
                                        viewBox: "0 0 10 10",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "2.5",
                                                y: "4.5",
                                                width: "5",
                                                height: "4",
                                                rx: "0.5",
                                                style: {
                                                    stroke: "var(--color-active-highlight-alt)"
                                                },
                                                strokeWidth: "1.2",
                                                fill: "none"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 423,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5",
                                                style: {
                                                    stroke: "var(--color-active-highlight-alt)"
                                                },
                                                strokeWidth: "1.2",
                                                strokeLinecap: "round",
                                                fill: "none"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 424,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 422,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 409,
                                    columnNumber: 13
                                }, this);
                            })(),
                            task.status === "pending" && !task.isRecurring && !isGreyedOut && (()=>{
                                const overdueRegular = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOverdue"])(task.dueDate);
                                const startColor = overdueRegular ? "var(--color-danger)" : "var(--color-active-highlight)";
                                const hoverBg = overdueRegular ? "rgba(239,68,68,0.15)" : "var(--color-active-highlight-bg)";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>overdueRegular && onRestartOverdue ? onRestartOverdue(task) : onAdvance(task),
                                    disabled: isAdvancing,
                                    title: overdueRegular ? "Overdue — reschedule to start" : "Start",
                                    style: {
                                        width: "44px",
                                        height: "44px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        background: "var(--color-surface-deep)",
                                        border: "none",
                                        opacity: isAdvancing ? 0.4 : 1
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.background = hoverBg,
                                    onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "11",
                                        height: "11",
                                        viewBox: "0 0 10 10",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                            points: "2,1 9,5 2,9",
                                            style: {
                                                fill: startColor
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 445,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 444,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 436,
                                    columnNumber: 13
                                }, this);
                            })(),
                            isInProgress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onPause(task),
                                disabled: pausing === task.taskId,
                                title: "Pause",
                                style: {
                                    width: "44px",
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "var(--color-surface-deep)",
                                    border: "none",
                                    opacity: pausing === task.taskId ? 0.4 : 1
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = "rgba(245,158,11,0.15)",
                                onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "11",
                                    height: "11",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "1.5",
                                            y: "1",
                                            width: "3",
                                            height: "8",
                                            style: {
                                                fill: "var(--color-warning)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 461,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "5.5",
                                            y: "1",
                                            width: "3",
                                            height: "8",
                                            style: {
                                                fill: "var(--color-warning)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 462,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 460,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 452,
                                columnNumber: 11
                            }, this),
                            isInProgress && !isGreyedOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onAdvance(task),
                                disabled: isAdvancing,
                                title: "Complete",
                                style: {
                                    width: "44px",
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "var(--color-surface-deep)",
                                    border: "none",
                                    opacity: isAdvancing ? 0.4 : 1
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = "rgba(74,222,128,0.15)",
                                onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "11",
                                    height: "11",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "1,5 4,8 9,2",
                                        style: {
                                            stroke: "var(--color-success)"
                                        },
                                        strokeWidth: "1.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 477,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 468,
                                columnNumber: 11
                            }, this),
                            canUndo && !isGreyedOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onAdvance(task),
                                disabled: isAdvancing,
                                title: "Undo",
                                style: {
                                    width: "44px",
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "var(--color-surface-deep)",
                                    border: "none",
                                    opacity: isAdvancing ? 0.4 : 1
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = "rgba(245,158,11,0.15)",
                                onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "11",
                                    height: "11",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4",
                                            style: {
                                                stroke: "var(--color-warning)"
                                            },
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 492,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                            points: "4,4.5 1.5,2 4,0",
                                            style: {
                                                stroke: "var(--color-warning)"
                                            },
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 493,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 491,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this),
                            onArchive && isCompleted && !task.isArchived && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onArchive(task),
                                title: "Archive",
                                style: {
                                    width: "44px",
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "var(--color-surface-deep)",
                                    border: "none"
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = "rgba(91,184,224,0.15)",
                                onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "12",
                                    height: "12",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "1",
                                            y: "1.5",
                                            width: "8",
                                            height: "2",
                                            style: {
                                                stroke: "var(--color-accent)"
                                            },
                                            strokeWidth: "1",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 507,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M2 3.5V8.5H8V3.5",
                                            style: {
                                                stroke: "var(--color-accent)"
                                            },
                                            strokeWidth: "1",
                                            fill: "none",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 508,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "4",
                                            y1: "5.5",
                                            x2: "6",
                                            y2: "5.5",
                                            style: {
                                                stroke: "var(--color-accent)"
                                            },
                                            strokeWidth: "1",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 509,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 506,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 499,
                                columnNumber: 11
                            }, this),
                            onUnarchive && task.isArchived && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onUnarchive(task),
                                title: "Unarchive",
                                style: {
                                    width: "44px",
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "var(--color-surface-deep)",
                                    border: "none"
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = "rgba(91,184,224,0.15)",
                                onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "12",
                                    height: "12",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "1",
                                            y: "6.5",
                                            width: "8",
                                            height: "2",
                                            style: {
                                                stroke: "var(--color-accent)"
                                            },
                                            strokeWidth: "1",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 523,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M2 6.5V1.5H8V6.5",
                                            style: {
                                                stroke: "var(--color-accent)"
                                            },
                                            strokeWidth: "1",
                                            fill: "none",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 524,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                            points: "3.5,4 5,2.5 6.5,4",
                                            style: {
                                                stroke: "var(--color-accent)"
                                            },
                                            strokeWidth: "1",
                                            fill: "none",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 525,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 522,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 515,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onDelete(task.taskId),
                                disabled: slashingId === task.taskId,
                                title: "Delete",
                                style: {
                                    width: "44px",
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "var(--color-surface-deep)",
                                    border: "none",
                                    opacity: slashingId === task.taskId ? 0.4 : 1
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = "rgba(239,68,68,0.15)",
                                onMouseLeave: (e)=>e.currentTarget.style.background = "var(--color-surface-deep)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "12",
                                    height: "12",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M3.8 2V1.3h2.4V2",
                                            style: {
                                                stroke: "var(--color-danger)"
                                            },
                                            strokeWidth: "0.9",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 539,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "1.3",
                                            y1: "2.5",
                                            x2: "8.7",
                                            y2: "2.5",
                                            style: {
                                                stroke: "var(--color-danger)"
                                            },
                                            strokeWidth: "1",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 540,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M2.6 3L3.1 8.5h3.8L7.4 3",
                                            style: {
                                                stroke: "var(--color-danger)"
                                            },
                                            strokeWidth: "0.9",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 541,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "4.2",
                                            y1: "4.5",
                                            x2: "4.2",
                                            y2: "7.5",
                                            style: {
                                                stroke: "var(--color-danger)"
                                            },
                                            strokeWidth: "0.7",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 542,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "5.8",
                                            y1: "4.5",
                                            x2: "5.8",
                                            y2: "7.5",
                                            style: {
                                                stroke: "var(--color-danger)"
                                            },
                                            strokeWidth: "0.7",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 543,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 538,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 530,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 364,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: innerRef,
                        className: [
                            "task-row-inner grid items-center pl-3 sm:pl-4 pr-0",
                            isGreyedOut || wasCheckedInToday ? "greyed" : ""
                        ].filter(Boolean).join(" "),
                        onClick: handleRowClick,
                        style: {
                            position: "absolute",
                            inset: 0,
                            gridTemplateColumns: "1fr 64px 60px",
                            borderLeft: isInProgress ? "2px solid var(--color-active-highlight)" : canUndo ? "2px solid rgba(245,158,11,0.7)" : wasCheckedInToday ? "2px solid var(--color-active-highlight-alt)" : overdueRecurring ? "2px solid rgba(239,68,68,0.55)" : undefined,
                            background: isCompleted && !canUndo ? "var(--color-bg)" : undefined,
                            cursor: "pointer"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 min-w-0",
                                children: [
                                    isSelectable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onToggleSelect(task.taskId);
                                        },
                                        className: "w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-150",
                                        style: {
                                            border: `1px solid ${selectedIds.has(task.taskId) ? "var(--color-success)" : "var(--color-border-faint)"}`,
                                            borderRadius: "2px",
                                            background: selectedIds.has(task.taskId) ? "rgba(74,222,128,0.12)" : "transparent"
                                        },
                                        children: selectedIds.has(task.taskId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "8",
                                            height: "6",
                                            viewBox: "0 0 8 6",
                                            fill: "none",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "1,3 3,5 7,1",
                                                style: {
                                                    stroke: "var(--color-success)"
                                                },
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 585,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 584,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 574,
                                        columnNumber: 13
                                    }, this) : task.subtasks && task.subtasks.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setExpanded((v)=>!v);
                                        },
                                        title: expanded ? "Hide subtasks" : "Show subtasks",
                                        "aria-label": expanded ? "Hide subtasks" : "Show subtasks",
                                        "aria-expanded": expanded,
                                        className: "flex-shrink-0",
                                        style: {
                                            marginLeft: -3,
                                            marginRight: -3,
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 2
                                        },
                                        children: [
                                            task.isRecurring ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: 22,
                                                    height: 22,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][task.category] ?? "var(--color-fg-muted)"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$categoryIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CategoryIcon"], {
                                                    category: task.category,
                                                    size: 22
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 617,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 608,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: 14,
                                                    height: 14,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: "50%",
                                                        background: dot
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 628,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 620,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: "inline-flex",
                                                    transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                                                    transformOrigin: "50% 50%",
                                                    transition: "transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                                    color: dot
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "5",
                                                    height: "7",
                                                    viewBox: "0 0 5 7",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                        points: "1,1 3.5,3.5 1,6",
                                                        stroke: "currentColor",
                                                        strokeWidth: "1.2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        fill: "none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                        lineNumber: 641,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 640,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 631,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 590,
                                        columnNumber: 13
                                    }, this) : task.isRecurring ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex-shrink-0 flex items-center justify-center",
                                        style: {
                                            width: 22,
                                            height: 22,
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][task.category] ?? "var(--color-fg-muted)"
                                        },
                                        "aria-hidden": true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$categoryIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CategoryIcon"], {
                                            category: task.category,
                                            size: 22
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 655,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 646,
                                        columnNumber: 13
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                        style: {
                                            background: dot
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 658,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm truncate flex items-center gap-1.5",
                                                style: {
                                                    color: isCompleted && !canUndo || isGreyedOut ? "var(--color-fg-muted)" : "var(--color-fg)",
                                                    textDecoration: isCompleted ? "line-through" : "none"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    title: task.title,
                                                    children: task.title.length > 18 ? `${task.title.slice(0, 17)}…` : task.title
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 668,
                                                    columnNumber: 15
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 661,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5 mt-0.5",
                                                style: {
                                                    overflow: "hidden"
                                                },
                                                children: [
                                                    task.category && (()=>{
                                                        const cc = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][task.category] ?? "var(--color-fg-muted)";
                                                        const tagColor = isLightTheme ? `color-mix(in oklab, ${cc}, black 60%)` : cc;
                                                        const tagBg = isLightTheme ? `color-mix(in srgb, ${cc} 45%, white)` : `${cc}18`;
                                                        const tagBorder = isLightTheme ? `color-mix(in srgb, ${cc} 70%, white)` : `${cc}40`;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "8px",
                                                                letterSpacing: "0.14em",
                                                                textTransform: "uppercase",
                                                                color: tagColor,
                                                                background: tagBg,
                                                                border: `1px solid ${tagBorder}`,
                                                                borderRadius: "2px",
                                                                padding: "1px 5px",
                                                                whiteSpace: "nowrap",
                                                                flexShrink: 0,
                                                                fontWeight: isLightTheme ? 600 : 400
                                                            },
                                                            children: task.category
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                            lineNumber: 679,
                                                            columnNumber: 19
                                                        }, this);
                                                    })(),
                                                    task.isRecurring && task.hasCounter && (()=>{
                                                        const cycles = task.recentCycles ?? [];
                                                        if (cycles.length === 0) return null;
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);
                                                        const days = [];
                                                        for(let i = 6; i >= 0; i--){
                                                            const d = new Date(today);
                                                            d.setDate(today.getDate() - i);
                                                            days.push({
                                                                key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
                                                                total: 0
                                                            });
                                                        }
                                                        for (const c of cycles){
                                                            if (typeof c.counterValue !== "number") continue;
                                                            const day = days.find((d)=>d.key === c.checkInDate.split("T")[0]);
                                                            if (day) day.total += c.counterValue;
                                                        }
                                                        if (!days.some((d)=>d.total > 0)) return null;
                                                        const goal = task.counterGoal ?? null;
                                                        const max = Math.max(1, goal ?? 0, ...days.map((d)=>d.total));
                                                        const unit = task.counterUnit ? ` ${task.counterUnit}` : "";
                                                        const tooltip = goal != null ? `Last 7 days (goal ${goal}${unit}): ${days.map((d)=>`${d.total}${unit}${d.total >= goal ? " ✓" : ""}`).join(" · ")}` : `Last 7 days: ${days.map((d)=>`${d.total}${unit}`).join(" · ")}`;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "row-counter-spark",
                                                            title: tooltip,
                                                            "aria-hidden": true,
                                                            style: {
                                                                gap: 1.5,
                                                                height: 11,
                                                                flexShrink: 0,
                                                                position: "relative"
                                                            },
                                                            children: [
                                                                days.map((d, i)=>{
                                                                    const isLast = i === days.length - 1;
                                                                    const hitGoal = goal != null && d.total >= goal;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            width: 3,
                                                                            height: `${Math.max(1.5, d.total / max * 11)}px`,
                                                                            background: hitGoal ? "var(--color-success)" : isLast ? "var(--color-active-highlight-alt)" : "var(--color-fg-subtle)",
                                                                            opacity: d.total > 0 ? hitGoal || isLast ? 1 : 0.7 : 0.25,
                                                                            borderRadius: 1
                                                                        }
                                                                    }, d.key, false, {
                                                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                        lineNumber: 724,
                                                                        columnNumber: 25
                                                                    }, this);
                                                                }),
                                                                goal != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        right: 0,
                                                                        bottom: `${Math.min(11, goal / max * 11)}px`,
                                                                        height: 1,
                                                                        background: "var(--color-success)",
                                                                        opacity: 0.4,
                                                                        pointerEvents: "none"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                    lineNumber: 739,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                            lineNumber: 719,
                                                            columnNumber: 19
                                                        }, this);
                                                    })(),
                                                    task.subtasks && task.subtasks.length > 0 && (()=>{
                                                        const done = task.subtasks.filter((s)=>s.completed).length;
                                                        const total = task.subtasks.length;
                                                        if (done === 0) return null;
                                                        const allDone = done === total;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            title: `${done} of ${total} subtasks done`,
                                                            style: {
                                                                color: allDone ? "var(--color-success)" : "var(--color-fg-subtle)",
                                                                fontSize: "8px",
                                                                letterSpacing: "0.1em",
                                                                flexShrink: 0,
                                                                fontVariantNumeric: "tabular-nums",
                                                                fontWeight: allDone ? 600 : 400,
                                                                whiteSpace: "nowrap"
                                                            },
                                                            children: [
                                                                done,
                                                                "/",
                                                                total
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                            lineNumber: 761,
                                                            columnNumber: 19
                                                        }, this);
                                                    })(),
                                                    canUndo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "8",
                                                        height: "8",
                                                        viewBox: "0 0 10 10",
                                                        fill: "none",
                                                        style: {
                                                            flexShrink: 0
                                                        },
                                                        role: "img",
                                                        "aria-label": "Undo",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                                                                children: "Undo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                lineNumber: 787,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M7 1.5H4C2.3 1.5 1 2.8 1 4.5s1.3 3 3 3h4",
                                                                style: {
                                                                    stroke: "var(--color-warning)"
                                                                },
                                                                strokeWidth: "1.4",
                                                                strokeLinecap: "round"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                lineNumber: 788,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                points: "3.5,4 1,1.5 3.5,0",
                                                                style: {
                                                                    stroke: "var(--color-warning)"
                                                                },
                                                                strokeWidth: "1.4",
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                fill: "none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                lineNumber: 789,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                        lineNumber: 778,
                                                        columnNumber: 17
                                                    }, this),
                                                    task.isRecurring && task.recurrenceRule && !isInProgress && !canUndo && (()=>{
                                                        // Overdue state is now signalled by the red date column —
                                                        // skip the recurring badge entirely so the row stays uncluttered.
                                                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOverdue"])(task.dueDate)) return null;
                                                        const isLocked = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canCheckInNow"])(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
                                                        const unlockInfo = isLocked ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUnlockInfo"])(task.dueDate) : null;
                                                        const ruleLabel = task.recurrenceRule === "daily" ? "Daily" : task.recurrenceRule === "weekdays" ? "Weekdays" : task.recurrenceRule === "biweekly" ? "Biweekly" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextOccurrenceLabel"])(task.dueDate, task.recurrenceRule);
                                                        const streakCount = task.currentStreakCount ?? 0;
                                                        const unlockText = unlockInfo ? task.recurrenceRule === "biweekly" || task.recurrenceRule === "monthly" ? unlockInfo.date : unlockInfo.days === 1 ? "tomorrow" : `in ${unlockInfo.days} days` : null;
                                                        const tooltip = unlockText ? `${ruleLabel} · unlocks ${unlockText}` : ruleLabel;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                isLocked && unlockInfo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    title: tooltip,
                                                                    "aria-label": tooltip,
                                                                    style: {
                                                                        display: "inline-flex",
                                                                        flexShrink: 0,
                                                                        lineHeight: 0
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        width: "7",
                                                                        height: "8",
                                                                        viewBox: "0 0 10 12",
                                                                        fill: "none",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                                x: "2",
                                                                                y: "5",
                                                                                width: "6",
                                                                                height: "6",
                                                                                rx: "0.8",
                                                                                stroke: "rgba(245,158,11,0.55)",
                                                                                strokeWidth: "1.2",
                                                                                fill: "none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                                lineNumber: 814,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M3.5 5V3.5a1.5 1.5 0 0 1 3 0V5",
                                                                                stroke: "rgba(245,158,11,0.55)",
                                                                                strokeWidth: "1.2",
                                                                                strokeLinecap: "round",
                                                                                fill: "none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                                lineNumber: 815,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                        lineNumber: 813,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                    lineNumber: 812,
                                                                    columnNumber: 23
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: "var(--color-active-highlight-alt)",
                                                                        fontSize: "10px",
                                                                        lineHeight: 1,
                                                                        flexShrink: 0
                                                                    },
                                                                    title: tooltip,
                                                                    children: "↻"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                    lineNumber: 819,
                                                                    columnNumber: 23
                                                                }, this),
                                                                (()=>{
                                                                    const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TierUpBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentStreakTier"])(streakCount);
                                                                    if (!tier) return null;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: streakJustIncremented ? "streak-chip-pop" : undefined,
                                                                        style: {
                                                                            color: "var(--color-active-highlight-alt)",
                                                                            fontSize: "8px",
                                                                            letterSpacing: "0.18em",
                                                                            textTransform: "uppercase",
                                                                            opacity: 0.85,
                                                                            flexShrink: 0,
                                                                            fontVariantNumeric: "tabular-nums",
                                                                            display: "inline-block",
                                                                            transformOrigin: "center"
                                                                        },
                                                                        children: [
                                                                            tier.label,
                                                                            " · ",
                                                                            streakCount
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                                        lineNumber: 830,
                                                                        columnNumber: 25
                                                                    }, this);
                                                                })()
                                                            ]
                                                        }, void 0, true);
                                                    })()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 672,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 660,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 572,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-1",
                                children: wasCheckedInToday ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        if (undoableCycle) onUndoCheckIn?.(task, undoableCycle.cycleId);
                                    },
                                    title: "Undo check-in",
                                    "aria-label": "Undo check-in",
                                    className: "inline-flex items-center justify-center cursor-pointer",
                                    style: {
                                        // Icon-only pill — tighter padding so the round shape stays
                                        // visually balanced without the "UNDO" label that used to
                                        // sit beside the glyph.
                                        color: "var(--color-active-highlight-alt)",
                                        background: "var(--color-active-highlight-alt-bg)",
                                        border: "1px solid var(--color-active-highlight-alt-border, var(--color-border-hairline))",
                                        borderRadius: 999,
                                        padding: 4,
                                        lineHeight: 0
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "12",
                                        height: "12",
                                        viewBox: "0 0 10 10",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "4,2 2,4 4,6",
                                                stroke: "currentColor",
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                fill: "none"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 868,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M2 4H6.5A2.5 2.5 0 0 1 6.5 9H4",
                                                stroke: "currentColor",
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                fill: "none"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 869,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 867,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 847,
                                    columnNumber: 13
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        (overdueRegular || overdueRecurring) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": true,
                                            style: {
                                                color: "var(--color-danger)",
                                                fontSize: "11px",
                                                lineHeight: 1,
                                                fontWeight: 700
                                            },
                                            children: "⚠"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 875,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[12px]",
                                            style: {
                                                color: overdueRegular || overdueRecurring ? "var(--color-danger)" : "var(--color-fg-muted)",
                                                fontWeight: overdueRegular || overdueRecurring ? 600 : 400
                                            },
                                            children: task.dueDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseLocalDate"])(task.dueDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric"
                                            }) : "—"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 877,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 873,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 845,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    alignItems: "center",
                                    columnGap: 4
                                },
                                children: isSubmitted ? // filed-badge-enter (a scale+opacity pop-in on the submitted-state
                                // coin-stack badge) used to fire ~900ms after the click, right as
                                // the row greys out — which read as the submit animation playing
                                // a second time on top of the BankBurstEffect underline that's
                                // still mid-fade. BankBurstEffect now owns the submit-feedback
                                // motion entirely; the badge just renders in place when the row
                                // transitions to submitted.
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-0.5",
                                    style: {
                                        gridColumn: "1 / -1",
                                        justifySelf: "center",
                                        padding: "1px 4px"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "15",
                                        height: "12",
                                        viewBox: "0 0 12 10",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                                cx: "6",
                                                cy: "0.55",
                                                rx: "2",
                                                ry: "0.55",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 911,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 4,0.55 A 2,0.55 0 0 0 8,0.55",
                                                stroke: "var(--color-warning)",
                                                strokeWidth: "0.25",
                                                fill: "none",
                                                opacity: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 912,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "1.1",
                                                width: "4",
                                                height: "0.9",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 914,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "2",
                                                width: "4",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 915,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "3",
                                                width: "4",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 916,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "4",
                                                width: "4",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 917,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "5",
                                                width: "4",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 918,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "6",
                                                width: "4",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 919,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "4",
                                                y: "7",
                                                width: "4",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 920,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                                cx: "10.5",
                                                cy: "4.55",
                                                rx: "1.5",
                                                ry: "0.5",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 923,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 9,4.55 A 1.5,0.5 0 0 0 12,4.55",
                                                stroke: "var(--color-warning)",
                                                strokeWidth: "0.22",
                                                fill: "none",
                                                opacity: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 924,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "9",
                                                y: "5.1",
                                                width: "3",
                                                height: "0.9",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 926,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "9",
                                                y: "6",
                                                width: "3",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 927,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "9",
                                                y: "7",
                                                width: "3",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 928,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                                cx: "2.5",
                                                cy: "8.4",
                                                rx: "1.5",
                                                ry: "0.4",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 931,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "1",
                                                y: "8.5",
                                                width: "3",
                                                height: "0.5",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 932,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0.5",
                                                y: "9",
                                                width: "4",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 933,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                                cx: "9.5",
                                                cy: "8.4",
                                                rx: "2",
                                                ry: "0.45",
                                                fill: "var(--color-warning)",
                                                opacity: "0.95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 936,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "7.5",
                                                y: "8.5",
                                                width: "4",
                                                height: "0.5",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 937,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "7",
                                                y: "9",
                                                width: "5",
                                                height: "1",
                                                fill: "var(--color-warning)",
                                                opacity: "0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 938,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 910,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 901,
                                    columnNumber: 13
                                }, this) : canUndo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1 px-1.5 py-0.5",
                                    style: {
                                        gridColumn: "1 / -1",
                                        justifySelf: "center",
                                        border: "1px solid rgba(245,158,11,0.35)",
                                        borderRadius: "2px",
                                        background: "rgba(245,158,11,0.06)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "8",
                                            height: "10",
                                            viewBox: "0 0 10 12",
                                            fill: "none",
                                            shapeRendering: "crispEdges",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z",
                                                    style: {
                                                        fill: "var(--color-warning)"
                                                    },
                                                    opacity: "0.85"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 947,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "4",
                                                    y: "5",
                                                    width: "2",
                                                    height: "2",
                                                    style: {
                                                        fill: "var(--color-bg)"
                                                    },
                                                    opacity: "0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 948,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 946,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "rgba(245,158,11,0.9)",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                letterSpacing: "0.03em"
                                            },
                                            children: task.pointValue.toLocaleString()
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 950,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StreakBonusChip, {
                                            task: task
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 953,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 942,
                                    columnNumber: 13
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "flex-end"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "10",
                                                height: "12",
                                                viewBox: "0 0 10 12",
                                                fill: "none",
                                                shapeRendering: "crispEdges",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z",
                                                        style: {
                                                            fill: "var(--color-warning)"
                                                        },
                                                        opacity: "0.95"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                        lineNumber: 959,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        x: "4",
                                                        y: "5",
                                                        width: "2",
                                                        height: "2",
                                                        style: {
                                                            fill: "var(--color-bg)"
                                                        },
                                                        opacity: "0.4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                        lineNumber: 960,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 958,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 957,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                                minWidth: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-semibold",
                                                    style: {
                                                        color: "var(--color-warning)"
                                                    },
                                                    children: task.pointValue.toLocaleString()
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 964,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StreakBonusChip, {
                                                    task: task
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                    lineNumber: 967,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 963,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 892,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 548,
                        columnNumber: 7
                    }, this),
                    slashingId === task.taskId && // Danger underline — same motion vocabulary as the BankBurstEffect
                    // submit underline but tinted with the danger colour. Draws L→R
                    // across the row's bottom edge, then fades while drifting up. The
                    // previous pixel-slash overlay (20 red rects fading in/out in
                    // stepped frames) was replaced to match the submit feedback's
                    // cream feel.
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": true,
                        className: "row-delete-underline",
                        style: {
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            height: 1,
                            background: "var(--color-danger)",
                            boxShadow: "0 0 3px rgba(239, 68, 68, 0.28)",
                            pointerEvents: "none",
                            zIndex: 25
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 981,
                        columnNumber: 9
                    }, this),
                    hasError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            inset: 0,
                            zIndex: 25,
                            pointerEvents: "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 100 60",
                            preserveAspectRatio: "none",
                            style: {
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                filter: "drop-shadow(0 0 4px rgba(239,68,68,0.85)) drop-shadow(0 0 10px rgba(239,68,68,0.45))"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "0.75",
                                y: "0.75",
                                width: "98.5",
                                height: "58.5",
                                fill: "none",
                                style: {
                                    stroke: "var(--color-danger)"
                                },
                                strokeWidth: "1.25",
                                className: "error-outline"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1000,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                            lineNumber: 999,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 998,
                        columnNumber: 9
                    }, this),
                    recurringPopup !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "recurring-pts-popup",
                        style: {
                            position: "absolute",
                            right: "60px",
                            top: "4px",
                            zIndex: 30,
                            color: "var(--color-active-highlight-alt)",
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textShadow: "0 0 8px var(--color-active-highlight-alt-bg)"
                        },
                        children: [
                            "+",
                            recurringPopup,
                            " pts"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 1006,
                        columnNumber: 9
                    }, this),
                    recurringPopup !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            inset: 0,
                            zIndex: 26,
                            pointerEvents: "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            style: {
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                overflow: "visible"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: `checkin-grad-${task.taskId}`,
                                        x1: "0",
                                        y1: "0",
                                        x2: "1",
                                        y2: "0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "0%",
                                                style: {
                                                    stopColor: "var(--color-surface-deep)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 1023,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "50%",
                                                stopColor: "#4c1d95"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 1024,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "100%",
                                                style: {
                                                    stopColor: "var(--color-surface-deep)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                                lineNumber: 1025,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 1022,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1021,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "0",
                                    y: "0",
                                    width: "100%",
                                    height: "100%",
                                    fill: "none",
                                    stroke: `url(#checkin-grad-${task.taskId})`,
                                    strokeWidth: "1.25",
                                    strokeLinejoin: "round",
                                    pathLength: "1000",
                                    className: "checkin-outline"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1028,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                            lineNumber: 1020,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 1019,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CheckInBurstEffect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        active: recurringPopup !== undefined
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 1033,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row-toolbar",
                        onClick: stop,
                        children: [
                            task.status === "pending" && task.isRecurring && !isInProgress && (// Counter tasks: show Log on the desktop hover toolbar in place of
                            // Check-in (matches the swipe-left action on mobile). Hidden once
                            // the cycle is closed by a check-in, for any cadence.
                            task.hasCounter && onLog && !cycleClosed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onLog(task);
                                },
                                title: "Log entry",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "10",
                                    height: "10",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "5",
                                            y1: "1.5",
                                            x2: "5",
                                            y2: "8.5",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1047,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "1.5",
                                            y1: "5",
                                            x2: "8.5",
                                            y2: "5",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1048,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1046,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1042,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: eligibleCheckIn ? (e)=>{
                                    e.stopPropagation();
                                    onCheckIn(task);
                                } : undefined,
                                disabled: isAdvancing || !eligibleCheckIn,
                                title: eligibleCheckIn ? "Check In" : "Not yet available",
                                children: eligibleCheckIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "10",
                                    height: "10",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "1,5 4,8 9,2",
                                        stroke: "currentColor",
                                        strokeWidth: "1.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 1059,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1058,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "10",
                                    height: "10",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "2.5",
                                            y: "4.5",
                                            width: "5",
                                            height: "4",
                                            rx: "0.5",
                                            stroke: "currentColor",
                                            strokeWidth: "1.2",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1063,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5",
                                            stroke: "currentColor",
                                            strokeWidth: "1.2",
                                            strokeLinecap: "round",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1064,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1062,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1052,
                                columnNumber: 13
                            }, this)),
                            task.status === "pending" && !task.isRecurring && !isGreyedOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    overdueRegular && onRestartOverdue ? onRestartOverdue(task) : onAdvance(task);
                                },
                                disabled: isAdvancing,
                                title: overdueRegular ? "Overdue — reschedule to start" : "Start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "10",
                                    height: "10",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                        points: "2,1 9,5 2,9",
                                        fill: "currentColor"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 1077,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1076,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1071,
                                columnNumber: 11
                            }, this),
                            isInProgress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onPause(task);
                                },
                                disabled: pausing === task.taskId,
                                title: "Pause",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "10",
                                    height: "10",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "1.5",
                                            y: "1",
                                            width: "3",
                                            height: "8",
                                            fill: "currentColor"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1088,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "5.5",
                                            y: "1",
                                            width: "3",
                                            height: "8",
                                            fill: "currentColor"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1089,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1087,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1082,
                                columnNumber: 11
                            }, this),
                            isInProgress && !isGreyedOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onAdvance(task);
                                },
                                disabled: isAdvancing,
                                title: "Complete",
                                style: {
                                    color: "var(--color-success)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "10",
                                    height: "10",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                        points: "1,5 4,8 9,2",
                                        stroke: "currentColor",
                                        strokeWidth: "1.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                        lineNumber: 1101,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1100,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1094,
                                columnNumber: 11
                            }, this),
                            canUndo && !isGreyedOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onAdvance(task);
                                },
                                disabled: isAdvancing,
                                title: "Undo",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "10",
                                    height: "10",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1112,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                            points: "4,4.5 1.5,2 4,0",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1113,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1111,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1106,
                                columnNumber: 11
                            }, this),
                            onArchive && isCompleted && !task.isArchived && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onArchive(task);
                                },
                                title: "Archive",
                                style: {
                                    color: "var(--color-accent)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "11",
                                    height: "11",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "1",
                                            y: "1.5",
                                            width: "8",
                                            height: "2",
                                            stroke: "currentColor",
                                            strokeWidth: "1",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1124,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M2 3.5V8.5H8V3.5",
                                            stroke: "currentColor",
                                            strokeWidth: "1",
                                            fill: "none",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1125,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "4",
                                            y1: "5.5",
                                            x2: "6",
                                            y2: "5.5",
                                            stroke: "currentColor",
                                            strokeWidth: "1",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1126,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1123,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1118,
                                columnNumber: 11
                            }, this),
                            onUnarchive && task.isArchived && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onUnarchive(task);
                                },
                                title: "Unarchive",
                                style: {
                                    color: "var(--color-accent)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "11",
                                    height: "11",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "1",
                                            y: "6.5",
                                            width: "8",
                                            height: "2",
                                            stroke: "currentColor",
                                            strokeWidth: "1",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1137,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M2 6.5V1.5H8V6.5",
                                            stroke: "currentColor",
                                            strokeWidth: "1",
                                            fill: "none",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1138,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                            points: "3.5,4 5,2.5 6.5,4",
                                            stroke: "currentColor",
                                            strokeWidth: "1",
                                            fill: "none",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1139,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1136,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onDelete(task.taskId);
                                },
                                disabled: slashingId === task.taskId,
                                title: "Delete",
                                style: {
                                    color: "var(--color-danger)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "11",
                                    height: "11",
                                    viewBox: "0 0 10 10",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M3.8 2V1.3h2.4V2",
                                            stroke: "currentColor",
                                            strokeWidth: "0.9",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1150,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "1.3",
                                            y1: "2.5",
                                            x2: "8.7",
                                            y2: "2.5",
                                            stroke: "currentColor",
                                            strokeWidth: "1",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1151,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M2.6 3L3.1 8.5h3.8L7.4 3",
                                            stroke: "currentColor",
                                            strokeWidth: "0.9",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1152,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "4.2",
                                            y1: "4.5",
                                            x2: "4.2",
                                            y2: "7.5",
                                            stroke: "currentColor",
                                            strokeWidth: "0.7",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1153,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "5.8",
                                            y1: "4.5",
                                            x2: "5.8",
                                            y2: "7.5",
                                            stroke: "currentColor",
                                            strokeWidth: "0.7",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                            lineNumber: 1154,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                    lineNumber: 1149,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                                lineNumber: 1143,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 1036,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$BankBurstEffect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        active: isFiling,
                        amount: task.pointValue
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 1159,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                lineNumber: 354,
                columnNumber: 5
            }, this),
            expanded && task.subtasks && task.subtasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "subtask-thread px-3 sm:px-4",
                onClick: (e)=>{
                    e.stopPropagation();
                    setExpanded(false);
                },
                title: "Click to collapse",
                style: {
                    background: "var(--color-bg)",
                    borderLeft: isInProgress ? "2px solid var(--color-active-highlight)" : canUndo ? "2px solid rgba(245,158,11,0.7)" : overdueRecurring ? "2px solid rgba(239,68,68,0.55)" : undefined,
                    paddingTop: 6,
                    paddingBottom: 14,
                    animation: "subtask-thread-in 0.18s cubic-bezier(0.2, 0, 0, 1)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4
                },
                children: task.subtasks.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ThreadSubtaskRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        subtask: s,
                        isFirst: i === 0,
                        isLast: i === task.subtasks.length - 1,
                        onToggle: ()=>handleToggleSubtask(s),
                        onDelete: ()=>handleDeleteSubtask(s)
                    }, s.subtaskId, false, {
                        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                        lineNumber: 1186,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskRow.tsx",
                lineNumber: 1163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function StreakBonusChip({ task }) {
    if (!task.isRecurring) return null;
    const c = task.currentStreakCount ?? 0;
    if (c < 3) return null;
    const multiplier = c >= 30 ? 2.0 : c >= 14 ? 1.8 : c >= 7 ? 1.5 : 1.2;
    const bonus = Math.round(task.pointValue * multiplier) - task.pointValue;
    if (bonus <= 0) return null;
    const fmt = Number.isInteger(multiplier) ? multiplier.toFixed(0) : multiplier.toFixed(1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        title: `Streak bonus: ${task.pointValue} × ${fmt}x = +${bonus} pts`,
        style: {
            color: "var(--color-active-highlight-alt)",
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.02em",
            lineHeight: 1,
            marginLeft: "1px",
            alignSelf: "flex-start",
            marginTop: "1px"
        },
        children: [
            "+",
            bonus
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/TaskRow.tsx",
        lineNumber: 1210,
        columnNumber: 5
    }, this);
}
const TaskRow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(TaskRowImpl);
const __TURBOPACK__default__export__ = TaskRow;
}),
"[project]/apps/web/src/lib/mockTasks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_TASKS",
    ()=>MOCK_TASKS,
    "withMockCycles",
    ()=>withMockCycles
]);
// Walk back from today and generate plausible cycle history so demo tasks
// have a populated heatmap + counter history without a backend call.
// Honours the recurrence rule (skips Sat/Sun for "weekdays") and caps at 14
// cycles since the embedded slice is bounded that way in production.
function generateMockCycles(t) {
    if (!t.isRecurring) return [];
    if (t.recurrenceRule !== "daily" && t.recurrenceRule !== "weekdays") return [];
    const streak = t.currentStreakCount ?? 0;
    if (streak <= 0) return [];
    const target = Math.min(streak, 14);
    const cycles = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cursor = new Date(today);
    while(cycles.length < target){
        const dow = cursor.getDay();
        const skip = t.recurrenceRule === "weekdays" && (dow === 0 || dow === 6);
        if (!skip) {
            const dateKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
            // Deterministic-ish pseudo-counter so the demo heatmap shading varies
            // realistically. Matches the unit (e.g. "words" → 22-44 per day).
            const counterValue = t.hasCounter ? 22 + cycles.length * 11 % 23 : null;
            cycles.push({
                cycleId: cycles.length + 1,
                taskId: t.taskId,
                checkInDate: `${dateKey}T12:00:00.000Z`,
                counterValue,
                createdAt: `${dateKey}T12:00:00.000Z`
            });
        }
        cursor.setDate(cursor.getDate() - 1);
    }
    return cycles;
}
function withMockCycles(t) {
    const cycles = generateMockCycles(t);
    return cycles.length ? {
        ...t,
        recentCycles: cycles
    } : t;
}
const RAW_MOCK_TASKS = [
    {
        taskId: "d1",
        userId: "demo",
        title: "Morning workout",
        description: "30 min cardio or strength training",
        category: "Fitness",
        priority: "high",
        status: "pending",
        pointValue: 15,
        dueDate: "2026-05-05",
        createdAt: "2026-01-01T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "daily",
        submitted: false,
        currentStreakCount: 12,
        longestStreakCount: 15
    },
    {
        taskId: "d2",
        userId: "demo",
        title: "Read 30 minutes",
        description: null,
        category: "Learning",
        priority: "medium",
        status: "pending",
        pointValue: 10,
        dueDate: "2026-05-05",
        createdAt: "2026-01-01T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "weekdays",
        submitted: false,
        currentStreakCount: 8,
        longestStreakCount: 21
    },
    {
        taskId: "d3",
        userId: "demo",
        title: "Weekly review & planning",
        description: "Review last week, plan the next",
        category: "Productivity",
        priority: "high",
        status: "pending",
        pointValue: 20,
        dueDate: "2026-05-08",
        createdAt: "2026-01-01T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "weekly",
        submitted: false,
        currentStreakCount: 5,
        longestStreakCount: 5
    },
    {
        taskId: "d4",
        userId: "demo",
        title: "Monthly budget review",
        description: null,
        category: "Finance",
        priority: "high",
        status: "pending",
        pointValue: 25,
        dueDate: "2026-05-15",
        createdAt: "2026-01-01T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "monthly",
        submitted: false
    },
    {
        taskId: "d13",
        userId: "demo",
        title: "10-minute meditation",
        description: "Sit, breathe, settle",
        category: "Health",
        priority: "medium",
        status: "pending",
        pointValue: 15,
        dueDate: "2026-05-05",
        createdAt: "2026-04-04T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "daily",
        submitted: false,
        currentStreakCount: 31,
        longestStreakCount: 31
    },
    {
        taskId: "d14",
        userId: "demo",
        title: "Spanish — Duolingo",
        description: "Maintain the streak",
        category: "Learning",
        priority: "medium",
        status: "pending",
        pointValue: 10,
        dueDate: "2026-05-05",
        createdAt: "2026-04-12T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "daily",
        submitted: false,
        currentStreakCount: 22,
        longestStreakCount: 22,
        hasCounter: true,
        counterUnit: "words",
        counterGoal: 40
    },
    {
        taskId: "d15",
        userId: "demo",
        title: "Floss",
        description: "One more day to 2.0x",
        category: "Health",
        priority: "low",
        status: "pending",
        pointValue: 5,
        dueDate: "2026-05-05",
        createdAt: "2026-04-05T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "daily",
        submitted: false,
        currentStreakCount: 29,
        longestStreakCount: 29
    },
    {
        taskId: "d16",
        userId: "demo",
        title: "5-min stretch",
        description: null,
        category: "Fitness",
        priority: "low",
        status: "pending",
        pointValue: 5,
        dueDate: "2026-05-05",
        createdAt: "2026-04-29T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "daily",
        submitted: false,
        currentStreakCount: 6,
        longestStreakCount: 9
    },
    {
        taskId: "d5",
        userId: "demo",
        title: "Fix login page redirect bug",
        description: null,
        category: "Dev",
        priority: "high",
        status: "in_progress",
        pointValue: 30,
        dueDate: "2026-04-26",
        createdAt: "2026-04-20T00:00:00Z",
        completedAt: null,
        isRecurring: false,
        recurrenceRule: null,
        submitted: false,
        subtasks: [
            {
                subtaskId: 201,
                taskId: "d5",
                title: "Reproduce locally",
                completed: true,
                sortOrder: 0,
                createdAt: "2026-04-20T00:00:00Z"
            },
            {
                subtaskId: 202,
                taskId: "d5",
                title: "Trace auth callback flow",
                completed: false,
                sortOrder: 1,
                createdAt: "2026-04-20T00:00:00Z"
            },
            {
                subtaskId: 203,
                taskId: "d5",
                title: "Patch + add regression test",
                completed: false,
                sortOrder: 2,
                createdAt: "2026-04-20T00:00:00Z"
            }
        ]
    },
    {
        taskId: "d6",
        userId: "demo",
        title: "Design new dashboard mockup",
        description: null,
        category: "Design",
        priority: "medium",
        status: "pending",
        pointValue: 20,
        dueDate: "2026-05-03",
        createdAt: "2026-04-22T00:00:00Z",
        completedAt: null,
        isRecurring: false,
        recurrenceRule: null,
        submitted: false,
        subtasks: [
            {
                subtaskId: 101,
                taskId: "d6",
                title: "Sketch low-fi wireframe",
                completed: true,
                sortOrder: 0,
                createdAt: "2026-04-22T00:00:00Z"
            },
            {
                subtaskId: 102,
                taskId: "d6",
                title: "Pick color palette",
                completed: true,
                sortOrder: 1,
                createdAt: "2026-04-22T00:00:00Z"
            },
            {
                subtaskId: 103,
                taskId: "d6",
                title: "Build hi-fi in Figma",
                completed: false,
                sortOrder: 2,
                createdAt: "2026-04-22T00:00:00Z"
            },
            {
                subtaskId: 104,
                taskId: "d6",
                title: "Share for review",
                completed: false,
                sortOrder: 3,
                createdAt: "2026-04-22T00:00:00Z"
            }
        ]
    },
    {
        taskId: "d7",
        userId: "demo",
        title: "Organize project notes",
        description: null,
        category: "Productivity",
        priority: "low",
        status: "pending",
        pointValue: 5,
        dueDate: null,
        createdAt: "2026-04-23T00:00:00Z",
        completedAt: null,
        isRecurring: false,
        recurrenceRule: null,
        submitted: false
    },
    {
        taskId: "d8",
        userId: "demo",
        title: "Write project README",
        description: null,
        category: "Dev",
        priority: "medium",
        status: "completed",
        pointValue: 15,
        dueDate: "2026-04-25",
        createdAt: "2026-04-20T00:00:00Z",
        completedAt: "2026-04-25T14:00:00Z",
        isRecurring: false,
        recurrenceRule: null,
        submitted: false,
        pointsAwarded: false
    },
    {
        taskId: "d9",
        userId: "demo",
        title: "Update resume",
        description: null,
        category: "Career",
        priority: "low",
        status: "completed",
        pointValue: 10,
        dueDate: "2026-04-24",
        createdAt: "2026-04-18T00:00:00Z",
        completedAt: "2026-04-24T10:00:00Z",
        isRecurring: false,
        recurrenceRule: null,
        submitted: true,
        pointsAwarded: true
    },
    {
        taskId: "d10",
        userId: "demo",
        title: "File Q1 expenses",
        description: null,
        category: "Finance",
        priority: "medium",
        status: "completed",
        pointValue: 20,
        dueDate: "2026-02-15",
        createdAt: "2026-02-10T00:00:00Z",
        completedAt: "2026-02-14T18:00:00Z",
        isRecurring: false,
        recurrenceRule: null,
        submitted: true,
        pointsAwarded: true,
        isArchived: true
    },
    {
        taskId: "d11",
        userId: "demo",
        title: "Renew domain registration",
        description: null,
        category: "Admin",
        priority: "low",
        status: "completed",
        pointValue: 5,
        dueDate: "2026-01-20",
        createdAt: "2026-01-15T00:00:00Z",
        completedAt: "2026-01-19T09:00:00Z",
        isRecurring: false,
        recurrenceRule: null,
        submitted: true,
        pointsAwarded: true,
        isArchived: true
    },
    {
        taskId: "d12",
        userId: "demo",
        title: "New Year retro",
        description: "Reflect on last year and set goals",
        category: "Productivity",
        priority: "high",
        status: "completed",
        pointValue: 25,
        dueDate: "2026-01-05",
        createdAt: "2026-01-01T00:00:00Z",
        completedAt: "2026-01-04T20:00:00Z",
        isRecurring: false,
        recurrenceRule: null,
        submitted: true,
        pointsAwarded: true,
        isArchived: true
    }
];
const MOCK_TASKS = RAW_MOCK_TASKS.map(withMockCycles);
}),
"[project]/apps/web/src/components/DesktopShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DesktopShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function DesktopShell({ sidebar, main, detail }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "desktop-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "desktop-shell-sidebar",
                "aria-label": "Navigation",
                children: sidebar
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DesktopShell.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "desktop-shell-main",
                children: main
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DesktopShell.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "desktop-shell-detail",
                "aria-label": "Detail",
                "data-empty": detail == null ? "true" : undefined,
                children: detail
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DesktopShell.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/DesktopShell.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/ThemeToggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ThemeContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function ThemeToggle() {
    const { toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggleTheme,
        "aria-label": "Toggle theme",
        title: "Toggle theme",
        className: "w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-colors",
        style: {
            background: "var(--color-button-bg)",
            border: "1px solid var(--color-button-border)",
            color: "var(--color-button-fg)",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "theme-toggle-icon-sun",
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "12",
                        cy: "12",
                        r: "4"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/ThemeToggle.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/ThemeToggle.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/ThemeToggle.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "theme-toggle-icon-moon",
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/ThemeToggle.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/ThemeToggle.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/ThemeToggle.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/AuthHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/users.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/PointsContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ThemeContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ThemeToggle.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function AuthHeader({ variant = "header" } = {}) {
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasToken, setHasToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const { balance, username, profilePictureUrl, unsubmittedPoints, recurringSubmittedToday, dailySubmitted, setBalance, setUsername, setProfilePictureUrl, setRecurringSubmittedToday, setDailySubmitted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$PointsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePoints"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
        const token = !!localStorage.getItem("auth_token");
        setHasToken(token);
        if (!token) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usersApi"].getMe().then(({ data })=>{
            if (data) {
                setBalance(data.currentBalance);
                setUsername(data.username);
                setProfilePictureUrl(data.profilePictureUrl ?? null);
                setDailySubmitted(data.pointsSubmittedToday ?? 0);
                setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
            }
        });
    }, [
        pathname
    ]);
    // Always render the theme toggle, even before mount or when unauthenticated.
    // Authenticated users get the toggle inside the avatar dropdown instead.
    if (!isMounted || !hasToken) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
        lineNumber: 45,
        columnNumber: 39
    }, this);
    const balanceChip = balance !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1.5 shrink-0",
        "data-coin-target": "balance",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "15",
                height: "12",
                viewBox: "0 0 12 10",
                fill: "none",
                "aria-hidden": true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "6",
                        cy: "0.55",
                        rx: "2",
                        ry: "0.55",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 4,0.55 A 2,0.55 0 0 0 8,0.55",
                        stroke: "var(--color-warning)",
                        strokeWidth: "0.25",
                        fill: "none",
                        opacity: "1"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "1.1",
                        width: "4",
                        height: "0.9",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "2",
                        width: "4",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "3",
                        width: "4",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "4",
                        width: "4",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "5",
                        width: "4",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "6",
                        width: "4",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "7",
                        width: "4",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "10.5",
                        cy: "4.55",
                        rx: "1.5",
                        ry: "0.5",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 9,4.55 A 1.5,0.5 0 0 0 12,4.55",
                        stroke: "var(--color-warning)",
                        strokeWidth: "0.22",
                        fill: "none",
                        opacity: "1"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "5.1",
                        width: "3",
                        height: "0.9",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "6",
                        width: "3",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "9",
                        y: "7",
                        width: "3",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "2.5",
                        cy: "8.4",
                        rx: "1.5",
                        ry: "0.4",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "1",
                        y: "8.5",
                        width: "3",
                        height: "0.5",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "0.5",
                        y: "9",
                        width: "4",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "9.5",
                        cy: "8.4",
                        rx: "2",
                        ry: "0.45",
                        fill: "var(--color-warning)",
                        opacity: "0.95"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "7.5",
                        y: "8.5",
                        width: "4",
                        height: "0.5",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "7",
                        y: "9",
                        width: "5",
                        height: "1",
                        fill: "var(--color-warning)",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "var(--color-warning)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.05em"
                },
                children: balance.toLocaleString()
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
    const unsubmittedChip = unsubmittedPoints > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1.5 shrink-0",
        title: `${unsubmittedPoints} unsubmitted pts`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "9",
                height: "11",
                viewBox: "0 0 10 12",
                fill: "none",
                shapeRendering: "crispEdges",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z",
                        style: {
                            fill: "var(--color-warning)"
                        },
                        opacity: "0.85"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "4",
                        y: "5",
                        width: "2",
                        height: "2",
                        style: {
                            fill: "var(--color-bg)"
                        },
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "var(--color-warning)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.05em"
                },
                children: [
                    "+",
                    unsubmittedPoints.toLocaleString()
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
    const avatarBtn = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative shrink-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setMenuOpen((o)=>!o),
                className: "w-7 h-7 rounded-full flex items-center justify-center cursor-pointer overflow-hidden",
                style: {
                    background: "#3e3f42",
                    border: "1px solid #555659",
                    color: "#ddd",
                    padding: 0
                },
                "aria-label": "Account menu",
                children: profilePictureUrl ? // eslint-disable-next-line @next/next/no-img-element
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: profilePictureUrl,
                    alt: "",
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "12",
                            cy: "8",
                            r: "4",
                            fill: "currentColor",
                            opacity: "0.8"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M4 20c0-4 3.6-7 8-7s8 3 8 7",
                            fill: "currentColor",
                            opacity: "0.5"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                    lineNumber: 112,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-10",
                        onClick: ()=>setMenuOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute z-20 min-w-[160px] overflow-hidden ${variant === "sidebar" ? "left-0 bottom-full mb-2" : "right-0 mt-2"}`,
                        style: {
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "4px",
                            boxShadow: "var(--shadow-popover)"
                        },
                        children: [
                            (()=>{
                                const regSubmitted = Math.min(dailySubmitted - recurringSubmittedToday, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"]);
                                const recSubmitted = Math.min(recurringSubmittedToday, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"]);
                                const regPct = Math.round(regSubmitted / __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"] * 100);
                                const recPct = Math.round(recSubmitted / __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"] * 100);
                                const regCapped = regSubmitted >= __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"];
                                const recCapped = recSubmitted >= __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 py-3 border-b flex flex-col gap-2.5",
                                    style: {
                                        borderColor: "var(--color-border-soft)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: "var(--color-fg-subtle)",
                                                                fontSize: "9px",
                                                                letterSpacing: "0.18em",
                                                                textTransform: "uppercase"
                                                            },
                                                            children: "Regular"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                            lineNumber: 144,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: regCapped ? "var(--color-success)" : "var(--color-fg-muted)",
                                                                fontSize: "9px",
                                                                letterSpacing: "0.05em",
                                                                fontWeight: 600
                                                            },
                                                            children: [
                                                                regSubmitted,
                                                                " / ",
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"]
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full h-1 rounded-full overflow-hidden",
                                                    style: {
                                                        background: "var(--color-track)"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full rounded-full transition-all duration-300",
                                                        style: {
                                                            width: `${regPct}%`,
                                                            background: regCapped ? "var(--color-success)" : regPct >= 75 ? "var(--color-warning)" : "var(--color-active-highlight)"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 23
                                                }, this),
                                                regCapped && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "var(--color-success)",
                                                        fontSize: "9px",
                                                        letterSpacing: "0.12em",
                                                        textTransform: "uppercase",
                                                        marginTop: "4px"
                                                    },
                                                    children: "Cap reached"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                            lineNumber: 142,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: "var(--color-fg-subtle)",
                                                                fontSize: "9px",
                                                                letterSpacing: "0.18em",
                                                                textTransform: "uppercase"
                                                            },
                                                            children: "Routines"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: recCapped ? "var(--color-success)" : "var(--color-fg-muted)",
                                                                fontSize: "9px",
                                                                letterSpacing: "0.05em",
                                                                fontWeight: 600
                                                            },
                                                            children: [
                                                                recSubmitted,
                                                                " / ",
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"]
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                            lineNumber: 168,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full h-1 rounded-full overflow-hidden",
                                                    style: {
                                                        background: "var(--color-track)"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full rounded-full transition-all duration-300",
                                                        style: {
                                                            width: `${recPct}%`,
                                                            background: recCapped ? "var(--color-success)" : recPct >= 75 ? "var(--color-warning)" : "var(--color-active-highlight-alt)"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 23
                                                }, this),
                                                recCapped && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "var(--color-success)",
                                                        fontSize: "9px",
                                                        letterSpacing: "0.12em",
                                                        textTransform: "uppercase",
                                                        marginTop: "4px"
                                                    },
                                                    children: "Cap reached"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                            lineNumber: 163,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                    lineNumber: 141,
                                    columnNumber: 19
                                }, this);
                            })(),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleTheme,
                                        className: "w-full flex items-center justify-between px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors",
                                        style: {
                                            color: "var(--color-fg-muted)",
                                            background: "transparent",
                                            border: "none"
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.background = "var(--color-surface-2)";
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.background = "transparent";
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Theme"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                lineNumber: 195,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "var(--color-active-highlight)",
                                                    fontWeight: 600,
                                                    letterSpacing: "0.15em"
                                                },
                                                children: theme === "dark" ? "Dark" : "Light"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/avatar",
                                        onClick: ()=>setMenuOpen(false),
                                        className: "w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors block",
                                        style: {
                                            color: "var(--color-fg-muted)",
                                            background: "transparent",
                                            textDecoration: "none"
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.background = "var(--color-surface-2)";
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.background = "transparent";
                                        },
                                        children: "Avatar"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                        lineNumber: 200,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/settings",
                                        onClick: ()=>setMenuOpen(false),
                                        className: "w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors block",
                                        style: {
                                            color: "var(--color-fg-muted)",
                                            background: "transparent",
                                            textDecoration: "none"
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.background = "var(--color-surface-2)";
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.background = "transparent";
                                        },
                                        children: "Settings"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setMenuOpen(false);
                                            localStorage.removeItem("auth_token");
                                            window.location.replace("/");
                                        },
                                        className: "w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors",
                                        style: {
                                            color: "var(--color-fg-muted)",
                                            background: "transparent"
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.background = "var(--color-surface-2)";
                                            e.currentTarget.style.color = "var(--color-danger)";
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = "var(--color-fg-muted)";
                                        },
                                        children: "Sign Out"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                        lineNumber: 220,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
    if (variant === "sidebar") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "desktop-sidebar-user",
            children: [
                avatarBtn,
                username && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "desktop-sidebar-user-name",
                    children: username
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                    lineNumber: 245,
                    columnNumber: 11
                }, this),
                (balanceChip || unsubmittedChip) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "desktop-sidebar-user-points",
                    children: [
                        balanceChip,
                        unsubmittedChip
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                    lineNumber: 248,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
            lineNumber: 242,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 sm:gap-3 shrink-0",
        children: [
            username && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "var(--color-fg-muted)",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase"
                },
                children: username
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
                lineNumber: 260,
                columnNumber: 9
            }, this),
            unsubmittedChip,
            balanceChip,
            avatarBtn
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AuthHeader.tsx",
        lineNumber: 258,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/DesktopSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DesktopSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$AuthHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/AuthHeader.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function DesktopSidebar({ navItems, filterGroups, footerNavItems, footer }) {
    const renderNavRow = (item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: item.href,
            className: `desktop-sidebar-row${item.active ? " active" : ""}`,
            "aria-current": item.active ? "page" : undefined,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "desktop-sidebar-icon",
                    "aria-hidden": true,
                    children: item.icon
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                    lineNumber: 48,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "desktop-sidebar-label",
                    children: item.label
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                    lineNumber: 49,
                    columnNumber: 7
                }, this),
                item.badge != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "desktop-sidebar-badge",
                    children: item.badge
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            ]
        }, item.href, true, {
            fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
            lineNumber: 42,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "desktop-sidebar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "desktop-sidebar-scroll",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "desktop-sidebar-section",
                        "aria-label": "Pages",
                        children: navItems.map(renderNavRow)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    filterGroups?.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "desktop-sidebar-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "desktop-sidebar-section-title",
                                    children: group.title
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                group.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>group.onSelect(item.value),
                                        className: `desktop-sidebar-row${item.active ? " active" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "desktop-sidebar-icon",
                                                "aria-hidden": true,
                                                children: item.dotColor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: item.dotColor,
                                                        display: "inline-block"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterIcon, {}, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "desktop-sidebar-label",
                                                children: item.label
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                                                lineNumber: 86,
                                                columnNumber: 17
                                            }, this),
                                            item.count != null && item.count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "desktop-sidebar-badge",
                                                children: item.count
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                                                lineNumber: 88,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.value, true, {
                                        fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, group.groupKey ?? group.title, true, {
                            fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)),
                    footerNavItems && footerNavItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "desktop-sidebar-section",
                        "aria-label": "More",
                        children: footerNavItems.map(renderNavRow)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "desktop-sidebar-footer",
                        children: footer
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                        lineNumber: 101,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$AuthHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                variant: "sidebar"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
function FilterIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "13",
        height: "13",
        viewBox: "0 0 16 16",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "3",
                y1: "5",
                x2: "13",
                y2: "5",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "3",
                y1: "9",
                x2: "13",
                y2: "9",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "3",
                y1: "13",
                x2: "13",
                y2: "13",
                stroke: "currentColor",
                strokeWidth: "1.4",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/DesktopSidebar.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/hooks/useDesktopLayout.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDesktopLayout",
    ()=>useDesktopLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function useDesktopLayout() {
    const [isDesktop, setIsDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const mq = undefined;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        const update = undefined;
    }, []);
    return isDesktop;
}
}),
"[project]/apps/web/src/components/NavIcons.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Pixel-line nav icons used by DesktopSidebar entries on the Today,
// Routines, and Archive pages.
__turbopack_context__.s([
    "NavIconArchive",
    ()=>NavIconArchive,
    "NavIconAvatar",
    ()=>NavIconAvatar,
    "NavIconList",
    ()=>NavIconList,
    "NavIconRepeat",
    ()=>NavIconRepeat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function NavIconList() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "6",
                x2: "20",
                y2: "6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "12",
                x2: "20",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 7,
                columnNumber: 44
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "18",
                x2: "20",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 7,
                columnNumber: 83
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3,6 4,7 6,5"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3,12 4,13 6,11"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 8,
                columnNumber: 40
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3,18 4,19 6,17"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 8,
                columnNumber: 76
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/NavIcons.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
function NavIconRepeat() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 12a9 9 0 1 1-3-6.7"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "21 4 21 10 15 10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 16,
                columnNumber: 42
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/NavIcons.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
function NavIconArchive() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "4",
                width: "18",
                height: "4",
                rx: "1"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 24,
                columnNumber: 56
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "10",
                y1: "12",
                x2: "14",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 24,
                columnNumber: 109
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/NavIcons.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
function NavIconAvatar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "8",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 20c0-4 3.6-7 8-7s8 3 8 7"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NavIcons.tsx",
                lineNumber: 32,
                columnNumber: 38
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/NavIcons.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/app/archive/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ArchivePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/TaskRow.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ToastContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockTasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/mockTasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DesktopShell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DesktopSidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDesktopLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useDesktopLayout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/NavIcons.tsx [app-ssr] (ecmascript)");
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
;
;
const PAGE_SIZE = 25;
function ArchivePage() {
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pageNumber, setPageNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalCount, setTotalCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDesktopLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesktopLayout"])();
    const { setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const sentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hasMore = tasks.length < totalCount;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        const hasToken = !!localStorage.getItem("auth_token");
        setIsAuthenticated(hasToken);
        if (!hasToken) {
            const archived = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockTasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_TASKS"].filter((t)=>t.isArchived);
            setTasks(archived);
            setTotalCount(archived.length);
            setLoading(false);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAuthenticated) return;
        let cancelled = false;
        async function fetchFirstPage() {
            setLoading(true);
            setError(null);
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tasksApi"].getAll({
                pageSize: PAGE_SIZE,
                pageNumber: 1,
                isArchived: true
            });
            if (cancelled) return;
            setLoading(false);
            if (error) {
                setError(error);
                return;
            }
            setTasks(data.data);
            setTotalCount(data.totalCount);
            setPageNumber(1);
        }
        fetchFirstPage();
        return ()=>{
            cancelled = true;
        };
    }, [
        isAuthenticated,
        setError
    ]);
    const loadMore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (loadingMore || loading || !hasMore || !isAuthenticated) return;
        setLoadingMore(true);
        const next = pageNumber + 1;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tasksApi"].getAll({
            pageSize: PAGE_SIZE,
            pageNumber: next,
            isArchived: true
        });
        setLoadingMore(false);
        if (error) {
            setError(error);
            return;
        }
        setTasks((prev)=>[
                ...prev,
                ...data.data
            ]);
        setPageNumber(next);
    }, [
        loadingMore,
        loading,
        hasMore,
        isAuthenticated,
        pageNumber,
        setError
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const node = sentinelRef.current;
        if (!node || !hasMore) return;
        const obs = new IntersectionObserver((entries)=>{
            if (entries.some((e)=>e.isIntersecting)) loadMore();
        }, {
            rootMargin: "200px"
        });
        obs.observe(node);
        return ()=>obs.disconnect();
    }, [
        hasMore,
        loadMore
    ]);
    async function handleUnarchive(task) {
        const snapshot = task;
        setTasks((prev)=>prev.filter((t)=>t.taskId !== task.taskId));
        setTotalCount((c)=>Math.max(0, c - 1));
        if (!isAuthenticated) return;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tasksApi"].unarchive(task.taskId);
        if (error) {
            setTasks((prev)=>[
                    snapshot,
                    ...prev
                ]);
            setTotalCount((c)=>c + 1);
            setError(error);
        }
    }
    async function handleDelete(id) {
        const snapshot = tasks.find((t)=>t.taskId === id);
        setTasks((prev)=>prev.filter((t)=>t.taskId !== id));
        setTotalCount((c)=>Math.max(0, c - 1));
        if (!isAuthenticated) return;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tasksApi"].delete(id);
        if (error) {
            if (snapshot) setTasks((prev)=>[
                    snapshot,
                    ...prev
                ]);
            setTotalCount((c)=>c + 1);
            setError(error);
        }
    }
    if (!isMounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                background: "var(--color-bg)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-5 h-5 border-2 rounded-full animate-spin",
                style: {
                    borderColor: "var(--color-border)",
                    borderTopColor: "var(--color-accent)"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/archive/page.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/archive/page.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this);
    }
    const noopSet = new Set();
    const mainContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "task-page-shell flex flex-col bg-scanlines overflow-hidden",
        style: {
            background: "var(--color-bg)",
            color: "var(--color-fg)"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full mx-auto px-3 sm:px-4 flex flex-col flex-1 overflow-hidden",
            style: {
                maxWidth: 420
            },
            children: [
                !isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mt-3 mb-3 px-3 py-2 text-[10px] tracking-widest uppercase",
                    style: {
                        background: "var(--color-active-highlight-bg)",
                        border: "1px solid var(--color-active-highlight-border)",
                        borderRadius: "3px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: "var(--color-active-highlight)",
                                opacity: 0.85
                            },
                            children: "Demo · changes are not saved"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/login",
                            style: {
                                color: "var(--color-active-highlight)",
                                letterSpacing: "0.18em",
                                fontWeight: 600
                            },
                            children: "Sign in →"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingTop: 22,
                        background: "var(--color-bg)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "archive-page-banner",
                            style: {
                                display: "flex",
                                alignItems: "stretch",
                                background: "var(--color-surface)",
                                marginBottom: "22px",
                                height: "38px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: "38px",
                                        minWidth: "38px",
                                        height: "38px",
                                        background: "var(--color-surface-2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRight: "1px solid var(--color-border-hairline)"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "15",
                                        height: "15",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        style: {
                                            color: "var(--color-fg)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "3",
                                                y: "4",
                                                width: "18",
                                                height: "4",
                                                rx: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                                lineNumber: 143,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "10",
                                                y1: "12",
                                                x2: "14",
                                                y2: "12"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        paddingLeft: "14px",
                                        overflow: "hidden"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                letterSpacing: "0.22em",
                                                textTransform: "uppercase",
                                                color: "var(--color-fg)",
                                                whiteSpace: "nowrap",
                                                position: "relative",
                                                zIndex: 1
                                            },
                                            children: "Archive"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: "absolute",
                                                left: "94px",
                                                top: 0,
                                                width: "160px",
                                                height: "100%",
                                                background: "repeating-linear-gradient(-60deg, transparent, transparent 4px, var(--color-border-hairline) 4px, var(--color-border-hairline) 8px)",
                                                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
                                                maskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid text-[9px] tracking-widest uppercase px-4 py-2 select-none",
                            style: {
                                gridTemplateColumns: "1fr 64px 80px",
                                color: "var(--color-fg-subtle)",
                                background: "var(--color-bg)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Name"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto",
                    children: [
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center py-20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 border-2 rounded-full animate-spin",
                                style: {
                                    borderColor: "var(--color-border)",
                                    borderTopColor: "var(--color-accent)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 172,
                            columnNumber: 13
                        }, this),
                        !loading && tasks.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-20 gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm tracking-widest uppercase",
                                    style: {
                                        color: "var(--color-fg-subtle)"
                                    },
                                    children: "Nothing archived yet"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 179,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] tracking-widest uppercase",
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        opacity: 0.6
                                    },
                                    children: "Completed tasks move here after 30 days"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 178,
                            columnNumber: 13
                        }, this),
                        !loading && tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            style: {
                                background: "var(--color-surface-deep)",
                                border: "1px solid var(--color-border-soft)",
                                borderRadius: 6,
                                overflow: "hidden"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "task-row-wrapper task-row-phantom",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "task-row-inner",
                                        style: {
                                            position: "absolute",
                                            inset: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, this),
                                tasks.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        task: task,
                                        activeFilter: "completed",
                                        advancing: null,
                                        pausing: null,
                                        slashingId: null,
                                        filingIds: noopSet,
                                        recentlyFiledIds: noopSet,
                                        selectedIds: noopSet,
                                        submittedTaskIds: noopSet,
                                        recurringPopup: undefined,
                                        onAdvance: ()=>{},
                                        onCheckIn: ()=>{},
                                        onPause: ()=>{},
                                        onDelete: handleDelete,
                                        onSkip: ()=>{},
                                        onToggleSelect: ()=>{},
                                        onOpenDetail: ()=>{},
                                        onUnarchive: handleUnarchive,
                                        onSubtasksChange: (taskId, subtasks)=>setTasks((prev)=>prev.map((tt)=>tt.taskId === taskId ? {
                                                        ...tt,
                                                        subtasks
                                                    } : tt))
                                    }, task.taskId, false, {
                                        fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "task-row-wrapper task-row-phantom",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "task-row-inner",
                                        style: {
                                            position: "absolute",
                                            inset: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 185,
                            columnNumber: 13
                        }, this),
                        hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: sentinelRef,
                            className: "flex items-center justify-center py-6",
                            children: loadingMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-4 h-4 border-2 rounded-full animate-spin",
                                style: {
                                    borderColor: "var(--color-border)",
                                    borderTopColor: "var(--color-accent)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/archive/page.tsx",
                                lineNumber: 222,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                !loading && tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mt-2 mb-5 sm:mb-4 px-1 shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] tracking-widest uppercase",
                            style: {
                                color: "var(--color-fg-muted)"
                            },
                            children: [
                                tasks.length,
                                " loaded"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] tracking-widest uppercase",
                            style: {
                                color: "var(--color-fg-muted)"
                            },
                            children: [
                                totalCount,
                                " total"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/archive/page.tsx",
                    lineNumber: 229,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/archive/page.tsx",
            lineNumber: 131,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/archive/page.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
    if (isDesktop) {
        const sidebar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            navItems: [
                {
                    href: "/",
                    label: "To Do",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIconList"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/archive/page.tsx",
                        lineNumber: 246,
                        columnNumber: 46
                    }, void 0)
                },
                {
                    href: "/recurring",
                    label: "Routines",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIconRepeat"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/archive/page.tsx",
                        lineNumber: 247,
                        columnNumber: 58
                    }, void 0)
                }
            ],
            footerNavItems: [
                {
                    href: "/archive",
                    label: "Archive",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIconArchive"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/archive/page.tsx",
                        lineNumber: 250,
                        columnNumber: 55
                    }, void 0),
                    active: true
                },
                ...!isAuthenticated ? [
                    {
                        href: "/avatar",
                        label: "Avatar",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIconAvatar"], {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/archive/page.tsx",
                            lineNumber: 251,
                            columnNumber: 77
                        }, void 0)
                    }
                ] : []
            ]
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/archive/page.tsx",
            lineNumber: 244,
            columnNumber: 7
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            sidebar: sidebar,
            main: mainContent
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/archive/page.tsx",
            lineNumber: 255,
            columnNumber: 12
        }, this);
    }
    return mainContent;
}
}),
];

//# sourceMappingURL=_507d2aa0._.js.map