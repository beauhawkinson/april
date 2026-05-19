import { createFileRoute } from "@tanstack/react-router";

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
  loaderDeps: ({ search }) => ({ archived: search.archived }),
  loader: async ({ deps }) => {
    const { tasks, counts } = await getTasks({ data: { archived: deps.archived } });
    return { tasks, counts };
  },
  pendingMs: 0,
});
