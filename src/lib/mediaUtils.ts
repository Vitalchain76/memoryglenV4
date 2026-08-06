/**
 * Magic-byte validation for uploaded images.
 *
 * The MIME-type and extension checks elsewhere in this codebase (see
 * memorialsApi.ts, ContributeModal.tsx) trust `File.type`/`File.name`, both
 * of which the browser derives from the file extension and neither of
 * which reflects the actual file contents — a `.php` or `.exe` renamed to
 * `photo.jpg` reports `image/jpeg` and passes those checks untouched. This
 * reads the first bytes of the file and checks them against the real
 * magic numbers for the formats this app accepts, so a disguised file is
 * rejected before it's ever decoded or uploaded.
 *
 * Covers JPEG, PNG, WEBP and HEIC/HEIF — the last two are included because
 * ALLOWED_IMAGE_TYPES (memorialsApi.ts) accepts them; they're the default
 * capture format on recent iPhones, and a header check that only knew
 * JPEG/PNG/WEBP would reject real photographs from those uploaders.
 */

const HEIF_BRANDS = ['heic', 'heix', 'heim', 'heis', 'hevc', 'hevm', 'hevs', 'mif1', 'msf1'];

function bytesToAscii(bytes: Uint8Array, start: number, len: number): string {
  return Array.from(bytes.slice(start, start + len))
    .map((b) => String.fromCharCode(b))
    .join('');
}

function matchesBytes(head: Uint8Array, offset: number, bytes: number[]): boolean {
  return bytes.every((byte, i) => head[offset + i] === byte);
}

export async function validateImageHeader(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (matchesBytes(head, 0, [0xff, 0xd8, 0xff])) return true; // JPEG
  if (matchesBytes(head, 0, [0x89, 0x50, 0x4e, 0x47])) return true; // PNG
  if (matchesBytes(head, 0, [0x52, 0x49, 0x46, 0x46]) && bytesToAscii(head, 8, 4) === 'WEBP') {
    return true; // WEBP: RIFF container tagged WEBP at offset 8
  }
  if (bytesToAscii(head, 4, 4) === 'ftyp' && HEIF_BRANDS.includes(bytesToAscii(head, 8, 4))) {
    return true; // HEIC/HEIF: ISO-BMFF ftyp box with a HEIF brand
  }

  return false;
}

/**
 * URL sanitization for contributed external media links (YouTube/Vimeo
 * embeds, or a direct image URL pasted instead of an uploaded file).
 *
 * Two threats, both server-independent since nothing here ever fetches
 * the URL — the browser does, when it renders an <img>/<iframe> pointed
 * at whatever was stored:
 *  - `javascript:`/`data:`/other non-http(s) schemes, which a naive
 *    `<a href>` or redirect could execute.
 *  - SSRF-flavoured probing of the *viewer's* local network: an <img>
 *    or <iframe> pointed at a private/link-local address forces every
 *    visitor's browser to hit their own LAN or (on cloud-hosted victims)
 *    the instance metadata endpoint at 169.254.169.254.
 */

const ALLOWED_VIDEO_DOMAINS = [
  'youtube.com',
  'youtube-nocookie.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
];

// Deliberately excludes .svg: an SVG can carry an embedded <script>, which
// is exactly the disguised-file risk validateImageHeader() exists to
// reject for uploads — allowing it back in through a pasted URL would
// defeat that.
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const ALLOWED_IMAGE_HOSTS = ['supabase.co', 'cloudinary.com', 'amazonaws.com'];

function isPrivateOrLinkLocalHost(hostname: string): boolean {
  // URL.hostname keeps the brackets around an IPv6 literal (e.g. "[fe80::1]") —
  // strip them so the checks below see the same "::1"/"fe80::1" this function
  // is actually testing for, rather than silently never matching.
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (h === 'localhost' || h === '0.0.0.0' || h === '::1') return true;

  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // link-local incl. cloud metadata (169.254.169.254)
    return false;
  }

  // IPv6 unique-local (fc00::/7) and link-local (fe80::/10) literals.
  if (/^(fe[89ab][0-9a-f]|f[cd][0-9a-f]{2}):/i.test(h)) return true;

  return false;
}

export interface SanitizedMediaUrl {
  isValid: boolean;
  sanitizedUrl: string;
  type: 'image' | 'video' | 'invalid';
}

export function sanitizeMediaUrl(rawUrl: string): SanitizedMediaUrl {
  const invalid: SanitizedMediaUrl = { isValid: false, sanitizedUrl: '', type: 'invalid' };

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return invalid;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return invalid;
  if (isPrivateOrLinkLocalHost(parsed.hostname)) return invalid;

  const hostname = parsed.hostname.toLowerCase();
  const isAllowedDomain = (list: string[]) =>
    list.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));

  if (isAllowedDomain(ALLOWED_VIDEO_DOMAINS)) {
    return { isValid: true, sanitizedUrl: parsed.toString(), type: 'video' };
  }

  const pathname = parsed.pathname.toLowerCase();
  const hasImageExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  if (hasImageExtension || isAllowedDomain(ALLOWED_IMAGE_HOSTS)) {
    return { isValid: true, sanitizedUrl: parsed.toString(), type: 'image' };
  }

  return invalid;
}
