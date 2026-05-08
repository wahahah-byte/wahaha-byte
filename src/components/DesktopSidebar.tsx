"use client";

import { ReactNode } from "react";
import Link from "next/link";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  active?: boolean;
}

export interface SidebarFilterItem {
  value: string;
  label: string;
  count?: number;
  dotColor?: string | null;
  active?: boolean;
}

export interface SidebarFilterGroup {
  title: string;
  items: SidebarFilterItem[];
  onSelect: (value: string) => void;
  // Used so the same value across different groups doesn't collide.
  groupKey?: string;
}

interface Props {
  navItems: SidebarNavItem[];
  filterGroups?: SidebarFilterGroup[];
  // Optional bottom slot (e.g., user/settings shortcut).
  footer?: ReactNode;
}

export default function DesktopSidebar({ navItems, filterGroups, footer }: Props) {
  return (
    <div className="desktop-sidebar">
      <nav className="desktop-sidebar-section" aria-label="Pages">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`desktop-sidebar-row${item.active ? " active" : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            <span className="desktop-sidebar-icon" aria-hidden>{item.icon}</span>
            <span className="desktop-sidebar-label">{item.label}</span>
            {item.badge != null && (
              <span className="desktop-sidebar-badge">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      {filterGroups?.map((group) => (
        <div key={group.groupKey ?? group.title} className="desktop-sidebar-section">
          <div className="desktop-sidebar-section-title">{group.title}</div>
          {group.items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => group.onSelect(item.value)}
              className={`desktop-sidebar-row${item.active ? " active" : ""}`}
            >
              <span className="desktop-sidebar-icon" aria-hidden>
                {item.dotColor ? (
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: item.dotColor,
                      display: "inline-block",
                    }}
                  />
                ) : (
                  <FilterIcon />
                )}
              </span>
              <span className="desktop-sidebar-label">{item.label}</span>
              {item.count != null && item.count > 0 && (
                <span className="desktop-sidebar-badge">{item.count}</span>
              )}
            </button>
          ))}
        </div>
      ))}

      {footer && <div className="desktop-sidebar-footer">{footer}</div>}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <line x1="3" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="3" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="3" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
