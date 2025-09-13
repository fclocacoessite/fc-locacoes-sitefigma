import { useCallback } from 'react'

/**
 * Hook simplificado para gerenciar o foco de campos de entrada
 */
export function useFocusManager() {
  const handleFocus = useCallback((element: HTMLInputElement | HTMLTextAreaElement) => {
    // Apenas garantir que o elemento tenha foco
    element.focus()
  }, [])

  const handleBlur = useCallback(() => {
    // Não fazer nada no blur para manter o foco
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevenir perda de foco durante digitação
    e.stopPropagation()
  }, [])

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    // Prevenir perda de foco durante digitação
    e.stopPropagation()
  }, [])

  return {
    handleFocus,
    handleBlur,
    handleKeyDown,
    handleKeyUp
  }
}
