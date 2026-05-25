import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, type Theme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Appearance, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { darkPalette, lightPalette } from '@wahaha/shared';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider } from '@/context/theme-context';
import { UndoProvider } from '@/context/undo-context';
import { MobileEdgeDrawer } from '@/components/mobile-edge-drawer';
import { SignInTab } from '@/components/sign-in-tab';
import { useColors } from '@/hooks/use-colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Pre-resolve bg from device scheme so first paint matches app palette.
const rootBg = (Appearance.getColorScheme() ?? 'light') === 'dark'
  ? darkPalette.bg
  : lightPalette.bg;

// Web: paint html/body with app bg so overscroll area matches; disable overscroll.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  if (htmlEl) {
    htmlEl.style.backgroundColor = rootBg;
    htmlEl.style.overscrollBehavior = 'none';
  }
  if (bodyEl) {
    bodyEl.style.backgroundColor = rootBg;
    bodyEl.style.overscrollBehavior = 'none';
  }

  // Silence RNGH 2.28 React-19 element.ref deprecation noise (fixed in 2.31).
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    const originalConsoleError = console.error;
    console.error = function patchedConsoleError(...args: unknown[]) {
      const first = args[0];
      if (typeof first === 'string' && first.includes('Accessing element.ref was removed in React 19')) {
        return;
      }
      return originalConsoleError.apply(this, args as []);
    };
  }

  // Swallow harmless InvalidPointerId throws from RNGH web pointer-capture races.
  if (typeof Element !== 'undefined' && Element.prototype) {
    const isInvalidPointer = (err: unknown): boolean => {
      const name = (err as DOMException | null)?.name;
      return name === 'InvalidPointerId' || name === 'NotFoundError';
    };
    const originalRelease = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function patchedRelease(
      this: Element,
      pointerId: number,
    ) {
      try {
        return originalRelease.call(this, pointerId);
      } catch (err) {
        if (isInvalidPointer(err)) return;
        throw err;
      }
    };
    const originalSet = Element.prototype.setPointerCapture;
    Element.prototype.setPointerCapture = function patchedSet(
      this: Element,
      pointerId: number,
    ) {
      try {
        return originalSet.call(this, pointerId);
      } catch (err) {
        if (isInvalidPointer(err)) return;
        throw err;
      }
    };
  }
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: rootBg }}>
      <SafeAreaProvider style={{ backgroundColor: rootBg }}>
        <ThemeProvider>
          <ThemedRoot />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Inside ThemeProvider; explicit viewport bg covers transition gaps.
function ThemedRoot() {
  const c = useColors();
  // Sync html/body bg on theme toggle for overscroll match.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.style.backgroundColor = c.bg;
    document.body.style.backgroundColor = c.bg;
  }, [c.bg]);
  return (
    <UndoProvider>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <NavigationChrome />
      </View>
    </UndoProvider>
  );
}

function NavigationChrome() {
  const colorScheme = useColorScheme();
  const c = useColors();
  // Patch nav theme with palette so push transitions don't flash white slices.
  const navTheme: Theme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme).colors,
      background: c.bg,
      card: c.bg,
      border: c.border,
      text: c.fg,
    },
  };
  return (
    <NavigationThemeProvider value={navTheme}>
      {/* Drawer wraps full screen for app-wide right-swipe. */}
      <MobileEdgeDrawer>
        <Stack
          // Default contentStyle — kills white-flash on push transitions.
          screenOptions={{ contentStyle: { backgroundColor: c.bg } }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Auth screens are siblings of (tabs); redirected to on missing token. */}
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          {/* task/[id] — transparentModal + fade over tabs; screen draws own header. */}
          <Stack.Screen
            name="task/[id]"
            options={{
              headerShown: false,
              presentation: "transparentModal",
              animation: "fade",
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen name="edit-task/[id]" options={{ presentation: 'modal', title: 'Edit task' }} />
          {/* new-task — transparentModal with dim backdrop, mirrors web NewTaskModal. */}
          <Stack.Screen
            name="new-task"
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen name="avatar" options={{ title: 'Avatar' }} />
          <Stack.Screen name="shop" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        {/* Floats on top of every screen when unauthed; self-hides on /login + /register. */}
        <SignInTab />
      </MobileEdgeDrawer>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}
