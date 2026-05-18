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
import { MobileEdgeDrawer } from '@/components/mobile-edge-drawer';
import { useColors } from '@/hooks/use-colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Root layout sits OUTSIDE ThemeProvider, so we can't call useColors here.
// Pre-resolve the bg colour from the device color scheme so the very first
// paint of GestureHandlerRootView and SafeAreaProvider already matches the
// app palette — otherwise the browser/native window's default white shows
// through whenever any descendant briefly fails to cover a pixel (notably
// during stack push transitions).
const rootBg = (Appearance.getColorScheme() ?? 'light') === 'dark'
  ? darkPalette.bg
  : lightPalette.bg;

// On web, paint <html> and <body> with the app bg. The browser's overscroll
// (rubber-band) area sits OUTSIDE the document body — so when the user
// swipes the page past its boundaries, the html/body colour shows through,
// not the GestureHandlerRootView's. Default html/body bg is white, which
// produced a big white blank space on overscroll. overscroll-behavior: none
// also prevents pull-to-refresh and other browser overscroll effects from
// composing with our gestures.
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

  // react-native-gesture-handler on web races multiple gestures over the
  // same pointer; when one of them ends or is cancelled, it can call
  // `releasePointerCapture` on a pointerId that another has already
  // released — the browser then throws "InvalidPointerId". This is
  // harmless (the capture is already gone), so we swallow that specific
  // error to keep the console clean. All other errors propagate normally.
  if (typeof Element !== 'undefined' && Element.prototype) {
    const originalRelease = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function patchedRelease(
      this: Element,
      pointerId: number,
    ) {
      try {
        return originalRelease.call(this, pointerId);
      } catch (err) {
        // DOMException name for the "no such pointerId" case.
        if ((err as DOMException)?.name === 'InvalidPointerId') return;
        if ((err as DOMException)?.name === 'NotFoundError') return;
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

// Inside ThemeProvider so useColors works. Paints an explicit background
// View that fills the viewport — covers any region a child fails to cover
// during transitions (e.g. the slide-in's leading edge).
function ThemedRoot() {
  const c = useColors();
  // Keep <html>/<body> bg in sync when the user toggles the in-app theme so
  // the browser's overscroll area always matches the page palette.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.style.backgroundColor = c.bg;
    document.body.style.backgroundColor = c.bg;
  }, [c.bg]);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <NavigationChrome />
    </View>
  );
}

function NavigationChrome() {
  const colorScheme = useColorScheme();
  const c = useColors();
  // Patch react-navigation's theme with our palette so the underlying card +
  // background colours match the app. The default theme uses solid white as
  // `card` in light mode, which paints a thin white slice on the side of
  // pushed screens during their slide-in transition.
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
      {/* Drawer wraps the full screen so its right-swipe gesture is available
          on every route. Children are rendered behind/below the drawer panel
          and backdrop overlays. */}
      <MobileEdgeDrawer>
        <Stack
          // Default contentStyle for every screen — eliminates the brief
          // white panel that appeared during push transitions before the
          // pushed screen's own background painted.
          screenOptions={{ contentStyle: { backgroundColor: c.bg } }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Auth screens are siblings of (tabs) so they can be reached without
              going through the tab navigator. (tabs)/_layout redirects here
              whenever the auth token is missing. */}
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          {/* task/[id] is a full-page surface presented over the tabs.
              We use transparentModal + fade so the underlying screen stays
              visible during the page's own slide-up mount animation and
              during a pull-down-to-dismiss gesture — the page reads as a
              card you can flick away, but without the bottom-sheet keyboard
              gymnastics that the older sheet shell had. The screen draws
              its own header (with a back button + a chrome-less swipe-down
              gesture) so expo-router's header stays hidden. */}
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
          {/* new-task uses the same transparent-modal pattern as task/[id]
              — a bottom-sheet shell over a dim backdrop, with the underlying
              screen visible behind. Matches the web NewTaskModal dialog
              presentation. */}
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
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </MobileEdgeDrawer>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}
