import { flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { Header } from "@tanstack/react-table";
import type { Task } from "@/lib/db/schema";

interface Props {
  header: Header<Task, unknown>;
}

const HeaderCell = ({ header }: Props) => {
  const { column, getContext } = header;
  const sortDirection = column.getIsSorted();
  const canSort = column.getCanSort();
  const headerClassName = column.columnDef.meta?.headerClassName;

  const hasAnySorting = getContext().table.getState().sorting.length > 0;
  const isDefaultSortColumn = header.id === "name" && !hasAnySorting;
  const showIcon = !!sortDirection || isDefaultSortColumn;

  const cellStyle = {
    width: `${header.getSize()}px`,
    minWidth: `${header.getSize()}px`,
    maxWidth: `${header.getSize()}px`,
    textAlign: "left" as const,
    height: "40px",
  };

  if (!canSort) {
    return (
      <TableHead style={cellStyle} className={headerClassName}>
        {flexRender(column.columnDef.header, getContext())}
      </TableHead>
    );
  }

  const handleSort = () => {
    column.toggleSorting(sortDirection !== "desc");
  };

  const SortIcon = sortDirection === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead colSpan={header.colSpan} style={cellStyle} className={headerClassName}>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={handleSort} className="group text-sm">
            {flexRender(column.columnDef.header, getContext())}
            <SortIcon
              className={clsx(
                "icon-sm shrink-0",
                showIcon
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>Order by {header.id}</TooltipContent>
      </Tooltip>
    </TableHead>
  );
};

export default HeaderCell;
