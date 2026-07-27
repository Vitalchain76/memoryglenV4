import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { uploadMedia } from '@/lib/memorialsApi';
import type { MediaRow } from '@/lib/memorialsApi';

interface MediaUploaderProps {
  memorialId: string;
  ownerId: string;
  onUploaded: (media: MediaRow) => void;
}

/**
 * Upload control for a memorial gallery.
 *
 * Renders nothing at all unless the signed-in user owns this memorial, so it
 * can be dropped into any gallery without a surrounding permission check. The
 * public, signed-out view is untouched.
 */
export default function MediaUploader({ memorialId, ownerId, onUploaded }: MediaUploaderProps) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.id !== ownerId) return null;

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    const { media, error: err } = await uploadMedia(memorialId, user.id, file);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    if (media) onUploaded(media);
  };

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    void handle(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="mt-8">
      <button
        type="button"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="card-well flex min-h-32 w-full flex-col items-center justify-center gap-3 border border-dashed border-[color:var(--line)] p-8 text-center transition-colors hover:border-brass disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 size={24} className="animate-spin text-brass" aria-hidden />
            <span className="text-sm text-soft">Adding your photograph…</span>
          </>
        ) : (
          <>
            <ImagePlus size={24} className="text-brass" aria-hidden />
            <span className="text-sm text-soft">
              Add a photograph — drop one here, or{' '}
              <span className="font-medium text-evergreen">choose one</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-soft">
              <Camera size={12} aria-hidden /> Your phone&rsquo;s camera works too
            </span>
          </>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => void handle(e.target.files?.[0])}
        aria-label="Add a photograph to this memorial"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {error}
        </p>
      )}
    </div>
  );
}
