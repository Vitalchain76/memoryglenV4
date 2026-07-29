import { useEffect, useState } from 'react';
import { PlusCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Contribution {
  id: string;
  contributor_name: string;
  amount: number;
  currency: string;
  expense_category: string;
  created_at: string;
}

const CATEGORIES = ['General', 'Catering', 'Venue & Logistics', 'Transport'] as const;

/**
 * FamilyFinanceTracker — a transparent, shared ledger of contributions towards
 * a family's funeral and anniversary costs. Reads are public; inserts require
 * an authenticated session (enforced by RLS) to protect against fraud.
 */
export default function FamilyFinanceTracker({ memorialSlug }: { memorialSlug: string }) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('General');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorialSlug]);

  async function fetchContributions() {
    if (!supabase) return;
    const { data } = await supabase
      .from('family_contributions')
      .select('*')
      .eq('memorial_slug', memorialSlug)
      .order('created_at', { ascending: false });
    if (data) setContributions(data as Contribution[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);
    if (!supabase || !trimmedName || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    setSaving(true);
    const { error } = await supabase.from('family_contributions').insert({
      memorial_slug: memorialSlug,
      contributor_name: trimmedName,
      amount: parsedAmount,
      currency: 'USD',
      expense_category: category,
    });
    setSaving(false);

    if (!error) {
      setName('');
      setAmount('');
      fetchContributions();
    }
  }

  const totalRaised = contributions.reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="card-well p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="type-h3 text-body">Family Expense &amp; Contribution Tracker</h3>
          <p className="mt-1 text-sm text-soft">
            Transparent financial support for services and logistics.
          </p>
        </div>
        <div className="text-right">
          <span className="type-meta block text-xs uppercase text-soft">Total Raised</span>
          <span className="type-stat text-brass">${totalRaised.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input
          type="text"
          placeholder="Contributor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-sm border border-[color:var(--line)] bg-surface px-3 py-2 text-sm text-body"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="rounded-sm border border-[color:var(--line)] bg-surface px-3 py-2 text-sm text-body"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-sm border border-[color:var(--line)] bg-surface px-3 py-2 text-sm text-body"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="btn btn-evergreen inline-flex min-h-12 items-center justify-center gap-1.5 px-4 text-sm disabled:opacity-60"
        >
          <PlusCircle size={16} aria-hidden /> {saving ? 'Adding…' : 'Add Entry'}
        </button>
      </form>

      <ul className="max-h-60 divide-y divide-[color:var(--line)] overflow-y-auto">
        {contributions.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <ShieldCheck size={16} className="flex-none text-evergreen" aria-hidden />
              <span className="truncate font-semibold text-body">{item.contributor_name}</span>
              <span className="flex-none rounded-full bg-sage/15 px-2 py-0.5 text-xs text-soft">
                {item.expense_category}
              </span>
            </span>
            <span className="flex-none font-semibold text-body tabular-nums">
              ${Number(item.amount).toFixed(2)}
            </span>
          </li>
        ))}
        {contributions.length === 0 && (
          <li className="py-6 text-center text-sm text-soft">No contributions logged yet.</li>
        )}
      </ul>
    </div>
  );
}
