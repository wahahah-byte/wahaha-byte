"use client";

import { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCapWarning, setShowCapWarning] = useState(false);

  const _regularSubmitted = dailySubmitted - recurringSubmittedToday;
  const _remaining = REGULAR_CAP - _regularSubmitted;
  const _recurringRemaining = RECURRING_CAP - recurringSubmittedToday;
  const _selectedPts = tasks.filter((t) => selectedIds.has(t.taskId)).reduce((s, t) => s + t.pointValue, 0);
  const _willAward = Math.min(_selectedPts, Math.max(0, _remaining));
  const _capped = _selectedPts > _remaining;
  const _limitReached = _remaining <= 0;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function doSubmit() {
    if (selectedIds.size === 0) return;
    if (!isAuthenticated) {
      const ids = [...selectedIds];
      setIsSubmitting(true);
      setFilingIds(new Set(ids));
      const delay = Math.max(520, (ids.length - 1) * 35 + 520);
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

    setFilingIds(new Set(ids));
    const delay = Math.max(520, (ids.length - 1) * 35 + 520);
    setTimeout(() => {
      setSubmittedTaskIds((prev) => new Set([...prev, ...ids]));
      setRecentlyFiledIds(new Set(ids));
      setSelectedIds(new Set());
      setStagedTaskIds([]);
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
    filingIds, recentlyFiledIds,
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
