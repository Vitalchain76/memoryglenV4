/**
 * DemoBanner — full-width strip above the hero on all fictional demo content
 * (design.md §7.4). Never shown on Virginia's memorial.
 */
export default function DemoBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={`border-l-2 border-brass bg-forest-deep px-6 py-3 ${className ?? ''}`}
    >
      <p className="mx-auto max-w-content text-sm font-medium leading-relaxed text-bone">
        <span className="font-semibold tracking-wide text-brass-soft">DEMONSTRATION</span>
        {' — '}The Peters family and all persons shown are fictional, created to show what
        MemoryGlen can do for yours.
      </p>
    </div>
  );
}
