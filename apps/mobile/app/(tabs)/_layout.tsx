import { useEffect } from "react";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { equippedCache } from "@/lib/equipped-cache";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Tabs intentionally aren't gated by an auth check — unauthenticated users
// can browse the app in "demo mode" (matches the web home page's behaviour).
// The DemoModeBanner on the home tab prompts them to sign in when they're
// ready; API calls just fail/return empty until they do.
export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Prefetch the user's equipped avatar at app start so the FIRST detail
  // modal opens with the chibi already composed — instead of waiting for
  // /api/avatar/equipped after the user taps a task. revalidate() silently
  // no-ops if unauthenticated (demo mode); next mount will retry.
  useEffect(() => {
    equippedCache.revalidate();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Nav is provided by the global MobileEdgeDrawer — hide the bottom
        // tab bar entirely so the drawer is the only nav surface.
        tabBarStyle: { display: "none" },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "To Do",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recurring"
        options={{
          title: "Routines",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="repeat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: "Archive",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="archivebox.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
