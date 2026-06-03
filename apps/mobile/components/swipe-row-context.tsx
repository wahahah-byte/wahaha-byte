import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";

interface SwipeRowContextValue {
  register: (id: string, progress: SharedValue<number>) => void;
  unregister: (id: string) => void;
  get: (id: string | null | undefined) => SharedValue<number> | null;
  // ID of currently-open row; rows close when it changes to anything else.
  openRowId: SharedValue<string | null>;
  // Force every open row to close.
  closeAll: () => void;
}

const Ctx = createContext<SwipeRowContextValue | null>(null);

export function SwipeRowProvider({ children }: { children: ReactNode }) {
  const mapRef = useRef<Map<string, SharedValue<number>>>(new Map());
  const [version, setVersion] = useState(0);
  const openRowId = useSharedValue<string | null>(null);

  const register = useCallback((id: string, progress: SharedValue<number>) => {
    if (mapRef.current.get(id) !== progress) {
      mapRef.current.set(id, progress);
      setVersion((v) => v + 1);
    }
  }, []);

  const unregister = useCallback((id: string) => {
    if (mapRef.current.delete(id)) setVersion((v) => v + 1);
  }, []);

  const get = useCallback((id: string | null | undefined) => {
    if (!id) return null;
    return mapRef.current.get(id) ?? null;
  }, []);

  const closeAll = useCallback(() => {
    openRowId.value = null;
  }, [openRowId]);

  const value = useMemo(() => {
    // Read `version` so this memo recomputes when the row map mutates (register/
    // unregister bump it), handing consumers a fresh object that re-runs get().
    void version;
    return { register, unregister, get, openRowId, closeAll };
  }, [register, unregister, get, openRowId, closeAll, version]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSwipeRow(): SwipeRowContextValue | null {
  return useContext(Ctx);
}
