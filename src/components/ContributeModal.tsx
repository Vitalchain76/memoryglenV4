import { useState } from 'react';
import DOMPurify from 'dompurify';
import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || '',
);

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

export default function ContributeModal({ lifeRecordId, targetEvents, onClose, onSubmitted }: Props) {
  const [contributorName, setContributorName] = useState('');
  const [targetEventId, setTargetEventId] = useState('');
  const [storyText, setStoryText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        const compressed = await imageCompression(file, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2048,
          useWebWorker: true,
          fileType: 'image/webp',
        });

        const path = `contributions/${lifeRecordId}/${crypto.randomUUID()}.webp`;
        const { error: uploadErr } = await supabase.storage
          .from('media')
          .upload(path, compressed, { contentType: 'image/webp' });

        if (uploadErr) throw uploadErr;

        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(path);
        mediaUrls.push(publicUrl.publicUrl);
      }

      const sanitizedStory = DOMPurify.sanitize(storyText.trim(), { ALLOWED_TAGS: [] });
      const sanitizedName = DOMPurify.sanitize(contributorName.trim() || 'Anonymous', { ALLOWED_TAGS: [] });

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
              <option value="">Select a milestone…</option>
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
              className="w-full max-w-full box-border rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Share what you remember…"
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
              {submitting ? 'Submitting…' : 'Submit for review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
