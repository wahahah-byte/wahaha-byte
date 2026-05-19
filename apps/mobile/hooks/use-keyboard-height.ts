import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

// Returns the soft-keyboard height in CSS pixels (zero when closed).
//
// Why this exists: KeyboardAvoidingView on Android with edgeToEdgeEnabled: true
// is unreliable — both `behavior="height"` and `behavior="padding"` left a
// ~30-40px stuck offset after the keyboard dismissed (nav-bar height). The
// internal layout recalc under-corrected during the restore. Manual listeners
// avoid that: we set padding to exactly e.endCoordinates.height on show and
// exactly 0 on hide, no math in between.
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    // Will-show/hide on iOS so we move in sync with the keyboard animation.
    // did-show/hide on Android — will-* don't fire there.
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const onShow = Keyboard.addListener(showEvent, (e) => {
      setHeight(e.endCoordinates.height);
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setHeight(0);
    });
    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);
  return height;
}
