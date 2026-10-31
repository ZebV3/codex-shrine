import { useState, type KeyboardEvent } from 'react';
import type { FileHandler, FileKind } from '../core/types';
import { useHistory } from '../core/useHistory';
import { useUnsavedWarning } from './useUnsavedWarning';
import { downloadBlob } from '../utils/download';

interface Props {
  name: string;
  kind: FileKind;
  handler: FileHandler;
  initialState: unknown;
  onClose: () => void;
}

export function EditorSession({
  name,
  kind,
  handler,
  initialState,
  onClose,
}: Props) {
  const { state, set, undo, redo, canUndo, canRedo } =
    useHistory<unknown>(initialState);
  const [savedState, setSavedState] = useState<unknown>(initialState);

  const dirty = state !== savedState;
  useUnsavedWarning(dirty);

  async function handleDownload() {
    downloadBlob(await handler.export(state), name);
    setSavedState(state);
  }

  function handleClose() {
    if (
      dirty &&
      !window.confirm(
        'You have unsaved changes. Close without downloading file?',
      )
    )
      return;
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!(e.ctrlKey || e.metaKey)) return;

    const key = e.key.toLowerCase();
    if (key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    } else if (key === 'y') {
      e.preventDefault();
      redo();
    }
  }

  return (
    <section onKeyDown={handleKeyDown}>
      <h2>{name}</h2>
      <p>
        Type: {kind}
        {dirty && ' . unsaved changes'}
      </p>
      <div>
        <button type="button" onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button type="button" onClick={redo} disabled={!canRedo}>
          Redo
        </button>
        <button type="button" onClick={handleDownload}>
          Download
        </button>
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </div>
      <handler.Editor state={state} onChange={set} />
    </section>
  );
}
