import type { Dispatch, SetStateAction } from "react";
import { Image, Pressable, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import { REGULAR_CAP, RECURRING_CAP, type UserProfile } from "@wahaha/shared";
import { ThemedText } from "@/components/themed-text";
import type { useColors } from "@/hooks/use-colors";
import { ArchiveIcon, RecurringIcon, TasksIcon } from "@/components/mobile-edge-drawer/icons";
import { styles } from "@/components/mobile-edge-drawer/styles";

const ITEMS: { route: "/" | "/recurring" | "/archive"; label: string }[] = [
  { route: "/", label: "To Do" },
  { route: "/recurring", label: "Routines" },
  { route: "/archive", label: "Archive" },
];

interface Props {
  c: ReturnType<typeof useColors>;
  insets: EdgeInsets;
  pathname: string;
  theme: string;
  toggleTheme: () => void;
  avatarsEnabled: boolean;
  me: UserProfile | null;
  hasToken: boolean;
  accountMenuOpen: boolean;
  setAccountMenuOpen: Dispatch<SetStateAction<boolean>>;
  goAndClose: (href: string) => void;
  onSignOut: () => void;
}

export function DrawerPanel({
  c,
  insets,
  pathname,
  theme,
  toggleTheme,
  avatarsEnabled,
  me,
  hasToken,
  accountMenuOpen,
  setAccountMenuOpen,
  goAndClose,
  onSignOut,
}: Props) {
  return (
    <View
      style={[
        styles.panel,
        {
          width: 220,
          backgroundColor: c.header,
          borderRightColor: c.borderSoft,
          paddingTop: 12 + insets.top,
          paddingBottom: 8 + insets.bottom,
        },
      ]}
    >
      {/* Outer Pressable fills the entire panel so taps anywhere inside
          the drawer — including the empty space above the nav rows —
          close the account menu. Nav rows + user trigger + popover items
          have their own Pressables, so they handle their taps directly
          without bubbling up. Content is bottom-aligned via
          justifyContent so the original layout is preserved. */}
      <Pressable
        onPress={() => {
          if (accountMenuOpen) setAccountMenuOpen(false);
        }}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        {ITEMS.map((item) => {
          const active = pathname === item.route;
          return (
            <NavRow
              key={item.route}
              label={item.label}
              active={active}
              onPress={() => goAndClose(item.route)}
              icon={
                item.label === "To Do" ? <TasksIcon color={active ? c.activeHighlight : c.fgMuted} />
                : item.label === "Routines" ? <RecurringIcon color={active ? c.activeHighlight : c.fgMuted} />
                : <ArchiveIcon color={active ? c.activeHighlight : c.fgMuted} />
              }
              c={c}
            />
          );
        })}

        {/* Caps block is rendered for any signed-in user — even before `me`
            resolves — so the bars are present on the drawer's first frame and
            simply fill in their values instead of popping into the layout. */}
        {hasToken ? (() => {
          const regSubmitted = Math.min(
            (me?.pointsSubmittedToday ?? 0) - (me?.recurringPointsSubmittedToday ?? 0),
            REGULAR_CAP,
          );
          const recSubmitted = Math.min(me?.recurringPointsSubmittedToday ?? 0, RECURRING_CAP);
          const regPct = Math.round((Math.max(0, regSubmitted) / REGULAR_CAP) * 100);
          const recPct = Math.round((Math.max(0, recSubmitted) / RECURRING_CAP) * 100);
          return (
            <View style={[styles.capsBlock, { borderTopColor: c.borderSoft }]}>
              <View style={styles.capsHeader}>
                <ThemedText style={[styles.capsHeaderLabel, { color: c.fgSubtle }]}>Points</ThemedText>
                <ThemedText style={{ fontSize: 12, fontWeight: "600", color: c.fg }}>
                  {(me?.currentBalance ?? 0).toLocaleString()}
                </ThemedText>
              </View>
              <CapBar
                label="Regular"
                cur={Math.max(0, regSubmitted)}
                cap={REGULAR_CAP}
                pct={regPct}
                capped={regSubmitted >= REGULAR_CAP}
                fill={regSubmitted >= REGULAR_CAP ? c.success : regPct >= 75 ? c.warning : c.activeHighlight}
                track={c.track}
                c={c}
              />
              <CapBar
                label="Routines"
                cur={Math.max(0, recSubmitted)}
                cap={RECURRING_CAP}
                pct={recPct}
                capped={recSubmitted >= RECURRING_CAP}
                fill={recSubmitted >= RECURRING_CAP ? c.success : recPct >= 75 ? c.warning : c.activeHighlightAlt}
                track={c.track}
                c={c}
              />
            </View>
          );
        })() : null}

        {/* User row — whole row (avatar + username) is the menu trigger when authed,
            or a Sign In CTA when not. Unauthed state shows no avatar so a previously
            cached pic can't linger after sign-out (also why signOut() clears caches). */}
        <View style={[styles.userRow, { borderTopColor: c.borderSoft }]}>
          {hasToken ? (
            <Pressable
              onPress={() => setAccountMenuOpen((v) => !v)}
              style={({ pressed }) => [
                styles.userTrigger,
                { backgroundColor: pressed ? c.overlayHover : "transparent" },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Account menu"
            >
              <View style={[styles.avatarBtn, { backgroundColor: c.buttonBg, borderColor: c.buttonBorder }]}>
                {me?.profilePictureUrl ? (
                  <Image
                    source={{ uri: me.profilePictureUrl }}
                    style={{ width: 28, height: 28 }}
                  />
                ) : (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={8} r={4} fill={c.fgMuted} opacity={0.8} />
                    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={c.fgMuted} opacity={0.5} />
                  </Svg>
                )}
              </View>
              <ThemedText
                style={{
                  flex: 1,
                  color: c.fg,
                  fontSize: 12,
                  fontWeight: "500",
                }}
                numberOfLines={1}
              >
                {me?.username ?? ""}
              </ThemedText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => goAndClose("/login")}
              style={({ pressed }) => [
                styles.userTrigger,
                {
                  backgroundColor: pressed ? c.overlayHover : "transparent",
                  justifyContent: "space-between",
                },
              ]}
              accessibilityRole="link"
              accessibilityLabel="Sign in"
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
                Sign In
              </ThemedText>
              <ThemedText
                style={{ color: c.activeHighlight, fontSize: 14, lineHeight: 14 }}
              >
                →
              </ThemedText>
            </Pressable>
          )}

          {/* Account menu popover — anchored inside userRow for correct bottom:100%.
              Wrapper Pressable absorbs taps on popover background so they don't
              bubble to the drawer-level dismiss handler. */}
          {accountMenuOpen ? (
            <Pressable
              onPress={() => {}}
              style={[
                styles.popover,
                {
                  backgroundColor: c.surface,
                  borderColor: c.border,
                },
              ]}
            >
              <Pressable
                style={styles.popoverItem}
                onPress={() => toggleTheme()}
              >
                <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Theme</ThemedText>
                <ThemedText style={{ fontSize: 11, color: c.activeHighlight, fontWeight: "600", letterSpacing: 1.8, textTransform: "uppercase" }}>
                  {theme === "dark" ? "Dark" : "Light"}
                </ThemedText>
              </Pressable>
              {avatarsEnabled ? (
                <Pressable
                  style={[styles.popoverItem, { borderTopColor: c.borderSoft, borderTopWidth: 1 }]}
                  onPress={() => goAndClose("/avatar")}
                >
                  <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Avatar</ThemedText>
                </Pressable>
              ) : null}
              <Pressable
                style={[styles.popoverItem, { borderTopColor: c.borderSoft, borderTopWidth: 1 }]}
                onPress={() => goAndClose("/profile")}
              >
                <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Profile</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.popoverItem, { borderTopColor: c.borderSoft, borderTopWidth: 1 }]}
                onPress={() => goAndClose("/settings")}
              >
                <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Settings</ThemedText>
              </Pressable>
              {hasToken ? (
                <Pressable
                  style={[styles.popoverItem, { borderTopColor: c.borderSoft, borderTopWidth: 1 }]}
                  onPress={() => {
                    setAccountMenuOpen(false);
                    onSignOut();
                  }}
                >
                  <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Sign Out</ThemedText>
                </Pressable>
              ) : null}
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

function NavRow({
  label,
  active,
  onPress,
  icon,
  c,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navRow,
        {
          backgroundColor: active
            ? c.activeHighlightBg
            : pressed ? c.overlayHover : "transparent",
          borderLeftColor: active ? c.activeHighlight : "transparent",
        },
      ]}
    >
      <View style={styles.navIconCell}>{icon}</View>
      <ThemedText
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: active ? c.activeHighlight : c.fgMuted,
          fontWeight: active ? "600" : "500",
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function CapBar({
  label,
  cur,
  cap,
  pct,
  capped,
  fill,
  track,
  c,
}: {
  label: string;
  cur: number;
  cap: number;
  pct: number;
  capped: boolean;
  fill: string;
  track: string;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <View>
      <View style={styles.capRow}>
        <ThemedText style={[styles.capLabel, { color: c.fgSubtle }]}>{label}</ThemedText>
        <ThemedText style={[styles.capValue, { color: capped ? c.success : c.fgMuted }]}>
          {cur} / {cap}
        </ThemedText>
      </View>
      <View style={[styles.capTrack, { backgroundColor: track }]}>
        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: fill }} />
      </View>
    </View>
  );
}
