import { describe, it, expect } from 'vitest';
import { parseCsv, serializeCsv } from './csvParser';

describe('csv', () => {
  it('parses quoted fields', () => {
    expect(parseCsv('a,"b,c"\n1,2').rows).toEqual([
      ['a', 'b,c'],
      ['1', '2'],
    ]);
  });

  it('pads ragged rows', () => {
    expect(parseCsv('a,b,c\n1').rows[1]).toEqual(['1', '', '']);
  });

  it('keeps the detected delimiter', () => {
    const state = parseCsv('a;b\n1;2');
    expect(state.delimiter).toBe(';');
    expect(serializeCsv(state)).toBe('a;b\r\n1;2');
  });

  it('round-trips quotes and commas', () => {
    const original = parseCsv('name,note\n"Smith, J","said ""hi"""');
    expect(parseCsv(serializeCsv(original)).rows).toEqual(original.rows);
  });

  it('handles an empty file', () => {
    expect(parseCsv('').rows).toEqual([['']]);
  });
});
