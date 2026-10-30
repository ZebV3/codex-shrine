import { useState } from "react";
import type { FileHandler, FileKind } from "./core/types"
import { useUnsavedWarning } from "./ui/useUnsavedWarning";
import { FileValidationError, validateFile } from "./core/validate";
import { detectKind } from "./core/detect";
import { registry } from "./handlers";
import { downloadBlob } from "./utils/download";
import { Dropzone } from "./ui/Dropzone";

interface OpenDoc {
  name: string;
  kind: FileKind;
  handler: FileHandler;
  state: unknown
};

export default function App() {
  const [doc, setDoc] = useState<OpenDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useUnsavedWarning(doc !== null);

  async function handeFile (file: File) {
    setError(null);
    setBusy(true);

    try {
      validateFile(file);
      const kind = await detectKind(file);
      const handler = registry.resolve(kind);

      if (!handler) throw new FileValidationError('File type cannot be processed.');

      const state = await handler.load(file);
      setDoc({name: file.name, kind, handler, state});
    } catch (e) {
      setError(e instanceof FileValidationError ? e.message: 'Could not open this file');
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    if (!doc) return;
    downloadBlob(await doc.handler.export(doc.state), doc.name);
  }

  return (
    <main>
      <h1>File Editor</h1>
      <p>Files stay in your browser. Nothing is uploaded or stored anywhere.</p>

      <Dropzone onFile={handeFile} disabled={busy} />
      {error && <p role="alert">{error}</p>}

      {doc && (
        <section>
          <h2>{doc.name}</h2>
          <p>Detected type: {doc.kind}</p>
          <button type="button" onClick={handleDownload}>Download</button>
          <button type="button" onClick={() => setDoc(null)}>Close</button>
        </section>
      )}
    </main>
  );
}