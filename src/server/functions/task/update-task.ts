import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, eq, sql } from "drizzle-orm";
import { maxLength, minLength, object, optional, pipe, string } from "valibot";

import { auth } from "@/lib/config/auth.config";
import { db } from "@/lib/db/db";
import { tasks } from "@/lib/db/schema";

const updateTaskInput = object({
  id: pipe(string(), minLength(1)),
  name: pipe(string(), minLength(1, "Name is required"), maxLength(256)),
  description: optional(pipe(string(), maxLength(4096))),
});

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator(updateTaskInput)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) throw new Error("Unauthorized");

    const [task] = await db
      .update(tasks)
      .set({
        name: data.name,
        ...(data.description !== undefined ? { description: data.description } : {}),
        version: sql`nextval('task_version_seq')`,
      })
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, session.user.id)))
      .returning();

    return task;
  });
