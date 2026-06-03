/** biome-ignore-all lint/suspicious/noConsole: allow */
import type { Task } from "@/lib/db/schema";

type Listener = () => void;

class TaskStore {
  private _tasks: Map<string, Task> = new Map();
  private _listeners = new Set<Listener>();
  lastSyncId = 0;
  isBootstrapped = false;
  counts = { active: 0, archived: 0 };

  subscribe = (listener: Listener): (() => void) => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };

  getSnapshot = (): Map<string, Task> => this._tasks;

  bootstrap(
    changes: Task[],
    lastSyncId = 0,
    serverCounts?: { active: number; archived: number },
  ): void {
    console.group(`📥 [TaskStore] Processing ${changes.length} delta changes`);

    const mergedMap = new Map(this._tasks);

    for (const task of changes) {
      if (task.deletedAt) {
        mergedMap.delete(task.id);
      } else {
        mergedMap.set(task.id, task);
      }
    }

    this._tasks = mergedMap;
    this.lastSyncId = lastSyncId;
    this.isBootstrapped = true;

    // 🆕 Update counts if sent by the server layout pass
    if (serverCounts) {
      this.counts = serverCounts;
    }

    console.groupEnd();
    this._emit();
  }

  upsert(task: Task): void {
    const existingTask = this._tasks.get(task.id);
    const exists = !!existingTask;

    // Update tracking checkpoints if a server confirmed timestamp comes back
    if (task.updatedAt) {
      const taskTime = new Date(task.updatedAt).getTime();
      if (taskTime > this.lastSyncId) {
        this.lastSyncId = taskTime;
      }
    }

    // ── Manage Optimistic Badge Counts ───────────────────────────────────
    if (task.version === 0) {
      if (task.deletedAt) {
        // Handle Deletions
        if (existingTask) {
          if (existingTask.archivedAt && this.counts.archived > 0) {
            this.counts.archived--;
          } else if (!existingTask.archivedAt && this.counts.active > 0) {
            this.counts.active--;
          }
        }
      } else if (!exists) {
        // Handle Brand New Task Creation
        if (task.archivedAt) {
          this.counts.archived++;
        } else {
          this.counts.active++;
        }
      } else {
        // Handle Toggling/Updating an Existing Task
        const wasArchived = !!existingTask.archivedAt;
        const isArchived = !!task.archivedAt;

        if (!wasArchived && isArchived && this.counts.active > 0) {
          // Moved Active -> Archived
          this.counts.active--;
          this.counts.archived++;
        } else if (wasArchived && !isArchived && this.counts.archived > 0) {
          // Moved Archived -> Active
          this.counts.active++;
          this.counts.archived--;
        }
      }
    }

    this._tasks = new Map(this._tasks).set(task.id, task);
    this._emit();
  }

  snapshot(): { tasks: Map<string, Task>; counts: { active: number; archived: number } } {
    return { tasks: new Map(this._tasks), counts: { ...this.counts } };
  }

  restore(snap: { tasks: Map<string, Task>; counts: { active: number; archived: number } }): void {
    this._tasks = snap.tasks;
    this.counts = snap.counts;
    this._emit();
  }

  private _emit(): void {
    this._listeners.forEach((l) => l());
  }
}

/**
 * Module-level singleton — one store for the whole app.
 *
 * Fine for a client-side app. If you need per-request SSR isolation,
 * wrap in React Context instead.
 */
export const taskStore = new TaskStore();
