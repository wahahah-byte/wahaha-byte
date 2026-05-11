"use client";

import { useEffect, useRef, useState } from "react";
import type { Subtask } from "@/lib/api/tasks";

export interface SubtaskUpdateFields {
  title?: string;
  setsTarget?: number | null;
  repsTarget?: number | null;
}

type Props = {
  subtask: Subtask;
  // When true, the row renders as a read-only display: no toggle, delete,
  // swipe, inline edit, or set increment. Used while the parent task's
  // current cycle is locked (e.g. after a recurring check-in) so the
  // per-cycle subtask state stays frozen until the next cycle.
  readOnly?: boolean;
  // Gates the sets×reps editor inputs and the counter display. Only Fitness
  // tasks expose sets/reps; for every other category we hide that UI even
  // if legacy data has setsTarget populated.
  showSetsReps?: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onIncrementSet?: () => void;
  onUpdate?: (fields: SubtaskUpdateFields) => void;
};

const COMMIT_THRESHOLD = 80;
const MAX_DRAG = 160;

export default function SubtaskRow({ subtask, readOnly, showSetsReps, onToggle, onDelete, onIncrementSet, onUpdate }: Props) {
  const [dragX, setDragX] = useState(0);
  const swipeRef = useRef<{ startX: number; startY: number; locked: "h" | "v" | null } | null>(null);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);
  const [editSets, setEditSets] = useState(subtask.setsTarget != null ? String(subtask.setsTarget) : "");
  const [editReps, setEditReps] = useState(subtask.repsTarget != null ? String(subtask.repsTarget) : "");
  const titleInputRef = useRef<HTMLInputElement>(null);
  // Skip the next blur-commit when the user pressed Enter or Escape (those
  // already settled the field and stole focus from the input).
  const skipNextBlurRef = useRef(false);

  useEffect(() => {
    if (editing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editing]);

  function startEdit() {
    if (!onUpdate || subtask.completed || readOnly) return;
    setEditTitle(subtask.title);
    setEditSets(subtask.setsTarget != null ? String(subtask.setsTarget) : "");
    setEditReps(subtask.repsTarget != null ? String(subtask.repsTarget) : "");
    setEditing(true);
  }

  function cancelEdit() {
    skipNextBlurRef.current = true;
    setEditing(false);
  }

  function commitEdit() {
    if (!onUpdate) { setEditing(false); return; }
    const trimmed = editTitle.trim();
    const fields: SubtaskUpdateFields = {};
    if (trimmed && trimmed !== subtask.title) fields.title = trimmed;
    const sets = editSets.trim() ? Number(editSets) : NaN;
    const nextSets = Number.isFinite(sets) && sets > 0 ? sets : null;
    if (nextSets !== (subtask.setsTarget ?? null)) fields.setsTarget = nextSets;
    const reps = editReps.trim() ? Number(editReps) : NaN;
    const nextReps = Number.isFinite(reps) && reps > 0 ? reps : null;
    if (nextReps !== (subtask.repsTarget ?? null)) fields.repsTarget = nextReps;
    if (Object.keys(fields).length > 0) onUpdate(fields);
    setEditing(false);
  }

  function onTouchStart(e: React.TouchEvent) {
    if (editing || readOnly) return;
    const t = e.touches[0];
    swipeRef.current = { startX: t.clientX, startY: t.clientY, locked: null };
  }

  function onTouchMove(e: React.TouchEvent) {
    const s = swipeRef.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.startX;
    const dy = t.clientY - s.startY;
    if (s.locked === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      s.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (s.locked === "h") {
      // Only allow left swipe (delete direction). Right swipe is ignored.
      const leftAmount = Math.max(0, -dx);
      const damped = leftAmount <= COMMIT_THRESHOLD
        ? leftAmount
        : COMMIT_THRESHOLD + (leftAmount - COMMIT_THRESHOLD) * 0.4;
      setDragX(Math.min(damped, MAX_DRAG));
    }
  }

  function onTouchEnd() {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s || s.locked !== "h") {
      setDragX(0);
      return;
    }
    if (dragX >= COMMIT_THRESHOLD) {
      // Commit: parent will remove this row from the list. We don't snap back.
      onDelete();
      // In the rare rollback case, the row remounts fresh with dragX = 0.
    } else {
      setDragX(0);
    }
  }

  const ready = dragX >= COMMIT_THRESHOLD;

  return (
    <div className="relative overflow-hidden" style={{ borderRadius: 2 }}>
      {/* Red delete action behind the row, revealed by the swipe */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 flex items-center justify-end"
        style={{
          width: Math.max(dragX, 0),
          paddingRight: 14,
          background: ready ? "rgba(239,68,68,0.9)" : "rgba(239,68,68,0.55)",
          color: "white",
          transition: dragX === 0 ? "width 0.18s cubic-bezier(0.2,0,0,1), background 0.12s" : "background 0.12s",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {dragX > 28 && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3V2.2h4V3" />
            <line x1="2" y1="3.5" x2="12" y2="3.5" />
            <path d="M3.5 4l0.7 7.5h5.6L10.5 4" fill="none" />
            <line x1="6" y1="6" x2="6" y2="10" />
            <line x1="8" y1="6" x2="8" y2="10" />
          </svg>
        )}
      </div>

      {/* Foreground row content */}
      <div
        className="flex items-center gap-2"
        style={{
          position: "relative",
          background: "var(--color-panel)",
          transform: dragX > 0 ? `translateX(-${dragX}px)` : undefined,
          transition: dragX === 0 ? "transform 0.18s cubic-bezier(0.2,0,0,1)" : "none",
          touchAction: "pan-y",
          willChange: dragX > 0 ? "transform" : undefined,
          padding: "2px 0",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <button
          onClick={readOnly ? undefined : onToggle}
          disabled={readOnly}
          className="w-6 h-6 flex-shrink-0 flex items-center justify-center"
          style={{ background: "transparent", border: "none", cursor: readOnly ? "default" : "pointer", opacity: readOnly ? 0.7 : 1 }}
          aria-label={subtask.completed ? "Uncheck subtask" : "Check subtask"}
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: 14, height: 14,
              border: `1px solid ${subtask.completed ? "var(--color-success)" : "var(--color-border)"}`,
              borderRadius: 2,
              background: subtask.completed ? "rgba(74,222,128,0.12)" : "transparent",
            }}
          >
            {subtask.completed && (
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <polyline points="1,3 3,5 7,1" style={{ stroke: "var(--color-success)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </button>

        {editing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); skipNextBlurRef.current = true; commitEdit(); }
              else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
            }}
            onBlur={() => {
              if (skipNextBlurRef.current) { skipNextBlurRef.current = false; return; }
              commitEdit();
            }}
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: "var(--color-fg)", border: "none", padding: "2px 0", minWidth: 0 }}
          />
        ) : (
          <span
            onClick={onUpdate ? startEdit : undefined}
            className="flex-1 text-xs select-none"
            style={{
              color: subtask.completed ? "var(--color-fg-muted)" : "var(--color-fg)",
              textDecoration: subtask.completed ? "line-through" : "none",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: onUpdate && !subtask.completed ? "text" : "default",
            }}
          >
            {subtask.title}
          </span>
        )}

        {editing && showSetsReps ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={editSets}
              onChange={(e) => setEditSets(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); skipNextBlurRef.current = true; commitEdit(); }
                else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
              }}
              onBlur={() => {
                if (skipNextBlurRef.current) { skipNextBlurRef.current = false; return; }
                commitEdit();
              }}
              placeholder="sets"
              aria-label="Sets"
              className="num-input-themed"
            />
            <span style={{ color: "var(--color-fg-subtle)", fontSize: 10, fontWeight: 600 }}>×</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={editReps}
              onChange={(e) => setEditReps(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); skipNextBlurRef.current = true; commitEdit(); }
                else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
              }}
              onBlur={() => {
                if (skipNextBlurRef.current) { skipNextBlurRef.current = false; return; }
                commitEdit();
              }}
              placeholder="reps"
              aria-label="Reps"
              className="num-input-themed"
            />
          </div>
        ) : !editing && showSetsReps && subtask.setsTarget != null && subtask.setsTarget > 0 && (() => {
          const done = subtask.setsCompleted ?? 0;
          const target = subtask.setsTarget!;
          const reps = subtask.repsTarget;
          const reached = done >= target;
          return (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                onClick={onUpdate && !subtask.completed ? startEdit : undefined}
                style={{
                  fontSize: 10,
                  color: reached ? "var(--color-success)" : "var(--color-fg-muted)",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: onUpdate && !subtask.completed ? "text" : "default",
                }}
              >
                {done}/{target}
                {reps != null && reps > 0 && (
                  <span style={{ color: "var(--color-fg-subtle)", fontWeight: 400, marginLeft: 4 }}>
                    × {reps}
                  </span>
                )}
              </span>
              {!reached && onIncrementSet && !readOnly && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onIncrementSet(); }}
                  className="goal-stepper-btn"
                  style={{
                    width: 22,
                    height: 22,
                    border: "1px solid var(--color-border-hairline)",
                    borderRadius: 3,
                    background: "var(--color-input)",
                    color: "var(--color-fg-muted)",
                    fontSize: 13,
                    lineHeight: 1,
                    fontWeight: 600,
                  }}
                  aria-label="Mark one set complete"
                >
                  +
                </button>
              )}
            </div>
          );
        })()}

        {!editing && !readOnly && (
          <button
            onClick={onDelete}
            className="flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
            style={{
              width: 32, height: 32,
              background: "transparent",
              border: "none",
              color: "var(--color-fg-subtle)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-danger)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
            aria-label="Delete subtask"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3V2.2h4V3" />
              <line x1="2" y1="3.5" x2="12" y2="3.5" />
              <path d="M3.5 4l0.7 7.5h5.6L10.5 4" fill="none" />
              <line x1="6" y1="6" x2="6" y2="10" />
              <line x1="8" y1="6" x2="8" y2="10" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
