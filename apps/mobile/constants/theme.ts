// App color palette for light and dark mode.

import { Platform } from 'react-native';
import { darkPalette, lightPalette } from '@wahaha/shared';

export const Colors = {
  light: {
    text: lightPalette.fg,
    background: lightPalette.bg,
    tint: lightPalette.activeHighlight,
    icon: lightPalette.fgMuted,
    tabIconDefault: lightPalette.fgMuted,
    tabIconSelected: lightPalette.activeHighlight,
  },
  dark: {
    text: darkPalette.fg,
    background: darkPalette.bg,
    tint: darkPalette.activeHighlight,
    icon: darkPalette.fgMuted,
    tabIconDefault: darkPalette.fgMuted,
    tabIconSelected: darkPalette.activeHighlight,
  },
};

export const Fonts = Platform.select({
  ios: {
    // iOS UIFontDescriptorSystemDesignDefault
    sans: 'system-ui',
    // iOS UIFontDescriptorSystemDesignSerif
    serif: 'ui-serif',
    // iOS UIFontDescriptorSystemDesignRounded
    rounded: 'ui-rounded',
    // iOS UIFontDescriptorSystemDesignMonospaced
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
