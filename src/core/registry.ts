import type { FileHandler, FileKind } from "./types";

export class HandlerRegistry {
    private handlers: FileHandler[] = [];

    register(handler: FileHandler): this {
        this.handlers.push(handler);
        return this;
    }

    resolve(kind: FileKind): FileHandler | undefined {
        return this.handlers.find((h) => h.supports(kind));
    }
}