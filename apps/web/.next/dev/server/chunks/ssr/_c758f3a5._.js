module.exports = [
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
"[project]/apps/web/src/lib/mockAvatar.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/apps/web/src/lib/imageBounds.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Client-side content-bounds detector. Same alpha-scan idea as the server's
// ContentBoundsService, run in the browser as a fallback for items that
// don't yet have server-computed bounds — items uploaded before the bbox
// feature shipped, registered via URL on an older build, or just not yet
// Recenter-ed by an admin.
//
// CORS caveat: drawing a cross-origin image into a canvas taints it and
// makes getImageData() throw a SecurityError. To avoid that, we load the
// image with `crossOrigin: "anonymous"` — which means the origin serving
// the asset (Azure blob storage, a third-party CDN, etc.) must respond
// with `Access-Control-Allow-Origin`. Same-origin sources (e.g.
// assetPath("/avatars/...")) work without any server config.
//
// When CORS fails or the image won't load, computeImageBounds() resolves
// to null — the caller falls back to whatever default it had (server
// bounds, slot defaults, etc.). Failures are never thrown.
//
// Cache: results live in a module-level Map keyed by URL. The same Promise
// is reused while a scan is in flight, so a grid with 30 items only
// triggers 30 fetches (not 30 × however many renders).
__turbopack_context__.s([
    "computeImageBounds",
    ()=>computeImageBounds
]);
const ALPHA_THRESHOLD = 16; // 16/255 ≈ 6%. Mirrors server constant.
const cache = new Map();
function computeImageBounds(url) {
    if (!url) return Promise.resolve(null);
    const cached = cache.get(url);
    if (cached) return cached;
    // Defer to runtime — during SSR / static export the canvas API isn't
    // available; we'd otherwise throw on the first call. Resolving null
    // means the server-bounds / slot-default path takes over for that
    // render, and the client-side scan fires on hydration.
    if ("TURBOPACK compile-time truthy", 1) {
        return Promise.resolve(null);
    }
    //TURBOPACK unreachable
    ;
    const p = undefined;
}
}),
"[project]/apps/web/src/lib/cardTransform.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "boundsTransformFor",
    ()=>boundsTransformFor,
    "useClientBounds",
    ()=>useClientBounds
]);
// Shared CSS-transform helper for any "preview the item's PNG in a square
// box" surface — the inventory cards on /avatar, and the row thumbnails
// in AvatarAdminPanel both consume this. Keeps the auto-centring math in
// one place so the two views stay visually consistent.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$imageBounds$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/imageBounds.ts [app-ssr] (ecmascript)");
;
;
function boundsTransformFor(item, override, options) {
    const contentMinX = override?.minX ?? item.contentMinX;
    const contentMinY = override?.minY ?? item.contentMinY;
    const contentMaxX = override?.maxX ?? item.contentMaxX;
    const contentMaxY = override?.maxY ?? item.contentMaxY;
    if (contentMinX == null || contentMinY == null || contentMaxX == null || contentMaxY == null) return null;
    const sourceW = override?.sourceWidth ?? item.sourceWidth ?? 256;
    const sourceH = override?.sourceHeight ?? item.sourceHeight ?? 384;
    const cols = options?.cols ?? item.gridCols ?? 1;
    const rows = options?.rows ?? item.gridRows ?? 1;
    const fillFactor = options?.fillFactor ?? 0.75;
    const bboxW = Math.max(1, contentMaxX - contentMinX);
    const bboxH = Math.max(1, contentMaxY - contentMinY);
    const bboxCx = (contentMinX + contentMaxX) / 2;
    const bboxCy = (contentMinY + contentMaxY) / 2;
    const dispFracX = Math.min(1, sourceW * rows / (sourceH * cols));
    const dispFracY = Math.min(1, sourceH * cols / (sourceW * rows));
    const fx = (bboxCx - sourceW / 2) / sourceW;
    const fy = (bboxCy - sourceH / 2) / sourceH;
    const tx = -fx * 100 * dispFracX;
    const ty = -fy * 100 * dispFracY;
    const effSrcW = Math.max(sourceW, sourceH * cols / rows);
    const effSrcH = Math.max(sourceW * rows / cols, sourceH);
    const scale = fillFactor * Math.min(effSrcW / bboxW, effSrcH / bboxH);
    return `scale(${scale.toFixed(3)}) translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%)`;
}
function useClientBounds(url) {
    const [bounds, setBounds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!url) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBounds(null);
            return;
        }
        let cancelled = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$imageBounds$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeImageBounds"])(url).then((b)=>{
            if (!cancelled) setBounds(b);
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        url
    ]);
    return bounds;
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
"[project]/apps/web/src/lib/api/avatar.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GRANULAR_SLOTS",
    ()=>GRANULAR_SLOTS,
    "LEGACY_SLOTS",
    ()=>LEGACY_SLOTS,
    "avatarApi",
    ()=>avatarApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/client.ts [app-ssr] (ecmascript)");
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedGet"])(`/api/AvatarItems${qs ? `?${qs}` : ""}`);
    },
    getEquipped: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedGet"])(`/api/UserInventory/equipped`),
    // Full inventory for the current user (paged). Used by the avatar page to
    // tell which catalogue items the user already owns vs needs to acquire.
    getInventory: (pageNumber = 1, pageSize = 200)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedGet"])(`/api/UserInventory?pageNumber=${pageNumber}&pageSize=${pageSize}`),
    acquire: (itemId, isEquipped = false)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPost"])(`/api/UserInventory`, {
            itemId,
            isEquipped
        }),
    equip: (inventoryId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/UserInventory/${inventoryId}/equip`),
    unequip: (inventoryId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/UserInventory/${inventoryId}/unequip`),
    setPosition: (inventoryId, positionX, positionY, isRotated)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/UserInventory/${inventoryId}/position`, {
            positionX,
            positionY,
            // Omit when undefined so the backend keeps the existing value
            // (lets older callers update just the position).
            ...isRotated === undefined ? {} : {
                isRotated
            }
        }),
    release: (inventoryId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedDelete"])(`/api/UserInventory/${inventoryId}`),
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPostFormData"])(`/api/AvatarItems`, form);
    },
    // POST /api/AvatarItems/register-by-url — register a catalogue row that
    // points at an already-uploaded blob URL. Skips the multipart upload step.
    registerItemByUrl: (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPost"])(`/api/AvatarItems/register-by-url`, input),
    // PUT /api/AvatarItems/{id} — update metadata + optionally replace the
    // PNG. Multipart even when no file is included; the backend reads
    // everything from form fields. The handler also requires the body's
    // ItemId to match the route id (see UpdateAvatarItemHandler.cs:32) —
    // append it explicitly so the deserialised DTO doesn't default to 0.
    updateItem: (itemId, input)=>{
        const form = buildAvatarItemForm(input);
        form.append("ItemId", String(itemId));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPutFormData"])(`/api/AvatarItems/${itemId}`, form);
    },
    // PATCH /api/AvatarItems/{id}/toggleavailability — flips isAvailable on or
    // off. No body; the backend reads the current value and inverts it.
    toggleItemAvailability: (itemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPatch"])(`/api/AvatarItems/${itemId}/toggleavailability`),
    // POST /api/AvatarItems/{id}/recompute-bounds — re-fetches the item's
    // PreviewAssetUrl, runs the alpha-channel bbox scan, and stores fresh
    // content_min/max_x/y on the row. Use to fix legacy items (uploaded
    // before the bbox feature) or URL-registered items (the register-by-url
    // path doesn't compute bounds at create time). Returns the updated DTO
    // so the caller can splice it back into the list.
    recomputeBounds: (itemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPost"])(`/api/AvatarItems/${itemId}/recompute-bounds`, {}),
    // POST /api/AvatarItems/{id}/grant — Admin/Moderator grants the item to
    // a target user (or to themselves when targetEmail is omitted/empty).
    // Skips the regular point cost. autoEquip flips the new inventory row
    // to equipped (unequipping anything in the same slot first). Returns
    // the freshly created inventory row so the admin UI can confirm + the
    // host page can splice it into the user's current inventory if granting
    // to self.
    grantItem: (itemId, payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedPost"])(`/api/AvatarItems/${itemId}/grant`, {
            targetEmail: payload.targetEmail ?? null,
            autoEquip: !!payload.autoEquip
        }),
    // DELETE /api/AvatarItems/{id} — Admin-only. Hidden in the UI for
    // Moderator-only sessions; the server enforces the same restriction.
    deleteItem: (itemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authedDelete"])(`/api/AvatarItems/${itemId}`)
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
}),
"[project]/apps/web/src/hooks/useEquippedAvatar.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearEquippedAvatarCache",
    ()=>clearEquippedAvatarCache,
    "primeEquippedAvatarCache",
    ()=>primeEquippedAvatarCache,
    "useEquippedAvatar",
    ()=>useEquippedAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/avatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/avatar/hints.ts [app-ssr] (ecmascript)");
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
            avatarItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyHints"])(r.avatarItem)
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
    const [equipped, setEquipped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(cache);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const token = undefined;
        let cancelled;
    }, []);
    return equipped;
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
"[project]/apps/web/src/lib/auth/roles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canManageAvatarItems",
    ()=>canManageAvatarItems,
    "decodeJwtPayload",
    ()=>decodeJwtPayload,
    "getCurrentRoles",
    ()=>getCurrentRoles,
    "hasRole",
    ()=>hasRole,
    "isAdmin",
    ()=>isAdmin,
    "isModerator",
    ()=>isModerator,
    "rolesFromPayload",
    ()=>rolesFromPayload
]);
// Role detection from the JWT in localStorage. The backend (TokenService.cs)
// encodes roles as repeated `ClaimTypes.Role` claims — that's the long-form
// namespace below — and the JWT payload is base64url-encoded JSON between the
// two dots in the token.
//
// We decode on the client purely for UX (showing/hiding admin UI). The backend
// re-validates every protected request via `[Authorize(Roles = "...")]`, so a
// tampered token won't actually let you call admin endpoints — the worst case
// is the user sees the admin panel and every action 403s.
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
function decodeJwtPayload(token) {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        // Convert base64url → base64. The JWT spec uses URL-safe base64 (no
        // padding, "-" and "_" instead of "+" and "/"); atob wants standard
        // base64 with padding.
        const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = b64 + "===".slice((b64.length + 3) % 4);
        const json = atob(padded);
        return JSON.parse(json);
    } catch  {
        return null;
    }
}
function rolesFromPayload(payload) {
    if (!payload) return new Set();
    const raw = payload[ROLE_CLAIM];
    if (raw == null) return new Set();
    if (Array.isArray(raw)) return new Set(raw.map(String));
    return new Set([
        String(raw)
    ]);
}
function getCurrentRoles() {
    if ("TURBOPACK compile-time truthy", 1) return new Set();
    //TURBOPACK unreachable
    ;
    const token = undefined;
}
function hasRole(role) {
    return getCurrentRoles().has(role);
}
function isAdmin() {
    return hasRole("Admin");
}
function isModerator() {
    return hasRole("Moderator");
}
function canManageAvatarItems() {
    const roles = getCurrentRoles();
    return roles.has("Admin") || roles.has("Moderator");
}
}),
"[project]/apps/web/src/hooks/useUserRoles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUserRoles",
    ()=>useUserRoles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/roles.ts [app-ssr] (ecmascript)");
"use client";
;
;
function useUserRoles() {
    const [roles, setRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        ready: false,
        isAdmin: false,
        isModerator: false,
        canManageAvatarItems: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const token = window.localStorage.getItem("auth_token");
        const set = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rolesFromPayload"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeJwtPayload"])(token));
        const a = set.has("Admin");
        const m = set.has("Moderator");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRoles({
            ready: true,
            isAdmin: a,
            isModerator: m,
            canManageAvatarItems: a || m
        });
    }, []);
    return roles;
}
}),
"[project]/apps/web/src/components/AvatarItemFormModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AvatarItemFormModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/avatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/assetPath.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const RARITIES = [
    "COMMON",
    "UNCOMMON",
    "RARE",
    "EPIC",
    "LEGENDARY"
];
// Slot-aware category suggestions surfaced via <datalist> as the admin types.
// The backend stores category as free-text (50-char limit) so these are
// non-binding hints — new categories can still be invented on the fly.
const CATEGORIES_BY_SLOT = {
    HAT: [
        "hat",
        "headband",
        "headgear",
        "helmet",
        "crown"
    ],
    HAIR_FRONT: [
        "hair"
    ],
    HAIR_BACK: [
        "hair"
    ],
    FACE: [
        "mask",
        "scar",
        "facial-hair",
        "mouth"
    ],
    EYE: [
        "glasses",
        "eyepatch",
        "eye-makeup"
    ],
    EAR: [
        "earring",
        "ear-cuff",
        "ear-stud"
    ],
    TOP: [
        "t-shirt",
        "sweater",
        "hoodie",
        "jacket",
        "vest"
    ],
    BOTTOM: [
        "pants",
        "shorts",
        "skirt"
    ],
    OVERALL: [
        "dress",
        "robe",
        "jumpsuit",
        "kimono"
    ],
    CAPE: [
        "cape",
        "wings",
        "scarf"
    ],
    GLOVES: [
        "gloves",
        "mittens"
    ],
    SHOES: [
        "boots",
        "sneakers",
        "sandals"
    ],
    WEAPON_FRONT: [
        "sword",
        "staff",
        "bow",
        "polearm"
    ],
    WEAPON_BACK: [
        "quiver",
        "holster",
        "sheath"
    ],
    WRIST: [
        "bracelet",
        "watch"
    ],
    // Legacy slots fall back to a generic set so old rows can still be edited.
    HEAD: [
        "headwear"
    ],
    HAIR: [
        "hair"
    ],
    BODY: [
        "outerwear"
    ],
    HAND: [
        "tool",
        "weapon"
    ],
    BACK: [
        "back"
    ],
    FEET: [
        "footwear"
    ]
};
function categorySuggestionsFor(slot) {
    return CATEGORIES_BY_SLOT[slot] ?? [];
}
function AvatarItemFormModal({ mode, onClose, onSaved }) {
    const isEdit = mode.kind === "edit";
    const seed = mode.kind === "edit" ? mode.item : null;
    const [createMode, setCreateMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("upload");
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.name ?? "");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.category ?? "");
    const [slot, setSlot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.slot ?? "HEAD");
    const [rarity, setRarity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.rarity ?? "COMMON");
    const [cost, setCost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed ? String(seed.cost) : "0");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.description ?? "");
    const [isAvailable, setIsAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.isAvailable ?? true);
    const [previewAssetUrl, setPreviewAssetUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.previewAssetUrl ?? "");
    // Convenience flag exposed only in URL-register create mode — the server
    // also grants + equips the new item for the calling user, useful for a
    // "register and immediately preview on my chibi" flow.
    const [grantAndEquip, setGrantAndEquip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [image, setImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Two-layer item support: HAIR_FRONT items can carry a second PNG that
    // renders at HAIR_BACK z-order. In upload mode this is a File picked next
    // to the primary; in register-by-url mode it's a second URL. The control
    // is hidden for slots where a second layer wouldn't render (everything
    // except HAIR_FRONT today). When edited, we seed from the existing row.
    const [secondaryImage, setSecondaryImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [secondaryAssetUrl, setSecondaryAssetUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.secondaryAssetUrl ?? "");
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const secondaryFileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Slots that get a secondary asset control. Kept tight on purpose — every
    // other slot ignores SecondaryAssetUrl in ChibiAvatar so exposing the
    // control would invite "uploaded a second PNG, didn't render" confusion.
    //   HAIR_FRONT   → secondary = back-of-head strands  (HAIR_BACK z)
    //   CAPE         → secondary = front drape           (CAPE_FRONT z)
    //   WEAPON_FRONT → secondary = shaft behind chibi    (WEAPON_BACK z)
    const supportsSecondaryAsset = slot === "HAIR_FRONT" || slot === "CAPE" || slot === "WEAPON_FRONT";
    // Semantic label for the secondary layer — what the artist drew. Hair's
    // primary is the front bangs so its secondary is "Back"; cape's primary
    // is the back panel so its secondary is "Front"; weapon's primary is
    // the front weapon so its secondary is "Back". Mirrors the z-order
    // resolution in ChibiAvatar.
    const secondaryLayerLabel = slot === "CAPE" ? "Front" : "Back";
    // Render hints — empty string in number inputs means "not set" (i.e. omit
    // from the payload so the server keeps the existing value / falls back to
    // slot defaults). Booleans flip directly. Initialised from the existing
    // item in edit mode.
    const [showAdvanced, setShowAdvanced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [coversHairFront, setCoversHairFront] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.coversHairFront ?? false);
    const [coversHairBack, setCoversHairBack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.coversHairBack ?? false);
    const [offsetX, setOffsetX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.offsetX != null ? String(seed.offsetX) : "");
    const [offsetY, setOffsetY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.offsetY != null ? String(seed.offsetY) : "");
    const [renderScale, setRenderScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.renderScale != null ? String(seed.renderScale) : "");
    const [sourceWidth, setSourceWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.sourceWidth != null ? String(seed.sourceWidth) : "");
    const [sourceHeight, setSourceHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(seed?.sourceHeight != null ? String(seed.sourceHeight) : "");
    // Parse a number-string-from-input into a number (or null when empty).
    // Returns the literal string "INVALID" sentinel for non-numeric input so
    // handleSave can surface a validation error before hitting the API.
    function parseOptionalNumber(s) {
        const trimmed = s.trim();
        if (trimmed === "") return null;
        const n = Number(trimmed);
        return Number.isFinite(n) ? n : "INVALID";
    }
    // Auto-focus the first field on open so the user can start typing without
    // a click. Pure ergonomics — modals everywhere else in the app do this
    // (see NewTaskModal).
    const nameInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        nameInputRef.current?.focus();
    }, []);
    // Escape closes the modal (matches other modals' behaviour).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return ()=>document.removeEventListener("keydown", onKey);
    }, [
        onClose
    ]);
    const previewSrc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (image) return URL.createObjectURL(image);
        if (isEdit && seed?.previewAssetUrl) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(seed.previewAssetUrl);
        if (!isEdit && createMode === "url" && previewAssetUrl) return previewAssetUrl;
        return null;
    }, [
        image,
        isEdit,
        seed,
        createMode,
        previewAssetUrl
    ]);
    // Mirror of previewSrc for the secondary asset. Only computed when the
    // current slot actually uses one; otherwise we never display the thumb.
    const secondaryPreviewSrc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!supportsSecondaryAsset) return null;
        if (secondaryImage) return URL.createObjectURL(secondaryImage);
        if (isEdit && seed?.secondaryAssetUrl) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(seed.secondaryAssetUrl);
        if (!isEdit && createMode === "url" && secondaryAssetUrl) return secondaryAssetUrl;
        return null;
    }, [
        supportsSecondaryAsset,
        secondaryImage,
        isEdit,
        seed,
        createMode,
        secondaryAssetUrl
    ]);
    // File object URLs need to be revoked or they leak — browsers hold the
    // backing blob alive as long as the URL is around. Re-revoke whenever a
    // new file is picked or the modal closes.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!image) return;
        const src = URL.createObjectURL(image);
        return ()=>URL.revokeObjectURL(src);
    }, [
        image
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!secondaryImage) return;
        const src = URL.createObjectURL(secondaryImage);
        return ()=>URL.revokeObjectURL(src);
    }, [
        secondaryImage
    ]);
    async function handleSave() {
        if (submitting) return;
        if (!name.trim()) {
            setError("Name is required.");
            return;
        }
        if (!category.trim()) {
            setError("Category is required.");
            return;
        }
        const costN = Number(cost);
        if (!Number.isFinite(costN) || costN < 0) {
            setError("Cost must be a non-negative number.");
            return;
        }
        // Validate + collect render hint values once. Used by all three save paths.
        const ox = parseOptionalNumber(offsetX);
        const oy = parseOptionalNumber(offsetY);
        const rs = parseOptionalNumber(renderScale);
        const sw = parseOptionalNumber(sourceWidth);
        const sh = parseOptionalNumber(sourceHeight);
        if (ox === "INVALID" || oy === "INVALID" || rs === "INVALID" || sw === "INVALID" || sh === "INVALID") {
            setError("Render hint values must be numbers (or blank).");
            return;
        }
        const hints = {
            coversHairFront,
            coversHairBack,
            offsetX: ox,
            offsetY: oy,
            renderScale: rs,
            sourceWidth: sw,
            sourceHeight: sh
        };
        setSubmitting(true);
        setError(null);
        // Secondary asset is only meaningful when the slot supports it. For all
        // other slots we deliberately drop whatever was in state — guarantees a
        // mid-flow slot change can't smuggle an unused file/URL through.
        const secondaryImagePayload = supportsSecondaryAsset ? secondaryImage ?? null : null;
        const secondaryUrlPayload = supportsSecondaryAsset && secondaryAssetUrl.trim() ? secondaryAssetUrl.trim() : null;
        try {
            if (isEdit) {
                const payload = {
                    name: name.trim(),
                    category: category.trim(),
                    slot,
                    rarity,
                    cost: costN,
                    description: description.trim() || null,
                    isAvailable,
                    image: image ?? null,
                    secondaryImage: secondaryImagePayload,
                    ...hints
                };
                const { data, error: apiError } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].updateItem(seed.itemId, payload);
                if (apiError) {
                    setError(apiError);
                    return;
                }
                // Server returns the freshly updated DTO. If it doesn't (some 204
                // backends), splice the input on top of the seed locally so the
                // parent at least sees the optimistic version.
                const next = data ?? {
                    ...seed,
                    name: payload.name,
                    category: payload.category,
                    slot: payload.slot,
                    rarity: payload.rarity,
                    cost: payload.cost,
                    description: payload.description ?? null,
                    isAvailable: payload.isAvailable
                };
                onSaved(next);
                onClose();
                return;
            }
            // create
            if (createMode === "url") {
                if (!previewAssetUrl.trim()) {
                    setError("Preview URL is required.");
                    return;
                }
                const payload = {
                    name: name.trim(),
                    category: category.trim(),
                    slot,
                    rarity,
                    cost: costN,
                    description: description.trim() || null,
                    previewAssetUrl: previewAssetUrl.trim(),
                    secondaryAssetUrl: secondaryUrlPayload,
                    isAvailable,
                    grantAndEquipForCurrentUser: grantAndEquip,
                    ...hints
                };
                const { data, error: apiError } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].registerItemByUrl(payload);
                if (apiError) {
                    setError(apiError);
                    return;
                }
                if (data) onSaved(data);
            } else {
                // upload mode — image is optional per the backend DTO but we
                // require it here, since "create without image" is just the URL
                // path without a URL, which is rarely useful.
                if (!image) {
                    setError("Pick a PNG to upload.");
                    return;
                }
                const payload = {
                    name: name.trim(),
                    category: category.trim(),
                    slot,
                    rarity,
                    cost: costN,
                    description: description.trim() || null,
                    isAvailable,
                    image,
                    secondaryImage: secondaryImagePayload,
                    ...hints
                };
                const { data, error: apiError } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].createItem(payload);
                if (apiError) {
                    setError(apiError);
                    return;
                }
                if (data) onSaved(data);
            }
            onClose();
        } finally{
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-edge-drawer-block": true,
        className: "fixed inset-0 z-50 flex items-center justify-center px-4",
        style: {
            background: "var(--color-modal-overlay)"
        },
        onClick: (e)=>{
            if (e.target === e.currentTarget && !submitting) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md relative",
            style: {
                background: "var(--color-panel)",
                border: "1px solid var(--color-border)",
                borderRadius: 6,
                boxShadow: "var(--shadow-popover)",
                padding: "20px 20px 16px",
                maxHeight: "90vh",
                overflowY: "auto"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 14
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                color: "var(--color-fg)",
                                fontSize: 11,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                fontWeight: 700
                            },
                            children: isEdit ? `Edit Item #${seed.itemId}` : "New Avatar Item"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 327,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            "aria-label": "Close",
                            disabled: submitting,
                            style: {
                                fontSize: 16,
                                lineHeight: 1,
                                color: "var(--color-fg-subtle)",
                                background: "transparent",
                                border: "none",
                                cursor: submitting ? "wait" : "pointer",
                                padding: 4
                            },
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 338,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                    lineNumber: 326,
                    columnNumber: 9
                }, this),
                !isEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 4,
                        marginBottom: 12
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ModeTab, {
                            active: createMode === "upload",
                            onClick: ()=>setCreateMode("upload"),
                            label: "Upload PNG"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ModeTab, {
                            active: createMode === "url",
                            onClick: ()=>setCreateMode("url"),
                            label: "Register URL"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 360,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                    lineNumber: 358,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                            label: "Name *",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: nameInputRef,
                                type: "text",
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                maxLength: 100,
                                className: "themed-form-input"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                lineNumber: 366,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 365,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Slot *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: slot,
                                        onChange: (e)=>setSlot(e.target.value),
                                        className: "themed-form-input",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                label: "Granular (preferred)",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRANULAR_SLOTS"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: s,
                                                        children: s
                                                    }, s, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 380,
                                                        columnNumber: 46
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                lineNumber: 379,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                label: "Legacy (existing rows only)",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEGACY_SLOTS"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: s,
                                                        children: s
                                                    }, s, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 44
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                lineNumber: 382,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 378,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 377,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Rarity *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: rarity,
                                        onChange: (e)=>setRarity(e.target.value),
                                        className: "themed-form-input",
                                        children: RARITIES.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: r,
                                                children: r
                                            }, r, false, {
                                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                lineNumber: 389,
                                                columnNumber: 38
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 388,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 387,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr",
                                gap: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Category *",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: category,
                                            onChange: (e)=>setCategory(e.target.value),
                                            maxLength: 50,
                                            list: "avatar-item-categories",
                                            className: "themed-form-input"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                            id: "avatar-item-categories",
                                            children: categorySuggestionsFor(slot).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: c
                                                }, c, false, {
                                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 58
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 408,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 395,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Cost (pts)",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: cost,
                                        onChange: (e)=>setCost(e.target.value),
                                        min: 0,
                                        className: "themed-form-input"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 413,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 412,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 394,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                            label: "Description",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: description,
                                onChange: (e)=>setDescription(e.target.value),
                                maxLength: 255,
                                rows: 2,
                                className: "themed-form-input",
                                style: {
                                    resize: "vertical",
                                    minHeight: 38
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                lineNumber: 424,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, this),
                        isEdit || createMode === "upload" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                            label: isEdit ? "Replace image (optional)" : "Image (PNG) *",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: fileInputRef,
                                        type: "file",
                                        accept: "image/png",
                                        onChange: (e)=>setImage(e.target.files?.[0] ?? null),
                                        style: {
                                            flex: 1,
                                            minWidth: 0,
                                            color: "var(--color-fg-muted)",
                                            fontSize: 11
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 438,
                                        columnNumber: 17
                                    }, this),
                                    image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setImage(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        },
                                        style: smallBtnStyle,
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 446,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                lineNumber: 437,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 436,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Preview URL *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "url",
                                        value: previewAssetUrl,
                                        onChange: (e)=>setPreviewAssetUrl(e.target.value),
                                        maxLength: 255,
                                        placeholder: "https://…/avatar-items/hat.png",
                                        className: "themed-form-input"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 462,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 461,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        color: "var(--color-fg-muted)",
                                        fontSize: 10,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        fontWeight: 500
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: grantAndEquip,
                                            onChange: (e)=>setGrantAndEquip(e.target.checked)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, this),
                                        "Grant + equip on my chibi"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 471,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        supportsSecondaryAsset && (isEdit || createMode === "upload" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                            label: isEdit ? `Replace ${secondaryLayerLabel.toLowerCase()} layer (optional)` : `${secondaryLayerLabel} layer (PNG, optional)`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: secondaryFileInputRef,
                                        type: "file",
                                        accept: "image/png",
                                        onChange: (e)=>setSecondaryImage(e.target.files?.[0] ?? null),
                                        style: {
                                            flex: 1,
                                            minWidth: 0,
                                            color: "var(--color-fg-muted)",
                                            fontSize: 11
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 494,
                                        columnNumber: 19
                                    }, this),
                                    secondaryImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setSecondaryImage(null);
                                            if (secondaryFileInputRef.current) secondaryFileInputRef.current.value = "";
                                        },
                                        style: smallBtnStyle,
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                        lineNumber: 502,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                lineNumber: 493,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 490,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                            label: `${secondaryLayerLabel} layer URL (optional)`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "url",
                                value: secondaryAssetUrl,
                                onChange: (e)=>setSecondaryAssetUrl(e.target.value),
                                maxLength: 255,
                                placeholder: slot === "CAPE" ? "https://…/avatar-items/cape_valor_front.png" : slot === "WEAPON_FRONT" ? "https://…/avatar-items/weapon_polearm_back.png" : "https://…/avatar-items/hair_seraph_back.png",
                                className: "themed-form-input"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                lineNumber: 517,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 516,
                            columnNumber: 15
                        }, this)),
                        (previewSrc || secondaryPreviewSrc) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                gap: 8,
                                padding: "4px 0"
                            },
                            children: [
                                previewSrc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PreviewThumb, {
                                    src: previewSrc,
                                    label: slot === "CAPE" ? "Back" : "Front"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 538,
                                    columnNumber: 17
                                }, this),
                                secondaryPreviewSrc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PreviewThumb, {
                                    src: secondaryPreviewSrc,
                                    label: secondaryLayerLabel
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 541,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 536,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                color: "var(--color-fg-muted)",
                                fontSize: 10,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontWeight: 500
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: isAvailable,
                                    onChange: (e)=>setIsAvailable(e.target.checked)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 553,
                                    columnNumber: 13
                                }, this),
                                "Available in catalogue"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 546,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                borderTop: "1px solid var(--color-border-hairline)",
                                paddingTop: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowAdvanced((v)=>!v),
                                    "aria-expanded": showAdvanced,
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        padding: "4px 0",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--color-fg-subtle)",
                                        fontSize: 9,
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        fontWeight: 600
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Advanced (render hints)"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 573,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": true,
                                            style: {
                                                fontSize: 11
                                            },
                                            children: showAdvanced ? "▾" : "▸"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 574,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 561,
                                    columnNumber: 13
                                }, this),
                                showAdvanced && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        marginTop: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: hintCheckLabelStyle,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: coversHairFront,
                                                            onChange: (e)=>setCoversHairFront(e.target.checked)
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                            lineNumber: 581,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Covers hair (front)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: hintCheckLabelStyle,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: coversHairBack,
                                                            onChange: (e)=>setCoversHairBack(e.target.checked)
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                            lineNumber: 589,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Covers hair (back)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                    lineNumber: 588,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                    label: "Offset X (src px)",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: offsetX,
                                                        onChange: (e)=>setOffsetX(e.target.value),
                                                        placeholder: "0",
                                                        className: "themed-form-input"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 600,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                    label: "Offset Y (src px)",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: offsetY,
                                                        onChange: (e)=>setOffsetY(e.target.value),
                                                        placeholder: "0",
                                                        className: "themed-form-input"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 609,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 598,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            label: `Render scale${renderScale ? ` (${renderScale}×)` : ""}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: 8,
                                                    alignItems: "center"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: 0.5,
                                                        max: 2.5,
                                                        step: 0.05,
                                                        value: renderScale === "" ? 1 : Number(renderScale),
                                                        onChange: (e)=>setRenderScale(e.target.value),
                                                        style: {
                                                            flex: 1
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 621,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setRenderScale(""),
                                                        title: "Reset to slot default",
                                                        style: smallBtnStyle,
                                                        children: "Reset"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 630,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                lineNumber: 620,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 619,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                    label: "Source width (px)",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: sourceWidth,
                                                        onChange: (e)=>setSourceWidth(e.target.value),
                                                        placeholder: "256",
                                                        min: 0,
                                                        className: "themed-form-input"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 643,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                    lineNumber: 642,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                    label: "Source height (px)",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: sourceHeight,
                                                        onChange: (e)=>setSourceHeight(e.target.value),
                                                        placeholder: "384",
                                                        min: 0,
                                                        className: "themed-form-input"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                        lineNumber: 653,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 641,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "var(--color-fg-subtle)",
                                                fontSize: 9,
                                                lineHeight: 1.4,
                                                margin: 0
                                            },
                                            children: "Leave a field blank to use the per-slot default. Offsets and source dimensions are in the original PNG's pixel coordinates."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                            lineNumber: 664,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 578,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 560,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            role: "alert",
                            style: {
                                color: "var(--color-danger)",
                                fontSize: 11,
                                lineHeight: 1.4,
                                background: "var(--color-danger-bg)",
                                border: "1px solid var(--color-danger-border)",
                                padding: "6px 8px",
                                borderRadius: 2
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 673,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: 6,
                                justifyContent: "flex-end",
                                marginTop: 4
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    disabled: submitting,
                                    style: cancelBtnStyle,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 690,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleSave,
                                    disabled: submitting,
                                    style: saveBtnStyle,
                                    children: submitting ? "Saving…" : isEdit ? "Save changes" : "Create"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                                    lineNumber: 693,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                            lineNumber: 689,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                    lineNumber: 364,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
            lineNumber: 314,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
}
function PreviewThumb({ src, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 96,
                    height: 96,
                    border: "1px solid var(--color-border-hairline)",
                    background: "rgba(0,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: src,
                    alt: "",
                    width: 192,
                    height: 192,
                    unoptimized: true,
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        imageRendering: "pixelated"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                    lineNumber: 713,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                lineNumber: 706,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "var(--color-fg-subtle)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 600
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                lineNumber: 722,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
        lineNumber: 705,
        columnNumber: 5
    }, this);
}
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        style: {
            display: "flex",
            flexDirection: "column",
            gap: 4
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "var(--color-fg-subtle)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 600
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
                lineNumber: 732,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
        lineNumber: 731,
        columnNumber: 5
    }, this);
}
function ModeTab({ active, onClick, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        style: {
            flex: 1,
            padding: "6px 8px",
            background: active ? "var(--color-active-highlight-bg)" : "transparent",
            border: `1px solid ${active ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
            color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
            borderRadius: 2,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            cursor: "pointer"
        },
        children: label
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/AvatarItemFormModal.tsx",
        lineNumber: 742,
        columnNumber: 5
    }, this);
}
const smallBtnStyle = {
    padding: "4px 8px",
    background: "transparent",
    border: "1px solid var(--color-border-hairline)",
    color: "var(--color-fg-muted)",
    borderRadius: 2,
    fontSize: 9,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 600,
    cursor: "pointer"
};
const hintCheckLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "var(--color-fg-muted)",
    fontSize: 10,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    fontWeight: 500
};
const cancelBtnStyle = {
    ...smallBtnStyle,
    padding: "6px 12px",
    fontSize: 10
};
const saveBtnStyle = {
    padding: "6px 14px",
    background: "var(--color-active-highlight-bg)",
    border: "1px solid var(--color-active-highlight-border)",
    color: "var(--color-active-highlight)",
    borderRadius: 2,
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 700,
    cursor: "pointer"
};
}),
"[project]/apps/web/src/components/AvatarAdminPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AvatarAdminPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/avatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/assetPath.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$cardTransform$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/cardTransform.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ToastContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$AvatarItemFormModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/AvatarItemFormModal.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function AvatarAdminPanel({ isAdmin, isModerator, onCatalogueChange }) {
    const { setError, setSuccess } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // Item IDs currently mid-request (toggle/delete) — disables the row's
    // buttons so a double-click can't queue two conflicting writes.
    const [busyIds, setBusyIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Active modal mode — null means closed. Driven by "+ New item" (create)
    // and the per-row Edit button (edit). Save callback handles list updates.
    const [formMode, setFormMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Active grant target — null when the grant modal is closed. Stores the
    // AvatarItemDto so the modal can show name + thumbnail without an
    // extra lookup. Driven by the per-row Grant button.
    const [grantTarget, setGrantTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading(true);
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].catalog({
            pageNumber: 1,
            pageSize: 500
        });
        setLoading(false);
        if (error) {
            setError(error);
            return;
        }
        setItems(data?.data ?? []);
    }, [
        setError
    ]);
    // Lazy-load: only fetch when the panel is first opened. Saves an HTTP
    // round-trip for the common case where a moderator visits /avatar without
    // intending to manage anything.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (open && items.length === 0 && !loading) refresh();
    }, [
        open,
        items.length,
        loading,
        refresh
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const q = filter.trim().toLowerCase();
        if (!q) return items;
        return items.filter((i)=>i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.slot.toLowerCase().includes(q));
    }, [
        items,
        filter
    ]);
    const onToggleAvailability = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (item)=>{
        if (busyIds.has(item.itemId)) return;
        setBusyIds((prev)=>new Set(prev).add(item.itemId));
        // Optimistic flip — server inverts isAvailable on its side, so we just
        // mirror the same inversion locally and roll back on error.
        setItems((prev)=>prev.map((i)=>i.itemId === item.itemId ? {
                    ...i,
                    isAvailable: !i.isAvailable
                } : i));
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].toggleItemAvailability(item.itemId);
        setBusyIds((prev)=>{
            const n = new Set(prev);
            n.delete(item.itemId);
            return n;
        });
        if (error) {
            setItems((prev)=>prev.map((i)=>i.itemId === item.itemId ? {
                        ...i,
                        isAvailable: item.isAvailable
                    } : i));
            setError(error);
        }
    }, [
        busyIds,
        setError
    ]);
    const onDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (item)=>{
        if (!isAdmin) return;
        const ok = window.confirm(`Delete "${item.name}" (#${item.itemId})? This can't be undone.`);
        if (!ok) return;
        setBusyIds((prev)=>new Set(prev).add(item.itemId));
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].deleteItem(item.itemId);
        setBusyIds((prev)=>{
            const n = new Set(prev);
            n.delete(item.itemId);
            return n;
        });
        if (error) {
            setError(error);
            return;
        }
        setItems((prev)=>prev.filter((i)=>i.itemId !== item.itemId));
        onCatalogueChange?.();
    }, [
        isAdmin,
        setError,
        onCatalogueChange
    ]);
    const onEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((item)=>{
        setFormMode({
            kind: "edit",
            item
        });
    }, []);
    // Re-scans the item's PreviewAssetUrl on the server and stores fresh
    // content bounds. Splices the returned DTO back into the local list so
    // the inventory grid's auto-centre transform sees the new bounds on the
    // next render — the host page also rebuilds its catalogue from this same
    // list via onCatalogueChange.
    const onRecenter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (item)=>{
        if (busyIds.has(item.itemId)) return;
        setBusyIds((prev)=>new Set(prev).add(item.itemId));
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].recomputeBounds(item.itemId);
        setBusyIds((prev)=>{
            const n = new Set(prev);
            n.delete(item.itemId);
            return n;
        });
        if (error) {
            setError(error);
            return;
        }
        if (data) {
            setItems((prev)=>prev.map((i)=>i.itemId === data.itemId ? data : i));
            onCatalogueChange?.();
        }
    }, [
        busyIds,
        setError,
        onCatalogueChange
    ]);
    // Tracks how many items the bulk recenter is still chewing through so the
    // button can show progress instead of spinning silently. Cleared back to
    // null when the run finishes (success or fail).
    const [recenterAllProgress, setRecenterAllProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // One-click fix for legacy rows that don't have content bounds yet — runs
    // the recompute endpoint for every item missing bounds whose
    // PreviewAssetUrl is an absolute http(s) URL (relative seed paths can't
    // be fetched server-side and are skipped). Sequential to keep the API
    // honest about its load — each scan downloads a PNG and runs ImageSharp,
    // a parallel storm would be unkind.
    const onRecenterAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const targets = items.filter((i)=>{
            const hasBounds = i.contentMinX != null && i.contentMinY != null && i.contentMaxX != null && i.contentMaxY != null;
            const httpUrl = !!i.previewAssetUrl && /^https?:\/\//i.test(i.previewAssetUrl);
            return !hasBounds && httpUrl;
        });
        if (targets.length === 0) return;
        setRecenterAllProgress({
            done: 0,
            total: targets.length
        });
        for(let i = 0; i < targets.length; i++){
            const t = targets[i];
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].recomputeBounds(t.itemId);
            if (error) {
                // Don't abort the whole batch on a single failure (third-party CDN
                // outage etc.) — surface it via toast and keep going.
                setError(`Recenter failed for "${t.name}": ${error}`);
            } else if (data) {
                setItems((prev)=>prev.map((it)=>it.itemId === data.itemId ? data : it));
            }
            setRecenterAllProgress({
                done: i + 1,
                total: targets.length
            });
        }
        setRecenterAllProgress(null);
        onCatalogueChange?.();
    }, [
        items,
        setError,
        onCatalogueChange
    ]);
    // Open the grant modal for a specific item. The modal itself is rendered
    // at the bottom of this component and reads grantTarget directly; this
    // helper just sets state.
    const onGrant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((item)=>{
        setGrantTarget(item);
    }, []);
    // Submit handler from the grant modal. Calls the API and on success
    // notifies the host page so it can refresh the user's inventory (so a
    // grant-to-self lands in the inventory grid right away).
    const handleGrantSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (item, targetEmail, autoEquip)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].grantItem(item.itemId, {
            // Empty string → null so the backend interprets it as "grant to self".
            targetEmail: targetEmail.trim() || null,
            autoEquip
        });
        if (error) return error;
        const who = targetEmail.trim() ? `to ${targetEmail.trim()}` : "to you";
        setSuccess(`Granted "${item.name}" ${who}${autoEquip ? " (equipped)" : ""}.`);
        // Always notify — a grant-to-self should re-render the inventory grid
        // immediately, and even other-user grants can affect catalogue state
        // the host page cares about (point cost, availability flags).
        onCatalogueChange?.();
        setGrantTarget(null);
        void data;
        return null;
    }, [
        setSuccess,
        onCatalogueChange
    ]);
    // Count of items that would actually do something on "Recenter all" —
    // missing bounds AND have a scannable URL. Drives both the button's
    // disabled state and its label.
    const recenterableCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>items.filter((i)=>{
            const hasBounds = i.contentMinX != null && i.contentMinY != null && i.contentMaxX != null && i.contentMaxY != null;
            const httpUrl = !!i.previewAssetUrl && /^https?:\/\//i.test(i.previewAssetUrl);
            return !hasBounds && httpUrl;
        }).length, [
        items
    ]);
    // Saves from the modal — splice the returned item into the local list so
    // the row updates / new row appears without a full refetch. Notifies the
    // host page so it can refresh the user's inventory if the catalogue
    // change might affect equipped items.
    const onSavedFromModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((saved)=>{
        setItems((prev)=>{
            const idx = prev.findIndex((i)=>i.itemId === saved.itemId);
            if (idx < 0) return [
                saved,
                ...prev
            ];
            const next = prev.slice();
            next[idx] = saved;
            return next;
        });
        onCatalogueChange?.();
    }, [
        onCatalogueChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        style: {
            marginTop: 24,
            border: "1px solid var(--color-border-soft)",
            borderRadius: 4,
            background: "var(--color-surface)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                "aria-expanded": open,
                style: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    color: "var(--color-fg-muted)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    cursor: "pointer"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Manage Items",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginLeft: 8,
                                    color: "var(--color-fg-subtle)",
                                    fontWeight: 500
                                },
                                children: isAdmin ? "Admin" : isModerator ? "Moderator" : ""
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: 12
                        },
                        children: open ? "▾" : "▸"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    borderTop: "1px solid var(--color-border-soft)",
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 8,
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: filter,
                                onChange: (e)=>setFilter(e.target.value),
                                placeholder: "Filter by name / category / slot",
                                className: "themed-form-input",
                                style: {
                                    flex: 1,
                                    minWidth: 0,
                                    fontSize: 11
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setFormMode({
                                        kind: "create"
                                    }),
                                title: "Create a new avatar item",
                                style: {
                                    flexShrink: 0,
                                    padding: "6px 10px",
                                    background: "var(--color-active-highlight-bg)",
                                    border: "1px solid var(--color-active-highlight-border)",
                                    color: "var(--color-active-highlight)",
                                    borderRadius: 2,
                                    fontSize: 10,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                },
                                children: "+ New item"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onRecenterAll,
                                disabled: recenterAllProgress != null || recenterableCount === 0,
                                title: recenterableCount === 0 ? "All scannable items already have content bounds" : `Recompute bounds for ${recenterableCount} item(s) without them`,
                                style: {
                                    flexShrink: 0,
                                    padding: "6px 10px",
                                    background: "transparent",
                                    border: "1px solid var(--color-border-hairline)",
                                    color: "var(--color-fg-muted)",
                                    borderRadius: 2,
                                    fontSize: 10,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                    cursor: recenterAllProgress != null ? "wait" : recenterableCount === 0 ? "default" : "pointer",
                                    opacity: recenterAllProgress != null || recenterableCount === 0 ? 0.5 : 1
                                },
                                children: recenterAllProgress != null ? `${recenterAllProgress.done}/${recenterAllProgress.total}…` : `Recenter all${recenterableCount > 0 ? ` (${recenterableCount})` : ""}`
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 289,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: refresh,
                                disabled: loading,
                                title: "Reload the catalogue from the server",
                                style: {
                                    flexShrink: 0,
                                    padding: "6px 10px",
                                    background: "transparent",
                                    border: "1px solid var(--color-border-hairline)",
                                    color: "var(--color-fg-muted)",
                                    borderRadius: 2,
                                    fontSize: 10,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                    cursor: loading ? "wait" : "pointer",
                                    opacity: loading ? 0.5 : 1
                                },
                                children: loading ? "…" : "Refresh"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 260,
                        columnNumber: 11
                    }, this),
                    loading && items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: 11
                        },
                        children: "Loading items…"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 342,
                        columnNumber: 13
                    }, this) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: 11
                        },
                        children: items.length === 0 ? "No items in the catalogue yet." : "No items match the filter."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 344,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            listStyle: "none",
                            margin: 0,
                            padding: 0
                        },
                        children: filtered.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AdminItemRow, {
                                item: item,
                                busy: busyIds.has(item.itemId),
                                canDelete: isAdmin,
                                onEdit: onEdit,
                                onToggleAvailability: onToggleAvailability,
                                onRecenter: onRecenter,
                                onGrant: onGrant,
                                onDelete: onDelete
                            }, item.itemId, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 350,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 348,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                lineNumber: 259,
                columnNumber: 9
            }, this),
            formMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$AvatarItemFormModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                mode: formMode,
                onClose: ()=>setFormMode(null),
                onSaved: onSavedFromModal
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                lineNumber: 368,
                columnNumber: 9
            }, this),
            grantTarget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GrantItemModal, {
                item: grantTarget,
                onClose: ()=>setGrantTarget(null),
                onSubmit: handleGrantSubmit
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                lineNumber: 376,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
        lineNumber: 219,
        columnNumber: 5
    }, this);
}
function AdminItemRow({ item, busy, canDelete, onEdit, onToggleAvailability, onRecenter, onGrant, onDelete }) {
    const hasAsset = !!item.previewAssetUrl;
    const canRecenter = !!item.previewAssetUrl && /^https?:\/\//i.test(item.previewAssetUrl);
    const hasBounds = item.contentMinX != null && item.contentMinY != null && item.contentMaxX != null && item.contentMaxY != null;
    // Same auto-centring pipeline the inventory cards use, but the thumb is
    // always a 1×1 square regardless of the item's storage footprint —
    // override cols/rows so the math doesn't apply letterbox-correction
    // meant for a 1×2 or 2×1 card.
    const clientBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$cardTransform$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClientBounds"])(item.previewAssetUrl ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(item.previewAssetUrl) : null);
    const thumbTransform = hasAsset ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$cardTransform$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundsTransformFor"])(item, clientBounds, {
        cols: 1,
        rows: 1
    }) ?? "scale(1.2)" : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        style: {
            display: "grid",
            gridTemplateColumns: "80px 1fr auto",
            gap: 10,
            alignItems: "center",
            padding: "6px 8px",
            background: "var(--color-bg)",
            border: "1px solid var(--color-border-hairline)",
            borderRadius: 2,
            opacity: busy ? 0.5 : 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 80,
                    height: 80,
                    // Lighter than the previous 0.25 black so the PNG silhouette
                    // stands out against a softer panel-coloured backdrop rather
                    // than a hard near-black square.
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid var(--color-border-hairline)",
                    borderRadius: 8,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: hasAsset ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(item.previewAssetUrl),
                    alt: "",
                    width: 160,
                    height: 160,
                    unoptimized: true,
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        imageRendering: "pixelated",
                        transform: thumbTransform,
                        transformOrigin: "center"
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                    lineNumber: 443,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        color: "var(--color-fg-subtle)",
                        fontSize: 10,
                        letterSpacing: "0.1em"
                    },
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                    lineNumber: 459,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                lineNumber: 427,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--color-fg)",
                            fontSize: 12,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        },
                        children: [
                            item.name,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginLeft: 6,
                                    color: "var(--color-fg-subtle)",
                                    fontWeight: 400,
                                    fontSize: 10
                                },
                                children: [
                                    "#",
                                    item.itemId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 466,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 464,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "var(--color-fg-subtle)",
                            fontSize: 9,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase"
                        },
                        children: [
                            item.slot,
                            " · ",
                            item.rarity,
                            " · ",
                            item.cost,
                            "p",
                            item.category ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    " · ",
                                    item.category
                                ]
                            }, void 0, true) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                title: hasBounds ? "Content bounds stored" : "No content bounds — using slot default",
                                "aria-hidden": true,
                                style: {
                                    display: "inline-block",
                                    marginLeft: 6,
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: hasBounds ? "var(--color-success)" : "var(--color-fg-subtle)",
                                    opacity: hasBounds ? 0.85 : 0.4,
                                    verticalAlign: "middle"
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                lineNumber: 463,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        title: "Toggle availability",
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            cursor: busy ? "wait" : "pointer",
                            color: item.isAvailable ? "var(--color-success)" : "var(--color-fg-subtle)",
                            fontSize: 9,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontWeight: 600
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: item.isAvailable,
                                disabled: busy,
                                onChange: ()=>onToggleAvailability(item),
                                style: {
                                    cursor: busy ? "wait" : "pointer"
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                lineNumber: 500,
                                columnNumber: 11
                            }, this),
                            item.isAvailable ? "Live" : "Off"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 492,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onEdit(item),
                        disabled: busy,
                        title: "Edit item metadata or replace image",
                        style: iconBtnStyle,
                        children: "Edit"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onGrant(item),
                        disabled: busy,
                        title: "Grant this item to a user (defaults to you)",
                        style: iconBtnStyle,
                        children: "Grant"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 518,
                        columnNumber: 9
                    }, this),
                    canRecenter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onRecenter(item),
                        disabled: busy,
                        title: "Re-scan PNG and store fresh content bounds so the inventory card auto-centres",
                        style: iconBtnStyle,
                        children: "Recenter"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 528,
                        columnNumber: 11
                    }, this),
                    canDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onDelete(item),
                        disabled: busy,
                        title: "Delete item (Admin only)",
                        style: {
                            ...iconBtnStyle,
                            color: "var(--color-danger)",
                            borderColor: "var(--color-danger-border)"
                        },
                        children: "Del"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                        lineNumber: 539,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                lineNumber: 491,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
        lineNumber: 414,
        columnNumber: 5
    }, this);
}
function GrantItemModal({ item, onClose, onSubmit }) {
    const [targetEmail, setTargetEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [autoEquip, setAutoEquip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function onKey(e) {
            if (e.key === "Escape" && !submitting) onClose();
        }
        document.addEventListener("keydown", onKey);
        return ()=>document.removeEventListener("keydown", onKey);
    }, [
        onClose,
        submitting
    ]);
    async function handleSubmit() {
        if (submitting) return;
        setSubmitting(true);
        setError(null);
        const err = await onSubmit(item, targetEmail, autoEquip);
        setSubmitting(false);
        if (err) setError(err);
    // Success path: parent closes the modal via setGrantTarget(null) in
    // its onSubmit handler — no work needed here.
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-edge-drawer-block": true,
        className: "fixed inset-0 z-50 flex items-center justify-center px-4",
        style: {
            background: "var(--color-modal-overlay)"
        },
        onClick: (e)=>{
            if (e.target === e.currentTarget && !submitting) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm relative",
            style: {
                background: "var(--color-panel)",
                border: "1px solid var(--color-border)",
                borderRadius: 6,
                boxShadow: "var(--shadow-popover)",
                padding: "20px 20px 16px"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 14
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                color: "var(--color-fg)",
                                fontSize: 11,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                fontWeight: 700
                            },
                            children: "Grant Item"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 607,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            "aria-label": "Close",
                            disabled: submitting,
                            style: {
                                fontSize: 16,
                                lineHeight: 1,
                                color: "var(--color-fg-subtle)",
                                background: "transparent",
                                border: "none",
                                cursor: submitting ? "wait" : "pointer",
                                padding: 4
                            },
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 616,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                    lineNumber: 606,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "var(--color-fg-subtle)",
                        fontSize: 11,
                        lineHeight: 1.5,
                        margin: "0 0 12px"
                    },
                    children: [
                        "Granting ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            style: {
                                color: "var(--color-fg)"
                            },
                            children: item.name
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 632,
                            columnNumber: 20
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                marginLeft: 4,
                                fontSize: 10,
                                color: "var(--color-fg-subtle)"
                            },
                            children: [
                                "#",
                                item.itemId
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 633,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                    lineNumber: 629,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 4
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        fontSize: 9,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        fontWeight: 600
                                    },
                                    children: "Target email (blank = grant to yourself)"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                    lineNumber: 638,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    value: targetEmail,
                                    onChange: (e)=>setTargetEmail(e.target.value),
                                    maxLength: 100,
                                    placeholder: "user@example.com",
                                    autoFocus: true,
                                    className: "themed-form-input"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                    lineNumber: 644,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 637,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                color: "var(--color-fg-muted)",
                                fontSize: 10,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontWeight: 500
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: autoEquip,
                                    onChange: (e)=>setAutoEquip(e.target.checked)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                    lineNumber: 660,
                                    columnNumber: 13
                                }, this),
                                "Auto-equip after granting"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 655,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            role: "alert",
                            style: {
                                color: "var(--color-danger)",
                                fontSize: 11,
                                lineHeight: 1.4,
                                background: "var(--color-danger-bg)",
                                border: "1px solid var(--color-danger-border)",
                                padding: "6px 8px",
                                borderRadius: 2
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 665,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: 6,
                                justifyContent: "flex-end",
                                marginTop: 4
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    disabled: submitting,
                                    style: {
                                        ...iconBtnStyle,
                                        padding: "6px 12px",
                                        fontSize: 10
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                    lineNumber: 674,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleSubmit,
                                    disabled: submitting,
                                    style: {
                                        padding: "6px 14px",
                                        background: "var(--color-active-highlight-bg)",
                                        border: "1px solid var(--color-active-highlight-border)",
                                        color: "var(--color-active-highlight)",
                                        borderRadius: 2,
                                        fontSize: 10,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        cursor: submitting ? "wait" : "pointer"
                                    },
                                    children: submitting ? "Granting…" : "Grant"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                                    lineNumber: 677,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                            lineNumber: 673,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
                    lineNumber: 636,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
            lineNumber: 596,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/AvatarAdminPanel.tsx",
        lineNumber: 590,
        columnNumber: 5
    }, this);
}
const iconBtnStyle = {
    padding: "3px 8px",
    background: "transparent",
    border: "1px solid var(--color-border-hairline)",
    color: "var(--color-fg-muted)",
    borderRadius: 2,
    fontSize: 9,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 600,
    cursor: "pointer"
};
}),
"[project]/apps/web/src/app/avatar/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AvatarPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ChibiAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ChibiAvatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DemoModeBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/DemoModeBanner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/mockAvatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/assetPath.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$cardTransform$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/cardTransform.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/avatar/hints.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useEquippedAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useEquippedAvatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/api/avatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/context/ToastContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDesktopLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useDesktopLayout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useUserRoles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useUserRoles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$AvatarAdminPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/AvatarAdminPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/core/dist/core.esm.js [app-ssr] (ecmascript)");
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
// Grid dimensions for the inventory. Desktop is landscape (7×5) for the
// RE5/RE6 attaché-case feel; mobile flips to portrait (5×7) so the grid
// fits the narrower viewport without horizontal scroll. Total cells stay
// at 35 so identical inventories fit on both shapes — items that don't
// fit the new shape are re-placed by autoPlace.
const GRID_DESKTOP = {
    cols: 7,
    rows: 5
};
const GRID_MOBILE = {
    cols: 5,
    rows: 7
};
// Desktop cells stay at the comfortable 64px the layout was designed around.
// Mobile cells are shrunk to 56px so the 5-wide grid (5×56 + gaps ≈ 286px)
// fits inside a 320px viewport's content area without triggering a horizontal
// scrollbar — 64px overflows on the narrowest common phone widths.
const CELL_PX_DESKTOP = 64;
const CELL_PX_MOBILE = 56;
// CSS transform applied to the inventory-card image so the sprite is zoomed
// in and roughly centered on the actual item content. Each item PNG covers
// the full 256×384 chibi canvas, so the item sits in a slot-specific region
// of that canvas — we scale up and translate to bring that region into the
// card's center. translateY is a percentage of the image height.
//
// Typed as Record<string, string> (not Record<ItemSlot, string>) because
// mock items can use planned granular slots that aren't in the current
// ItemSlot enum — e.g. HAIR_FRONT, WEAPON_BACK, CAPE. Without entries for
// those, the lookup returns undefined and the fallback "scale(1.4)" drops
// the translateY, leaving items (notably the hair sprite) rendered at the
// top of their card instead of centered.
const SLOT_TRANSFORM = {
    // ---- Legacy aliases ----
    HEAD: "scale(1.7) translateY(22%)",
    HAIR: "scale(1.7) translateY(20%)",
    BODY: "scale(1.4) translateY(-4%)",
    HAND: "scale(1.4) translateY(-6%)",
    FACE: "scale(1.7) translateY(12%)",
    BACK: "scale(1.4) translateY(2%)",
    FEET: "scale(1.7) translateY(-22%)",
    // ---- Granular slots (MapleStory-style) ----
    // Hair slots map to the same upper canvas region as HAIR.
    HAIR_FRONT: "scale(1.7) translateY(20%)",
    HAIR_BACK: "scale(1.7) translateY(20%)",
    // Headwear sits on the upper third — same as HEAD.
    HAT: "scale(1.7) translateY(22%)",
    // Eye accessories (glasses) and ear pieces are slightly higher than mouth.
    EYE: "scale(1.7) translateY(14%)",
    EAR: "scale(1.7) translateY(12%)",
    // Body sections — same band as legacy BODY since the asset region
    // overlaps the chibi torso.
    TOP: "scale(1.4) translateY(-4%)",
    BOTTOM: "scale(1.4) translateY(8%)",
    OVERALL: "scale(1.3) translateY(2%)",
    // Outerwear extras.
    CAPE: "scale(1.3) translateY(0%)",
    GLOVES: "scale(1.4) translateY(-6%)",
    SHOES: "scale(1.7) translateY(-22%)",
    // Weapons render small inside their card by default — per-asset
    // CARD_TRANSFORM_OVERRIDE entries override with bigger scales.
    WEAPON_FRONT: "scale(1.4)",
    WEAPON_BACK: "scale(1.4)",
    WRIST: "scale(1.4) translateY(-6%)"
};
// Per-asset overrides for the inventory-card transform, keyed by filename.
// Used as a fallback when the item doesn't carry server-computed content
// bounds (see boundsTransformFor below). For items with bounds the
// auto-centre math wins; this dict survives for legacy assets and the
// static-demo mock catalogue.
const CARD_TRANSFORM_OVERRIDE = {
    // Legacy filename, kept in case any row still points at the old URL.
    "weapon_polearm_alien_cyber.png": "scale(2.2) translate(3%, -10%)",
    // Seraph hair is drawn ~11 source pixels left of canvas center (the same
    // shift ChibiAvatar applies via offsetX: 11 to align it with the chibi's
    // head). The slot default has no translateX, so without this override the
    // hair sits slightly left of card center. 2.8% on the element width, with
    // scale(1.7) magnification, lands canvas-x 117 on the cell's centre line.
    "hair_seraph_wave_brown.png": "scale(1.7) translate(2.8%, 20%)",
    // Two-layer magic staff — combined content spans source y 184→328 in a
    // 384² canvas, so its vertical midpoint sits below source centre and
    // the slot-default scale(1.4) renders it hugging the card bottom.
    // -16% Y lifts the combined sprite up to card centre.
    "weapon_front_magic_staff.png": "scale(1.4) translate(0%, -16%)"
};
// Class-level card transforms — applied when an item's name/category
// includes one of these tokens (case-insensitive). Lets new uploads of
// the same weapon family pick up the card sizing without a per-filename
// entry. Per-filename CARD_TRANSFORM_OVERRIDE still wins when present.
const CARD_CLASS_TRANSFORM = {
    // Polearm: 2× zoom centred horizontally, lifted 12% to bring the
    // diagonal sprite's combined-bbox centre onto the card centre.
    polearm: "scale(2.0) translate(0%, -12%)"
};
function cardClassTransform(item) {
    const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
    for (const token of Object.keys(CARD_CLASS_TRANSFORM)){
        if (haystack.includes(token)) return CARD_CLASS_TRANSFORM[token];
    }
    return null;
}
// Compute a CSS transform that translates + scales the source image so its
// content bbox lands centred inside the card, when the server gave us
// bounds. Returns null when any bound is missing (caller falls back to
// slot defaults).
//
// Math — accounts for the fact that the image element uses
// objectFit:contain, so when source aspect ≠ card aspect the source is
// letterboxed inside the card box rather than filling it. The naive
// "translate by source-relative fraction" overshoots along the
// letterboxed axis. Two correction factors:
//
//   dispFracX = how much of the card's *width* the displayed source
//               occupies (1 when source is wide-relative-to-card,
//               sourceW/sourceH × cardH/cardW otherwise)
//   dispFracY = same for height
//
// Cells are square, so cardW/cardH = gridCols/gridRows. Both default to 1
// for plain 1×1 items.
//
//   - Translate: we want the bbox centre to land at the card centre.
//     The translate amount (in px) required equals (cardCentre - bboxPre).
//     Expressed as a CSS percentage of the card box, that simplifies to
//     -fx × 100 × dispFracX along X (and symmetric for Y), where fx/fy
//     are the bbox-centre-offset-from-source-centre fractions in source
//     pixels.
//   - Scale: we want the bbox's *displayed* extent to fill ~fillFactor of
//     the card's limiting axis. effSrcW/effSrcH are the "effective"
//     source dimensions after letterboxing — equal to sourceW/sourceH
//     when aspects match, larger along the letterboxed axis otherwise.
//     Picking min(effSrcW/bboxW, effSrcH/bboxH) gives the scale that
//     makes the bbox fit; multiplying by fillFactor leaves padding.
// The auto-centring math (boundsTransformFor) and the in-browser bounds
// hook (useClientBounds) live in @/lib/cardTransform — see that module
// for the geometric derivation. Both are imported above; this comment is
// just a signpost for the next reader who lands here looking for the
// transform code.
// Per-asset overrides for the *rotated* card transform. Translate happens
// before rotate in CSS transforms, so when the polearm card is flipped 90°
// the unrotated translate(3%, -10%) maps to a different screen direction —
// the off-center bias of the source sprite reappears in a new corner.
// Calibrate these values by direct feedback rather than computing from the
// unrotated transform.
const CARD_TRANSFORM_ROTATED_OVERRIDE = {
    "weapon_polearm_alien_cyber.png": "scale(2.2) translate(10%, 3%) rotate(90deg)"
};
// Class-level rotated card transforms. Same matching rule as
// CARD_CLASS_TRANSFORM (name/category token match). Consulted when the
// per-filename rotated override is missing and the card is in a rotated
// orientation. Lets a whole weapon family share rotated centring without
// per-asset tuning. Per-filename CARD_TRANSFORM_ROTATED_OVERRIDE still wins.
const CARD_CLASS_ROTATED_TRANSFORM = {
    // Polearm rotated to 1×2 (vertical). Combined-bbox centre at source
    // (172, 241). After CSS rotate(90deg) clockwise (which sends (x,y) to
    // (-y,x) in screen coords), the bbox centre that was left+below source
    // centre lands at top+left of card centre; scale(2.0) magnifies that
    // offset to roughly (-16px, -7px) on a 64×128 card. Pull it back to
    // centre with translate(+25%, +5%) — positive both, applied last (so
    // operates in post-rotate screen space).
    polearm: "translate(25%, 5%) scale(2.0) rotate(90deg)"
};
function cardClassRotatedTransform(item) {
    const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
    for (const token of Object.keys(CARD_CLASS_ROTATED_TRANSFORM)){
        if (haystack.includes(token)) return CARD_CLASS_ROTATED_TRANSFORM[token];
    }
    return null;
}
// True for any slot that belongs in the hair tab. The backend currently
// only exposes the bare "HAIR" enum, but mock items can use the planned
// granular variants ("HAIR_FRONT", "HAIR_BACK") — without recognising
// those, the static demo files them under the equipment tab instead.
function isHairSlot(slot) {
    return slot === "HAIR" || slot === "HAIR_FRONT" || slot === "HAIR_BACK";
}
// Weapons share a single "held by the chibi" equipment group across three
// underlying slots: the legacy HAND enum, WEAPON_FRONT (sword in hand), and
// WEAPON_BACK (sheath / quiver on the back). Equipping any of them should
// unequip whatever was held before, even across slots — the chibi can only
// brandish one weapon at a time.
function isWeaponSlot(slot) {
    return slot === "HAND" || slot === "WEAPON_FRONT" || slot === "WEAPON_BACK";
}
// Resident-Evil-style inventory: items take up a different number of grid
// cells depending on what they are. The backend now stores gridCols/gridRows
// per item — when set we honour those directly. Older rows without a stored
// size fall back to a slot-based heuristic so the page still renders.
function getItemSize(item) {
    const cat = (item.category ?? "").toLowerCase();
    // Staffs are always 2×1 in the grid — long sprite needs the horizontal
    // footprint. Takes precedence over the persisted gridCols/gridRows so
    // legacy rows stored as 1×1 (e.g. item 10 Magic Staff) get corrected on
    // load without a DB migration.
    if (cat.includes("staff")) return {
        cols: 2,
        rows: 1
    };
    // Hats (both the granular HAT slot and the legacy HEAD slot they get
    // bucketed into) are always 1×1 — overrides any persisted gridCols/Rows
    // so a hat row stored as 2×1 doesn't take an oversized footprint.
    if (item.slot === "HAT" || item.slot === "HEAD") return {
        cols: 1,
        rows: 1
    };
    if (item.gridCols && item.gridRows) {
        return {
            cols: item.gridCols,
            rows: item.gridRows
        };
    }
    switch(item.slot){
        // Legacy slots ------------------------------------------------------
        // (HEAD handled above — always 1×1 regardless of stored grid size.)
        case "HAIR":
        case "FACE":
        case "FEET":
        case "BODY":
            return {
                cols: 1,
                rows: 1
            };
        case "HAND":
            return cat === "weapon" ? {
                cols: 2,
                rows: 1
            } : {
                cols: 1,
                rows: 1
            };
        case "BACK":
            return {
                cols: 2,
                rows: 1
            };
        // Granular slots ----------------------------------------------------
        // (HAT handled above — always 1×1 regardless of stored grid size.)
        case "HAIR_FRONT":
        case "HAIR_BACK":
        case "EYE":
        case "EAR":
        case "SHOES":
        case "GLOVES":
        case "WRIST":
            return {
                cols: 1,
                rows: 1
            };
        case "TOP":
        case "BOTTOM":
            return {
                cols: 1,
                rows: 1
            };
        case "OVERALL":
            // Dress / robe — tall in inventory like RE4 body armor.
            return {
                cols: 1,
                rows: 2
            };
        case "CAPE":
            // Cloak-category capes hang straight down rather than draping wide,
            // so they fit a 1×1 cell like an outfit. Other CAPE items (wings,
            // pennants) keep the 2-wide footprint.
            return cat === "cloak" ? {
                cols: 1,
                rows: 1
            } : {
                cols: 2,
                rows: 1
            };
        case "WEAPON_BACK":
        case "WEAPON_FRONT":
            return {
                cols: 2,
                rows: 1
            };
        default:
            return {
                cols: 1,
                rows: 1
            };
    }
}
// Render hints (RENDER_HINTS, CLASS_HINTS) and applyHints() live in
// @/lib/avatarHints so every surface that renders a chibi — this page,
// the TaskDetailModal preview via useEquippedAvatar, future surfaces —
// resolves the same offset/cover/source defaults. See that module for
// the precedence rules.
// Whitelist of URL patterns that point to real (or potentially real) assets.
// Anything else — notably the legacy seed paths like `/assets/hats/…` — is
// treated as a placeholder so we never issue a 404 GET for it. Add new
// patterns here whenever a real asset source comes online.
function hasRealAsset(url) {
    if (!url) return false;
    return url.startsWith("https://wahaha.blob.core.windows.net/") || url.startsWith("/avatar-items/") || url.startsWith("data:");
}
// Step between adjacent grid cells in screen pixels — equals the cell size
// plus the 1px gap rendered by the grid container. Used by the snap-to-grid
// drag modifier so the dragged item jumps exactly cell-to-cell. Cell size
// differs between desktop and mobile, so the snap step is computed inside
// the component (see snapToGrid below) rather than living here as a module
// constant.
// Hysteresis fraction for the snap modifier: the dragged card only flips
// to the next cell once the cursor has moved past 70% of the cell step
// from the last snapped position — eliminates the back-and-forth flicker
// when the cursor hovers near a cell boundary.
const SNAP_HYSTERESIS_FRACTION = 0.7;
// Custom dnd-kit collision detector that snaps to the cell closest to the
// active item's TOP-LEFT corner (rather than the cell under the cursor).
// This makes the drop indicator follow the dragged box itself, so the user
// doesn't have to mentally offset the cursor when placing a multi-cell item.
const topLeftCellCollision = ({ collisionRect, droppableContainers, droppableRects })=>{
    if (!collisionRect) return [];
    const tx = collisionRect.left;
    const ty = collisionRect.top;
    let bestId = null;
    let bestDist = Infinity;
    for (const droppable of droppableContainers){
        const r = droppableRects.get(droppable.id);
        if (!r) continue;
        const dx = r.left - tx;
        const dy = r.top - ty;
        const d = dx * dx + dy * dy;
        if (d < bestDist) {
            bestDist = d;
            bestId = String(droppable.id);
        }
    }
    return bestId != null ? [
        {
            id: bestId
        }
    ] : [];
};
// Returns true when the rectangle (x, y, cols, rows) fits entirely inside
// the grid AND doesn't overlap any other item in `rows`. `skipId` excludes
// the item being moved from the collision check (so it doesn't collide
// with itself). `rotations` is the set of inventoryIds that are currently
// rotated 90°, swapping their cols/rows for the overlap check.
function rectFits(rows, skipId, x, y, cols, height, rotations, gridCols, gridRows) {
    if (x < 0 || y < 0 || x + cols > gridCols || y + height > gridRows) return false;
    for (const row of rows){
        if (row.inventoryId === skipId) continue;
        if (row.positionX == null || row.positionY == null) continue;
        const { cols: oCols, rows: oRows } = sizeFor(row.avatarItem, rotations.has(row.inventoryId));
        const ox = row.positionX;
        const oy = row.positionY;
        const overlap = x < ox + oCols && x + cols > ox && y < oy + oRows && y + height > oy;
        if (overlap) return false;
    }
    return true;
}
// Assigns a position to every inventory row that doesn't already have one,
// scanning the grid row-by-row for the first cell where the item's footprint
// fits without colliding with already-placed items. Items that can't fit
// stay positionless and are skipped from the grid render.
// Whether the user can rotate (Q/E) this item while dragging it. Square
// (1×1) footprints have nothing to flip, so rotation is a no-op for them.
function canRotate(item) {
    const { cols, rows } = getItemSize(item);
    return cols !== rows;
}
// Effective grid footprint of an item given its current rotation state.
// All rotatable items swap cols/rows when flipped 90°.
function sizeFor(item, rotated) {
    const base = getItemSize(item);
    if (!rotated) return base;
    return {
        cols: base.rows,
        rows: base.cols
    };
}
// True if the row's persisted position keeps its (rotation-aware) footprint
// inside the grid. Catches the case where an item's gridCols/gridRows was
// changed in the backend after the position was saved — the old position
// may now extend past the grid edge. Honours the persisted `isRotated`
// flag so a rotated 2×1 at the right edge stays valid.
function hasValidPlacement(row, gridCols, gridRows) {
    if (row.positionX == null || row.positionY == null) return false;
    if (!row.avatarItem) return false;
    const { cols, rows } = sizeFor(row.avatarItem, !!row.isRotated);
    return row.positionX >= 0 && row.positionY >= 0 && row.positionX + cols <= gridCols && row.positionY + rows <= gridRows;
}
// Convert a list of AvatarItemDto rows from the live catalog into the shape
// the avatar page expects (UserInventoryDto). Used in demo mode so the static
// build can reflect the actual catalogue — including blobs that the backend
// renamed on upload — instead of a hardcoded mock with drift-prone URLs.
// One item from each showcase slot is pre-equipped so the chibi renders
// dressed; the rest sit in the inventory grid for the user to try.
function buildInventoryFromCatalog(items) {
    const now = new Date().toISOString();
    const showcaseSlots = [
        [
            "HAT",
            "HEAD"
        ],
        [
            "TOP",
            "BODY"
        ],
        [
            "HAIR_FRONT",
            "HAIR"
        ],
        [
            "WEAPON_FRONT",
            "HAND",
            "WEAPON_BACK"
        ]
    ];
    const equippedIds = new Set();
    for (const group of showcaseSlots){
        const match = items.find((it)=>group.includes(it.slot) && !equippedIds.has(it.itemId));
        if (match) equippedIds.add(match.itemId);
    }
    return items.map((item, i)=>({
            inventoryId: 9100 + i,
            userId: "00000000-0000-0000-0000-000000000000",
            itemId: item.itemId,
            acquiredAt: now,
            isEquipped: equippedIds.has(item.itemId),
            avatarItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyHints"])(item),
            positionX: null,
            positionY: null
        }));
}
// Demo-mode inventory loader. Tries the live catalogue endpoint first so the
// static-export demo picks up backend renames automatically; falls back to the
// hardcoded mock on any failure (CORS, network, app stopped, empty response).
// Static export can't use the `/backend` dev rewrite, so this fetches the API
// directly via NEXT_PUBLIC_API_URL — make sure backend CORS allows the
// GitHub Pages origin or the call will fail and we'll quietly fall back.
async function loadDemoInventory() {
    const apiUrl = (("TURBOPACK compile-time value", "http://localhost:5086") ?? "").replace(/\/$/, "");
    if (apiUrl) {
        try {
            const res = await fetch(`${apiUrl}/api/AvatarItems?pageSize=200`);
            if (res.ok) {
                const page = await res.json();
                // Drop legacy seed rows whose previewAssetUrl is a relative path
                // (e.g. "/assets/outfits/cloak_adventurer.png") — those files
                // don't exist on the static export OR on the API host, so they'd
                // render as PaperIcon. Showing only blob-hosted items keeps the
                // demo grid consistent.
                const items = (page.data ?? []).filter((it)=>hasRealAsset(it.previewAssetUrl));
                if (items.length > 0) return buildInventoryFromCatalog(items);
            }
        } catch  {
        // Swallow — fall through to the hardcoded mock.
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$mockAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildMockInventory"])().map((row)=>({
            ...row,
            avatarItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyHints"])(row.avatarItem)
        }));
}
function autoPlace(rows, gridCols, gridRows) {
    // Build a rotations set from the persisted `isRotated` flags so the
    // collision check inside rectFits uses each row's actual footprint
    // (rotated rows have swapped cols/rows).
    const persistedRotations = new Set(rows.filter((r)=>r.isRotated).map((r)=>r.inventoryId));
    // Strip persisted positions that no longer fit inside the grid (e.g.
    // an item's size grew after a backend migration). Those rows fall back
    // into the "needs placement" queue and get a fresh slot.
    const placed = rows.filter((r)=>hasValidPlacement(r, gridCols, gridRows)).slice();
    const result = [
        ...placed
    ];
    for (const row of rows){
        if (hasValidPlacement(row, gridCols, gridRows)) continue;
        // Re-placement honours the item's persisted rotation so a rotated
        // polearm gets a slot that fits its rotated footprint.
        const size = sizeFor(row.avatarItem, !!row.isRotated);
        let assigned = null;
        outer: for(let y = 0; y < gridRows; y++){
            for(let x = 0; x < gridCols; x++){
                if (rectFits(result, null, x, y, size.cols, size.rows, persistedRotations, gridCols, gridRows)) {
                    assigned = {
                        x,
                        y
                    };
                    break outer;
                }
            }
        }
        const next = assigned ? {
            ...row,
            positionX: assigned.x,
            positionY: assigned.y
        } : {
            ...row,
            positionX: null,
            positionY: null
        };
        result.push(next);
    }
    return result;
}
function AvatarPage() {
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasToken, setHasToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [inventory, setInventory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Role flags drive the admin manage-items panel below the inventory.
    // Both flags are false until the JWT has been read on the client, so the
    // panel is automatically hidden during SSR and the first paint.
    const userRoles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useUserRoles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserRoles"])();
    // Hair has its own grid so the main inventory isn't cluttered with wigs.
    // Position is stored per inventory row; collision checks are scoped to
    // the active tab so hair and equipment can share the same coordinates.
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("equipment");
    // Inventory IDs currently rotated 90° (cols/rows swapped). Ephemeral —
    // not persisted, so refresh resets every item to its native orientation.
    // Toggled by Q/E while an item is being dragged.
    const [rotations, setRotations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // The inventoryId of the item currently being dragged, or null if no drag
    // is active. Used to scope the Q/E keydown handler.
    const [activeDragId, setActiveDragId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Inventory IDs currently being mutated — used to disable the card mid-request.
    const [busyIds, setBusyIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Item IDs whose preview PNG returned a non-OK response — those cards
    // render a pixelated paper placeholder instead of the broken image.
    const [failedIds, setFailedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const { setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const isDesktop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDesktopLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesktopLayout"])();
    const { cols: gridCols, rows: gridRows } = isDesktop ? GRID_DESKTOP : GRID_MOBILE;
    // Active cell size and derived snap step. Mobile uses a smaller cell so
    // the grid fits inside narrow phone viewports without horizontal scroll;
    // the snap step must follow it so drag positioning lines up cell-to-cell
    // at the rendered size.
    const cellPx = isDesktop ? CELL_PX_DESKTOP : CELL_PX_MOBILE;
    const snapStep = cellPx + 1;
    const snapHysteresis = snapStep * SNAP_HYSTERESIS_FRACTION;
    // Per-viewport position caches. Each shape (desktop 7×5, mobile 5×7) keeps
    // its own canonical layout so flipping between them never destroys the
    // arrangement the user built on either one. The desktop cache is seeded
    // from backend positions on first load; the mobile cache is populated on
    // its first activation by autoPlace on top of the desktop layout — items
    // that fit keep their (x, y), items that don't get the top-most free slot.
    const desktopPositionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const mobilePositionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const lastModeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Flipped once the initial inventory load resolves so the per-mode swap
    // effect knows it's safe to run.
    const [inventoryLoaded, setInventoryLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
        const token = !!localStorage.getItem("auth_token");
        setHasToken(token);
        if (!token) {
            // Demo mode — try the live catalogue first so blob renames on upload
            // surface automatically; fall back to the hardcoded mock if the API
            // is unreachable. Positions stay null; the per-mode swap effect runs
            // autoPlace for the active viewport and caches the result. Equip /
            // unequip and setPosition calls below are guarded so nothing hits
            // the backend in this mode.
            loadDemoInventory().then((rows)=>{
                setInventory(rows);
                setInventoryLoaded(true);
                setLoading(false);
            });
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].getInventory(1, 200).then(({ data, error })=>{
            if (error) setError(error);
            const rows = (data?.data ?? []).filter((row)=>row.avatarItem?.previewAssetUrl).map((row)=>({
                    ...row,
                    avatarItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$avatar$2f$hints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyHints"])(row.avatarItem)
                }));
            // Seed the desktop cache from the persisted backend positions so the
            // swap effect can treat the cache as the source of truth uniformly.
            for (const row of rows){
                if (row.positionX != null && row.positionY != null) {
                    desktopPositionsRef.current.set(row.inventoryId, {
                        x: row.positionX,
                        y: row.positionY,
                        rotated: !!row.isRotated
                    });
                }
            }
            setInventory(rows);
            setRotations(new Set(rows.filter((r)=>r.isRotated).map((r)=>r.inventoryId)));
            setInventoryLoaded(true);
            setLoading(false);
        });
    }, [
        setError
    ]);
    // Per-mode swap. Fires when the viewport flips (or on first inventory
    // load). Snapshots the outgoing layout into its cache, then restores the
    // incoming layout from its cache and runs autoPlace for anything missing.
    // Newly-assigned desktop positions are persisted to the backend so the
    // user's first-ever layout sticks across reloads; mobile is session-only.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!inventoryLoaded) return;
        const mode = isDesktop ? "desktop" : "mobile";
        const previousMode = lastModeRef.current;
        if (previousMode === mode) return;
        // Update the ref now so any concurrent reads (e.g. the sync-cache effect
        // firing on the resulting setInventory) target the new mode's cache.
        lastModeRef.current = mode;
        setInventory((prev)=>{
            if (prev.length === 0) return prev;
            // 1. Snapshot the rendered positions into the OUTGOING cache so the
            //    user's edits on the previous viewport are preserved when they
            //    flip back.
            const outgoing = previousMode === "desktop" ? desktopPositionsRef.current : previousMode === "mobile" ? mobilePositionsRef.current : null;
            if (outgoing) {
                for (const r of prev){
                    if (r.positionX != null && r.positionY != null) {
                        outgoing.set(r.inventoryId, {
                            x: r.positionX,
                            y: r.positionY,
                            rotated: !!r.isRotated
                        });
                    } else {
                        outgoing.delete(r.inventoryId);
                    }
                }
            }
            // 2. Restore each row's position from the INCOMING cache; items with
            //    no cached entry fall through to autoPlace below.
            const incoming = mode === "desktop" ? desktopPositionsRef.current : mobilePositionsRef.current;
            const seeded = prev.map((r)=>{
                const c = incoming.get(r.inventoryId);
                if (c) return {
                    ...r,
                    positionX: c.x,
                    positionY: c.y,
                    isRotated: c.rotated
                };
                return {
                    ...r,
                    positionX: null,
                    positionY: null
                };
            });
            // 3. autoPlace anything still missing on the incoming grid shape.
            const targetCols = mode === "desktop" ? GRID_DESKTOP.cols : GRID_MOBILE.cols;
            const targetRows = mode === "desktop" ? GRID_DESKTOP.rows : GRID_MOBILE.rows;
            const equipRows = seeded.filter((r)=>!isHairSlot(r.avatarItem?.slot));
            const hairRows = seeded.filter((r)=>isHairSlot(r.avatarItem?.slot));
            const placed = [
                ...autoPlace(equipRows, targetCols, targetRows),
                ...autoPlace(hairRows, targetCols, targetRows)
            ];
            // 4. Write back to the incoming cache so future flips restore exactly
            //    this layout, and record which items got brand-new positions —
            //    those are the only ones we persist to the backend (and only on
            //    desktop, since the backend column stores the desktop layout).
            const newlyAssigned = [];
            for (const r of placed){
                if (r.positionX == null || r.positionY == null) continue;
                const hadCache = incoming.has(r.inventoryId);
                incoming.set(r.inventoryId, {
                    x: r.positionX,
                    y: r.positionY,
                    rotated: !!r.isRotated
                });
                if (!hadCache && mode === "desktop") {
                    newlyAssigned.push({
                        id: r.inventoryId,
                        x: r.positionX,
                        y: r.positionY,
                        rotated: !!r.isRotated
                    });
                }
            }
            if (hasToken && newlyAssigned.length > 0) {
                for (const a of newlyAssigned){
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].setPosition(a.id, a.x, a.y, a.rotated);
                }
            }
            // 5. Sync the rotation Set so the keyboard handler stays in lockstep
            //    with the rendered orientation.
            setRotations(new Set(placed.filter((r)=>r.isRotated).map((r)=>r.inventoryId)));
            return placed;
        });
    }, [
        isDesktop,
        inventoryLoaded,
        hasToken
    ]);
    // Keep the active mode's cache in sync on every inventory change (drag,
    // rotate, equip won't touch position). Without this, edits made between
    // viewport flips would be lost when the swap effect reads the cache.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!inventoryLoaded || lastModeRef.current === null) return;
        const cache = lastModeRef.current === "desktop" ? desktopPositionsRef.current : mobilePositionsRef.current;
        for (const r of inventory){
            if (r.positionX != null && r.positionY != null) {
                cache.set(r.inventoryId, {
                    x: r.positionX,
                    y: r.positionY,
                    rotated: !!r.isRotated
                });
            } else {
                cache.delete(r.inventoryId);
            }
        }
    }, [
        inventory,
        inventoryLoaded
    ]);
    // The chibi only renders items that are flagged equipped.
    const equipped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>inventory.filter((inv)=>inv.isEquipped), [
        inventory
    ]);
    // Share equipped with the TaskDetailModal cache — the modal pulls
    // through useEquippedAvatar(), which would otherwise fetch its own
    // copy from /api/UserInventory/equipped on first open. Priming here
    // means once the user has loaded /avatar, the modal opens with the
    // chibi already populated, no fetch flicker.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hasToken) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useEquippedAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["primeEquippedAvatarCache"])(equipped);
    }, [
        equipped,
        hasToken
    ]);
    // Items in the currently-visible tab. The grid render and the inventory
    // count both key off this so hair is hidden until the user switches tabs.
    const visibleInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>inventory.filter((inv)=>activeTab === "hair" ? isHairSlot(inv.avatarItem?.slot) : !isHairSlot(inv.avatarItem?.slot)), [
        inventory,
        activeTab
    ]);
    // dnd-kit sensors — small activation distance so a click doesn't get
    // misread as a drag. Touch starts on a 150ms long-press so iOS doesn't
    // hijack a tap into a drag.
    const sensors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSensors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointerSensor"], {
        activationConstraint: {
            distance: 4
        }
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TouchSensor"], {
        activationConstraint: {
            delay: 150,
            tolerance: 6
        }
    }));
    // Last snapped (x, y) the dragged card was rendered at, in drag-delta
    // pixels. Carried across pointer moves to add hysteresis to the snap
    // modifier so the card doesn't flicker between two cells when the
    // cursor hovers near a boundary. Reset on every drag start.
    const lastSnapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const snapToGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(({ transform })=>{
        const last = lastSnapRef.current;
        let x = last.x;
        let y = last.y;
        if (Math.abs(transform.x - last.x) >= snapHysteresis) {
            x = Math.round(transform.x / snapStep) * snapStep;
        }
        if (Math.abs(transform.y - last.y) >= snapHysteresis) {
            y = Math.round(transform.y / snapStep) * snapStep;
        }
        // Clamp the snap within the grid so the dragged box can't translate
        // outside the inventory bounds. Uses the moving item's current position
        // and (rotation-aware) size to compute the allowed delta range.
        if (activeDragId != null) {
            const moving = inventory.find((r)=>r.inventoryId === activeDragId);
            if (moving?.avatarItem && moving.positionX != null && moving.positionY != null) {
                const { cols, rows } = sizeFor(moving.avatarItem, rotations.has(activeDragId));
                const minX = -moving.positionX * snapStep;
                const maxX = (gridCols - moving.positionX - cols) * snapStep;
                const minY = -moving.positionY * snapStep;
                const maxY = (gridRows - moving.positionY - rows) * snapStep;
                x = Math.max(minX, Math.min(maxX, x));
                y = Math.max(minY, Math.min(maxY, y));
            }
        }
        lastSnapRef.current = {
            x,
            y
        };
        return {
            ...transform,
            x,
            y
        };
    }, [
        activeDragId,
        inventory,
        rotations,
        gridCols,
        gridRows,
        snapStep,
        snapHysteresis
    ]);
    const modifiers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            snapToGrid
        ], [
        snapToGrid
    ]);
    const onDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        lastSnapRef.current = {
            x: 0,
            y: 0
        };
        const id = event.active.id;
        if (typeof id === "number") setActiveDragId(id);
    }, []);
    const onDragCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setActiveDragId(null);
    }, []);
    const onDragEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        setActiveDragId(null);
        const invId = event.active.id;
        const overId = event.over?.id;
        if (typeof invId !== "number" || typeof overId !== "string") return;
        // Drop targets are keyed as "cell-{x}-{y}".
        const match = /^cell-(\d+)-(\d+)$/.exec(overId);
        if (!match) return;
        const x = Number(match[1]);
        const y = Number(match[2]);
        const moving = inventory.find((r)=>r.inventoryId === invId);
        if (!moving?.avatarItem) return;
        const { cols, rows } = sizeFor(moving.avatarItem, rotations.has(invId));
        // Only collide against items in the same tab — hair items share grid
        // coordinates with equipment but live in a separate view.
        const movingIsHair = isHairSlot(moving.avatarItem.slot);
        const sameTab = inventory.filter((r)=>isHairSlot(r.avatarItem?.slot) === movingIsHair);
        if (!rectFits(sameTab, invId, x, y, cols, rows, rotations, gridCols, gridRows)) return;
        const rotated = rotations.has(invId);
        if (moving.positionX === x && moving.positionY === y && moving.isRotated === rotated) return;
        setInventory((prev)=>prev.map((row)=>row.inventoryId === invId ? {
                    ...row,
                    positionX: x,
                    positionY: y,
                    isRotated: rotated
                } : row));
        // Mobile keeps its layout in the in-memory cache only; persisting mobile
        // coords would clobber the desktop position on the backend.
        if (!hasToken || !isDesktop) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].setPosition(invId, x, y, rotated).then(({ error })=>{
            if (error) setError(error);
        });
    }, [
        inventory,
        rotations,
        setError,
        gridCols,
        gridRows,
        hasToken,
        isDesktop
    ]);
    // Q/E toggles rotation on the item currently being dragged. The handler is
    // installed only while a drag is active so the keys behave normally when
    // the user isn't interacting with the grid. Each toggle persists immediately
    // so a cancelled drag still keeps the new orientation.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (activeDragId == null) return;
        const dragging = inventory.find((r)=>r.inventoryId === activeDragId);
        // Skip the listener entirely for items that can't rotate — 1×1
        // footprints and BODY-slot (sweater/torso) items keep their shape.
        if (!dragging?.avatarItem || !canRotate(dragging.avatarItem)) return;
        const onKey = (e)=>{
            if (e.key !== "q" && e.key !== "Q" && e.key !== "e" && e.key !== "E") return;
            // Browser fires keydown repeatedly while a key is held (~30Hz). Each
            // repeat would toggle rotation again, so the box flickers between
            // shapes and lands wherever the last fire happens to be. Only respond
            // to the first event per physical press.
            if (e.repeat) return;
            e.preventDefault();
            const newRotated = !rotations.has(activeDragId);
            // Compute the rotated footprint and clamp positionX/Y so the box
            // can't extend past the grid bounds. Without this, rotating e.g. a
            // 1×2 item at the rightmost column into a 2×1 footprint leaves the
            // card hanging off the right edge until the user drops it
            // somewhere else. Clamping here keeps the box inside the grid as
            // soon as the rotation key is hit.
            const newSize = sizeFor(dragging.avatarItem, newRotated);
            const curX = dragging.positionX ?? 0;
            const curY = dragging.positionY ?? 0;
            const clampedX = Math.max(0, Math.min(curX, gridCols - newSize.cols));
            const clampedY = Math.max(0, Math.min(curY, gridRows - newSize.rows));
            setRotations((prev)=>{
                const n = new Set(prev);
                if (newRotated) n.add(activeDragId);
                else n.delete(activeDragId);
                return n;
            });
            setInventory((prev)=>prev.map((r)=>r.inventoryId === activeDragId ? {
                        ...r,
                        isRotated: newRotated,
                        positionX: clampedX,
                        positionY: clampedY
                    } : r));
            // Mobile rotation is session-only; the backend column tracks the
            // desktop layout exclusively.
            if (!hasToken || !isDesktop) return;
            // Fire-and-forget — keeps the rotation pinned (and the clamped
            // position persisted) even if the user releases the mouse outside
            // the grid (drag-cancel).
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].setPosition(activeDragId, clampedX, clampedY, newRotated);
        };
        document.addEventListener("keydown", onKey);
        return ()=>document.removeEventListener("keydown", onKey);
    }, [
        activeDragId,
        inventory,
        rotations,
        hasToken,
        isDesktop,
        gridCols,
        gridRows
    ]);
    async function onCardClick(inv) {
        if (busyIds.has(inv.inventoryId)) return;
        setBusyIds((prev)=>new Set(prev).add(inv.inventoryId));
        try {
            if (inv.isEquipped) {
                if (hasToken) {
                    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].unequip(inv.inventoryId);
                    if (error) {
                        setError(error);
                        return;
                    }
                }
                setInventory((prev)=>prev.map((row)=>row.inventoryId === inv.inventoryId ? {
                            ...row,
                            isEquipped: false
                        } : row));
            } else {
                const slot = inv.avatarItem?.slot;
                // Cross-slot weapon group: equipping any HAND / WEAPON_FRONT /
                // WEAPON_BACK item should unequip every other weapon, not just
                // same-slot duplicates (which the backend's equip call already
                // handles). Identify the rows to unequip first so we can fire the
                // backend calls before the local optimistic update.
                const crossWeaponRows = isWeaponSlot(slot) ? inventory.filter((row)=>row.isEquipped && row.inventoryId !== inv.inventoryId && isWeaponSlot(row.avatarItem?.slot) && row.avatarItem?.slot !== slot) : [];
                if (hasToken) {
                    // Unequip the other weapons sequentially so a 5xx on one doesn't
                    // leave the rest in a half-applied state.
                    for (const row of crossWeaponRows){
                        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].unequip(row.inventoryId);
                        if (error) {
                            setError(error);
                            return;
                        }
                    }
                    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$api$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avatarApi"].equip(inv.inventoryId);
                    if (error) {
                        setError(error);
                        return;
                    }
                }
                // Mirror locally: flip this row on, and turn off any same-slot
                // duplicate (backend rule) plus any cross-weapon-group row we
                // just unequipped via the API.
                const droppedIds = new Set(crossWeaponRows.map((r)=>r.inventoryId));
                setInventory((prev)=>prev.map((row)=>{
                        if (row.inventoryId === inv.inventoryId) return {
                            ...row,
                            isEquipped: true
                        };
                        if (droppedIds.has(row.inventoryId)) return {
                            ...row,
                            isEquipped: false
                        };
                        if (row.isEquipped && row.avatarItem?.slot === slot) return {
                            ...row,
                            isEquipped: false
                        };
                        return row;
                    }));
            }
            // Equip state changed — drop the equipped-items cache so the next
            // TaskDetailModal open re-fetches and shows the same chibi the
            // /avatar page is currently displaying.
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useEquippedAvatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearEquippedAvatarCache"])();
        } finally{
            setBusyIds((prev)=>{
                const n = new Set(prev);
                n.delete(inv.inventoryId);
                return n;
            });
        }
    }
    if (!isMounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen",
        style: {
            background: "var(--color-bg)"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto px-4 py-6 flex flex-col gap-5",
            style: {
                maxWidth: isDesktop ? 1024 : 448
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "text-[10px] tracking-widest uppercase font-semibold",
                            style: {
                                color: "var(--color-fg-subtle)",
                                textDecoration: "none"
                            },
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 921,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-xs font-semibold",
                            style: {
                                color: "var(--color-fg)",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase"
                            },
                            children: "Avatar"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 928,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                width: 40
                            },
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 934,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                    lineNumber: 920,
                    columnNumber: 9
                }, this),
                !hasToken && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$DemoModeBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    className: ""
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                    lineNumber: 937,
                    columnNumber: 23
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexDirection: isDesktop ? "row" : "column",
                        // 60px on desktop gives the chibi's right-side overhang
                        // (which can carry up to 96 displayed pixels of weapon tip
                        // past the layout width of the section) clear visual space
                        // before the inventory grid's bright hairline border begins.
                        gap: isDesktop ? 60 : 20,
                        alignItems: isDesktop ? "flex-start" : "stretch"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "flex flex-col items-center justify-center",
                            style: {
                                padding: "12px 16px 4px",
                                flex: isDesktop ? "0 0 auto" : undefined,
                                position: isDesktop ? "sticky" : undefined,
                                top: isDesktop ? 24 : undefined,
                                alignSelf: isDesktop ? "flex-start" : undefined
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ChibiAvatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    equipped: equipped,
                                    height: isDesktop ? 240 : 160
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                    lineNumber: 964,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        fontSize: 9,
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        marginTop: 14
                                    },
                                    children: loading ? "Loading…" : equipped.length === 0 ? "Nothing equipped" : `${equipped.length} equipped`
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                    lineNumber: 965,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 954,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "flex flex-col gap-3",
                            style: {
                                flex: isDesktop ? "1 1 auto" : undefined,
                                minWidth: 0,
                                alignItems: isDesktop ? undefined : "center"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        fontSize: 9,
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        fontWeight: 600
                                    },
                                    children: [
                                        "Inventory ",
                                        !loading && `(${visibleInventory.length})`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                    lineNumber: 982,
                                    columnNumber: 11
                                }, this),
                                !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: 6
                                    },
                                    children: [
                                        "equipment",
                                        "hair"
                                    ].map((tab)=>{
                                        const active = activeTab === tab;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setActiveTab(tab),
                                            style: {
                                                padding: "5px 12px",
                                                fontSize: 10,
                                                letterSpacing: "0.18em",
                                                textTransform: "uppercase",
                                                fontWeight: 600,
                                                borderRadius: 0,
                                                // RE4-style flat tab: bright hairline border, very
                                                // dark transparent fill when active; muted text when
                                                // inactive.
                                                border: "1px solid rgba(220, 230, 235, 0.55)",
                                                background: active ? "rgba(40, 44, 48, 0.85)" : "rgba(20, 22, 24, 0.55)",
                                                color: active ? "rgba(235, 240, 245, 0.95)" : "rgba(170, 180, 185, 0.6)",
                                                cursor: "pointer"
                                            },
                                            children: tab
                                        }, tab, false, {
                                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                            lineNumber: 998,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                    lineNumber: 994,
                                    columnNumber: 13
                                }, this),
                                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        fontSize: 11
                                    },
                                    children: "Loading items…"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                    lineNumber: 1025,
                                    columnNumber: 13
                                }, this) : visibleInventory.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "var(--color-fg-subtle)",
                                        fontSize: 11
                                    },
                                    children: activeTab === "hair" ? "No hair items yet." : "You don’t own any items yet."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                    lineNumber: 1027,
                                    columnNumber: 13
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DndContext"], {
                                    sensors: sensors,
                                    collisionDetection: topLeftCellCollision,
                                    modifiers: modifiers,
                                    onDragStart: onDragStart,
                                    onDragEnd: onDragEnd,
                                    onDragCancel: onDragCancel,
                                    // dnd-kit's default auto-scroll engages whenever the dragged
                                    // item's rect approaches the edge of any scrollable ancestor
                                    // — on mobile the page itself is taller than the viewport,
                                    // so dragging a card downward toward the thumb-rest area
                                    // makes the whole page scroll uncontrollably. The grid fits
                                    // entirely in view and never needs scrolling during a drag,
                                    // so we opt out completely.
                                    autoScroll: false,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        "data-edge-drawer-block": true,
                                        style: {
                                            overflowX: "auto",
                                            paddingBottom: 4,
                                            margin: isDesktop ? "0 -8px" : 0,
                                            padding: isDesktop ? "0 8px 6px" : "0 0 6px"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: 1,
                                                // RE4-style: very dark transparent grid background with a
                                                // bright hairline outer border — almost monochrome, no
                                                // blue tint.
                                                background: "rgba(200, 210, 215, 0.18)",
                                                border: "1px solid rgba(220, 230, 235, 0.6)",
                                                borderRadius: 0,
                                                display: "grid",
                                                gridTemplateColumns: `repeat(${gridCols}, ${cellPx}px)`,
                                                gridTemplateRows: `repeat(${gridRows}, ${cellPx}px)`,
                                                gap: 1,
                                                width: "fit-content",
                                                // Desktop: left-aligned so the grid's left edge lines up
                                                // with the tab strip's leftmost tab. Mobile: horizontally
                                                // centred in the page so the narrower 5×7 grid sits in
                                                // the middle of the screen rather than hugging the left.
                                                margin: isDesktop ? 0 : "0 auto"
                                            },
                                            children: [
                                                Array.from({
                                                    length: gridCols * gridRows
                                                }).map((_, i)=>{
                                                    const x = i % gridCols;
                                                    const y = Math.floor(i / gridCols);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DropCell, {
                                                        x: x,
                                                        y: y
                                                    }, `cell-${x}-${y}`, false, {
                                                        fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                                        lineNumber: 1097,
                                                        columnNumber: 26
                                                    }, this);
                                                }),
                                                visibleInventory.filter((row)=>row.positionX != null && row.positionY != null).map((inv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DraggableItem, {
                                                        inv: inv,
                                                        busy: busyIds.has(inv.inventoryId),
                                                        failed: failedIds.has(inv.avatarItem.itemId),
                                                        rotated: rotations.has(inv.inventoryId),
                                                        dimmed: activeDragId != null && activeDragId !== inv.inventoryId,
                                                        onCardClick: onCardClick,
                                                        onImageError: (itemId)=>setFailedIds((prev)=>{
                                                                if (prev.has(itemId)) return prev;
                                                                const n = new Set(prev);
                                                                n.add(itemId);
                                                                return n;
                                                            })
                                                    }, inv.inventoryId, false, {
                                                        fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                                        lineNumber: 1103,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                        lineNumber: 1061,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                                    lineNumber: 1033,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 974,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                    lineNumber: 941,
                    columnNumber: 9
                }, this),
                userRoles.ready && userRoles.canManageAvatarItems && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$AvatarAdminPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    isAdmin: userRoles.isAdmin,
                    isModerator: userRoles.isModerator
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                    lineNumber: 1131,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
            lineNumber: 916,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/avatar/page.tsx",
        lineNumber: 915,
        columnNumber: 5
    }, this);
}
// Single empty grid cell. dnd-kit treats it as a drop target keyed by
// `cell-{x}-{y}`. The cell visually fills the grid slot at (x, y) with the
// recessed-pocket look from the original RE-style design.
function DropCell({ x, y }) {
    const { setNodeRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDroppable"])({
        id: `cell-${x}-${y}`
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: setNodeRef,
        style: {
            gridColumnStart: x + 1,
            gridRowStart: y + 1,
            // Desaturated dark fill with a soft inner vignette — matches the
            // RE4-style attaché-case pocket look.
            background: "rgba(28, 30, 32, 0.65)",
            boxShadow: "inset 0 0 18px rgba(0, 0, 0, 0.55)"
        }
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/avatar/page.tsx",
        lineNumber: 1147,
        columnNumber: 5
    }, this);
}
// Single inventory card. Drag handles come from dnd-kit's useDraggable. The
// card is rendered ON TOP of the drop-cell underlay using explicit
// gridColumnStart / gridRowStart from inv.positionX / inv.positionY.
function DraggableItem({ inv, busy, failed, rotated, dimmed, onCardClick, onImageError }) {
    const item = inv.avatarItem;
    // Effective footprint — accounts for rotation, except BODY items which
    // keep their native shape so the box doesn't morph on Q/E.
    const size = sizeFor(item, rotated);
    const isEquipped = inv.isEquipped;
    const { attributes, listeners, setNodeRef, transform, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDraggable"])({
        id: inv.inventoryId
    });
    // Run the alpha-scan client-side so the card centres even when the row
    // doesn't have server-stored bounds yet (legacy uploads, URL registers
    // from an older build). The result is cached per URL, so a re-render
    // doesn't re-scan. Null while loading or when the scan can't run.
    const clientBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$cardTransform$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClientBounds"])(item.previewAssetUrl ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(item.previewAssetUrl) : null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: setNodeRef,
        type: "button",
        onClick: ()=>{
            if (!isDragging) onCardClick(inv);
        },
        disabled: busy,
        title: item.description ?? item.name,
        // Drop the `re-cell` class while dragging so its `:hover` rule (which
        // forces a blue background via !important) can never match. The
        // `is-dragging` class pins the yellow look on its own.
        className: isDragging ? "is-dragging" : "re-cell",
        style: {
            gridColumnStart: (inv.positionX ?? 0) + 1,
            gridColumnEnd: `span ${size.cols}`,
            gridRowStart: (inv.positionY ?? 0) + 1,
            gridRowEnd: `span ${size.rows}`,
            background: isDragging ? "var(--color-active-highlight-bg)" : isEquipped ? "rgba(48, 52, 56, 0.85)" : "rgba(28, 30, 32, 0.85)",
            boxShadow: isDragging ? "inset 0 0 0 2px var(--color-active-highlight)" : isEquipped ? "inset 0 0 0 1px rgba(230, 235, 240, 0.9)" : "inset 0 0 18px rgba(0, 0, 0, 0.55)",
            border: "none",
            padding: 0,
            cursor: busy ? "wait" : isDragging ? "grabbing" : "grab",
            // Dim non-dragged cards while a drag is in progress so the yellow
            // dragged item is unambiguous even when the cursor hovers over a
            // different equipped (blue) card after the snap.
            opacity: busy ? 0.5 : dimmed ? 0.35 : 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            zIndex: isDragging ? 50 : 1,
            touchAction: "none"
        },
        ...listeners,
        ...attributes,
        children: [
            hasRealAsset(item.previewAssetUrl) && !failed ? (()=>{
                // Resolve the shared transform once — both layers (primary +
                // optional secondary) are drawn on the same source canvas at the
                // same anchor, so they share the bbox-derived translate/scale.
                // Pass the un-rotated card footprint (getItemSize, not the
                // rotation-aware `size`) so the math centres against the actual
                // rendered box even when the frontend has overridden the item's
                // persisted gridCols/gridRows (e.g. staffs forced to 2×1).
                const filename = item.previewAssetUrl?.split("/").pop() ?? "";
                const cardSize = getItemSize(item);
                // For two-layer items, the primary's bbox doesn't represent the
                // combined visual — auto-centring against it pushes the secondary
                // off-frame and over-scales the primary. Fall through to the slot
                // default (or per-asset override) so both layers stay coherent;
                // hand-tune via CARD_TRANSFORM_OVERRIDE if a specific item needs it.
                const isTwoLayer = !!item.secondaryAssetUrl && hasRealAsset(item.secondaryAssetUrl);
                const autoBounds = isTwoLayer ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$cardTransform$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundsTransformFor"])(item, clientBounds, {
                    cols: cardSize.cols,
                    rows: cardSize.rows
                });
                const baseTransform = autoBounds ?? CARD_TRANSFORM_OVERRIDE[filename] ?? cardClassTransform(item) ?? SLOT_TRANSFORM[item.slot] ?? "scale(1.4)";
                const layerTransform = (()=>{
                    if (!rotated || item.slot === "BODY") return baseTransform;
                    const rotatedOverride = CARD_TRANSFORM_ROTATED_OVERRIDE[filename];
                    if (rotatedOverride) return rotatedOverride;
                    const rotatedClass = cardClassRotatedTransform(item);
                    if (rotatedClass) return rotatedClass;
                    const scale = baseTransform.match(/scale\([^)]+\)/)?.[0] ?? "scale(1.4)";
                    return `${scale} rotate(90deg)`;
                })();
                const hasSecondary = item.secondaryAssetUrl && hasRealAsset(item.secondaryAssetUrl);
                // Secondary's z-order on the card mirrors ChibiAvatar:
                //   CAPE         primary = back panel    → secondary in FRONT
                //   HAIR_FRONT   primary = bangs         → secondary BEHIND
                //   WEAPON_FRONT primary = front weapon  → secondary BEHIND
                const secondaryInFront = item.slot === "CAPE";
                const layerStyle = (z)=>({
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        imageRendering: "pixelated",
                        transform: layerTransform,
                        transformOrigin: "center",
                        pointerEvents: "none",
                        zIndex: z
                    });
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        hasSecondary && !secondaryInFront && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(item.secondaryAssetUrl),
                            alt: "",
                            width: 120,
                            height: 120,
                            unoptimized: true,
                            loading: "eager",
                            draggable: false,
                            style: layerStyle(0)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 1291,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(item.previewAssetUrl),
                            alt: "",
                            width: 120,
                            height: 120,
                            unoptimized: true,
                            loading: "eager",
                            draggable: false,
                            onError: ()=>onImageError(item.itemId),
                            style: layerStyle(1)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 1302,
                            columnNumber: 13
                        }, this),
                        hasSecondary && secondaryInFront && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assetPath"])(item.secondaryAssetUrl),
                            alt: "",
                            width: 120,
                            height: 120,
                            unoptimized: true,
                            loading: "eager",
                            draggable: false,
                            style: layerStyle(2)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                            lineNumber: 1314,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true);
            })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PaperIcon, {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1328,
                columnNumber: 9
            }, this),
            isEquipped && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": true,
                style: {
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    // Small bright accent on equipped cards — RE4 uses subdued
                    // off-white markers on owned items.
                    background: "rgba(235, 240, 245, 0.95)",
                    boxShadow: "0 0 5px rgba(235, 240, 245, 0.7)"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1331,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/avatar/page.tsx",
        lineNumber: 1192,
        columnNumber: 5
    }, this);
}
// Pixel-art "document" silhouette used as a fallback when an item's preview
// PNG fails to load. Sized to fit its parent — both width and height are
// 60% so the icon sits centered with a little padding inside the card's
// image area. Tinted via currentColor so it picks up the muted foreground.
function PaperIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "60%",
        height: "60%",
        viewBox: "0 0 10 12",
        shapeRendering: "crispEdges",
        fill: "var(--color-fg-muted)",
        style: {
            imageRendering: "pixelated"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "1",
                y: "1",
                width: "6",
                height: "1"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1366,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "7",
                y: "1",
                width: "1",
                height: "2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "8",
                y: "2",
                width: "1",
                height: "2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1369,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "9",
                y: "3",
                width: "1",
                height: "8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1370,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "1",
                y: "11",
                width: "9",
                height: "1"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1372,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "1",
                y: "1",
                width: "1",
                height: "11"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1374,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "2",
                y: "2",
                width: "5",
                height: "9",
                fill: "var(--color-fg-muted)",
                opacity: "0.18"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1376,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "7",
                y: "3",
                width: "2",
                height: "8",
                fill: "var(--color-fg-muted)",
                opacity: "0.18"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1377,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "4",
                width: "4",
                height: "1",
                opacity: "0.55"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1379,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "6",
                width: "4",
                height: "1",
                opacity: "0.55"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1380,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "8",
                width: "3",
                height: "1",
                opacity: "0.55"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/avatar/page.tsx",
                lineNumber: 1381,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/avatar/page.tsx",
        lineNumber: 1357,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_c758f3a5._.js.map