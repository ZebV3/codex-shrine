import type { ComponentType } from 'react';

export type FileKind = 'pdf' | 'csv' | 'text' | 'unknown';

export interface FileHandler<TState = unknown> {
  readonly id: string;
  supports(kind: FileKind): boolean;
  load(file: File): Promise<TState>;
  export(state: TState): Promise<Blob>;
  readonly Editor: ComponentType<EditorProps<TState>>;
}

export interface EditorProps<TState> {
  state: TState;
  onChange: (next: TState) => void;
}

export function defineHandler<TState>(
  handler: FileHandler<TState>,
): FileHandler {
  return handler as unknown as FileHandler;
}
