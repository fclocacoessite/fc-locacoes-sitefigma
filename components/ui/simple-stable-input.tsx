import * as React from "react";
import { cn } from "./utils";

interface SimpleStableInputProps extends React.ComponentProps<"input"> {
  stable?: boolean;
}

const SimpleStableInput = React.memo(React.forwardRef<HTMLInputElement, SimpleStableInputProps>(
  ({ className, type, stable = true, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isFocusedRef = React.useRef(false);
    
    // Combinar refs
    React.useImperativeHandle(ref, () => inputRef.current!);
    
    // Handlers simples
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      isFocusedRef.current = true;
      props.onFocus?.(e);
    }, [props.onFocus]);
    
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      isFocusedRef.current = false;
      props.onBlur?.(e);
    }, [props.onBlur]);
    
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e);
    }, [props.onChange]);
    
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevenir perda de foco durante digitação
      if (stable && isFocusedRef.current) {
        e.stopPropagation();
      }
      props.onKeyDown?.(e);
    }, [stable, props.onKeyDown]);
    
    const handleKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevenir perda de foco durante digitação
      if (stable && isFocusedRef.current) {
        e.stopPropagation();
      }
      props.onKeyUp?.(e);
    }, [stable, props.onKeyUp]);

    // Remover efeito de foco para evitar problemas de validação

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
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        {...props}
      />
    );
  }
));

SimpleStableInput.displayName = "SimpleStableInput";

export { SimpleStableInput };
