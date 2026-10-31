import { HandlerRegistry } from '../core/registry';
import { csvHandler } from './csv/csvHandler';
import { rawHandler } from './raw/rawHandler';
import { textHandler } from './text/textHandler';

export const registry = new HandlerRegistry()
  .register(textHandler)
  .register(csvHandler)
  .register(rawHandler);
