import { Archive, ArchiveRestore, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useArchiveTask, useDeleteTask, useRestoreTask } from "@/lib/sync/use-mutations";

import type { Table as TableProps } from "@tanstack/react-table";
import type { Task } from "@/lib/db/schema";

interface Props {
  table: TableProps<Task>;
  archived?: boolean;
}

const TableActions = ({ table, archived }: Props) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const archive = useArchiveTask();
  const restore = useRestoreTask();
  const remove = useDeleteTask();

  const handleArchive = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    table.resetRowSelection();
    for (const row of selectedRows) {
      archive(row.original.id);
    }
    toast.success({
      title: "Tasks archived",
      description: `${selectedRows.length} ${selectedRows.length === 1 ? "task has" : "tasks have"} been archived.`,
    });
  };

  const handleRestore = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    table.resetRowSelection();
    for (const row of selectedRows) {
      restore(row.original.id);
    }
    toast.success({
      title: "Tasks restored",
      description: `${selectedRows.length} ${selectedRows.length === 1 ? "task has" : "tasks have"} been moved back to active.`,
    });
  };

  const handleDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    table.resetRowSelection();
    for (const row of selectedRows) {
      remove(row.original.id);
    }
    toast.success({
      title: "Tasks deleted",
      description: `${selectedRows.length} ${selectedRows.length === 1 ? "task has" : "tasks have"} been deleted.`,
    });
  };

  if (!selectedCount) return null;

  return (
    <div className="flex h-10 items-center justify-end gap-2">
      <span className="select-none text-secondary-foreground">
        {selectedCount} selected <span className="pl-1">—</span>
      </span>

      {archived ? (
        <Button variant="outline" inverseHover onClick={handleRestore}>
          <ArchiveRestore className="icon-sm" />
          Restore
        </Button>
      ) : (
        <Button variant="outline" inverseHover onClick={handleArchive}>
          <Archive className="icon-sm" />
          Archive
        </Button>
      )}

      <Button variant="outline" inverseHover onClick={handleDelete}>
        <Trash className="icon-sm" />
        Delete
      </Button>
    </div>
  );
};

export default TableActions;
