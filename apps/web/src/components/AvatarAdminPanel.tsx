"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { avatarApi, type AvatarItemDto } from "@/lib/api/avatar";
import { assetPath } from "@/lib/assetPath";
import { boundsTransformFor, useClientBounds } from "@/lib/cardTransform";
import { useToast } from "@/context/ToastContext";
import AvatarItemFormModal, { type FormMode } from "@/components/AvatarItemFormModal";

interface Props {
  // Admin can delete; both Admin/Moderator can manage.
  isAdmin: boolean;
  isModerator: boolean;
  // Fires after catalogue mutations so the host page can refresh inventory.
  onCatalogueChange?: () => void;
}

// Collapsible admin panel on /avatar; create/update/toggle/delete items.
export default function AvatarAdminPanel({ isAdmin, isModerator, onCatalogueChange }: Props) {
  const { setError, setSuccess } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AvatarItemDto[]>([]);
  const [filter, setFilter] = useState("");
  // Item IDs currently mid-request to block double-click writes.
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());
  // Active modal mode (create / edit); null when closed.
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  // Active grant target; null when grant modal is closed.
  const [grantTarget, setGrantTarget] = useState<AvatarItemDto | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await avatarApi.catalog({ pageNumber: 1, pageSize: 500 });
    setLoading(false);
    if (error) { setError(error); return; }
    setItems(data?.data ?? []);
  }, [setError]);

  // Lazy-load: only fetch when first opened.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open && items.length === 0 && !loading) refresh();
  }, [open, items.length, loading, refresh]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      i.name.toLowerCase().includes(q)
      || i.category.toLowerCase().includes(q)
      || i.slot.toLowerCase().includes(q),
    );
  }, [items, filter]);

  const onToggleAvailability = useCallback(async (item: AvatarItemDto) => {
    if (busyIds.has(item.itemId)) return;
    setBusyIds((prev) => new Set(prev).add(item.itemId));
    // Optimistic flip; roll back on error.
    setItems((prev) => prev.map((i) =>
      i.itemId === item.itemId ? { ...i, isAvailable: !i.isAvailable } : i,
    ));
    const { error } = await avatarApi.toggleItemAvailability(item.itemId);
    setBusyIds((prev) => { const n = new Set(prev); n.delete(item.itemId); return n; });
    if (error) {
      setItems((prev) => prev.map((i) =>
        i.itemId === item.itemId ? { ...i, isAvailable: item.isAvailable } : i,
      ));
      setError(error);
    }
  }, [busyIds, setError]);

  const onDelete = useCallback(async (item: AvatarItemDto) => {
    if (!isAdmin) return;
    const ok = window.confirm(`Delete "${item.name}" (#${item.itemId})? This can't be undone.`);
    if (!ok) return;
    setBusyIds((prev) => new Set(prev).add(item.itemId));
    const { error } = await avatarApi.deleteItem(item.itemId);
    setBusyIds((prev) => { const n = new Set(prev); n.delete(item.itemId); return n; });
    if (error) { setError(error); return; }
    setItems((prev) => prev.filter((i) => i.itemId !== item.itemId));
    onCatalogueChange?.();
  }, [isAdmin, setError, onCatalogueChange]);

  const onEdit = useCallback((item: AvatarItemDto) => {
    setFormMode({ kind: "edit", item });
  }, []);

  // Re-scan PreviewAssetUrl on server, store fresh bounds, splice locally.
  const onRecenter = useCallback(async (item: AvatarItemDto) => {
    if (busyIds.has(item.itemId)) return;
    setBusyIds((prev) => new Set(prev).add(item.itemId));
    const { data, error } = await avatarApi.recomputeBounds(item.itemId);
    setBusyIds((prev) => { const n = new Set(prev); n.delete(item.itemId); return n; });
    if (error) { setError(error); return; }
    if (data) {
      setItems((prev) => prev.map((i) => (i.itemId === data.itemId ? data : i)));
      onCatalogueChange?.();
    }
  }, [busyIds, setError, onCatalogueChange]);

  // Progress for the bulk recenter run; null when idle.
  const [recenterAllProgress, setRecenterAllProgress] = useState<{ done: number; total: number } | null>(null);

  // One-click fix for legacy rows missing bounds; sequential to be API-friendly.
  const onRecenterAll = useCallback(async () => {
    const targets = items.filter((i) => {
      const hasBounds =
        i.contentMinX != null && i.contentMinY != null
        && i.contentMaxX != null && i.contentMaxY != null;
      const httpUrl = !!i.previewAssetUrl && /^https?:\/\//i.test(i.previewAssetUrl);
      return !hasBounds && httpUrl;
    });
    if (targets.length === 0) return;

    setRecenterAllProgress({ done: 0, total: targets.length });
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const { data, error } = await avatarApi.recomputeBounds(t.itemId);
      if (error) {
        // Surface failure via toast; don't abort the batch.
        setError(`Recenter failed for "${t.name}": ${error}`);
      } else if (data) {
        setItems((prev) => prev.map((it) => (it.itemId === data.itemId ? data : it)));
      }
      setRecenterAllProgress({ done: i + 1, total: targets.length });
    }
    setRecenterAllProgress(null);
    onCatalogueChange?.();
  }, [items, setError, onCatalogueChange]);

  // Opens the grant modal for the chosen item.
  const onGrant = useCallback((item: AvatarItemDto) => {
    setGrantTarget(item);
  }, []);

  // Grant modal submit; notifies host so grant-to-self updates inventory.
  const handleGrantSubmit = useCallback(async (
    item: AvatarItemDto,
    targetEmail: string,
    autoEquip: boolean,
  ): Promise<string | null> => {
    const { data, error } = await avatarApi.grantItem(item.itemId, {
      // Empty string → null = grant to self.
      targetEmail: targetEmail.trim() || null,
      autoEquip,
    });
    if (error) return error;
    const who = targetEmail.trim() ? `to ${targetEmail.trim()}` : "to you";
    setSuccess(`Granted "${item.name}" ${who}${autoEquip ? " (equipped)" : ""}.`);
    // Always notify host so inventory re-renders.
    onCatalogueChange?.();
    setGrantTarget(null);
    void data;
    return null;
  }, [setSuccess, onCatalogueChange]);

  // Count of items eligible for bulk recenter (no bounds + scannable URL).
  const recenterableCount = useMemo(() => items.filter((i) => {
    const hasBounds =
      i.contentMinX != null && i.contentMinY != null
      && i.contentMaxX != null && i.contentMaxY != null;
    const httpUrl = !!i.previewAssetUrl && /^https?:\/\//i.test(i.previewAssetUrl);
    return !hasBounds && httpUrl;
  }).length, [items]);

  // Splice modal-saved item into local list; notify host.
  const onSavedFromModal = useCallback((saved: AvatarItemDto) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.itemId === saved.itemId);
      if (idx < 0) return [saved, ...prev];
      const next = prev.slice();
      next[idx] = saved;
      return next;
    });
    onCatalogueChange?.();
  }, [onCatalogueChange]);

  return (
    <section
      style={{
        marginTop: 24,
        border: "1px solid var(--color-border-soft)",
        borderRadius: 4,
        background: "var(--color-surface)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "transparent",
          border: "none",
          color: "var(--color-fg-muted)",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span>
          Manage Items
          <span style={{ marginLeft: 8, color: "var(--color-fg-subtle)", fontWeight: 500 }}>
            {isAdmin ? "Admin" : isModerator ? "Moderator" : ""}
          </span>
        </span>
        <span aria-hidden style={{ color: "var(--color-fg-subtle)", fontSize: 12 }}>
          {open ? "▾" : "▸"}
        </span>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid var(--color-border-soft)", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name / category / slot"
              className="themed-form-input"
              style={{ flex: 1, minWidth: 0, fontSize: 11 }}
            />
            <button
              type="button"
              onClick={() => setFormMode({ kind: "create" })}
              title="Create a new avatar item"
              style={{
                flexShrink: 0,
                padding: "6px 10px",
                background: "var(--color-active-highlight-bg)",
                border: "1px solid var(--color-active-highlight-border)",
                color: "var(--color-active-highlight)",
                borderRadius: 2,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + New item
            </button>
            <button
              type="button"
              onClick={onRecenterAll}
              disabled={recenterAllProgress != null || recenterableCount === 0}
              title={
                recenterableCount === 0
                  ? "All scannable items already have content bounds"
                  : `Recompute bounds for ${recenterableCount} item(s) without them`
              }
              style={{
                flexShrink: 0,
                padding: "6px 10px",
                background: "transparent",
                border: "1px solid var(--color-border-hairline)",
                color: "var(--color-fg-muted)",
                borderRadius: 2,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                cursor: recenterAllProgress != null ? "wait" : (recenterableCount === 0 ? "default" : "pointer"),
                opacity: recenterAllProgress != null || recenterableCount === 0 ? 0.5 : 1,
              }}
            >
              {recenterAllProgress != null
                ? `${recenterAllProgress.done}/${recenterAllProgress.total}…`
                : `Recenter all${recenterableCount > 0 ? ` (${recenterableCount})` : ""}`}
            </button>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              title="Reload the catalogue from the server"
              style={{
                flexShrink: 0,
                padding: "6px 10px",
                background: "transparent",
                border: "1px solid var(--color-border-hairline)",
                color: "var(--color-fg-muted)",
                borderRadius: 2,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "…" : "Refresh"}
            </button>
          </div>

          {loading && items.length === 0 ? (
            <p style={{ color: "var(--color-fg-subtle)", fontSize: 11 }}>Loading items…</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--color-fg-subtle)", fontSize: 11 }}>
              {items.length === 0 ? "No items in the catalogue yet." : "No items match the filter."}
            </p>
          ) : (
            <ul style={{ display: "flex", flexDirection: "column", gap: 4, listStyle: "none", margin: 0, padding: 0 }}>
              {filtered.map((item) => (
                <AdminItemRow
                  key={item.itemId}
                  item={item}
                  busy={busyIds.has(item.itemId)}
                  canDelete={isAdmin}
                  onEdit={onEdit}
                  onToggleAvailability={onToggleAvailability}
                  onRecenter={onRecenter}
                  onGrant={onGrant}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {formMode && (
        <AvatarItemFormModal
          mode={formMode}
          onClose={() => setFormMode(null)}
          onSaved={onSavedFromModal}
        />
      )}

      {grantTarget && (
        <GrantItemModal
          item={grantTarget}
          onClose={() => setGrantTarget(null)}
          onSubmit={handleGrantSubmit}
        />
      )}
    </section>
  );
}

interface RowProps {
  item: AvatarItemDto;
  busy: boolean;
  canDelete: boolean;
  onEdit: (item: AvatarItemDto) => void;
  onToggleAvailability: (item: AvatarItemDto) => void;
  onRecenter: (item: AvatarItemDto) => void;
  onGrant: (item: AvatarItemDto) => void;
  onDelete: (item: AvatarItemDto) => void;
}

function AdminItemRow({ item, busy, canDelete, onEdit, onToggleAvailability, onRecenter, onGrant, onDelete }: RowProps) {
  const hasAsset = !!item.previewAssetUrl;
  const canRecenter = !!item.previewAssetUrl && /^https?:\/\//i.test(item.previewAssetUrl);
  const hasBounds =
    item.contentMinX != null && item.contentMinY != null
    && item.contentMaxX != null && item.contentMaxY != null;
  // 1x1 thumbnail bounds transform regardless of storage footprint.
  // Helmets bypass the bounded path and use a uniform transform — matches the inventory
  // grid's HAT slot treatment so helmet thumbs read consistently in the admin list.
  const isHelmet = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase().includes("helmet");
  const clientBounds = useClientBounds(
    item.previewAssetUrl ? assetPath(item.previewAssetUrl) : null,
  );
  const thumbTransform = hasAsset
    ? (isHelmet
        ? "scale(1.85) translateY(24%)"
        : boundsTransformFor(item, clientBounds, { cols: 1, rows: 1 }) ?? "scale(1.2)")
    : undefined;
  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        gap: 10,
        alignItems: "center",
        padding: "6px 8px",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border-hairline)",
        borderRadius: 2,
        opacity: busy ? 0.5 : 1,
      }}
    >
      <div
        style={{
          width: 80, height: 80,
          // Soft panel-coloured backdrop for PNG silhouette.
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid var(--color-border-hairline)",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasAsset ? (
          <Image
            src={assetPath(item.previewAssetUrl!)}
            alt=""
            width={160}
            height={160}
            unoptimized
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
              transform: thumbTransform,
              transformOrigin: "center",
            }}
          />
        ) : (
          <span style={{ color: "var(--color-fg-subtle)", fontSize: 10, letterSpacing: "0.1em" }}>—</span>
        )}
      </div>

      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "var(--color-fg)", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.name}
          <span style={{ marginLeft: 6, color: "var(--color-fg-subtle)", fontWeight: 400, fontSize: 10 }}>
            #{item.itemId}
          </span>
        </span>
        <span style={{ color: "var(--color-fg-subtle)", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {item.slot} · {item.rarity} · {item.cost}p
          {item.category ? <> · {item.category}</> : null}
          {/* Bounds status dot */}
          <span
            title={hasBounds ? "Content bounds stored" : "No content bounds — using slot default"}
            aria-hidden
            style={{
              display: "inline-block",
              marginLeft: 6,
              width: 6, height: 6,
              borderRadius: "50%",
              background: hasBounds ? "var(--color-success)" : "var(--color-fg-subtle)",
              opacity: hasBounds ? 0.85 : 0.4,
              verticalAlign: "middle",
            }}
          />
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <label
          title="Toggle availability"
          style={{
            display: "flex", alignItems: "center", gap: 4, cursor: busy ? "wait" : "pointer",
            color: item.isAvailable ? "var(--color-success)" : "var(--color-fg-subtle)",
            fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
          }}
        >
          <input
            type="checkbox"
            checked={item.isAvailable}
            disabled={busy}
            onChange={() => onToggleAvailability(item)}
            style={{ cursor: busy ? "wait" : "pointer" }}
          />
          {item.isAvailable ? "Live" : "Off"}
        </label>
        <button
          type="button"
          onClick={() => onEdit(item)}
          disabled={busy}
          title="Edit item metadata or replace image"
          style={iconBtnStyle}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onGrant(item)}
          disabled={busy}
          title="Grant this item to a user (defaults to you)"
          style={iconBtnStyle}
        >
          Grant
        </button>
        {canRecenter && (
          <button
            type="button"
            onClick={() => onRecenter(item)}
            disabled={busy}
            title="Re-scan PNG and store fresh content bounds so the inventory card auto-centres"
            style={iconBtnStyle}
          >
            Recenter
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={busy}
            title="Delete item (Admin only)"
            style={{ ...iconBtnStyle, color: "var(--color-danger)", borderColor: "var(--color-danger-border)" }}
          >
            Del
          </button>
        )}
      </div>
    </li>
  );
}

// Inline modal for the Grant action.
interface GrantModalProps {
  item: AvatarItemDto;
  onClose: () => void;
  onSubmit: (item: AvatarItemDto, targetEmail: string, autoEquip: boolean) => Promise<string | null>;
}

function GrantItemModal({ item, onClose, onSubmit }: GrantModalProps) {
  const [targetEmail, setTargetEmail] = useState("");
  const [autoEquip, setAutoEquip] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const err = await onSubmit(item, targetEmail, autoEquip);
    setSubmitting(false);
    if (err) setError(err);
    // Parent closes modal on success via setGrantTarget(null).
  }

  return (
    <div
      data-edge-drawer-block
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "var(--color-modal-overlay)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
    >
      <div
        className="w-full max-w-sm relative"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-border)",
          borderRadius: 6,
          boxShadow: "var(--shadow-popover)",
          padding: "20px 20px 16px",
        }}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{
            color: "var(--color-fg)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}>
            Grant Item
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
            style={{
              fontSize: 16, lineHeight: 1, color: "var(--color-fg-subtle)",
              background: "transparent", border: "none",
              cursor: submitting ? "wait" : "pointer", padding: 4,
            }}
          >×</button>
        </header>

        <p style={{
          color: "var(--color-fg-subtle)", fontSize: 11, lineHeight: 1.5, margin: "0 0 12px",
        }}>
          Granting <strong style={{ color: "var(--color-fg)" }}>{item.name}</strong>
          <span style={{ marginLeft: 4, fontSize: 10, color: "var(--color-fg-subtle)" }}>#{item.itemId}</span>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{
              color: "var(--color-fg-subtle)", fontSize: 9,
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
            }}>
              Target email (blank = grant to yourself)
            </span>
            <input
              type="email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              maxLength={100}
              placeholder="user@example.com"
              autoFocus
              className="themed-form-input"
            />
          </label>

          <label style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "var(--color-fg-muted)", fontSize: 10,
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500,
          }}>
            <input type="checkbox" checked={autoEquip} onChange={(e) => setAutoEquip(e.target.checked)} />
            Auto-equip after granting
          </label>

          {error && (
            <p role="alert" style={{
              color: "var(--color-danger)", fontSize: 11, lineHeight: 1.4,
              background: "var(--color-danger-bg)",
              border: "1px solid var(--color-danger-border)",
              padding: "6px 8px", borderRadius: 2,
            }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="button" onClick={onClose} disabled={submitting} style={{
              ...iconBtnStyle, padding: "6px 12px", fontSize: 10,
            }}>Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={submitting} style={{
              padding: "6px 14px",
              background: "var(--color-active-highlight-bg)",
              border: "1px solid var(--color-active-highlight-border)",
              color: "var(--color-active-highlight)",
              borderRadius: 2, fontSize: 10,
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700,
              cursor: submitting ? "wait" : "pointer",
            }}>{submitting ? "Granting…" : "Grant"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  padding: "3px 8px",
  background: "transparent",
  border: "1px solid var(--color-border-hairline)",
  color: "var(--color-fg-muted)",
  borderRadius: 2,
  fontSize: 9,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 600,
  cursor: "pointer",
};
