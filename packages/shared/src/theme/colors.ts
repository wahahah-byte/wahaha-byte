// Shared color palette. Source of truth for both apps.
// Web mirrors these via CSS custom properties in apps/web/src/app/globals.css.
// Mobile reads them directly via useColors().

export interface Palette {
  background: string;
  foreground: string;
  bg: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  header: string;
  surface: string;
  surfaceHover: string;
  toolbarBg: string;
  surface2: string;
  surfaceDeep: string;
  track: string;
  border: string;
  borderSoft: string;
  borderFaint: string;
  borderHairline: string;
  buttonBg: string;
  buttonBorder: string;
  buttonFg: string;
  overlayHover: string;
  panel: string;
  panelHeader: string;
  input: string;
  inputFg: string;
  accent: string;
  accentBg: string;
  accentBgHover: string;
  accentBorder: string;
  onAccent: string;
  secondaryAccent: string;
  secondaryAccentBg: string;
  secondaryAccentBorder: string;
  rowGreyed: string;
  rowGreyedHover: string;
  success: string;
  successBg: string;
  successBorder: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  danger: string;
  dangerBg: string;
  dangerBorder: string;
  activeHighlight: string;
  activeHighlightBg: string;
  activeHighlightBorder: string;
  onActiveHighlight: string;
  activeHighlightAlt: string;
  activeHighlightAltBg: string;
  activeHighlightAltBorder: string;
  onActiveHighlightAlt: string;
  modalOverlay: string;
}

export const darkPalette: Palette = {
  background: "#1e1f22",
  foreground: "#ededed",
  bg: "#1e1f22",
  fg: "rgba(255, 255, 255, 0.92)",
  fgMuted: "rgba(255, 255, 255, 0.55)",
  fgSubtle: "rgba(255, 255, 255, 0.35)",
  header: "#1a1b1e",
  surface: "#1e1f22",
  surfaceHover: "#26272b",
  toolbarBg: "#232428",
  surface2: "#2a2b2f",
  surfaceDeep: "#1a1b1f",
  track: "#2e2f34",
  border: "#3e3f42",
  borderSoft: "#2e2f34",
  borderFaint: "rgba(255, 255, 255, 0.25)",
  borderHairline: "rgba(255, 255, 255, 0.06)",
  buttonBg: "#3e3f42",
  buttonBorder: "#555659",
  buttonFg: "#ddd",
  overlayHover: "rgba(255, 255, 255, 0.04)",
  panel: "#2a2b2f",
  panelHeader: "#23242a",
  input: "#1e1f22",
  inputFg: "#f0f0f0",
  accent: "#5bb8e0",
  accentBg: "#1a3a4a",
  accentBgHover: "#1e4d63",
  accentBorder: "#1e5068",
  onAccent: "#0d1f28",
  secondaryAccent: "#a78bfa",
  secondaryAccentBg: "#2a2240",
  secondaryAccentBorder: "#4a3580",
  rowGreyed: "#1e1f22",
  rowGreyedHover: "#26272b",
  success: "#4ade80",
  successBg: "rgba(74, 222, 128, 0.10)",
  successBorder: "rgba(74, 222, 128, 0.32)",
  warning: "#f59e0b",
  warningBg: "rgba(245, 158, 11, 0.10)",
  warningBorder: "rgba(245, 158, 11, 0.32)",
  danger: "#ef4444",
  dangerBg: "rgba(239, 68, 68, 0.10)",
  dangerBorder: "rgba(239, 68, 68, 0.32)",
  activeHighlight: "#f3ecce",
  activeHighlightBg: "rgba(243, 236, 206, 0.09)",
  activeHighlightBorder: "rgba(243, 236, 206, 0.28)",
  onActiveHighlight: "#1a1408",
  activeHighlightAlt: "#cfc0eb",
  activeHighlightAltBg: "rgba(207, 192, 235, 0.1)",
  activeHighlightAltBorder: "rgba(207, 192, 235, 0.32)",
  onActiveHighlightAlt: "#1a1a2e",
  modalOverlay: "rgba(0, 0, 0, 0.72)",
};

export const lightPalette: Palette = {
  background: "#eef0f3",
  foreground: "#1a1a1a",
  bg: "#eef0f3",
  fg: "rgba(0, 0, 0, 0.85)",
  fgMuted: "rgba(0, 0, 0, 0.55)",
  fgSubtle: "rgba(0, 0, 0, 0.38)",
  header: "#d8dadf",
  surface: "#ffffff",
  surfaceHover: "#f4f5f7",
  toolbarBg: "#ecedf0",
  surface2: "#e7e9ed",
  surfaceDeep: "#dde0e5",
  track: "#d8dade",
  border: "#d0d3d8",
  borderSoft: "#e0e2e6",
  borderFaint: "rgba(0, 0, 0, 0.18)",
  borderHairline: "rgba(0, 0, 0, 0.06)",
  buttonBg: "#ffffff",
  buttonBorder: "#c8cbd0",
  buttonFg: "#333",
  overlayHover: "rgba(0, 0, 0, 0.05)",
  panel: "#ffffff",
  panelHeader: "#f3f4f7",
  input: "#fafbfc",
  inputFg: "#1a1a1a",
  accent: "#2b8fc0",
  accentBg: "#e0f0f9",
  accentBgHover: "#cee5f1",
  accentBorder: "#8cc6e0",
  onAccent: "#ffffff",
  secondaryAccent: "#7c5cf0",
  secondaryAccentBg: "#ece6fd",
  secondaryAccentBorder: "#b8a8ed",
  rowGreyed: "#e4e6ea",
  rowGreyedHover: "#dadce1",
  success: "#22a865",
  successBg: "rgba(34, 168, 101, 0.12)",
  successBorder: "rgba(34, 168, 101, 0.40)",
  warning: "#c97a07",
  warningBg: "rgba(201, 122, 7, 0.12)",
  warningBorder: "rgba(201, 122, 7, 0.40)",
  danger: "#d83232",
  dangerBg: "rgba(216, 50, 50, 0.10)",
  dangerBorder: "rgba(216, 50, 50, 0.42)",
  activeHighlight: "#8a7855",
  activeHighlightBg: "rgba(138, 120, 85, 0.1)",
  activeHighlightBorder: "rgba(138, 120, 85, 0.3)",
  onActiveHighlight: "#ffffff",
  activeHighlightAlt: "#6e5ca8",
  activeHighlightAltBg: "rgba(110, 92, 168, 0.1)",
  activeHighlightAltBorder: "rgba(110, 92, 168, 0.32)",
  onActiveHighlightAlt: "#ffffff",
  modalOverlay: "rgba(15, 22, 38, 0.45)",
};

export function getPalette(mode: "light" | "dark"): Palette {
  return mode === "dark" ? darkPalette : lightPalette;
}
