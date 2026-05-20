import { Pressable, ScrollView, StyleSheet, View, type LayoutChangeEvent } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

export interface InlineChipOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: InlineChipOption[];
  onChange: (next: string) => void;
  // Parent-owned open state for cross-chip coordination.
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Optional chip-label override.
  triggerLabel?: string;
  // Layout callback for parents that lift dropdown out of the bar.
  onChipLayout?: (rect: { x: number; y: number; width: number; height: number }) => void;
  // When set, parent renders dropdown at root (Android hit-test workaround).
  detachedDropdown?: boolean;
}

// Pill chip + inline upward-opening dropdown — avoids <Modal> so keyboard stays.
export function InlineChipDropdown({
  value,
  options,
  onChange,
  open,
  onOpenChange,
  triggerLabel,
  onChipLayout,
  detachedDropdown,
}: Props) {
  const c = useColors();
  const current = options.find((o) => o.value === value);
  const label = triggerLabel ?? current?.label ?? "";

  function handleChipLayout(e: LayoutChangeEvent) {
    if (!onChipLayout) return;
    const { x, y, width, height } = e.nativeEvent.layout;
    onChipLayout({ x, y, width, height });
  }

  return (
    <View style={{ position: "relative" }} onLayout={handleChipLayout}>
      <Pressable
        onPress={() => onOpenChange(!open)}
        style={[
          styles.chip,
          {
            borderColor: open ? c.activeHighlight : c.borderSoft,
            backgroundColor: open ? c.activeHighlightBg : "transparent",
          },
        ]}
      >
        <ThemedText
          numberOfLines={1}
          style={{
            fontSize: 11,
            fontWeight: "500",
            letterSpacing: 0.2,
            color: c.inputFg,
          }}
        >
          {label}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 9,
            color: c.inputFg,
            marginLeft: 5,
          }}
        >
          ▾
        </ThemedText>
      </Pressable>

      {open && !detachedDropdown ? (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: c.input,
              borderColor: c.border,
            },
          ]}
        >
          <InlineDropdownBody
            options={options}
            value={value}
            onChange={(v) => {
              onChange(v);
              onOpenChange(false);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

// Option list shared between inline and portal renderers.
export function InlineDropdownBody({
  options,
  value,
  onChange,
}: {
  options: InlineChipOption[];
  value: string;
  onChange: (next: string) => void;
}) {
  const c = useColors();
  return (
    <ScrollView
      // persistTaps=always so option taps don't dismiss keyboard first.
      style={{ maxHeight: 220 }}
      keyboardShouldPersistTaps="always"
      nestedScrollEnabled
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.option,
              active ? { backgroundColor: c.activeHighlightBg } : null,
              pressed && !active ? { backgroundColor: c.overlayHover } : null,
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
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const inlineChipDropdownStyles = StyleSheet.create({
  detachedDropdown: {
    position: "absolute",
    minWidth: 140,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.35)",
    // Higher elevation than bar (18) so Android hit-test prefers dropdown.
    elevation: 32,
    zIndex: 32,
  },
});

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  dropdown: {
    position: "absolute",
    // Opens upward — bar lives at bottom, so above is empty backdrop.
    bottom: "100%",
    left: 0,
    marginBottom: 6,
    minWidth: 140,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.35)",
    elevation: 12,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
