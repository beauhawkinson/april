import { flexRender } from "@tanstack/react-table";
import { CheckSquare } from "lucide-react";
import { useRef } from "react";

import HeaderCell from "@/components/features/tasks/table/header-cell";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

import type { RowData, Table as TableProps } from "@tanstack/react-table";
import type { Task } from "@/lib/db/schema";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateTask: (rowId: string, columnId: string, value: unknown) => void;
    deleteTask: (rowId: string) => void;
    restoreTask: (task: TData) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

interface Props {
  table: TableProps<Task>;
}

export function DataTable({ table }: Props) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const isEmpty = !rows?.length;
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div ref={tableContainerRef} className="min-h-full flex-1 overflow-auto">
      <Table>
        {(!isEmpty || isFiltered) && (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} data-static="true" className="hover:bg-none">
                {headerGroup.headers.map((header) => (
                  <HeaderCell key={header.id} header={header} />
                ))}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody>
          {isEmpty ? (
            <TableRow data-static="true" className="hover:bg-inherit">
              <TableCell colSpan={table.getAllColumns().length}>
                <Empty>
                  <EmptyMedia className="bg-transparent">
                    <CheckSquare className="bg-transparent" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No tasks</EmptyTitle>
                    <EmptyDescription>
                      {isFiltered
                        ? "No tasks match your search."
                        : "Create your first task to get started."}
                    </EmptyDescription>
                  </EmptyHeader>
                  {isFiltered && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.getColumn("name")?.setFilterValue("")}
                    >
                      Clear search
                    </Button>
                  )}
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-row-id={row.id}
                  tabIndex={0}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.cellClassName}
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
