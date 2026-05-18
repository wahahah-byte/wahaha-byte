import { useEffect, useRef } from "react";
import { Image } from "expo-image";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { UserInventoryDto } from "@wahaha/shared";

const SLOT_Z: Record<string, number> = {
  WEAPON_BACK: 0,
  CAPE: 10,
  HAIR_BACK: 20,
  BOTTOM: 40,
  TOP: 50,
  OVERALL: 50,
  CAPE_FRONT: 55,
  GLOVES: 60,
  SHOES: 70,
  HAIR_FRONT: 80,
  EYE: 100,
  EAR: 110,
  HAT: 120,
  WEAPON_FRONT: 130,
  WRIST: 140,
  BACK: 10,
  BODY: 50,
  FEET: 70,
  HAIR: 80,
  FACE: 90,
  HAND: 130,
  HEAD: 120,
};

const SOURCE_W = 256;
const SOURCE_H = 384;
const OVERHANG_SRC = 128;
const CONTAINER_SOURCE_W = SOURCE_W + OVERHANG_SRC * 2;
const ASPECT = CONTAINER_SOURCE_W / SOURCE_H;

const SLOT_OFFSET_X: Record<string, number> = {
  HAIR: 5,
  HAIR_FRONT: 5,
  HAIR_BACK: 5,
};

const BASE_PNG = require("../assets/avatars/base.png");

interface Props {
  equipped: UserInventoryDto[];
  height?: number;
  pose?: "idle" | "still";
}

export function ChibiAvatar({ equipped, height = 192, pose = "idle" }: Props) {
  const width = Math.round(height * ASPECT);
  const baseScale = height / SOURCE_H;
  const baseW = Math.round(SOURCE_W * baseScale);
  const baseLeft = Math.round(OVERHANG_SRC * baseScale);

  // Idle pose: subtle up/down breathing animation. Web uses a CSS keyframe;
  // RN uses Reanimated. Two-step yoyo with easeInOut to feel calm.
  const bob = useSharedValue(0);
  const lastPose = useRef(pose);
  useEffect(() => {
    if (pose === "idle") {
      bob.value = withRepeat(
        withSequence(
          withTiming(-1.4, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    } else if (lastPose.current !== pose) {
      bob.value = withTiming(0, { duration: 220 });
    }
    lastPose.current = pose;
  }, [pose, bob]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  // Apply the same hide rules as web.
  const hideHairFront = equipped.some((inv) => {
    const i = inv.avatarItem;
    return i?.coversHairFront === true || i?.coversHair === true;
  });
  const hideHairBack = equipped.some((inv) => {
    const i = inv.avatarItem;
    return i?.coversHairBack === true || i?.coversHair === true;
  });
  const hasOverall = equipped.some((inv) => inv.avatarItem?.slot === "OVERALL");

  type Layer = {
    key: string;
    inv: UserInventoryDto;
    src: string;
    z: number;
  };
  const layered: Layer[] = [];
  for (const inv of equipped) {
    const item = inv.avatarItem;
    if (!item?.previewAssetUrl) continue;
    if (hasOverall && (item.slot === "TOP" || item.slot === "BOTTOM")) continue;
    const isPrimaryHairFront = item.slot === "HAIR_FRONT";
    const isPrimaryHairBack = item.slot === "HAIR_BACK";
    const isLegacyHair =
      item.slot === "HAIR" || (item.slot !== "HAIR_FRONT" && item.slot !== "HAIR_BACK" && item.category === "hair");

    const primarySuppressed =
      (hideHairFront && isPrimaryHairFront) ||
      (hideHairBack && isPrimaryHairBack) ||
      ((hideHairFront || hideHairBack) && isLegacyHair);

    if (!primarySuppressed) {
      layered.push({
        key: `${inv.inventoryId}:primary`,
        inv,
        src: item.previewAssetUrl,
        z: SLOT_Z[item.slot] ?? 100,
      });
    }

    if (item.secondaryAssetUrl) {
      let secondaryZ: number;
      let respectHairCover: boolean;
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
          z: secondaryZ,
        });
      }
    }
  }
  layered.sort((a, b) => a.z - b.z);

  return (
    <Animated.View
      style={[{ width, height, pointerEvents: "none" }, containerStyle]}
    >
      {/* Base sprite as a direct sibling of the layered items, so all
          zIndices share one stacking context. Previously the base lived
          inside a non-scrolling ScrollView, which created its own stacking
          context — that hid the base's `zIndex: 30` from the layered items
          (HAIR_BACK at z=20, CAPE at z=10, etc.), so back-of-character
          layers ended up rendering OVER the base's face instead of behind
          the body. Symptom: equipped hair covered the face on mobile while
          the same item worked on web. */}
      <Image
        source={BASE_PNG}
        style={{
          position: "absolute",
          left: baseLeft,
          top: 0,
          width: baseW,
          height,
          zIndex: 30,
        }}
        // expo-image: `contentFit="fill"` is the resizeMode="stretch" equivalent.
        // The disk cache keeps the sprite sheets in memory across modal opens
        // so the chibi composes on the same frame the modal mounts.
        contentFit="fill"
        cachePolicy="memory-disk"
      />
      {layered.map((layer) => {
        const item = layer.inv.avatarItem!;
        const itemSrcW = item.sourceWidth ?? SOURCE_W;
        const itemSrcH = item.sourceHeight ?? SOURCE_H;
        const scale = height / SOURCE_H;
        const itemW = Math.round(itemSrcW * scale);
        const itemH = Math.round(itemSrcH * scale);
        const offsetX = item.offsetX ?? SLOT_OFFSET_X[item.slot] ?? 0;
        const offsetY = item.offsetY ?? 0;
        const dx = offsetX * scale;
        const dy = offsetY * scale;
        const renderScale = item.renderScale ?? 1;
        return (
          <Image
            key={layer.key}
            source={{ uri: layer.src }}
            style={[
              {
                position: "absolute",
                left: baseLeft,
                top: 0,
                width: itemW,
                height: itemH,
                zIndex: layer.z,
              },
              dx !== 0 || dy !== 0 || renderScale !== 1
                ? {
                  transform: [
                    { translateX: dx },
                    { translateY: dy },
                    { scale: renderScale },
                  ],
                }
                : null,
            ]}
            contentFit="fill"
            // memory-disk cache means previously-rendered preview URLs (the
            // equipped sprite set is small and changes rarely) are read from
            // local disk on subsequent modal opens — no network round-trip
            // and no decode flicker.
            cachePolicy="memory-disk"
            // Stable recycling key so expo-image reuses the same texture
            // when the same item appears at the same z-slot across renders.
            recyclingKey={layer.key}
          />
        );
      })}
    </Animated.View>
  );
}

// Hint to consumers about the container's aspect ratio so they can reserve
// width for a given height without re-deriving CONTAINER_SOURCE_W.
export const CHIBI_ASPECT = ASPECT;
