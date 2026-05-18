(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/shared/src/api/tasks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/api/subtasks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/time/dateUtils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/tasks/tiers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currentStreakTier",
    ()=>currentStreakTier,
    "tierForStreak",
    ()=>tierForStreak
]);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/avatar/hints.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared per-item render-hint resolution for the chibi avatar. Used by
// every surface that renders an AvatarItemDto into a chibi composition —
// the /avatar page, the TaskDetailModal preview, etc. — so weapon offsets,
// covers-hair flags, and source dimensions stay consistent everywhere.
__turbopack_context__.s([
    "CLASS_HINTS",
    ()=>CLASS_HINTS,
    "RENDER_HINTS",
    ()=>RENDER_HINTS,
    "applyHints",
    ()=>applyHints,
    "classHintMatch",
    ()=>classHintMatch
]);
const RENDER_HINTS = {
    "hat_alien_neo.png": {
        coversHairFront: true,
        coversHairBack: true,
        renderScale: 1.2,
        offsetY: 10
    },
    "hair_seraph_wave_brown.png": {
        offsetX: 11
    },
    "weapon_polearm_alien_cyber.png": {
        sourceWidth: 384,
        sourceHeight: 384,
        offsetX: 6,
        offsetY: -8,
        renderScale: 1.25
    },
    "weapon_front_magic_staff.png": {
        offsetX: -67,
        offsetY: 1
    }
};
const CLASS_HINTS = {
    polearm: {
        sourceWidth: 384,
        sourceHeight: 384,
        offsetX: -73,
        offsetY: -8,
        renderScale: 1.25
    }
};
function classHintMatch(item) {
    const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
    for (const token of Object.keys(CLASS_HINTS)){
        if (haystack.includes(token)) return CLASS_HINTS[token];
    }
    return null;
}
function applyHints(item) {
    const filename = item.previewAssetUrl?.split("/").pop() ?? "";
    const fileHints = RENDER_HINTS[filename] ?? {};
    const classHints = classHintMatch(item) ?? {};
    const merged = {
        ...item
    };
    for (const key of [
        "coversHairFront",
        "coversHairBack",
        "renderScale",
        "sourceWidth",
        "sourceHeight"
    ]){
        if (merged[key] == null && classHints[key] != null) {
            // @ts-expect-error narrow assignment — key is a known optional field
            merged[key] = classHints[key];
        }
        if (merged[key] == null && fileHints[key] != null) {
            // @ts-expect-error narrow assignment — key is a known optional field
            merged[key] = fileHints[key];
        }
    }
    for (const key of [
        "offsetX",
        "offsetY"
    ]){
        if (classHints[key] != null) merged[key] = classHints[key];
        if (fileHints[key] != null) merged[key] = fileHints[key];
    }
    if (merged.coversHair === true) {
        if (merged.coversHairFront == null) merged.coversHairFront = true;
        if (merged.coversHairBack == null) merged.coversHairBack = true;
    }
    return merged;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/tasks/quickTask.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatParsedHint",
    ()=>formatParsedHint,
    "parseQuickTask",
    ()=>parseQuickTask
]);
const WEEKDAYS = {
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tues: 2,
    tuesday: 2,
    wed: 3,
    weds: 3,
    wednesday: 3,
    thu: 4,
    thur: 4,
    thurs: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6
};
const MONTHS = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    sept: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11
};
function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d, n) {
    const out = new Date(d);
    out.setDate(out.getDate() + n);
    return out;
}
function nextWeekday(from, target, forceNext) {
    const cur = from.getDay();
    let diff = (target - cur + 7) % 7;
    if (diff === 0) diff = 7;
    if (forceNext) diff += 7;
    return addDays(from, diff);
}
function tryDate(working, today) {
    const patterns = [
        {
            re: /\b(today|tdy)\b/i,
            fn: ()=>today
        },
        {
            re: /\b(tomorrow|tmrw|tmr|tom)\b/i,
            fn: ()=>addDays(today, 1)
        },
        {
            re: /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|weds|thu|thur|thurs|fri|sat)\b/i,
            fn: (m)=>nextWeekday(today, WEEKDAYS[m[1].toLowerCase()], true)
        },
        {
            re: /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|weds|thu|thur|thurs|fri|sat)\b/i,
            fn: (m)=>nextWeekday(today, WEEKDAYS[m[1].toLowerCase()], false)
        },
        {
            re: /\bin\s+(\d+)\s*(day|days|d|week|weeks|w)\b/i,
            fn: (m)=>{
                const n = parseInt(m[1], 10);
                const isWeek = /^w/i.test(m[2]);
                return addDays(today, n * (isWeek ? 7 : 1));
            }
        },
        {
            re: /\b(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
            fn: (m)=>{
                const month = MONTHS[m[1].toLowerCase()];
                const day = parseInt(m[2], 10);
                if (day < 1 || day > 31) return null;
                let year = today.getFullYear();
                const candidate = new Date(year, month, day);
                if (candidate < today) year += 1;
                return new Date(year, month, day);
            }
        },
        {
            re: /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/,
            fn: (m)=>{
                const month = parseInt(m[1], 10) - 1;
                const day = parseInt(m[2], 10);
                if (month < 0 || month > 11 || day < 1 || day > 31) return null;
                let year = today.getFullYear();
                if (m[3]) {
                    const y = parseInt(m[3], 10);
                    year = y < 100 ? 2000 + y : y;
                } else {
                    const candidate = new Date(year, month, day);
                    if (candidate < today) year += 1;
                }
                return new Date(year, month, day);
            }
        }
    ];
    for (const { re, fn } of patterns){
        const match = working.match(re);
        if (match) {
            const date = fn(match);
            if (date) {
                return {
                    date,
                    matched: match[0],
                    rest: (working.slice(0, match.index) + working.slice(match.index + match[0].length)).trim()
                };
            }
        }
    }
    return null;
}
function tryPriority(working) {
    const re = /(?:^|\s)!(high|h|medium|med|m|low|l)\b/i;
    const match = working.match(re);
    if (!match) return null;
    const v = match[1].toLowerCase();
    const priority = v.startsWith("h") ? "high" : v.startsWith("l") ? "low" : "medium";
    const rest = (working.slice(0, match.index) + working.slice(match.index + match[0].length)).trim();
    return {
        priority,
        matched: match[0].trim(),
        rest
    };
}
function tryCategory(working, categories) {
    const re = /(?:^|\s)#([A-Za-z][A-Za-z0-9-]*)\b/;
    const match = working.match(re);
    if (!match) return null;
    const token = match[1].toLowerCase();
    const found = categories.find((c)=>c.toLowerCase() === token) ?? categories.find((c)=>c.toLowerCase().startsWith(token));
    if (!found) return null;
    const rest = (working.slice(0, match.index) + working.slice(match.index + match[0].length)).trim();
    return {
        category: found,
        matched: match[0].trim(),
        rest
    };
}
function parseQuickTask(input, categories) {
    const today = startOfDay(new Date());
    let working = input.trim();
    const matched = {};
    const p = tryPriority(working);
    let priority = "medium";
    if (p) {
        priority = p.priority;
        matched.priority = p.matched;
        working = p.rest;
    }
    const c = tryCategory(working, categories);
    let category = null;
    if (c) {
        category = c.category;
        matched.category = c.matched;
        working = c.rest;
    }
    const d = tryDate(working, today);
    let dueDate = null;
    if (d) {
        dueDate = d.date;
        matched.date = d.matched;
        working = d.rest;
    }
    const title = working.replace(/\s+/g, " ").trim();
    return {
        title,
        dueDate,
        priority,
        category,
        matched
    };
}
function formatParsedHint(parsed) {
    const bits = [];
    if (parsed.dueDate) {
        bits.push(parsed.dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        }));
    }
    if (parsed.priority !== "medium") bits.push(parsed.priority);
    if (parsed.category) bits.push(`#${parsed.category}`);
    return bits.join(" · ");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/tasks/penalties.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "processPenalties",
    ()=>processPenalties
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-client] (ecmascript)");
;
function processPenalties(raw) {
    return raw.map((t)=>{
        if (t.status === "in_progress" && !t.isRecurring && t.dueDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCyclesOverdue"])(t.dueDate, null) >= 3) {
            return {
                ...t,
                status: "pending",
                wasPenalized: true
            };
        }
        return t;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/shared/src/tasks/taskList.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildListItems",
    ()=>buildListItems,
    "chunkListItems",
    ()=>chunkListItems,
    "completedSort",
    ()=>completedSort,
    "makeSortTasks",
    ()=>makeSortTasks,
    "sep",
    ()=>sep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-client] (ecmascript)");
;
const sep = (label, sepKey)=>({
        __sep: true,
        label,
        sepKey
    });
function chunkListItems(items) {
    const chunks = [];
    let current = {
        sep: null,
        tasks: []
    };
    for (const item of items){
        if ("__sep" in item) {
            if (current.tasks.length > 0 || current.sep !== null) chunks.push(current);
            current = {
                sep: item,
                tasks: []
            };
        } else {
            current.tasks.push(item);
        }
    }
    if (current.tasks.length > 0 || current.sep !== null) chunks.push(current);
    return chunks;
}
const completedSort = (submittedTaskIds)=>(a, b)=>{
        const tier = (t)=>{
            if (submittedTaskIds.has(t.taskId)) return 2;
            if (t.submitted === true || !!t.pointsAwarded) return 1;
            return 0;
        };
        const aTier = tier(a);
        const bTier = tier(b);
        if (aTier !== bTier) return aTier - bTier;
        if (a.completedAt && b.completedAt) return b.completedAt.localeCompare(a.completedAt);
        if (a.completedAt) return -1;
        if (b.completedAt) return 1;
        return 0;
    };
const byDueDate = (a, b)=>{
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
};
const PRIORITY_ORDER = {
    high: 0,
    medium: 1,
    low: 2
};
const getTaskTier = (t)=>{
    if (t.isRecurring) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(t.dueDate, t.recurrenceRule, t.lastCheckInDate) ? 0 : 1;
    return t.status === "in_progress" ? 1 : 0;
};
const makeSortTasks = (sortMode)=>(a, b)=>{
        const tierDiff = getTaskTier(a) - getTaskTier(b);
        if (tierDiff !== 0) return tierDiff;
        switch(sortMode){
            case "priority":
                return (PRIORITY_ORDER[a.priority.toLowerCase()] ?? 3) - (PRIORITY_ORDER[b.priority.toLowerCase()] ?? 3);
            case "title":
                return a.title.localeCompare(b.title);
            case "points":
                return b.pointValue - a.pointValue;
            default:
                return byDueDate(a, b);
        }
    };
function buildListItems(args) {
    const { tasks, activeFilter, groupMode, sortMode, submittedTaskIds } = args;
    const cmpCompleted = completedSort(submittedTaskIds);
    const sortTasks = makeSortTasks(sortMode);
    if (activeFilter === "completed") {
        return [
            ...tasks
        ].filter((t)=>t.status === "completed").sort(cmpCompleted);
    }
    const activeTasks = activeFilter === "pending" ? tasks.filter((t)=>t.status === "pending" || t.status === "in_progress") : activeFilter === "in_progress" ? tasks.filter((t)=>t.status === "in_progress") : tasks.filter((t)=>t.status !== "completed");
    const completedTasks = activeFilter === "all" ? [
        ...tasks
    ].filter((t)=>t.status === "completed").sort(cmpCompleted) : [];
    const items = [];
    if (groupMode === "due") {
        const buckets = new Map();
        for (const t of activeTasks){
            const key = t.dueDate ?? "__none";
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key).push(t);
        }
        const keys = [
            ...buckets.keys()
        ].sort((a, b)=>{
            if (a === "__none") return 1;
            if (b === "__none") return -1;
            return a.localeCompare(b);
        });
        for (const key of keys){
            const label = key === "__none" ? "No Due Date" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseLocalDate"])(key).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
            items.push(sep(label, `__sep-due-${key}`), ...buckets.get(key).sort(sortTasks));
        }
    } else if (groupMode === "category") {
        const buckets = new Map();
        for (const t of activeTasks){
            const key = t.category || "__none";
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key).push(t);
        }
        const keys = [
            ...buckets.keys()
        ].sort((a, b)=>{
            if (a === "__none") return 1;
            if (b === "__none") return -1;
            return a.localeCompare(b);
        });
        for (const key of keys){
            const label = key === "__none" ? "No Category" : key;
            items.push(sep(label, `__sep-cat-${key}`), ...buckets.get(key).sort(sortTasks));
        }
    } else {
        items.push(...[
            ...activeTasks
        ].sort(sortTasks));
    }
    if (completedTasks.length > 0) items.push(sep("Completed", "__sep-completed"), ...completedTasks);
    return items;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=packages_shared_src_62f08288._.js.map