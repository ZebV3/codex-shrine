import { fileTypeFromBlob } from "file-type";
import type { FileKind } from "./types";

const MIME_TO_KIND: Record<string, FileKind> = {
    'application/pdf' : 'pdf'
};

async function looksLikeText(file: Blob): Promise<boolean> {
    const bytes = new Uint8Array(await file.slice(0, 8192).arrayBuffer());
    if (bytes.includes(0)) return false;

    try {
        new TextDecoder('utf-8', {fatal: true}).decode(bytes, {stream: true});
        return true;
    } catch {
        return false;
    }
}

export async function detectKind(file: File): Promise<FileKind> {
    const detected = await fileTypeFromBlob(file);
    if (detected) return MIME_TO_KIND[detected.mime] ?? 'unknown';

    const ext = file.name.split('.').pop()?.toLowerCase();
    if ((ext === 'txt' || ext === 'md' || ext === 'csv') && (await looksLikeText(file))) return ext === 'csv' ? 'csv' : 'text';
    return 'unknown';
}

