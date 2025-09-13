import * as React from "react";
import { cn } from "./utils";

interface BasicInputProps extends React.ComponentProps<"input"> {}

const BasicInput = React.forwardRef<HTMLInputElement, BasicInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange",
          className,
        )}
        {...props}
      />
    );
  }
);

BasicInput.displayName = "BasicInput";

export { BasicInput };
