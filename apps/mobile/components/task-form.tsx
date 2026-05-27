import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { CATEGORIES, COUNTER_UNITS, maxPointsFor, type UserInventoryDto } from "@wahaha/shared";

import { ChibiAvatar } from "@/components/chibi-avatar";
import { CompactSelect } from "@/components/compact-select";
import { DatePicker } from "@/components/date-picker";
import { GoalStepper } from "@/components/goal-stepper";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { useAvatarsEnabled } from "@/hooks/use-avatars-enabled";
import { equippedCache } from "@/lib/equipped-cache";

const REPEAT_OPTIONS: { label: string; value: string; rule: string | null }[] = [
  { label: "Once", value: "once", rule: null },
  { label: "Daily", value: "daily", rule: "daily" },
  { label: "Wkdys", value: "weekdays", rule: "weekdays" },
  { label: "Weekly", value: "weekly", rule: "weekly" },
  { label: "Biweek", value: "biweekly", rule: "biweekly" },
  { label: "Monthly", value: "monthly", rule: "monthly" },
];

type PriorityKey = "low" | "medium" | "high";

export interface TaskFormValues {
  title: string;
  description: string;
  category: string;
  priority: string;
  pointValue: number;
  isRecurring: boolean;
  recurrenceRule: string;
  // YYYY-MM-DD local-tz, or null.
  dueDate: string | null;
  // Routine-only counter feature.
  hasCounter: boolean;
  counterUnit: string;
  // String so input can be empty; serialized to number on submit.
  counterGoal: string;
  capLogAtGoal: boolean;
}

export const emptyTaskForm: TaskFormValues = {
  title: "",
  description: "",
  category: CATEGORIES[0],
  priority: "medium",
  pointValue: 25,
  isRecurring: false,
  recurrenceRule: "daily",
  dueDate: null,
  hasCounter: false,
  counterUnit: "",
  counterGoal: "",
  capLogAtGoal: false,
};

function fmtDate(d: Date | null): string | null {
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}


interface Props {
  initial?: TaskFormValues;
  submitLabel?: string;
  onSubmit: (values: TaskFormValues) => Promise<string | null>;
  onCancel?: () => void;
}

export function TaskForm({
  initial = emptyTaskForm,
  submitLabel = "Create",
  onSubmit,
  onCancel,
}: Props) {
  const c = useColors();

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [showDescription, setShowDescription] = useState(!!initial.description);
  const [category, setCategory] = useState(initial.category);
  // Disable soft keyboard on every TextInput while the date picker is
  // open / closing, so RN's auto-restore on Modal unmount can't make any
  // keyboard visible.
  const [keyboardSuppressed, setKeyboardSuppressed] = useState(false);
  const [priority, setPriority] = useState<PriorityKey>(initial.priority.toLowerCase() as PriorityKey);
  const [pointValue, setPointValue] = useState(initial.pointValue);
  const [isRecurring, setIsRecurring] = useState(initial.isRecurring);
  const [recurrenceRule, setRecurrenceRule] = useState(initial.recurrenceRule);
  const [dueDate, setDueDate] = useState<Date | null>(parseDate(initial.dueDate));
  const [hasCounter, setHasCounter] = useState(initial.hasCounter);
  const [counterUnit, setCounterUnit] = useState(initial.counterUnit);
  const [counterGoal, setCounterGoal] = useState(initial.counterGoal);
  const [capLogAtGoal, setCapLogAtGoal] = useState(initial.capLogAtGoal);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Equipped avatar hero at top so fields sit in thumb zone.
  const avatarsEnabled = useAvatarsEnabled();
  const [equipped, setEquipped] = useState<UserInventoryDto[]>(
    () => equippedCache.read() ?? [],
  );
  useEffect(() => {
    if (!avatarsEnabled) return;
    const unsubscribe = equippedCache.subscribe(setEquipped);
    equippedCache.revalidate();
    return unsubscribe;
  }, [avatarsEnabled]);

  // Counter only applies to recurring tasks.
  useEffect(() => {
    if (!isRecurring && hasCounter) setHasCounter(false);
  }, [isRecurring, hasCounter]);

  // Drop to 1pt on recurring; cap non-recurring by category.
  useEffect(() => {
    if (isRecurring) setPointValue((v) => (v > 5 ? 1 : v));
  }, [isRecurring]);

  useEffect(() => {
    if (isRecurring) return;
    const cap = maxPointsFor(category);
    if (pointValue > cap) setPointValue(cap);
  }, [category, isRecurring]);

  const PRIORITIES: { key: PriorityKey; label: string; color: string; bg: string }[] = [
    { key: "low",    label: "Low",    color: c.success, bg: c.successBg },
    { key: "medium", label: "Medium", color: c.warning, bg: c.warningBg },
    { key: "high",   label: "High",   color: c.danger,  bg: c.dangerBg },
  ];

  const pointOptions = isRecurring
    ? [1, 2, 3, 4, 5]
    : [5, 10, 15, 20, 25].filter((v) => v <= maxPointsFor(category));

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const err = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      pointValue,
      isRecurring,
      recurrenceRule,
      dueDate: fmtDate(dueDate),
      hasCounter: isRecurring ? hasCounter : false,
      counterUnit: isRecurring && hasCounter ? counterUnit : "",
      counterGoal: isRecurring && hasCounter ? counterGoal.trim() : "",
      capLogAtGoal: isRecurring && hasCounter && counterGoal.trim() !== "" && Number(counterGoal) > 0 && capLogAtGoal,
    });
    setSubmitting(false);
    if (err) setError(err);
  }

  const scrollView = (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="always"
      {...(Platform.OS === "ios" ? { automaticallyAdjustKeyboardInsets: true } : {})}
    >
        {avatarsEnabled ? (
          <View style={styles.avatarHero}>
            <ChibiAvatar equipped={equipped} height={140} />
          </View>
        ) : null}

        {/* While the date picker is open / closing, swap the TextInput for a
            styled View. No TextInput in the tree means RN can't focus
            anything and no keyboard appears — eliminating the flash that
            showSoftInputOnFocus alone doesn't reliably prevent. */}
        {keyboardSuppressed ? (
          <View style={[styles.titleInput, { justifyContent: "center" }]}>
            <ThemedText
              style={{
                color: title ? c.fg : c.fgSubtle,
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: 0.2,
              }}
            >
              {title || "What needs to be done?"}
            </ThemedText>
          </View>
        ) : (
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
            placeholderTextColor={c.fgSubtle}
            onSubmitEditing={handleSubmit}
            style={[styles.titleInput, { color: c.fg }]}
          />
        )}

        {showDescription || description ? (
          keyboardSuppressed ? (
            <View style={[styles.descInput, { minHeight: 36 }]}>
              <ThemedText
                style={{
                  color: description ? c.fgMuted : c.fgSubtle,
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {description || "Description"}
              </ThemedText>
            </View>
          ) : (
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              placeholderTextColor={c.fgSubtle}
              multiline
              style={[styles.descInput, { color: c.fgMuted }]}
            />
          )
        ) : (
          <Pressable onPress={() => setShowDescription(true)}>
            <ThemedText style={{ color: c.fgSubtle, fontSize: 11, letterSpacing: 0.5, marginBottom: 12 }}>
              + Description
            </ThemedText>
          </Pressable>
        )}

        <View style={styles.pillRow}>
          {PRIORITIES.map((p) => {
            const active = priority === p.key;
            return (
              <Pressable
                key={p.key}
                onPress={() => setPriority(p.key)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active ? p.bg : "transparent",
                    borderColor: active ? p.color : c.borderHairline,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    fontSize: 10,
                    color: active ? p.color : c.fgSubtle,
                    fontWeight: active ? "600" : "400",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  {p.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: 14, marginTop: 14, marginBottom: 12 }}>
            <Field label={isRecurring ? "First Due" : "Due"} c={c}>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                suppressKeyboardAfterClose
                onOpenChange={(open) => {
                  if (open) {
                    setKeyboardSuppressed(true);
                  } else {
                    // Hold suppression past Modal unmount so any phantom
                    // focus during unmount is silent. No explicit refocus —
                    // the form intentionally leaves the keyboard down.
                    setTimeout(() => setKeyboardSuppressed(false), 500);
                  }
                }}
              />
            </Field>

            <Field label="Category" c={c}>
              <CompactSelect
                value={category}
                onChange={setCategory}
                options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              />
            </Field>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Field label="Repeat" c={c}>
                  <CompactSelect
                    value={isRecurring ? recurrenceRule : "once"}
                    onChange={(v) => {
                      if (v === "once") setIsRecurring(false);
                      else {
                        setIsRecurring(true);
                        setRecurrenceRule(v);
                      }
                    }}
                    options={REPEAT_OPTIONS.map((o) => ({
                      value: o.rule ?? "once",
                      label: o.label,
                    }))}
                  />
                </Field>
              </View>
              <View style={{ width: 80 }}>
                <Field label="Points" c={c}>
                  <CompactSelect
                    value={String(pointValue)}
                    onChange={(v) => setPointValue(Number(v))}
                    options={pointOptions.map((v) => ({ value: String(v), label: String(v) }))}
                    highlight
                  />
                </Field>
              </View>
            </View>

            {/* Counter — recurring-only flex-wrap row. */}
            {isRecurring ? (
              <Field label="Counter" c={c}>
                <View style={styles.counterRow}>
                  <Pressable
                    onPress={() => setHasCounter((v) => !v)}
                    style={[
                      styles.pillCompact,
                      {
                        backgroundColor: hasCounter ? c.activeHighlightBg : "transparent",
                        borderColor: hasCounter ? c.activeHighlightBorder : c.borderHairline,
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        fontSize: 10,
                        color: hasCounter ? c.activeHighlight : c.fgSubtle,
                        fontWeight: hasCounter ? "600" : "400",
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {hasCounter ? "On" : "Off"}
                    </ThemedText>
                  </Pressable>

                  {hasCounter ? (
                    <View style={{ width: 140 }}>
                      <CompactSelect
                        value={counterUnit}
                        onChange={setCounterUnit}
                        options={[
                          { value: "", label: "(no unit)" },
                          ...COUNTER_UNITS.map((u) => ({ value: u, label: u })),
                        ]}
                      />
                    </View>
                  ) : null}

                  {hasCounter ? (
                    <View style={styles.goalCluster}>
                      <ThemedText
                        style={{
                          fontSize: 10,
                          letterSpacing: 1.8,
                          textTransform: "uppercase",
                          color: c.fgSubtle,
                        }}
                      >
                        Goal
                      </ThemedText>
                      <GoalStepper value={counterGoal} onChange={setCounterGoal} />
                      {counterUnit && counterGoal.trim() !== "" ? (
                        <ThemedText style={{ fontSize: 10, color: c.fgSubtle }}>
                          {counterUnit} / {recurrenceRule === "weekly" ? "wk" : recurrenceRule === "monthly" ? "mo" : "day"}
                        </ThemedText>
                      ) : null}
                    </View>
                  ) : null}

                  {hasCounter && counterGoal.trim() !== "" && Number(counterGoal) > 0 ? (
                    <Pressable
                      onPress={() => setCapLogAtGoal((v) => !v)}
                      style={[
                        styles.pillCompact,
                        {
                          backgroundColor: capLogAtGoal ? c.activeHighlightBg : "transparent",
                          borderColor: capLogAtGoal ? c.activeHighlightBorder : c.borderHairline,
                        },
                      ]}
                    >
                      <ThemedText
                        style={{
                          fontSize: 10,
                          color: capLogAtGoal ? c.activeHighlight : c.fgSubtle,
                          fontWeight: capLogAtGoal ? "600" : "400",
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                        }}
                      >
                        Cap at goal
                      </ThemedText>
                    </Pressable>
                  ) : null}
                </View>
              </Field>
            ) : null}
          </View>

        {error ? (
          <ThemedText style={{ color: c.danger, fontSize: 12, marginBottom: 8 }}>{error}</ThemedText>
        ) : null}
    </ScrollView>
  );

  // Pinned bottom footer with Cancel/Save pill buttons.
  const footer = (
    <View style={[styles.pinnedFooter, { borderTopColor: c.borderHairline, backgroundColor: c.bg }]}>
      <View style={styles.bottomActionRow}>
        {onCancel ? (
          <Pressable
            onPress={onCancel}
            disabled={submitting}
            style={({ pressed }) => [
              styles.bottomActionBtn,
              {
                borderColor: c.borderHairline,
                backgroundColor: pressed ? c.overlayHover : "transparent",
                opacity: submitting ? 0.5 : 1,
              },
            ]}
          >
            <ThemedText style={[styles.bottomActionLabel, { color: c.fgSubtle }]}>
              Cancel
            </ThemedText>
          </Pressable>
        ) : null}
        <Pressable
          onPress={handleSubmit}
          disabled={submitting || !title.trim()}
          style={({ pressed }) => [
            styles.bottomActionBtn,
            {
              borderColor: c.borderHairline,
              backgroundColor: pressed ? c.overlayHover : "transparent",
              opacity: submitting || !title.trim() ? 0.5 : 1,
            },
          ]}
        >
          <ThemedText style={[styles.bottomActionLabel, { color: c.activeHighlight }]}>
            {submitting ? "Saving…" : submitLabel}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Sheet bg=c.bg (matches detail screen). */}
      <ThemedView style={[styles.container, { backgroundColor: c.bg }]}>
        {scrollView}
        {footer}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, c, children }: { label: string; c: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <ThemedText
        style={{
          color: c.fgMuted,
          fontSize: 9,
          fontWeight: "600",
          letterSpacing: 1.8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  avatarHero: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    padding: 0,
    marginBottom: 8,
  },
  descInput: {
    fontSize: 12,
    lineHeight: 18,
    padding: 0,
    marginBottom: 12,
    minHeight: 36,
    textAlignVertical: "top",
  },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillCompact: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  // Matches detail-screen footer pill row.
  footerStack: {
    gap: 10,
    paddingTop: 14,
    marginTop: 4,
  },
  pinnedFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bottomActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  bottomActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomActionLabel: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  counterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  goalCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
