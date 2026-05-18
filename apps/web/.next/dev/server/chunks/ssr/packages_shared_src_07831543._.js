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
"[project]/packages/shared/src/tasks/tiers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/packages/shared/src/avatar/hints.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
];

//# sourceMappingURL=packages_shared_src_07831543._.js.map