import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PortalAPI {
  add: (key: string, content: ReactNode) => void;
  remove: (key: string) => void;
}

const PortalContext = createContext<PortalAPI | null>(null);

// Renders registered <Portal> children at the host's render root, after its
// normal children. Used to escape parent layout/clipping/modal-focus
// constraints without React Native's <Modal> (which captures and restores
// first responder on iOS, causing a keyboard flicker).
export function PortalHost({ children }: { children: ReactNode }) {
  const [portals, setPortals] = useState<Record<string, ReactNode>>({});
  const api = useMemo<PortalAPI>(
    () => ({
      add: (key, content) =>
        setPortals((p) => (p[key] === content ? p : { ...p, [key]: content })),
      remove: (key) =>
        setPortals((p) => {
          if (!(key in p)) return p;
          const { [key]: _omit, ...rest } = p;
          return rest;
        }),
    }),
    [],
  );
  return (
    <PortalContext.Provider value={api}>
      {children}
      {Object.entries(portals).map(([key, content]) => (
        <Fragment key={key}>{content}</Fragment>
      ))}
    </PortalContext.Provider>
  );
}

// Mounts its children into the nearest enclosing <PortalHost>. If no host is
// present, renders inline as a fallback.
export function Portal({ children }: { children: ReactNode }) {
  const api = useContext(PortalContext);
  const id = useId();
  const stableAdd = useCallback(
    (content: ReactNode) => api?.add(id, content),
    [api, id],
  );
  useEffect(() => {
    if (!api) return;
    stableAdd(children);
    return () => api.remove(id);
  }, [api, id, children, stableAdd]);
  if (!api) return <>{children}</>;
  return null;
}
