(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/lib/api/tasks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tasksApi",
    ()=>tasksApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/api/tasks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/client.ts [app-client] (ecmascript)");
;
;
const tasksApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTasksApi"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/api/subtasks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "subtasksApi",
    ()=>subtasksApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$subtasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/api/subtasks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/client.ts [app-client] (ecmascript)");
;
;
const subtasksApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$api$2f$subtasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSubtasksApi"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/dateUtils.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/assetPath.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assetPath",
    ()=>assetPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/mockAvatar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_AVATAR_ITEMS",
    ()=>MOCK_AVATAR_ITEMS,
    "MOCK_EQUIPPED_IDS",
    ()=>MOCK_EQUIPPED_IDS,
    "buildMockEquipped",
    ()=>buildMockEquipped,
    "buildMockInventory",
    ()=>buildMockInventory,
    "mockItem",
    ()=>mockItem
]);
const MOCK_AVATAR_ITEMS = [
    {
        itemId: 1001,
        name: "Pixel Beanie",
        category: "headwear",
        slot: "HEAD",
        rarity: "COMMON",
        cost: 25,
        description: "A snug knit cap.",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1001,
            slot: "HEAD",
            rects: [
                {
                    x: 4,
                    y: 0,
                    w: 6,
                    h: 1,
                    fill: "#a78bfa"
                },
                {
                    x: 3,
                    y: 1,
                    w: 8,
                    h: 1,
                    fill: "#a78bfa"
                },
                {
                    x: 2,
                    y: 2,
                    w: 10,
                    h: 1,
                    fill: "#7c3aed"
                }
            ]
        }
    },
    {
        itemId: 1002,
        name: "Crown",
        category: "headwear",
        slot: "HEAD",
        rarity: "LEGENDARY",
        cost: 500,
        description: "A king's headpiece.",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1002,
            slot: "HEAD",
            rects: [
                {
                    x: 4,
                    y: 1,
                    w: 1,
                    h: 1,
                    fill: "#fbbf24"
                },
                {
                    x: 6,
                    y: 1,
                    w: 1,
                    h: 1,
                    fill: "#fbbf24"
                },
                {
                    x: 8,
                    y: 1,
                    w: 1,
                    h: 1,
                    fill: "#fbbf24"
                },
                {
                    x: 5,
                    y: 0,
                    w: 1,
                    h: 1,
                    fill: "#fef3c7"
                },
                {
                    x: 7,
                    y: 0,
                    w: 1,
                    h: 1,
                    fill: "#fef3c7"
                },
                {
                    x: 9,
                    y: 0,
                    w: 1,
                    h: 1,
                    fill: "#fef3c7"
                },
                {
                    x: 3,
                    y: 2,
                    w: 8,
                    h: 1,
                    fill: "#f59e0b"
                }
            ]
        }
    },
    {
        itemId: 1003,
        name: "Shades",
        category: "eyewear",
        slot: "FACE",
        rarity: "UNCOMMON",
        cost: 60,
        description: "Cool customer.",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1003,
            slot: "FACE",
            rects: [
                {
                    x: 4,
                    y: 4,
                    w: 2,
                    h: 2,
                    fill: "#0f172a"
                },
                {
                    x: 8,
                    y: 4,
                    w: 2,
                    h: 2,
                    fill: "#0f172a"
                },
                {
                    x: 6,
                    y: 4,
                    w: 2,
                    h: 1,
                    fill: "#0f172a"
                }
            ]
        }
    },
    {
        itemId: 1004,
        name: "Vest",
        category: "outerwear",
        slot: "BODY",
        rarity: "COMMON",
        cost: 30,
        description: "Adventurer's vest.",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1004,
            slot: "BODY",
            rects: [
                {
                    x: 4,
                    y: 9,
                    w: 2,
                    h: 3,
                    fill: "#10b981"
                },
                {
                    x: 8,
                    y: 9,
                    w: 2,
                    h: 3,
                    fill: "#10b981"
                },
                {
                    x: 5,
                    y: 9,
                    w: 4,
                    h: 1,
                    fill: "#10b981"
                }
            ]
        }
    },
    {
        itemId: 1005,
        name: "Lab Coat",
        category: "outerwear",
        slot: "BODY",
        rarity: "RARE",
        cost: 120,
        description: "Science!",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1005,
            slot: "BODY",
            rects: [
                {
                    x: 4,
                    y: 9,
                    w: 6,
                    h: 3,
                    fill: "#e5e7eb"
                },
                {
                    x: 6,
                    y: 9,
                    w: 1,
                    h: 3,
                    fill: "#9ca3af"
                },
                {
                    x: 7,
                    y: 9,
                    w: 1,
                    h: 3,
                    fill: "#9ca3af"
                }
            ]
        }
    },
    {
        itemId: 1006,
        name: "Boots",
        category: "footwear",
        slot: "FEET",
        rarity: "COMMON",
        cost: 20,
        description: "Sturdy boots.",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1006,
            slot: "FEET",
            rects: [
                {
                    x: 4,
                    y: 14,
                    w: 2,
                    h: 1,
                    fill: "#78350f"
                },
                {
                    x: 8,
                    y: 14,
                    w: 2,
                    h: 1,
                    fill: "#78350f"
                },
                {
                    x: 3,
                    y: 15,
                    w: 3,
                    h: 1,
                    fill: "#92400e"
                },
                {
                    x: 8,
                    y: 15,
                    w: 3,
                    h: 1,
                    fill: "#92400e"
                }
            ]
        }
    },
    {
        itemId: 1007,
        name: "Backpack",
        category: "back",
        slot: "BACK",
        rarity: "UNCOMMON",
        cost: 75,
        description: "Carry your gear.",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1007,
            slot: "BACK",
            rects: [
                {
                    x: 3,
                    y: 9,
                    w: 1,
                    h: 3,
                    fill: "#92400e"
                },
                {
                    x: 10,
                    y: 9,
                    w: 1,
                    h: 3,
                    fill: "#92400e"
                },
                {
                    x: 4,
                    y: 8,
                    w: 6,
                    h: 1,
                    fill: "#92400e"
                }
            ]
        }
    },
    {
        itemId: 1008,
        name: "Pencil",
        category: "tool",
        slot: "HAND",
        rarity: "COMMON",
        cost: 15,
        description: "For the studious.",
        previewAssetUrl: null,
        isAvailable: true,
        art: {
            itemId: 1008,
            slot: "HAND",
            rects: [
                {
                    x: 11,
                    y: 10,
                    w: 1,
                    h: 2,
                    fill: "#fbbf24"
                },
                {
                    x: 11,
                    y: 9,
                    w: 1,
                    h: 1,
                    fill: "#1f2937"
                }
            ]
        }
    },
    {
        itemId: 2002,
        name: "Sweater",
        category: "outerwear",
        slot: "BODY",
        rarity: "COMMON",
        cost: 40,
        description: "A cozy knit sweater.",
        previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/sweater_knit_white.png",
        isAvailable: true
    },
    // Slot uses the planned granular HAIR_FRONT (z=80, below HEAD/HAT) so
    // hair renders behind a hat. Backend enum doesn't have HAIR yet — cast
    // is intentional, mirrors the alien-helmet "HAT slot ships later" note.
    {
        itemId: 2003,
        name: "Seraph Wave Brown",
        category: "hair",
        slot: "HAIR_FRONT",
        rarity: "UNCOMMON",
        cost: 60,
        description: "Long wavy brown hair.",
        previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/hair_seraph_wave_brown.png",
        isAvailable: true,
        offsetX: 11
    },
    // WEAPON_FRONT (z=130) — planned granular slot, casts to ItemSlot like
    // HAIR_FRONT above. Backend currently maps weapons onto the HAND enum
    // (also z=130), so the same asset works once the catalog goes live.
    // sourceWidth=384 (vs base 256) so the polearm can extend past the
    // character bounds; ChibiAvatar centers the wider canvas over the base.
    {
        itemId: 2004,
        name: "Cyber Polearm",
        category: "weapon",
        slot: "WEAPON_FRONT",
        rarity: "EPIC",
        cost: 500,
        description: "An alien cyber polearm crackling with energy.",
        // Matches the backend's slug-based naming convention (introduced when
        // the API switched away from GUID blob names). The old
        // `weapon_polearm_alien_cyber.png` URL is now 404 since the asset was
        // re-uploaded under the new scheme.
        previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/weapon_front_cyber_polearm.png",
        // Back-layer shaft (the portion that passes behind the chibi body).
        // ChibiAvatar composes both layers when an item provides a secondary.
        secondaryAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/weapon_front_cyber_polearm_back.png",
        isAvailable: true,
        sourceWidth: 384,
        sourceHeight: 384,
        offsetX: 6,
        offsetY: -8,
        renderScale: 1.25,
        // The backend persists gridCols/gridRows per item; the mock must mirror
        // those values or the static-demo inventory falls back to getItemSize's
        // slot heuristic, which doesn't recognise WEAPON_FRONT (a planned
        // granular slot not in the base ItemSlot enum) and treats it as 1×1.
        gridCols: 2,
        gridRows: 1
    },
    {
        itemId: 2006,
        name: "Flower Crown",
        category: "headwear",
        slot: "HEAD",
        rarity: "RARE",
        cost: 120,
        description: "A delicate crown of pixel flowers.",
        previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/hat_crown_flower.png",
        isAvailable: true
    }
];
const itemById = new Map(MOCK_AVATAR_ITEMS.map((i)=>[
        i.itemId,
        i
    ]));
function mockItem(id) {
    return itemById.get(id) ?? null;
}
const MOCK_EQUIPPED_IDS = [
    2002,
    2003,
    2004
];
function buildMockEquipped() {
    const now = new Date().toISOString();
    return MOCK_EQUIPPED_IDS.map((id, i)=>{
        const item = itemById.get(id);
        if (!item) return null;
        const { art: _art, ...dto } = item;
        void _art;
        const inv = {
            inventoryId: 9000 + i,
            userId: "00000000-0000-0000-0000-000000000000",
            itemId: dto.itemId,
            acquiredAt: now,
            isEquipped: true,
            avatarItem: dto
        };
        return inv;
    }).filter((x)=>x !== null);
}
function buildMockInventory() {
    const now = new Date().toISOString();
    const equippedSet = new Set(MOCK_EQUIPPED_IDS);
    return MOCK_AVATAR_ITEMS.filter((item)=>item.previewAssetUrl).map((item, i)=>{
        const { art: _art, ...dto } = item;
        void _art;
        const inv = {
            inventoryId: 9100 + i,
            userId: "00000000-0000-0000-0000-000000000000",
            itemId: dto.itemId,
            acquiredAt: now,
            isEquipped: equippedSet.has(dto.itemId),
            avatarItem: dto,
            // Positions left null so the avatar page's autoPlace assigns slots
            // based on whichever grid shape (desktop 7×5 / mobile 5×7) is active.
            positionX: null,
            positionY: null
        };
        return inv;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/api/avatar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GRANULAR_SLOTS",
    ()=>GRANULAR_SLOTS,
    "LEGACY_SLOTS",
    ()=>LEGACY_SLOTS,
    "avatarApi",
    ()=>avatarApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/client.ts [app-client] (ecmascript)");
;
const GRANULAR_SLOTS = [
    "HAT",
    "HAIR_FRONT",
    "HAIR_BACK",
    "FACE",
    "EYE",
    "EAR",
    "TOP",
    "BOTTOM",
    "OVERALL",
    "GLOVES",
    "SHOES",
    "CAPE",
    "WEAPON_FRONT",
    "WEAPON_BACK",
    "WRIST"
];
const LEGACY_SLOTS = [
    "HEAD",
    "HAIR",
    "BODY",
    "HAND",
    "BACK",
    "FEET"
];
const avatarApi = {
    catalog: (filters = {})=>{
        const qs = Object.entries(filters).filter(([, v])=>v !== undefined && v !== null).map(([k, v])=>`${k}=${encodeURIComponent(String(v))}`).join("&");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedGet"])(`/api/AvatarItems${qs ? `?${qs}` : ""}`);
    },
    getEquipped: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedGet"])(`/api/UserInventory/equipped`),
    // Full inventory for the current user (paged). Used by the avatar page to
    // tell which catalogue items the user already owns vs needs to acquire.
    getInventory: (pageNumber = 1, pageSize = 200)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedGet"])(`/api/UserInventory?pageNumber=${pageNumber}&pageSize=${pageSize}`),
    acquire: (itemId, isEquipped = false)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPost"])(`/api/UserInventory`, {
            itemId,
            isEquipped
        }),
    equip: (inventoryId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/UserInventory/${inventoryId}/equip`),
    unequip: (inventoryId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/UserInventory/${inventoryId}/unequip`),
    setPosition: (inventoryId, positionX, positionY, isRotated)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/UserInventory/${inventoryId}/position`, {
            positionX,
            positionY,
            // Omit when undefined so the backend keeps the existing value
            // (lets older callers update just the position).
            ...isRotated === undefined ? {} : {
                isRotated
            }
        }),
    release: (inventoryId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedDelete"])(`/api/UserInventory/${inventoryId}`),
    // ---- Admin / Moderator endpoints ----------------------------------------
    // These mirror the [Authorize(Roles = "Admin,Moderator")] gates in the API
    // AvatarItemsController. The client doesn't enforce roles — backend 403s
    // any caller without the right role — so the admin UI is free to hide the
    // entry points based on canManageAvatarItems() in lib/auth/roles.
    // POST /api/AvatarItems — create a new catalogue item, optionally with a
    // PNG that the backend uploads to blob storage and links via PreviewAssetUrl.
    // Use this when you have a fresh asset on disk to upload.
    createItem: (input)=>{
        const form = buildAvatarItemForm(input);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPostFormData"])(`/api/AvatarItems`, form);
    },
    // POST /api/AvatarItems/register-by-url — register a catalogue row that
    // points at an already-uploaded blob URL. Skips the multipart upload step.
    registerItemByUrl: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPost"])(`/api/AvatarItems/register-by-url`, input),
    // PUT /api/AvatarItems/{id} — update metadata + optionally replace the
    // PNG. Multipart even when no file is included; the backend reads
    // everything from form fields. The handler also requires the body's
    // ItemId to match the route id (see UpdateAvatarItemHandler.cs:32) —
    // append it explicitly so the deserialised DTO doesn't default to 0.
    updateItem: (itemId, input)=>{
        const form = buildAvatarItemForm(input);
        form.append("ItemId", String(itemId));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPutFormData"])(`/api/AvatarItems/${itemId}`, form);
    },
    // PATCH /api/AvatarItems/{id}/toggleavailability — flips isAvailable on or
    // off. No body; the backend reads the current value and inverts it.
    toggleItemAvailability: (itemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/AvatarItems/${itemId}/toggleavailability`),
    // POST /api/AvatarItems/{id}/recompute-bounds — re-fetches the item's
    // PreviewAssetUrl, runs the alpha-channel bbox scan, and stores fresh
    // content_min/max_x/y on the row. Use to fix legacy items (uploaded
    // before the bbox feature) or URL-registered items (the register-by-url
    // path doesn't compute bounds at create time). Returns the updated DTO
    // so the caller can splice it back into the list.
    recomputeBounds: (itemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPost"])(`/api/AvatarItems/${itemId}/recompute-bounds`, {}),
    // POST /api/AvatarItems/{id}/grant — Admin/Moderator grants the item to
    // a target user (or to themselves when targetEmail is omitted/empty).
    // Skips the regular point cost. autoEquip flips the new inventory row
    // to equipped (unequipping anything in the same slot first). Returns
    // the freshly created inventory row so the admin UI can confirm + the
    // host page can splice it into the user's current inventory if granting
    // to self.
    grantItem: (itemId, payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedPost"])(`/api/AvatarItems/${itemId}/grant`, {
            targetEmail: payload.targetEmail ?? null,
            autoEquip: !!payload.autoEquip
        }),
    // DELETE /api/AvatarItems/{id} — Admin-only. Hidden in the UI for
    // Moderator-only sessions; the server enforces the same restriction.
    deleteItem: (itemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authedDelete"])(`/api/AvatarItems/${itemId}`)
};
// Serialise the create/update input into a FormData payload. Centralised so
// the field-name contract with C# CreateAvatarItemDto / UpdateAvatarItemDto
// only has to be maintained once. Booleans are stringified the way ASP.NET
// model binding expects ("true" / "false"), and undefined fields are omitted
// entirely (the server keeps the existing value on update). Explicit nulls
// would require a separate "reset to default" affordance — currently the UI
// just omits unset render-hint fields rather than sending null.
function buildAvatarItemForm(input) {
    const form = new FormData();
    form.append("Name", input.name);
    form.append("Category", input.category);
    form.append("Slot", input.slot);
    form.append("Rarity", input.rarity);
    form.append("Cost", String(input.cost));
    if (input.description != null) form.append("Description", input.description);
    if (input.isAvailable !== undefined) form.append("IsAvailable", String(input.isAvailable));
    if (input.image) form.append("Image", input.image, input.image.name);
    if (input.secondaryImage) form.append("SecondaryImage", input.secondaryImage, input.secondaryImage.name);
    // Render hints — only append when set, so unset fields fall through to
    // existing DB values on update.
    if (input.coversHairFront != null) form.append("CoversHairFront", String(input.coversHairFront));
    if (input.coversHairBack != null) form.append("CoversHairBack", String(input.coversHairBack));
    if (input.offsetX != null) form.append("OffsetX", String(input.offsetX));
    if (input.offsetY != null) form.append("OffsetY", String(input.offsetY));
    if (input.renderScale != null) form.append("RenderScale", String(input.renderScale));
    if (input.sourceWidth != null) form.append("SourceWidth", String(input.sourceWidth));
    if (input.sourceHeight != null) form.append("SourceHeight", String(input.sourceHeight));
    return form;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/avatarHints.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    // Legacy filename — kept for any rows that still point at the old URL
    // before the backend's slug-naming change.
    "weapon_polearm_alien_cyber.png": {
        sourceWidth: 384,
        sourceHeight: 384,
        offsetX: 6,
        offsetY: -8,
        renderScale: 1.25
    },
    // Per-asset polearm override slot — left empty so the broader
    // polearm defaults in CLASS_HINTS apply. Re-add an entry here if a
    // specific polearm needs to deviate from the class default.
    // Staff sprite — the front layer's grip end sits at source (65, 320)
    // but the new chibi base puts its right hand around (90, 228). offsetX
    // here wins over whatever the server has on the row.
    "weapon_front_magic_staff.png": {
        offsetX: -67,
        offsetY: 1
    }
};
const CLASS_HINTS = {
    // Polearms: 384×384 canvas with the grip drawn in the lower-left of
    // the source. Calibrated against the current chibi base's hand at
    // (90, 228). renderScale 1.25 keeps the haft visually substantial.
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
    // Structural fields: server > class hints > file hints. Server values
    // win when set; otherwise prefer the class-family default over the
    // per-filename one (class defaults encode artist convention, filename
    // entries are usually one-off pre-DB stopgaps).
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
    // Positional fields: file > class > server. Per-asset filename entries
    // override the family default (so a misaligned individual polearm can
    // be hand-corrected), and both override whatever the server has.
    for (const key of [
        "offsetX",
        "offsetY"
    ]){
        if (classHints[key] != null) merged[key] = classHints[key];
        if (fileHints[key] != null) merged[key] = fileHints[key];
    }
    // Legacy single-flag coversHair → expand to both granular flags when
    // either side is unset. Server-side rows shouldn't be using this anymore
    // but mock-data fallback might.
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
"[project]/apps/web/src/lib/categoryIcons.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoryIcon",
    ()=>CategoryIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Pixelated placeholder icons per category. The user plans to replace these
// with custom artwork later — these are rough recognizable silhouettes drawn
// from string-based pixel grids so they render crisp and tint with currentColor.
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/assetPath.ts [app-client] (ecmascript)");
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
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            // Route through assetPath() so the prefix is applied on static builds.
            // Without this, `/icons/Foo.png` 404s on GitHub Pages (and any other
            // host that serves the app under a sub-path) because next.config.ts'
            // basePath only rewrites bundle URLs and next/image — plain <img src>
            // is left untouched and needs the prefix added manually.
            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assetPath"])(src),
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: size,
            height: size,
            viewBox: "0 0 10 10",
            fill: "none",
            shapeRendering: "crispEdges",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: `0 0 ${w} ${h}`,
        fill: "none",
        shapeRendering: "crispEdges",
        preserveAspectRatio: "xMidYMid meet",
        children: pixels.flatMap((row, y)=>Array.from(row).map((char, x)=>char !== "." ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
_c = CategoryIcon;
var _c;
__turbopack_context__.k.register(_c, "CategoryIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/sidebarGroups.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSidebarFilterGroups",
    ()=>buildSidebarFilterGroups
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-client] (ecmascript)");
;
function buildSidebarFilterGroups(opts) {
    const groups = [
        {
            title: opts.statusTitle,
            groupKey: "status",
            onSelect: opts.onStatusSelect,
            items: opts.statusFilters.map((f)=>({
                    value: f.value,
                    label: f.label,
                    count: opts.filterCounts[f.value] ?? 0,
                    active: f.value === opts.activeFilter,
                    dotColor: opts.statusDotColor?.(f.value) ?? null
                }))
        }
    ];
    if (opts.categories.length) {
        groups.push({
            title: "Categories",
            groupKey: "categories",
            onSelect: opts.onCategorySelect,
            items: opts.categories.map(([cat, count])=>({
                    value: cat,
                    label: cat,
                    count,
                    dotColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_COLOR"][cat] ?? "var(--color-fg-muted)",
                    active: opts.activeCategory === cat
                }))
        });
    }
    return groups;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/mockTasks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$avatarHints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/avatarHints.ts [app-client] (ecmascript)");
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
            avatarItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$avatarHints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyHints"])(r.avatarItem)
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-client] (ecmascript)");
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
                const recurringRemaining = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_CAP"] - recurringSubmittedToday;
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
"[project]/apps/web/src/app/recurring/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/tasks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/TaskDetailModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/TaskRow.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTaskActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useTaskActions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useLogCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useLogCounter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDesktopLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useDesktopLayout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useOverdueRestart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useOverdueRestart.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useSaveTask$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useSaveTask.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/NavIcons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$sidebarGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/sidebarGroups.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/dateUtils.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/time/dateUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ToastContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CategoryCapsTooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/CategoryCapsTooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$RoutineListControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/RoutineListControls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskPageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/TaskPageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DemoModeBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DemoModeBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskPageOverlays$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/TaskPageOverlays.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$MobileActionBarRecurring$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/MobileActionBarRecurring.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$PullToRefreshIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/PullToRefreshIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DesktopShell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DesktopSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$usePullToRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/usePullToRefresh.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockTasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/mockTasks.ts [app-client] (ecmascript)");
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
const MOCK_RECURRING = [
    {
        taskId: "r1",
        userId: "demo",
        title: "Morning workout",
        description: "30 min cardio or strength training",
        category: "Fitness",
        priority: "high",
        status: "pending",
        pointValue: 3,
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
        taskId: "r2",
        userId: "demo",
        title: "Read 30 minutes",
        description: null,
        category: "Learning",
        priority: "medium",
        status: "pending",
        pointValue: 2,
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
        taskId: "r3",
        userId: "demo",
        title: "Weekly review & planning",
        description: "Review last week, plan the next",
        category: "Productivity",
        priority: "high",
        status: "pending",
        pointValue: 5,
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
        taskId: "r4",
        userId: "demo",
        title: "Monthly budget review",
        description: null,
        category: "Finance",
        priority: "high",
        status: "pending",
        pointValue: 5,
        dueDate: "2026-05-15",
        createdAt: "2026-01-01T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "monthly",
        submitted: false
    },
    // Streak tier showcase
    {
        taskId: "r5",
        userId: "demo",
        title: "10-minute meditation",
        description: "Sit, breathe, settle",
        category: "Health",
        priority: "medium",
        status: "pending",
        pointValue: 3,
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
        taskId: "r6",
        userId: "demo",
        title: "Spanish — Duolingo",
        description: "Maintain the streak",
        category: "Learning",
        priority: "medium",
        status: "pending",
        pointValue: 2,
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
        taskId: "r7",
        userId: "demo",
        title: "Floss",
        description: "One more day to 2.0x",
        category: "Health",
        priority: "low",
        status: "pending",
        pointValue: 1,
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
        taskId: "r8",
        userId: "demo",
        title: "5-min stretch",
        description: null,
        category: "Fitness",
        priority: "low",
        status: "pending",
        pointValue: 1,
        dueDate: "2026-05-05",
        createdAt: "2026-04-29T00:00:00Z",
        completedAt: null,
        isRecurring: true,
        recurrenceRule: "daily",
        submitted: false,
        currentStreakCount: 6,
        longestStreakCount: 9
    }
].map(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockTasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withMockCycles"]);
const EMPTY_SET = new Set();
function tabMatches(task, tab) {
    if (tab === "all") return true;
    // Today  = actionable right now (not yet checked in for this cycle).
    // Upcoming = not yet actionable — includes both "already checked in today"
    //            and "not due yet". The undo affordance lives on those rows so
    //            a fresh check-in is reversible from the same place it landed.
    if (tab === "today") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(task.dueDate, task.recurrenceRule, task.lastCheckInDate) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(task.dueDate);
    if (tab === "missed") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(task.dueDate);
    if (tab === "upcoming") return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(task.dueDate, task.recurrenceRule, task.lastCheckInDate) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(task.dueDate);
    return true;
}
function Recurring() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const { setError, setSuccess } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [activeFilter, setActiveFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [showNewTask, setShowNewTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [detailTask, setDetailTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { beginRestart, clearRestart, isRestart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useOverdueRestart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOverdueRestart"])();
    const [counterPromptTask, setCounterPromptTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [groupMode, setGroupMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("none");
    const [sortMode, setSortMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("due");
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDesktopLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDesktopLayout"])();
    // Categories present among recurring tasks (for the icon filter strip).
    const availableCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Recurring.useMemo[availableCategories]": ()=>{
            const seen = new Set();
            for (const t of tasks)if (t.category) seen.add(t.category);
            return [
                ...seen
            ].sort();
        }
    }["Recurring.useMemo[availableCategories]"], [
        tasks
    ]);
    // Drop the active category if the user deletes the last task in it.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Recurring.useEffect": ()=>{
            if (activeCategory && !availableCategories.includes(activeCategory)) {
                setActiveCategory(null);
            }
        }
    }["Recurring.useEffect"], [
        activeCategory,
        availableCategories
    ]);
    function passesCategory(t) {
        return !activeCategory || t.category === activeCategory;
    }
    // useTaskActions requires these but recurring tasks aren't selected/staged/submitted.
    const [stagedTaskIds, setStagedTaskIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [submittedTaskIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const { advancing, pausing, slashingId, recurringPopups, handleAdvance, handleCheckIn, handleUndoCheckIn, handleUndoCheckInFromToast, handlePause, handleDelete, handleSkip, undoableCheckIn, dismissUndoableCheckIn } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTaskActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskActions"])({
        tasks,
        setTasks,
        isAuthenticated,
        stagedTaskIds,
        setStagedTaskIds,
        selectedIds,
        setSelectedIds,
        submittedTaskIds,
        setError: {
            "Recurring.useTaskActions": (msg)=>setError(msg)
        }["Recurring.useTaskActions"],
        setSuccess: {
            "Recurring.useTaskActions": (msg)=>setSuccess(msg)
        }["Recurring.useTaskActions"],
        setDetailTask
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Recurring.useEffect": ()=>{
            setIsMounted(true);
            const tab = searchParams.get("tab");
            if (tab && __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].some({
                "Recurring.useEffect": (f)=>f.value === tab
            }["Recurring.useEffect"])) setActiveFilter(tab);
            const hasToken = !!localStorage.getItem("auth_token");
            setIsAuthenticated(hasToken);
            if (!hasToken) {
                setTasks(MOCK_RECURRING);
                setLoading(false);
            }
        // searchParams is only read once on mount; URL changes are handled
        // through applyFilter which both pushes to history and updates state.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Recurring.useEffect"], []);
    const refetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Recurring.useCallback[refetch]": async ()=>{
            if (!isAuthenticated) {
                setTasks(MOCK_RECURRING);
                return;
            }
            setError(null);
            const filterParams = {
                pageSize: 50,
                pageNumber: 1,
                isRecurring: true
            };
            const taskResult = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$tasks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].getAll(filterParams);
            if (taskResult.error) {
                setError(taskResult.error);
                return;
            }
            setTasks(taskResult.data.data);
        }
    }["Recurring.useCallback[refetch]"], [
        isAuthenticated,
        setError
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Recurring.useEffect": ()=>{
            if (!isAuthenticated) return;
            setLoading(true);
            refetch().finally({
                "Recurring.useEffect": ()=>setLoading(false)
            }["Recurring.useEffect"]);
        }
    }["Recurring.useEffect"], [
        refetch,
        isAuthenticated
    ]);
    const [activeScrollEl, setActiveScrollEl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const scrollRefForPtr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Recurring.useMemo[scrollRefForPtr]": ()=>({
                current: activeScrollEl
            })
    }["Recurring.useMemo[scrollRefForPtr]"], [
        activeScrollEl
    ]);
    const pagerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { pullY, phase, triggerDistance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$usePullToRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePullToRefresh"])(scrollRefForPtr, refetch);
    function applyFilter(value) {
        setActiveFilter(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") params.delete("tab");
        else params.set("tab", value);
        const qs = params.toString();
        router.replace(qs ? `/recurring?${qs}` : "/recurring", {
            scroll: false
        });
    }
    // Stable callbacks so TaskRow's React.memo can skip re-renders when only
    // activeFilter changes (e.g. swiping the filter strip).
    const handleSubtasksChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Recurring.useCallback[handleSubtasksChange]": (taskId, subtasks)=>{
            setTasks({
                "Recurring.useCallback[handleSubtasksChange]": (prev)=>prev.map({
                        "Recurring.useCallback[handleSubtasksChange]": (tt)=>tt.taskId === taskId ? {
                                ...tt,
                                subtasks
                            } : tt
                    }["Recurring.useCallback[handleSubtasksChange]"])
            }["Recurring.useCallback[handleSubtasksChange]"]);
        }
    }["Recurring.useCallback[handleSubtasksChange]"], []);
    const handleRestartOverdue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Recurring.useCallback[handleRestartOverdue]": (t)=>{
            beginRestart(t);
            setDetailTask(t);
        }
    }["Recurring.useCallback[handleRestartOverdue]"], [
        beginRestart
    ]);
    const requestCheckIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Recurring.useCallback[requestCheckIn]": (t)=>{
            if (t.hasCounter) {
                // Goal already met via prior +/- logs → skip the prompt; the user
                // doesn't need to enter another value just to confirm the check-in.
                const goal = t.counterGoal ?? 0;
                if (goal > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sumTodayCycleCounter"])(t.recentCycles) >= goal) {
                    handleCheckIn(t);
                    return;
                }
                setCounterPromptTask(t);
                return;
            }
            handleCheckIn(t);
        }
    }["Recurring.useCallback[requestCheckIn]"], [
        handleCheckIn
    ]);
    const { logPromptTask, requestLog, cancelLog, submitLog, flushQuickLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useLogCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogCounter"])({
        isAuthenticated,
        setTasks,
        setDetailTask,
        setError
    });
    const noopToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Recurring.useCallback[noopToggle]": ()=>{}
    }["Recurring.useCallback[noopToggle]"], []);
    const handleSaveTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useSaveTask$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSaveTask"])({
        detailTask,
        setDetailTask,
        setTasks,
        isAuthenticated,
        isRestart: isRestart(detailTask),
        clearRestart
    });
    if (!isMounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                background: "var(--color-bg)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-5 h-5 border-2 rounded-full animate-spin",
                style: {
                    borderColor: "var(--color-border)",
                    borderTopColor: "var(--color-accent)"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                lineNumber: 198,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
            lineNumber: 197,
            columnNumber: 7
        }, this);
    }
    const sep = (label, sepKey)=>({
            __sep: true,
            label,
            sepKey
        });
    const PRIORITY_ORDER = {
        high: 0,
        medium: 1,
        low: 2
    };
    const FREQUENCY_ORDER = [
        "daily",
        "weekdays",
        "weekly",
        "biweekly",
        "monthly"
    ];
    const FREQUENCY_LABEL = {
        daily: "Daily",
        weekdays: "Weekdays",
        weekly: "Weekly",
        biweekly: "Biweekly",
        monthly: "Monthly"
    };
    const byDueDate = (a, b)=>{
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    };
    const sortRecurring = (a, b)=>{
        const aReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(a.dueDate, a.recurrenceRule, a.lastCheckInDate) ? 0 : 1;
        const bReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(b.dueDate, b.recurrenceRule, b.lastCheckInDate) ? 0 : 1;
        if (aReady !== bReady) return aReady - bReady;
        switch(sortMode){
            case "streak":
                return (b.currentStreakCount ?? 0) - (a.currentStreakCount ?? 0);
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
    // A task counts as "checked in this cycle" when its dueDate has been
    // advanced past today by a check-in. Before any check-in, dueDate equals
    // today (open for check-in) or is in the past (overdue, filtered above).
    // After check-in, dueDate is strictly > today and lastCheckInDate is set,
    // so the pair (today < due, lastCheckInDate present) uniquely identifies
    // the "already completed this cycle, waiting for the next window" state.
    //
    // Earlier attempts compared lastCheckInDate to a period-derived prevStart;
    // that mis-fires for daily tasks where yesterday's check-in date and
    // today's prevStart coincide, classifying a still-pending task as done.
    function isCheckedInThisCycle(t) {
        if (!t.lastCheckInDate || !t.dueDate || !t.recurrenceRule) return false;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(t.dueDate)) return false;
        const due = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseLocalDate"])(t.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today < due;
    }
    function buildListItemsForFilter(filterValue) {
        const filtered = tasks.filter((t)=>tabMatches(t, filterValue) && passesCategory(t));
        if (groupMode === "frequency") {
            const buckets = new Map();
            for (const t of filtered){
                const key = t.recurrenceRule ?? "__none";
                if (!buckets.has(key)) buckets.set(key, []);
                buckets.get(key).push(t);
            }
            const keys = [
                ...buckets.keys()
            ].sort((a, b)=>{
                const ai = FREQUENCY_ORDER.indexOf(a);
                const bi = FREQUENCY_ORDER.indexOf(b);
                if (ai === -1 && bi === -1) return a.localeCompare(b);
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
            });
            const items = [];
            for (const key of keys){
                const label = FREQUENCY_LABEL[key] ?? key;
                items.push(sep(label, `__sep-freq-${key}`), ...buckets.get(key).sort(sortRecurring));
            }
            return items;
        }
        if (groupMode === "category") {
            const buckets = new Map();
            for (const t of filtered){
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
            const items = [];
            for (const key of keys){
                const label = key === "__none" ? "No Category" : key;
                items.push(sep(label, `__sep-cat-${key}`), ...buckets.get(key).sort(sortRecurring));
            }
            return items;
        }
        const sorted = [
            ...filtered
        ].sort(sortRecurring);
        if (filterValue === "all") {
            const active = [];
            const checkedIn = [];
            for (const t of sorted){
                if (isCheckedInThisCycle(t)) checkedIn.push(t);
                else active.push(t);
            }
            if (active.length > 0 && checkedIn.length > 0) {
                return [
                    ...active,
                    sep("Checked In", "__sep-checked-in"),
                    ...checkedIn
                ];
            }
        }
        return sorted;
    }
    function renderFilterPage(filterValue) {
        const filtered = tasks.filter((t)=>tabMatches(t, filterValue) && passesCategory(t));
        if (tasks.length > 0 && filtered.length === 0) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-center py-20 gap-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm tracking-widest uppercase",
                    style: {
                        color: "var(--color-fg-subtle)"
                    },
                    children: filterValue === "today" ? "Nothing due today" : filterValue === "upcoming" ? "Nothing upcoming" : filterValue === "missed" ? "Nothing missed" : "No tasks"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                    lineNumber: 313,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                lineNumber: 312,
                columnNumber: 9
            }, this);
        }
        const pageItems = buildListItemsForFilter(filterValue);
        const chunks = [];
        let current = {
            sep: null,
            tasks: []
        };
        for (const item of pageItems){
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: chunks.map((chunk, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: chunk.sep ? "relative" : undefined,
                        marginTop: chunk.sep ? idx > 0 ? "14px" : "10px" : undefined
                    },
                    children: [
                        chunk.sep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "tracking-widest uppercase text-[9px]",
                            style: {
                                position: "absolute",
                                top: "-6px",
                                left: "4px",
                                padding: "0 6px",
                                background: "var(--color-bg)",
                                color: "var(--color-fg-subtle)",
                                lineHeight: 1,
                                zIndex: 1
                            },
                            children: chunk.sep.label
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                            lineNumber: 344,
                            columnNumber: 15
                        }, this),
                        chunk.tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "task-list-panel flex flex-col",
                            style: {
                                background: "var(--color-surface-deep)",
                                borderRadius: 6,
                                overflow: "hidden"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "task-row-wrapper task-row-phantom",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "task-row-inner",
                                        style: {
                                            position: "absolute",
                                            inset: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 17
                                }, this),
                                chunk.tasks.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        task: item,
                                        activeFilter: "all",
                                        advancing: advancing,
                                        pausing: pausing,
                                        slashingId: slashingId,
                                        filingIds: EMPTY_SET,
                                        recentlyFiledIds: EMPTY_SET,
                                        selectedIds: EMPTY_SET,
                                        submittedTaskIds: submittedTaskIds,
                                        recurringPopup: recurringPopups.get(item.taskId),
                                        penalizedTaskIds: EMPTY_SET,
                                        onAdvance: handleAdvance,
                                        onCheckIn: requestCheckIn,
                                        onPause: handlePause,
                                        onDelete: handleDelete,
                                        onSkip: handleSkip,
                                        onToggleSelect: noopToggle,
                                        onOpenDetail: setDetailTask,
                                        onRestartOverdue: handleRestartOverdue,
                                        onSubtasksChange: handleSubtasksChange,
                                        onUndoCheckIn: handleUndoCheckIn,
                                        onLog: requestLog,
                                        isOpenInDetail: isDesktop && detailTask?.taskId === item.taskId
                                    }, item.taskId, false, {
                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                        lineNumber: 366,
                                        columnNumber: 19
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "task-row-wrapper task-row-phantom",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "task-row-inner",
                                        style: {
                                            position: "absolute",
                                            inset: 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                        lineNumber: 394,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                    lineNumber: 393,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                            lineNumber: 361,
                            columnNumber: 15
                        }, this)
                    ]
                }, chunk.sep?.sepKey ?? `__chunk-${idx}`, true, {
                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                    lineNumber: 336,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
            lineNumber: 334,
            columnNumber: 7
        }, this);
    }
    const todayCount = tasks.filter((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(t.dueDate, t.recurrenceRule, t.lastCheckInDate) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(t.dueDate)).length;
    const missedCount = tasks.filter((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOverdue"])(t.dueDate)).length;
    // Per-status counts for the desktop sidebar (respects the active category).
    const filterCounts = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].reduce((acc, f)=>{
        acc[f.value] = tasks.filter((t)=>tabMatches(t, f.value) && passesCategory(t)).length;
        return acc;
    }, {});
    // Detail panel — rendered inline on desktop, as a modal on mobile.
    const taskDetailNode = (()=>{
        if (!detailTask) return null;
        const dt = detailTask;
        const dtIsRestart = isRestart(dt);
        const closeDetail = ()=>{
            clearRestart();
            setDetailTask(null);
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            task: dt,
            currentStreakCount: dt.currentStreakCount,
            longestStreakCount: dt.longestStreakCount,
            onClose: closeDetail,
            canUndo: false,
            isActing: advancing === dt.taskId || pausing === dt.taskId || slashingId === dt.taskId,
            onCheckIn: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate) ? ()=>{
                closeDetail();
                requestCheckIn(dt);
            } : undefined,
            checkInBlocked: !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$time$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCheckInNow"])(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate),
            onFlushQuickLog: dt.hasCounter ? flushQuickLog : undefined,
            onDelete: ()=>{
                closeDetail();
                handleDelete(dt.taskId);
            },
            onSave: handleSaveTask,
            onSubtasksChange: (subtasks)=>setTasks((prev)=>prev.map((t)=>t.taskId === dt.taskId ? {
                            ...t,
                            subtasks
                        } : t)),
            initialEditMode: dtIsRestart,
            mustReschedule: dtIsRestart,
            inline: isDesktop
        }, dt.taskId, false, {
            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
            lineNumber: 420,
            columnNumber: 7
        }, this);
    })();
    // Top-level overlays/banners shared by both layouts.
    const sharedOverlays = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskPageOverlays$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        showNewTask: showNewTask,
        onCloseNewTask: ()=>setShowNewTask(false),
        onTaskCreated: (task)=>{
            setTasks((prev)=>[
                    task,
                    ...prev
                ]);
            setShowNewTask(false);
        },
        newTaskInitialRecurring: true,
        counterPromptTask: counterPromptTask,
        onCloseCounterPrompt: ()=>setCounterPromptTask(null),
        onSubmitCounterCheckIn: (t, value)=>{
            setCounterPromptTask(null);
            handleCheckIn(t, value);
        },
        logPromptTask: logPromptTask,
        onCancelLog: cancelLog,
        onSubmitLog: submitLog,
        undoableCheckIn: undoableCheckIn,
        tasks: tasks,
        onUndoCheckInFromToast: handleUndoCheckInFromToast,
        onDismissUndoableCheckIn: dismissUndoableCheckIn
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
        lineNumber: 443,
        columnNumber: 5
    }, this);
    if (isDesktop) {
        const sidebar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            navItems: [
                {
                    href: "/",
                    label: "To Do",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavIconList"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                        lineNumber: 465,
                        columnNumber: 46
                    }, void 0)
                },
                {
                    href: "/recurring",
                    label: "Routines",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavIconRepeat"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                        lineNumber: 466,
                        columnNumber: 58
                    }, void 0),
                    active: true
                }
            ],
            footerNavItems: [
                {
                    href: "/archive",
                    label: "Archive",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavIconArchive"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                        lineNumber: 469,
                        columnNumber: 55
                    }, void 0)
                },
                ...!isAuthenticated ? [
                    {
                        href: "/avatar",
                        label: "Avatar",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$NavIcons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavIconAvatar"], {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                            lineNumber: 470,
                            columnNumber: 77
                        }, void 0)
                    }
                ] : []
            ],
            filterGroups: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$sidebarGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSidebarFilterGroups"])({
                statusTitle: "View",
                statusFilters: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"],
                activeFilter,
                filterCounts,
                statusDotColor: (value)=>value === "today" && todayCount > 0 ? "var(--color-active-highlight-alt)" : value === "missed" && missedCount > 0 ? "var(--color-danger)" : null,
                onStatusSelect: applyFilter,
                categories: availableCategories.map((cat)=>[
                        cat,
                        tasks.filter((t)=>t.category === cat).length
                    ]),
                activeCategory,
                onCategorySelect: (v)=>setActiveCategory((prev)=>prev === v ? null : v)
            })
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
            lineNumber: 463,
            columnNumber: 7
        }, this);
        const main = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col flex-1 overflow-hidden recurring-scope",
            style: {
                background: "var(--color-bg)"
            },
            children: [
                !isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DemoModeBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    className: "mx-6 mt-4 mb-2"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                    lineNumber: 490,
                    columnNumber: 30
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$TaskPageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    capsVariant: "recurring",
                    filterLabel: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].find((f)=>f.value === activeFilter)?.label ?? "All",
                    activeCategory: activeCategory,
                    newTaskLabel: "New routine",
                    isAuthenticated: isAuthenticated,
                    onNewTask: ()=>setShowNewTask(true),
                    controls: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$RoutineListControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sortMode: sortMode,
                        groupMode: groupMode,
                        onSortChange: setSortMode,
                        onGroupChange: setGroupMode
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                        lineNumber: 499,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                    lineNumber: 491,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-auto px-6 py-4",
                    children: !loading && renderFilterPage(activeFilter)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                    lineNumber: 507,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
            lineNumber: 489,
            columnNumber: 7
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DesktopShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    sidebar: sidebar,
                    main: main,
                    detail: taskDetailNode
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                    lineNumber: 514,
                    columnNumber: 9
                }, this),
                sharedOverlays
            ]
        }, void 0, true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "recurring-scope task-page-shell flex flex-col bg-scanlines overflow-hidden",
                style: {
                    background: "var(--color-bg)",
                    color: "var(--color-fg)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full mx-auto px-3 sm:px-4 flex flex-col flex-1 overflow-hidden has-mobile-bottom-pad",
                    style: {
                        maxWidth: 420
                    },
                    children: [
                        !isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DemoModeBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                            lineNumber: 528,
                            columnNumber: 32
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                paddingTop: 32,
                                background: "var(--color-bg)"
                            },
                            children: [
                                (()=>{
                                    const label = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].find((f)=>f.value === activeFilter)?.label ?? "Routines";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 sm:mb-4 pl-[14px] sm:pl-[20px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 12,
                                                fontWeight: 600,
                                                letterSpacing: "0.24em",
                                                textTransform: "uppercase",
                                                color: "var(--color-fg)"
                                            },
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 535,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                        lineNumber: 534,
                                        columnNumber: 17
                                    }, this);
                                })(),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:flex items-center mb-2",
                                    style: {
                                        borderBottom: "1px solid var(--color-border-faint)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].map((f)=>{
                                                const dotCount = f.value === "today" ? todayCount : f.value === "missed" ? missedCount : 0;
                                                const dotColor = f.value === "today" ? "var(--color-active-highlight-alt)" : "var(--color-danger)";
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>applyFilter(f.value),
                                                    className: "px-4 py-3 text-xs tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5 whitespace-nowrap",
                                                    style: {
                                                        color: activeFilter === f.value ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                                                        background: "transparent",
                                                        border: "none"
                                                    },
                                                    children: [
                                                        f.label,
                                                        dotCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                                            style: {
                                                                background: dotColor
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 23
                                                        }, this),
                                                        activeFilter === f.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute bottom-0 left-0 right-0 h-px",
                                                            style: {
                                                                background: "var(--color-active-highlight)"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                            lineNumber: 566,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, f.value, true, {
                                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 19
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 550,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 572,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$CategoryCapsTooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            variant: "recurring",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                tabIndex: 0,
                                                "aria-label": "Show routine point caps",
                                                className: "flex items-center justify-center mr-1",
                                                style: {
                                                    width: 26,
                                                    height: 26,
                                                    color: "var(--color-fg-muted)",
                                                    cursor: "help"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    width: "13",
                                                    height: "13",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M21 12a9 9 0 1 1-3-6.7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "21 4 21 10 15 10"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                            lineNumber: 583,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                lineNumber: 574,
                                                columnNumber: 15
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 573,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$RoutineListControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            sortMode: sortMode,
                                            groupMode: groupMode,
                                            onSortChange: setSortMode,
                                            onGroupChange: setGroupMode,
                                            compactLabel: true
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 587,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>!isAuthenticated ? undefined : setShowNewTask(true),
                                            disabled: !isAuthenticated,
                                            title: !isAuthenticated ? "Sign in to create tasks" : "New task",
                                            "aria-label": "New task",
                                            className: "flex items-center justify-center ml-1 mb-px",
                                            style: {
                                                width: 26,
                                                height: 26,
                                                fontSize: "18px",
                                                lineHeight: 1,
                                                background: "transparent",
                                                border: "none",
                                                color: "var(--color-fg)",
                                                cursor: !isAuthenticated ? "not-allowed" : "pointer",
                                                opacity: !isAuthenticated ? 0.3 : 1,
                                                padding: 0
                                            },
                                            onMouseEnter: (e)=>{
                                                if (isAuthenticated) e.currentTarget.style.color = "var(--color-active-highlight-alt)";
                                            },
                                            onMouseLeave: (e)=>e.currentTarget.style.color = "var(--color-fg)",
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 594,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                    lineNumber: 549,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid text-[10px] tracking-widest uppercase mx-1 sm:mx-2.5 pl-3 sm:pl-4 pr-0 py-2 select-none",
                                    style: {
                                        gridTemplateColumns: "1fr 64px 60px",
                                        maxWidth: 420,
                                        color: "var(--color-fg-muted)",
                                        position: "relative",
                                        zIndex: 2,
                                        background: "var(--color-bg)"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "-ml-0.5 sm:-ml-1.5",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                        lineNumber: 622,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                    lineNumber: 618,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                            lineNumber: 530,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-hidden",
                            children: [
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center py-20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-5 h-5 border-2 rounded-full animate-spin",
                                        style: {
                                            borderColor: "var(--color-border)",
                                            borderTopColor: "var(--color-active-highlight-alt)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                        lineNumber: 629,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                    lineNumber: 628,
                                    columnNumber: 15
                                }, this),
                                !loading && tasks.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center py-20 gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm tracking-widest uppercase",
                                            style: {
                                                color: "var(--color-fg-muted)"
                                            },
                                            children: "No routines"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 635,
                                            columnNumber: 17
                                        }, this),
                                        isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowNewTask(true),
                                            className: "text-[10px] tracking-widest uppercase mt-2 cursor-pointer",
                                            style: {
                                                color: "var(--color-active-highlight-alt)",
                                                background: "transparent",
                                                border: "1px solid var(--color-active-highlight-alt-border)",
                                                borderRadius: "3px",
                                                padding: "6px 14px"
                                            },
                                            children: "+ Create one"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                            lineNumber: 637,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                    lineNumber: 634,
                                    columnNumber: 15
                                }, this),
                                !loading && tasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        overflow: "hidden",
                                        width: "100%",
                                        height: "100%"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: pagerRef,
                                        style: {
                                            display: "flex",
                                            width: `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].length * 100}%`,
                                            height: "100%",
                                            transform: `translateX(${-__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].findIndex((f)=>f.value === activeFilter) * (100 / __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].length)}%)`,
                                            transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                                            willChange: "transform"
                                        },
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].map((f)=>{
                                            const isActivePage = f.value === activeFilter;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                ref: isActivePage ? setActiveScrollEl : null,
                                                className: "has-mobile-bottom-pad px-1 sm:px-2.5",
                                                style: {
                                                    flex: `0 0 ${100 / __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"].length}%`,
                                                    minWidth: 0,
                                                    boxSizing: "border-box",
                                                    height: "100%",
                                                    overflowY: "auto",
                                                    overscrollBehavior: "contain"
                                                },
                                                children: [
                                                    isActivePage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$PullToRefreshIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        pullY: pullY,
                                                        phase: phase,
                                                        triggerDistance: triggerDistance
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                        lineNumber: 677,
                                                        columnNumber: 42
                                                    }, this),
                                                    renderFilterPage(f.value)
                                                ]
                                            }, f.value, true, {
                                                fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                                lineNumber: 664,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                        lineNumber: 650,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                                    lineNumber: 649,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                            lineNumber: 626,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                    lineNumber: 527,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                lineNumber: 526,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$MobileActionBarRecurring$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                filters: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECURRING_FILTERS"],
                activeFilter: activeFilter,
                onFilterChange: applyFilter,
                getCount: (v)=>tasks.filter((t)=>tabMatches(t, v) && passesCategory(t)).length,
                badgeColor: (v)=>{
                    if (v === "today" && todayCount > 0) return "var(--color-active-highlight-alt)";
                    if (v === "missed" && missedCount > 0) return "var(--color-danger)";
                    return null;
                },
                sortMode: sortMode,
                groupMode: groupMode,
                onSortChange: setSortMode,
                onGroupChange: setGroupMode,
                onNewTask: ()=>setShowNewTask(true),
                isAuthenticated: isAuthenticated,
                pagerRef: pagerRef,
                availableCategories: availableCategories,
                activeCategory: activeCategory,
                onCategoryChange: setActiveCategory
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/recurring/page.tsx",
                lineNumber: 689,
                columnNumber: 7
            }, this),
            taskDetailNode,
            sharedOverlays
        ]
    }, void 0, true);
}
_s(Recurring, "0rWK4gnV1X9uy+L68HPoFRJM9Yk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useOverdueRestart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOverdueRestart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDesktopLayout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDesktopLayout"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTaskActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskActions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$usePullToRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePullToRefresh"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useLogCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogCounter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useSaveTask$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSaveTask"]
    ];
});
_c = Recurring;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Recurring, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/recurring/page.tsx",
            lineNumber: 720,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/recurring/page.tsx",
        lineNumber: 719,
        columnNumber: 5
    }, this);
}
_c1 = Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "Recurring");
__turbopack_context__.k.register(_c1, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_926dc6a1._.js.map