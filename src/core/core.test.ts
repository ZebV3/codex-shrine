import { describe, it, expect } from 'vitest';
import { detectKind } from './detect';
import { validateFile, MAX_FILE_SIZE, FileValidationError } from './validate';
import { HandlerRegistry } from './registry';
import { rawHandler } from '../handlers/raw/rawHandler';

const pdfBytes = new Uint8Array([
  0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34,
]);

describe('detectKind', () => {
  it('detects PDFs by content, ignoring a wrong extension', async () => {
    expect(await detectKind(new File([pdfBytes], 'looks-like.txt'))).toBe(
      'pdf',
    );
  });
  it('detects CSV and text', async () => {
    expect(await detectKind(new File(['a,b\n1,2'], 'x.csv'))).toBe('csv');
    expect(await detectKind(new File(['hello'], 'x.txt'))).toBe('text');
  });
  it('rejects binary data posing as text', async () => {
    expect(
      await detectKind(new File([new Uint8Array([0, 1, 2, 3])], 'x.txt')),
    ).toBe('unknown');
  });
});

describe('validateFile', () => {
  it('rejects empty and oversized files', () => {
    expect(() => validateFile({ name: 'a', size: 0 })).toThrow(
      FileValidationError,
    );
    expect(() => validateFile({ name: 'a', size: MAX_FILE_SIZE + 1 })).toThrow(
      FileValidationError,
    );
    expect(() => validateFile({ name: 'a', size: 10 })).not.toThrow();
  });
});

describe('registry', () => {
  it('resolves the first matching handler', () => {
    const registry = new HandlerRegistry().register(rawHandler);
    expect(registry.resolve('pdf')?.id).toBe('raw');
  });
});
