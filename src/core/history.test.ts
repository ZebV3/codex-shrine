import { describe, it, expect } from 'vitest';
import { COALESCE_TEXT, commit, createHistory, redo, undo } from './history';

describe('history', () => {
  it('undoes and redoes', () => {
    let h = createHistory('a');
    h = commit(h, 'b', 1000);
    h = commit(h, 'c', 1000 + COALESCE_TEXT + 1);
    h = undo(h);
    expect(h.present).toBe('b');
    h = undo(h);
    expect(h.present).toBe('a');
    h = redo(h);
    expect(h.present).toBe('b');
  });

  it('merges rapid edits into one undo step', () => {
    let h = createHistory('a');
    h = commit(h, 'b', 1000);
    h = commit(h, 'bc', 1100);
    h = commit(h, 'bcd', 1200);
    expect(undo(h).present).toBe('a');
  });

  it('clears redo after a new edit', () => {
    let h = createHistory('a');
    h = commit(h, 'b', 1000);
    h = undo(h);
    h = commit(h, 'x', 5000);
    expect(h.future).toEqual([]);
  });

  it('ignores identical state', () => {
    const h = createHistory('a');
    expect(commit(h, 'a', 1000)).toBe(h);
  });
});
