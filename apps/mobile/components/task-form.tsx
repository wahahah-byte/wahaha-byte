import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { CATEGORIES, maxPointsFor, type UserInventoryDto } from "@wahaha/shared";

import { ChibiAvatar } from "@/components/chibi-avatar";
import { CompactSelect } from "@/components/compact-select";
import { DatePicker } from "@/components/date-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { useAvatarsEnabled } from "@/hooks/use-avatars-enabled";
import { equippedCache } from "@/lib/equipped-cache";
import { REPEAT_OPTIONS, fmtDate, parseDate, type PriorityKey } from "@/lib/task-form-helpers";
import { CounterSection } from "@/components/task-form/counter-section";
import { styles } from "@/components/task-form/styles";

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

interface Props {
  initial?: TaskFormValues;
  submitLabel?: string;
  onSubmit: (values: TaskFormValues) => Promise<string | null>;
  onCancel?: () => void;
  // Edit-from-detail-sheet hides the avatar hero to leave more vertical
  // room for fields inside the constrained sheet height.
  hideAvatar?: boolean;
  // When rendered inside @gorhom/bottom-sheet, the host must inject
  // BottomSheetScrollView — regular RN ScrollView's gestures don't reach
  // the sheet's gesture context and the form can't be scrolled. Typed as
  // any-prop ComponentType so the bottom-sheet variant (slightly different
  // prop surface) plugs in without casts at the call site.
  ScrollComponent?: ComponentType<any>;
}

export function TaskForm({
  initial = emptyTaskForm,
  submitLabel = "Create",
  onSubmit,
  onCancel,
  hideAvatar = false,
  ScrollComponent = ScrollView,
}: Props) {
  const c = useColors();

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [showDescription, setShowDescription] = useState(!!initial.description);
  const [category, setCategory] = useState(initial.category);
  // Refs so we can aggressively blur every TextInput when the date picker
  // opens. The form intentionally never wants the keyboard back through the
  // date picker flow.
  const titleRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
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

  // Routines cap at 5pt; clamp to the cap (not all the way to 1) so as much
  // of the chosen value is preserved as the cap allows. Non-recurring is
  // capped by category below.
  useEffect(() => {
    if (isRecurring) setPointValue((v) => (v > 5 ? 5 : v));
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
    <ScrollComponent
      style={{ flex: 1 }}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="always"
      {...(Platform.OS === "ios" ? { automaticallyAdjustKeyboardInsets: true } : {})}
    >
        {avatarsEnabled && !hideAvatar ? (
          <View style={styles.avatarHero}>
            <ChibiAvatar equipped={equipped} height={140} />
          </View>
        ) : null}

        <TextInput
          ref={titleRef}
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
          placeholderTextColor={c.fgSubtle}
          onSubmitEditing={handleSubmit}
          style={[styles.titleInput, { color: c.fg }]}
        />

        {showDescription || description ? (
          <TextInput
            ref={descriptionRef}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={c.fgSubtle}
            multiline
            style={[styles.descInput, { color: c.fgMuted }]}
          />
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
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Field label={isRecurring ? "First Due" : "Due"} c={c}>
                  <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    suppressKeyboardAfterClose
                    onOpenChange={(open) => {
                      if (open) {
                        // Hard-blur every TextInput in the form. Even after the
                        // date picker closes the form intentionally never wants
                        // the keyboard back, so we kill any focus before the
                        // picker even shows.
                        titleRef.current?.blur();
                        descriptionRef.current?.blur();
                        Keyboard.dismiss();
                      } else {
                        // Belt-and-suspenders on top of the DatePicker's own
                        // keyboardWillShow/DidShow guard: dismiss again as soon
                        // as we hear the picker closed, in case anything tries
                        // to reassert focus.
                        titleRef.current?.blur();
                        descriptionRef.current?.blur();
                        Keyboard.dismiss();
                      }
                    }}
                  />
                </Field>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Field label="Category" c={c}>
                  <CompactSelect
                    value={category}
                    onChange={setCategory}
                    options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                  />
                </Field>
              </View>
            </View>

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

            {/* Converting an existing task to a routine forces its points down to
                the routine cap (5). Surface that instead of silently changing it. */}
            {isRecurring && !initial.isRecurring && initial.pointValue > 5 ? (
              <ThemedText style={{ color: c.fgSubtle, fontSize: 11, lineHeight: 15 }}>
                Routines are capped at 5 pts — points lowered from {initial.pointValue}.
              </ThemedText>
            ) : null}

            {/* Counter — recurring-only. */}
            {isRecurring ? (
              <CounterSection
                hasCounter={hasCounter}
                setHasCounter={setHasCounter}
                counterUnit={counterUnit}
                setCounterUnit={setCounterUnit}
                counterGoal={counterGoal}
                setCounterGoal={setCounterGoal}
                capLogAtGoal={capLogAtGoal}
                setCapLogAtGoal={setCapLogAtGoal}
                recurrenceRule={recurrenceRule}
                c={c}
              />
            ) : null}
          </View>

        {error ? (
          <ThemedText style={{ color: c.danger, fontSize: 12, marginBottom: 8 }}>{error}</ThemedText>
        ) : null}
    </ScrollComponent>
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
