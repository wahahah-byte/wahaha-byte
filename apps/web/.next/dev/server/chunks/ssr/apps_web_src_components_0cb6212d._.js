module.exports = [
"[project]/apps/web/src/components/DatePicker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DatePicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const DAYS = [
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa"
];
function DatePicker({ value, onChange }) {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const [showCalendar, setShowCalendar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showYearSelect, setShowYearSelect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [calMonth, setCalMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value?.getMonth() ?? today.getMonth());
    const [calYear, setCalYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value?.getFullYear() ?? today.getFullYear());
    const [yearPage, setYearPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(today.getFullYear() - 1);
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragX, setDragX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [sheetDragY, setSheetDragY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [slideDir, setSlideDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingValue, setPendingValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sheetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const swipeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mq = window.matchMedia("(max-width: 639px)");
        const update = ()=>setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return ()=>mq.removeEventListener("change", update);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!showCalendar) return;
        function handleOutside(e) {
            const inTrigger = containerRef.current?.contains(e.target);
            const inSheet = sheetRef.current?.contains(e.target);
            if (!inTrigger && !inSheet) {
                setShowCalendar(false);
                setShowYearSelect(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return ()=>document.removeEventListener("mousedown", handleOutside);
    }, [
        showCalendar
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!showCalendar || !isMobile) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return ()=>{
            document.body.style.overflow = prev;
        };
    }, [
        showCalendar,
        isMobile
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (showCalendar) setPendingValue(value);
    }, [
        showCalendar,
        value
    ]);
    function prevMonth() {
        setSlideDir("from-left");
        if (calMonth === 0) {
            setCalMonth(11);
            setCalYear((y)=>y - 1);
        } else setCalMonth((m)=>m - 1);
    }
    function nextMonth() {
        setSlideDir("from-right");
        if (calMonth === 11) {
            setCalMonth(0);
            setCalYear((y)=>y + 1);
        } else setCalMonth((m)=>m + 1);
    }
    function onSwipeStart(e) {
        if (showYearSelect) return;
        const t = e.touches[0];
        swipeRef.current = {
            startX: t.clientX,
            startY: t.clientY,
            locked: null
        };
        setDragX(0);
        setSheetDragY(0);
    }
    function onSwipeMove(e) {
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
            const damped = Math.sign(dx) * Math.min(Math.abs(dx), 140);
            setDragX(damped);
        } else if (s.locked === "v") {
            // Only react to downward drag (commit-to-close gesture). Upward drag is
            // a no-op so the sheet doesn't visibly lift and then snap back, which
            // also dodges an entrance-animation replay on snap-to-rest.
            if (dy > 0) setSheetDragY(dy);
        }
    }
    function onSwipeEnd() {
        const s = swipeRef.current;
        swipeRef.current = null;
        if (!s) {
            setDragX(0);
            setSheetDragY(0);
            return;
        }
        if (s.locked === "h") {
            const final = dragX;
            setDragX(0);
            const threshold = 50;
            if (final < -threshold) {
                setSlideDir("from-right");
                nextMonth();
            } else if (final > threshold) {
                setSlideDir("from-left");
                prevMonth();
            }
        } else if (s.locked === "v") {
            const final = sheetDragY;
            const threshold = 90;
            if (final > threshold) {
                onChange(pendingValue);
                setShowCalendar(false);
                setShowYearSelect(false);
            }
            setSheetDragY(0);
        } else {
            setDragX(0);
            setSheetDragY(0);
        }
    }
    const years = Array.from({
        length: 6
    }, (_, i)=>yearPage + i + 1);
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const cells = [
        ...Array(firstDay).fill(null),
        ...Array.from({
            length: daysInMonth
        }, (_, i)=>i + 1)
    ];
    while(cells.length < 42)cells.push(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    setShowCalendar((v)=>!v);
                    setShowYearSelect(false);
                },
                className: "w-full px-3 py-2.5 sm:py-2 text-sm text-left cursor-pointer transition-colors",
                style: {
                    background: "var(--color-input)",
                    color: value ? "var(--color-input-fg)" : "var(--color-fg-subtle)",
                    border: `1px solid ${showCalendar ? "var(--color-active-highlight)" : "var(--color-border)"}`,
                    borderRadius: "3px"
                },
                children: value ? value.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }) : "Select a date"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            showCalendar && !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-full mt-1 left-0 right-0 z-20 p-3",
                style: {
                    background: "var(--color-input)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "3px",
                    boxShadow: "var(--shadow-popover)"
                },
                onClick: ()=>setShowYearSelect(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: prevMonth,
                                className: "w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm",
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    background: "transparent",
                                    border: "none"
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                                onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                                children: "‹"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] tracking-widest uppercase",
                                        style: {
                                            color: "var(--color-fg-muted)"
                                        },
                                        children: MONTHS[calMonth]
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] tracking-widest uppercase cursor-pointer",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setShowYearSelect((v)=>!v);
                                        },
                                        style: {
                                            color: "var(--color-fg-muted)"
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.color = "var(--color-active-highlight)";
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.color = "var(--color-fg-muted)";
                                        },
                                        children: calYear
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: nextMonth,
                                className: "w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm",
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    background: "transparent",
                                    border: "none"
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                                onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                                children: "›"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this),
                    showYearSelect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-3 top-3 z-30 p-3",
                        style: {
                            background: "var(--color-input)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "3px",
                            boxShadow: "var(--shadow-popover)"
                        },
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setYearPage((y)=>y - 6),
                                        disabled: yearPage <= today.getFullYear() - 6,
                                        className: "w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm disabled:opacity-30",
                                        style: {
                                            color: "var(--color-fg-subtle)",
                                            background: "transparent",
                                            border: "none"
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                                        onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                                        children: "‹"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 204,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-3 grid-rows-2 gap-y-0.5",
                                        children: years.map((yr, i)=>{
                                            const isSelected = value !== null && value.getFullYear() === yr;
                                            const isCurrentYear = today.getFullYear() === yr;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setCalYear(yr);
                                                    setShowYearSelect(false);
                                                },
                                                className: "text-center py-2 px-2 text-[11px] transition-colors cursor-pointer",
                                                style: {
                                                    color: isSelected || isCurrentYear ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                                    background: "transparent",
                                                    fontWeight: isSelected || isCurrentYear ? 600 : 400,
                                                    borderRadius: "2px",
                                                    border: "none",
                                                    boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none"
                                                },
                                                onMouseEnter: (e)=>{
                                                    if (!isSelected) e.currentTarget.style.color = "var(--color-fg)";
                                                },
                                                onMouseLeave: (e)=>{
                                                    if (!isSelected) e.currentTarget.style.color = isCurrentYear ? "var(--color-active-highlight)" : "var(--color-fg-muted)";
                                                },
                                                children: yr
                                            }, i, false, {
                                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                lineNumber: 219,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setYearPage((y)=>y + 6),
                                        className: "w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm",
                                        style: {
                                            color: "var(--color-fg-subtle)",
                                            background: "transparent",
                                            border: "none"
                                        },
                                        onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                                        onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                                        children: "›"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 239,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setYearPage(today.getFullYear() - 1),
                                disabled: yearPage === today.getFullYear() - 1,
                                className: "mt-2 w-full text-[9px] tracking-widest uppercase transition-colors cursor-pointer py-1 disabled:opacity-30 disabled:cursor-default",
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    background: "transparent",
                                    border: "none"
                                },
                                onMouseEnter: (e)=>{
                                    if (yearPage !== today.getFullYear() - 1) e.currentTarget.style.color = "var(--color-active-highlight)";
                                },
                                onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                                children: "Today"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 249,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                        lineNumber: 198,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-7 mb-1",
                        children: DAYS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-center text-[9px] tracking-wider uppercase py-1.5 sm:py-0.5",
                                style: {
                                    color: "var(--color-fg-subtle)"
                                },
                                children: d
                            }, d, false, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 264,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                        lineNumber: 262,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-7 gap-y-0.5",
                        children: cells.map((day, i)=>{
                            const isPast = day !== null && new Date(calYear, calMonth, day) < todayMidnight;
                            const isSelected = day !== null && value !== null && value.getDate() === day && value.getMonth() === calMonth && value.getFullYear() === calYear;
                            const isToday = day !== null && today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                disabled: day === null || isPast,
                                onClick: ()=>{
                                    if (!day) return;
                                    onChange(new Date(calYear, calMonth, day));
                                    setShowCalendar(false);
                                    setShowYearSelect(false);
                                },
                                className: "text-center py-2 sm:py-1 text-xs sm:text-[11px] transition-colors cursor-pointer disabled:pointer-events-none",
                                style: {
                                    color: day === null ? "transparent" : isPast ? "var(--color-fg-subtle)" : isSelected || isToday ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                    background: "transparent",
                                    fontWeight: isSelected || isToday ? 600 : 400,
                                    borderRadius: "2px",
                                    border: "none",
                                    boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none"
                                },
                                onMouseEnter: (e)=>{
                                    if (day && !isSelected && !isPast) e.currentTarget.style.color = "var(--color-fg)";
                                },
                                onMouseLeave: (e)=>{
                                    if (day && !isSelected && !isPast) e.currentTarget.style.color = isToday ? "var(--color-active-highlight)" : "var(--color-fg-muted)";
                                },
                                children: day ?? ""
                            }, i, false, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 285,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                        lineNumber: 270,
                        columnNumber: 11
                    }, this),
                    value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onChange(null);
                            setShowCalendar(false);
                            setShowYearSelect(false);
                        },
                        className: "mt-2 w-full text-[9px] tracking-widest uppercase transition-colors cursor-pointer py-1",
                        style: {
                            color: "var(--color-fg-subtle)",
                            background: "transparent",
                            border: "none"
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                        onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                        lineNumber: 313,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                lineNumber: 157,
                columnNumber: 9
            }, this),
            showCalendar && isMobile && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-edge-drawer-block": true,
                        className: "fixed inset-0",
                        style: {
                            background: "rgba(0, 0, 0, 0.5)",
                            zIndex: 60
                        },
                        onClick: ()=>{
                            setShowCalendar(false);
                            setShowYearSelect(false);
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                        lineNumber: 328,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: sheetRef,
                        "data-edge-drawer-block": true,
                        className: "fixed left-0 right-0 p-3",
                        style: {
                            bottom: 0,
                            paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
                            background: "var(--color-input)",
                            borderTop: "1px solid var(--color-border)",
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px",
                            boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)",
                            zIndex: 61,
                            animation: "datepicker-sheet-in 0.18s cubic-bezier(0.2, 0, 0, 1)",
                            transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
                            transition: sheetDragY === 0 ? "transform 0.22s cubic-bezier(0.2, 0, 0, 1)" : "none",
                            touchAction: "none",
                            willChange: sheetDragY !== 0 ? "transform" : undefined
                        },
                        onClick: ()=>setShowYearSelect(false),
                        onTouchStart: onSwipeStart,
                        onTouchMove: onSwipeMove,
                        onTouchEnd: onSwipeEnd,
                        onTouchCancel: onSwipeEnd,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto mb-3",
                                style: {
                                    width: 36,
                                    height: 4,
                                    borderRadius: 2,
                                    background: "var(--color-border)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: prevMonth,
                                                className: "w-9 h-9 flex items-center justify-center cursor-pointer text-base",
                                                style: {
                                                    color: "var(--color-fg-subtle)",
                                                    background: "transparent",
                                                    border: "none"
                                                },
                                                children: "‹"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                lineNumber: 365,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] tracking-widest uppercase",
                                                        style: {
                                                            color: "var(--color-fg-muted)"
                                                        },
                                                        children: MONTHS[calMonth]
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] tracking-widest uppercase cursor-pointer",
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            setShowYearSelect((v)=>!v);
                                                        },
                                                        style: {
                                                            color: "var(--color-fg-muted)"
                                                        },
                                                        children: calYear
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                lineNumber: 372,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: nextMonth,
                                                className: "w-9 h-9 flex items-center justify-center cursor-pointer text-base",
                                                style: {
                                                    color: "var(--color-fg-subtle)",
                                                    background: "transparent",
                                                    border: "none"
                                                },
                                                children: "›"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                lineNumber: 384,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 364,
                                        columnNumber: 15
                                    }, this),
                                    showYearSelect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-x-0 top-0 z-30 p-3",
                                        style: {
                                            background: "var(--color-input)",
                                            border: "1px solid var(--color-border)",
                                            borderRadius: "3px",
                                            boxShadow: "var(--shadow-popover)"
                                        },
                                        onClick: (e)=>e.stopPropagation(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setYearPage((y)=>y - 6),
                                                        disabled: yearPage <= today.getFullYear() - 6,
                                                        className: "w-8 h-8 flex items-center justify-center cursor-pointer text-sm disabled:opacity-30",
                                                        style: {
                                                            color: "var(--color-fg-subtle)",
                                                            background: "transparent",
                                                            border: "none"
                                                        },
                                                        children: "‹"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                        lineNumber: 400,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-3 grid-rows-2 gap-y-0.5",
                                                        children: years.map((yr, i)=>{
                                                            const isSelected = value !== null && value.getFullYear() === yr;
                                                            const isCurrentYear = today.getFullYear() === yr;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setCalYear(yr);
                                                                    setShowYearSelect(false);
                                                                },
                                                                className: "text-center py-2 px-3 text-[12px] cursor-pointer",
                                                                style: {
                                                                    color: isSelected || isCurrentYear ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                                                    background: "transparent",
                                                                    fontWeight: isSelected || isCurrentYear ? 600 : 400,
                                                                    borderRadius: "2px",
                                                                    border: "none",
                                                                    boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none"
                                                                },
                                                                children: yr
                                                            }, i, false, {
                                                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                                lineNumber: 413,
                                                                columnNumber: 27
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setYearPage((y)=>y + 6),
                                                        className: "w-8 h-8 flex items-center justify-center cursor-pointer text-sm",
                                                        style: {
                                                            color: "var(--color-fg-subtle)",
                                                            background: "transparent",
                                                            border: "none"
                                                        },
                                                        children: "›"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                        lineNumber: 431,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                lineNumber: 399,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setYearPage(today.getFullYear() - 1),
                                                disabled: yearPage === today.getFullYear() - 1,
                                                className: "mt-2 w-full text-[9px] tracking-widest uppercase cursor-pointer py-2 disabled:opacity-30 disabled:cursor-default",
                                                style: {
                                                    color: "var(--color-fg-subtle)",
                                                    background: "transparent",
                                                    border: "none"
                                                },
                                                children: "Today"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                lineNumber: 439,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 394,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 363,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: slideDir === "from-right" ? "datepicker-slide-from-right" : slideDir === "from-left" ? "datepicker-slide-from-left" : "",
                                    style: {
                                        transform: dragX !== 0 ? `translateX(${dragX}px)` : undefined,
                                        transition: dragX === 0 ? "transform 0.18s cubic-bezier(0.2, 0, 0, 1)" : "none",
                                        willChange: "transform"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-7 mb-1",
                                            children: DAYS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-center text-[10px] tracking-wider uppercase py-1.5",
                                                    style: {
                                                        color: "var(--color-fg-subtle)"
                                                    },
                                                    children: d
                                                }, d, false, {
                                                    fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                    lineNumber: 463,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                            lineNumber: 461,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-7 gap-y-1",
                                            children: cells.map((day, i)=>{
                                                const isPast = day !== null && new Date(calYear, calMonth, day) < todayMidnight;
                                                const isSelected = day !== null && pendingValue !== null && pendingValue.getDate() === day && pendingValue.getMonth() === calMonth && pendingValue.getFullYear() === calYear;
                                                const isToday = day !== null && today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    disabled: day === null || isPast,
                                                    onClick: ()=>{
                                                        if (!day) return;
                                                        setPendingValue(new Date(calYear, calMonth, day));
                                                    },
                                                    className: "text-center text-[13px] cursor-pointer disabled:pointer-events-none mx-auto flex items-center justify-center",
                                                    style: {
                                                        width: 38,
                                                        height: 38,
                                                        color: day === null ? "transparent" : isPast ? "var(--color-fg-subtle)" : isSelected ? "var(--color-active-highlight)" : isToday ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                                        background: isSelected ? "var(--color-active-highlight-bg)" : "transparent",
                                                        fontWeight: isSelected || isToday ? 600 : 400,
                                                        borderRadius: "2px",
                                                        border: "none",
                                                        boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none"
                                                    },
                                                    children: day ?? ""
                                                }, i, false, {
                                                    fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                            lineNumber: 469,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, `${calYear}-${calMonth}`, true, {
                                    fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                    lineNumber: 452,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 451,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex items-center gap-2",
                                children: [
                                    pendingValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            onChange(null);
                                            setPendingValue(null);
                                            setShowCalendar(false);
                                            setShowYearSelect(false);
                                        },
                                        className: "flex-1 text-[10px] tracking-widest uppercase cursor-pointer py-3",
                                        style: {
                                            color: "var(--color-fg-subtle)",
                                            background: "transparent",
                                            border: "1px solid var(--color-border)",
                                            borderRadius: "3px"
                                        },
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 513,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            onChange(pendingValue);
                                            setShowCalendar(false);
                                            setShowYearSelect(false);
                                        },
                                        className: "flex-1 text-[10px] tracking-widest uppercase cursor-pointer py-3",
                                        style: {
                                            color: "var(--color-fg)",
                                            background: "var(--color-active-highlight-bg)",
                                            border: "1px solid var(--color-active-highlight-border)",
                                            borderRadius: "3px"
                                        },
                                        children: "Done"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                        lineNumber: 521,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                                lineNumber: 511,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
                        lineNumber: 334,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/DatePicker.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/GoalStepper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GoalStepper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function GoalStepper({ value, onChange, min = 0, max = 99999, step = 1 }) {
    const numeric = value.trim() === "" ? null : Number(value);
    const valid = numeric != null && Number.isFinite(numeric);
    function nudge(delta) {
        const base = valid ? numeric : 0;
        const next = Math.max(min, Math.min(max, base + delta));
        onChange(String(next));
    }
    const atMin = valid && numeric <= min;
    const atMax = valid && numeric >= max;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "goal-stepper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "goal-stepper-btn",
                onClick: ()=>nudge(-step),
                disabled: atMin,
                "aria-label": "Decrease goal",
                children: "−"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/GoalStepper.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "number",
                inputMode: "numeric",
                min: min,
                max: max,
                step: step,
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: "—",
                className: "goal-stepper-input"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/GoalStepper.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "goal-stepper-btn",
                onClick: ()=>nudge(step),
                disabled: atMax,
                "aria-label": "Increase goal",
                children: "+"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/GoalStepper.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/GoalStepper.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/SubtaskRow.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubtaskRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const COMMIT_THRESHOLD = 80;
const MAX_DRAG = 160;
function SubtaskRow({ subtask, readOnly, showSetsReps, onToggle, onDelete, onIncrementSet, onUpdate }) {
    const [dragX, setDragX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const swipeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editTitle, setEditTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(subtask.title);
    const [editSets, setEditSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(subtask.setsTarget != null ? String(subtask.setsTarget) : "");
    const [editReps, setEditReps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(subtask.repsTarget != null ? String(subtask.repsTarget) : "");
    const titleInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Skip the next blur-commit when the user pressed Enter or Escape (those
    // already settled the field and stole focus from the input).
    const skipNextBlurRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (editing && titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
        }
    }, [
        editing
    ]);
    function startEdit() {
        if (!onUpdate || subtask.completed || readOnly) return;
        setEditTitle(subtask.title);
        setEditSets(subtask.setsTarget != null ? String(subtask.setsTarget) : "");
        setEditReps(subtask.repsTarget != null ? String(subtask.repsTarget) : "");
        setEditing(true);
    }
    function cancelEdit() {
        skipNextBlurRef.current = true;
        setEditing(false);
    }
    function commitEdit() {
        if (!onUpdate) {
            setEditing(false);
            return;
        }
        const trimmed = editTitle.trim();
        const fields = {};
        if (trimmed && trimmed !== subtask.title) fields.title = trimmed;
        const sets = editSets.trim() ? Number(editSets) : NaN;
        const nextSets = Number.isFinite(sets) && sets > 0 ? sets : null;
        if (nextSets !== (subtask.setsTarget ?? null)) fields.setsTarget = nextSets;
        const reps = editReps.trim() ? Number(editReps) : NaN;
        const nextReps = Number.isFinite(reps) && reps > 0 ? reps : null;
        if (nextReps !== (subtask.repsTarget ?? null)) fields.repsTarget = nextReps;
        if (Object.keys(fields).length > 0) onUpdate(fields);
        setEditing(false);
    }
    function onTouchStart(e) {
        if (editing || readOnly) return;
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
            // Only allow left swipe (delete direction). Right swipe is ignored.
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
            // Commit: parent will remove this row from the list. We don't snap back.
            onDelete();
        // In the rare rollback case, the row remounts fresh with dragX = 0.
        } else {
            setDragX(0);
        }
    }
    const ready = dragX >= COMMIT_THRESHOLD;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative overflow-hidden",
        style: {
            borderRadius: 2
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
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "2",
                            y1: "3.5",
                            x2: "12",
                            y2: "3.5"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M3.5 4l0.7 7.5h5.6L10.5 4",
                            fill: "none"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 144,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "6",
                            y1: "6",
                            x2: "6",
                            y2: "10"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "8",
                            y1: "6",
                            x2: "8",
                            y2: "10"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                    lineNumber: 141,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                style: {
                    position: "relative",
                    background: "var(--color-panel)",
                    transform: dragX > 0 ? `translateX(-${dragX}px)` : undefined,
                    transition: dragX === 0 ? "transform 0.18s cubic-bezier(0.2,0,0,1)" : "none",
                    touchAction: "pan-y",
                    willChange: dragX > 0 ? "transform" : undefined,
                    padding: "2px 0"
                },
                onTouchStart: onTouchStart,
                onTouchMove: onTouchMove,
                onTouchEnd: onTouchEnd,
                onTouchCancel: onTouchEnd,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: readOnly ? undefined : onToggle,
                        disabled: readOnly,
                        className: "w-6 h-6 flex-shrink-0 flex items-center justify-center",
                        style: {
                            background: "transparent",
                            border: "none",
                            cursor: readOnly ? "default" : "pointer",
                            opacity: readOnly ? 0.7 : 1
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
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 186,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    editing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: titleInputRef,
                        type: "text",
                        value: editTitle,
                        onChange: (e)=>setEditTitle(e.target.value),
                        onKeyDown: (e)=>{
                            if (e.key === "Enter") {
                                e.preventDefault();
                                skipNextBlurRef.current = true;
                                commitEdit();
                            } else if (e.key === "Escape") {
                                e.preventDefault();
                                cancelEdit();
                            }
                        },
                        onBlur: ()=>{
                            if (skipNextBlurRef.current) {
                                skipNextBlurRef.current = false;
                                return;
                            }
                            commitEdit();
                        },
                        className: "flex-1 text-xs outline-none bg-transparent",
                        style: {
                            color: "var(--color-fg)",
                            border: "none",
                            padding: "2px 0",
                            minWidth: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        onClick: onUpdate ? startEdit : undefined,
                        className: "flex-1 text-xs select-none",
                        style: {
                            color: subtask.completed ? "var(--color-fg-muted)" : "var(--color-fg)",
                            textDecoration: subtask.completed ? "line-through" : "none",
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: onUpdate && !subtask.completed ? "text" : "default"
                        },
                        children: subtask.title
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    editing && showSetsReps ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                inputMode: "numeric",
                                min: "1",
                                value: editSets,
                                onChange: (e)=>setEditSets(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        skipNextBlurRef.current = true;
                                        commitEdit();
                                    } else if (e.key === "Escape") {
                                        e.preventDefault();
                                        cancelEdit();
                                    }
                                },
                                onBlur: ()=>{
                                    if (skipNextBlurRef.current) {
                                        skipNextBlurRef.current = false;
                                        return;
                                    }
                                    commitEdit();
                                },
                                placeholder: "sets",
                                "aria-label": "Sets",
                                className: "num-input-themed"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    fontSize: 10,
                                    fontWeight: 600
                                },
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                inputMode: "numeric",
                                min: "1",
                                value: editReps,
                                onChange: (e)=>setEditReps(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        skipNextBlurRef.current = true;
                                        commitEdit();
                                    } else if (e.key === "Escape") {
                                        e.preventDefault();
                                        cancelEdit();
                                    }
                                },
                                onBlur: ()=>{
                                    if (skipNextBlurRef.current) {
                                        skipNextBlurRef.current = false;
                                        return;
                                    }
                                    commitEdit();
                                },
                                placeholder: "reps",
                                "aria-label": "Reps",
                                className: "num-input-themed"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this) : !editing && showSetsReps && subtask.setsTarget != null && subtask.setsTarget > 0 && (()=>{
                        const done = subtask.setsCompleted ?? 0;
                        const target = subtask.setsTarget;
                        const reps = subtask.repsTarget;
                        const reached = done >= target;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    onClick: onUpdate && !subtask.completed ? startEdit : undefined,
                                    style: {
                                        fontSize: 10,
                                        color: reached ? "var(--color-success)" : "var(--color-fg-muted)",
                                        fontVariantNumeric: "tabular-nums",
                                        fontWeight: 600,
                                        letterSpacing: "0.04em",
                                        cursor: onUpdate && !subtask.completed ? "text" : "default"
                                    },
                                    children: [
                                        done,
                                        "/",
                                        target,
                                        reps != null && reps > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "var(--color-fg-subtle)",
                                                fontWeight: 400,
                                                marginLeft: 4
                                            },
                                            children: [
                                                "× ",
                                                reps
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                            lineNumber: 287,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this),
                                !reached && onIncrementSet && !readOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onIncrementSet();
                                    },
                                    className: "goal-stepper-btn",
                                    style: {
                                        width: 22,
                                        height: 22,
                                        border: "1px solid var(--color-border-hairline)",
                                        borderRadius: 3,
                                        background: "var(--color-input)",
                                        color: "var(--color-fg-muted)",
                                        fontSize: 13,
                                        lineHeight: 1,
                                        fontWeight: 600
                                    },
                                    "aria-label": "Mark one set complete",
                                    children: "+"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 293,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this);
                    })(),
                    !editing && !readOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onDelete,
                        className: "flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors",
                        style: {
                            width: 32,
                            height: 32,
                            background: "transparent",
                            border: "none",
                            color: "var(--color-fg-subtle)"
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-danger)",
                        onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                        "aria-label": "Delete subtask",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "13",
                            height: "13",
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
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 332,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "2",
                                    y1: "3.5",
                                    x2: "12",
                                    y2: "3.5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 333,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M3.5 4l0.7 7.5h5.6L10.5 4",
                                    fill: "none"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 334,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "6",
                                    y1: "6",
                                    x2: "6",
                                    y2: "10"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 335,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "8",
                                    y1: "6",
                                    x2: "8",
                                    y2: "10"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                                    lineNumber: 336,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                            lineNumber: 331,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SubtaskRow.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/SubtasksSection.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubtasksSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$subtasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/subtasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/dateUtils.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$SubtaskRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/SubtaskRow.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function SubtasksSection({ task, onChange }) {
    const isAuthenticated = ("TURBOPACK compile-time value", "undefined") !== "undefined" && !!localStorage.getItem("auth_token");
    const isFitness = task.category === "Fitness";
    // Subtasks are frozen for the remainder of a closed cycle so a routine's
    // per-cycle progress (which subtasks are checked, set counters) isn't
    // mutated after the cycle's been finalised by a check-in.
    const subtasksReadOnly = task.isRecurring && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCycleClosed"])(task.dueDate, task.lastCheckInDate);
    const [subtasks, setSubtasksState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(task.subtasks ?? []);
    const [newSubtaskTitle, setNewSubtaskTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [newSubtaskSets, setNewSubtaskSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [newSubtaskReps, setNewSubtaskReps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [addingSubtask, setAddingSubtask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSubtasksState(task.subtasks ?? []);
    }, [
        task.taskId,
        task.subtasks
    ]);
    function commitSubtasks(next) {
        setSubtasksState(next);
        onChange?.(next);
    }
    function nextLocalId() {
        const min = subtasks.reduce((m, s)=>Math.min(m, s.subtaskId), 0);
        return Math.min(min, 0) - 1;
    }
    async function handleToggleSubtask(s) {
        const snapshot = subtasks;
        const next = snapshot.map((x)=>x.subtaskId === s.subtaskId ? {
                ...x,
                completed: !x.completed
            } : x);
        commitSubtasks(next);
        if (!isAuthenticated || s.subtaskId < 0) return;
        //TURBOPACK unreachable
        ;
        const error = undefined;
    }
    async function handleDeleteSubtask(s) {
        const snapshot = subtasks;
        const next = snapshot.filter((x)=>x.subtaskId !== s.subtaskId);
        commitSubtasks(next);
        if (!isAuthenticated || s.subtaskId < 0) return;
        //TURBOPACK unreachable
        ;
        const error = undefined;
    }
    async function handleAddSubtask() {
        const title = newSubtaskTitle.trim();
        if (!title || addingSubtask || task.status === "completed") return;
        setAddingSubtask(true);
        const snapshot = subtasks;
        const sortOrder = (snapshot[snapshot.length - 1]?.sortOrder ?? -1) + 1;
        const setsTarget = newSubtaskSets.trim() && Number(newSubtaskSets) > 0 ? Number(newSubtaskSets) : null;
        const repsTarget = newSubtaskReps.trim() && Number(newSubtaskReps) > 0 ? Number(newSubtaskReps) : null;
        const optimistic = {
            subtaskId: nextLocalId(),
            taskId: task.taskId,
            title,
            completed: false,
            sortOrder,
            createdAt: new Date().toISOString(),
            setsTarget,
            repsTarget,
            setsCompleted: setsTarget != null ? 0 : null
        };
        const optimisticList = [
            ...snapshot,
            optimistic
        ];
        commitSubtasks(optimisticList);
        setNewSubtaskTitle("");
        setNewSubtaskSets("");
        setNewSubtaskReps("");
        if ("TURBOPACK compile-time truthy", 1) {
            setAddingSubtask(false);
            return;
        }
        //TURBOPACK unreachable
        ;
        const data = undefined, error = undefined;
    }
    async function handleUpdateSubtask(s, fields) {
        if (Object.keys(fields).length === 0) return;
        const snapshot = subtasks;
        // If the user shrinks setsTarget below their current setsCompleted, clamp
        // setsCompleted so the displayed "done/target" stays sensible.
        const next = snapshot.map((x)=>{
            if (x.subtaskId !== s.subtaskId) return x;
            const merged = {
                ...x,
                ...fields
            };
            if (fields.setsTarget !== undefined) {
                const target = fields.setsTarget;
                if (target == null) merged.setsCompleted = null;
                else if ((merged.setsCompleted ?? 0) > target) merged.setsCompleted = target;
            }
            return merged;
        });
        commitSubtasks(next);
        if (!isAuthenticated || s.subtaskId < 0) return;
        //TURBOPACK unreachable
        ;
        const updatedRow = undefined;
        const apiFields = undefined;
        const error = undefined;
    }
    async function handleIncrementSet(s) {
        if (s.setsTarget == null) return;
        const currentDone = s.setsCompleted ?? 0;
        if (currentDone >= s.setsTarget) return;
        const nextDone = currentDone + 1;
        const nextCompleted = nextDone >= s.setsTarget;
        const snapshot = subtasks;
        const next = snapshot.map((x)=>x.subtaskId === s.subtaskId ? {
                ...x,
                setsCompleted: nextDone,
                completed: nextCompleted || x.completed
            } : x);
        commitSubtasks(next);
        if (!isAuthenticated || s.subtaskId < 0) return;
        //TURBOPACK unreachable
        ;
        const error = undefined;
    }
    const subtaskDoneCount = subtasks.filter((s)=>s.completed).length;
    // Hidden entirely when completed and there's nothing to read.
    if (task.status === "completed" && subtasks.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: "9px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase"
                        },
                        children: "Subtasks"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    subtasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: "9px",
                            letterSpacing: "0.05em"
                        },
                        children: [
                            subtaskDoneCount,
                            "/",
                            subtasks.length,
                            " done"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            subtasks.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$SubtaskRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    subtask: s,
                    readOnly: subtasksReadOnly,
                    showSetsReps: isFitness,
                    onToggle: ()=>handleToggleSubtask(s),
                    onDelete: ()=>handleDeleteSubtask(s),
                    onIncrementSet: ()=>handleIncrementSet(s),
                    onUpdate: (fields)=>handleUpdateSubtask(s, fields)
                }, s.subtaskId, false, {
                    fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)),
            task.status !== "completed" && !subtasksReadOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mt-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center",
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: "12px",
                            lineHeight: 1
                        },
                        children: "+"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: newSubtaskTitle,
                        onChange: (e)=>setNewSubtaskTitle(e.target.value),
                        onKeyDown: (e)=>{
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSubtask();
                            }
                        },
                        placeholder: isFitness ? "Exercise…" : "Add subtask…",
                        disabled: addingSubtask,
                        className: "flex-1 text-xs outline-none bg-transparent",
                        style: {
                            color: "var(--color-fg)",
                            border: "none",
                            padding: "2px 0",
                            minWidth: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this),
                    isFitness && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                inputMode: "numeric",
                                min: "1",
                                value: newSubtaskSets,
                                onChange: (e)=>setNewSubtaskSets(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddSubtask();
                                    }
                                },
                                placeholder: "sets",
                                "aria-label": "Sets",
                                className: "num-input-themed"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                                lineNumber: 192,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    fontSize: 10,
                                    fontWeight: 600
                                },
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                                lineNumber: 205,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                inputMode: "numeric",
                                min: "1",
                                value: newSubtaskReps,
                                onChange: (e)=>setNewSubtaskReps(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddSubtask();
                                    }
                                },
                                placeholder: "reps",
                                "aria-label": "Reps",
                                className: "num-input-themed"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                                lineNumber: 206,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                        lineNumber: 191,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SubtasksSection.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/HeatmapStrip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeatmapStrip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/dateUtils.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-ssr] (ecmascript)");
"use client";
;
;
const HEATMAP_WEEKS = 12;
const CELL_SIZE = 14;
const CELL_GAP = 3;
const LABEL_COL = 22;
// Empty / 4 filled levels — driven via opacity on the highlight color.
const LEVEL_OPACITY = [
    0,
    0.30,
    0.55,
    0.80,
    1.0
];
const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
function HeatmapStrip({ rule, hasCounter, cycles, pendingTodayDelta = 0 }) {
    // GitHub-style 7×N grid: rows are days-of-week (Sun..Sat), columns are weeks
    // oldest-on-left. Today always sits in the rightmost column at row=todayDow;
    // any cells in that column past today render invisibly so the grid keeps shape.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dateKey"])(today);
    const todayDow = today.getDay(); // 0=Sun..6=Sat
    const start = new Date(today);
    start.setDate(start.getDate() - todayDow - (HEATMAP_WEEKS - 1) * 7);
    const columns = [];
    for(let c = 0; c < HEATMAP_WEEKS; c++){
        const col = [];
        for(let r = 0; r < 7; r++){
            const d = new Date(start);
            d.setDate(start.getDate() + c * 7 + r);
            col.push({
                date: d,
                key: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dateKey"])(d),
                dow: r,
                isFuture: d.getTime() > today.getTime(),
                isWeekend: r === 0 || r === 6
            });
        }
        columns.push(col);
    }
    // A day can have multiple cycles (a check-in plus one or more logs), so
    // aggregate per date: sum counterValue across all cycles that day, and track
    // presence separately so non-counter tasks still light up the cell.
    const dayByDate = new Map();
    for (const c of cycles){
        const key = c.checkInDate.split("T")[0];
        const entry = dayByDate.get(key) ?? {
            sum: 0,
            hasValue: false
        };
        if (typeof c.counterValue === "number") {
            entry.sum += c.counterValue;
            entry.hasValue = true;
        }
        dayByDate.set(key, entry);
    }
    // Fold the buffered +/- delta into today's cell so the heatmap mirrors the
    // avatar total during the in-flight window. Without this the avatar can
    // display X+1 while the heatmap still reads X for the duration of the
    // debounce + API roundtrip.
    if (pendingTodayDelta !== 0) {
        const entry = dayByDate.get(todayKey) ?? {
            sum: 0,
            hasValue: false
        };
        entry.sum += pendingTodayDelta;
        entry.hasValue = true;
        dayByDate.set(todayKey, entry);
    }
    const maxValue = Math.max(1, ...Array.from(dayByDate.values()).map((d)=>d.sum));
    function levelFor(cell) {
        const day = dayByDate.get(cell.key);
        if (!day) return 0;
        if (!hasCounter) return 4;
        const v = day.sum;
        if (v <= 0) return 1;
        const ratio = v / maxValue;
        if (ratio < 0.34) return 1;
        if (ratio < 0.67) return 2;
        if (ratio < 1.0) return 3;
        return 4;
    }
    // Tally over the visible window. For "weekdays" tasks, weekends aren't
    // expected check-in days so they shouldn't count against the denominator.
    const visibleCells = columns.flat().filter((c)=>!c.isFuture);
    const totalExpected = rule === "weekdays" ? visibleCells.filter((c)=>!c.isWeekend).length : visibleCells.length;
    const checkedCount = visibleCells.reduce((n, c)=>dayByDate.has(c.key) ? n + 1 : n, 0);
    // Month label per column — only shown when the month changes from the column to its left.
    const monthLabels = columns.map((col, ci)=>{
        const m = col[0].date.getMonth();
        if (ci === 0) return MONTHS_SHORT[m];
        return m !== columns[ci - 1][0].date.getMonth() ? MONTHS_SHORT[m] : null;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: "9px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase"
                        },
                        children: [
                            "Last ",
                            HEATMAP_WEEKS,
                            " weeks"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: "9px",
                            letterSpacing: "0.05em",
                            fontVariantNumeric: "tabular-nums"
                        },
                        children: [
                            checkedCount,
                            "/",
                            totalExpected
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "center"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    role: "img",
                    "aria-label": `Check-in heatmap for the last ${HEATMAP_WEEKS} weeks: ${checkedCount} of ${totalExpected}`,
                    style: {
                        display: "grid",
                        gridTemplateColumns: `${LABEL_COL}px repeat(${HEATMAP_WEEKS}, ${CELL_SIZE}px)`,
                        gridTemplateRows: `10px repeat(7, ${CELL_SIZE}px)`,
                        columnGap: CELL_GAP,
                        rowGap: CELL_GAP
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                gridColumn: 1,
                                gridRow: 1
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        monthLabels.map((m, c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    gridColumn: c + 2,
                                    gridRow: 1,
                                    fontSize: 8,
                                    color: "var(--color-fg-subtle)",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    lineHeight: "10px",
                                    whiteSpace: "nowrap",
                                    overflow: "visible"
                                },
                                children: m ?? ""
                            }, `m-${c}`, false, {
                                fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this)),
                        [
                            0,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    gridColumn: 1,
                                    gridRow: r + 2,
                                    fontSize: 8,
                                    color: "var(--color-fg-subtle)",
                                    letterSpacing: "0.05em",
                                    lineHeight: `${CELL_SIZE}px`,
                                    textAlign: "right",
                                    paddingRight: 2
                                },
                                children: r === 1 ? "Mon" : r === 3 ? "Wed" : r === 5 ? "Fri" : ""
                            }, `d-${r}`, false, {
                                fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)),
                        columns.flatMap((col, c)=>col.map((cell, r)=>{
                                if (cell.isFuture) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: c + 2,
                                            gridRow: r + 2,
                                            visibility: "hidden"
                                        }
                                    }, cell.key, false, {
                                        fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                                        lineNumber: 178,
                                        columnNumber: 19
                                    }, this);
                                }
                                const isWeekendOff = rule === "weekdays" && cell.isWeekend;
                                const day = dayByDate.get(cell.key);
                                const checked = !!day;
                                const level = levelFor(cell);
                                const isToday = cell.key === todayKey;
                                const value = day?.hasValue ? day.sum : null;
                                const tooltip = isWeekendOff && !checked ? `${fmtCycleDate(cell.key)} · off-day` : `${fmtCycleDate(cell.key)}${checked ? hasCounter ? value != null ? ` · ${value.toLocaleString()}` : " · checked in" : " · checked in" : " · no check-in"}`;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    title: tooltip,
                                    style: {
                                        gridColumn: c + 2,
                                        gridRow: r + 2,
                                        borderRadius: 2,
                                        background: checked ? "var(--color-active-highlight-alt)" : isWeekendOff ? "transparent" : "var(--color-border-soft)",
                                        opacity: checked ? LEVEL_OPACITY[level] : 1,
                                        border: isWeekendOff && !checked ? "1px dashed var(--color-border-faint)" : undefined,
                                        // Inset ring on today so the highlight stays inside the cell —
                                        // an outset outline gets clipped by DetailPager's overflow: hidden.
                                        boxShadow: isToday ? "inset 0 0 0 1.5px var(--color-active-highlight)" : undefined
                                    }
                                }, cell.key, false, {
                                    fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                                    lineNumber: 200,
                                    columnNumber: 17
                                }, this);
                            }))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            hasCounter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center self-end",
                style: {
                    gap: 4,
                    fontSize: 8,
                    color: "var(--color-fg-subtle)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Less"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            background: "var(--color-border-soft)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, this),
                    [
                        1,
                        2,
                        3,
                        4
                    ].map((lvl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                background: "var(--color-active-highlight-alt)",
                                opacity: LEVEL_OPACITY[lvl]
                            }
                        }, lvl, false, {
                            fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "More"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/HeatmapStrip.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
function fmtCycleDate(iso) {
    const [y, m, d] = iso.split("T")[0].split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
}),
"[project]/apps/web/src/components/TierUpBanner.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TierUpBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
"use client";
;
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
                lineNumber: 55,
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
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, message.id, true, {
        fileName: "[project]/apps/web/src/components/TierUpBanner.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this), document.body);
}
}),
"[project]/apps/web/src/components/StreakDisplay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StreakDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TierUpBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/TierUpBanner.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$tiers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/tiers.ts [app-ssr] (ecmascript)");
"use client";
;
;
function StreakDisplay({ currentStreakCount, longestStreakCount }) {
    const c = currentStreakCount ?? 0;
    if (c < 3) return null;
    const multiplier = c >= 30 ? 2.0 : c >= 14 ? 1.8 : c >= 7 ? 1.5 : 1.2;
    const nextTier = c >= 30 ? null : c >= 14 ? {
        at: 30,
        mult: 2.0
    } : c >= 7 ? {
        at: 14,
        mult: 1.8
    } : {
        at: 7,
        mult: 1.5
    };
    const tierStart = c >= 14 ? 14 : c >= 7 ? 7 : 3;
    const SEGMENTS = 12;
    const filled = nextTier ? Math.max(1, Math.min(SEGMENTS, Math.round((c - tierStart) / (nextTier.at - tierStart) * SEGMENTS))) : SEGMENTS;
    const fmt = (m)=>Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1.5",
        style: {
            color: "var(--color-active-highlight-alt)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between text-[11px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-baseline gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: "9px",
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                    fontWeight: 700
                                },
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$tiers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentStreakTier"])(c)?.label ?? "TIER 1"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.5
                                },
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    fontVariantNumeric: "tabular-nums"
                                },
                                children: c
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            longestStreakCount != null && longestStreakCount > c && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    opacity: 0.55,
                                    fontVariantNumeric: "tabular-nums"
                                },
                                children: [
                                    "/ ",
                                    longestStreakCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                                lineNumber: 35,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginLeft: 6,
                                    fontWeight: 600
                                },
                                children: [
                                    fmt(multiplier),
                                    "×"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    nextTier ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: "10px",
                            letterSpacing: "0.05em",
                            fontVariantNumeric: "tabular-nums"
                        },
                        children: [
                            nextTier.at - c,
                            " → ",
                            fmt(nextTier.mult),
                            "×"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: "10px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            fontWeight: 700
                        },
                        children: "Max"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex",
                style: {
                    gap: 2
                },
                "aria-hidden": true,
                children: Array.from({
                    length: SEGMENTS
                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            height: 6,
                            background: i < filled ? "var(--color-active-highlight-alt)" : "var(--color-border-soft)"
                        }
                    }, i, false, {
                        fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/StreakDisplay.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/SlideToCheckIn.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SlideToCheckIn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const COMMIT_FRACTION = 0.78; // need to drag this far across to commit
const SPRING_BACK_MS = 260;
const COMMIT_GLIDE_MS = 320; // ease-into-end after threshold crossed
const DRAG_SMOOTH_MS = 80; // tiny transition during drag — kills jitter without feeling laggy
const COMMIT_FIRE_DELAY = COMMIT_GLIDE_MS - 40; // fire onConfirm just before the glide settles
const THUMB_SIZE = 48;
const TRACK_HEIGHT = 52;
const TRACK_PAD = 2; // inner padding so thumb doesn't touch the rim
function SlideToCheckIn({ label = "Slide to check in", disabled, onConfirm }) {
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [offset, setOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [committed, setCommitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    function maxOffset() {
        const w = trackRef.current?.clientWidth ?? 0;
        return Math.max(0, w - THUMB_SIZE - TRACK_PAD * 2);
    }
    const startDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((clientX)=>{
        if (disabled || committed) return;
        const max = maxOffset();
        if (max <= 0) return;
        dragRef.current = {
            startX: clientX,
            max
        };
        setPhase("dragging");
    }, [
        disabled,
        committed
    ]);
    const moveDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((clientX)=>{
        const d = dragRef.current;
        if (!d) return;
        const next = Math.max(0, Math.min(d.max, clientX - d.startX));
        setOffset(next);
        if (next / d.max >= COMMIT_FRACTION) {
            // Commit — glide smoothly to the end instead of snapping.
            dragRef.current = null;
            setPhase("committing");
            setOffset(d.max);
            setCommitted(true);
            setTimeout(onConfirm, COMMIT_FIRE_DELAY);
        }
    }, [
        onConfirm
    ]);
    const endDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!dragRef.current) return;
        dragRef.current = null;
        setPhase("springing");
        setOffset(0);
        setTimeout(()=>setPhase("idle"), SPRING_BACK_MS);
    }, []);
    // Mouse handlers (desktop / hybrid devices).
    const onMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>moveDrag(e.clientX), [
        moveDrag
    ]);
    const onMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        endDrag();
    }, [
        onMouseMove,
        endDrag
    ]);
    // Fade the label as the thumb advances; cap progress at 1.
    const max = maxOffset();
    const progress = max > 0 ? offset / max : 0;
    const labelOpacity = committed ? 0 : Math.max(0, 1 - progress * 1.4);
    // Per-phase easing — each transition models a different physical feel:
    //  - dragging: 80ms light low-pass that smooths input jitter without obvious lag
    //  - committing: 320ms slow-out so crossing the threshold glides into the end
    //  - springing: 260ms back-ease for a soft return when released early
    //  - idle: no transition (thumb pinned at 0)
    const thumbTransition = phase === "dragging" ? `transform ${DRAG_SMOOTH_MS}ms cubic-bezier(0.18, 0.7, 0.4, 1)` : phase === "committing" ? `transform ${COMMIT_GLIDE_MS}ms cubic-bezier(0.22, 0.85, 0.3, 1)` : phase === "springing" ? `transform ${SPRING_BACK_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none";
    const labelTransition = phase === "springing" ? "opacity 0.22s ease-out" : phase === "dragging" ? `opacity ${DRAG_SMOOTH_MS}ms linear` : "opacity 0.18s ease-out";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: trackRef,
        role: "button",
        "aria-disabled": disabled || committed,
        "aria-label": label,
        onTouchStart: (e)=>startDrag(e.touches[0].clientX),
        onTouchMove: (e)=>{
            if (dragRef.current) moveDrag(e.touches[0].clientX);
        },
        onTouchEnd: endDrag,
        onTouchCancel: endDrag,
        onMouseDown: (e)=>{
            e.preventDefault();
            startDrag(e.clientX);
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        },
        style: {
            position: "relative",
            width: "100%",
            height: TRACK_HEIGHT,
            borderRadius: 999,
            background: "var(--color-input)",
            border: "1px solid var(--color-border-hairline)",
            overflow: "hidden",
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? "not-allowed" : "grab",
            userSelect: "none",
            touchAction: "pan-y"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": true,
                style: {
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "var(--color-fg-muted)",
                    opacity: labelOpacity,
                    transition: labelTransition,
                    paddingLeft: THUMB_SIZE / 2
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                style: {
                    position: "absolute",
                    left: TRACK_PAD,
                    top: TRACK_PAD,
                    width: THUMB_SIZE,
                    height: THUMB_SIZE,
                    borderRadius: 999,
                    background: "linear-gradient(180deg, " + "color-mix(in srgb, var(--color-active-highlight-alt) 78%, white) 0%, " + "var(--color-active-highlight-alt) 52%, " + "color-mix(in srgb, var(--color-active-highlight-alt) 84%, black) 100%)",
                    color: "var(--color-on-active-highlight-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `translateX(${offset}px)`,
                    transition: thumbTransition,
                    boxShadow: [
                        "inset 0 1.5px 0.5px rgba(255, 255, 255, 0.55)",
                        "inset 0 -1.5px 0.5px rgba(0, 0, 0, 0.22)",
                        "inset 0 0 0 1px rgba(0, 0, 0, 0.10)",
                        "0 4px 10px rgba(0, 0, 0, 0.32)",
                        "0 1px 2px rgba(0, 0, 0, 0.22)"
                    ].join(", "),
                    willChange: "transform"
                },
                children: committed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 16 16",
                    fill: "none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                        points: "3,8 7,12 13,4",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
                        lineNumber: 179,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
                    lineNumber: 178,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 16 16",
                    fill: "none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "3.5",
                            y1: "8",
                            x2: "11.5",
                            y2: "8",
                            stroke: "currentColor",
                            strokeWidth: "1.8",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
                            lineNumber: 183,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                            points: "8,4.5 12,8 8,11.5",
                            stroke: "currentColor",
                            strokeWidth: "1.8",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            fill: "none"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
                    lineNumber: 182,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SlideToCheckIn.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/DetailPager.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DetailPager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const SWIPE_COMMIT_PX = 56;
const AXIS_DEADZONE = 8;
function DetailPager({ cards, height = 220, labels }) {
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [dragX, setDragX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [dragging, setDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const wrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.touches.length > 1) {
            dragRef.current = null;
            return;
        }
        const t = e.touches[0];
        const w = wrapRef.current?.clientWidth ?? 0;
        dragRef.current = {
            startX: t.clientX,
            startY: t.clientY,
            locked: null,
            w
        };
        setDragX(0);
    }, []);
    const onMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const d = dragRef.current;
        if (!d || e.touches.length > 1) return;
        const t = e.touches[0];
        const dx = t.clientX - d.startX;
        const dy = t.clientY - d.startY;
        if (d.locked === null) {
            if (Math.abs(dx) < AXIS_DEADZONE && Math.abs(dy) < AXIS_DEADZONE) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                d.locked = "h";
                setDragging(true);
            } else {
                d.locked = "v";
                dragRef.current = null;
                return;
            }
        }
        if (d.locked === "h") {
            const atStart = active === 0;
            const atEnd = active === cards.length - 1;
            // Rubber-band past the boundary cards so the user feels the edge.
            const min = atEnd ? -d.w * 0.15 : -d.w;
            const max = atStart ? d.w * 0.15 : d.w;
            const clamped = Math.max(min, Math.min(max, dx));
            setDragX(clamped);
        }
    }, [
        active,
        cards.length
    ]);
    const onEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const d = dragRef.current;
        dragRef.current = null;
        setDragging(false);
        if (!d || d.locked !== "h") {
            setDragX(0);
            return;
        }
        if (dragX < -SWIPE_COMMIT_PX && active < cards.length - 1) setActive(active + 1);
        else if (dragX > SWIPE_COMMIT_PX && active > 0) setActive(active - 1);
        setDragX(0);
    }, [
        dragX,
        active,
        cards.length
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: wrapRef,
                style: {
                    overflow: "hidden",
                    height,
                    position: "relative"
                },
                onTouchStart: onStart,
                onTouchMove: onMove,
                onTouchEnd: onEnd,
                onTouchCancel: onEnd,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        width: `${cards.length * 100}%`,
                        height: "100%",
                        transform: `translateX(calc(${-active * (100 / cards.length)}% + ${dragX}px))`,
                        transition: dragging ? "none" : "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
                        willChange: "transform"
                    },
                    children: cards.map((card, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "group",
                            "aria-label": labels?.[i],
                            "aria-hidden": i !== active,
                            style: {
                                flex: `0 0 ${100 / cards.length}%`,
                                minWidth: 0,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column"
                            },
                            children: card.content
                        }, card.key, false, {
                            fileName: "[project]/apps/web/src/components/DetailPager.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/DetailPager.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DetailPager.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center",
                role: "tablist",
                style: {
                    gap: 4,
                    borderBottom: "1px solid var(--color-border-faint)"
                },
                children: cards.map((_, i)=>{
                    const isActive = i === active;
                    const label = labels?.[i] ?? `Card ${i + 1}`;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        role: "tab",
                        "aria-selected": isActive,
                        "aria-label": label,
                        onClick: ()=>setActive(i),
                        className: "cursor-pointer transition-colors",
                        style: {
                            background: "transparent",
                            border: "none",
                            padding: "6px 14px",
                            fontSize: 9,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? "var(--color-active-highlight-alt)" : "var(--color-fg-subtle)",
                            borderBottom: `2px solid ${isActive ? "var(--color-active-highlight-alt)" : "transparent"}`,
                            marginBottom: -1
                        },
                        onMouseEnter: (e)=>{
                            if (!isActive) e.currentTarget.style.color = "var(--color-fg-muted)";
                        },
                        onMouseLeave: (e)=>{
                            if (!isActive) e.currentTarget.style.color = "var(--color-fg-subtle)";
                        },
                        children: label
                    }, i, false, {
                        fileName: "[project]/apps/web/src/components/DetailPager.tsx",
                        lineNumber: 129,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DetailPager.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/DetailPager.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/ChibiAvatar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChibiAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/assetPath.ts [app-ssr] (ecmascript)");
"use client";
;
;
// Z-order for stacking equipment layers above the base. Lower numbers render
// behind, higher numbers in front. Covers both the current 6-slot backend enum
// and the planned granular slots so the same map works through the migration.
const SLOT_Z = {
    // Planned granular slots (not yet on the backend — items can use these too).
    WEAPON_BACK: 0,
    CAPE: 10,
    HAIR_BACK: 20,
    BOTTOM: 40,
    TOP: 50,
    // OVERALL shares TOP's z-band — when equipped, the filter above hides
    // any TOP/BOTTOM behind it, so they can't conflict in the stack.
    OVERALL: 50,
    // Front drape of a two-layer cape — sits over TOP/OVERALL so the cape
    // edges visibly fall in front of the body, but stays below GLOVES so the
    // hand sprites can still grab/hold things over it. Not a real backend
    // slot; only used as the z-anchor for a CAPE item's secondaryAssetUrl.
    CAPE_FRONT: 55,
    GLOVES: 60,
    SHOES: 70,
    HAIR_FRONT: 80,
    EYE: 100,
    EAR: 110,
    HAT: 120,
    WEAPON_FRONT: 130,
    WRIST: 140,
    // Current backend enum — mapped to roughly equivalent z-bands.
    BACK: 10,
    BODY: 50,
    FEET: 70,
    HAIR: 80,
    FACE: 90,
    HAND: 130,
    HEAD: 120
};
// Source canvas is 256×384. Render at exactly 2× downsample (128×192) or
// other clean integer divisors for the crispest pixel-art result.
const SOURCE_W = 256;
const SOURCE_H = 384;
// The chibi base only occupies SOURCE_W × SOURCE_H, but item canvases can
// be wider (e.g. weapons at 384×384). Add OVERHANG_SRC source pixels of
// breathing room on EACH side so items up to (SOURCE_W + 2*OVERHANG_SRC)
// wide can render in either direction without overflowing the container.
// Symmetric so the base is naturally centred in the container — every
// consumer (avatar page, task-detail modal, future surfaces) gets the
// chibi centred in its slot without needing a shift hack.
// 128 source pixels covers today's 384-wide weapon canvases (since items
// anchor at the base's source (0,0), so they extend at most OVERHANG_SRC
// past the base in either direction); update if items get even wider.
const OVERHANG_SRC = 128;
const CONTAINER_SOURCE_W = SOURCE_W + OVERHANG_SRC * 2;
const ASPECT = CONTAINER_SOURCE_W / SOURCE_H;
// Slot-wide horizontal nudge applied to items that don't carry their own
// offsetX hint. In source-canvas pixels (256-wide); positive shifts the
// sprite right. Hair PNGs are consistently drawn a few pixels left of
// canvas centre, so a +3 default re-aligns them with the chibi head. The
// per-item OffsetX render hint still wins when set — this only kicks in
// for items that pass through without one.
const SLOT_OFFSET_X = {
    HAIR: 5,
    HAIR_FRONT: 5,
    HAIR_BACK: 5
};
function ChibiAvatar({ equipped, height = 192, basePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])("/avatars/base.png"), pose = "idle", className }) {
    const width = Math.round(height * ASPECT);
    // The base sprite renders at its native aspect inside the wider
    // container so the chibi doesn't get stretched. Items anchor at the
    // same (0, 0) as the base, so existing offsetX/Y tuning stays valid.
    // visualShift translates the whole container left by half the right
    // overhang so the chibi (which sits at the left edge of the asymmetric
    // container) ends up visually centred in its parent flex slot — without
    // bloating the chibi section's layout width or pushing the inventory
    // grid further away.
    const baseScale = height / SOURCE_H;
    const baseW = Math.round(SOURCE_W * baseScale);
    // Symmetric overhang means the base sits at OVERHANG_SRC*baseScale from
    // the container's left edge. Items use the same offset so their
    // canvas (0, 0) keeps aligning with the base canvas (0, 0); per-item
    // offsetX/offsetY are added on top.
    const baseLeft = Math.round(OVERHANG_SRC * baseScale);
    // Filter to items that actually have a PNG asset, then sort by slot z-order.
    // Items without a previewAssetUrl are skipped — the base character still shows.
    //
    // Three suppression rules layered together:
    //   1. coversHairFront / coversHairBack — hat-style items hide the matching
    //      hair slot. The legacy `coversHair` flag is treated as "both true" so
    //      pre-existing RENDER_HINTS entries (e.g. hat_alien_neo.png) keep
    //      working without a code change.
    //   2. Category "hair" rows on the legacy `HAIR` slot are also suppressed
    //      when either hair flag is set (back-compat for the old single-slot
    //      hair model).
    //   3. OVERALL equipped — when an OVERALL-slot item is present, the chibi
    //      composite hides any equipped TOP and BOTTOM items behind it. The
    //      user can still own / equip the underlying pieces; they just don't
    //      render while the OVERALL is on.
    const hideHairFront = equipped.some((inv)=>{
        const i = inv.avatarItem;
        return i?.coversHairFront === true || i?.coversHair === true;
    });
    const hideHairBack = equipped.some((inv)=>{
        const i = inv.avatarItem;
        return i?.coversHairBack === true || i?.coversHair === true;
    });
    const hasOverall = equipped.some((inv)=>inv.avatarItem?.slot === "OVERALL");
    const layered = [];
    for (const inv of equipped){
        const item = inv.avatarItem;
        if (!item?.previewAssetUrl) continue;
        if (hasOverall && (item.slot === "TOP" || item.slot === "BOTTOM")) continue;
        const isPrimaryHairFront = item.slot === "HAIR_FRONT";
        const isPrimaryHairBack = item.slot === "HAIR_BACK";
        // Legacy single-bucket hair — hidden if either granular flag is set.
        const isLegacyHair = item.slot === "HAIR" || item.slot !== "HAIR_FRONT" && item.slot !== "HAIR_BACK" && item.category === "hair";
        const primarySuppressed = hideHairFront && isPrimaryHairFront || hideHairBack && isPrimaryHairBack || (hideHairFront || hideHairBack) && isLegacyHair;
        if (!primarySuppressed) {
            layered.push({
                key: `${inv.inventoryId}:primary`,
                inv,
                src: item.previewAssetUrl,
                z: SLOT_Z[item.slot] ?? 100
            });
        }
        if (item.secondaryAssetUrl) {
            // Slot-dependent z + suppression rules.
            //   CAPE         → secondary drapes in front of body (CAPE_FRONT z)
            //   WEAPON_FRONT → secondary passes behind body (WEAPON_BACK z)
            //   anything else (HAIR_FRONT today) → secondary is back-of-head
            // Only hair secondaries respect hideHairBack — a helmet covers the
            // back strands. Cape/weapon secondaries never interact with hats.
            let secondaryZ;
            let respectHairCover;
            if (item.slot === "CAPE") {
                secondaryZ = SLOT_Z.CAPE_FRONT;
                respectHairCover = false;
            } else if (item.slot === "WEAPON_FRONT") {
                secondaryZ = SLOT_Z.WEAPON_BACK;
                respectHairCover = false;
            } else {
                secondaryZ = SLOT_Z.HAIR_BACK;
                respectHairCover = true;
            }
            if (!(respectHairCover && hideHairBack)) {
                layered.push({
                    key: `${inv.inventoryId}:secondary`,
                    inv,
                    src: item.secondaryAssetUrl,
                    z: secondaryZ
                });
            }
        }
    }
    layered.sort((a, b)=>a.z - b.z);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: {
            position: "relative",
            width,
            height,
            animation: pose === "idle" ? "avatar-idle 2.6s ease-in-out infinite" : undefined
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: basePath,
                alt: "",
                width: baseW,
                height: height,
                draggable: false,
                style: {
                    position: "absolute",
                    // Anchor at baseLeft so the chibi sits centred inside the
                    // overhang-padded container. `inset:0` would stretch the 256-wide
                    // base to fill the wider container.
                    left: baseLeft,
                    top: 0,
                    // Base body sits between the back-of-character layers (HAIR_BACK=20,
                    // CAPE=10, WEAPON_BACK=0) and the clothing layers (BOTTOM=40, TOP=50).
                    // Without this, the base is at z=auto and back-hair / capes render
                    // *over* the face. Has to stay below 40 so clothing still draws on
                    // top of the naked body silhouette.
                    zIndex: 30,
                    imageRendering: "pixelated",
                    userSelect: "none",
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/ChibiAvatar.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            layered.map((layer)=>{
                const item = layer.inv.avatarItem;
                // Per-item canvas can be larger than the base (e.g. an oversized
                // weapon at 384×384 vs base 256×384). Render at the item's native
                // dimensions scaled by the same source-pixel→DOM-pixel ratio as
                // the base, then anchor at top-left — i.e. the item canvas's (0,0)
                // matches the base canvas's (0,0). Extra pixels overhang to the
                // right and/or below. Use offsetX/Y to nudge if the asset was
                // drawn with a different anchor convention.
                //
                // Render-hint values (sourceWidth/Height, offsetX/Y, renderScale)
                // apply to both layers of a two-layer item — the primary and
                // secondary are assumed to be painted on the same canvas at the
                // same anchor, so the hair-back artist works in the same coord
                // system as the hair-front artist.
                const itemSrcW = item.sourceWidth ?? SOURCE_W;
                const itemSrcH = item.sourceHeight ?? SOURCE_H;
                const scale = height / SOURCE_H;
                const itemW = Math.round(itemSrcW * scale);
                const itemH = Math.round(itemSrcH * scale);
                // Items shift right by the same baseLeft as the base so their
                // canvas (0, 0) keeps aligning with the base canvas (0, 0).
                // OffsetX/Y are still added on top.
                const left = baseLeft;
                const top = 0;
                // Per-item offsetX wins over slot defaults. Slot defaults exist
                // for systematic alignment quirks (e.g. all hair drawn 3 px left
                // of centre) so admins don't have to set the same offsetX on
                // every hair upload.
                const offsetX = item.offsetX ?? SLOT_OFFSET_X[item.slot] ?? 0;
                const offsetY = item.offsetY ?? 0;
                const dx = offsetX * scale;
                const dy = offsetY * scale;
                const renderScale = item.renderScale ?? 1;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    // assetPath is a no-op for full https:// URLs (e.g. blob storage)
                    // and prepends the GitHub Pages base path for /-rooted public assets.
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(layer.src),
                    alt: "",
                    width: itemW,
                    height: itemH,
                    draggable: false,
                    style: {
                        position: "absolute",
                        left,
                        top,
                        width: itemW,
                        height: itemH,
                        zIndex: layer.z,
                        imageRendering: "pixelated",
                        userSelect: "none",
                        pointerEvents: "none",
                        transform: dx || dy || renderScale !== 1 ? `translate(${dx}px, ${dy}px) scale(${renderScale})` : undefined
                    }
                }, layer.key, false, {
                    fileName: "[project]/apps/web/src/components/ChibiAvatar.tsx",
                    lineNumber: 274,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/ChibiAvatar.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/QuickLogStepper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickLogStepper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function QuickLogStepper({ cycleSum, pendingLog, showStepper, counterUnit, counterGoal, capAtGoal, onIncrement, onDecrement }) {
    const sum = cycleSum + pendingLog;
    const goal = counterGoal ?? null;
    const capped = !!capAtGoal && goal != null && sum >= goal;
    // Render nothing if there's nothing to display and no input affordance.
    if (cycleSum === 0 && pendingLog === 0 && goal == null && !showStepper) return null;
    const unit = counterUnit ? ` ${counterUnit}` : "";
    const reached = goal != null && sum >= goal;
    const innerText = goal != null ? `${sum.toLocaleString()} / ${goal.toLocaleString()}${unit}` : `${sum.toLocaleString()}${unit}`;
    const quantity = showStepper ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "goal-stepper",
        "aria-label": "Quick log",
        style: {
            height: 20,
            verticalAlign: "middle"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "goal-stepper-btn",
                onClick: onDecrement,
                disabled: sum <= 0,
                "aria-label": "Log -1",
                children: "−"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "goal-stepper-input",
                style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    color: "var(--color-fg)",
                    width: "auto",
                    padding: "0 8px",
                    whiteSpace: "nowrap"
                },
                "aria-live": "polite",
                children: [
                    innerText,
                    reached && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            marginLeft: 6,
                            color: "var(--color-success)"
                        },
                        children: "✓"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                        lineNumber: 77,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "goal-stepper-btn",
                onClick: onIncrement,
                disabled: capped,
                title: capped ? "Capped at goal" : undefined,
                "aria-label": "Log +1",
                children: "+"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        children: [
            innerText,
            reached && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    marginLeft: 6,
                    color: "var(--color-success)"
                },
                children: "✓"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                lineNumber: 91,
                columnNumber: 34
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
    const labelStyle = {
        fontSize: 11,
        color: "var(--color-fg)",
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        display: "inline-flex",
        alignItems: "center",
        gap: 6
    };
    if (goal == null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: labelStyle,
            children: [
                "Today",
                quantity
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
            lineNumber: 106,
            columnNumber: 7
        }, this);
    }
    const pct = Math.min(100, Math.round(sum / goal * 100));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-1.5",
        style: {
            minWidth: 180
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: labelStyle,
                children: [
                    "Today",
                    quantity
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "100%",
                    height: 4,
                    background: "var(--color-track)",
                    borderRadius: 2,
                    overflow: "hidden"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: `${pct}%`,
                        height: "100%",
                        background: reached ? "var(--color-success)" : "var(--color-active-highlight-alt)",
                        transition: "width 0.3s"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/QuickLogStepper.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/TaskDetailModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DatePicker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$GoalStepper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/GoalStepper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$SubtasksSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/SubtasksSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$HeatmapStrip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/HeatmapStrip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$StreakDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/StreakDisplay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useQuickLog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useQuickLog.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$SlideToCheckIn$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/SlideToCheckIn.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DetailPager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DetailPager.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ChibiAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ChibiAvatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$QuickLogStepper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/QuickLogStepper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/mockAvatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useEquippedAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useEquippedAvatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/dateUtils.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
;
const PRIORITIES = [
    {
        label: "Low",
        value: "low",
        color: "var(--color-success)",
        bg: "var(--color-success-bg)"
    },
    {
        label: "Medium",
        value: "medium",
        color: "var(--color-warning)",
        bg: "var(--color-warning-bg)"
    },
    {
        label: "High",
        value: "high",
        color: "var(--color-danger)",
        bg: "var(--color-danger-bg)"
    }
];
const STATUS_LABEL = {
    pending: {
        label: "Pending",
        color: "var(--color-fg-muted)"
    },
    in_progress: {
        label: "In Progress",
        color: "var(--color-active-highlight)"
    },
    completed: {
        label: "Completed",
        color: "var(--color-success)"
    }
};
function parseDateOnly(dateStr) {
    const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
    return new Date(y, m - 1, d);
}
function fmtShort(dateStr) {
    if (!dateStr) return "—";
    return parseDateOnly(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}
function fmtLocalDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
function fmtFull(dateStr) {
    if (!dateStr) return "—";
    let s = dateStr.replace(/(\.\d{3})\d+/, "$1");
    if (!s.includes("T")) {
        return parseDateOnly(s).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }
    if (!/Z|[+-]\d{2}:?\d{2}$/.test(s)) s += "Z";
    const d = new Date(s);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}
function ActionBtn({ onClick, disabled, color, hoverBg, label, icon }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: disabled,
        className: "flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        style: {
            color,
            background: "transparent",
            border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
            borderRadius: "999px",
            padding: "5px 10px"
        },
        onMouseEnter: (e)=>{
            if (!disabled) e.currentTarget.style.background = hoverBg;
        },
        onMouseLeave: (e)=>{
            e.currentTarget.style.background = "transparent";
        },
        children: [
            icon,
            label
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
function TaskDetailModal({ task, currentStreakCount, longestStreakCount, onClose, onStart, onCheckIn, checkInBlocked, onComplete, onPause, onUndo, onDelete, onFlushQuickLog, onSave, onSubtasksChange, isActing, canUndo, initialEditMode, mustReschedule, inline }) {
    const dot = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIORITY_DOT"][task.priority.toLowerCase()] ?? "var(--color-fg-muted)";
    const status = STATUS_LABEL[task.status] ?? {
        label: task.status,
        color: "var(--color-fg-muted)"
    };
    // Pull the user's currently-equipped avatar items so the chibi inside
    // this modal matches whatever's dressed up on the /avatar page. The
    // hook caches across modal opens so each open doesn't pay another
    // network trip.
    //
    // Mock fallback only fires for unauthed sessions (static demo) — for
    // authed users we'd rather render the base chibi with no items for
    // the ~100-300ms a first-time fetch is in flight than briefly show
    // someone else's mock loadout (alien hat etc.) that then flips to
    // their real equipped set. That brief flash was the "old avatar
    // showing up" the user was seeing.
    const hasToken = ("TURBOPACK compile-time value", "undefined") !== "undefined" && !!localStorage.getItem("auth_token");
    const userEquipped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useEquippedAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEquippedAvatar"])();
    const chibiEquipped = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildMockEquipped"])();
    function todayMidnight() {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }
    function rescheduleDefault() {
        const d = todayMidnight();
        if ((task.recurrenceRule ?? "").toLowerCase() === "weekdays") {
            while(d.getDay() === 0 || d.getDay() === 6)d.setDate(d.getDate() + 1);
        }
        return d;
    }
    // Computed once per mount via the useState lazy initializer so we don't
    // call the impure Date.now() in the render body. The lock window is 24h
    // from creation, so it doesn't need to update mid-session anyway.
    const [titleLocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>Date.now() - new Date(task.createdAt).getTime() > 24 * 60 * 60 * 1000);
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialEditMode ?? false);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editError, setEditError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editTitle, setEditTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(task.title);
    const [editDescription, setEditDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(task.description ?? "");
    const [editPriority, setEditPriority] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(task.priority);
    const [editCategory, setEditCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(task.category);
    const [editDueDate, setEditDueDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(mustReschedule ? rescheduleDefault() : task.dueDate ? parseDateOnly(task.dueDate) : null);
    const [editHasCounter, setEditHasCounter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!!task.hasCounter);
    const [editCounterUnit, setEditCounterUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(task.counterUnit ?? "");
    const [editCounterGoal, setEditCounterGoal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(task.counterGoal != null ? String(task.counterGoal) : "");
    const [showEditDescription, setShowEditDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!!editDescription);
    function startEdit() {
        setEditTitle(task.title);
        setEditDescription(task.description ?? "");
        setShowEditDescription(!!(task.description ?? ""));
        setEditPriority(task.priority);
        setEditCategory(task.category);
        setEditDueDate(mustReschedule ? rescheduleDefault() : task.dueDate ? parseDateOnly(task.dueDate) : null);
        setEditHasCounter(!!task.hasCounter);
        setEditCounterUnit(task.counterUnit ?? "");
        setEditCounterGoal(task.counterGoal != null ? String(task.counterGoal) : "");
        setEditError(null);
        setIsEditing(true);
    }
    async function handleSave() {
        if (!editTitle.trim()) {
            setEditError("Title is required.");
            return;
        }
        if (mustReschedule) {
            const today = todayMidnight();
            if (!editDueDate || editDueDate < today) {
                setEditError("Due date cannot be in the past.");
                return;
            }
        }
        if (!onSave) return;
        setIsSaving(true);
        setEditError(null);
        const err = await onSave({
            title: editTitle.trim(),
            description: editDescription.trim() || null,
            category: editCategory,
            priority: editPriority,
            dueDate: editDueDate ? `${editDueDate.getFullYear()}-${String(editDueDate.getMonth() + 1).padStart(2, "0")}-${String(editDueDate.getDate()).padStart(2, "0")}` : null,
            hasCounter: task.isRecurring ? editHasCounter : undefined,
            counterUnit: task.isRecurring ? editHasCounter && editCounterUnit ? editCounterUnit : null : undefined,
            counterGoal: task.isRecurring ? editHasCounter && editCounterGoal.trim() && Number(editCounterGoal) > 0 ? Number(editCounterGoal) : null : undefined
        });
        setIsSaving(false);
        if (err) {
            setEditError(err);
            return;
        }
        setIsEditing(false);
    }
    const categoryOptions = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"].includes(task.category) ? __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"] : [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"],
        task.category
    ].sort();
    const titleColor = !isEditing && task.status === "completed" ? "var(--color-fg-muted)" : "var(--color-fg)";
    const titleDecoration = !isEditing && task.status === "completed" ? "line-through" : "none";
    const priorityDot = isEditing ? __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIORITY_DOT"][editPriority] ?? "var(--color-fg-muted)" : dot;
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sheetDragY, setSheetDragY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // While true the sheet's transform transition is re-enabled so the final
    // slide-off (after a successful swipe-to-dismiss) animates instead of
    // jumping. Cleared implicitly when the modal unmounts.
    const [dismissing, setDismissing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const sheetDragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Extra check-in history for the heatmap. The embedded `task.recentCycles`
    // slice is bounded (~14 entries) and only covers the last couple of weeks,
    // so we lazily pull a wider window from /checkin-history when the modal
    // opens for a daily/weekdays task. Mock mode (no auth token) skips the
    // fetch and the heatmap falls back to the embedded slice.
    const [heatmapHistory, setHeatmapHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Merge fetched history with the embedded slice so optimistic updates from
    // a just-completed check-in (which mutate task.recentCycles via the parent
    // store) stay visible without re-fetching. Local entries win on duplicate
    // cycleIds — they reflect any in-flight edits the server hasn't acked yet.
    // The avatar's cycleSumToday and the heatmap both read from this so they
    // can never disagree about today's committed total.
    const heatmapCycles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const fetched = heatmapHistory ?? [];
        const local = task.recentCycles ?? [];
        if (fetched.length === 0) return local;
        const byId = new Map();
        for (const c of fetched)byId.set(c.cycleId, c);
        for (const c of local)byId.set(c.cycleId, c);
        return Array.from(byId.values());
    }, [
        heatmapHistory,
        task.recentCycles
    ]);
    const todayKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dateKey"])(d);
    }, []);
    // +/- buffered counter for routines (debounced flush, in-flight bookkeeping,
    // page-close keepalive). State lives at modal scope so the avatar and the
    // heatmap on the sibling pager card stay in lockstep — see useQuickLog.
    const { pendingLog, cycleSumToday, handleStepperIncrement, handleStepperDecrement, handleDeleteClick } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useQuickLog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuickLog"])({
        task,
        heatmapCycles,
        onFlushQuickLog,
        onDelete
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!task.isRecurring) return;
        if (task.recurrenceRule !== "daily" && task.recurrenceRule !== "weekdays") return;
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        let cancelled;
    }, [
        task.taskId,
        task.isRecurring,
        task.recurrenceRule
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const mq = undefined;
        const update = undefined;
    }, []);
    // Lock background scroll while the sheet is open on mobile (matches DatePicker pattern).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isMobile || inline) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return ()=>{
            document.body.style.overflow = prev;
        };
    }, [
        isMobile,
        inline
    ]);
    const handleHandleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        sheetDragRef.current = {
            startY: e.touches[0].clientY
        };
        setSheetDragY(0);
    }, []);
    const handleHandleTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const d = sheetDragRef.current;
        if (!d) return;
        const dy = e.touches[0].clientY - d.startY;
        setSheetDragY(dy > 0 ? dy : 0);
    }, []);
    const handleHandleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const d = sheetDragRef.current;
        sheetDragRef.current = null;
        if (!d) return;
        if (sheetDragY > 110) {
            // Past dismiss threshold — slide off-screen, then close.
            setDismissing(true);
            setSheetDragY(window.innerHeight);
            setTimeout(onClose, 260);
        } else {
            setSheetDragY(0);
        }
    }, [
        sheetDragY,
        onClose
    ]);
    // Same swipe-down-to-dismiss gesture from anywhere in the modal body. Only
    // arms when the scroll container is already at the top so it doesn't hijack
    // mid-page scrolling, and only commits on a clear downward swipe (not a
    // horizontal one — subtask rows have their own left-swipe). The recurring
    // "Slide to check in" zone sits outside this scroll container, so it isn't
    // affected.
    const contentDragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleContentTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.currentTarget.scrollTop > 0) return;
        contentDragRef.current = {
            startY: e.touches[0].clientY,
            startX: e.touches[0].clientX,
            committed: false
        };
    }, []);
    const handleContentTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const d = contentDragRef.current;
        if (!d) return;
        const dy = e.touches[0].clientY - d.startY;
        const dx = e.touches[0].clientX - d.startX;
        if (!d.committed) {
            if (Math.abs(dy) < 8 && Math.abs(dx) < 8) return;
            if (dy > 0 && dy > Math.abs(dx)) {
                d.committed = true;
            } else {
                contentDragRef.current = null;
                return;
            }
        }
        setSheetDragY(dy > 0 ? dy : 0);
    }, []);
    const handleContentTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const d = contentDragRef.current;
        contentDragRef.current = null;
        if (!d || !d.committed) return;
        if (sheetDragY > 110) {
            setDismissing(true);
            setSheetDragY(window.innerHeight);
            setTimeout(onClose, 260);
        } else {
            setSheetDragY(0);
        }
    }, [
        sheetDragY,
        onClose
    ]);
    if (!mounted) return null;
    const sheetWrapperClass = inline ? "w-full h-full flex flex-col relative" : isMobile ? "fixed left-0 right-0 flex flex-col" : "w-full max-w-md sm:max-w-lg flex flex-col relative";
    const sheetWrapperStyle = inline ? {
        background: "var(--color-panel)",
        padding: "20px 20px 14px",
        overflowY: "auto",
        flex: 1
    } : isMobile ? {
        bottom: 0,
        zIndex: 61,
        background: "var(--color-panel)",
        borderTop: "1px solid var(--color-border)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)",
        maxHeight: "92vh",
        padding: "0 16px calc(16px + env(safe-area-inset-bottom, 0px))",
        animation: sheetDragY === 0 && !dismissing ? "detail-sheet-in 0.24s cubic-bezier(0.2, 0, 0, 1)" : undefined,
        transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
        // Snap-back (release before threshold) and slide-off (commit dismiss)
        // both animate; only the active finger-drag runs without transition so
        // the sheet tracks the touch 1:1.
        transition: sheetDragY === 0 || dismissing ? "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)" : "none"
    } : {
        background: "var(--color-panel)",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        boxShadow: "var(--shadow-popover)",
        padding: "20px 20px 14px"
    };
    const overlayClass = isMobile ? "fixed inset-0" : "fixed inset-0 z-50 flex items-center justify-center px-4";
    const overlayStyle = isMobile ? {
        background: "var(--color-modal-overlay)",
        zIndex: 60,
        animation: !dismissing ? "detail-overlay-in 0.18s ease-out" : undefined,
        // Stay fully opaque during the drag — only fade out when the user has
        // committed to dismiss, otherwise a partial-then-snap-back swipe would
        // flicker the backdrop.
        opacity: dismissing ? 0 : 1,
        transition: "opacity 0.26s ease-out"
    } : {
        background: "var(--color-modal-overlay)"
    };
    const sheet = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: sheetWrapperClass,
        style: sheetWrapperStyle,
        onClick: (e)=>e.stopPropagation(),
        "data-edge-drawer-block": inline ? "" : undefined,
        children: [
            isMobile && !inline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onTouchStart: handleHandleTouchStart,
                onTouchMove: handleHandleTouchMove,
                onTouchEnd: handleHandleTouchEnd,
                onTouchCancel: handleHandleTouchEnd,
                style: {
                    flexShrink: 0,
                    padding: "10px 0 6px",
                    display: "flex",
                    justifyContent: "center",
                    cursor: "grab",
                    touchAction: "none"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        background: "var(--color-border)"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                    lineNumber: 489,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                lineNumber: 475,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onTouchStart: isMobile && !inline ? handleContentTouchStart : undefined,
                onTouchMove: isMobile && !inline ? handleContentTouchMove : undefined,
                onTouchEnd: isMobile && !inline ? handleContentTouchEnd : undefined,
                onTouchCancel: isMobile && !inline ? handleContentTouchEnd : undefined,
                style: isMobile && !inline ? {
                    overflowY: "auto",
                    padding: "4px 4px 4px",
                    flex: 1,
                    position: "relative",
                    overscrollBehavior: "contain"
                } : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: isEditing ? ()=>setIsEditing(false) : onClose,
                        "aria-label": "Close",
                        className: "absolute top-2.5 right-2.5 transition-colors text-base leading-none cursor-pointer flex items-center justify-center",
                        style: {
                            color: "var(--color-fg-subtle)",
                            background: "transparent",
                            border: "none",
                            width: 28,
                            height: 28,
                            padding: 0
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                        onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                        lineNumber: 502,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5 min-w-0 pr-8 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 rounded-full flex-shrink-0",
                                style: {
                                    background: priorityDot
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 522,
                                columnNumber: 11
                            }, this),
                            isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                autoFocus: !titleLocked,
                                value: editTitle,
                                disabled: titleLocked,
                                title: titleLocked ? "Title is locked 24 hours after creation." : undefined,
                                onChange: (e)=>setEditTitle(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSave();
                                    }
                                },
                                className: "flex-1 min-w-0 bg-transparent outline-none disabled:cursor-not-allowed",
                                style: {
                                    color: titleLocked ? "var(--color-fg-muted)" : "var(--color-fg)",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    border: "none",
                                    padding: 0,
                                    letterSpacing: "0.01em"
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 524,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                style: {
                                    color: titleColor,
                                    textDecoration: titleDecoration,
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    letterSpacing: "0.01em"
                                },
                                children: task.title
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 542,
                                columnNumber: 13
                            }, this),
                            !isEditing && !(task.isRecurring && task.status === "pending") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-shrink-0 text-[8px] tracking-widest uppercase",
                                style: {
                                    color: status.color,
                                    border: `1px solid color-mix(in srgb, ${status.color} 30%, transparent)`,
                                    borderRadius: "999px",
                                    padding: "2px 7px",
                                    fontWeight: 600
                                },
                                children: status.label
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 556,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                        lineNumber: 521,
                        columnNumber: 9
                    }, this),
                    isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 mt-1",
                        children: [
                            mustReschedule && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-2 px-3 py-2",
                                style: {
                                    background: "var(--color-danger-bg)",
                                    border: "1px solid var(--color-danger-border)",
                                    borderRadius: "3px",
                                    color: "var(--color-danger)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            lineHeight: 1.4,
                                            flexShrink: 0
                                        },
                                        children: "⚠"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 579,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            lineHeight: 1.4
                                        },
                                        children: task.isRecurring ? "This routine is overdue. Confirm the new due date or pick a different one to resume." : "This task is overdue. Pick a new due date after today to start it, or delete the task."
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 580,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 575,
                                columnNumber: 15
                            }, this),
                            showEditDescription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: editDescription,
                                onChange: (e)=>setEditDescription(e.target.value),
                                placeholder: "Description",
                                rows: 2,
                                className: "w-full bg-transparent outline-none resize-none",
                                style: {
                                    color: "var(--color-fg-muted)",
                                    fontSize: "12px",
                                    border: "none",
                                    padding: 0,
                                    lineHeight: 1.5
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 590,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowEditDescription(true),
                                className: "self-start cursor-pointer transition-colors",
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    background: "transparent",
                                    border: "none",
                                    padding: 0,
                                    fontSize: "11px",
                                    letterSpacing: "0.05em"
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                                onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                                children: "+ Description"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 605,
                                columnNumber: 15
                            }, this),
                            (!task.isRecurring || mustReschedule) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Due",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    value: editDueDate,
                                    onChange: setEditDueDate
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 626,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 625,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Category",
                                    className: "flex-1 min-w-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: editCategory,
                                                onChange: (e)=>setEditCategory(e.target.value),
                                                className: "w-full px-2 py-1.5 text-xs appearance-none outline-none cursor-pointer",
                                                style: {
                                                    background: "var(--color-input)",
                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][editCategory] ?? "var(--color-input-fg)",
                                                    border: `1px solid color-mix(in srgb, ${__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][editCategory] ?? "var(--color-border-hairline)"} 35%, transparent)`,
                                                    borderRadius: "3px",
                                                    fontWeight: 600
                                                },
                                                children: categoryOptions.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: c,
                                                        style: {
                                                            background: "var(--color-input)",
                                                            color: "var(--color-input-fg)",
                                                            fontWeight: 400
                                                        },
                                                        children: c
                                                    }, c, false, {
                                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                        lineNumber: 646,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 633,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]",
                                                style: {
                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][editCategory] ?? "var(--color-fg-subtle)"
                                                },
                                                children: "▾"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 649,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 632,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 631,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 630,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Priority",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-1.5",
                                    children: PRIORITIES.map((p)=>{
                                        const active = editPriority === p.value;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setEditPriority(p.value),
                                            className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                                            style: {
                                                background: active ? p.bg : "transparent",
                                                color: active ? p.color : "var(--color-fg-subtle)",
                                                border: `1px solid ${active ? p.color : "var(--color-border-hairline)"}`,
                                                borderRadius: "999px",
                                                fontWeight: active ? 600 : 400,
                                                padding: "3px 10px"
                                            },
                                            children: p.label
                                        }, p.value, false, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 659,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 655,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 654,
                                columnNumber: 13
                            }, this),
                            task.isRecurring && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                label: "Counter",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 flex-wrap",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setEditHasCounter((v)=>!v),
                                            className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                                            style: {
                                                background: editHasCounter ? "var(--color-active-highlight-bg)" : "transparent",
                                                color: editHasCounter ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                                                border: `1px solid ${editHasCounter ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                                                borderRadius: "999px",
                                                fontWeight: editHasCounter ? 600 : 400,
                                                padding: "3px 10px"
                                            },
                                            children: editHasCounter ? "On" : "Off"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 682,
                                            columnNumber: 19
                                        }, this),
                                        editHasCounter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editCounterUnit,
                                                    onChange: (e)=>setEditCounterUnit(e.target.value),
                                                    className: "px-2 py-1.5 text-xs appearance-none outline-none cursor-pointer pr-6",
                                                    style: {
                                                        background: "var(--color-input)",
                                                        color: "var(--color-input-fg)",
                                                        border: "1px solid var(--color-border-hairline)",
                                                        borderRadius: "3px"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            style: {
                                                                background: "var(--color-input)"
                                                            },
                                                            children: "(no unit)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                            lineNumber: 709,
                                                            columnNumber: 25
                                                        }, this),
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COUNTER_UNITS"].map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: u,
                                                                style: {
                                                                    background: "var(--color-input)"
                                                                },
                                                                children: u
                                                            }, u, false, {
                                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                                lineNumber: 711,
                                                                columnNumber: 27
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 698,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]",
                                                    style: {
                                                        color: "var(--color-fg-subtle)"
                                                    },
                                                    children: "▾"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 714,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 697,
                                            columnNumber: 21
                                        }, this),
                                        editHasCounter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: "var(--color-fg-subtle)",
                                                        fontSize: "10px",
                                                        letterSpacing: "0.18em",
                                                        textTransform: "uppercase"
                                                    },
                                                    children: "Goal"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 719,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$GoalStepper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    value: editCounterGoal,
                                                    onChange: setEditCounterGoal
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 722,
                                                    columnNumber: 23
                                                }, this),
                                                editCounterUnit && editCounterGoal.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: "var(--color-fg-subtle)",
                                                        fontSize: "10px"
                                                    },
                                                    children: [
                                                        editCounterUnit,
                                                        " / ",
                                                        task.recurrenceRule === "weekly" ? "wk" : task.recurrenceRule === "monthly" ? "mo" : "day"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 724,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 718,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 681,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 680,
                                columnNumber: 15
                            }, this),
                            editError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs",
                                style: {
                                    color: "var(--color-danger)"
                                },
                                children: editError
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 735,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                        lineNumber: 573,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]",
                                style: {
                                    color: "var(--color-fg-muted)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-block w-1.5 h-1.5 rounded-full",
                                                style: {
                                                    background: dot
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 745,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: dot,
                                                    fontWeight: 600,
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase"
                                                },
                                                children: task.priority
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 746,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 744,
                                        columnNumber: 15
                                    }, this),
                                    task.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][task.category] ?? "var(--color-fg)",
                                            fontWeight: 600,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase"
                                        },
                                        children: task.category
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 749,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1",
                                        style: {
                                            color: "var(--color-warning)",
                                            fontWeight: 600
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "9",
                                                height: "11",
                                                viewBox: "0 0 10 12",
                                                fill: "none",
                                                shapeRendering: "crispEdges",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z",
                                                    style: {
                                                        fill: "var(--color-warning)"
                                                    },
                                                    opacity: "0.95"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 754,
                                                columnNumber: 17
                                            }, this),
                                            task.pointValue.toLocaleString(),
                                            "p"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 753,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: "var(--color-fg)",
                                            fontWeight: 600
                                        },
                                        children: task.completedAt ? fmtFull(task.completedAt) : fmtShort(task.dueDate)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 759,
                                        columnNumber: 15
                                    }, this),
                                    task.isRecurring && task.recurrenceRule && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1",
                                        style: {
                                            color: "var(--color-active-highlight-alt)",
                                            fontWeight: 600
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "12px",
                                                    lineHeight: 1
                                                },
                                                children: "↻"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 764,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    textTransform: "lowercase"
                                                },
                                                children: task.recurrenceRule
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 765,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 763,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 743,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$StreakDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                currentStreakCount: currentStreakCount,
                                longestStreakCount: longestStreakCount
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 770,
                                columnNumber: 13
                            }, this),
                            task.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs leading-relaxed",
                                style: {
                                    color: "var(--color-fg-muted)"
                                },
                                children: task.description
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 773,
                                columnNumber: 15
                            }, this),
                            task.isRecurring && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DetailPager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                height: 236,
                                labels: task.recurrenceRule === "daily" || task.recurrenceRule === "weekdays" ? [
                                    "Stage",
                                    "Stats"
                                ] : [
                                    "Stage"
                                ],
                                cards: [
                                    {
                                        key: "stage",
                                        content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 flex flex-col items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ChibiAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    equipped: chibiEquipped,
                                                    height: 192
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 787,
                                                    columnNumber: 25
                                                }, void 0),
                                                task.hasCounter && (()=>{
                                                    // hasCounter && pending status && not yet checked in today
                                                    // is the gate for showing the +/- buttons; otherwise we
                                                    // render a read-only sum.
                                                    const checkedInToday = (task.lastCheckInDate ?? "").split("T")[0] === todayKey;
                                                    const showStepper = !!onFlushQuickLog && task.status === "pending" && !checkedInToday;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$QuickLogStepper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        cycleSum: cycleSumToday,
                                                        pendingLog: pendingLog,
                                                        showStepper: showStepper,
                                                        counterUnit: task.counterUnit,
                                                        counterGoal: task.counterGoal,
                                                        capAtGoal: task.capLogAtGoal,
                                                        onIncrement: handleStepperIncrement,
                                                        onDecrement: handleStepperDecrement
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 29
                                                    }, void 0);
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 786,
                                            columnNumber: 23
                                        }, void 0)
                                    },
                                    ...task.recurrenceRule === "daily" || task.recurrenceRule === "weekdays" ? [
                                        {
                                            key: "stats",
                                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-3",
                                                style: {
                                                    overflowY: "auto",
                                                    flex: 1
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$HeatmapStrip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    rule: task.recurrenceRule,
                                                    hasCounter: task.hasCounter ?? false,
                                                    cycles: heatmapCycles,
                                                    pendingTodayDelta: task.hasCounter ? pendingLog : 0
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 814,
                                                    columnNumber: 25
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 813,
                                                columnNumber: 23
                                            }, void 0)
                                        }
                                    ] : []
                                ]
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 779,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$SubtasksSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                task: task,
                                onChange: onSubtasksChange
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 827,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                        lineNumber: 741,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 flex-wrap mt-4",
                        children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    disabled: isSaving,
                                    className: "pixel-btn",
                                    style: {
                                        fontSize: "10px",
                                        padding: "5px 12px"
                                    },
                                    children: isSaving ? "Saving…" : mustReschedule ? task.isRecurring ? "Save & Resume" : "Save & Start" : "Save"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 835,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>mustReschedule ? onClose() : setIsEditing(false),
                                    disabled: isSaving,
                                    className: "text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40",
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        background: "transparent",
                                        border: "1px solid var(--color-border-hairline)",
                                        borderRadius: "999px",
                                        padding: "5px 12px"
                                    },
                                    onMouseEnter: (e)=>{
                                        if (!isSaving) e.currentTarget.style.background = "var(--color-overlay-hover)";
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.background = "transparent";
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 843,
                                    columnNumber: 15
                                }, this),
                                mustReschedule && onDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleDeleteClick,
                                    disabled: isSaving,
                                    className: "ml-auto flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40",
                                    style: {
                                        color: "var(--color-danger)",
                                        background: "transparent",
                                        border: "1px solid var(--color-danger-border)",
                                        borderRadius: "999px",
                                        padding: "5px 12px"
                                    },
                                    onMouseEnter: (e)=>{
                                        if (!isSaving) e.currentTarget.style.background = "var(--color-danger-bg)";
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.background = "transparent";
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "8",
                                            height: "8",
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
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 875,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 876,
                                                    columnNumber: 21
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
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 877,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 874,
                                            columnNumber: 19
                                        }, this),
                                        "Delete"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 860,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                task.status === "pending" && !task.isRecurring && onStart && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                    onClick: onStart,
                                    disabled: isActing,
                                    color: "var(--color-active-highlight)",
                                    hoverBg: "var(--color-active-highlight-bg)",
                                    label: "Start",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
                                        viewBox: "0 0 10 10",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                            points: "2,1 9,5 2,9",
                                            style: {
                                                fill: "var(--color-active-highlight)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 894,
                                            columnNumber: 23
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 893,
                                        columnNumber: 21
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 886,
                                    columnNumber: 17
                                }, this),
                                task.status === "pending" && task.isRecurring && onCheckIn && !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                    onClick: ()=>{
                                        onCheckIn();
                                        onClose();
                                    },
                                    disabled: isActing,
                                    color: "var(--color-active-highlight-alt)",
                                    hoverBg: "var(--color-active-highlight-alt-bg)",
                                    label: "Check In",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
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
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 909,
                                            columnNumber: 23
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 908,
                                        columnNumber: 21
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 901,
                                    columnNumber: 17
                                }, this),
                                checkInBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 px-2.5",
                                    style: {
                                        border: "1px solid var(--color-warning-border)",
                                        borderRadius: "999px",
                                        background: "var(--color-warning-bg)",
                                        padding: "5px 10px"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "8",
                                            height: "9",
                                            viewBox: "0 0 10 12",
                                            fill: "none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "2",
                                                    y: "5",
                                                    width: "6",
                                                    height: "6",
                                                    rx: "0.8",
                                                    stroke: "var(--color-warning)",
                                                    strokeWidth: "1.2",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 918,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M3.5 5V3.5a1.5 1.5 0 0 1 3 0V5",
                                                    stroke: "var(--color-warning)",
                                                    strokeWidth: "1.2",
                                                    strokeLinecap: "round",
                                                    fill: "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                    lineNumber: 919,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 917,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "var(--color-warning)",
                                                fontSize: "9px",
                                                letterSpacing: "0.15em",
                                                textTransform: "uppercase"
                                            },
                                            children: fmtShort(task.dueDate)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 921,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 916,
                                    columnNumber: 17
                                }, this),
                                task.status === "in_progress" && onPause && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                    onClick: onPause,
                                    disabled: isActing,
                                    color: "var(--color-warning)",
                                    hoverBg: "var(--color-warning-bg)",
                                    label: "Pause",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
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
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 936,
                                                columnNumber: 23
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "5.5",
                                                y: "1",
                                                width: "3",
                                                height: "8",
                                                style: {
                                                    fill: "var(--color-warning)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 937,
                                                columnNumber: 23
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 935,
                                        columnNumber: 21
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 928,
                                    columnNumber: 17
                                }, this),
                                task.status === "in_progress" && onComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                    onClick: onComplete,
                                    disabled: isActing,
                                    color: "var(--color-success)",
                                    hoverBg: "var(--color-success-bg)",
                                    label: "Complete",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
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
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 952,
                                            columnNumber: 23
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 951,
                                        columnNumber: 21
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 944,
                                    columnNumber: 17
                                }, this),
                                canUndo && onUndo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                    onClick: onUndo,
                                    disabled: isActing,
                                    color: "var(--color-warning)",
                                    hoverBg: "var(--color-warning-bg)",
                                    label: "Undo",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "10",
                                        height: "10",
                                        viewBox: "0 0 10 10",
                                        fill: "none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "4,2 2,4 4,6",
                                                style: {
                                                    stroke: "var(--color-warning)"
                                                },
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                fill: "none"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 967,
                                                columnNumber: 23
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M2 4H6.5A2.5 2.5 0 0 1 6.5 9H4",
                                                style: {
                                                    stroke: "var(--color-warning)"
                                                },
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                fill: "none"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 968,
                                                columnNumber: 23
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 966,
                                        columnNumber: 21
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 959,
                                    columnNumber: 17
                                }, this),
                                onSave && task.status !== "completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                    onClick: startEdit,
                                    disabled: isActing,
                                    color: "var(--color-fg-muted)",
                                    hoverBg: "var(--color-overlay-hover)",
                                    label: "Edit",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
                                        viewBox: "0 0 10 10",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M7 1.5L8.5 3 3.5 8H2V6.5L7 1.5Z",
                                            style: {
                                                stroke: "var(--color-fg-muted)"
                                            },
                                            strokeWidth: "1.2",
                                            strokeLinejoin: "round",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                            lineNumber: 983,
                                            columnNumber: 23
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 982,
                                        columnNumber: 21
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 975,
                                    columnNumber: 17
                                }, this),
                                onDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                    onClick: handleDeleteClick,
                                    disabled: isActing,
                                    color: "var(--color-danger)",
                                    hoverBg: "var(--color-danger-bg)",
                                    label: "Delete",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "8",
                                        height: "8",
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
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 998,
                                                columnNumber: 23
                                            }, void 0),
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
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 999,
                                                columnNumber: 23
                                            }, void 0),
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
                                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                                lineNumber: 1000,
                                                columnNumber: 23
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 997,
                                        columnNumber: 21
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                    lineNumber: 990,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                        lineNumber: 832,
                        columnNumber: 9
                    }, this),
                    !isEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mt-3 pt-2 gap-3",
                        style: {
                            borderTop: "1px solid var(--color-border-hairline)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-2",
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    opacity: 0.6,
                                    fontSize: "9px",
                                    letterSpacing: "0.1em"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "monospace",
                                            letterSpacing: "0.15em"
                                        },
                                        children: task.taskId.slice(0, 8).toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 1013,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.5
                                        },
                                        children: "·"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 1014,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            textTransform: "uppercase"
                                        },
                                        children: [
                                            "created ",
                                            fmtLocalDate(task.createdAt)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                        lineNumber: 1015,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 1012,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: task.submitted ? "var(--color-warning)" : "var(--color-fg-subtle)",
                                    opacity: task.submitted ? 0.85 : 0.6,
                                    fontSize: "9px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    fontWeight: task.submitted ? 600 : 400
                                },
                                children: task.submitted ? "Banked" : "Unbanked"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                                lineNumber: 1017,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                        lineNumber: 1011,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                lineNumber: 492,
                columnNumber: 9
            }, this),
            isMobile && !inline && !isEditing && task.status === "pending" && task.isRecurring && onCheckIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flexShrink: 0,
                    paddingTop: 12,
                    marginTop: 6,
                    borderTop: "1px solid var(--color-border-hairline)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$SlideToCheckIn$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    label: "Slide to check in",
                    disabled: isActing,
                    onConfirm: ()=>{
                        onCheckIn();
                        onClose();
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                    lineNumber: 1045,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                lineNumber: 1037,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
        lineNumber: 468,
        columnNumber: 5
    }, this);
    // Inline mode (desktop right-panel) skips the overlay + portal and renders
    // just the sheet content sized to fill its container.
    if (inline) return sheet;
    const tree = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-edge-drawer-block": true,
        className: overlayClass,
        style: overlayStyle,
        onClick: isEditing ? undefined : onClose,
        children: sheet
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
        lineNumber: 1060,
        columnNumber: 5
    }, this);
    // Mobile sheet renders into <body> so it sits above page-level layout.
    return isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(tree, document.body) : tree;
}
function Field({ label, children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-1 ${className ?? ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[8px] tracking-widest uppercase",
                style: {
                    color: "var(--color-fg-subtle)"
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
                lineNumber: 1077,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/TaskDetailModal.tsx",
        lineNumber: 1076,
        columnNumber: 5
    }, this);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$categoryIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/categoryIcons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$BankBurstEffect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/BankBurstEffect.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CheckInBurstEffect$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/CheckInBurstEffect.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TierUpBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/TierUpBanner.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$tiers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/tiers.ts [app-ssr] (ecmascript)");
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
    const dot = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIORITY_DOT"][task.priority.toLowerCase()] ?? "var(--color-fg-muted)";
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
                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][task.category] ?? "var(--color-fg-muted)"
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
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][task.category] ?? "var(--color-fg-muted)"
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
                                                        const cc = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][task.category] ?? "var(--color-fg-muted)";
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
                                                                    const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$tiers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["currentStreakTier"])(streakCount);
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
"[project]/apps/web/src/components/SubmitBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubmitBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
const transition = "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease-out";
const CoinIcon = ({ size = 11 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size * 9 / 11,
        height: size,
        viewBox: "0 0 10 12",
        fill: "none",
        shapeRendering: "crispEdges",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z",
                style: {
                    fill: "var(--color-warning)"
                },
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                lineNumber: 20,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "4",
                y: "5",
                width: "2",
                height: "2",
                style: {
                    fill: "var(--color-bg)"
                },
                opacity: "0.45"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
function SubmitBar({ visible, selectedCount, selectedPts, willAward, remaining, recurringRemaining, isSubmitting, limitReached, capped, onSubmit }) {
    const buttonLabel = isSubmitting ? "Submitting…" : limitReached ? "Limit Reached" : `File ${selectedCount} task${selectedCount !== 1 ? "s" : ""} ▶`;
    const mobileButtonLabel = isSubmitting ? "…" : limitReached ? "Limit" : `File ${willAward}p ▶`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden sm:block submit-bar-desktop",
                style: {
                    position: "fixed",
                    bottom: 0,
                    zIndex: 50,
                    transform: visible ? "translateY(0)" : "translateY(100%)",
                    opacity: visible ? 1 : 0,
                    transition,
                    pointerEvents: visible ? "auto" : "none",
                    background: "var(--color-surface)",
                    borderTop: "1px solid var(--color-warning-border)",
                    // Top shadow only — the box-shadow blur (originally 32px) bled
                    // to the right past the bar's edge and onto the detail panel
                    // underneath. clip-path inset(top right bottom left) with
                    // negative top lets the shadow expand upward by 16px while
                    // clipping the other three sides flush with the bar. Blur and
                    // opacity also dialed down for a less heavy drop.
                    boxShadow: "0 -3px 14px rgba(0, 0, 0, 0.28)",
                    clipPath: "inset(-16px 0 0 0)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        fontSize: "9px",
                                        letterSpacing: "0.2em",
                                        textTransform: "uppercase"
                                    },
                                    children: "Pending Submission"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CoinIcon, {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "var(--color-warning)",
                                                fontSize: "13px",
                                                fontWeight: 600
                                            },
                                            children: [
                                                selectedCount,
                                                " task",
                                                selectedCount !== 1 ? "s" : "",
                                                " · ",
                                                selectedPts.toLocaleString(),
                                                " pts selected"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                limitReached ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "var(--color-danger)",
                                        fontSize: "10px",
                                        letterSpacing: "0.05em"
                                    },
                                    children: "Regular limit reached (150 pts/day)"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, this) : capped ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "var(--color-danger)",
                                        opacity: 0.85,
                                        fontSize: "10px",
                                        letterSpacing: "0.05em"
                                    },
                                    children: [
                                        (selectedPts - willAward).toLocaleString(),
                                        " pts will be lost · only ",
                                        remaining,
                                        " regular remaining today"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                    lineNumber: 87,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        fontSize: "10px",
                                        letterSpacing: "0.05em"
                                    },
                                    children: [
                                        "Regular: ",
                                        remaining,
                                        " pts left · Routines: ",
                                        recurringRemaining,
                                        " pts left"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSubmit,
                            disabled: isSubmitting || limitReached,
                            className: "flex-shrink-0 text-[10px] tracking-widest uppercase px-4 py-2.5 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed submit-btn",
                            style: {
                                color: "var(--color-warning)",
                                border: "1px solid var(--color-warning-border)",
                                background: "var(--color-warning-bg)"
                            },
                            onMouseEnter: (e)=>{
                                if (!isSubmitting && !limitReached) e.currentTarget.style.background = "color-mix(in srgb, var(--color-warning) 18%, transparent)";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = "var(--color-warning-bg)";
                            },
                            children: buttonLabel
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sm:hidden flex items-center gap-2 px-3 pb-px",
                style: {
                    position: "fixed",
                    bottom: "env(safe-area-inset-bottom, 0px)",
                    left: 0,
                    right: 0,
                    height: "50px",
                    zIndex: 35,
                    transform: visible ? "translateY(0)" : "translateY(calc(100% + 8px))",
                    opacity: visible ? 1 : 0,
                    transition,
                    pointerEvents: visible ? "auto" : "none",
                    background: "var(--color-surface)",
                    borderTop: "1px solid var(--color-warning-border)",
                    boxShadow: "0 -2px 12px rgba(0,0,0,0.08)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CoinIcon, {
                                size: 11
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                style: {
                                    color: "var(--color-warning)",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    letterSpacing: "0.02em"
                                },
                                children: [
                                    selectedCount,
                                    " · ",
                                    selectedPts.toLocaleString(),
                                    "p"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            limitReached ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                style: {
                                    color: "var(--color-danger)",
                                    fontSize: "9px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase"
                                },
                                children: "Limit"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this) : capped ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                style: {
                                    color: "var(--color-danger)",
                                    fontSize: "9px",
                                    letterSpacing: "0.05em"
                                },
                                children: [
                                    "−",
                                    (selectedPts - willAward).toLocaleString(),
                                    "p"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onSubmit,
                        disabled: isSubmitting || limitReached,
                        className: "submit-btn flex-shrink-0 text-[10px] tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                        style: {
                            color: "var(--color-warning)",
                            border: "1px solid var(--color-warning-border)",
                            background: "var(--color-warning-bg)",
                            borderRadius: "2px",
                            padding: "6px 10px",
                            height: 30
                        },
                        children: mobileButtonLabel
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SubmitBar.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/web/src/components/CapWarningModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CapWarningModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function CapWarningModal({ selectedPts, willAward, remaining, onClose, onConfirm }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-edge-drawer-block": true,
        className: "fixed inset-0 z-[60] flex items-center justify-center px-4",
        style: {
            background: "rgba(0,0,0,0.65)"
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm p-6 flex flex-col gap-4",
            style: {
                background: "var(--color-surface)",
                border: "1px solid rgba(239,68,68,0.45)",
                borderRadius: "4px",
                boxShadow: "var(--shadow-popover)"
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "18",
                            height: "18",
                            viewBox: "0 0 20 20",
                            fill: "none",
                            className: "flex-shrink-0 mt-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M10 2L18 17H2L10 2Z",
                                    style: {
                                        stroke: "var(--color-danger)"
                                    },
                                    strokeWidth: "1.5",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "10",
                                    y1: "8",
                                    x2: "10",
                                    y2: "12",
                                    style: {
                                        stroke: "var(--color-danger)"
                                    },
                                    strokeWidth: "1.5",
                                    strokeLinecap: "round"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "10",
                                    cy: "14.5",
                                    r: "0.75",
                                    style: {
                                        fill: "var(--color-danger)"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold tracking-wide",
                                    style: {
                                        color: "var(--color-danger)"
                                    },
                                    children: "Daily Cap Exceeded"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs leading-relaxed",
                                    style: {
                                        color: "var(--color-fg-muted)"
                                    },
                                    children: [
                                        "You're submitting ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "var(--color-fg)",
                                                fontWeight: 600
                                            },
                                            children: [
                                                selectedPts.toLocaleString(),
                                                " pts"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                            lineNumber: 33,
                                            columnNumber: 38
                                        }, this),
                                        " but only",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "var(--color-fg)",
                                                fontWeight: 600
                                            },
                                            children: [
                                                remaining,
                                                " pts"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                            lineNumber: 34,
                                            columnNumber: 15
                                        }, this),
                                        " of your 150 pt regular daily limit remain."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                    lineNumber: 32,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold",
                                    style: {
                                        color: "var(--color-danger)"
                                    },
                                    children: [
                                        (selectedPts - willAward).toLocaleString(),
                                        " pts will be lost."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 justify-end",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors",
                            style: {
                                color: "var(--color-fg-muted)",
                                background: "transparent",
                                border: "1px solid var(--color-border)",
                                borderRadius: "3px"
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.borderColor = "var(--color-button-border)";
                                e.currentTarget.style.color = "var(--color-fg)";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.borderColor = "var(--color-border)";
                                e.currentTarget.style.color = "var(--color-fg-muted)";
                            },
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onClose();
                                onConfirm();
                            },
                            className: "px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors",
                            style: {
                                color: "var(--color-danger)",
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.45)",
                                borderRadius: "3px"
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = "rgba(239,68,68,0.18)";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                            },
                            children: [
                                "Submit anyway (",
                                willAward,
                                " pts)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/CapWarningModal.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/TaskListControls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskListControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const SORT_OPTIONS = [
    [
        "due",
        "Due Date"
    ],
    [
        "priority",
        "Priority"
    ],
    [
        "title",
        "Title"
    ],
    [
        "points",
        "Points"
    ]
];
const GROUP_OPTIONS = [
    [
        "none",
        "None"
    ],
    [
        "due",
        "Due Date"
    ],
    [
        "category",
        "Category"
    ]
];
const sortLabel = (m)=>m === "due" ? "Sort" : m === "priority" ? "Priority" : m === "title" ? "Title" : "Points";
const groupLabel = (m)=>m === "due" ? "Due Date" : m === "category" ? "Category" : "Group";
function TaskListControls({ sortMode, groupMode, onSortChange, onGroupChange, openAbove = false }) {
    const [showSort, setShowSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showGroup, setShowGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-px mr-1",
                children: [
                    showSort && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[15]",
                        onClick: ()=>setShowSort(false)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                        lineNumber: 39,
                        columnNumber: 22
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setShowGroup(false);
                            setShowSort((v)=>!v);
                        },
                        className: "text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5",
                        style: {
                            color: sortMode !== "due" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                            background: sortMode !== "due" ? "var(--color-active-highlight-bg)" : "transparent",
                            border: `1px solid ${sortMode !== "due" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                            borderRadius: "2px",
                            position: "relative",
                            zIndex: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "10",
                                height: "10",
                                viewBox: "0 0 10 10",
                                fill: "none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "1",
                                        y1: "2",
                                        x2: "9",
                                        y2: "2",
                                        stroke: "currentColor",
                                        strokeWidth: "1.2",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                        lineNumber: 53,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "1",
                                        y1: "5",
                                        x2: "7",
                                        y2: "5",
                                        stroke: "currentColor",
                                        strokeWidth: "1.2",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "1",
                                        y1: "8",
                                        x2: "5",
                                        y2: "8",
                                        stroke: "currentColor",
                                        strokeWidth: "1.2",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                        lineNumber: 55,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: sortLabel(sortMode)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "7",
                                height: "5",
                                viewBox: "0 0 7 5",
                                fill: "none",
                                style: {
                                    opacity: 0.6
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: "0.5,1 3.5,4 6.5,1",
                                    stroke: "currentColor",
                                    strokeWidth: "1.2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    showSort && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Menu, {
                        openAbove: openAbove,
                        children: SORT_OPTIONS.map(([value, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuItem, {
                                active: sortMode === value,
                                onClick: ()=>{
                                    onSortChange(value);
                                    setShowSort(false);
                                },
                                label: label
                            }, value, false, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 65,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-px mr-0.5",
                children: [
                    showGroup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[15]",
                        onClick: ()=>setShowGroup(false)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                        lineNumber: 76,
                        columnNumber: 23
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setShowSort(false);
                            setShowGroup((v)=>!v);
                        },
                        className: "text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5",
                        style: {
                            color: groupMode !== "none" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                            background: groupMode !== "none" ? "var(--color-active-highlight-bg)" : "transparent",
                            border: `1px solid ${groupMode !== "none" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                            borderRadius: "2px",
                            position: "relative",
                            zIndex: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "10",
                                height: "10",
                                viewBox: "0 0 10 10",
                                fill: "none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "1",
                                        y1: "2",
                                        x2: "9",
                                        y2: "2",
                                        stroke: "currentColor",
                                        strokeWidth: "1.2",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "1",
                                        y1: "5",
                                        x2: "6",
                                        y2: "5",
                                        stroke: "currentColor",
                                        strokeWidth: "1.2",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "1",
                                        y1: "8",
                                        x2: "7.5",
                                        y2: "8",
                                        stroke: "currentColor",
                                        strokeWidth: "1.2",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: groupLabel(groupMode)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "7",
                                height: "5",
                                viewBox: "0 0 7 5",
                                fill: "none",
                                style: {
                                    opacity: 0.6
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: "0.5,1 3.5,4 6.5,1",
                                    stroke: "currentColor",
                                    strokeWidth: "1.2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    showGroup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Menu, {
                        openAbove: openAbove,
                        children: GROUP_OPTIONS.map(([value, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuItem, {
                                active: groupMode === value,
                                onClick: ()=>{
                                    onGroupChange(value);
                                    setShowGroup(false);
                                },
                                label: label
                            }, value, false, {
                                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function Menu({ children, openAbove }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            ...openAbove ? {
                bottom: "calc(100% + 4px)"
            } : {
                top: "calc(100% + 4px)"
            },
            right: 0,
            zIndex: 20,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "3px",
            boxShadow: "var(--shadow-popover)",
            minWidth: "120px",
            overflow: "hidden"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
function MenuItem({ active, onClick, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "w-full flex items-center gap-2 cursor-pointer",
        style: {
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textAlign: "left"
        },
        onMouseEnter: (e)=>e.currentTarget.style.background = "var(--color-overlay-hover)",
        onMouseLeave: (e)=>e.currentTarget.style.background = "transparent",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: active ? "var(--color-active-highlight)" : "var(--color-border-faint)",
                    display: "inline-block"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/TaskListControls.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/CategoryCapsTooltip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryCapsTooltip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function CategoryCapsTooltip({ variant, children }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    // Portal-mount the tooltip to escape any overflow:hidden ancestor (e.g. the
    // desktop main column). Position it below + right-aligned to the trigger.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open || !triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        setPos({
            top: r.bottom + 8,
            right: window.innerWidth - r.right
        });
    }, [
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: triggerRef,
        style: {
            position: "relative",
            display: "inline-flex"
        },
        onMouseEnter: ()=>setOpen(true),
        onMouseLeave: ()=>setOpen(false),
        onFocus: ()=>setOpen(true),
        onBlur: ()=>setOpen(false),
        children: [
            children,
            open && mounted && pos && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "tooltip",
                style: {
                    position: "fixed",
                    top: pos.top,
                    right: pos.right,
                    zIndex: 60,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    boxShadow: "var(--shadow-popover)",
                    padding: "10px 12px",
                    minWidth: 220,
                    pointerEvents: "none"
                },
                children: variant === "regular" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RegularCapsContent, {}, void 0, false, {
                    fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                    lineNumber: 66,
                    columnNumber: 36
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RecurringCapsContent, {}, void 0, false, {
                    fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                    lineNumber: 66,
                    columnNumber: 61
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
function SectionHeader({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-fg-subtle)",
            marginBottom: 6
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
function Row({ left, right, leftColor }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "2px 0",
            fontSize: 10
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: leftColor ?? "var(--color-fg-muted)"
                },
                children: left
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "var(--color-fg)",
                    fontWeight: 600
                },
                children: right
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
function Divider() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 1,
            background: "var(--color-border-hairline)",
            margin: "8px 0"
        }
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
        lineNumber: 109,
        columnNumber: 10
    }, this);
}
function RegularCapsContent() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                children: "Per-task max"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                    left: c,
                    leftColor: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][c],
                    right: `${__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PER_TASK_VALUE_CAP"][c]} pts`
                }, c, false, {
                    fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Divider, {}, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                left: "Per category / day",
                right: `${__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PER_CATEGORY_REGULAR_DAILY_CAP"]} pts`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                left: "Total / day",
                right: `${__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"]} pts`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function RecurringCapsContent() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                children: "Routine caps"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                left: "Per check-in",
                right: "1–5 pts"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Divider, {}, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                left: "Per category / day",
                right: `${__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PER_CATEGORY_RECURRING_DAILY_CAP"]} pts`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                left: "Total routines / day",
                right: `${__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"]} pts`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CategoryCapsTooltip.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/web/src/components/TaskPageHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CategoryCapsTooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/CategoryCapsTooltip.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function TaskPageHeader({ capsVariant, filterLabel, activeCategory, controls, newTaskLabel, isAuthenticated, onNewTask }) {
    const capsLabel = capsVariant === "recurring" ? "Show routine point caps" : "Show task point caps";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between px-6 pt-4 pb-3",
        style: {
            borderBottom: "1px solid var(--color-border-soft)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CategoryCapsTooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        variant: capsVariant,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            tabIndex: 0,
                            "aria-label": capsLabel,
                            className: "flex items-center justify-center",
                            style: {
                                width: 26,
                                height: 26,
                                color: "var(--color-fg-muted)",
                                cursor: "help"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "13",
                                height: "13",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "3",
                                        y: "4",
                                        width: "18",
                                        height: "18",
                                        rx: "2"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M16 2v4M8 2v4M3 10h18"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                                        lineNumber: 43,
                                        columnNumber: 65
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M9 16l2 2 4-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                                        lineNumber: 43,
                                        columnNumber: 99
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 11,
                            color: "var(--color-fg)",
                            fontWeight: 600,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase"
                        },
                        children: filterLabel
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    activeCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "var(--color-fg-subtle)",
                                    fontSize: 10
                                },
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: "var(--color-fg-muted)",
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase"
                                },
                                children: activeCategory
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5",
                children: [
                    controls,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>isAuthenticated && onNewTask(),
                        disabled: !isAuthenticated,
                        title: !isAuthenticated ? "Sign in to create tasks" : newTaskLabel,
                        "aria-label": newTaskLabel,
                        className: "flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ml-1",
                        style: {
                            width: 28,
                            height: 28,
                            fontSize: 18,
                            lineHeight: 1,
                            background: "transparent",
                            border: "none",
                            color: "var(--color-fg)"
                        },
                        children: "+"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/TaskPageHeader.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/DemoModeBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DemoModeBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
;
;
function DemoModeBanner({ className = "mt-3 mb-3" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center justify-between px-3 py-2 text-[10px] tracking-widest uppercase ${className}`,
        style: {
            background: "var(--color-active-highlight-bg)",
            border: "1px solid var(--color-active-highlight-border)",
            borderRadius: 3
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "var(--color-active-highlight)",
                    opacity: 0.85
                },
                children: "Demo · changes are not saved"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/DemoModeBanner.tsx",
                lineNumber: 21,
                columnNumber: 7
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
                fileName: "[project]/apps/web/src/components/DemoModeBanner.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/DemoModeBanner.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/NewTaskModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewTaskModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DatePicker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$GoalStepper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/GoalStepper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const REPEAT_OPTIONS = [
    {
        label: "Once",
        value: "once",
        rule: null
    },
    {
        label: "Daily",
        value: "daily",
        rule: "daily"
    },
    {
        label: "Wkdys",
        value: "weekdays",
        rule: "weekdays"
    },
    {
        label: "Weekly",
        value: "weekly",
        rule: "weekly"
    },
    {
        label: "Biweek",
        value: "biweekly",
        rule: "biweekly"
    },
    {
        label: "Monthly",
        value: "monthly",
        rule: "monthly"
    }
];
const PRIORITIES = [
    {
        label: "Low",
        value: "low",
        color: "var(--color-success)",
        bg: "var(--color-success-bg)"
    },
    {
        label: "Medium",
        value: "medium",
        color: "var(--color-warning)",
        bg: "var(--color-warning-bg)"
    },
    {
        label: "High",
        value: "high",
        color: "var(--color-danger)",
        bg: "var(--color-danger-bg)"
    }
];
function NewTaskModal({ onClose, onCreated, initialRecurring = false }) {
    const today = new Date();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showDescription, setShowDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDetails, setShowDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialRecurring);
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"][0]);
    const [priority, setPriority] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("medium");
    const [pointValue, setPointValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialRecurring ? 1 : 25);
    const [dueDate, setDueDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialRecurring ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : null);
    const [isRecurring, setIsRecurring] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialRecurring);
    const [recurrenceRule, setRecurrenceRule] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("daily");
    const [hasCounter, setHasCounter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [counterUnit, setCounterUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [counterGoal, setCounterGoal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [capLogAtGoal, setCapLogAtGoal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isRecurring && hasCounter) setHasCounter(false);
    }, [
        isRecurring,
        hasCounter
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isRecurring) {
            setPointValue(1);
            if (!dueDate) setDueDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        }
    }, [
        isRecurring
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isRecurring) return;
        const cap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["maxPointsFor"])(category);
        if (pointValue > cap) setPointValue(cap);
    }, [
        category,
        isRecurring
    ]);
    async function handleSubmit() {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (dueDate && dueDate < todayMidnight) {
            setError("Due date cannot be in the past.");
            return;
        }
        setSubmitting(true);
        setError(null);
        const fmt = (d)=>`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const dto = {
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            priority,
            pointValue,
            dueDate: dueDate ? fmt(dueDate) : undefined,
            isRecurring,
            recurrenceRule: isRecurring ? recurrenceRule : undefined,
            hasCounter: isRecurring ? hasCounter : false,
            counterUnit: isRecurring && hasCounter && counterUnit ? counterUnit : null,
            counterGoal: isRecurring && hasCounter && counterGoal.trim() && Number(counterGoal) > 0 ? Number(counterGoal) : null,
            capLogAtGoal: isRecurring && hasCounter && capLogAtGoal && counterGoal.trim() && Number(counterGoal) > 0 ? true : false
        };
        const { data, error: apiError } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tasksApi"].create(dto);
        setSubmitting(false);
        if (apiError) {
            setError(apiError);
            return;
        }
        onCreated(data);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-edge-drawer-block": true,
        className: "fixed inset-0 z-50 flex items-center justify-center px-4",
        style: {
            background: "var(--color-modal-overlay)"
        },
        onClick: (e)=>{
            if (e.target === e.currentTarget) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `w-full max-w-sm relative${isRecurring ? " recurring-scope" : ""}`,
            style: {
                background: "var(--color-panel)",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                boxShadow: "var(--shadow-popover)",
                padding: "20px 20px 16px"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    "aria-label": "Close",
                    className: "absolute top-2.5 right-2.5 transition-colors text-base leading-none cursor-pointer flex items-center justify-center",
                    style: {
                        color: "var(--color-fg-subtle)",
                        background: "transparent",
                        border: "none",
                        width: 28,
                        height: 28,
                        padding: 0
                    },
                    onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                    onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    autoFocus: true,
                    value: title,
                    onChange: (e)=>setTitle(e.target.value),
                    onKeyDown: (e)=>{
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmit();
                        }
                    },
                    placeholder: "What needs to be done?",
                    className: "w-full bg-transparent outline-none mb-2 pr-8",
                    style: {
                        color: "var(--color-fg)",
                        fontSize: "16px",
                        fontWeight: 600,
                        border: "none",
                        padding: 0,
                        letterSpacing: "0.01em"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this),
                showDescription || description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    autoFocus: !description,
                    value: description,
                    onChange: (e)=>setDescription(e.target.value),
                    placeholder: "Description",
                    rows: 2,
                    className: "w-full bg-transparent outline-none resize-none mb-3",
                    style: {
                        color: "var(--color-fg-muted)",
                        fontSize: "12px",
                        border: "none",
                        padding: 0,
                        lineHeight: 1.5
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 156,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowDescription(true),
                    className: "cursor-pointer transition-colors mb-3",
                    style: {
                        color: "var(--color-fg-subtle)",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        fontSize: "11px",
                        letterSpacing: "0.05em"
                    },
                    onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                    onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                    children: "+ Description"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 172,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1.5 mb-2",
                    children: PRIORITIES.map((p)=>{
                        const active = priority === p.value;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setPriority(p.value),
                            className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                            style: {
                                background: active ? p.bg : "transparent",
                                color: active ? p.color : "var(--color-fg-subtle)",
                                border: `1px solid ${active ? p.color : "var(--color-border-hairline)"}`,
                                borderRadius: "999px",
                                fontWeight: active ? 600 : 400,
                                padding: "3px 10px"
                            },
                            children: p.label
                        }, p.value, false, {
                            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                            lineNumber: 195,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 191,
                    columnNumber: 9
                }, this),
                !showDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowDetails(true),
                    className: "cursor-pointer transition-colors mb-3",
                    style: {
                        color: "var(--color-fg-subtle)",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        fontSize: "11px",
                        letterSpacing: "0.05em"
                    },
                    onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                    onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                    children: "More details ▾"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 216,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3 mb-3 mt-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[8px] tracking-widest uppercase",
                                    style: {
                                        color: "var(--color-fg-subtle)"
                                    },
                                    children: isRecurring ? "First Due" : "Due"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                    lineNumber: 235,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DatePicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    value: dueDate,
                                    onChange: setDueDate
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                    lineNumber: 238,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                            lineNumber: 234,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Category",
                                    className: "flex-1 min-w-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CompactSelect, {
                                        value: category,
                                        onChange: setCategory,
                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"].map((c)=>({
                                                value: c,
                                                label: c
                                            }))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                        lineNumber: 243,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                    lineNumber: 242,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Points",
                                    className: "w-20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CompactSelect, {
                                        value: String(pointValue),
                                        onChange: (v)=>setPointValue(Number(v)),
                                        options: (isRecurring ? [
                                            1,
                                            2,
                                            3,
                                            4,
                                            5
                                        ] : [
                                            5,
                                            10,
                                            15,
                                            20,
                                            25
                                        ].filter((v)=>v <= (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["maxPointsFor"])(category))).map((v)=>({
                                                value: String(v),
                                                label: String(v)
                                            })),
                                        highlight: true
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                            lineNumber: 241,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                            label: "Repeat",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-1",
                                children: REPEAT_OPTIONS.map((opt)=>{
                                    const active = opt.rule === null ? !isRecurring : isRecurring && recurrenceRule === opt.rule;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            if (opt.rule === null) {
                                                setIsRecurring(false);
                                            } else {
                                                setIsRecurring(true);
                                                setRecurrenceRule(opt.rule);
                                            }
                                        },
                                        className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                                        style: {
                                            background: active ? "var(--color-active-highlight-bg)" : "transparent",
                                            color: active ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                                            border: `1px solid ${active ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                                            borderRadius: "999px",
                                            fontWeight: active ? 600 : 400,
                                            padding: "3px 10px"
                                        },
                                        children: opt.label
                                    }, opt.value, false, {
                                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                        lineNumber: 267,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                lineNumber: 263,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                            lineNumber: 262,
                            columnNumber: 13
                        }, this),
                        isRecurring && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                            label: "Counter",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setHasCounter((v)=>!v),
                                        className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                                        style: {
                                            background: hasCounter ? "var(--color-active-highlight-bg)" : "transparent",
                                            color: hasCounter ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                                            border: `1px solid ${hasCounter ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                                            borderRadius: "999px",
                                            fontWeight: hasCounter ? 600 : 400,
                                            padding: "3px 10px"
                                        },
                                        children: hasCounter ? "On" : "Off"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                        lineNumber: 297,
                                        columnNumber: 19
                                    }, this),
                                    hasCounter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CompactSelect, {
                                        value: counterUnit,
                                        onChange: setCounterUnit,
                                        options: [
                                            {
                                                value: "",
                                                label: "(no unit)"
                                            },
                                            ...__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COUNTER_UNITS"].map((u)=>({
                                                    value: u,
                                                    label: u
                                                }))
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                        lineNumber: 312,
                                        columnNumber: 21
                                    }, this),
                                    hasCounter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "var(--color-fg-subtle)",
                                                    fontSize: "10px",
                                                    letterSpacing: "0.18em",
                                                    textTransform: "uppercase"
                                                },
                                                children: "Goal"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                                lineNumber: 320,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$GoalStepper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                value: counterGoal,
                                                onChange: setCounterGoal
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                                lineNumber: 323,
                                                columnNumber: 23
                                            }, this),
                                            counterUnit && counterGoal.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "var(--color-fg-subtle)",
                                                    fontSize: "10px"
                                                },
                                                children: [
                                                    counterUnit,
                                                    " / ",
                                                    isRecurring && recurrenceRule === "weekly" ? "wk" : isRecurring && recurrenceRule === "monthly" ? "mo" : "day"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                                lineNumber: 325,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                        lineNumber: 319,
                                        columnNumber: 21
                                    }, this),
                                    hasCounter && counterGoal.trim() && Number(counterGoal) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCapLogAtGoal((v)=>!v),
                                        title: "Refuse logs that would push the day's total past the goal",
                                        className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                                        style: {
                                            background: capLogAtGoal ? "var(--color-active-highlight-bg)" : "transparent",
                                            color: capLogAtGoal ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                                            border: `1px solid ${capLogAtGoal ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                                            borderRadius: "999px",
                                            fontWeight: capLogAtGoal ? 600 : 400,
                                            padding: "3px 10px"
                                        },
                                        children: "Cap at goal"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                        lineNumber: 332,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                                lineNumber: 296,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                            lineNumber: 295,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 233,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs mb-3",
                    style: {
                        color: "var(--color-danger)"
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 355,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end items-center gap-3 mt-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                            style: {
                                color: "var(--color-fg-subtle)",
                                background: "transparent",
                                border: "none",
                                padding: "4px 8px"
                            },
                            onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                            onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: submitting || !title.trim(),
                            className: "pixel-btn",
                            style: {
                                fontSize: "10px",
                                padding: "5px 14px"
                            },
                            children: submitting ? "Creating…" : "Create"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                            lineNumber: 375,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                    lineNumber: 360,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
function Field({ label, children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col gap-1 ${className ?? ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[8px] tracking-widest uppercase",
                style: {
                    color: "var(--color-fg-subtle)"
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
        lineNumber: 391,
        columnNumber: 5
    }, this);
}
function CompactSelect({ value, onChange, options, highlight }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: value,
                onChange: (e)=>onChange(e.target.value),
                className: "w-full px-2 py-1.5 text-xs appearance-none outline-none cursor-pointer",
                style: {
                    background: "var(--color-input)",
                    color: highlight ? "var(--color-active-highlight)" : "var(--color-input-fg)",
                    border: "1px solid var(--color-border-hairline)",
                    borderRadius: "3px"
                },
                children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: o.value,
                        style: {
                            background: "var(--color-input)"
                        },
                        children: o.label
                    }, o.value, false, {
                        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                        lineNumber: 420,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                lineNumber: 408,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]",
                style: {
                    color: highlight ? "var(--color-active-highlight)" : "var(--color-fg-subtle)"
                },
                children: "▾"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/NewTaskModal.tsx",
        lineNumber: 407,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/CounterPromptModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CounterPromptModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function CounterPromptModal({ taskTitle, unit, mode = "checkin", recentValues, onSubmit, onClose }) {
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isLog = mode === "log";
    // Most-recent distinct numeric values, capped at 3 — quick-pick chips.
    const chips = (recentValues ?? []).filter((v)=>typeof v === "number" && Number.isFinite(v) && v >= 0).filter((v, i, arr)=>arr.indexOf(v) === i).slice(0, 3);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        inputRef.current?.focus();
    }, []);
    function commit() {
        const trimmed = value.trim();
        if (trimmed === "") {
            if (isLog) {
                setError("Enter a value to log.");
                return;
            }
            onSubmit(undefined);
            return;
        }
        if (!/^\d+$/.test(trimmed)) {
            setError(isLog ? "Enter a whole number." : "Enter a whole number, or leave blank.");
            return;
        }
        const n = Number(trimmed);
        if (n < 0) {
            setError("Must be 0 or greater.");
            return;
        }
        onSubmit(n);
    }
    function pickChip(n) {
        setValue(String(n));
        if (error) setError(null);
        inputRef.current?.focus();
    }
    function step(delta) {
        const trimmed = value.trim();
        const current = trimmed === "" || !/^\d+$/.test(trimmed) ? 0 : Number(trimmed);
        const next = Math.max(0, current + delta);
        setValue(String(next));
        if (error) setError(null);
        inputRef.current?.focus();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-edge-drawer-block": true,
        className: "fixed inset-0 z-[60] flex items-center justify-center px-4",
        style: {
            background: "var(--color-modal-overlay)"
        },
        onClick: (e)=>{
            if (e.target === e.currentTarget) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-xs relative",
            style: {
                background: "var(--color-panel)",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                boxShadow: "var(--shadow-popover)",
                padding: "18px 18px 14px"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    "aria-label": "Close",
                    className: "absolute top-2 right-2 transition-colors text-base leading-none cursor-pointer flex items-center justify-center",
                    style: {
                        color: "var(--color-fg-subtle)",
                        background: "transparent",
                        border: "none",
                        width: 26,
                        height: 26,
                        padding: 0
                    },
                    onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                    onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-3 pr-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[9px] tracking-widest uppercase mb-1",
                            style: {
                                color: "var(--color-fg-subtle)"
                            },
                            children: isLog ? "Log progress" : "Check in"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "truncate",
                            style: {
                                color: "var(--color-fg)",
                                fontSize: "14px",
                                fontWeight: 600
                            },
                            children: taskTitle
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "text-[9px] tracking-widest uppercase block mb-1",
                    style: {
                        color: "var(--color-fg-subtle)"
                    },
                    children: [
                        isLog ? "Counter" : "Counter (optional)",
                        unit ? ` · ${unit}` : ""
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>step(-5),
                            "aria-label": "Decrease by 5",
                            className: "cursor-pointer transition-colors",
                            style: {
                                background: "var(--color-input)",
                                color: "var(--color-fg-muted)",
                                border: "1px solid var(--color-border-hairline)",
                                borderRadius: "3px",
                                width: 32,
                                padding: "6px 0",
                                fontSize: "12px",
                                fontVariantNumeric: "tabular-nums",
                                fontWeight: 600
                            },
                            onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                            onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                            children: "−5"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: inputRef,
                            type: "text",
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            value: value,
                            onChange: (e)=>{
                                setValue(e.target.value);
                                if (error) setError(null);
                            },
                            onKeyDown: (e)=>{
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    commit();
                                } else if (e.key === "Escape") {
                                    e.preventDefault();
                                    onClose();
                                }
                            },
                            placeholder: "e.g. 47",
                            className: "flex-1 outline-none text-center",
                            style: {
                                background: "var(--color-input)",
                                color: "var(--color-input-fg)",
                                border: "1px solid var(--color-border-hairline)",
                                borderRadius: "3px",
                                padding: "6px 8px",
                                fontSize: "13px",
                                fontVariantNumeric: "tabular-nums",
                                minWidth: 0
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>step(5),
                            "aria-label": "Increase by 5",
                            className: "cursor-pointer transition-colors",
                            style: {
                                background: "var(--color-input)",
                                color: "var(--color-fg-muted)",
                                border: "1px solid var(--color-border-hairline)",
                                borderRadius: "3px",
                                width: 32,
                                padding: "6px 0",
                                fontSize: "12px",
                                fontVariantNumeric: "tabular-nums",
                                fontWeight: 600
                            },
                            onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                            onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                            children: "+5"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this),
                        unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: "var(--color-fg-muted)",
                                fontSize: "12px",
                                fontWeight: 500
                            },
                            children: unit
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this),
                chips.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap items-center gap-1.5 mt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[9px] tracking-widest uppercase",
                            style: {
                                color: "var(--color-fg-subtle)"
                            },
                            children: "Recent"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this),
                        chips.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>pickChip(n),
                                className: "cursor-pointer transition-colors",
                                style: {
                                    background: "transparent",
                                    color: "var(--color-fg-muted)",
                                    border: "1px solid var(--color-border-hairline)",
                                    borderRadius: "999px",
                                    padding: "2px 9px",
                                    fontSize: "11px",
                                    fontVariantNumeric: "tabular-nums"
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.color = "var(--color-active-highlight)";
                                    e.currentTarget.style.borderColor = "var(--color-active-highlight-border)";
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.color = "var(--color-fg-muted)";
                                    e.currentTarget.style.borderColor = "var(--color-border-hairline)";
                                },
                                children: n.toLocaleString()
                            }, n, false, {
                                fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                                lineNumber: 176,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 173,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs mt-2",
                    style: {
                        color: "var(--color-danger)"
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 205,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[10px] mt-2",
                    style: {
                        color: "var(--color-fg-subtle)"
                    },
                    children: isLog ? "Logs progress for today without advancing the cycle." : "Leave blank to check in without logging a number."
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end items-center gap-3 mt-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-[10px] tracking-widest uppercase cursor-pointer transition-colors",
                            style: {
                                color: "var(--color-fg-subtle)",
                                background: "transparent",
                                border: "none",
                                padding: "4px 8px"
                            },
                            onMouseEnter: (e)=>e.currentTarget.style.color = "var(--color-fg-muted)",
                            onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg-subtle)",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: commit,
                            className: "pixel-btn",
                            style: {
                                fontSize: "10px",
                                padding: "5px 14px"
                            },
                            children: isLog ? "Log" : "Check in"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
                    lineNumber: 213,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
            lineNumber: 69,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/CounterPromptModal.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/CheckInUndoToast.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CheckInUndoToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function CheckInUndoToast({ taskTitle, onUndo, onDismiss, durationMs = 5000 }) {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const start = Date.now();
        const id = setInterval(()=>{
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 1 - elapsed / durationMs);
            setProgress(remaining);
            if (remaining <= 0) clearInterval(id);
        }, 60);
        return ()=>clearInterval(id);
    }, [
        durationMs
    ]);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-live": "polite",
        style: {
            position: "fixed",
            left: "50%",
            bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
            transform: "translateX(-50%)",
            zIndex: 70,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 6,
            boxShadow: "var(--shadow-popover)",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 260,
            maxWidth: "calc(100vw - 24px)",
            animation: "checkin-toast-in 0.18s ease-out",
            overflow: "hidden"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11,
                    color: "var(--color-fg)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                },
                children: [
                    "Checked in: ",
                    taskTitle
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/CheckInUndoToast.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onUndo,
                className: "cursor-pointer",
                style: {
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "var(--color-active-highlight)",
                    background: "transparent",
                    border: "1px solid var(--color-active-highlight-border)",
                    borderRadius: 999,
                    padding: "4px 10px",
                    flexShrink: 0
                },
                children: "Undo"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CheckInUndoToast.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onDismiss,
                "aria-label": "Dismiss",
                className: "cursor-pointer",
                style: {
                    fontSize: 14,
                    lineHeight: 1,
                    color: "var(--color-fg-subtle)",
                    background: "transparent",
                    border: "none",
                    padding: "4px 6px",
                    flexShrink: 0
                },
                children: "×"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CheckInUndoToast.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                style: {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 2,
                    background: "var(--color-active-highlight)",
                    transform: `scaleX(${progress})`,
                    transformOrigin: "left",
                    transition: "transform 0.06s linear"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CheckInUndoToast.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/CheckInUndoToast.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this), document.body);
}
}),
"[project]/apps/web/src/components/TaskPageOverlays.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskPageOverlays
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NewTaskModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/NewTaskModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CounterPromptModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/CounterPromptModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CheckInUndoToast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/CheckInUndoToast.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function TaskPageOverlays({ showNewTask, onCloseNewTask, onTaskCreated, newTaskInitialRecurring, counterPromptTask, onCloseCounterPrompt, onSubmitCounterCheckIn, logPromptTask, onCancelLog, onSubmitLog, undoableCheckIn, tasks, onUndoCheckInFromToast, onDismissUndoableCheckIn, children }) {
    const recentValuesFor = (t)=>(t.recentCycles ?? []).map((c)=>c.counterValue).filter((v)=>typeof v === "number");
    const undoTask = undoableCheckIn ? tasks.find((t)=>t.taskId === undoableCheckIn.taskId) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            showNewTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NewTaskModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                initialRecurring: newTaskInitialRecurring,
                onClose: onCloseNewTask,
                onCreated: onTaskCreated
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskPageOverlays.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            children,
            counterPromptTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CounterPromptModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                taskTitle: counterPromptTask.title,
                unit: counterPromptTask.counterUnit,
                recentValues: recentValuesFor(counterPromptTask),
                onClose: onCloseCounterPrompt,
                onSubmit: (value)=>onSubmitCounterCheckIn(counterPromptTask, value)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskPageOverlays.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this),
            logPromptTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CounterPromptModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                taskTitle: logPromptTask.title,
                unit: logPromptTask.counterUnit,
                mode: "log",
                recentValues: recentValuesFor(logPromptTask),
                onClose: onCancelLog,
                onSubmit: (value)=>{
                    if (value !== undefined) onSubmitLog(value);
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskPageOverlays.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this),
            undoableCheckIn && undoTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CheckInUndoToast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                taskTitle: undoableCheckIn.taskTitle,
                onUndo: ()=>onUndoCheckInFromToast(undoTask, undoableCheckIn.cycleId),
                onDismiss: onDismissUndoableCheckIn
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/TaskPageOverlays.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/web/src/components/QuickAddInput.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickAddInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$quickTask$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/quickTask.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$quickTask$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/quickTask.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function QuickAddInput({ onSubmit, disabled }) {
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$quickTask$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseQuickTask"])(value, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"]), [
        value
    ]);
    const hint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$quickTask$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatParsedHint"])(parsed);
    const canSubmit = !!parsed.title && !disabled && !busy;
    async function commit() {
        if (!canSubmit) return;
        setBusy(true);
        try {
            await onSubmit({
                title: parsed.title,
                dueDate: parsed.dueDate,
                priority: parsed.priority,
                category: parsed.category
            });
            setValue("");
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex-1 min-w-0 flex items-center",
        style: {
            background: "var(--color-input)",
            border: `1px solid ${value ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
            borderRadius: "2px",
            height: "30px",
            transition: "border-color 0.15s"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: value,
                disabled: disabled,
                onChange: (e)=>setValue(e.target.value),
                onKeyDown: (e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault();
                        commit();
                    }
                },
                placeholder: disabled ? "Sign in to add" : "Add task…  (try: gym tomorrow !high)",
                "aria-label": "Quick add task",
                className: "flex-1 min-w-0 bg-transparent outline-none text-xs px-2",
                style: {
                    color: "var(--color-input-fg)",
                    letterSpacing: "0.02em",
                    height: "100%"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            value && hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": true,
                className: "hidden xs:inline text-[8px] tracking-wider uppercase whitespace-nowrap pr-1",
                style: {
                    color: "var(--color-active-highlight)",
                    opacity: 0.85
                },
                children: hint
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this),
            value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: commit,
                disabled: !canSubmit,
                "aria-label": "Add task",
                className: "flex-shrink-0 flex items-center justify-center",
                style: {
                    width: 30,
                    height: 28,
                    background: "transparent",
                    border: "none",
                    color: canSubmit ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    padding: 0
                },
                children: busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "w-3 h-3 border rounded-full animate-spin",
                    style: {
                        borderColor: "var(--color-border)",
                        borderTopColor: "var(--color-active-highlight)"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
                    lineNumber: 87,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 12 12",
                    fill: "none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "2",
                            y1: "6",
                            x2: "10",
                            y2: "6",
                            stroke: "currentColor",
                            strokeWidth: "1.4",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
                            lineNumber: 90,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                            points: "6.5,2.5 10,6 6.5,9.5",
                            stroke: "currentColor",
                            strokeWidth: "1.4",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            fill: "none"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
                            lineNumber: 91,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
                    lineNumber: 89,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/QuickAddInput.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/FilterTray.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FilterTray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const TRAY_HEIGHT = 28;
const TRAY_HEIGHT_TOTAL = TRAY_HEIGHT + 8; // matches the closed translateY(calc(100% + 8px)) gap
const DISMISS_DRAG_PX = 50;
const AXIS_DEADZONE_PX = 8;
const SWIPE_CYCLE_THRESHOLD = 36;
function FilterTray({ open, filters, activeFilter, onChange, onClose, onToggle, getCount, badgeColor, bottomOffsetPx = 50, pagerRef, trayElementRef }) {
    const [dragY, setDragY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [cycleHint, setCycleHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const swipeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleDragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const highlightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeIdx = Math.max(0, filters.findIndex((f)=>f.value === activeFilter));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return ()=>document.removeEventListener("keydown", onKey);
    }, [
        open,
        onClose
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!cycleHint) return;
        const t = window.setTimeout(()=>setCycleHint(null), 900);
        return ()=>window.clearTimeout(t);
    }, [
        cycleHint
    ]);
    function cycleFilter(direction) {
        const idx = filters.findIndex((f)=>f.value === activeFilter);
        if (idx < 0) return;
        const next = Math.max(0, Math.min(filters.length - 1, idx + direction));
        if (next === idx) return;
        onChange(filters[next].value);
        setCycleHint(filters[next].label);
    }
    function onTouchStart(e) {
        const t = e.touches[0];
        const startIdx = filters.findIndex((f)=>f.value === activeFilter);
        swipeRef.current = {
            startX: t.clientX,
            startY: t.clientY,
            startIdx: startIdx < 0 ? 0 : startIdx,
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
            if (Math.abs(dx) < AXIS_DEADZONE_PX && Math.abs(dy) < AXIS_DEADZONE_PX) return;
            s.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        }
        if (s.locked === "v" && dy > 0) {
            setDragY(dy);
            return;
        }
        if (s.locked === "h" && filters.length > 1) {
            const viewportW = window.innerWidth || 1;
            const pillWidth = (viewportW - 16) / filters.length;
            const deltaIdx = dx / pillWidth;
            const continuous = Math.max(0, Math.min(filters.length - 1, s.startIdx + deltaIdx));
            const slotPct = 100 / filters.length;
            const pager = pagerRef?.current;
            if (pager) {
                // eslint-disable-next-line react-hooks/immutability
                pager.style.transition = "none";
                pager.style.transform = `translateX(${-continuous * slotPct}%)`;
            }
            const highlight = highlightRef.current;
            if (highlight) {
                highlight.style.transition = "none";
                highlight.style.transform = `translateX(${continuous * 100}%)`;
            }
        }
    }
    function onTouchEnd() {
        const s = swipeRef.current;
        swipeRef.current = null;
        if (!s) return;
        if (s.locked === "v") {
            const final = dragY;
            setDragY(0);
            if (final > DISMISS_DRAG_PX) onClose();
            return;
        }
        if (s.locked === "h") {
            const pager = pagerRef?.current;
            const highlight = highlightRef.current;
            const slotPct = 100 / filters.length;
            let continuousIdx = s.startIdx;
            if (pager) {
                const match = pager.style.transform.match(/translateX\((-?[\d.]+)%\)/);
                const currentPct = match ? parseFloat(match[1]) : 0;
                continuousIdx = -currentPct / slotPct;
            } else if (highlight) {
                const match = highlight.style.transform.match(/translateX\((-?[\d.]+)%\)/);
                const currentPct = match ? parseFloat(match[1]) : 0;
                continuousIdx = currentPct / 100;
            }
            const snappedIdx = Math.max(0, Math.min(filters.length - 1, Math.round(continuousIdx)));
            if (pager) {
                // eslint-disable-next-line react-hooks/immutability
                pager.style.transition = "";
            }
            if (highlight) {
                highlight.style.transition = "transform 0.22s cubic-bezier(0.2, 0, 0, 1)";
                highlight.style.transform = `translateX(${snappedIdx * 100}%)`;
            }
            const target = filters[snappedIdx];
            if (target && target.value !== activeFilter) {
                onChange(target.value);
            } else if (pager) {
                pager.style.transform = `translateX(${-snappedIdx * slotPct}%)`;
            }
        }
    }
    // Handle gestures: tap to toggle, vertical drag to open/close, horizontal swipe to cycle filter.
    function onHandleTouchStart(e) {
        const t = e.touches[0];
        handleDragRef.current = {
            startX: t.clientX,
            startY: t.clientY,
            startedOpen: open,
            locked: null,
            moved: false
        };
    }
    function onHandleTouchMove(e) {
        const d = handleDragRef.current;
        if (!d) return;
        const t = e.touches[0];
        const dx = t.clientX - d.startX;
        const dy = t.clientY - d.startY;
        if (d.locked === null) {
            if (Math.abs(dx) < AXIS_DEADZONE_PX && Math.abs(dy) < AXIS_DEADZONE_PX) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) >= SWIPE_CYCLE_THRESHOLD) {
                    d.locked = "h";
                    d.moved = true;
                    cycleFilter(dx < 0 ? 1 : -1);
                }
                return;
            }
            d.locked = "v";
            d.moved = true;
        }
        if (d.locked === "v") {
            const tray = trayElementRef?.current;
            const handle = handleRef.current;
            if (!tray || !handle) return;
            const baseY = d.startedOpen ? 0 : TRAY_HEIGHT_TOTAL;
            const targetY = Math.max(0, Math.min(TRAY_HEIGHT_TOTAL, baseY + dy));
            // eslint-disable-next-line react-hooks/immutability
            tray.style.transition = "none";
            tray.style.transform = `translateY(${targetY}px)`;
            const progress = 1 - targetY / TRAY_HEIGHT_TOTAL;
            const handleBottom = bottomOffsetPx + TRAY_HEIGHT * progress;
            handle.style.transition = "none";
            handle.style.bottom = `calc(${handleBottom}px + env(safe-area-inset-bottom, 0px))`;
        }
    }
    function onHandleTouchEnd() {
        const d = handleDragRef.current;
        handleDragRef.current = null;
        if (!d) return;
        if (d.locked === "v") {
            const tray = trayElementRef?.current;
            const handle = handleRef.current;
            if (!tray || !handle) return;
            const match = tray.style.transform.match(/translateY\((-?[\d.]+)px\)/);
            const currentY = match ? parseFloat(match[1]) : 0;
            const willOpen = currentY < TRAY_HEIGHT_TOTAL / 2;
            // eslint-disable-next-line react-hooks/immutability
            tray.style.transition = "transform 0.22s cubic-bezier(0.2, 0, 0, 1)";
            tray.style.transform = willOpen ? "translateY(0)" : `translateY(calc(100% + 8px))`;
            handle.style.transition = "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)";
            handle.style.bottom = `calc(${bottomOffsetPx + (willOpen ? TRAY_HEIGHT : 0)}px + env(safe-area-inset-bottom, 0px))`;
            if (willOpen !== open) onToggle?.();
        }
    }
    function onHandleClick() {
        // Suppress synthesized click after a drag — the touchend already settled the tray.
        if (handleDragRef.current?.moved) return;
        onToggle?.();
    }
    if (typeof document === "undefined") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: handleRef,
                type: "button",
                "data-edge-drawer-block": true,
                "data-edge-drawer-block-row": true,
                onClick: onHandleClick,
                onTouchStart: onHandleTouchStart,
                onTouchMove: onHandleTouchMove,
                onTouchEnd: onHandleTouchEnd,
                onTouchCancel: onHandleTouchEnd,
                "aria-label": open ? "Close filter" : "Open filter",
                className: "sm:hidden",
                style: {
                    position: "fixed",
                    left: "50%",
                    bottom: open ? `calc(${bottomOffsetPx + TRAY_HEIGHT}px + env(safe-area-inset-bottom, 0px))` : `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom, 0px))`,
                    transform: "translateX(-50%)",
                    padding: "14px 30px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    touchAction: "none",
                    WebkitTapHighlightColor: "transparent",
                    zIndex: 35,
                    transition: "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)"
                },
                children: [
                    cycleHint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-live": "polite",
                        style: {
                            position: "absolute",
                            bottom: "calc(100% + 4px)",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "var(--color-surface)",
                            color: "var(--color-active-highlight)",
                            border: "1px solid var(--color-active-highlight-border)",
                            borderRadius: 3,
                            padding: "4px 10px",
                            fontSize: "10px",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                            pointerEvents: "none",
                            animation: "filter-cycle-hint 0.9s ease-out forwards"
                        },
                        children: cycleHint
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                        lineNumber: 263,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        style: {
                            display: "block",
                            width: 60,
                            height: 3,
                            borderRadius: 1.5,
                            background: open ? "var(--color-active-highlight)" : "var(--color-border)",
                            transition: "background 0.18s"
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: trayElementRef,
                "data-edge-drawer-block": true,
                className: "fixed left-0 right-0 sm:hidden overflow-hidden",
                style: {
                    bottom: `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom, 0px))`,
                    height: TRAY_HEIGHT,
                    background: "var(--color-header)",
                    borderTop: "1px solid var(--color-border-soft)",
                    borderBottom: "1px solid var(--color-border-hairline)",
                    zIndex: 34,
                    transform: open ? dragY > 0 ? `translateY(${dragY}px)` : "translateY(0)" : "translateY(calc(100% + 8px))",
                    transition: dragY > 0 ? "none" : "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                    willChange: "transform",
                    pointerEvents: open ? "auto" : "none"
                },
                onTouchStart: onTouchStart,
                onTouchMove: onTouchMove,
                onTouchEnd: onTouchEnd,
                onTouchCancel: onTouchEnd,
                "aria-hidden": !open,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full flex items-stretch px-2 relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: highlightRef,
                            "aria-hidden": true,
                            style: {
                                position: "absolute",
                                top: 3,
                                bottom: 3,
                                left: 8,
                                width: `calc((100% - 16px) / ${filters.length})`,
                                background: "var(--color-active-highlight-bg)",
                                border: "1px solid var(--color-active-highlight-border)",
                                borderRadius: 3,
                                transform: `translateX(${activeIdx * 100}%)`,
                                transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                                pointerEvents: "none",
                                willChange: "transform"
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                            lineNumber: 325,
                            columnNumber: 11
                        }, this),
                        filters.map((f)=>{
                            const isActive = f.value === activeFilter;
                            const count = getCount?.(f.value);
                            const dot = badgeColor?.(f.value) ?? null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    onChange(f.value);
                                },
                                role: "menuitemradio",
                                "aria-checked": isActive,
                                className: "flex items-center justify-center cursor-pointer",
                                style: {
                                    flex: "1 1 0",
                                    minWidth: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 5,
                                    background: "transparent",
                                    border: "none",
                                    color: isActive ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                    fontSize: "10px",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontWeight: isActive ? 700 : 500,
                                    padding: "0 6px",
                                    position: "relative",
                                    zIndex: 1,
                                    WebkitTapHighlightColor: "transparent",
                                    transition: "color 0.18s",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                },
                                children: [
                                    dot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: 5,
                                            height: 5,
                                            borderRadius: "50%",
                                            background: dot,
                                            flexShrink: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                                        lineNumber: 379,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        },
                                        children: f.shortLabel
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                                        lineNumber: 381,
                                        columnNumber: 17
                                    }, this),
                                    count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.6,
                                            fontWeight: 500,
                                            flexShrink: 0
                                        },
                                        children: count
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                                        lineNumber: 383,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, f.value, true, {
                                fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                                lineNumber: 348,
                                columnNumber: 15
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/FilterTray.tsx",
                lineNumber: 300,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true), document.body);
}
}),
"[project]/apps/web/src/components/MobileActionBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileActionBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskListControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/TaskListControls.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$QuickAddInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/QuickAddInput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$FilterTray$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/FilterTray.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function MobileActionBar({ filters, activeFilter, onFilterChange, getCount, badgeColor, sortMode, groupMode, onSortChange, onGroupChange, onNewTask, onQuickCreate, isAuthenticated, pagerRef, submitMode }) {
    const [trayOpen, setTrayOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const trayElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            !submitMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-edge-drawer-block": true,
                className: "fixed left-0 right-0 sm:hidden flex items-center gap-1.5 px-2 pb-px",
                style: {
                    bottom: "env(safe-area-inset-bottom, 0px)",
                    height: "50px",
                    background: "var(--color-header)",
                    borderTop: "1px solid var(--color-border-soft)",
                    boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.08)",
                    zIndex: 35
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex items-center",
                        children: onQuickCreate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$QuickAddInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            disabled: !isAuthenticated,
                            onSubmit: onQuickCreate
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                            lineNumber: 63,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                            lineNumber: 65,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskListControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                sortMode: sortMode,
                                groupMode: groupMode,
                                onSortChange: onSortChange,
                                onGroupChange: onGroupChange,
                                openAbove: true
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>!isAuthenticated ? undefined : onNewTask(),
                                disabled: !isAuthenticated,
                                title: !isAuthenticated ? "Sign in to create tasks" : "Open full task form",
                                "aria-label": "Open full new task form",
                                className: "flex-shrink-0 flex items-center justify-center",
                                style: {
                                    width: 36,
                                    height: 30,
                                    padding: 0,
                                    fontSize: "20px",
                                    lineHeight: 1,
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--color-fg)",
                                    cursor: !isAuthenticated ? "not-allowed" : "pointer",
                                    opacity: !isAuthenticated ? 0.3 : 1,
                                    WebkitTapHighlightColor: "transparent"
                                },
                                children: "+"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$FilterTray$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: trayOpen,
                filters: filters,
                activeFilter: activeFilter,
                onChange: onFilterChange,
                onClose: ()=>setTrayOpen(false),
                onToggle: ()=>setTrayOpen((v)=>!v),
                getCount: getCount,
                badgeColor: badgeColor,
                bottomOffsetPx: 50,
                pagerRef: pagerRef,
                trayElementRef: trayElementRef
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/MobileActionBar.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/web/src/components/PullToRefreshIndicator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PullToRefreshIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function PullToRefreshIndicator({ pullY, phase, triggerDistance }) {
    if (pullY <= 0 && phase === "idle") return null;
    const progress = Math.min(pullY / triggerDistance, 1);
    const isRefreshing = phase === "refreshing";
    const isReady = phase === "ready";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": true,
        style: {
            height: pullY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            transition: isRefreshing || phase === "idle" ? "height 0.18s cubic-bezier(0.2, 0, 0, 1)" : "none",
            color: isReady || isRefreshing ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
            opacity: Math.max(0.35, progress)
        },
        children: isRefreshing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-4 h-4 border-2 rounded-full animate-spin",
            style: {
                borderColor: "var(--color-border)",
                borderTopColor: "var(--color-active-highlight)"
            }
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/PullToRefreshIndicator.tsx",
            lineNumber: 32,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.6",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: {
                transform: `rotate(${isReady ? 180 : 0}deg)`,
                transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "8",
                    y1: "2",
                    x2: "8",
                    y2: "13"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/PullToRefreshIndicator.tsx",
                    lineNumber: 54,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "3,8 8,13 13,8"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/PullToRefreshIndicator.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/PullToRefreshIndicator.tsx",
            lineNumber: 40,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/PullToRefreshIndicator.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/tasks/constants.ts [app-ssr] (ecmascript)");
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
                                const regSubmitted = Math.min(dailySubmitted - recurringSubmittedToday, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"]);
                                const recSubmitted = Math.min(recurringSubmittedToday, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"]);
                                const regPct = Math.round(regSubmitted / __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"] * 100);
                                const recPct = Math.round(recSubmitted / __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"] * 100);
                                const regCapped = regSubmitted >= __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"];
                                const recCapped = recSubmitted >= __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"];
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
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REGULAR_CAP"]
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
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$tasks$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECURRING_CAP"]
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
];

//# sourceMappingURL=apps_web_src_components_0cb6212d._.js.map