"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [showCalendar, setShowCalendar] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [calMonth, setCalMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [calYear, setCalYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [yearPage, setYearPage] = useState(today.getFullYear() - 1);
  const [isMobile, setIsMobile] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [sheetDragY, setSheetDragY] = useState(0);
  const [slideDir, setSlideDir] = useState<"from-left" | "from-right" | null>(null);
  const [pendingValue, setPendingValue] = useState<Date | null>(value);

  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{ startX: number; startY: number; locked: "h" | "v" | null } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!showCalendar) return;
    function handleOutside(e: MouseEvent) {
      const inTrigger = containerRef.current?.contains(e.target as Node);
      const inSheet = sheetRef.current?.contains(e.target as Node);
      if (!inTrigger && !inSheet) {
        setShowCalendar(false);
        setShowYearSelect(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showCalendar]);

  useEffect(() => {
    if (!showCalendar || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showCalendar, isMobile]);

  useEffect(() => {
    if (showCalendar) setPendingValue(value);
  }, [showCalendar, value]);

  function prevMonth() {
    setSlideDir("from-left");
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    setSlideDir("from-right");
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  function onSwipeStart(e: React.TouchEvent) {
    if (showYearSelect) return;
    const t = e.touches[0];
    swipeRef.current = { startX: t.clientX, startY: t.clientY, locked: null };
    setDragX(0);
    setSheetDragY(0);
  }
  function onSwipeMove(e: React.TouchEvent) {
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
      const damped = Math.sign(dx) * Math.min(Math.abs(dx), 140);
      setDragX(damped);
    } else if (s.locked === "v") {
      setSheetDragY(dy > 0 ? dy : dy / 4);
    }
  }
  function onSwipeEnd() {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s) { setDragX(0); setSheetDragY(0); return; }
    if (s.locked === "h") {
      const final = dragX;
      setDragX(0);
      const threshold = 50;
      if (final < -threshold) { setSlideDir("from-right"); nextMonth(); }
      else if (final > threshold) { setSlideDir("from-left"); prevMonth(); }
    } else if (s.locked === "v") {
      const final = sheetDragY;
      const threshold = 90;
      if (final > threshold) {
        onChange(pendingValue);
        setShowCalendar(false);
        setShowYearSelect(false);
      }
      setSheetDragY(0);
    } else {
      setDragX(0);
      setSheetDragY(0);
    }
  }

  const years = Array.from({ length: 6 }, (_, i) => yearPage + i + 1);

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length < 42) cells.push(null);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => { setShowCalendar((v) => !v); setShowYearSelect(false); }}
        className="w-full px-3 py-2.5 sm:py-2 text-sm text-left cursor-pointer transition-colors"
        style={{
          background: "var(--color-input)",
          color: value ? "var(--color-input-fg)" : "var(--color-fg-subtle)",
          border: `1px solid ${showCalendar ? "var(--color-active-highlight)" : "var(--color-border)"}`,
          borderRadius: "3px",
        }}
      >
        {value
          ? value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Select a date"}
      </button>

      {showCalendar && !isMobile && (
        <div
          className="absolute top-full mt-1 left-0 right-0 z-20 p-3"
          style={{ background: "var(--color-input)", border: "1px solid var(--color-border)", borderRadius: "3px", boxShadow: "var(--shadow-popover)" }}
          onClick={() => setShowYearSelect(false)}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
              style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
            >
              ‹
            </button>
            <div className="flex space-x-2">
              <span className="text-[11px] tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                {MONTHS[calMonth]}
              </span>
              <span
                className="text-[11px] tracking-widest uppercase cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setShowYearSelect((v) => !v); }}
                style={{ color: "var(--color-fg-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-active-highlight)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-fg-muted)"; }}
              >
                {calYear}
              </span>
            </div>
            <button
              onClick={nextMonth}
              className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
              style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
            >
              ›
            </button>
          </div>

          {showYearSelect && (
            <div
              className="absolute inset-x-3 top-3 z-30 p-3"
              style={{ background: "var(--color-input)", border: "1px solid var(--color-border)", borderRadius: "3px", boxShadow: "var(--shadow-popover)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setYearPage((y) => y - 6)}
                  disabled={yearPage <= today.getFullYear() - 6}
                  className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm disabled:opacity-30"
                  style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
                >
                  ‹
                </button>
                <div className="grid grid-cols-3 grid-rows-2 gap-y-0.5">
                  {years.map((yr, i) => {
                    const isSelected = value !== null && value.getFullYear() === yr;
                    const isCurrentYear = today.getFullYear() === yr;
                    return (
                      <button
                        key={i}
                        onClick={() => { setCalYear(yr); setShowYearSelect(false); }}
                        className="text-center py-2 px-2 text-[11px] transition-colors cursor-pointer"
                        style={{
                          color: isSelected || isCurrentYear ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                          background: "transparent",
                          fontWeight: isSelected || isCurrentYear ? 600 : 400,
                          borderRadius: "2px",
                          border: "none",
                          boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.color = "var(--color-fg)"; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.color = isCurrentYear ? "var(--color-active-highlight)" : "var(--color-fg-muted)"; }}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setYearPage((y) => y + 6)}
                  className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                  style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
                >
                  ›
                </button>
              </div>
              <button
                onClick={() => setYearPage(today.getFullYear() - 1)}
                disabled={yearPage === today.getFullYear() - 1}
                className="mt-2 w-full text-[9px] tracking-widest uppercase transition-colors cursor-pointer py-1 disabled:opacity-30 disabled:cursor-default"
                style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                onMouseEnter={(e) => { if (yearPage !== today.getFullYear() - 1) e.currentTarget.style.color = "var(--color-active-highlight)"; }}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
              >
                Today
              </button>
            </div>
          )}

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <span key={d} className="text-center text-[9px] tracking-wider uppercase py-1.5 sm:py-0.5" style={{ color: "var(--color-fg-subtle)" }}>
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              const isPast = day !== null && new Date(calYear, calMonth, day) < todayMidnight;
              const isSelected =
                day !== null && value !== null &&
                value.getDate() === day &&
                value.getMonth() === calMonth &&
                value.getFullYear() === calYear;
              const isToday =
                day !== null &&
                today.getDate() === day &&
                today.getMonth() === calMonth &&
                today.getFullYear() === calYear;

              return (
                <button
                  key={i}
                  disabled={day === null || isPast}
                  onClick={() => {
                    if (!day) return;
                    onChange(new Date(calYear, calMonth, day));
                    setShowCalendar(false);
                    setShowYearSelect(false);
                  }}
                  className="text-center py-2 sm:py-1 text-xs sm:text-[11px] transition-colors cursor-pointer disabled:pointer-events-none"
                  style={{
                    color: day === null ? "transparent" : isPast ? "var(--color-fg-subtle)" : isSelected || isToday ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                    background: "transparent",
                    fontWeight: isSelected || isToday ? 600 : 400,
                    borderRadius: "2px",
                    border: "none",
                    boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none",
                  }}
                  onMouseEnter={(e) => { if (day && !isSelected && !isPast) e.currentTarget.style.color = "var(--color-fg)"; }}
                  onMouseLeave={(e) => { if (day && !isSelected && !isPast) e.currentTarget.style.color = isToday ? "var(--color-active-highlight)" : "var(--color-fg-muted)"; }}
                >
                  {day ?? ""}
                </button>
              );
            })}
          </div>

          {value && (
            <button
              onClick={() => { onChange(null); setShowCalendar(false); setShowYearSelect(false); }}
              className="mt-2 w-full text-[9px] tracking-widest uppercase transition-colors cursor-pointer py-1"
              style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {showCalendar && isMobile && typeof document !== "undefined" && createPortal(
        <>
          <div
            className="fixed inset-0"
            style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: 60 }}
            onClick={() => { setShowCalendar(false); setShowYearSelect(false); }}
          />
          <div
            ref={sheetRef}
            className="fixed left-0 right-0 p-3"
            style={{
              bottom: 0,
              paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
              background: "var(--color-input)",
              borderTop: "1px solid var(--color-border)",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)",
              zIndex: 61,
              animation: sheetDragY === 0 ? "datepicker-sheet-in 0.18s cubic-bezier(0.2, 0, 0, 1)" : undefined,
              transform: sheetDragY !== 0 ? `translateY(${sheetDragY}px)` : undefined,
              transition: sheetDragY === 0 ? "transform 0.22s cubic-bezier(0.2, 0, 0, 1)" : "none",
              touchAction: "none",
              willChange: sheetDragY !== 0 ? "transform" : undefined,
            }}
            onClick={() => setShowYearSelect(false)}
            onTouchStart={onSwipeStart}
            onTouchMove={onSwipeMove}
            onTouchEnd={onSwipeEnd}
            onTouchCancel={onSwipeEnd}
          >
            <div
              className="mx-auto mb-3"
              style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 flex items-center justify-center cursor-pointer text-base"
                  style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                >
                  ‹
                </button>
                <div className="flex space-x-2">
                  <span className="text-[11px] tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                    {MONTHS[calMonth]}
                  </span>
                  <span
                    className="text-[11px] tracking-widest uppercase cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setShowYearSelect((v) => !v); }}
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {calYear}
                  </span>
                </div>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 flex items-center justify-center cursor-pointer text-base"
                  style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                >
                  ›
                </button>
              </div>

              {showYearSelect && (
                <div
                  className="absolute inset-x-0 top-0 z-30 p-3"
                  style={{ background: "var(--color-input)", border: "1px solid var(--color-border)", borderRadius: "3px", boxShadow: "var(--shadow-popover)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setYearPage((y) => y - 6)}
                      disabled={yearPage <= today.getFullYear() - 6}
                      className="w-8 h-8 flex items-center justify-center cursor-pointer text-sm disabled:opacity-30"
                      style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                    >
                      ‹
                    </button>
                    <div className="grid grid-cols-3 grid-rows-2 gap-y-0.5">
                      {years.map((yr, i) => {
                        const isSelected = value !== null && value.getFullYear() === yr;
                        const isCurrentYear = today.getFullYear() === yr;
                        return (
                          <button
                            key={i}
                            onClick={() => { setCalYear(yr); setShowYearSelect(false); }}
                            className="text-center py-2 px-3 text-[12px] cursor-pointer"
                            style={{
                              color: isSelected || isCurrentYear ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                              background: "transparent",
                              fontWeight: isSelected || isCurrentYear ? 600 : 400,
                              borderRadius: "2px",
                              border: "none",
                              boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none",
                            }}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setYearPage((y) => y + 6)}
                      className="w-8 h-8 flex items-center justify-center cursor-pointer text-sm"
                      style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                    >
                      ›
                    </button>
                  </div>
                  <button
                    onClick={() => setYearPage(today.getFullYear() - 1)}
                    disabled={yearPage === today.getFullYear() - 1}
                    className="mt-2 w-full text-[9px] tracking-widest uppercase cursor-pointer py-2 disabled:opacity-30 disabled:cursor-default"
                    style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "none" }}
                  >
                    Today
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <div
                key={`${calYear}-${calMonth}`}
                className={slideDir === "from-right" ? "datepicker-slide-from-right" : slideDir === "from-left" ? "datepicker-slide-from-left" : ""}
                style={{
                  transform: dragX !== 0 ? `translateX(${dragX}px)` : undefined,
                  transition: dragX === 0 ? "transform 0.18s cubic-bezier(0.2, 0, 0, 1)" : "none",
                  willChange: "transform",
                }}
              >
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <span key={d} className="text-center text-[10px] tracking-wider uppercase py-1.5" style={{ color: "var(--color-fg-subtle)" }}>
                      {d}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1">
                  {cells.map((day, i) => {
                    const isPast = day !== null && new Date(calYear, calMonth, day) < todayMidnight;
                    const isSelected =
                      day !== null && pendingValue !== null &&
                      pendingValue.getDate() === day &&
                      pendingValue.getMonth() === calMonth &&
                      pendingValue.getFullYear() === calYear;
                    const isToday =
                      day !== null &&
                      today.getDate() === day &&
                      today.getMonth() === calMonth &&
                      today.getFullYear() === calYear;

                    return (
                      <button
                        key={i}
                        disabled={day === null || isPast}
                        onClick={() => {
                          if (!day) return;
                          setPendingValue(new Date(calYear, calMonth, day));
                        }}
                        className="text-center text-[13px] cursor-pointer disabled:pointer-events-none mx-auto flex items-center justify-center"
                        style={{
                          width: 38,
                          height: 38,
                          color: day === null ? "transparent" : isPast ? "var(--color-fg-subtle)" : isSelected ? "var(--color-active-highlight)" : isToday ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                          background: isSelected ? "var(--color-active-highlight-bg)" : "transparent",
                          fontWeight: isSelected || isToday ? 600 : 400,
                          borderRadius: "2px",
                          border: "none",
                          boxShadow: isSelected ? "inset 0 0 0 1px var(--color-active-highlight)" : "none",
                        }}
                      >
                        {day ?? ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {pendingValue && (
                <button
                  onClick={() => { onChange(null); setPendingValue(null); setShowCalendar(false); setShowYearSelect(false); }}
                  className="flex-1 text-[10px] tracking-widest uppercase cursor-pointer py-3"
                  style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "3px" }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => { onChange(pendingValue); setShowCalendar(false); setShowYearSelect(false); }}
                className="flex-1 text-[10px] tracking-widest uppercase cursor-pointer py-3"
                style={{ color: "var(--color-fg)", background: "var(--color-active-highlight-bg)", border: "1px solid var(--color-active-highlight-border)", borderRadius: "3px" }}
              >
                Done
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
