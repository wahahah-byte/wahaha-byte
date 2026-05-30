import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { useColors } from "@/hooks/use-colors";
import { styles } from "@/components/date-picker/styles";

interface Props {
  yearPage: number;
  setYearPage: React.Dispatch<React.SetStateAction<number>>;
  value: Date | null;
  today: Date;
  onSelectYear: (yr: number) => void;
  onClose: () => void;
  c: ReturnType<typeof useColors>;
}

export function YearOverlay({ yearPage, setYearPage, value, today, onSelectYear, onClose, c }: Props) {
  const years = Array.from({ length: 6 }, (_, i) => yearPage + i + 1);
  return (
    <>
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={onClose}
      />
      <View
        style={[
          styles.yearOverlay,
          { backgroundColor: c.input, borderColor: c.border },
        ]}
      >
        <View style={styles.yearHeader}>
          <Pressable
            onPress={() => setYearPage((y) => y - 6)}
            disabled={yearPage <= today.getFullYear() - 6}
            hitSlop={16}
            style={styles.navBtn}
          >
            <ThemedText
              style={[
                styles.navArrow,
                {
                  color: c.fgMuted,
                  opacity: yearPage <= today.getFullYear() - 6 ? 0.3 : 1,
                },
              ]}
            >
              {"<"}
            </ThemedText>
          </Pressable>
          <View style={styles.yearGrid}>
            {years.map((yr) => {
              const selected = value !== null && value.getFullYear() === yr;
              const isCurrent = today.getFullYear() === yr;
              return (
                <Pressable
                  key={yr}
                  onPress={() => onSelectYear(yr)}
                  style={[
                    styles.yearCell,
                    selected ? { borderColor: c.activeHighlight, borderWidth: 1 } : null,
                  ]}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: selected || isCurrent ? c.activeHighlight : c.fgMuted,
                      fontWeight: selected || isCurrent ? "600" : "400",
                    }}
                  >
                    {yr}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            onPress={() => setYearPage((y) => y + 6)}
            hitSlop={16}
            style={styles.navBtn}
          >
            <ThemedText style={[styles.navArrow, { color: c.fgMuted }]}>{">"}</ThemedText>
          </Pressable>
        </View>
        <Pressable
          onPress={() => setYearPage(today.getFullYear() - 1)}
          disabled={yearPage === today.getFullYear() - 1}
          style={{ paddingVertical: 6, alignItems: "center" }}
        >
          <ThemedText
            style={{
              fontSize: 9,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: c.fgSubtle,
              opacity: yearPage === today.getFullYear() - 1 ? 0.3 : 1,
            }}
          >
            Today
          </ThemedText>
        </Pressable>
      </View>
    </>
  );
}
