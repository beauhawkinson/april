import clsx from "clsx";
import { useEffect, useRef } from "react";

import type { ComponentProps } from "react";

type CheckedState = boolean | "indeterminate";

interface CheckboxProps extends Omit<ComponentProps<"input">, "checked" | "type"> {
  checked?: CheckedState;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({ checked = false, onCheckedChange, className, ...props }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null!);
  const isChecked = checked === true;
  const isIndeterminate = checked === "indeterminate";

  useEffect(() => {
    ref.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      data-slot="checkbox"
      checked={isChecked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={clsx(
        "peer mx-auto flex size-3.5 shrink-0 appearance-none items-center justify-center rounded-[3px] border border-border shadow-xs outline-none",
        "checked:border-primary checked:bg-primary",
        "indeterminate:border-primary indeterminate:bg-primary",
        "bg-center bg-no-repeat checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%200%201%200%201.414l-5%205a1%201%200%200%201-1.414%200l-2-2a1%201%200%200%201%201.414-1.414L6.5%209.086l4.293-4.293a1%201%200%200%201%201.414%200z%22%2F%3E%3C%2Fsvg%3E')]",
        "bg-center bg-no-repeat indeterminate:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%3E%3Crect%20x%3D%223%22%20y%3D%227%22%20width%3D%2210%22%20height%3D%222%22%20rx%3D%221%22%2F%3E%3C%2Fsvg%3E')]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-offset-background indeterminate:focus-visible:ring-1 indeterminate:focus-visible:ring-offset-1 checked:focus-visible:ring-1 checked:focus-visible:ring-offset-1",
        className,
      )}
      {...props}
    />
  );
}

export type { CheckedState };
export { Checkbox };
