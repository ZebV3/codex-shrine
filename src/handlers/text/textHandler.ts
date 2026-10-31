import { defineHandler } from '../../core/types';
import { TextEditor } from './TextEditor';

export interface TextState {
  text: string;
}

export const textHandler = defineHandler<TextState>({
  id: 'text',
  supports: (kind) => kind === 'text',
  load: async (file) => ({ text: await file.text() }),
  export: async (state) =>
    new Blob([state.text], { type: 'text/plain;charset=utf-8' }),
  Editor: TextEditor,
});
