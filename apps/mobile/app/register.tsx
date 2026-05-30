import { useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import { authApi, saveToken } from "@/lib/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

// Opens the deployed web privacy policy in the device's in-app browser. Single
// source of truth lives in the Next.js static export.
const PRIVACY_URL = "https://wahahah-byte.github.io/wahaha-byte/privacy";

// Mirrors server-side MinimumAgeYears in RegisterUserHandler.
const MIN_AGE_YEARS = 13;

// Format a Date as YYYY-MM-DD in local time (matches the server's DateOnly parse).
function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ageInYears(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    today.getMonth() < dob.getMonth()
    || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
  if (beforeBirthday) age--;
  return age;
}

// Mobile registration screen — mirrors web /register, lands on home tab.
export default function RegisterScreen() {
  const c = useColors();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // null until the user picks a date — keeps the placeholder visible.
  const [dob, setDob] = useState<Date | null>(null);
  // iOS keeps the picker inline; Android pops a one-shot modal toggled by this flag.
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;
  // Date 13 years ago — used as the picker's default and as a soft max so users can't pick the future.
  const today = useMemo(() => new Date(), []);

  function handleDobChange(_event: DateTimePickerEvent, picked?: Date) {
    if (Platform.OS !== "ios") setPickerOpen(false);
    if (picked) setDob(picked);
  }

  async function handleSubmit() {
    setError(null);
    if (!username.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!dob) {
      setError("Please enter your date of birth.");
      return;
    }
    const age = ageInYears(dob);
    if (age < MIN_AGE_YEARS) {
      setError(`You must be at least ${MIN_AGE_YEARS} years old to register.`);
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    const res = await authApi.register({
      username: username.trim(),
      email: email.trim(),
      password,
      dateOfBirth: toIsoDate(dob),
    });
    setLoading(false);
    if (!res.data) {
      setError(res.error ?? "Registration failed.");
      return;
    }
    await saveToken(res.data.token);
    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: 4 }}>
            <ThemedText style={[styles.title, { color: c.fg }]}>
              Create Account
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: c.fgMuted }]}>
              Start tracking tasks and earning points.
            </ThemedText>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: c.panel, borderColor: c.border },
            ]}
          >
            {error ? (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: c.dangerBg, borderColor: c.dangerBorder },
                ]}
              >
                <ThemedText style={{ color: c.danger, fontSize: 12 }}>
                  {error}
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: c.fgMuted }]}>
                Username <ThemedText style={{ color: c.danger }}>*</ThemedText>
              </ThemedText>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                autoFocus
                placeholder="your_handle"
                placeholderTextColor={c.fgSubtle}
                style={[
                  styles.input,
                  {
                    backgroundColor: c.input,
                    color: c.inputFg,
                    borderColor: c.border,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: c.fgMuted }]}>
                Email <ThemedText style={{ color: c.danger }}>*</ThemedText>
              </ThemedText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor={c.fgSubtle}
                style={[
                  styles.input,
                  {
                    backgroundColor: c.input,
                    color: c.inputFg,
                    borderColor: c.border,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: c.fgMuted }]}>
                Date of Birth <ThemedText style={{ color: c.danger }}>*</ThemedText>
              </ThemedText>
              {Platform.OS === "ios" ? (
                <View
                  style={[
                    styles.input,
                    {
                      backgroundColor: c.input,
                      borderColor: c.border,
                      paddingVertical: 4,
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                >
                  <DateTimePicker
                    value={dob ?? new Date(today.getFullYear() - MIN_AGE_YEARS, today.getMonth(), today.getDate())}
                    mode="date"
                    display="default"
                    maximumDate={today}
                    onChange={handleDobChange}
                  />
                </View>
              ) : (
                <>
                  <Pressable
                    onPress={() => setPickerOpen(true)}
                    style={[
                      styles.input,
                      {
                        backgroundColor: c.input,
                        borderColor: c.border,
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <ThemedText style={{ color: dob ? c.inputFg : c.fgSubtle, fontSize: 14 }}>
                      {dob ? toIsoDate(dob) : "Tap to choose"}
                    </ThemedText>
                  </Pressable>
                  {pickerOpen ? (
                    <DateTimePicker
                      value={dob ?? new Date(today.getFullYear() - MIN_AGE_YEARS, today.getMonth(), today.getDate())}
                      mode="date"
                      display="default"
                      maximumDate={today}
                      onChange={handleDobChange}
                    />
                  ) : null}
                </>
              )}
              <ThemedText style={{ color: c.fgSubtle, fontSize: 10, letterSpacing: 0.4 }}>
                You must be at least {MIN_AGE_YEARS} years old to use this service.
              </ThemedText>
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: c.fgMuted }]}>
                Password <ThemedText style={{ color: c.danger }}>*</ThemedText>
              </ThemedText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                placeholderTextColor={c.fgSubtle}
                style={[
                  styles.input,
                  {
                    backgroundColor: c.input,
                    color: c.inputFg,
                    borderColor: c.border,
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: c.fgMuted }]}>
                Confirm Password <ThemedText style={{ color: c.danger }}>*</ThemedText>
              </ThemedText>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                autoComplete="new-password"
                placeholder="Repeat your password"
                placeholderTextColor={c.fgSubtle}
                onSubmitEditing={handleSubmit}
                returnKeyType="go"
                style={[
                  styles.input,
                  {
                    backgroundColor: c.input,
                    color: c.inputFg,
                    borderColor: mismatch ? c.danger : c.border,
                  },
                ]}
              />
              {mismatch ? (
                <ThemedText style={{ color: c.danger, fontSize: 10, letterSpacing: 0.4 }}>
                  Passwords do not match
                </ThemedText>
              ) : null}
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.submitBtn,
                {
                  backgroundColor: c.activeHighlightBg,
                  borderColor: c.activeHighlightBorder,
                  opacity: loading ? 0.5 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: c.activeHighlight,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {loading ? "Creating account…" : "Create Account"}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}
              style={{ alignSelf: "center", paddingVertical: 4, marginTop: 6 }}
              accessibilityRole="link"
            >
              <ThemedText style={{ color: c.fgSubtle, fontSize: 10, textAlign: "center", lineHeight: 14 }}>
                By creating an account, you agree to our{" "}
                <ThemedText style={{ color: c.activeHighlight, fontSize: 10 }}>Privacy Policy</ThemedText>
                .
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <ThemedText style={{ color: c.fgSubtle, fontSize: 12 }}>
              Already have an account?{" "}
            </ThemedText>
            <Link href="/login" asChild>
              <Pressable>
                <ThemedText
                  style={{
                    color: c.activeHighlight,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Sign in
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 4,
    borderWidth: 1,
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    letterSpacing: 0.8,
  },
  errorBox: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 3,
    borderWidth: 1,
  },
  field: { gap: 6 },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 3,
    borderWidth: 1,
    fontSize: 14,
  },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
