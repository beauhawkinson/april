import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import useDialogStore, { DialogType } from "@/lib/hooks/use-dialog-store";

import type { Table as TableProps } from "@tanstack/react-table";
import type { ComponentProps } from "react";
import type { Task } from "@/lib/db/schema";

interface Props {
  table: TableProps<Task>;
}

const SearchTaskDialog = ({ table }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const { isOpen: isSearchTaskOpen, setIsOpen: setIsSearchTaskOpen } = useDialogStore({
    type: DialogType.SearchTask,
  });

  useEffect(() => {
    table.getColumn("name")?.setFilterValue(debouncedSearch);
  }, [debouncedSearch, table]);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    table.getColumn("name")?.setFilterValue(searchInput);
    setIsSearchTaskOpen(false);
  };

  return (
    <Dialog open={isSearchTaskOpen} onOpenChange={setIsSearchTaskOpen}>
      <DialogContent aria-describedby={undefined} side="top">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>Search Task</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="relative flex items-center">
            <Search
              strokeWidth={2.5}
              className="absolute left-2.5 size-3.5 text-muted-foreground"
            />
            <Input
              autoFocus
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-8 pl-8"
            />
          </div>

          <DialogFooter>
            <Button variant="primary" type="submit" withPress>
              Search
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchTaskDialog;
