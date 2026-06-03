import { useNavigate, useRouteContext, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { toast } from "@/components/ui/toast";
import useDialogStore, { DialogType } from "@/lib/hooks/use-dialog-store";
import { useAddTask } from "@/lib/sync/use-mutations";

import type { ComponentProps } from "react";

const NewTaskDialog = () => {
  const { newTask } = useSearch({ from: "/_authenticated/tasks/" });
  const navigate = useNavigate();

  const createTask = useAddTask();
  const { user } = useRouteContext({ from: "/_authenticated" });
  const currentUserId = user.id;

  const { isOpen: isCreateTaskOpen, setIsOpen: setIsCreateTaskOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });

  const [name, setName] = useState("");

  const canSubmit = name.trim().length > 0 && name.length <= 256;

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error({
        title: "Invalid task name",
        description: "Task name must be between 1 and 256 characters.",
      });
      return;
    }

    createTask(name.trim(), currentUserId);

    setIsCreateTaskOpen(false);
    setName("");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to listen to changes in isCreateTaskOpen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (isCreateTaskOpen) return;
      if (e.key === "c") {
        e.preventDefault();
        setIsCreateTaskOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCreateTaskOpen]);

  return (
    <Dialog
      open={isCreateTaskOpen}
      onOpenChange={(open) => {
        setIsCreateTaskOpen(open);
        if (!open) {
          setName("");
          if (newTask) {
            navigate({
              to: ".",
              search: (prev) => ({ ...prev, newTask: undefined }),
              replace: true,
            });
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" withPress>
          New Task
          <Kbd>C</Kbd>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <form onSubmit={handleSubmit} className="space-y-0">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>New Task</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <Input
            autoFocus
            aria-label="Name"
            placeholder="Enter a task name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 border-0 px-0!"
          />

          <DialogFooter>
            <Button variant="primary" type="submit" withPress disabled={!canSubmit}>
              Create task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
