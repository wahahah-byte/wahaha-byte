import { useEffect, useRef } from "react";
import { Keyboard, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  value: string;
  onChange: (next: string) => void;
  // Returns true on success so the bar can flash an "Added" toast.
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  disabled: boolean;
  // Fitness-only: surface sets/reps inputs alongside the title.
  showSetsReps?: boolean;
  setsValue?: string;
  onSetsChange?: (next: string) => void;
  repsValue?: string;
  onRepsChange?: (next: string) => void;
}

// Floating add-subtask bar pinned to the route bottom, lifted by a Keyboard listener
// so the input rides above the on-screen keyboard. Wires an "Added" toast above the bar
// (column sibling, not absolute, to avoid Android elevation clipping).
export function SubtaskAddBar({ value, onChange, onSubmit, onCancel, disabled, showSetsReps, setsValue, onSetsChange, repsValue, onRepsChange }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const kbHeight = useSharedValue(0);
  // "Added" toast — fade in, rise, hold, fade back.
  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(8);
  const toastHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guard against stray keyboardDidHide before our input ever raised one.
  const hasShownRef = useRef(false);
  // Captured onCancel so listener doesn't re-subscribe.
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    // iOS Will*, Android Did*.
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvt, (e) => {
      hasShownRef.current = true;
      kbHeight.value = withTiming(e.endCoordinates.height, { duration: 200 });
    });
    const hide = Keyboard.addListener(hideEvt, () => {
      kbHeight.value = withTiming(0, { duration: 200 });
      // Dismiss bar when keyboard retracts (guarded by hasShownRef).
      if (hasShownRef.current) onCancelRef.current?.();
    });
    return () => {
      show.remove();
      hide.remove();
      if (toastHideTimer.current) clearTimeout(toastHideTimer.current);
    };
  }, [kbHeight]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -kbHeight.value }],
  }));
  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  // Submit wrapper — flashes "Added" pill; no manual .focus() (blurOnSubmit=false).
  async function handleSubmit() {
    const ok = await onSubmit();
    if (!ok) return;
    if (toastHideTimer.current) clearTimeout(toastHideTimer.current);
    toastOpacity.value = withTiming(1, { duration: 140 });
    toastTranslateY.value = withTiming(0, { duration: 140 });
    toastHideTimer.current = setTimeout(() => {
      toastOpacity.value = withTiming(0, { duration: 220 });
      toastTranslateY.value = withTiming(8, { duration: 220 });
    }, 900);
  }

  // Single Pressable across both states (swapping causes iOS focus-out).
  const hasText = value.trim().length > 0;
  const onButtonPress = hasText ? handleSubmit : onCancel;

  return (
    <Animated.View style={[styles.wrapper, barStyle]}>
      {/* "Added" pill — column sibling above bar to avoid Android elevation clip. */}
      <Animated.View pointerEvents="none" style={[styles.toast, toastStyle]}>
        <View style={[styles.toastPill, { backgroundColor: c.success, borderColor: c.success }]}>
          <ThemedText
            style={{
              color: c.bg,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            Added
          </ThemedText>
        </View>
      </Animated.View>

      <View
        style={[
          styles.bar,
          {
            backgroundColor: c.panel,
            borderTopColor: c.border,
            paddingBottom: 10 + insets.bottom,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={showSetsReps ? "Add an exercise…" : "Add a subtask…"}
          placeholderTextColor={c.fgSubtle}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          // No `editable={!disabled}` — iOS treats it as focus loss.
          autoFocus
          blurOnSubmit={false}
          textAlignVertical="center"
          style={[styles.input, { color: c.inputFg }]}
        />
        {showSetsReps ? (
          <View style={styles.setsRepsGroup}>
            <TextInput
              value={setsValue ?? ""}
              onChangeText={onSetsChange}
              placeholder="sets"
              placeholderTextColor={c.fgSubtle}
              keyboardType="number-pad"
              returnKeyType="next"
              maxLength={3}
              blurOnSubmit={false}
              style={[styles.numInput, { color: c.inputFg, borderColor: c.border, backgroundColor: c.input }]}
            />
            <ThemedText style={{ color: c.fgSubtle, fontSize: 11, fontWeight: "700" }}>×</ThemedText>
            <TextInput
              value={repsValue ?? ""}
              onChangeText={onRepsChange}
              placeholder="reps"
              placeholderTextColor={c.fgSubtle}
              keyboardType="number-pad"
              returnKeyType="done"
              maxLength={3}
              blurOnSubmit={false}
              onSubmitEditing={handleSubmit}
              style={[styles.numInput, { color: c.inputFg, borderColor: c.border, backgroundColor: c.input }]}
            />
          </View>
        ) : null}
        <Pressable
          onPress={onButtonPress}
          disabled={disabled && hasText}
          hitSlop={8}
          style={[
            styles.btn,
            { backgroundColor: hasText ? c.activeHighlight : c.input },
          ]}
        >
          <ThemedText
            style={{
              color: hasText ? c.bg : c.fgSubtle,
              fontSize: hasText ? 16 : 14,
              fontWeight: hasText ? "700" : "400",
              lineHeight: hasText ? 18 : 16,
            }}
          >
            {hasText ? "↑" : "✕"}
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Wrapper anchors bar+toast at route bottom; translateY lift applied here.
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "stretch",
    zIndex: 100,
    elevation: 18,
  },
  // Floating bar — wrapper child, no own absolute positioning.
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    boxShadow: "0px -8px 24px rgba(0, 0, 0, 0.35)",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    includeFontPadding: false,
  },
  setsRepsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  numInput: {
    width: 64,
    height: 30,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontSize: 13,
    textAlign: "center",
    includeFontPadding: false,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // "Added" toast — column sibling above bar, centered horizontally.
  toast: {
    alignItems: "center",
    marginBottom: 8,
  },
  toastPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
});
