import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, { withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORIES, COUNTER_UNITS } from "@wahaha/shared";
import { DatePicker } from "@/components/date-picker";
import { GoalStepper } from "@/components/goal-stepper";
import {
  InlineChipDropdown,
  InlineDropdownBody,
  inlineChipDropdownStyles,
} from "@/components/inline-chip-dropdown";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { styles } from "@/components/new-task/styles";
import { PRIORITY_LABEL, REPEAT_OPTIONS, dateChipLabel } from "@/lib/new-task-helpers";
import { useNewTaskForm } from "@/hooks/use-new-task-form";

// TickTick-style quick-add bar that rides above the soft keyboard.
export default function NewTaskScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recurring?: string }>();
  const initialRecurring = params.recurring === "1" || params.recurring === "true";

  const f = useNewTaskForm(initialRecurring);

  const priorityColor =
    f.priority === "low" ? c.success : f.priority === "high" ? c.danger : c.warning;
  const priorityBg =
    f.priority === "low" ? c.successBg : f.priority === "high" ? c.dangerBg : c.warningBg;

  const canSubmit = f.title.trim().length > 0 && !f.submitting;

  return (
    <View style={styles.root}>
      {/* Dim backdrop — hides Android adjustResize movement; tap dismisses. */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { backgroundColor: "#000" }, f.dimStyle]}
      >
        <Pressable style={{ flex: 1 }} onPress={f.handleBackdropPress} />
      </Animated.View>

      {/* Bar — absolute bottom, translateY by keyboard height. */}
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: c.panel,
            borderTopColor: c.border,
            paddingBottom: 10 + insets.bottom,
          },
          f.barStyle,
        ]}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h && h !== f.barHeight) f.setBarHeight(h);
        }}
      >
        <View style={styles.titleRow}>
          <TextInput
            ref={f.titleRef}
            value={f.title}
            onChangeText={f.setTitle}
            placeholder="New task"
            placeholderTextColor={c.fgSubtle}
            onSubmitEditing={f.handleSubmit}
            // Focus collapses open dropdown; keyboard stays up.
            onFocus={() => f.setOpenChip(null)}
            returnKeyType="done"
            blurOnSubmit={false}
            style={[styles.titleInput, { color: c.fg }]}
          />
          <Pressable
            onPress={() => { f.setOpenChip(null); f.handleSubmit(); }}
            disabled={!canSubmit}
            style={[
              styles.submitBtn,
              {
                backgroundColor: canSubmit ? c.activeHighlight : c.input,
                opacity: f.submitting ? 0.5 : 1,
              },
            ]}
          >
            <ThemedText
              style={{
                color: canSubmit ? c.bg : c.fgSubtle,
                fontSize: 16,
                fontWeight: "700",
                lineHeight: 18,
              }}
            >
              ↑
            </ThemedText>
          </Pressable>
        </View>

        {/* Notes/description — small, borderless, auto-grow ~4 lines. */}
        <TextInput
          value={f.description}
          onChangeText={f.setDescription}
          placeholder="Notes (optional)"
          placeholderTextColor={c.fgSubtle}
          multiline
          onFocus={() => f.setOpenChip(null)}
          style={[styles.descInput, { color: c.fgMuted }]}
        />

        <View
          style={styles.chipRow}
          onLayout={(e) => {
            const y = e.nativeEvent.layout.y;
            if (y !== f.chipRowY) f.setChipRowY(y);
          }}
        >
          {/* Priority — tap cycles low → med → high. */}
          <Pressable
            onPress={f.cyclePriority}
            style={[
              styles.chip,
              { borderColor: priorityColor, backgroundColor: priorityBg },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: priorityColor }]} />
            <ThemedText style={[styles.chipText, { color: priorityColor }]}>
              {PRIORITY_LABEL[f.priority]}
            </ThemedText>
          </Pressable>

          {/* Due date — bar fades while DatePicker open for smooth handoff. */}
          <DatePicker
            value={f.dueDate}
            compact
            triggerLabel={dateChipLabel(f.dueDate)}
            onChange={f.setDueDate}
            onOpenChange={(open) => {
              // Fast fade-out, slow fade-in for keyboard rise.
              f.barOpacity.value = withTiming(open ? 0 : 1, { duration: open ? 140 : 220 });
              if (!open) {
                // Bring the keyboard back after the picker closes. Safe because the
                // DatePicker renders via Portal (no <Modal>), so no first-responder
                // restoration races this focus call.
                setTimeout(() => f.titleRef.current?.focus(), 120);
              }
            }}
          />

          {/* Category. */}
          <InlineChipDropdown
            value={f.category}
            options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            open={f.openChip === "category"}
            onOpenChange={(open) => f.setOpenChip(open ? "category" : null)}
            onChange={f.setCategory}
            detachedDropdown
            onChipLayout={(r) => f.updateChipRect("category", r)}
          />

          {/* Repeat. */}
          <InlineChipDropdown
            value={f.repeatValue}
            options={REPEAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            open={f.openChip === "repeat"}
            onOpenChange={(open) => f.setOpenChip(open ? "repeat" : null)}
            onChange={f.setRepeatValue}
            detachedDropdown
            onChipLayout={(r) => f.updateChipRect("repeat", r)}
          />

          {/* Points — inline so it stays above keyboard. */}
          <InlineChipDropdown
            value={String(f.pointValue)}
            options={f.pointOptions.map((v) => ({ value: String(v), label: `${v} pt${v === 1 ? "" : "s"}` }))}
            open={f.openChip === "points"}
            onOpenChange={(open) => f.setOpenChip(open ? "points" : null)}
            onChange={(v) => f.setPointValue(Number(v))}
            detachedDropdown
            onChipLayout={(r) => f.updateChipRect("points", r)}
          />

          {/* Counter — recurring-only; pill toggles counter section. */}
          {f.isRecurring ? (
            <Pressable
              onPress={() => { f.setOpenChip(null); f.setHasCounter((v) => !v); }}
              style={[
                styles.chip,
                {
                  borderColor: f.hasCounter ? c.activeHighlightBorder : c.borderSoft,
                  backgroundColor: f.hasCounter ? c.activeHighlightBg : "transparent",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  { color: f.hasCounter ? c.activeHighlight : c.inputFg },
                ]}
              >
                {f.hasCounter ? "Counter" : "+ Counter"}
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {/* Counter sub-row — unit dropdown + goal stepper + cap-at-goal pill. */}
        {f.isRecurring && f.hasCounter ? (
          <View
            style={styles.counterRow}
            onLayout={(e) => {
              const y = e.nativeEvent.layout.y;
              if (y !== f.counterRowY) f.setCounterRowY(y);
            }}
          >
            <InlineChipDropdown
              value={f.counterUnit}
              triggerLabel={f.counterUnit || "no unit"}
              options={[
                { value: "", label: "no unit" },
                ...COUNTER_UNITS.map((u) => ({ value: u, label: u })),
              ]}
              open={f.openChip === "unit"}
              onOpenChange={(open) => f.setOpenChip(open ? "unit" : null)}
              onChange={f.setCounterUnit}
              detachedDropdown
              onChipLayout={(r) => f.updateChipRect("unit", r)}
            />
            <ThemedText
              style={{
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: c.fgSubtle,
              }}
            >
              Goal
            </ThemedText>
            <GoalStepper value={f.counterGoal} onChange={f.setCounterGoal} />
            {f.counterUnit && f.counterGoal.trim() !== "" && Number(f.counterGoal) > 0 ? (
              <ThemedText style={{ fontSize: 10, color: c.fgSubtle }}>
                {f.counterUnit} /{" "}
                {f.repeatValue === "weekly"
                  ? "wk"
                  : f.repeatValue === "monthly"
                    ? "mo"
                    : "day"}
              </ThemedText>
            ) : null}
            {f.counterGoal.trim() !== "" && Number(f.counterGoal) > 0 ? (
              <Pressable
                onPress={() => f.setCapLogAtGoal((v) => !v)}
                style={[
                  styles.chip,
                  {
                    borderColor: f.capLogAtGoal ? c.activeHighlightBorder : c.borderSoft,
                    backgroundColor: f.capLogAtGoal ? c.activeHighlightBg : "transparent",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.chipText,
                    { color: f.capLogAtGoal ? c.activeHighlight : c.fgSubtle },
                  ]}
                >
                  Cap at goal
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {f.error ? (
          <ThemedText style={{ color: c.danger, fontSize: 11, marginTop: 6 }}>
            {f.error}
          </ThemedText>
        ) : null}
      </Animated.View>

      {/* Detached chip-dropdown overlay — sibling of bar, tracks via barStyle. */}
      {f.openChip && f.chipRects[f.openChip] ? (() => {
        const rect = f.chipRects[f.openChip!];
        // Unit chip lives in counter row; everything else in main chip row.
        const rowY = f.openChip === "unit" ? f.counterRowY : f.chipRowY;
        const chipTopInBar = rowY + rect.y;
        return (
        <Animated.View
          style={[
            inlineChipDropdownStyles.detachedDropdown,
            {
              backgroundColor: c.input,
              borderColor: c.border,
              bottom: Math.max(0, f.barHeight - chipTopInBar + 6),
              left: 14 + rect.x,
              maxWidth: 240,
            },
            f.barStyle,
          ]}
        >
          {f.openChip === "category" ? (
            <InlineDropdownBody
              options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              value={f.category}
              onChange={(v) => { f.setCategory(v); f.setOpenChip(null); }}
            />
          ) : f.openChip === "repeat" ? (
            <InlineDropdownBody
              options={REPEAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              value={f.repeatValue}
              onChange={(v) => { f.setRepeatValue(v); f.setOpenChip(null); }}
            />
          ) : f.openChip === "points" ? (
            <InlineDropdownBody
              options={f.pointOptions.map((v) => ({ value: String(v), label: `${v} pt${v === 1 ? "" : "s"}` }))}
              value={String(f.pointValue)}
              onChange={(v) => { f.setPointValue(Number(v)); f.setOpenChip(null); }}
            />
          ) : f.openChip === "unit" ? (
            <InlineDropdownBody
              options={[{ value: "", label: "no unit" }, ...COUNTER_UNITS.map((u) => ({ value: u, label: u }))]}
              value={f.counterUnit}
              onChange={(v) => { f.setCounterUnit(v); f.setOpenChip(null); }}
            />
          ) : null}
        </Animated.View>
        );
      })() : null}
    </View>
  );
}
