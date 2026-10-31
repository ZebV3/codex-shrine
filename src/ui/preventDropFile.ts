import { useEffect } from 'react';

export function usePreventDropFile(): void {
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault();

    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);

    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('dragover', prevent);
    };
  }, []);
}
