import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || '',
);

interface PendingContribution {
  id: string;
  contributor_name: string;
  story_text: string;
  media_urls: string[];
  target_event_id: string;
  created_at: string;
}

export default function OwnerModerationQueue({ lifeRecordId }: { lifeRecordId: string }) {
  const [items, setItems] = useState<PendingContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pending_contributions')
      .select('id, contributor_name, story_text, media_urls, target_event_id, created_at')
      .eq('life_record_id', lifeRecordId)
      .eq('status', 'PENDING_APPROVAL')
      .order('created_at', { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }, [lifeRecordId]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (contribution: PendingContribution) => {
    setActingOn(contribution.id);
    const { data: event } = await supabase
      .from('timeline_events')
      .select('media_urls')
      .eq('id', contribution.target_event_id)
      .single();

    await supabase
      .from('timeline_events')
      .update({
        media_urls: [...(event?.media_urls ?? []), ...contribution.media_urls],
      })
      .eq('id', contribution.target_event_id);

    await supabase
      .from('pending_contributions')
      .update({ status: 'APPROVED' })
      .eq('id', contribution.id);

    setActingOn(null);
    await load();
  };

  const reject = async (contribution: PendingContribution) => {
    setActingOn(contribution.id);
    await supabase.from('pending_contributions').update({ status: 'REJECTED' }).eq('id', contribution.id);
    setActingOn(null);
    await load();
  };

  if (loading) return <p className="text-sm text-gray-500">Loading queue…</p>;
  if (items.length === 0) return <p className="text-sm text-gray-500">No pending contributions right now.</p>;

  return (
    <div className="w-full max-w-full box-border space-y-3">
      <h3 className="text-base font-semibold text-[#2D3748]">Pending contributions ({items.length})</h3>
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-gray-200 p-4 space-y-2">
          <p className="text-sm font-medium text-[#2D3748]">{item.contributor_name}</p>
          <p className="text-sm text-gray-700">{item.story_text}</p>
          {item.media_urls.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {item.media_urls.map((url) => (
                <img key={url} src={url} alt="Submitted media" className="h-20 w-20 object-cover rounded-lg" />
              ))}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button onClick={() => reject(item)} disabled={actingOn === item.id} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm">
              Reject
            </button>
            <button onClick={() => approve(item)} disabled={actingOn === item.id} className="flex-1 px-3 py-2 rounded-lg bg-[#2D3748] text-white text-sm font-medium">
              {actingOn === item.id ? 'Working…' : 'Approve'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
