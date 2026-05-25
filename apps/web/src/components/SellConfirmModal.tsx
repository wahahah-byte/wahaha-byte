"use client";

import Image from "next/image";
import { useEffect } from "react";
import { assetPath } from "@/lib/assetPath";
import type { UserInventoryDto } from "@/lib/api/avatar";

interface Props {
  // Inventory row being sold; null while closed.
  inv: UserInventoryDto | null;
  // Refund amount the parent has already computed (floor(cost * SELL_RATIO)).
  refundPoints: number;
  // True while the parent's sell request is in flight — disables actions to prevent double-fire.
  busy: boolean;
  onSell: () => void;
  onCancel: () => void;
}

// Confirmation modal for selling an avatar inventory item. Mirrors the mobile
// InventoryItemMenu sheet — item name, slot · category, refund pill, Sell + Cancel.
// 50% refund matches SellInventoryHandler.SellRefundRatio on the backend.
export default function SellConfirmModal({ inv, refundPoints, busy, onSell, onCancel }: Props) {
  // Escape closes the dialog (unless mid-request).
  useEffect(() => {
    if (!inv) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [inv, busy, onCancel]);

  if (!inv?.avatarItem) return null;
  const item = inv.avatarItem;
  const preview = item.previewAssetUrl ? assetPath(item.previewAssetUrl) : null;

  return (
    <div
      data-edge-drawer-block
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="w-full max-w-sm p-6 flex flex-col gap-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid rgba(239,68,68,0.45)",
          borderRadius: "4px",
          boxShadow: "var(--shadow-popover)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sell-modal-title"
      >
        {/* Header — uppercase eyebrow + item name. */}
        <div className="flex items-center gap-3">
          {preview && (
            <div
              style={{
                width: 56,
                height: 56,
                background: "rgba(28,30,32,0.85)",
                border: "1px solid rgba(220,230,235,0.45)",
                borderRadius: 2,
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src={preview}
                alt=""
                fill
                unoptimized
                draggable={false}
                style={{ objectFit: "contain", imageRendering: "pixelated" }}
              />
            </div>
          )}
          <div className="flex flex-col gap-0.5 min-w-0">
            <p
              className="text-[9px] font-semibold"
              style={{
                color: "var(--color-fg-subtle)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Sell Item
            </p>
            <p
              id="sell-modal-title"
              className="text-sm font-semibold truncate"
              style={{ color: "var(--color-fg)" }}
            >
              {item.name}
            </p>
            <p
              className="text-[10px]"
              style={{
                color: "var(--color-fg-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {item.slot}
              {item.category ? ` · ${item.category}` : ""}
            </p>
          </div>
        </div>

        {/* Refund row — large positive pill on a danger-tinted card. */}
        <div
          className="flex items-center gap-3 px-3 py-3"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.45)",
            borderRadius: 3,
          }}
        >
          <div className="flex-1">
            <p className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>
              Refund
            </p>
            <p
              className="text-[11px] leading-snug mt-0.5"
              style={{ color: "var(--color-fg-muted)" }}
            >
              Removes the item from your inventory. Can&apos;t be undone — re-buy from the shop.
            </p>
          </div>
          <p
            className="text-base font-bold whitespace-nowrap"
            style={{ color: "var(--color-danger)", letterSpacing: "0.02em" }}
          >
            +{refundPoints.toLocaleString()}P
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: "var(--color-fg-muted)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: 3,
            }}
            onMouseEnter={(e) => {
              if (!busy) {
                e.currentTarget.style.borderColor = "var(--color-button-border)";
                e.currentTarget.style.color = "var(--color-fg)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-fg-muted)";
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSell}
            disabled={busy}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-wait"
            style={{
              color: "var(--color-danger)",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.45)",
              borderRadius: 3,
            }}
            onMouseEnter={(e) => {
              if (!busy) e.currentTarget.style.background = "rgba(239,68,68,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            }}
          >
            {busy ? "Selling…" : `Sell (+${refundPoints.toLocaleString()}P)`}
          </button>
        </div>
      </div>
    </div>
  );
}
