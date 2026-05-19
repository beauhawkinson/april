import type { ComponentProps } from "react";

interface SwitchProps extends Omit<ComponentProps<"button">, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

function Switch({ checked = false, onCheckedChange, disabled = false, id, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className="group custom:bg- relative inline-flex h-5 w-7.5 shrink-0 items-center rounded-full bg-muted transition-colors duration-150 ease-out-strong focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-inherit disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary"
      {...props}
    >
      {/* TODO: fix animation */}
      <span className="pointer-events-none block size-3.5 translate-x-0.75 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out-strong group-data-[state=checked]:translate-x-3.25" />
    </button>
  );
}

export { Switch };
