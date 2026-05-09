"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { tasksApi, TaskDto } from "@/lib/api/tasks";
import TaskRow from "@/components/TaskRow";
import { useToast } from "@/context/ToastContext";
import { MOCK_TASKS } from "@/lib/mockTasks";
import DesktopShell from "@/components/DesktopShell";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useDesktopLayout } from "@/hooks/useDesktopLayout";
import { NavIconList, NavIconRepeat, NavIconArchive } from "@/components/NavIcons";

const PAGE_SIZE = 25;

export default function ArchivePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isDesktop = useDesktopLayout();
  const { setError } = useToast();

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = tasks.length < totalCount;

  useEffect(() => {
    setIsMounted(true);
    const hasToken = !!localStorage.getItem("auth_token");
    setIsAuthenticated(hasToken);
    if (!hasToken) {
      const archived = MOCK_TASKS.filter((t) => t.isArchived);
      setTasks(archived);
      setTotalCount(archived.length);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    async function fetchFirstPage() {
      setLoading(true);
      setError(null);
      const { data, error } = await tasksApi.getAll({
        pageSize: PAGE_SIZE,
        pageNumber: 1,
        isArchived: true,
      });
      if (cancelled) return;
      setLoading(false);
      if (error) { setError(error); return; }
      setTasks(data!.data);
      setTotalCount(data!.totalCount);
      setPageNumber(1);
    }
    fetchFirstPage();
    return () => { cancelled = true; };
  }, [isAuthenticated, setError]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore || !isAuthenticated) return;
    setLoadingMore(true);
    const next = pageNumber + 1;
    const { data, error } = await tasksApi.getAll({
      pageSize: PAGE_SIZE,
      pageNumber: next,
      isArchived: true,
    });
    setLoadingMore(false);
    if (error) { setError(error); return; }
    setTasks((prev) => [...prev, ...data!.data]);
    setPageNumber(next);
  }, [loadingMore, loading, hasMore, isAuthenticated, pageNumber, setError]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "200px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [hasMore, loadMore]);

  async function handleUnarchive(task: TaskDto) {
    const snapshot = task;
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    setTotalCount((c) => Math.max(0, c - 1));
    if (!isAuthenticated) return;
    const { error } = await tasksApi.unarchive(task.taskId);
    if (error) {
      setTasks((prev) => [snapshot, ...prev]);
      setTotalCount((c) => c + 1);
      setError(error);
    }
  }

  async function handleDelete(id: string) {
    const snapshot = tasks.find((t) => t.taskId === id);
    setTasks((prev) => prev.filter((t) => t.taskId !== id));
    setTotalCount((c) => Math.max(0, c - 1));
    if (!isAuthenticated) return;
    const { error } = await tasksApi.delete(id);
    if (error) {
      if (snapshot) setTasks((prev) => [snapshot, ...prev]);
      setTotalCount((c) => c + 1);
      setError(error);
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
      </div>
    );
  }

  const noopSet = new Set<string>();

  const mainContent = (
    <div className="task-page-shell flex flex-col bg-scanlines overflow-hidden" style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}>
      <div className="w-full mx-auto px-3 sm:px-4 flex flex-col flex-1 overflow-hidden" style={{ maxWidth: 420 }}>
        {!isAuthenticated && (
          <div className="flex items-center justify-between mt-3 mb-3 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "var(--color-active-highlight-bg)", border: "1px solid var(--color-active-highlight-border)", borderRadius: "3px" }}>
            <span style={{ color: "var(--color-active-highlight)", opacity: 0.85 }}>Demo · changes are not saved</span>
            <Link href="/login" style={{ color: "var(--color-active-highlight)", letterSpacing: "0.18em", fontWeight: 600 }}>Sign in →</Link>
          </div>
        )}

        <div style={{ paddingTop: 22, background: "var(--color-bg)" }}>
          <div className="archive-page-banner" style={{ display: "flex", alignItems: "stretch", background: "var(--color-surface)", marginBottom: "22px", height: "38px" }}>
            <div style={{ width: "38px", minWidth: "38px", height: "38px", background: "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid var(--color-border-hairline)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-fg)" }}>
                <rect x="3" y="4" width="18" height="4" rx="1" />
                <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", paddingLeft: "14px", overflow: "hidden" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-fg)", whiteSpace: "nowrap", position: "relative", zIndex: 1 }}>Archive</span>
              <div style={{
                position: "absolute", left: "94px", top: 0, width: "160px", height: "100%",
                background: "repeating-linear-gradient(-60deg, transparent, transparent 4px, var(--color-border-hairline) 4px, var(--color-border-hairline) 8px)",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
              }} />
            </div>
            <div style={{ flex: 1 }} />
          </div>

          <div
            className="grid text-[9px] tracking-widest uppercase px-4 py-2 select-none"
            style={{ gridTemplateColumns: "1fr 64px 80px", color: "var(--color-fg-subtle)", background: "var(--color-bg)" }}
          >
            <span>Name</span>
            <span />
            <span />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>Nothing archived yet</p>
              <p className="text-[10px] tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)", opacity: 0.6 }}>Completed tasks move here after 30 days</p>
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="flex flex-col" style={{ background: "var(--color-surface-deep)", border: "1px solid var(--color-border-soft)", borderRadius: 6, overflow: "hidden" }}>
              <div className="task-row-wrapper task-row-phantom" aria-hidden="true">
                <div className="task-row-inner" style={{ position: "absolute", inset: 0 }} />
              </div>
              {tasks.map((task) => (
                <TaskRow
                  key={task.taskId}
                  task={task}
                  activeFilter="completed"
                  advancing={null}
                  pausing={null}
                  slashingId={null}
                  filingIds={noopSet}
                  recentlyFiledIds={noopSet}
                  selectedIds={noopSet}
                  submittedTaskIds={noopSet}
                  recurringPopup={undefined}
                  onAdvance={() => {}}
                  onCheckIn={() => {}}
                  onPause={() => {}}
                  onDelete={handleDelete}
                  onSkip={() => {}}
                  onToggleSelect={() => {}}
                  onOpenDetail={() => {}}
                  onUnarchive={handleUnarchive}
                  onSubtasksChange={(taskId, subtasks) => setTasks((prev) => prev.map((tt) => tt.taskId === taskId ? { ...tt, subtasks } : tt))}
                />
              ))}
              <div className="task-row-wrapper task-row-phantom" aria-hidden="true">
                <div className="task-row-inner" style={{ position: "absolute", inset: 0 }} />
              </div>
            </div>
          )}

          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-6">
              {loadingMore && (
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
              )}
            </div>
          )}
        </div>

        {!loading && tasks.length > 0 && (
          <div className="flex justify-between items-center mt-2 mb-5 sm:mb-4 px-1 shrink-0">
            <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
              {tasks.length} loaded
            </span>
            <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
              {totalCount} total
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    const sidebar = (
      <DesktopSidebar
        navItems={[
          { href: "/", label: "Today", icon: <NavIconList /> },
          { href: "/recurring", label: "Routines", icon: <NavIconRepeat /> },
        ]}
        footerNavItems={[
          { href: "/archive", label: "Archive", icon: <NavIconArchive />, active: true },
        ]}
      />
    );
    return <DesktopShell sidebar={sidebar} main={mainContent} />;
  }

  return mainContent;
}

