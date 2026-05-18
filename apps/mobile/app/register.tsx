import { useState } from "react";
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

import { authApi, saveToken } from "@/lib/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

// Mobile registration screen. Mirrors the web /register page's fields
// (username, email, password, confirm password) and submits via the shared
// authApi.register. On success it stores the token and lands the user on
// the home tab.
export default function RegisterScreen() {
  const c = useColors();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;

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
    Keyboard.dismiss();
    setLoading(true);
    const res = await authApi.register({
      username: username.trim(),
      email: email.trim(),
      password,
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
