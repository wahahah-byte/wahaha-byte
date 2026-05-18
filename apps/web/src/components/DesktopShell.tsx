"use client";

import { ReactNode } from "react";

interface Props {
  sidebar: ReactNode;
  main: ReactNode;
  // The right column is always reserved on desktop so opening a detail panel
  // doesn't reflow the task list. Pass null/undefined when nothing is
  // selected — the column just stays empty.
  detail?: ReactNode | null;
}

// Three-column shell that activates at >=1024px. Below that the children just
// render the main column (the existing mobile layout untouched).
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
