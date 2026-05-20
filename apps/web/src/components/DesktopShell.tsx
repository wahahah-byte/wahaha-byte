"use client";

import { ReactNode } from "react";

interface Props {
  sidebar: ReactNode;
  main: ReactNode;
  // Right column always reserved on desktop; pass null when nothing selected.
  detail?: ReactNode | null;
}

// Three-column shell active >=1024px.
export default function DesktopShell({ sidebar, main, detail }: Props) {
  return (
    <div className="desktop-shell">
      <aside className="desktop-shell-sidebar" aria-label="Navigation">
        {sidebar}
      </aside>
      <main className="desktop-shell-main">{main}</main>
      <aside className="desktop-shell-detail" aria-label="Detail" data-empty={detail == null ? "true" : undefined}>
        {detail}
      </aside>
    </div>
  );
}
