import { useEffect } from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";

import { CalendarStrip } from "@/components/calendar-strip";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { equippedCache } from "@/lib/equipped-cache";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useColors } from "@/hooks/use-colors";

// Tabs intentionally ungated — unauthed users browse in demo mode.
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const c = useColors();

  // Prefetch equipped avatar so first detail modal opens with chibi composed.
  useEffect(() => {
    equippedCache.revalidate();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
    <CalendarStrip />
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Nav via MobileEdgeDrawer — bottom tab bar hidden.
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
    </View>
  );
}
