import { useState } from 'react';
import { Check, Copy, Download, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * QRShareBlock — design.md §7.7. Left: rendered QR (SVG, forest modules on
 * parchment, 200×200) captioned "Scan with your phone's camera to share".
 * Right: share copy + Download QR / Copy Link (copied-state tick) / Share on
 * WhatsApp. The `extended` variant adds the QR Plaque preview.
 */
export default function QRShareBlock({
  qrSrc,
  url,
  title = 'Share this memorial with family and friends',
  extended = false,
  className,
}: {
  /** e.g. "/qr-john.svg" */
  qrSrc: string;
  /** The memorial URL encoded in the QR / copied to clipboard. */
  url: string;
  title?: string;
  extended?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = async (format: 'svg' | 'png') => {
    const fileName = `${qrSrc.split('/').pop()?.replace('.svg', '') ?? 'memorial-qr'}.${format}`;
    if (format === 'svg') {
      const res = await fetch(qrSrc);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
      return;
    }
    // PNG: rasterise the SVG onto a canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#F6F1E7';
      ctx.fillRect(0, 0, 800, 800);
      ctx.drawImage(img, 0, 0, 800, 800);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
      }, 'image/png');
    };
    img.src = qrSrc;
  };

  return (
    <div className={cn('card-raised p-6 sm:p-8', className)}>
      <div className="flex flex-col gap-8 sm:flex-row">
        {/* QR */}
        <figure className="flex-none text-center">
          <img
            src={qrSrc}
            alt={`QR code linking to ${url}`}
            width={200}
            height={200}
            className="mx-auto rounded-sm border border-[color:var(--line)]"
          />
          <figcaption className="mt-3 text-xs text-soft">Scan with your phone's camera to share</figcaption>
        </figure>

        {/* Actions */}
        <div className="flex-1">
          <h3 className="type-h3 text-body">{title}</h3>
          <p className="mt-2 break-all text-sm text-soft">{url}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex overflow-hidden rounded-sm border border-[color:var(--line)]">
              <button
                type="button"
                onClick={() => downloadQr('png')}
                className="flex min-h-12 items-center gap-2 bg-surface px-4 text-sm font-medium text-body transition-colors hover:bg-well"
              >
                <Download size={16} aria-hidden /> Download QR (PNG)
              </button>
              <button
                type="button"
                onClick={() => downloadQr('svg')}
                className="flex min-h-12 items-center border-l border-[color:var(--line)] bg-surface px-3 text-sm font-medium text-soft transition-colors hover:bg-well"
              >
                SVG
              </button>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="btn btn-outline-evergreen min-h-12 px-4 text-sm"
            >
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Link copied' : 'Copy Link'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`With love, we remember. Visit this memorial: ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-evergreen min-h-12 px-4 text-sm"
            >
              <MessageCircle size={16} aria-hidden /> Share on WhatsApp
            </a>
          </div>

          {/* Extended: QR Plaque preview */}
          {extended && (
            <div className="card-well mt-8 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img
                src="/qr-plaque-mock.png"
                alt="Engraved brass memorial plaque mockup with an etched QR code"
                width={220}
                height={147}
                className="rounded-sm object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-display text-base text-body">The QR Plaque</p>
                <p className="mt-1 text-sm leading-relaxed text-soft">
                  The same QR, engraved in brass for the headstone — so every visit can find every memory.
                </p>
                <a href="mailto:admin@memoryglen.com?subject=QR%20Plaque%20order" className="link-arrow mt-3 inline-flex text-sm">
                  Order a plaque for the headstone
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
