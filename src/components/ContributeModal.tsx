import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { validateImageHeader, sanitizeMediaUrl } from '@/lib/mediaUtils';

interface TimelineEventOption {
  id: string;
  title: string;
}

interface Props {
  lifeRecordId: string;
  targetEvents: TimelineEventOption[];
  onClose: () => void;
  onSubmitted: () => void;
}

/**
 * Strip all markup from user-supplied text using the browser's own HTML
 * parser, keeping only the resulting text content. This is the
 * dependency-free equivalent of DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
 * -- no <script>, event-handler attribute, or other markup can survive it.
 */
function sanitizePlainText(input: string, maxLength: number): string {
  const parsed = new DOMParser().parseFromString(input, 'text/html');
  const text = (parsed.body.textContent ?? '').replace(/\s+/g, ' ').trim();
  return text.slice(0, maxLength);
}

/**
 * Re-encode an image to WebP client-side via <canvas>, iteratively lowering
 * quality until it is under maxBytes (default 1.5MB). Replaces the
 * browser-image-compression package (not installed in this project) with
 * the browser's native canvas API, so no new npm dependency is required.
 */
async function compressImageToWebP(file: File, maxBytes = 1.5 * 1024 * 1024): Promise<File> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  const MAX_DIMENSION = 2048;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  let quality = 0.85;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob) break;
    if (blob.size <= maxBytes || quality <= 0.35) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
    }
    quality -= 0.15;
  }
  return file;
}

export default function ContributeModal({ lifeRecordId, targetEvents, onClose, onSubmitted }: Props) {
  const [contributorName, setContributorName] = useState('');
  const [targetEventId, setTargetEventId] = useState('');
  const [storyText, setStoryText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError('This site is not configured yet. Please try again later.');
      return;
    }
    if (!targetEventId) {
      setError('Please choose which memory this belongs to.');
      return;
    }
    if (!storyText.trim()) {
      setError('Please add a few words about the memory.');
      return;
    }

    setSubmitting(true);

    try {
      const mediaUrls: string[] = [];

      if (file) {
        if (!(await validateImageHeader(file))) {
          throw new Error('That file doesn’t look like a real photograph. Please choose a JPG, PNG, WEBP or HEIC image.');
        }
        const compressed = await compressImageToWebP(file);
        const path = `contributions/${lifeRecordId}/${crypto.randomUUID()}.webp`;
        const { error: uploadErr } = await supabase.storage
          .from('media')
          .upload(path, compressed, { contentType: 'image/webp' });

        if (uploadErr) throw uploadErr;

        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(path);
        mediaUrls.push(publicUrl.publicUrl);
      }

      if (mediaUrlInput.trim()) {
        const link = sanitizeMediaUrl(mediaUrlInput);
        if (!link.isValid) {
          throw new Error('That link doesn’t look like a supported photo or video URL.');
        }
        mediaUrls.push(link.sanitizedUrl);
      }

      const sanitizedStory = sanitizePlainText(storyText, 4000);
      const sanitizedName = sanitizePlainText(contributorName, 120) || 'Anonymous';

      const { error: insertErr } = await supabase.from('pending_contributions').insert({
        life_record_id: lifeRecordId,
        contributor_name: sanitizedName,
        target_event_id: targetEventId,
        story_text: sanitizedStory,
        media_urls: mediaUrls,
        status: 'PENDING_APPROVAL',
      });

      if (insertErr) throw insertErr;

      onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 box-border">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white p-5 box-border">
        <h2 className="text-lg font-semibold text-[#2D3748] mb-3">Contribute a memory</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-[#2D3748] mb-1">Your name (optional)</label>
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              className="w-full max-w-full box-border rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Anonymous"
            />
          </div>
          <div>
            <label className="block text-sm text-[#2D3748] mb-1">Which memory is this for?</label>
            <select
              value={targetEventId}
              onChange={(e) => setTargetEventId(e.target.value)}
              required
              className="w-full max-w-full box-border rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select a milestone...</option>
              {targetEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#2D3748] mb-1">Your memory</label>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              required
              rows={4}
              maxLength={4000}
              className="w-full max-w-full box-border rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Share what you remember..."
            />
          </div>
          <div>
            <label className="block text-sm text-[#2D3748] mb-1">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full max-w-full box-border text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-[#2D3748] mb-1">
              Or link to a photo / YouTube / Vimeo video (optional)
            </label>
            <input
              type="url"
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              placeholder="https://…"
              className="w-full max-w-full box-border rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-lg bg-[#2D3748] text-white text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
