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
]);

//# sourceMappingURL=packages_shared_src_5233dedd._.js.map