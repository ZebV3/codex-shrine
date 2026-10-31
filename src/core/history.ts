export interface History<T> {
  past: T[];
  present: T;
  future: T[];
  at: number;
}

export const MAX_HISTORY = 200;
export const COALESCE_TEXT = 600;

export const createHistory = <T>(present: T): History<T> => ({
  past: [],
  present,
  future: [],
  at: 0,
});

export function commit<T>(h: History<T>, next: T, now: number): History<T> {
  if (next === h.present) return h;
  if (now - h.at < COALESCE_TEXT && h.past.length > 0)
    return { ...h, present: next, future: [], at: now };

  return {
    past: [...h.past, h.present].slice(-MAX_HISTORY),
    present: next,
    future: [],
    at: now,
  };
}

export function undo<T>(h: History<T>): History<T> {
  const previous = h.past.at(-1);
  if (previous === undefined) return h;

  return {
    past: h.past.slice(0, -1),
    present: previous,
    future: [h.present, ...h.future],
    at: 0,
  };
}

export function redo<T>(h: History<T>): History<T> {
  const [next, ...rest] = h.future;
  if (next === undefined) return h;

  return { past: [...h.past, h.present], present: next, future: rest, at: 0 };
}
