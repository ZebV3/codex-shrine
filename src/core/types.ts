export type FileKind = 'pdf' | 'csv' | 'text' | 'unknown';

export interface FileHandler<TState = unknown> {
    readonly id: string;
    supports(kind: FileKind): boolean;
    load(file: File): Promise<TState>;
    export(state: TState): Promise<Blob>;
}