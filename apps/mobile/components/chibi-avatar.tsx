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

import { bustedAssetUrl } from "@/lib/avatar-asset";

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

  // Idle pose: subtle breathing bob via Reanimated yoyo.
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

  // Match web hide rules.
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
      const primarySrc = bustedAssetUrl(item, item.previewAssetUrl);
      if (primarySrc) {
        layered.push({
          key: `${inv.inventoryId}:primary`,
          inv,
          src: primarySrc,
          z: SLOT_Z[item.slot] ?? 100,
        });
      }
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
        const secondarySrc = bustedAssetUrl(item, item.secondaryAssetUrl);
        if (secondarySrc) {
          layered.push({
            key: `${inv.inventoryId}:secondary`,
            inv,
            src: secondarySrc,
            z: secondaryZ,
          });
        }
      }
    }
  }
  layered.sort((a, b) => a.z - b.z);

  return (
    <Animated.View
      style={[{ width, height, pointerEvents: "none" }, containerStyle]}
    >
      {/* Base sprite sibling of layers so all zIndices share one stacking context. */}
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
        // contentFit=fill ≡ resizeMode=stretch; memory-disk cache for instant compose.
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
            // memory-disk cache — instant reads on subsequent modal opens.
            cachePolicy="memory-disk"
            // Stable key so expo-image reuses textures across renders.
            recyclingKey={layer.key}
          />
        );
      })}
    </Animated.View>
  );
}

// Container aspect ratio so consumers can reserve width for a given height.
export const CHIBI_ASPECT = ASPECT;
