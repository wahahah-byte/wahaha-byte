import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { tasksApi, TaskDto, TaskFilterParams } from "@/lib/api/tasks";
import { MOCK_TASKS } from "@/lib/mockTasks";
import { processPenalties } from "@/lib/penalties";
import { useToast } from "@/context/ToastContext";

type UseTasksOptions = {
  initialFilterFromUrl: string | null;
};

type UseTasksReturn = {
  tasks: TaskDto[];
  setTasks: Dispatch<SetStateAction<TaskDto[]>>;
  loading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  isMounted: boolean;
  isAuthenticated: boolean;
  penalizedTaskIds: Set<string>;
  filters: TaskFilterParams;
  setFilterStatus: (value: string) => void;
  submittedSeed: Set<string> | null;
  refetch: () => Promise<void>;
};

const isStatusFilterPassthrough = (value: string) =>
  value === "all" || value === "pending" || value === "in_progress";

export function useTasks({ initialFilterFromUrl }: UseTasksOptions): UseTasksReturn {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, setError } = useToast();
  const [submittedSeed, setSubmittedSeed] = useState<Set<string> | null>(null);

  const penalizedTaskIds = useMemo(
    () => new Set(tasks.filter((t) => t.wasPenalized).map((t) => t.taskId)),
    [tasks]
  );

  // Always fetch the unfiltered set so the mobile filter pager can render every
  // filter view from the same `tasks` array. The status filter is now applied
  // client-side via buildListItems(activeFilter).
  void initialFilterFromUrl;
  void isStatusFilterPassthrough;

  const [filters, setFilters] = useState<TaskFilterParams>({
    pageSize: 50,
    pageNumber: 1,
    isRecurring: false,
    isArchived: false,
    status: undefined,
  });

  const setFilterStatus = (_value: string) => {
    // No-op: status filtering is now client-side. Kept for API compatibility.
    void _value;
    void setFilters;
  };

  useEffect(() => {
    setIsMounted(true);
    const hasToken = !!localStorage.getItem("auth_token");
    setIsAuthenticated(hasToken);
    if (!hasToken) {
      setTasks(processPenalties(MOCK_TASKS.filter((t) => !t.isRecurring && !t.isArchived)));
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks(processPenalties(MOCK_TASKS.filter((t) => !t.isRecurring && !t.isArchived)));
      return;
    }
    setError(null);
    const taskResult = await tasksApi.getAll(filters);
    if (taskResult.error) { setError(taskResult.error); return; }
    const raw = taskResult.data!.data;
    setTasks(raw);
    setSubmittedSeed(new Set(raw.filter((t) => t.pointsAwarded).map((t) => t.taskId)));
  }, [filters, isAuthenticated, setError]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch, isAuthenticated]);

  return {
    tasks, setTasks, loading, error, setError,
    isMounted, isAuthenticated, penalizedTaskIds,
    filters, setFilterStatus, submittedSeed, refetch,
  };
}
