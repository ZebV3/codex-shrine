import { defineHandler } from '../../core/types';
import { RawEditor } from './RawEditor';

export interface RawState {
  name: string;
  mime: string;
  bytes: ArrayBuffer;
}

export const rawHandler = defineHandler<RawState>({
  id: 'raw',
  supports: () => true,
  async load(file) {
    return {
      name: file.name,
      mime: file.type,
      bytes: await file.arrayBuffer(),
    };
  },
  async export(state) {
    return new Blob([state.bytes], {
      type: state.mime || 'application/octet-stream',
    });
  },
  Editor: RawEditor,
});
