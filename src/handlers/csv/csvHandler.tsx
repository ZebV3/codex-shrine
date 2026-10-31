import { defineHandler } from '../../core/types';
import { CsvEditor } from './CsvEditor';
import { parseCsv, serializeCsv, type CsvState } from './csvParser';

export const csvHandler = defineHandler<CsvState>({
  id: 'csv',
  supports: (kind) => kind === 'csv',
  load: async (file) => parseCsv(await file.text()),
  export: async (state) =>
    new Blob([serializeCsv(state)], { type: 'text/csv:charset=utf-8' }),
  Editor: CsvEditor,
});
