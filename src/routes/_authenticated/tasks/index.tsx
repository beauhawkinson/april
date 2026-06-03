import { createFileRoute } from "@tanstack/react-router";

import { taskStore } from "@/lib/sync/task-store";
import { getTasks } from "@/server/functions/task/get-tasks";

export const Route = createFileRoute("/_authenticated/tasks/")({
  head: () => ({
    meta: [
      { title: "Tasks" },
      {
        name: "description",
        content: `Manage your tasks`,
      },
    ],
  }),
  validateSearch: (search) => ({
    archived: search.archived === true || undefined,
    newTask: search.newTask === true || undefined,
  }),
  loader: async () => {
    const currentVersion = taskStore.lastSyncId;

    const { changes, newVersion, counts } = await getTasks({
      data: {
        sinceVersion: currentVersion,
      },
    });

    return { changes, newVersion, counts };
  },
  pendingMs: 0,
});
