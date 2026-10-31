import type { EditorProps } from '../../core/types';
import type { CsvState } from './csvParser';

export function CsvEditor({ state, onChange }: EditorProps<CsvState>) {
  const { rows } = state;
  const cols = rows[0]?.length ?? 1;

  const blankRow = () => Array<string>(cols).fill('');
  const update = (next: string[][]) => onChange({ ...state, rows: next });

  const setCell = (r: number, c: number, value: string) =>
    update(
      rows.map((row, i) =>
        i === r ? row.map((cell, j) => (j === c ? value : cell)) : row,
      ),
    );

  const addRow = () => update([...rows, blankRow()]);

  const deleteRow = (r: number) =>
    update(rows.length > 1 ? rows.filter((_, i) => i !== r) : [blankRow()]);

  const addColumn = () => update(rows.map((row) => [...row, '']));
  const deleteColumn = (c: number) => {
    if (cols <= 1) return;
    update(rows.map((row) => row.filter((_, j) => j !== c)));
  };

  return (
    <div className="csv-editor">
      <div className="csv-toolbar">
        <button type="button" onClick={addRow}>
          Add Row
        </button>
        <button type="button" onClick={addColumn}>
          Add Column
        </button>
      </div>
      <div className="csv-scroll">
        <table>
          <thead>
            <tr>
              <th />
              {Array.from({ length: cols }, (_, c) => (
                <th key={c}>
                  <button
                    type="button"
                    onClick={() => deleteColumn(c)}
                    aria-label={`Delete column ${c + 1}`}
                  >
                    X
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                <th scope="row">
                  {r + 1}{' '}
                  <button
                    type="button"
                    onClick={() => deleteRow(r)}
                    aria-label={`Delete row ${r + 1}`}
                  >
                    X
                  </button>
                </th>
                {row.map((cell, c) => (
                  <td key={c}>
                    <input
                      value={cell}
                      onChange={(e) => setCell(r, c, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
