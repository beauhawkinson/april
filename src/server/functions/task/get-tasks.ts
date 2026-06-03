// server/functions/task/get-tasks.ts
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, count, eq, isNotNull, isNull } from "drizzle-orm";
import { number, object, optional } from "valibot";

import { auth } from "@/lib/config/auth.config";
import { db } from "@/lib/db/db";
import { tasks as tasksTable } from "@/lib/db/schema";

export const getTasks = createServerFn({ method: "GET" })
  .inputValidator(
    object({
      sinceVersion: optional(number()),
    }),
  )
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) throw new Error("Unauthorized");

    const sinceVersion = data.sinceVersion ?? 0;
    // Convert version back to a Date object if checking against a timestamp column
    const sinceDate = new Date(sinceVersion).toISOString();

    // 1. Fetch only modified rows globally (including soft-deleted tombstones!)
    const changes = await db.query.tasks.findMany({
      where: (tasks, { eq, and, gt }) =>
        and(
          eq(tasks.userId, session.user.id),
          gt(tasks.updatedAt, sinceDate), // Delta rule: Only items modified since last sync
        ),
    });

    // 2. Fetch global tracking counts for the navigation badges
    const [[{ value: activeCount }], [{ value: archivedCount }]] = await Promise.all([
      db
        .select({ value: count() })
        .from(tasksTable)
        .where(
          and(
            eq(tasksTable.userId, session.user.id),
            isNull(tasksTable.deletedAt),
            isNull(tasksTable.archivedAt),
          ),
        ),
      db
        .select({ value: count() })
        .from(tasksTable)
        .where(
          and(
            eq(tasksTable.userId, session.user.id),
            isNull(tasksTable.deletedAt),
            isNotNull(tasksTable.archivedAt),
          ),
        ),
    ]);

    // 3. Compute the new highest version checkpoint from the changes retrieved
    const newVersion =
      changes.length > 0
        ? Math.max(...changes.map((t) => new Date(t.updatedAt).getTime()))
        : sinceVersion;

    return {
      changes,
      newVersion,
      counts: { active: activeCount, archived: archivedCount },
    };
  });
