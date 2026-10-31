import Papa from 'papaparse';

export interface CsvState {
  rows: string[][];
  delimiter: string;
}

export function parseCsv(text: string): CsvState {
  const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
  const parsed = result.data;
  const width = parsed.reduce((max, row) => Math.max(max, row.length), 1);

  const rows = parsed.length
    ? parsed.map((row) => [
        ...row,
        ...Array<string>(width - row.length).fill(''),
      ])
    : [['']];

  return { rows: rows, delimiter: result.meta.delimiter || ',' };
}

export function serializeCsv(state: CsvState): string {
  return Papa.unparse(state.rows, { delimiter: state.delimiter });
}
