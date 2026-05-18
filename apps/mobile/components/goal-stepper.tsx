import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  value: string;
  onChange: (next: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Mobile equivalent of web's GoalStepper — inline [-] [input] [+] row.
 * Same logic as web/src/components/GoalStepper.tsx.
 */
export function GoalStepper({ value, onChange, min = 0, max = 99999, step = 1 }: Props) {
  const c = useColors();
  const numeric = value.trim() === "" ? null : Number(value);
  const valid = numeric !== null && Number.isFinite(numeric);

  function nudge(delta: number) {
    const base = valid ? (numeric as number) : 0;
    const next = Math.max(min, Math.min(max, base + delta));
    onChange(String(next));
  }

  const atMin = valid && (numeric as number) <= min;
  const atMax = valid && (numeric as number) >= max;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => nudge(-step)}
        disabled={atMin}
        style={[
          styles.btn,
          styles.btnLeft,
          {
            backgroundColor: c.input,
            borderColor: c.borderHairline,
            opacity: atMin ? 0.4 : 1,
          },
        ]}
      >
        <ThemedText style={{ fontSize: 14, color: c.inputFg }}>−</ThemedText>
      </Pressable>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        placeholder="—"
        placeholderTextColor={c.fgSubtle}
        // Android <EditText> reserves vertical space for font ascenders/
        // descenders and at this 30 px height it clips the digit glyphs.
        // textAlignVertical (a prop, not a style) + includeFontPadding:false
        // in the style restore the full glyph height.
        textAlignVertical="center"
        style={[
          styles.input,
          {
            color: c.inputFg,
            backgroundColor: c.input,
            borderColor: c.borderHairline,
            includeFontPadding: false,
          },
        ]}
      />
      <Pressable
        onPress={() => nudge(step)}
        disabled={atMax}
        style={[
          styles.btn,
          styles.btnRight,
          {
            backgroundColor: c.input,
            borderColor: c.borderHairline,
            opacity: atMax ? 0.4 : 1,
          },
        ]}
      >
        <ThemedText style={{ fontSize: 14, color: c.inputFg }}>+</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "stretch" },
  btn: {
    width: 28,
    height: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLeft: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  btnRight: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  input: {
    width: 56,
    height: 30,
    paddingHorizontal: 6,
    // Drop the default vertical padding RN adds on Android — combined with
    // includeFontPadding:false above, the digits sit centered in the 30 px
    // input instead of being clipped.
    paddingVertical: 0,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});
