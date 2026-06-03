/** biome-ignore-all lint/suspicious/noConsole: allow */
import { useCallback } from "react";

import { addTask } from "@/server/functions/task/add-task";
import { archiveTask } from "@/server/functions/task/archive-task";
import { deleteTask } from "@/server/functions/task/delete-task";
import { restoreTask } from "@/server/functions/task/restore-task";
import { updateTask } from "@/server/functions/task/update-task";
import { outbox } from "./outbox";
import { taskStore } from "./task-store";

import type { Task } from "@/lib/db/schema";

function makeOptimisticTask(id: string, name: string, userId: string): Task {
  const now = new Date().toISOString();
  return {
    id,
    userId,
    name,
    description: "",
    archivedAt: null,
    deletedAt: null,
    version: 0,
    createdAt: now,
    updatedAt: now,
  } as Task;
}

function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || error instanceof TypeError;
}

export function useAddTask() {
  return useCallback(async (name: string, userId: string) => {
    const id = crypto.randomUUID();
    const entryId = crypto.randomUUID();
    const optimisticTask = makeOptimisticTask(id, name, userId);

    console.group(`🚀 [Mutation Hook] -> CREATE TASK: "${name}"`);

    await outbox.add({
      id: entryId,
      type: "create",
      taskId: id,
      payload: { id, name },
      optimisticTask,
      createdAt: Date.now(),
    });

    const rollback = taskStore.snapshot();
    taskStore.upsert(optimisticTask);
    console.groupEnd();

    try {
      const task = await addTask({ data: { id, name } });
      await outbox.remove(entryId);
      if (task) taskStore.upsert(task);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn(
          "🔌 Network failure detected. Keeping outbox mutation for background replay processing.",
        );
      } else {
        console.group(
          "❌ Critical server rejection on creation. Triggering architectural rollback.",
        );
        console.error(error);
        await outbox.remove(entryId);
        taskStore.restore(rollback);
        console.groupEnd();
      }
    }
  }, []);
}

export function useUpdateTask() {
  return useCallback(async (id: string, updates: Partial<Pick<Task, "name" | "description">>) => {
    const current = taskStore.getSnapshot().get(id);
    if (!current) return;

    const optimisticTask: Task = { ...current, ...updates, updatedAt: new Date().toISOString() };
    const entryId = crypto.randomUUID();

    console.group(`🚀 [Mutation Hook] -> UPDATE TASK ID: ${id.slice(0, 8)}...`);

    const payload = {
      id,
      name: updates.name ?? current.name,
      description: updates.description ?? current.description ?? undefined,
    };

    await outbox.add({
      id: entryId,
      type: "update",
      taskId: id,
      payload,
      optimisticTask,
      createdAt: Date.now(),
    });

    const rollback = taskStore.snapshot();
    taskStore.upsert(optimisticTask);
    console.groupEnd();

    try {
      const task = await updateTask({ data: payload });
      await outbox.remove(entryId);
      if (task) taskStore.upsert(task);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn(
          "🔌 Network failure detected. Staging mutation parameters for future sync cycles.",
        );
      } else {
        console.group("❌ Critical server rejection on update. Triggering structural rollback.");
        console.error(error);
        await outbox.remove(entryId);
        taskStore.restore(rollback);
        console.groupEnd();
      }
    }
  }, []);
}

export function useArchiveTask() {
  return useCallback(async (id: string) => {
    const current = taskStore.getSnapshot().get(id);
    if (!current) return;

    const optimisticTask: Task = {
      ...current,
      version: 0,
      archivedAt: new Date(),
    };
    const entryId = crypto.randomUUID();

    console.group(`🚀 [Mutation Hook] -> ARCHIVE TASK ID: ${id.slice(0, 8)}...`);

    await outbox.add({
      id: entryId,
      type: "archive",
      taskId: id,
      payload: { id },
      optimisticTask,
      createdAt: Date.now(),
    });

    const rollback = taskStore.snapshot();
    taskStore.upsert(optimisticTask);
    console.groupEnd();

    try {
      const task = await archiveTask({ data: { id } });
      await outbox.remove(entryId);
      if (task) taskStore.upsert(task);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn("🔌 Network offline. Outbox queue holding archive intent safely.");
      } else {
        console.group("❌ Critical server rejection on archive. Reversing item layout mutation.");
        console.error(error);
        await outbox.remove(entryId);
        taskStore.restore(rollback);
        console.groupEnd();
      }
    }
  }, []);
}

export function useDeleteTask() {
  return useCallback(async (id: string) => {
    const current = taskStore.getSnapshot().get(id);
    if (!current) return;

    const optimisticTask: Task = {
      ...current,
      version: 0,
      deletedAt: new Date(),
    };
    const entryId = crypto.randomUUID();

    console.group(`🚀 [Mutation Hook] -> DELETE TASK ID: ${id.slice(0, 8)}...`);

    await outbox.add({
      id: entryId,
      type: "delete",
      taskId: id,
      payload: { id },
      optimisticTask,
      createdAt: Date.now(),
    });

    const rollback = taskStore.snapshot();
    taskStore.upsert(optimisticTask);
    console.groupEnd();

    try {
      const task = await deleteTask({ data: { id } });
      await outbox.remove(entryId);
      if (task) taskStore.upsert(task);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn("🔌 Network dropped. Deletion marked offline; waiting to append queue drain.");
      } else {
        console.group(
          "❌ Server rejected deletion request. Re-populating data object inside store.",
        );
        console.error(error);
        await outbox.remove(entryId);
        taskStore.restore(rollback);
        console.groupEnd();
      }
    }
  }, []);
}

export function useRestoreTask() {
  return useCallback(async (id: string) => {
    const current = taskStore.getSnapshot().get(id);
    if (!current) return;

    const optimisticTask: Task = {
      ...current,
      version: 0,
      archivedAt: null,
    };
    const entryId = crypto.randomUUID();

    console.group(`🚀 [Mutation Hook] -> RESTORE TASK ID: ${id.slice(0, 8)}...`);

    await outbox.add({
      id: entryId,
      type: "restore",
      taskId: id,
      payload: { id },
      optimisticTask,
      createdAt: Date.now(),
    });

    const rollback = taskStore.snapshot();
    taskStore.upsert(optimisticTask);
    console.groupEnd();

    try {
      const task = await restoreTask({ data: { id } });
      await outbox.remove(entryId);
      if (task) taskStore.upsert(task);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn("🔌 Network offline. Restore queued for background sync.");
      } else {
        console.group("❌ Critical server rejection on restore. Reversing optimistic move.");
        console.error(error);
        await outbox.remove(entryId);
        taskStore.restore(rollback);
        console.groupEnd();
      }
    }
  }, []);
}
