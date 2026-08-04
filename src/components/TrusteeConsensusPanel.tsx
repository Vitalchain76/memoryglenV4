import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || '',
);

type LifeRecordStatus = 'ACTIVE' | 'PENDING_TRANSITION' | 'MEMORIAL';

interface Trustee {
  id: string;
  trustee_email: string;
  has_confirmed_transition: boolean;
}

interface Props {
  lifeRecordId: string;
}

export default function TrusteeConsensusPanel({ lifeRecordId }: Props) {
  const [status, setStatus] = useState<LifeRecordStatus | null>(null);
  const [threshold, setThreshold] = useState(2);
  const [commitAt, setCommitAt] = useState<string | null>(null);
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: record, error: recordErr } = await supabase
      .from('life_records')
      .select('status, transition_threshold, transition_commit_at')
      .eq('id', lifeRecordId)
      .single();

    if (recordErr) {
      setError(recordErr.message);
      return;
    }

    setStatus(record.status);
    setThreshold(record.transition_threshold);
    setCommitAt(record.transition_commit_at);

    const { data: trusteeRows } = await supabase
      .from('life_record_trustees')
      .select('id, trustee_email, has_confirmed_transition')
      .eq('life_record_id', lifeRecordId);

    setTrustees(trusteeRows ?? []);
  }, [lifeRecordId]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmedCount = trustees.filter((t) => t.has_confirmed_transition).length;

  const handleVeto = async () => {
    setBusy(true);
    setError(null);
    const { error: vetoErr } = await supabase.rpc('veto_transition', {
      p_life_record_id: lifeRecordId,
    });
    setBusy(false);
    if (vetoErr) {
      setError(vetoErr.message);
      return;
    }
    await load();
  };

  if (!status) return null;

  return (
    <section className="w-full max-w-full box-border rounded-xl border border-gray-200 p-4 space-y-3">
      <h3 className="text-base font-semibold text-[#2D3748]">Trustee status</h3>

      <p className="text-sm text-[#2D3748]">
        {confirmedCount} of {threshold} trustee confirmations received.
      </p>

      <ul className="space-y-1">
        {trustees.map((t) => (
          <li key={t.id} className="flex items-center justify-between text-sm">
            <span>{t.trustee_email}</span>
            <span className={t.has_confirmed_transition ? 'text-green-700' : 'text-gray-400'}>
              {t.has_confirmed_transition ? 'Confirmed' : 'Awaiting'}
            </span>
          </li>
        ))}
      </ul>

      {status === 'PENDING_TRANSITION' && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 space-y-2">
          <p className="text-sm font-medium text-amber-900">
            A transition to legacy mode is pending. If this was triggered in error, you can cancel it below.
            {commitAt && (
              <> It will take effect automatically on {new Date(commitAt).toLocaleString()} unless you veto it.</>
            )}
          </p>
          <button
            onClick={handleVeto}
            disabled={busy}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#2D3748] text-white text-sm font-medium disabled:opacity-50"
          >
            {busy ? 'Cancelling…' : "Cancel transition — I'm still here"}
          </button>
        </div>
      )}

      {status === 'MEMORIAL' && (
        <p className="text-sm text-gray-600">This Life Record has transitioned to legacy mode.</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}
