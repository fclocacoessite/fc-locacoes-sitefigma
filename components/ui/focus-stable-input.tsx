import * as React from "react";
import { cn } from "./utils";
import { debugFocus, preventFocusLoss, forceFocus } from "@/lib/focus-debug";

interface FocusStableInputProps extends React.ComponentProps<"input"> {
  preventRefocus?: boolean;
}

const FocusStableInput = React.memo(React.forwardRef<HTMLInputElement, FocusStableInputProps>(
  ({ className, type, preventRefocus = false, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isFocusedRef = React.useRef(false);
    const lastValueRef = React.useRef(props.value || '');
    
    // Combinar refs
    React.useImperativeHandle(ref, () => inputRef.current!);
    
    // Prevenir re-renderização desnecessária
    const memoizedClassName = React.useMemo(() => cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      "focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange focus:z-50 relative",
      className,
    ), [className]);
    
    // Handlers estáveis
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      isFocusedRef.current = true;
      debugFocus(e.target, 'FOCUS');
      preventFocusLoss(e.target);
      props.onFocus?.(e);
    }, [props.onFocus]);
    
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      isFocusedRef.current = false;
      debugFocus(e.target, 'BLUR');
      props.onBlur?.(e);
    }, [props.onBlur]);
    
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      lastValueRef.current = e.target.value;
      props.onChange?.(e);
    }, [props.onChange]);
    
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevenir perda de foco durante digitação
      if (isFocusedRef.current) {
        e.stopPropagation();
      }
      props.onKeyDown?.(e);
    }, [props.onKeyDown]);
    
    const handleKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevenir perda de foco durante digitação
      if (isFocusedRef.current) {
        e.stopPropagation();
      }
      props.onKeyUp?.(e);
    }, [props.onKeyUp]);
    
    // Efeito simplificado para manter foco
    React.useEffect(() => {
      if (preventRefocus && isFocusedRef.current && inputRef.current) {
        const element = inputRef.current;
        if (document.activeElement !== element) {
          // Usar requestAnimationFrame para evitar conflitos
          requestAnimationFrame(() => {
            if (element && document.activeElement !== element && isFocusedRef.current) {
              element.focus();
            }
          });
        }
      }
    }, [preventRefocus]); // Adicionar dependência para evitar execução excessiva

    return (
      <input
        type={type}
        ref={inputRef}
        className={memoizedClassName}
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

FocusStableInput.displayName = "FocusStableInput";

export { FocusStableInput };
