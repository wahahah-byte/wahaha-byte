import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { tasksApi, TaskDto, TaskFilterParams } from "@/lib/api/tasks";
import { FILTERS } from "@/lib/constants";
import { MOCK_TASKS } from "@/lib/mockTasks";
import { processPenalties } from "@/lib/penalties";

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
};

const isStatusFilterPassthrough = (value: string) =>
  value === "all" || value === "pending" || value === "in_progress";

export function useTasks({ initialFilterFromUrl }: UseTasksOptions): UseTasksReturn {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittedSeed, setSubmittedSeed] = useState<Set<string> | null>(null);

  const penalizedTaskIds = useMemo(
    () => new Set(tasks.filter((t) => t.wasPenalized).map((t) => t.taskId)),
    [tasks]
  );

  const initialStatus =
    initialFilterFromUrl && FILTERS.some((f) => f.value === initialFilterFromUrl) && !isStatusFilterPassthrough(initialFilterFromUrl)
      ? initialFilterFromUrl
      : undefined;

  const [filters, setFilters] = useState<TaskFilterParams>({
    pageSize: 50,
    pageNumber: 1,
    isRecurring: false,
    status: initialStatus,
  });

  const setFilterStatus = (value: string) => {
    setFilters((f) => ({
      ...f,
      status: isStatusFilterPassthrough(value) ? undefined : value,
      pageNumber: 1,
    }));
  };

  useEffect(() => {
    setIsMounted(true);
    const hasToken = !!localStorage.getItem("auth_token");
    setIsAuthenticated(hasToken);
    if (!hasToken) {
      setTasks(processPenalties(MOCK_TASKS.filter((t) => !t.isRecurring)));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      const taskResult = await tasksApi.getAll(filters);
      setLoading(false);
      if (taskResult.error) { setError(taskResult.error); return; }
      const raw = taskResult.data!.data;
      setTasks(raw);
      setSubmittedSeed(new Set(raw.filter((t) => t.pointsAwarded).map((t) => t.taskId)));
    }
    fetchTasks();
  }, [filters, isAuthenticated]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5100);
    return () => clearTimeout(t);
  }, [error]);

  return {
    tasks, setTasks, loading, error, setError,
    isMounted, isAuthenticated, penalizedTaskIds,
    filters, setFilterStatus, submittedSeed,
  };
}
