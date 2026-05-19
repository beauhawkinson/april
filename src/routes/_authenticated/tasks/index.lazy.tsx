import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import NewTaskDialog from "@/components/features/tasks/new-task-dialog";
import SearchTaskDialog from "@/components/features/tasks/search-task-dialog";
import { DataTable } from "@/components/features/tasks/table/data-table";
import EditableCell from "@/components/features/tasks/table/editable-cell";
import TableActions from "@/components/features/tasks/table/table-actions";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/lib/hooks/use-debounce";
import useDialogStore, { DialogType } from "@/lib/hooks/use-dialog-store";
import { formatDate } from "@/lib/utils/format";

import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { Task } from "@/lib/db/schema";

export const Route = createLazyFileRoute("/_authenticated/tasks/")({
  component: TasksPage,
});

function TasksPage() {
  const { tasks, counts } = Route.useLoaderData();
  const { archived, newTask } = Route.useSearch();

  const [data, setData] = useState(tasks ?? []);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const { setIsOpen: setIsCreateTaskOpen } = useDialogStore({ type: DialogType.CreateTask });
  const { setIsOpen: setIsSearchTaskOpen } = useDialogStore({ type: DialogType.SearchTask });

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="ml-2 flex">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected()
                  ? true
                  : table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : false
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all tasks"
            />
          </div>
        ),
        enableSorting: false,
        size: 16,
        minSize: 16,
        maxSize: 16,
        cell: ({ row }) => (
          <div className="ml-2 flex">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={`Select task ${row.original.name}`}
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "createdAt",
        id: "created at",
        size: 32,
        minSize: 32,
        maxSize: 32,
        sortingFn: "datetime",
        cell: ({ getValue }) => {
          const createdAt = new Date(getValue() as string);
          return (
            <div className="ml-4 hidden text-muted-foreground text-sm sm:block">
              {formatDate(createdAt)}
            </div>
          );
        },
        // also hide the header:
        header: () => <span className="hidden sm:block">Created</span>,
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    defaultColumn: { cell: (props) => <EditableCell {...props} /> },
    getRowId: (row) => row.id!,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: false,
    state: {
      columnVisibility,
      columnFilters,
      rowSelection,
      sorting,
    },
    manualPagination: true,
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    meta: {
      updateTask: (rowId: string, columnId: string, value: unknown) => {
        setData((old) =>
          old.map((row) => {
            if (row.id === rowId) {
              return {
                ...row,
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      deleteTask: (rowId: string) => {
        setData((old) => old.filter((row) => row.id !== rowId));
      },
      restoreTask: (task: Task) => {
        setData((old) => [...old, task]);
      },
    },
  });

  useEffect(() => {
    table.getColumn("name")?.setFilterValue(debouncedSearch);
  }, [debouncedSearch, table]);

  useEffect(() => {
    setData(tasks ?? []);
  }, [tasks]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Allow disabling exhaustive deps for newTask since we only want to open the dialog when it changes from false to true, not on every change
  useEffect(() => {
    if (newTask) setIsCreateTaskOpen(true);
  }, [newTask]);

  return (
    <PageContainer>
      <h1 className="items-baseline px-4 font-medium text-4xl">Tasks</h1>

      <div className="-mt-6 sm:-mt-10">
        <div className="h-10 min-h-10">
          <TableActions table={table} />
        </div>

        <div className="mt-1 flex flex-col rounded-xl border bg-surface">
          <div className="flex items-center justify-between gap-2 p-2 sm:p-4">
            <div className="flex items-center gap-2">
              {/* Desktop: full search input */}
              <div className="relative hidden items-center sm:flex">
                <Search
                  strokeWidth={2.5}
                  className={clsx(
                    "absolute left-2.5 size-3.5 text-muted-foreground",
                    data.length === 0 && "opacity-50",
                  )}
                />
                <Input
                  placeholder="Search tasks..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="max-w-[233px] pl-8"
                  disabled={data.length === 0}
                />
              </div>

              {/* Mobile: icon only */}
              <Button
                variant="outline"
                className="sm:hidden"
                onClick={() => setIsSearchTaskOpen(true)}
                disabled={data.length === 0}
              >
                <Search className="icon-sm mx-auto" />
              </Button>

              <Select
                defaultValue="active"
                value={archived ? "archived" : "active"}
                onValueChange={(v) =>
                  navigate({
                    to: ".",
                    search: (prev) => ({ ...prev, archived: v === "archived" ? true : undefined }),
                  })
                }
              >
                <SelectTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={counts.active === 0 && counts.archived === 0}
                    aria-label="Filter tasks by status"
                  >
                    <span className="sr-only">Filter tasks by status</span>

                    <SelectValue placeholder="Select view" />
                    <ChevronDown className="icon-xs ml-1 text-muted-foreground" />
                  </Button>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="active" disabled={counts.active === 0}>
                      Active{" "}
                      {archived && <span className="text-muted-foreground">({counts.active})</span>}
                    </SelectItem>

                    <SelectItem value="archived" disabled={counts.archived === 0}>
                      Archived{" "}
                      {!archived && (
                        <span className="text-muted-foreground">({counts.archived})</span>
                      )}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <NewTaskDialog />
          </div>

          <DataTable table={table} />
        </div>
      </div>

      <SearchTaskDialog table={table} />
    </PageContainer>
  );
}
