CREATE SEQUENCE "public"."task_version_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
DROP INDEX "tasks_user_id_index";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "version" bigint DEFAULT nextval('task_version_seq') NOT NULL;--> statement-breakpoint
CREATE INDEX "tasks_user_version_idx" ON "tasks" USING btree ("user_id","version");