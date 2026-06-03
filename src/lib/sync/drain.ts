/** biome-ignore-all lint/suspicious/noConsole: allow*/
import { useEffect } from "react";

import { addTask } from "@/server/functions/task/add-task";
import { archiveTask } from "@/server/functions/task/archive-task";
import { deleteTask } from "@/server/functions/task/delete-task";
import { restoreTask } from "@/server/functions/task/restore-task";
import { updateTask } from "@/server/functions/task/update-task";
import { outbox } from "./outbox";
import { taskStore } from "./task-store";

import type { OutboxEntry } from "./outbox";

async function executeEntry(entry: OutboxEntry) {
  switch (entry.type) {
    case "create":
      return addTask({ data: entry.payload as { id: string; name: string } });
    case "update":
      return updateTask({
        data: entry.payload as { id: string; name: string; description?: string },
      });
    case "delete":
      return deleteTask({ data: entry.payload as { id: string } });
    case "archive":
      return archiveTask({ data: entry.payload as { id: string } });
    case "restore":
      return restoreTask({ data: entry.payload as { id: string } });
  }
}

let isDraining = false;

export async function drainOutbox(): Promise<void> {
  if (!navigator.onLine) {
    return;
  }

  if (isDraining) {
    return;
  }

  const entries = await outbox.getAll();
  if (entries.length === 0) {
    return;
  }

  isDraining = true;
  console.group(`⚙️ [Sync Engine] Draining Outbox (${entries.length} pending mutations)`);

  entries.sort((a, b) => a.createdAt - b.createdAt);

  try {
    for (const entry of entries) {
      taskStore.upsert(entry.optimisticTask);

      try {
        const task = await executeEntry(entry);
        await outbox.remove(entry.id);

        if (task) {
          taskStore.upsert(task);
        }
        console.groupEnd();
      } catch (error) {
        console.groupEnd();

        if (!navigator.onLine) {
          console.warn("🔌 [Sync Engine] Went offline mid-drain. Halting queue processing.");
          break;
        }

        console.group(`❌ [Sync Engine] Server Rejected Entry: ${entry.id.slice(0, 8)}...`);
        console.error("Rejection Error Context:", error);

        await outbox.remove(entry.id);
        console.warn(
          `Action items: Entry dropped from IndexedDB outbox. State will correct on Phase 3 sync.`,
        );
        console.groupEnd();
      }
    }
  } finally {
    isDraining = false;
    console.groupEnd();
  }
}

export function useOutboxDrain(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    drainOutbox();
    window.addEventListener("online", drainOutbox);
    return () => window.removeEventListener("online", drainOutbox);
  }, []);
}
