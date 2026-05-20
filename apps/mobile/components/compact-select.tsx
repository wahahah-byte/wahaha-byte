import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

export interface CompactSelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (next: string) => void;
  options: CompactSelectOption[];
  // Tints trigger text with active-highlight (used for Points).
  highlight?: boolean;
  // Pill-shaped chip styling for new-task quick-add bar.
  compact?: boolean;
  // Override trigger label (e.g. "Date" vs raw value).
  triggerLabel?: string;
}

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PANEL_MAX_HEIGHT = 240;
const SCREEN_PADDING = 12;
// Min panel width so narrow triggers still show readable options.
const PANEL_MIN_WIDTH = 140;

// Mobile CompactSelect — dropdown adjacent to trigger, flips above when needed.
export function CompactSelect({
  value,
  onChange,
  options,
  highlight,
  compact,
  triggerLabel,
}: Props) {
  const c = useColors();
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const { height: screenH, width: screenW } = useWindowDimensions();

  const current = options.find((o) => o.value === value);
  const triggerColor = highlight ? c.activeHighlight : c.inputFg;
  const triggerText = triggerLabel ?? current?.label ?? "";

  function handleOpen() {
    setPanelHeight(0);
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  }

  const spaceBelow = anchor ? screenH - (anchor.y + anchor.height) - SCREEN_PADDING : 0;
  const spaceAbove = anchor ? anchor.y - SCREEN_PADDING : 0;
  // Prefer flipping above; below is usually covered by keyboard/sheet edge.
  const showBelow = spaceAbove < 100 && spaceBelow > spaceAbove;
  const maxHeight = Math.min(
    PANEL_MAX_HEIGHT,
    Math.max(80, showBelow ? spaceBelow : spaceAbove),
  );

  const panelWidth = anchor ? Math.max(anchor.width, PANEL_MIN_WIDTH) : PANEL_MIN_WIDTH;
  const panelLeft = anchor
    ? Math.max(SCREEN_PADDING, Math.min(anchor.x, screenW - panelWidth - SCREEN_PADDING))
    : 0;

  // Position from measured height so panel bottom meets trigger top exactly.
  const panelPosition = anchor
    ? showBelow
      ? { top: anchor.y + anchor.height, left: panelLeft, width: panelWidth }
      : { top: anchor.y - panelHeight, left: panelLeft, width: panelWidth }
    : {};

  return (
    <View ref={triggerRef} collapsable={false}>
      <Pressable
        onPress={handleOpen}
        style={[
          compact ? styles.triggerCompact : styles.trigger,
          {
            backgroundColor: compact ? "transparent" : c.input,
            borderColor: open
              ? c.activeHighlight
              : compact
                ? c.borderSoft
                : c.borderHairline,
          },
        ]}
      >
        <ThemedText
          numberOfLines={1}
          style={{
            fontSize: compact ? 11 : 12,
            color: triggerColor,
            fontWeight: compact ? "500" : "400",
            letterSpacing: compact ? 0.2 : 0,
          }}
        >
          {triggerText}
        </ThemedText>
        <ThemedText style={{ fontSize: 9, color: triggerColor, marginLeft: 5 }}>
          ▾
        </ThemedText>
      </Pressable>

      <Modal
        transparent
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setOpen(false)}
        />
        {anchor ? (
          <View
            onLayout={(e) => setPanelHeight(e.nativeEvent.layout.height)}
            style={[
              styles.panel,
              {
                backgroundColor: c.input,
                borderColor: c.border,
                opacity: !showBelow && panelHeight === 0 ? 0 : 1,
              },
              panelPosition,
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingVertical: 2 }}
              style={{ maxHeight }}
            >
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    style={[
                      styles.option,
                      active ? { backgroundColor: c.activeHighlightBg } : null,
                    ]}
                  >
                    <ThemedText
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: active ? c.activeHighlight : c.inputFg,
                        fontWeight: active ? "600" : "400",
                      }}
                    >
                      {o.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 3,
  },
  // Pill chip for new-task quick-add bar (sized to match priority chip).
  triggerCompact: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  panel: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)",
    elevation: 16,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
