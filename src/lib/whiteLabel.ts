export interface WhiteLabelConfig {
  partnerId: string;
  partnerName: string;
  logoUrl: string;
  primaryColor: string;
  bookingUrl: string;
}

/**
 * B2B white-label configuration. Funeral parlours and burial societies can be
 * mapped to their own brand colour, logo and booking URL, so a memorial can be
 * presented under a partner's identity while running on MemoryGlen.
 */
export const PARLOUR_CONFIGS: Record<string, WhiteLabelConfig> = {
  nyaradzo: {
    partnerId: 'nyaradzo',
    partnerName: 'Nyaradzo Funeral Services',
    logoUrl: '/brands/nyaradzo-logo.png',
    primaryColor: '#005A36',
    bookingUrl: 'https://www.nyaradzo.co.zw/bookings',
  },
  default: {
    partnerId: 'memoryglen',
    partnerName: 'MemoryGlen Digital Legacy',
    logoUrl: '/logo.png',
    primaryColor: '#1E3A2B',
    bookingUrl: 'https://www.memoryglen.com/bookings',
  },
};

/**
 * Resolve a white-label config by partner id, falling back to the MemoryGlen
 * default when the id is missing or unknown.
 */
export function getWhiteLabelConfig(partnerId?: string): WhiteLabelConfig {
  return PARLOUR_CONFIGS[partnerId ?? 'default'] ?? PARLOUR_CONFIGS.default;
}
