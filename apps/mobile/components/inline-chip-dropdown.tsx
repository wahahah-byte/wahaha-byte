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
  /** Whether the dropdown overlay is rendered. Parent owns this state so it
   *  can coordinate which chip's dropdown is open at any time. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional override for the chip label (e.g. "Today" instead of "today"). */
  triggerLabel?: string;
  /** Called when the chip's layout (within the chip row) is measured. Lets
   *  parents that lift the dropdown out of the bar position it precisely
   *  above the chip — `y` is the chip's top within its parent flex row,
   *  which matters once the row wraps (chips on lower rows have larger y).
   *  See new-task.tsx for the consumer. */
  onChipLayout?: (rect: { x: number; y: number; width: number; height: number }) => void;
  /** When set, the inline dropdown is NOT rendered by this component. The
   *  parent is responsible for rendering it at root level (Portal-style).
   *  Why: on Android, a child rendered with `position: absolute` that
   *  extends past its parent's bounds doesn't receive touches in the
   *  outside-parent area, even though it's visually painted there. Nesting
   *  the dropdown inside the bar made the upper rows of the option list
   *  un-scrollable (the swipe-up gesture passed into territory outside the
   *  bar's hit area and was dropped). Lifting it out of the bar gives the
   *  dropdown its own hit-test bounds. */
  detachedDropdown?: boolean;
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

// The actual option list — shared between the inline-rendered version and
// the portal-rendered version exposed below. Extracted so both surfaces
// stay visually identical.
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
      // keyboardShouldPersistTaps='always' so taps on options don't first
      // dismiss the keyboard and only then trigger selection.
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
    // Must be higher than the new-task bar's elevation (18). On Android,
    // touch hit-testing prefers the View with the higher elevation, even
    // when the lower-elevation View is rendered later in the tree. With
    // dropdown < bar elevation, the bar intercepted any touch that landed
    // in the bar's screen area (which the dropdown extends over), so
    // dropdown scroll only worked above the bar's top edge. zIndex
    // mirrors the same intent on iOS / web.
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
