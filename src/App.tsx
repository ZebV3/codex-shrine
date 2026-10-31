import { useState } from 'react';
import { detectKind } from './core/detect';
import type { FileHandler, FileKind } from './core/types';
import { FileValidationError, validateFile } from './core/validate';
import { registry } from './handlers';
import { Dropzone } from './ui/Dropzone';
import { EditorSession } from './ui/EditorSession';
import { usePreventDropFile } from './ui/preventDropFile';

interface OpenDoc {
  id: string;
  name: string;
  kind: FileKind;
  handler: FileHandler;
  state: unknown;
}

export default function App() {
  const [doc, setDoc] = useState<OpenDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  usePreventDropFile();

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      validateFile(file);
      const kind = await detectKind(file);
      const handler = registry.resolve(kind);
      console.log(registry);
      console.log({
        kind,
        handlerId: handler?.id,
        hasEditor: typeof handler?.Editor,
      });
      if (!handler)
        throw new FileValidationError('No handler for this file type yet.');
      const state = await handler.load(file);
      setDoc({
        id: crypto.randomUUID(),
        name: file.name,
        kind,
        handler,
        state,
      });
    } catch (e) {
      setError(
        e instanceof FileValidationError
          ? e.message
          : 'Could not open this file.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>File Editor</h1>
      <p>Files stay in your browser. Nothing is uploaded.</p>

      {doc ? (
        <EditorSession
          key={doc.id}
          name={doc.name}
          kind={doc.kind}
          handler={doc.handler}
          initialState={doc.state}
          onClose={() => setDoc(null)}
        />
      ) : (
        <Dropzone onFile={handleFile} disabled={busy} />
      )}
      {error && <p role="alert">{error}</p>}
    </main>
  );
}
