import { getPalette, type Palette } from "@wahaha/shared";
import { useTheme } from "@/context/theme-context";

export function useColors(): Palette {
  const { theme } = useTheme();
  return getPalette(theme);
}
