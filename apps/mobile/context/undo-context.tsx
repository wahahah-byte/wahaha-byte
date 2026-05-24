import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface UndoSpec {
  /** Leading label like "Deleted". */
  prefix: string;
  /** Right-hand subject (typically the task title). */
  subject: string;
  /** User tapped Undo — restore work; the deferred commit is cancelled. */
  onUndo: () => void;
  /** Timer expired or user dismissed — perform the actual destructive action (e.g. server delete). */
  onCommit: () => void | Promise<void>;
  durationMs?: number;
}

interface ActiveUndo extends UndoSpec {
  id: number;
  startedAt: number;
  durationMs: number;
}

interface UndoContextValue {
  arm: (spec: UndoSpec) => void;
  /** Cancels the current undo without committing (used internally). */
  clear: () => void;
}

const UndoContext = createContext<UndoContextValue | null>(null);

const DEFAULT_DURATION = 5000;

export function UndoProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveUndo | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seqRef = useRef(0);
  // Captured outside the state so a stale closure doesn't fire the wrong commit.
  const activeRef = useRef<ActiveUndo | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const commitActive = useCallback(() => {
    clearTimer();
    const a = activeRef.current;
    activeRef.current = null;
    setActive(null);
    if (a) { try { void a.onCommit(); } catch { /* swallow — caller handles surfacing */ } }
  }, [clearTimer]);

  const undoActive = useCallback(() => {
    clearTimer();
    const a = activeRef.current;
    activeRef.current = null;
    setActive(null);
    if (a) { try { a.onUndo(); } catch { /* noop */ } }
  }, [clearTimer]);

  const arm = useCallback((spec: UndoSpec) => {
    // Commit any prior undo immediately — only one pending at a time.
    if (activeRef.current) commitActive();
    const duration = spec.durationMs ?? DEFAULT_DURATION;
    const id = ++seqRef.current;
    const next: ActiveUndo = { ...spec, id, startedAt: Date.now(), durationMs: duration };
    activeRef.current = next;
    setActive(next);
    timerRef.current = setTimeout(() => {
      // Fire commit only if this is still the current undo.
      if (activeRef.current?.id === id) commitActive();
    }, duration);
  }, [commitActive]);

  const clear = useCallback(() => {
    clearTimer();
    activeRef.current = null;
    setActive(null);
  }, [clearTimer]);

  // Commit any pending undo on unmount so deletes don't get silently dropped.
  useEffect(() => () => {
    if (activeRef.current) { try { void activeRef.current.onCommit(); } catch { /* noop */ } }
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <UndoContext.Provider value={{ arm, clear }}>
      {children}
      <UndoToastHost active={active} onUndo={undoActive} onDismiss={commitActive} />
    </UndoContext.Provider>
  );
}

export function useUndo(): UndoContextValue {
  const ctx = useContext(UndoContext);
  if (!ctx) throw new Error("useUndo must be used inside <UndoProvider>");
  return ctx;
}

interface HostProps {
  active: ActiveUndo | null;
  onUndo: () => void;
  onDismiss: () => void;
}

function UndoToastHost({ active, onUndo, onDismiss }: HostProps) {
  const c = useColors();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 140, useNativeDriver: true }),
      ]).start();
      return;
    }
    opacity.setValue(0);
    translateY.setValue(20);
    progress.setValue(1);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 0, duration: active.durationMs, useNativeDriver: false }),
    ]).start();
  }, [active, opacity, translateY, progress]);

  if (!active) return null;

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0, right: 0,
        bottom: 24,
        alignItems: "center",
        zIndex: 1000,
        elevation: 1000,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          minWidth: 260,
          maxWidth: "92%",
          paddingVertical: 10,
          paddingHorizontal: 12,
          backgroundColor: c.surface2,
          borderColor: c.border,
          borderWidth: 1,
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          // Android stacking — kept low so it doesn't outrank modals' own elevation.
          elevation: 8,
          overflow: "hidden",
        }}
      >
        <ThemedText
          numberOfLines={1}
          style={{ flex: 1, fontSize: 12, fontWeight: "600", letterSpacing: 0.3, color: c.fg }}
        >
          {active.prefix}: {active.subject}
        </ThemedText>
        <Pressable
          onPress={onUndo}
          style={({ pressed }) => ({
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: c.activeHighlight,
            opacity: pressed ? 0.7 : 1,
          })}
          accessibilityLabel="Undo"
        >
          <ThemedText style={{ fontSize: 10, fontWeight: "700", letterSpacing: 1.5, color: c.activeHighlight }}>
            UNDO
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={onDismiss}
          accessibilityLabel="Dismiss"
          style={({ pressed }) => ({ paddingVertical: 4, paddingHorizontal: 6, opacity: pressed ? 0.7 : 1 })}
        >
          <ThemedText style={{ fontSize: 16, color: c.fgSubtle, lineHeight: 16 }}>×</ThemedText>
        </Pressable>
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 2,
            width: progressWidth,
            backgroundColor: c.activeHighlight,
          }}
        />
      </View>
    </Animated.View>
  );
}
