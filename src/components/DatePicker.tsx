"use client";

import { useState, useEffect, useRef } from "react";

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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCalendar) return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
        setShowYearSelect(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showCalendar]);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  const years = Array.from({ length: 6 }, (_, i) => yearPage + i + 1);

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => { setShowCalendar((v) => !v); setShowYearSelect(false); }}
        className="w-full px-3 py-2.5 sm:py-2 text-sm text-left cursor-pointer transition-colors"
        style={{
          background: "#1e1f22",
          color: value ? "#f0f0f0" : "rgba(255,255,255,0.2)",
          border: `1px solid ${showCalendar ? "#5bb8e0" : "#3a3b3f"}`,
          borderRadius: "3px",
        }}
      >
        {value
          ? value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Select a date"}
      </button>

      {showCalendar && (
        <div
          className="absolute top-full mt-1 left-0 right-0 z-20 p-3"
          style={{ background: "#1e1f22", border: "1px solid #3a3b3f", borderRadius: "3px", boxShadow: "0 8px 24px rgba(0,0,0,0.55)" }}
          onClick={() => setShowYearSelect(false)}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
              style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              ‹
            </button>
            <div className="flex space-x-2">
              <span className="text-[11px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                {MONTHS[calMonth]}
              </span>
              <span
                className="text-[11px] tracking-widest uppercase cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setShowYearSelect((v) => !v); }}
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#5bb8e0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
              >
                {calYear}
              </span>
            </div>
            <button
              onClick={nextMonth}
              className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
              style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              ›
            </button>
          </div>

          {showYearSelect && (
            <div
              className="absolute inset-x-3 top-3 z-30 p-3"
              style={{ background: "#1e1f22", border: "1px solid #3a3b3f", borderRadius: "3px", boxShadow: "0 8px 24px rgba(0,0,0,0.55)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setYearPage((y) => y - 6)}
                  disabled={yearPage <= today.getFullYear() - 6}
                  className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm disabled:opacity-30"
                  style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
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
                          color: isSelected ? "#0d1f28" : isCurrentYear ? "#5bb8e0" : "rgba(255,255,255,0.55)",
                          background: isSelected ? "#5bb8e0" : "transparent",
                          fontWeight: isSelected || isCurrentYear ? 600 : 400,
                          borderRadius: "2px",
                          border: "none",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.color = isCurrentYear ? "#5bb8e0" : "rgba(255,255,255,0.55)"; }}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setYearPage((y) => y + 6)}
                  className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                  style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >
                  ›
                </button>
              </div>
              <button
                onClick={() => setYearPage(today.getFullYear() - 1)}
                disabled={yearPage === today.getFullYear() - 1}
                className="mt-2 w-full text-[9px] tracking-widest uppercase transition-colors cursor-pointer py-1 disabled:opacity-30 disabled:cursor-default"
                style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
                onMouseEnter={(e) => { if (yearPage !== today.getFullYear() - 1) e.currentTarget.style.color = "#5bb8e0"; }}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                Today
              </button>
            </div>
          )}

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <span key={d} className="text-center text-[9px] tracking-wider uppercase py-1.5 sm:py-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
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
                    color: day === null ? "transparent" : isPast ? "rgba(255,255,255,0.18)" : isSelected ? "#0d1f28" : isToday ? "#5bb8e0" : "rgba(255,255,255,0.55)",
                    background: isSelected ? "#5bb8e0" : "transparent",
                    fontWeight: isSelected || isToday ? 600 : 400,
                    borderRadius: "2px",
                    border: "none",
                  }}
                  onMouseEnter={(e) => { if (day && !isSelected && !isPast) e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { if (day && !isSelected && !isPast) e.currentTarget.style.color = isToday ? "#5bb8e0" : "rgba(255,255,255,0.55)"; }}
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
              style={{ color: "rgba(255,255,255,0.25)", background: "transparent", border: "none" } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
