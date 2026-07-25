import { Link } from 'react-router';
import { Phone } from 'lucide-react';

export type ProviderTier = 'featured' | 'standard' | 'basic';

export interface ServiceProvider {
  name: string;
  /** Florist · Caterer · Tombstone Maker · Transport · Photographer · Livestream Services */
  category: string;
  description?: string;
  phone?: string;
  contactHref?: string;
  logoSrc?: string;
  tier: ProviderTier;
}

const DEFAULT_PROVIDERS: ServiceProvider[] = [
  {
    name: 'Heritage Printers',
    category: 'Memorial Booklets & Plaques',
    description: 'Beautifully bound memorial books and brass QR plaques, delivered before the service.',
    contactHref: 'mailto:admin@memoryglen.com?subject=Heritage%20Printers',
    tier: 'featured',
  },
  {
    name: 'Eternal Stone Tombstones',
    category: 'Tombstone Maker',
    description: 'Granite headstones, engraved with care.',
    tier: 'standard',
  },
  {
    name: 'Msasa Florists',
    category: 'Florist',
    description: 'Wreaths and arrangements, Harare & surrounds.',
    tier: 'standard',
  },
  {
    name: 'Comfort Coaches',
    category: 'Transport',
    phone: '+27 11 555 0182',
    tier: 'basic',
  },
];

function PaidListing() {
  return <p className="mt-2 text-[11px] text-soft">Paid listing</p>;
}

/**
 * ServiceProviderRail — the advertising rail (design.md §7.3). A quiet
 * 280px sticky right-hand panel on ≥1280px screens; collapses to an inline
 * section below that. Never animated, never autoplay. Max 1 Featured per rail.
 * Never render on Living Legacy dashboards or inside Family Glen private tiers.
 */
export default function ServiceProviderRail({
  providers = DEFAULT_PROVIDERS,
  className,
}: {
  providers?: ServiceProvider[];
  className?: string;
}) {
  const featured = providers.find((p) => p.tier === 'featured');
  const standard = providers.filter((p) => p.tier === 'standard');
  const basic = providers.filter((p) => p.tier === 'basic');

  const body = (
    <>
      <h2 className="eyebrow">Family Service Providers</h2>
      <div className="mt-5 space-y-4">
        {featured && (
          <div className="rounded-sm border border-brass bg-surface p-4">
            {featured.logoSrc && (
              <img src={featured.logoSrc} alt="" width={40} height={40} className="mb-3 rounded-sm object-cover" />
            )}
            <p className="font-display text-base text-body">{featured.name}</p>
            <p className="type-meta mt-0.5 text-brass">{featured.category}</p>
            {featured.description && <p className="mt-2 text-sm leading-relaxed text-soft">{featured.description}</p>}
            {featured.contactHref && (
              <a href={featured.contactHref} className="link-arrow mt-3 inline-flex text-sm">
                Contact
              </a>
            )}
            <PaidListing />
          </div>
        )}

        {standard.map((p) => (
          <div key={p.name} className="card-well p-4">
            <p className="font-display text-base text-body">{p.name}</p>
            <p className="type-meta mt-0.5 text-soft">{p.category}</p>
            {p.description && <p className="mt-1 text-sm leading-relaxed text-soft">{p.description}</p>}
            <PaidListing />
          </div>
        ))}

        {basic.length > 0 && (
          <ul className="space-y-3 px-1">
            {basic.map((p) => (
              <li key={p.name} className="text-sm">
                <p className="font-medium text-body">{p.name}</p>
                <p className="type-meta text-soft">{p.category}</p>
                {p.phone && (
                  <a
                    href={`tel:${p.phone.replace(/\s/g, '')}`}
                    className="mt-1 inline-flex min-h-6 items-center gap-1.5 text-sm text-evergreen"
                  >
                    <Phone size={12} aria-hidden /> {p.phone}
                  </a>
                )}
                <PaidListing />
              </li>
            ))}
          </ul>
        )}

        {/* Rail footer */}
        <div className="card-well p-4 text-center">
          <p className="text-sm text-soft">Are you a service provider?</p>
          <Link to="/service-providers" className="link-arrow mt-2 inline-flex text-sm">
            List your service
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className={className}>
      {/* Sticky rail — ≥1280px only */}
      <aside className="hidden w-[280px] flex-none xl:block" aria-label="Family service providers">
        <div className="sticky top-24">{body}</div>
      </aside>
      {/* Inline collapse — below 1280px */}
      <section className="xl:hidden" aria-label="Family service providers">
        {body}
      </section>
    </div>
  );
}
