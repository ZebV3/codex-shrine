import type { EditorProps } from '../../core/types';
import type { TextState } from './textHandler';

export function TextEditor({ state, onChange }: EditorProps<TextState>) {
  return (
    <textarea
      className="text-editor"
      value={state.text}
      onChange={(e) => onChange({ text: e.target.value })}
      spellCheck={false}
      aria-label="File contents"
    />
  );
}
