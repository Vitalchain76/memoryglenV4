import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, Download, Lock, Maximize2, ShieldCheck, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import StatBand from '@/components/StatBand';
import TierGate from '@/components/TierGate';

/* ================= Tree data ================= */

interface TreeNode {
  id: string;
  name: string;
  years?: string;
  x: number;
  y: number;
  /** stone = deceased · living = active profile (evergreen ring) */
  kind: 'stone' | 'living';
  relation: string;
  glens: string[];
  legacyMember?: boolean;
  small?: boolean;
}

interface TreeEdge {
  from: string;
  to: string;
  /** solid brass = this glen · dotted sage = cross-glen */
  style: 'solid' | 'dotted';
  /** generation order — staggers the draw-on animation */
  gen: number;
}

const NODES: TreeNode[] = [
  { id: 'samuel', name: 'Samuel Peters', years: '1931–2001', x: 340, y: 70, kind: 'stone', relation: 'Father of John', glens: ['Peters Family Glen'] },
  { id: 'ruth', name: 'Ruth Peters', years: '1935–2011', x: 560, y: 70, kind: 'stone', relation: 'Mother of John', glens: ['Peters Family Glen'] },
  { id: 'james', name: 'James Peters', years: '1961–2019', x: 170, y: 230, kind: 'stone', relation: 'Brother of John', glens: ['Peters Family Glen'] },
  { id: 'john', name: 'John Peters', years: '1958–2026', x: 400, y: 230, kind: 'stone', relation: 'The remembered', glens: ['Peters Family Glen'] },
  { id: 'grace', name: 'Grace Peters', years: 'b. 1960', x: 580, y: 230, kind: 'living', relation: 'Wife of John', glens: ['Peters Family Glen'], legacyMember: true },
  { id: 'david', name: 'David Peters', years: 'b. 1986', x: 250, y: 400, kind: 'living', relation: 'Son of John & Grace · Harare', glens: ['Peters Family Glen', 'Chiweshe Family Glen'], legacyMember: true },
  { id: 'sarah', name: 'Sarah Miller', years: 'b. 1988', x: 500, y: 400, kind: 'living', relation: 'Daughter of John & Grace · London', glens: ['Peters Family Glen', 'Miller Family Glen'], legacyMember: true },
  { id: 'michael', name: 'Michael Peters', years: 'b. 1991', x: 720, y: 400, kind: 'living', relation: 'Son of John & Grace · Johannesburg', glens: ['Peters Family Glen'] },
  { id: 'thomas', name: 'Thomas Miller', years: 'b. 1987', x: 660, y: 520, kind: 'living', relation: 'Husband of Sarah', glens: ['Miller Family Glen'] },
  { id: 'emma', name: 'Emma Miller', years: 'b. 2017', x: 560, y: 620, kind: 'living', relation: 'Daughter of Sarah & Thomas', glens: ['Miller Family Glen', 'Peters Family Glen'], small: true },
  { id: 'jack', name: 'Jack Miller', years: 'b. 2020', x: 720, y: 620, kind: 'living', relation: 'Son of Sarah & Thomas', glens: ['Miller Family Glen', 'Peters Family Glen'], small: true },
  // Grandchildren cluster (7 across 3 countries — Emma & Jack included)
  { id: 'tariro', name: 'Tariro', years: 'b. 2012', x: 140, y: 520, kind: 'living', relation: 'Child of David · Harare', glens: ['Peters Family Glen'], small: true },
  { id: 'nyasha', name: 'Nyasha', years: 'b. 2015', x: 230, y: 545, kind: 'living', relation: 'Child of David · Harare', glens: ['Peters Family Glen'], small: true },
  { id: 'kuda', name: 'Kuda', years: 'b. 2016', x: 820, y: 520, kind: 'living', relation: 'Child of Michael · Johannesburg', glens: ['Peters Family Glen'], small: true },
  { id: 'ruva', name: 'Ruva', years: 'b. 2019', x: 880, y: 570, kind: 'living', relation: 'Child of Michael · Johannesburg', glens: ['Peters Family Glen'], small: true },
  { id: 'simba', name: 'Simba', years: 'b. 2014', x: 60, y: 570, kind: 'living', relation: 'Grandchild · Toronto', glens: ['Peters Family Glen'], small: true },
];

/** The pending cross-glen memorial node (Section 4 demo). */
const PENDING_NODE = { id: 'james-memorial', name: 'James Peters', years: '1961–2019', x: 60, y: 340 };

const EDGES: TreeEdge[] = [
  { from: 'samuel', to: 'john', style: 'solid', gen: 0 },
  { from: 'ruth', to: 'john', style: 'solid', gen: 0 },
  { from: 'samuel', to: 'james', style: 'solid', gen: 0 },
  { from: 'john', to: 'grace', style: 'solid', gen: 1 },
  { from: 'john', to: 'david', style: 'solid', gen: 1 },
  { from: 'john', to: 'sarah', style: 'solid', gen: 1 },
  { from: 'john', to: 'michael', style: 'solid', gen: 1 },
  { from: 'david', to: 'tariro', style: 'solid', gen: 2 },
  { from: 'david', to: 'nyasha', style: 'solid', gen: 2 },
  { from: 'michael', to: 'kuda', style: 'solid', gen: 2 },
  { from: 'michael', to: 'ruva', style: 'solid', gen: 2 },
  { from: 'david', to: 'simba', style: 'dotted', gen: 2 },
  // Cross-glen (Miller) — dotted sage
  { from: 'sarah', to: 'thomas', style: 'dotted', gen: 2 },
  { from: 'thomas', to: 'emma', style: 'dotted', gen: 3 },
  { from: 'thomas', to: 'jack', style: 'dotted', gen: 3 },
];

const NODE_MAP = new Map(NODES.map((n) => [n.id, n]));

function edgePath(from: TreeNode, to: { x: number; y: number }): string {
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

/* ================= Tree canvas ================= */

function TreeCanvas({
  linkConfirmed,
  onSelect,
  selected,
}: {
  linkConfirmed: boolean;
  onSelect: (node: TreeNode) => void;
  selected: TreeNode | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  const [focusIdx, setFocusIdx] = useState(0);

  const clamp = (k: number) => Math.min(1.4, Math.max(0.6, k));

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setView((v) => ({ ...v, k: clamp(v.k - Math.sign(e.deltaY) * 0.1) }));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setView((v) => ({
      ...v,
      x: drag.current!.vx + (e.clientX - drag.current!.px),
      y: drag.current!.vy + (e.clientY - drag.current!.py),
    }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const fit = () => setView({ x: 0, y: 0, k: 1 });
  const centerJohn = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 900;
    const h = rect?.height ?? 520;
    setView({ x: w / 2 - 400, y: h / 2 - 230, k: 1 });
  };

  /** Flat keyboard traversal: arrows move through nodes, Enter opens the card. */
  const onTreeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = (focusIdx + dir + NODES.length) % NODES.length;
    setFocusIdx(next);
    onSelect(NODES[next]);
  };

  return (
    <div className="relative">
      {/* Legend card — top right */}
      <div className="absolute right-4 top-4 z-10 rounded-sm bg-surface/95 p-4 text-xs shadow-raised">
        <p className="type-meta mb-2 text-soft">LEGEND</p>
        <ul className="space-y-1.5 text-body">
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-6 bg-brass" /> This glen (Peters Family Glen)
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0 w-6 border-t-2 border-dotted border-sage" /> Cross-glen links (family beyond)
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 rounded-full border border-dashed border-brass" /> Pending link — awaiting guardian confirmation
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 rounded-full border-2 border-evergreen" /> Living member · active profile
          </li>
        </ul>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <button type="button" onClick={fit} className="flex min-h-12 items-center gap-2 rounded-sm bg-surface px-4 text-xs font-medium text-body shadow-raised transition-colors hover:bg-well">
          <Maximize2 size={14} aria-hidden /> Fit
        </button>
        <button type="button" onClick={centerJohn} className="flex min-h-12 items-center gap-2 rounded-sm bg-surface px-4 text-xs font-medium text-body shadow-raised transition-colors hover:bg-well">
          <Crosshair size={14} aria-hidden /> Center on John
        </button>
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label="Interactive Peters family tree. Use arrow keys to move between family members."
        tabIndex={0}
        onKeyDown={onTreeKeyDown}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="h-[560px] cursor-grab touch-none overflow-hidden rounded-sm border border-[color:var(--line)] bg-parchment active:cursor-grabbing"
        style={{ backgroundImage: 'url(/texture-grain.png)', backgroundSize: '512px' }}
      >
        <svg
          viewBox="0 0 960 680"
          className="h-full w-full"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
          aria-hidden
        >
          {/* Edges — grow from root outward (1.5s total, staggered by generation) */}
          {EDGES.map((e) => {
            const from = NODE_MAP.get(e.from)!;
            const to = NODE_MAP.get(e.to)!;
            return (
              <motion.path
                key={`${e.from}-${e.to}`}
                d={edgePath(from, to)}
                fill="none"
                stroke={e.style === 'solid' ? '#C4A24C' : '#8FA896'}
                strokeWidth={e.style === 'solid' ? 1.5 : 1.25}
                strokeDasharray={e.style === 'dotted' ? '1 6' : undefined}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: e.gen * 0.35 }}
              />
            );
          })}

          {/* Pending link edge (James memorial in another glen) */}
          <motion.path
            key={linkConfirmed ? 'pending-confirmed' : 'pending-open'}
            d={edgePath(NODE_MAP.get('james')!, PENDING_NODE)}
            fill="none"
            stroke={linkConfirmed ? '#C4A24C' : '#8FA896'}
            strokeWidth={1.25}
            strokeDasharray={linkConfirmed ? '1 6' : '4 4'}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: linkConfirmed ? 0 : 0.8 }}
          />

          {/* Nodes */}
          {NODES.map((n, i) => {
            const r = n.small ? 9 : 13;
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusIdx(i);
                  onSelect(n);
                }}
                className="cursor-pointer"
              >
                {selected?.id === n.id && (
                  <circle cx={n.x} cy={n.y} r={r + 7} fill="none" stroke="#C4A24C" strokeWidth={1} opacity={0.7} />
                )}
                {n.kind === 'stone' ? (
                  // Stone-shaped marker for the deceased
                  <rect
                    x={n.x - r}
                    y={n.y - r * 0.8}
                    width={r * 2}
                    height={r * 1.6}
                    rx={r * 0.7}
                    fill="#6E7770"
                    stroke="#C4A24C"
                    strokeWidth={1}
                  />
                ) : (
                  <>
                    <circle cx={n.x} cy={n.y} r={r} fill="#F6F1E7" stroke="#2E5945" strokeWidth={2.5} />
                    <circle cx={n.x} cy={n.y} r={r - 5} fill="#2E5945" opacity={0.15} />
                  </>
                )}
                <text
                  x={n.x}
                  y={n.y + r + 16}
                  textAnchor="middle"
                  fontFamily="Fraunces, Georgia, serif"
                  fontSize={n.small ? 11 : 13}
                  fill="#1C1C1A"
                >
                  {n.name}
                </text>
                {n.years && (
                  <text x={n.x} y={n.y + r + 29} textAnchor="middle" fontSize={9.5} fill="#5A5648">
                    {n.years}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* Pending node — dashed outline until guardian confirms */}
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <rect
              x={PENDING_NODE.x - 13}
              y={PENDING_NODE.y - 10}
              width={26}
              height={20}
              rx={10}
              fill={linkConfirmed ? '#6E7770' : 'transparent'}
              stroke="#C4A24C"
              strokeWidth={1.25}
              strokeDasharray={linkConfirmed ? undefined : '4 3'}
            />
            <text
              x={PENDING_NODE.x}
              y={PENDING_NODE.y + 28}
              textAnchor="middle"
              fontFamily="Fraunces, Georgia, serif"
              fontSize={11}
              fill="#1C1C1A"
            >
              {PENDING_NODE.name}
            </text>
            <text x={PENDING_NODE.x} y={PENDING_NODE.y + 40} textAnchor="middle" fontSize={9} fill="#5A5648">
              {linkConfirmed ? 'memorial linked' : 'memorial in another glen'}
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

/* ================= Node card ================= */

function NodeCard({ node, onClose }: { node: TreeNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="card-raised mt-4 flex items-start justify-between gap-6 p-5"
      role="status"
    >
      <div>
        <p className="font-display text-lg text-body">
          {node.name} {node.years && <span className="text-sm text-soft">· {node.years}</span>}
        </p>
        <p className="type-meta mt-1 text-soft">{node.relation}</p>
        <p className="mt-2 text-sm text-soft">
          {node.glens.length > 1
            ? `${node.name.split(' ')[0]} belongs to ${node.glens.length} family glens: ${node.glens.join(' · ')}`
            : node.glens[0]}
        </p>
        {node.legacyMember && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
            <Lock size={11} aria-hidden /> Living Legacy member
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close person card"
        className="flex h-12 w-12 flex-none items-center justify-center text-soft transition-colors hover:text-body"
      >
        <X size={16} aria-hidden />
      </button>
    </motion.div>
  );
}

/* ================= Section 3 — The Overlap Moment ================= */

function OverlapMoment() {
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-labelledby="overlap-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <h2 id="overlap-heading" className="type-h2 text-body">
              One person can belong to every family that loves them.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="type-story mt-5 text-soft">
              Sarah married Thomas Miller in London in 2015. In the Peters tree, Sarah appears as
              daughter of John and Grace. In the Miller tree, Sarah appears as wife of Thomas and
              mother of Emma and Jack. <strong className="font-medium text-body">Both are true. Both are honoured. Neither is hidden.</strong>
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 leading-relaxed text-soft">
              This is how modern families work. MemoryGlen respects every connection. Nobody is left
              out of the story.
            </p>
          </Reveal>
        </div>

        {/* Zoomed tree crop — Sarah with solid Peters lines above, dotted Miller below */}
        <Reveal delay={0.12}>
          <div className="card-raised p-6">
            <svg viewBox="0 0 400 300" className="w-full" role="img" aria-label="Sarah Miller shown in both the Peters and Miller family glens">
              {/* solid Peters line from above */}
              <path d="M 200 20 C 200 60, 200 70, 200 100" fill="none" stroke="#C4A24C" strokeWidth={1.5} />
              <text x="200" y="16" textAnchor="middle" fontSize={10} fill="#5A5648">John &amp; Grace Peters</text>
              {/* Sarah node with two-ring halo — pulses once on entry */}
              <motion.circle
                cx={200} cy={110} r={22} fill="none" stroke="#C4A24C" strokeWidth={1.5}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: [0.8, 1.15, 1], opacity: [0, 1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{ transformOrigin: '200px 110px' }}
              />
              <motion.circle
                cx={200} cy={110} r={27} fill="none" stroke="#8FA896" strokeWidth={1.25} strokeDasharray="1 5"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: [0.8, 1.12, 1], opacity: [0, 1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
                style={{ transformOrigin: '200px 110px' }}
              />
              <circle cx={200} cy={110} r={14} fill="#F6F1E7" stroke="#2E5945" strokeWidth={2.5} />
              <text x="200" y="160" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize={14} fill="#1C1C1A">Sarah Miller</text>
              <text x="200" y="176" textAnchor="middle" fontSize={10} fill="#5A5648">b. 1988 · London</text>
              {/* dotted Miller lines below */}
              <path d="M 200 124 C 200 170, 260 180, 280 210" fill="none" stroke="#8FA896" strokeWidth={1.25} strokeDasharray="1 6" strokeLinecap="round" />
              <path d="M 280 224 C 280 240, 230 250, 220 268" fill="none" stroke="#8FA896" strokeWidth={1.25} strokeDasharray="1 6" strokeLinecap="round" />
              <path d="M 280 224 C 280 240, 330 250, 340 268" fill="none" stroke="#8FA896" strokeWidth={1.25} strokeDasharray="1 6" strokeLinecap="round" />
              <circle cx={280} cy={217} r={11} fill="#F6F1E7" stroke="#2E5945" strokeWidth={2} />
              <text x={280} y={246} textAnchor="middle" fontSize={11} fill="#1C1C1A" fontFamily="Fraunces, Georgia, serif">Thomas Miller</text>
              <circle cx={216} cy={272} r={8} fill="#F6F1E7" stroke="#2E5945" strokeWidth={2} />
              <text x={216} y={292} textAnchor="middle" fontSize={9.5} fill="#5A5648">Emma</text>
              <circle cx={344} cy={272} r={8} fill="#F6F1E7" stroke="#2E5945" strokeWidth={2} />
              <text x={344} y={292} textAnchor="middle" fontSize={9.5} fill="#5A5648">Jack</text>
            </svg>
            <p className="mt-4 inline-flex rounded-full border border-brass px-4 py-1.5 text-xs font-semibold text-brass">
              Sarah belongs to 2 family glens.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= Section 4 — Connection-engine demo ================= */

type LinkStage = 'idle' | 'requested' | 'declined';

function ConnectionDemo({
  onApprove,
  linkConfirmed,
}: {
  onApprove: () => void;
  linkConfirmed: boolean;
}) {
  const [stage, setStage] = useState<LinkStage>('idle');

  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-labelledby="connect-heading">
      <Reveal>
        <p className="eyebrow">THE CONNECTION ENGINE</p>
        <h2 id="connect-heading" className="type-h2 mt-4 text-body">
          One question at a time.
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-soft">
          You never “do genealogy.” MemoryGlen suggests; the family confirms. Try it — this demo is
          fully clickable.
        </p>
      </Reveal>

      <div className="mt-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {!linkConfirmed && stage === 'idle' && (
            <motion.div
              key="suggest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="card-raised border-l-2 border-brass p-6"
            >
              <p className="font-display text-lg leading-snug text-body">
                A memorial for “James Peters (1961–2019)” may already exist in another family glen.
                Is this John's brother?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => setStage('requested')} className="btn btn-evergreen min-h-12 px-5 text-sm">
                  Yes, request link
                </button>
                <button type="button" onClick={() => setStage('declined')} className="btn btn-outline-evergreen min-h-12 px-5 text-sm">
                  Not the same person
                </button>
              </div>
            </motion.div>
          )}

          {!linkConfirmed && stage === 'requested' && (
            <motion.div
              key="guardian"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-sm bg-forest-deep p-6 text-bone"
            >
              <p className="eyebrow !text-sage">THE OTHER GLEN'S GUARDIAN SEES</p>
              <p className="mt-4 font-display text-lg leading-snug">
                The Peters Family Glen requests to link James Peters as “brother of John Peters.”
                Approve?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={onApprove} className="btn btn-evergreen min-h-12 px-5 text-sm">
                  Approve
                </button>
                <button type="button" onClick={() => setStage('idle')} className="btn btn-outline-bone min-h-12 px-5 text-sm">
                  Decline
                </button>
              </div>
            </motion.div>
          )}

          {!linkConfirmed && stage === 'declined' && (
            <motion.div
              key="declined"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="card-well p-6"
            >
              <p className="text-sm text-soft">
                No problem — the suggestion is dismissed and never shown again.{' '}
                <button type="button" onClick={() => setStage('idle')} className="font-medium text-evergreen underline underline-offset-2">
                  Try the demo again
                </button>
              </p>
            </motion.div>
          )}

          {linkConfirmed && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="card-raised border-l-2 border-evergreen p-6"
            >
              <p className="flex items-center gap-2 font-display text-lg text-body">
                <ShieldCheck size={18} className="text-evergreen" aria-hidden />
                James Peters is now linked as brother of John Peters.
              </p>
              <p className="mt-2 text-sm text-soft">
                Both glens now show the connection. The tree above has grown.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Second example — collapsed accordion */}
        <details className="card-well mt-4 p-5">
          <summary className="min-h-12 cursor-pointer text-sm font-medium text-body">
            David Peters ↔ Chiweshe Family Glen (Masvingo)
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-soft">
            “That is my wife's family glen. Our children appear in both trees.”{' '}
            <span className="font-medium text-evergreen">Status: Cross-glen link added.</span>
          </p>
        </details>

        <p className="mt-4 text-xs leading-relaxed text-soft">
          Linking a living person or claiming a relationship always requires confirmation by the
          other family's guardian.
        </p>
      </div>
    </section>
  );
}

/* ================= Section 5 — Heritage book modal ================= */

function HeritageBookModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setPage((p) => Math.min(2, p + 1));
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(0, p - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setPage(0);
  }, [open]);

  const pages = [
    {
      title: 'Cover',
      body: (
        <div className="flex h-full flex-col items-center justify-center bg-forest p-8 text-center">
          <img src="/crest-peters.svg" alt="" width={72} height={72} />
          <p className="type-h3 mt-4 text-bone">The Peters Family</p>
          <p className="mt-2 font-display italic text-brass">“We carry each other.”</p>
          <p className="type-meta mt-4 text-sage">Heritage Book · five generations</p>
        </div>
      ),
    },
    {
      title: 'The tree spread',
      body: (
        <div className="flex h-full flex-col items-center justify-center bg-parchment p-8 text-center">
          <svg viewBox="0 0 200 100" className="w-full max-w-xs" aria-hidden>
            <path d="M100 90 C100 60 60 55 40 30 M100 90 C100 60 140 55 160 30 M100 90 L100 70" stroke="#C4A24C" fill="none" strokeWidth={1.5} />
            <circle cx={40} cy={26} r={6} fill="#6E7770" />
            <circle cx={160} cy={26} r={6} fill="#6E7770" />
            <circle cx={100} cy={92} r={6} fill="#F6F1E7" stroke="#2E5945" strokeWidth={2} />
          </svg>
          <p className="mt-4 text-sm text-ink-soft">87 family members across 5 generations — solid brass for the glen, dotted sage beyond it.</p>
        </div>
      ),
    },
    {
      title: 'A story page',
      body: (
        <div className="flex h-full flex-col justify-center bg-parchment p-8">
          <p className="eyebrow">MUTARE, 1976</p>
          <p className="type-quote mt-4 text-ink">“The school he built still stands. So does everything else he made.”</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">Every resting place carries its stories into the book — photographs, voice notes, and the family tree beside them.</p>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-deep/[0.88] p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Heritage book preview"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="aspect-[4/3] overflow-hidden rounded-sm shadow-raised"
              >
                {pages[page].body}
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex items-center justify-between">
              <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="min-h-12 px-3 text-sm font-medium text-bone disabled:opacity-40">
                ← Previous
              </button>
              <p className="type-meta text-sage">
                {pages[page].title} · {page + 1} / 3
              </p>
              <button type="button" onClick={() => setPage((p) => Math.min(2, p + 1))} disabled={page === 2} className="min-h-12 px-3 text-sm font-medium text-bone disabled:opacity-40">
                Next →
              </button>
            </div>
            <button type="button" onClick={onClose} className="mt-2 min-h-12 w-full text-sm font-medium text-sage transition-colors hover:text-bone">
              Close preview
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= Sections 5–6 ================= */

function GenerationGate() {
  const [bookOpen, setBookOpen] = useState(false);
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-label="Plans and heritage book">
      <Reveal>
        <TierGate message="Free glens show 3 generations. Heritage unlocks the full tree — and the heritage book: a printed-quality PDF of the family tree, stories, and resting places." />
        <button type="button" onClick={() => setBookOpen(true)} className="btn btn-outline-evergreen mt-4 min-h-12 px-5 text-sm">
          Preview Heritage Book
        </button>
      </Reveal>
      <HeritageBookModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </section>
  );
}

const SAFETY_CARDS = [
  {
    icon: Lock,
    title: 'Encrypted at rest',
    body: 'Family tree data is sensitive and encrypted; living people appear only with consent.',
  },
  {
    icon: ShieldCheck,
    title: 'Guardian-confirmed',
    body: "No link goes live without a family's approval.",
  },
  {
    icon: Download,
    title: 'Yours to export',
    body: 'Heritage families can export their tree and heritage book anytime.',
  },
];

function TreeSafety() {
  return (
    <section className="section-pad border-t border-[color:var(--line)]" aria-labelledby="safety-heading">
      <Reveal>
        <h2 id="safety-heading" className="type-h2 text-body">
          How the tree stays safe.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {SAFETY_CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="card-raised h-full p-6">
              <c.icon size={20} className="text-brass" aria-hidden />
              <h3 className="type-h3 mt-4 text-body">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <div className="mt-16 text-center">
          <h3 className="type-h3 text-body">Watch your family's tree weave itself.</h3>
          <Link to="/create" className="btn btn-evergreen mt-6 min-h-12">
            Create your own memorial — free
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= Tab ================= */

export default function TreeTab() {
  const [selected, setSelected] = useState<TreeNode | null>(null);
  const [linkConfirmed, setLinkConfirmed] = useState(false);
  const [toast, setToast] = useState(false);

  const approve = () => {
    setLinkConfirmed(true);
    setToast(true);
    window.setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="container-content">
      {/* Toast — slides down from the tab bar, auto-dismisses 3s */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="status"
            className="fixed left-1/2 top-[140px] z-50 -translate-x-1/2 rounded-sm border border-brass bg-forest-deep px-6 py-3 text-sm font-medium text-bone shadow-raised"
          >
            Link confirmed. The tree has grown.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1 — Header */}
      <section className="section-pad" aria-labelledby="tree-heading">
        <Reveal>
          <p className="eyebrow">FAMILY TREE</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 id="tree-heading" className="type-h1 mt-4 max-w-3xl text-body">
            One family. Many branches. One home for every memory.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="type-story mt-5 max-w-2xl text-soft">
            The Peters tree was never drawn by hand. It wove itself as the family added the people
            they loved — each connection suggested by MemoryGlen, confirmed by family.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-8">
            <StatBand
              stats={[
                { value: '87', label: 'family members across 5 generations' },
                { value: '5', label: 'generations' },
                { value: '12', label: 'connections suggested by MemoryGlen, confirmed by family' },
              ]}
            />
          </div>
        </Reveal>
      </section>

      {/* Section 2 — Tree canvas */}
      <section className="pb-16" aria-label="The Peters family tree">
        <Reveal>
          <TreeCanvas linkConfirmed={linkConfirmed} onSelect={setSelected} selected={selected} />
        </Reveal>
        <AnimatePresence>
          {selected && <NodeCard node={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
        <p className="type-meta mt-4 text-soft">
          Scroll to zoom · drag to pan · hover or tap a person · arrow keys to walk the tree.
        </p>
      </section>

      <OverlapMoment />
      <ConnectionDemo onApprove={approve} linkConfirmed={linkConfirmed} />
      <GenerationGate />
      <TreeSafety />
    </div>
  );
}
