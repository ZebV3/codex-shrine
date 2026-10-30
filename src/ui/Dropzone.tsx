import { useEffect, useRef, useState } from 'react';

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function Dropzone({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const depth = useRef(0); // drag enter/leave fire for child elements too
  const [over, setOver] = useState(false);

  // Guard: a drop anywhere on the page must never open the file in the browser
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault();
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
  }, []);

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`dropzone${over ? ' over' : ''}`}
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current += 1;
        setOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        depth.current -= 1;
        if (depth.current <= 0) {
          depth.current = 0;
          setOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        depth.current = 0;
        setOver(false);
        if (!disabled) pick(e.dataTransfer.files);
      }}
    >
      <p>Drag a file here, or</p>
      <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()}>
        Choose a file
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}