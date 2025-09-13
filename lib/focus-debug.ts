/**
 * Utilitário para debug de problemas de foco
 */

export function debugFocus(element: HTMLInputElement | HTMLTextAreaElement, event: string) {
  console.log(`🔍 Focus Debug [${event}]:`, {
    element: element.tagName,
    id: element.id,
    name: element.name,
    value: element.value,
    activeElement: document.activeElement === element,
    isConnected: element.isConnected,
    parentElement: element.parentElement?.tagName,
    computedStyle: {
      position: getComputedStyle(element).position,
      zIndex: getComputedStyle(element).zIndex,
      display: getComputedStyle(element).display,
      visibility: getComputedStyle(element).visibility,
    }
  });
}

export function preventFocusLoss(element: HTMLInputElement | HTMLTextAreaElement) {
  const originalBlur = element.blur;
  
  element.blur = function() {
    console.log('🚫 Blur prevented on:', element.id || element.name);
    // Não chamar o blur original
  };
  
  // Restaurar após um tempo
  setTimeout(() => {
    element.blur = originalBlur;
  }, 1000);
}

export function forceFocus(element: HTMLInputElement | HTMLTextAreaElement) {
  if (element && element.focus) {
    element.focus();
    console.log('🎯 Focus forced on:', element.id || element.name);
  }
}
