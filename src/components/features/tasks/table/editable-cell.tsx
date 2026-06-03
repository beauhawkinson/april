import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

import type { CellContext } from "@tanstack/react-table";
import type { KeyboardEvent } from "react";
import type { Task } from "@/lib/db/schema";

const EditableCell = ({ getValue, row, column, table }: CellContext<Task, unknown>) => {
  const initialValue = (getValue() as string | undefined) ?? "";
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const didCancelRef = useRef(false);

  const isNameColumn = column.id === "name";

  useEffect(() => {
    if (!isEditing) setValue(initialValue);
  }, [initialValue, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, [isEditing]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed === initialValue.trim()) return;

    if (isNameColumn && !trimmed) {
      inputRef.current?.focus();
      return;
    }

    if (!row.original.id) return;

    // The meta function now handles everything: snapshot → outbox → optimistic
    // update → server call → rollback on failure. Nothing else needed here.
    table.options.meta?.updateTask(row.original.id, column.id, trimmed);
  };

  const cancel = () => {
    didCancelRef.current = true;
    setValue(initialValue);
    setIsEditing(false);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (didCancelRef.current) {
      didCancelRef.current = false;
      return;
    }
    commit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setIsEditing(true)}
        className="group flex h-7 w-full flex-1 items-center truncate rounded border border-transparent px-2 font-medium text-secondary-foreground leading-7 focus-visible:border-border"
      >
        {initialValue}
      </button>
    );
  }

  return (
    <Input
      tabIndex={-1}
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={column.id === "description" ? "Add task description..." : undefined}
    />
  );
};

export default EditableCell;
