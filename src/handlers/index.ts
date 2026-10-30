import { HandlerRegistry } from "../core/registry";
import { rawHandler } from "./raw/rawHandler";

export const registry = new HandlerRegistry().register(rawHandler);