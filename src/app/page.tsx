"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, TaskFilterParams } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";

const PRIORITY_DOT: Record<string, string> = {
  high:   "#ef4444",
  medium: "#f59e0b",
  low:    "#22c55e",
};

const FILTERS = [
  { label: "All",         value: "all" },
  { label: "Pending",     value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed",   value: "completed" },
];

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterParams>({ pageSize: 50, pageNumber: 1 });
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setIsAuthenticated(!!localStorage.getItem("auth_token"));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      const { data, error } = await tasksApi.getAll(filters);
      setLoading(false);
      if (error) { setError(error); return; }
      setTasks(data!.data);
    }
    fetchTasks();
  }, [filters, isAuthenticated]);

  function applyFilter(value: string) {
    setActiveFilter(value);
    setFilters((f) => ({ ...f, status: value === "all" ? undefined : value, pageNumber: 1 }));
  }

  async function handleStart(id: string) {
    setStarting(id);
    const { error } = await tasksApi.start(id);
    setStarting(null);
    if (error) { setError(error); return; }
    setTasks((prev) =>
      prev.map((t) =>
        t.taskId === id ? { ...t, status: "in_progress" } : t
      )
    );
  }

  async function handleComplete(id: string) {
    setCompleting(id);
    const { error } = await tasksApi.complete(id);
    setCompleting(null);
    if (error) { setError(error); return; }
    setTasks((prev) =>
      prev.map((t) =>
        t.taskId === id ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t
      )
    );
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await tasksApi.delete(id);
    setDeleting(null);
    if (error) { setError(error); return; }
    setTasks((prev) => prev.filter((t) => t.taskId !== id));
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#252525" }}>
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4" style={{ background: "#252525" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest uppercase text-white mb-2">
            Wahaha Byte
          </h1>
          <p className="text-sm tracking-wide text-[#888]">
            Track tasks, earn points, stay on streak.
          </p>
        </div>

        <div
          className="w-full max-w-sm flex flex-col gap-3 p-8 rounded"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
        >
          <Link
            href="/login"
            className="w-full py-2.5 text-sm font-semibold tracking-wider uppercase rounded text-center transition-colors"
            style={{ background: "#1a3a4a", color: "#5bb8e0", border: "1px solid #1e5068" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e4d63")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a3a4a")}
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="w-full py-2.5 text-sm font-medium tracking-wide text-center rounded transition-colors"
            style={{ background: "transparent", color: "#aaa", border: "1px solid #333" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333")}
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen text-[#d0d0d0] flex flex-col" style={{ background: "#252525" }}>
      <div className="max-w-3xl w-full mx-auto px-4 py-8 flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold tracking-widest uppercase text-white">
            Tasks
          </h1>
          <button
            onClick={() => setShowNewTask(true)}
            className="text-xs tracking-widest uppercase px-4 py-2 font-semibold cursor-pointer transition-colors"
            style={{ background: "#1a3a4a", color: "#5bb8e0", border: "1px solid #1e5068" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e4d63")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a3a4a")}
          >
            + New
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex mb-2" style={{ borderBottom: "1px solid #333" }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => applyFilter(f.value)}
              className="px-4 py-3 text-xs tracking-wider uppercase cursor-pointer transition-colors relative"
              style={{
                color: activeFilter === f.value ? "#5bb8e0" : "#999",
                background: "transparent",
                border: "none",
              }}
            >
              {f.label}
              {activeFilter === f.value && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "#5bb8e0" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Column headers */}
        <div
          className="grid text-[10px] tracking-widest uppercase px-4 py-2 select-none"
          style={{
            gridTemplateColumns: "1fr auto auto auto",
            color: "#888",
          }}
        >
          <span>Name</span>
          <span className="w-20 text-center">Category</span>
          <span className="w-16 text-center">Due</span>
          <span className="w-20 text-right">Points</span>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 mb-2 text-xs text-red-400" style={{ background: "#1e1e1e" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <p className="text-sm text-[#777] tracking-widest uppercase">No items</p>
          </div>
        )}

        {/* Rows */}
        <div className="flex flex-col gap-1">
          {!loading && tasks.map((task) => {
            const isPending = task.status === "pending";
            const isInProgress = task.status === "in_progress";
            const isCompleted = task.status === "completed";
            const isHovered = hoveredId === task.taskId;
            const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "#888";

            return (
              <div
                key={task.taskId}
                onMouseEnter={() => setHoveredId(task.taskId)}
                onMouseLeave={() => setHoveredId(null)}
                className="grid items-center px-4 transition-colors"
                style={{
                  gridTemplateColumns: "1fr auto auto 120px",
                  background: isHovered ? "#1a3040" : "#1a1a1a",
                  borderLeft: isHovered ? "2px solid #5bb8e0" : "2px solid transparent",
                  opacity: isCompleted ? 0.45 : 1,
                  minHeight: "48px",
                }}
              >
                {/* Name + priority dot */}
                <div className="flex items-center gap-3 py-3 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: dot }}
                  />
                  <div className="min-w-0">
                    <p
                      className="text-sm truncate"
                      style={{
                        color: isCompleted ? "#666" : "#f0f0f0",
                        textDecoration: isCompleted ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] truncate mt-0.5" style={{ color: "#777" }}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="w-20 text-center">
                  <span className="text-[10px] tracking-wide uppercase" style={{ color: "#888" }}>
                    {task.category || "—"}
                  </span>
                </div>

                {/* Due date */}
                <div className="w-16 text-center">
                  <span className="text-[10px]" style={{ color: "#888" }}>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—"}
                  </span>
                </div>

                {/* Points + actions */}
                <div className="w-[120px] flex items-center justify-end gap-2">
                  {isHovered ? (
                    <>
                      {isPending && (
                        <button
                          onClick={() => handleStart(task.taskId)}
                          disabled={starting === task.taskId}
                          className="text-[10px] tracking-wider uppercase px-2 py-1 cursor-pointer transition-colors disabled:opacity-30"
                          style={{ color: "#5bb8e0", border: "1px solid #1e5068", background: "#0d1f28" }}
                        >
                          {starting === task.taskId ? "…" : "Start"}
                        </button>
                      )}
                      {isInProgress && (
                        <button
                          onClick={() => handleComplete(task.taskId)}
                          disabled={completing === task.taskId}
                          className="text-[10px] tracking-wider uppercase px-2 py-1 cursor-pointer transition-colors disabled:opacity-30"
                          style={{ color: "#5bb8e0", border: "1px solid #1e5068", background: "#0d1f28" }}
                        >
                          {completing === task.taskId ? "…" : "Complete"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(task.taskId)}
                        disabled={deleting === task.taskId}
                        className="text-[11px] px-2 py-1 cursor-pointer transition-colors"
                        style={{ color: "#6b3535", border: "1px solid #2e1a1a", background: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6b3535")}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1">
                      {/* Blue gem icon */}
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                        <polygon points="5,0 10,4 5,12 0,4" fill="#5bb8e0" opacity="0.9" />
                      </svg>
                      <span className="text-xs font-semibold" style={{ color: "#5bb8e0" }}>
                        {task.pointValue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>{/* end rows */}

        {/* Footer count */}
        {!loading && tasks.length > 0 && (
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[10px] text-[#777] tracking-widest uppercase">
              {tasks.filter((t) => t.status !== "completed").length} remaining
            </span>
            <span className="text-[10px] text-[#777] tracking-widest uppercase">
              {tasks.length} total
            </span>
          </div>
        )}
      </div>
    </div>

    {showNewTask && (
      <NewTaskModal
        onClose={() => setShowNewTask(false)}
        onCreated={(task) => {
          setTasks((prev) => [task, ...prev]);
          setShowNewTask(false);
        }}
      />
    )}
    </>
  );
}
