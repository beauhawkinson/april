import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, eq, sql } from "drizzle-orm";
import { minLength, object, pipe, string } from "valibot";

import { auth } from "@/lib/config/auth.config";
import { db } from "@/lib/db/db";
import { tasks } from "@/lib/db/schema";

export const restoreTask = createServerFn({ method: "POST" })
  .inputValidator(object({ id: pipe(string(), minLength(1)) }))
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) throw new Error("Unauthorized");

    const [task] = await db
      .update(tasks)
      .set({ archivedAt: null, version: sql`nextval('task_version_seq')` })
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, session.user.id)))
      .returning();

    return task;
  });
