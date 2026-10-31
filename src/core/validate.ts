export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export class FileValidationError extends Error {}

export function validateFile(file: Pick<File, 'name' | 'size'>): void {
  if (file.size === 0) throw new FileValidationError('The file is empty');
  if (file.size > MAX_FILE_SIZE)
    throw new FileValidationError(
      `The file size is too large (max size: ${MAX_FILE_SIZE / 1024 / 1024} MB) `,
    );
}
