import type { SidebarFilterGroup } from "@/components/DesktopSidebar";
import { CATEGORY_COLOR } from "@/lib/constants";

interface FilterDef { value: string; label: string }

interface BuildOpts {
  // Title of the status/view section (e.g. "Status" on Today, "View" on Routines).
  statusTitle: string;
  // The filter list (FILTERS or RECURRING_FILTERS).
  statusFilters: readonly FilterDef[];
  activeFilter: string;
  filterCounts: Record<string, number>;
  // Optional per-filter dot tint (e.g. amber on routines/today, red on missed).
  statusDotColor?: (value: string) => string | null;
  onStatusSelect: (value: string) => void;
  // Categories present in the current task set as [name, count] tuples.
  categories: [string, number][];
  activeCategory: string | null;
  onCategorySelect: (category: string) => void;
}

// Composes the Status/View + Categories filterGroups passed to <DesktopSidebar>.
// Both Today and Routines pages share this layout; they differ only in titles,
// filter set, and per-filter dot tints — all surfaced as parameters.
export function buildSidebarFilterGroups(opts: BuildOpts): SidebarFilterGroup[] {
  const groups: SidebarFilterGroup[] = [
    {
      title: opts.statusTitle,
      groupKey: "status",
      onSelect: opts.onStatusSelect,
      items: opts.statusFilters.map((f) => ({
        value: f.value,
        label: f.label,
        count: opts.filterCounts[f.value] ?? 0,
        active: f.value === opts.activeFilter,
        dotColor: opts.statusDotColor?.(f.value) ?? null,
      })),
    },
  ];

  if (opts.categories.length) {
    groups.push({
      title: "Categories",
      groupKey: "categories",
      onSelect: opts.onCategorySelect,
      items: opts.categories.map(([cat, count]) => ({
        value: cat,
        label: cat,
        count,
        dotColor: CATEGORY_COLOR[cat] ?? "var(--color-fg-muted)",
        active: opts.activeCategory === cat,
      })),
    });
  }

  return groups;
}
