import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { sql } from "drizzle-orm";
import { maxLength, minLength, object, optional, pipe, string } from "valibot";

import { auth } from "@/lib/config/auth.config";
import { db } from "@/lib/db/db";
import { tasks } from "@/lib/db/schema";

const addTaskInput = object({
  id: optional(pipe(string(), minLength(1))),
  name: pipe(string(), minLength(1, "Name is required"), maxLength(256)),
});

export const addTask = createServerFn({ method: "POST" })
  .inputValidator(addTaskInput)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) throw new Error("Unauthorized");

    const [task] = await db
      .insert(tasks)
      .values({
        ...(data.id ? { id: data.id } : {}),
        name: data.name,
        description: "",
        userId: session.user.id,
        version: sql`nextval('task_version_seq')`,
      })
      .onConflictDoNothing({ target: tasks.id })
      .returning();

    return task;
  });
