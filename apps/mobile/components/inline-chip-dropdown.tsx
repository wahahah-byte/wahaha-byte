import { Pressable, ScrollView, StyleSheet, View } from "react-native";

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
  /** Whether the dropdown overlay is rendered. Parent owns this state so it
   *  can coordinate which chip's dropdown is open at any time. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional override for the chip label (e.g. "Today" instead of "today"). */
  triggerLabel?: string;
}

// Pill chip + inline dropdown overlay. Unlike CompactSelect/DatePicker the
// dropdown is NOT a React Native <Modal> — it's an absolutely-positioned
// View that opens upward from the trigger. Avoiding <Modal> is the entire
// point: <Modal> blurs whatever TextInput currently has focus, dismissing
// the keyboard. The inline overlay leaves focus alone, so the new-task
// bar's keyboard stays up while the user fiddles with chips.
//
// "Tap outside to close" is handled by the caller via openChip state: tap
// on another chip switches the open one; tap on the dim backdrop closes it.
export function InlineChipDropdown({
  value,
  options,
  onChange,
  open,
  onOpenChange,
  triggerLabel,
}: Props) {
  const c = useColors();
  const current = options.find((o) => o.value === value);
  const label = triggerLabel ?? current?.label ?? "";

  return (
    <View style={{ position: "relative" }}>
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

      {open ? (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: c.input,
              borderColor: c.border,
            },
          ]}
        >
          {/* keyboardShouldPersistTaps='always' so taps on options don't
              first dismiss the keyboard and only then trigger selection. */}
          <ScrollView
            style={{ maxHeight: 220 }}
            keyboardShouldPersistTaps="always"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    onOpenChange(false);
                  }}
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
        </View>
      ) : null}
    </View>
  );
}

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
    // Opens upward — the new-task bar lives at the bottom of the screen,
    // so the area above the chip is empty backdrop and a good drop zone.
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
