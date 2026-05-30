import { useEffect, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { useSwipeRow } from "@/components/swipe-row-context";
import { styles } from "@/components/task-list/styles";

// Closes any open swipe row on tap.
export function CloseOnTap({ children }: { children: ReactNode }) {
  const ctx = useSwipeRow();
  const close = ctx?.closeAll;
  const tap = Gesture.Tap()
    .maxDistance(8)
    .onEnd(() => {
      if (close) runOnJS(close)();
    });
  return (
    <GestureDetector gesture={tap}>
      <View style={{ flex: 1 }}>{children}</View>
    </GestureDetector>
  );
}

// Transient error pill, auto-dismisses after 7s.
export function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const c = useColors();
  useEffect(() => {
    const t = setTimeout(onDismiss, 7000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 12,
        left: 16,
        right: 16,
        zIndex: 50,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={onDismiss}
        style={{
          backgroundColor: c.dangerBg,
          borderColor: c.danger,
          borderWidth: 1,
          borderRadius: 999,
          paddingVertical: 10,
          paddingHorizontal: 18,
          maxWidth: "100%",
        }}
      >
        <ThemedText style={{ color: c.danger, fontSize: 12, textAlign: "center" }}>
          {message}
        </ThemedText>
      </Pressable>
    </View>
  );
}

export function ActiveSectionToggle({
  count, collapsed, onToggle, c,
}: {
  count: number;
  collapsed: boolean;
  onToggle: () => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.activeToggle,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <ThemedText
        style={{
          fontSize: 11,
          fontWeight: "600",
          color: c.fgMuted,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        Active ({count})
      </ThemedText>
      <ThemedText
        style={{
          color: c.fgMuted,
          fontSize: 11,
          marginLeft: 4,
          transform: [{ rotate: collapsed ? "-90deg" : "0deg" }],
        }}
      >
        ▾
      </ThemedText>
      <View style={[styles.activeToggleRule, { backgroundColor: c.borderSoft }]} />
    </Pressable>
  );
}
