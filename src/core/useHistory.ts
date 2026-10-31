import { useCallback, useState } from 'react';
import { commit, createHistory, undo as undoH, redo as redoH } from './history';

export function useHistory<T>(initial: T) {
  const [h, setH] = useState(() => createHistory(initial));
  const set = useCallback((next: T) => {
    const now = Date.now();

    setH((s) => commit(s, next, now));
  }, []);

  const undo = useCallback(() => setH(undoH), []);
  const redo = useCallback(() => setH(redoH), []);

  return {
    state: h.present,
    set,
    undo,
    redo,
    canUndo: h.past.length > 0,
    canRedo: h.future.length > 0,
  };
}
