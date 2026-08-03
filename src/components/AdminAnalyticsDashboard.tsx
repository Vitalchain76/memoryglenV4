import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { getDailyAnalytics } from '@/lib/phase2Api';
import type { DailyAnalyticsRow } from '@/lib/phase2Api';

type Platform = 'LIVINGGLEN' | 'MEMORYGLEN';

interface ChartPoint {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
}

function aggregateByDate(rows: DailyAnalyticsRow[]): ChartPoint[] {
  const byDate = new Map<string, ChartPoint>();
  for (const row of rows) {
    const existing = byDate.get(row.visit_date) ?? { date: row.visit_date, pageViews: 0, uniqueVisitors: 0 };
    existing.pageViews += row.page_views;
    existing.uniqueVisitors += row.unique_visitors;
    byDate.set(row.visit_date, existing);
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Operations dashboard for daily_site_analytics. Reads through the
 * get_daily_analytics() RPC (admin-gated server-side, see the Phase 2/3
 * migration) rather than selecting the table directly, so this component
 * never needs -- and never receives -- the service_role key.
 */
export default function AdminAnalyticsDashboard() {
  const [platform, setPlatform] = useState<Platform>('LIVINGGLEN');
  const [rows, setRows] = useState<DailyAnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDailyAnalytics(platform, 30).then(({ data, error: err }) => {
      if (cancelled) return;
      if (err) setError(err);
      else {
        setRows(data ?? []);
        setError(null);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [platform]);

  const chartData = useMemo(() => aggregateByDate(rows), [rows]);
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          acc.pageViews += row.page_views;
          acc.uniqueVisitors += row.unique_visitors;
          return acc;
        },
        { pageViews: 0, uniqueVisitors: 0 },
      ),
    [rows],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Traffic -- last 30 days</h2>
        <div className="inline-flex rounded-lg border border-[color:var(--line)] p-1">
          {(['LIVINGGLEN', 'MEMORYGLEN'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                platform === p ? 'bg-brass text-white' : 'text-soft'
              }`}
            >
              {p === 'LIVINGGLEN' ? 'LivingGlen' : 'MemoryGlen'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="card-well p-4">
          <p className="text-sm text-soft">Page views</p>
          <p className="text-2xl font-semibold">{totals.pageViews.toLocaleString()}</p>
        </div>
        <div className="card-well p-4">
          <p className="text-sm text-soft">Unique visitors</p>
          <p className="text-2xl font-semibold">{totals.uniqueVisitors.toLocaleString()}</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-soft">Loading analytics...</p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pageViews" name="Page views" stroke="#b08d57" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="uniqueVisitors" name="Unique visitors" stroke="#4b5563" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
