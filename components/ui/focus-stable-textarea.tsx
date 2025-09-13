import * as React from "react";
import { cn } from "./utils";
import { debugFocus, preventFocusLoss, forceFocus } from "@/lib/focus-debug";

interface FocusStableTextareaProps extends React.ComponentProps<"textarea"> {
  preventRefocus?: boolean;
}

const FocusStableTextarea = React.memo(React.forwardRef<HTMLTextAreaElement, FocusStableTextareaProps>(
  ({ className, preventRefocus = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const isFocusedRef = React.useRef(false);
    const lastValueRef = React.useRef(props.value || '');
    
    // Combinar refs
    React.useImperativeHandle(ref, () => textareaRef.current!);
    
    // Prevenir re-renderização desnecessária
    const memoizedClassName = React.useMemo(() => cn(
      "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange focus:z-50 relative",
      className,
    ), [className]);
    
    // Handlers estáveis
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      isFocusedRef.current = true;
      debugFocus(e.target, 'FOCUS');
      preventFocusLoss(e.target);
      props.onFocus?.(e);
    }, [props.onFocus]);
    
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      isFocusedRef.current = false;
      debugFocus(e.target, 'BLUR');
      props.onBlur?.(e);
    }, [props.onBlur]);
    
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      lastValueRef.current = e.target.value;
      props.onChange?.(e);
    }, [props.onChange]);
    
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Prevenir perda de foco durante digitação
      if (isFocusedRef.current) {
        e.stopPropagation();
      }
      props.onKeyDown?.(e);
    }, [props.onKeyDown]);
    
    const handleKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Prevenir perda de foco durante digitação
      if (isFocusedRef.current) {
        e.stopPropagation();
      }
      props.onKeyUp?.(e);
    }, [props.onKeyUp]);
    
    // Efeito para manter foco
    React.useEffect(() => {
      if (preventRefocus && isFocusedRef.current && textareaRef.current) {
        const element = textareaRef.current;
        if (document.activeElement !== element) {
          debugFocus(element, 'REFOCUS_ATTEMPT');
          forceFocus(element);
        }
      }
    }, [preventRefocus]); // Adicionar dependência para evitar execução excessiva
    
    // Efeito para prevenir perda de foco durante mudanças de valor
    React.useEffect(() => {
      if (isFocusedRef.current && textareaRef.current && preventRefocus) {
        const element = textareaRef.current;
        const currentValue = element.value;
        if (currentValue !== lastValueRef.current) {
          // Restaurar foco se o valor mudou e o elemento perdeu foco
          setTimeout(() => {
            if (document.activeElement !== element && isFocusedRef.current) {
              element.focus();
            }
          }, 0);
        }
      }
    }, [props.value, preventRefocus]);

    return (
      <textarea
        ref={textareaRef}
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

FocusStableTextarea.displayName = "FocusStableTextarea";

export { FocusStableTextarea };
