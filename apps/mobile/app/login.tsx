import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { authApi, saveToken } from "@/lib/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

// Opens the deployed web privacy policy in the device's in-app browser. Mobile
// doesn't bundle the policy itself (it's Termly-generated HTML that lives in the
// Next.js static export); hosting it once on the web and linking from here keeps
// it editable in one place.
const PRIVACY_URL = "https://wahahah-byte.github.io/wahaha-byte/privacy";

// Mobile sign-in screen — mirrors web /login layout.
export default function LoginScreen() {
  const c = useColors();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    const res = await authApi.login({ email: email.trim(), password });
    setLoading(false);
    if (!res.data) {
      setError(res.error ?? "Sign in failed.");
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
      <ThemedView style={styles.root}>
        <View
          style={[
            styles.card,
            { backgroundColor: c.panel, borderColor: c.border },
          ]}
        >
          <View style={{ gap: 4 }}>
            <ThemedText style={[styles.title, { color: c.fg }]}>
              Welcome back
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: c.fgMuted }]}>
              Sign in to keep racking up points.
            </ThemedText>
          </View>

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
              autoComplete="current-password"
              placeholder="Enter your password"
              placeholderTextColor={c.fgSubtle}
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
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
              {loading ? "Signing in…" : "Log In"}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}
            style={{ alignSelf: "center", paddingVertical: 4 }}
            accessibilityRole="link"
          >
            <ThemedText style={{ color: c.fgSubtle, fontSize: 10, textAlign: "center", lineHeight: 14 }}>
              By signing in, you agree to our{" "}
              <ThemedText style={{ color: c.activeHighlight, fontSize: 10 }}>Privacy Policy</ThemedText>
              .
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <ThemedText style={{ color: c.fgSubtle, fontSize: 12 }}>
            Need an account?{" "}
          </ThemedText>
          <Link href="/register" asChild>
            <Pressable>
              <ThemedText
                style={{
                  color: c.activeHighlight,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Register
              </ThemedText>
            </Pressable>
          </Link>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
