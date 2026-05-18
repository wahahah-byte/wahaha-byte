import { useTheme } from "@/context/theme-context";

export function useColorScheme(): "light" | "dark" {
  return useTheme().theme;
}
