import * as React from "react";
import { cn } from "./utils";

interface StableInputProps extends React.ComponentProps<"input"> {
  stable?: boolean;
}

const StableInput = React.forwardRef<HTMLInputElement, StableInputProps>(
  ({ className, type, stable = true, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Combinar refs
    React.useImperativeHandle(ref, () => inputRef.current!);
    
    // Prevenir perda de foco
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      if (stable) {
        e.target.focus();
      }
      props.onFocus?.(e);
    }, [stable, props.onFocus]);
    
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      if (stable) {
        // Prevenir blur se o usuário ainda está digitando
        setTimeout(() => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      }
      props.onBlur?.(e);
    }, [stable, props.onBlur]);
    
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (stable) {
        e.stopPropagation();
      }
      props.onKeyDown?.(e);
    }, [stable, props.onKeyDown]);
    
    const handleKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (stable) {
        e.stopPropagation();
      }
      props.onKeyUp?.(e);
    }, [stable, props.onKeyUp]);

    return (
      <input
        type={type}
        ref={inputRef}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange focus:z-50 relative",
          className,
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        {...props}
      />
    );
  }
);
StableInput.displayName = "StableInput";

export { StableInput };
