import { Link } from 'react-router';

/**
 * NotFoundPage - catch-all 404 route.
 * Renders a real page-not-found state (not the memorial directory)
 * so unknown URLs are clearly distinguishable for users and crawlers.
 */
export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="card-raised w-full px-8 py-12">
        <p className="type-meta text-soft">Error 404</p>
        <h1 className="type-h2 font-display mt-3 text-body">This page could not be found</h1>
        <p className="mt-4 text-sm leading-relaxed text-soft">
          The page you are looking for may have been moved, or the link may be incomplete. You can return to the memorials directory below.
        </p>
        <Link
          to="/memorials"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-evergreen bg-evergreen px-6 text-sm font-medium text-bone transition-colors duration-150 hover:opacity-90"
        >
          Back to Memorials
        </Link>
      </div>
    </main>
  );
}
