"use client";

import { useCallback, useState } from "react";
import { TaskDto } from "@/lib/api/tasks";
import { usersApi } from "@/lib/api/users";
import { usePoints } from "@/context/PointsContext";
import { REGULAR_CAP, RECURRING_CAP } from "@/lib/constants";

interface UseTaskSubmissionOptions {
  tasks: TaskDto[];
  isAuthenticated: boolean;
  setError: (msg: string) => void;
}

export function useTaskSubmission({ tasks, isAuthenticated, setError }: UseTaskSubmissionOptions) {
  const { dailySubmitted, recurringSubmittedToday, setDailySubmitted, setBalance, updateStaged } = usePoints();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [stagedTaskIds, setStagedTaskIds] = useState<string[]>([]);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  const [filingIds, setFilingIds] = useState<Set<string>>(new Set());
  const [recentlyFiledIds, setRecentlyFiledIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCapWarning, setShowCapWarning] = useState(false);

  const _regularSubmitted = dailySubmitted - recurringSubmittedToday;
  const _remaining = REGULAR_CAP - _regularSubmitted;
  const _recurringRemaining = RECURRING_CAP - recurringSubmittedToday;
  const _selectedPts = tasks.filter((t) => selectedIds.has(t.taskId)).reduce((s, t) => s + t.pointValue, 0);
  const _willAward = Math.min(_selectedPts, Math.max(0, _remaining));
  const _capped = _selectedPts > _remaining;
  const _limitReached = _remaining <= 0;

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  async function doSubmit() {
    if (selectedIds.size === 0) return;
    if (!isAuthenticated) {
      const ids = [...selectedIds];
      setIsSubmitting(true);
      setFilingIds(new Set(ids));
      const delay = Math.max(900, (ids.length - 1) * 35 + 900);
      setTimeout(() => {
        setSubmittedTaskIds((prev) => new Set([...prev, ...ids]));
        setRecentlyFiledIds(new Set(ids));
        setSelectedIds(new Set());
        setStagedTaskIds([]);
        setFilingIds(new Set());
        setIsSubmitting(false);
        updateStaged(0, true);
        setTimeout(() => setRecentlyFiledIds(new Set()), 600);
      }, delay);
      return;
    }
    if (_remaining <= 0) return;
    const ids = [...selectedIds];
    setIsSubmitting(true);
    const { data, error } = await usersApi.submitPoints(ids);
    setIsSubmitting(false);
    if (error) { setError(error); return; }

    const results = data!.results ?? [];
    const failedIds = new Set(results.filter((r) => r.error).map((r) => r.taskId));
    const succeededIds = ids.filter((id) => !failedIds.has(id));

    if (data!.errors && data!.errors.length > 0) {
      const first = data!.errors[0];
      const more = data!.errors.length - 1;
      setError(more > 0 ? `${first} (+${more} more)` : first);
    }

    if (failedIds.size > 0) {
      setErrorIds(failedIds);
      setTimeout(() => setErrorIds(new Set()), 700);
    }

    if (succeededIds.length === 0) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of ids) if (!failedIds.has(id)) next.delete(id);
        return next;
      });
      return;
    }

    setFilingIds(new Set(succeededIds));
    const delay = Math.max(900, (succeededIds.length - 1) * 35 + 900);
    setTimeout(() => {
      setSubmittedTaskIds((prev) => new Set([...prev, ...succeededIds]));
      setRecentlyFiledIds(new Set(succeededIds));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of succeededIds) next.delete(id);
        return next;
      });
      setStagedTaskIds((prev) => prev.filter((id) => !succeededIds.includes(id)));
      setFilingIds(new Set());
      setDailySubmitted(data!.dailyTotal);
      setBalance(data!.newBalance);
      updateStaged(0, true);
      setTimeout(() => setRecentlyFiledIds(new Set()), 600);
    }, delay);
  }

  function handleSubmit() {
    if (_capped) { setShowCapWarning(true); return; }
    doSubmit();
  }

  return {
    selectedIds, setSelectedIds,
    stagedTaskIds, setStagedTaskIds,
    submittedTaskIds, setSubmittedTaskIds,
    filingIds, recentlyFiledIds, errorIds,
    isSubmitting, showCapWarning, setShowCapWarning,
    toggleSelect, doSubmit, handleSubmit,
    remaining: _remaining,
    recurringRemaining: _recurringRemaining,
    selectedPts: _selectedPts,
    willAward: _willAward,
    capped: _capped,
    limitReached: _limitReached,
  };
}
