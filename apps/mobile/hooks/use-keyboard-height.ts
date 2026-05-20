import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

// Soft-keyboard height (px); manual listeners to dodge Android edge-to-edge bugs.
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    // iOS will-*; Android did-* (will-* don't fire on Android).
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
