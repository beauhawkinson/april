import { useCallback, useMemo, useSyncExternalStore } from "react";

import { taskStore } from "@/lib/sync/task-store";

import type { Task } from "@/lib/db/schema";

const EMPTY_MAP = new Map<string, Task>();

function useTaskMap(): Map<string, Task> {
  return useSyncExternalStore(taskStore.subscribe, taskStore.getSnapshot, () => EMPTY_MAP);
}

export function useTasks(archived?: boolean): Task[] {
  const map = useTaskMap();
  return useMemo(
    () =>
      [...map.values()].filter((t) => !t.deletedAt && (archived ? !!t.archivedAt : !t.archivedAt)),
    [map, archived],
  );
}

export function useBootstrapTasks() {
  return useCallback(
    (changes: Task[], lastSyncId: number, counts?: { active: number; archived: number }) => {
      taskStore.bootstrap(changes, lastSyncId, counts);
    },
    [],
  );
}

export function useIsBootstrapped(): boolean {
  return useSyncExternalStore(
    taskStore.subscribe,
    () => taskStore.isBootstrapped,
    () => false,
  );
}

export function useTaskCounts() {
  return useSyncExternalStore(
    taskStore.subscribe,
    () => taskStore.counts,
    () => ({ active: 0, archived: 0 }),
  );
}
