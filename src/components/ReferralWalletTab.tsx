import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffiliatePartner {
  id: string;
  name: string;
  category: string;
  logoInitial: string;
  cashbackRate: string;
  referralPath: string;
}

const PARTNERS: AffiliatePartner[] = [
  {
    id: 'old-mutual',
    name: 'Old Mutual',
    category: 'Funeral cover & life insurance',
    logoInitial: 'OM',
    cashbackRate: '5% of first premium',
    referralPath: '/partners/old-mutual',
  },
  {
    id: 'nyaradzo',
    name: 'Nyaradzo',
    category: 'Funeral services & estate planning',
    logoInitial: 'NY',
    cashbackRate: '3% of policy value',
    referralPath: '/partners/nyaradzo',
  },
];

interface ReferralWalletTabProps {
  referralCode: string;
}

/**
 * B2B2C affiliate cashback wallet: one CSS Grid card per partner so spacing
 * and alignment stay pixel-identical across breakpoints (the QA brief
 * flagged misaligned ad slots as a defect). Every card shares the same
 * grid-template, so no partner's card can drift out of alignment on mobile.
 */
export default function ReferralWalletTab({ referralCode }: ReferralWalletTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const buildReferralUrl = (partner: AffiliatePartner) =>
    `${window.location.origin}${partner.referralPath}?ref=${encodeURIComponent(referralCode)}`;

  const handleCopy = async (partner: AffiliatePartner) => {
    await navigator.clipboard.writeText(buildReferralUrl(partner));
    setCopiedId(partner.id);
    setTimeout(() => setCopiedId((current) => (current === partner.id ? null : current)), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Referral & cashback wallet</h3>
        <p className="text-sm text-soft">
          Share your link with partners below. Cashback is credited once the referred policy or service is confirmed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PARTNERS.map((partner) => (
          <div
            key={partner.id}
            className="card-well grid grid-rows-[auto_auto_1fr_auto] gap-3 p-5"
          >
            <div className="grid grid-cols-[48px_1fr] items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/10 text-sm font-semibold text-brass">
                {partner.logoInitial}
              </div>
              <div>
                <p className="font-semibold leading-tight">{partner.name}</p>
                <p className="text-xs text-soft leading-tight">{partner.category}</p>
              </div>
            </div>

            <div className="rounded-lg bg-[color:var(--line)]/30 px-3 py-2 text-sm font-medium">
              Cashback: {partner.cashbackRate}
            </div>

            <div className="truncate rounded-lg border border-[color:var(--line)] px-3 py-2 text-xs text-soft">
              {buildReferralUrl(partner)}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCopy(partner)}
                className={cn(
                  'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  copiedId === partner.id ? 'bg-emerald-600 text-white' : 'bg-brass text-white hover:bg-brass/90',
                )}
              >
                {copiedId === partner.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === partner.id ? 'Copied' : 'Copy link'}
              </button>
              <a
                href={partner.referralPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm font-medium"
              >
                <ExternalLink size={14} />
                Learn more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
