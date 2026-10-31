import { describe, it, expect } from 'vitest';
import { textHandler } from './textHandler';

describe('textHandler', () => {
  it('round-trips unicode text', async () => {
    const state = await textHandler.load(new File(['héllo\nwörld ✓'], 'a.txt'));
    const blob = await textHandler.export(state);
    expect(await blob.text()).toBe('héllo\nwörld ✓');
  });
});
