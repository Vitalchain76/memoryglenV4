/**
 * Image sanitisation before upload.
 *
 * Threat T-08 (EXIF / GPS geolocation leakage). A phone photograph carries GPS
 * coordinates, a capture timestamp and a device identifier in its EXIF block. A
 * family uploading pictures taken at home would otherwise publish the exact
 * location of a house now publicly known to be in mourning — a documented
 * burglary and stalking risk.
 *
 * Re-encoding through a canvas discards every metadata block: the browser
 * decodes to raw pixels and re-encodes, and only the pixels survive. Orientation
 * is the one piece of EXIF that must be honoured rather than dropped, so it is
 * read first and baked into the pixel data before the metadata is discarded —
 * otherwise portrait photographs would appear sideways.
 *
 * This is defence in depth, not the only line: it runs in the browser and a
 * determined uploader could bypass it by calling the storage API directly. A
 * server-side strip belongs in the quarantine-and-promote pipeline described in
 * the threat model. This closes the accidental case, which is the common one.
 */

/** Longest edge, in pixels, that a stored photograph is allowed to have. */
export const MAX_IMAGE_DIMENSION = 2400;

/** JPEG quality for the re-encode. */
const JPEG_QUALITY = 0.88;

/**
 * Read the EXIF orientation flag (1–8) so it can be applied to the pixels
 * before the metadata is thrown away. Returns 1 when absent or unreadable.
 */
async function readOrientation(file: File): Promise<number> {
  try {
    const head = await file.slice(0, 128 * 1024).arrayBuffer();
    const view = new DataView(head);
    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return 1;

    let offset = 2;
    while (offset + 4 < view.byteLength) {
      const marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        if (view.getUint32(offset + 2, false) !== 0x45786966) return 1;
        const tiff = offset + 8;
        const little = view.getUint16(tiff, false) === 0x4949;
        const dirStart = tiff + view.getUint32(tiff + 4, little);
        const entries = view.getUint16(dirStart, little);
        for (let i = 0; i < entries; i++) {
          const entry = dirStart + 2 + i * 12;
          if (view.getUint16(entry, little) === 0x0112) {
            return view.getUint16(entry + 8, little) || 1;
          }
        }
        return 1;
      }
      if ((marker & 0xff00) !== 0xff00) break;
      offset += view.getUint16(offset, false);
    }
  } catch {
    /* unreadable header — treat as upright */
  }
  return 1;
}

/** Canvas dimensions and transform for a given EXIF orientation. */
function orient(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  w: number,
  h: number,
): void {
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, w, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, w, h); break;
    case 4: ctx.transform(1, 0, 0, -1, 0, h); break;
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 6: ctx.transform(0, 1, -1, 0, h, 0); break;
    case 7: ctx.transform(0, -1, -1, 0, h, w); break;
    case 8: ctx.transform(0, -1, 1, 0, 0, w); break;
    default: break;
  }
}

/**
 * Re-encode an image, discarding all metadata and capping its dimensions.
 *
 * Throws if the file cannot be decoded as an image — which is itself a useful
 * check, since a file that will not decode is not the photograph it claims to
 * be (threat T-07, disguised uploads).
 */
export async function sanitiseImage(file: File): Promise<File> {
  const orientation = await readOrientation(file);
  const url = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('That file could not be read as an image.'));
      el.src = url;
    });

    const swap = orientation >= 5 && orientation <= 8;
    const srcW = swap ? img.naturalHeight : img.naturalWidth;
    const srcH = swap ? img.naturalWidth : img.naturalHeight;
    if (!srcW || !srcH) throw new Error('That file could not be read as an image.');

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(srcW, srcH));
    const outW = Math.round(srcW * scale);
    const outH = Math.round(srcH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This browser could not process the image.');

    // White rather than transparent: a PNG with alpha would otherwise get a
    // black background when flattened into JPEG.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);

    ctx.save();
    ctx.scale(scale, scale);
    orient(ctx, orientation, srcW, srcH);
    ctx.drawImage(img, 0, 0);
    ctx.restore();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );
    if (!blob) throw new Error('The image could not be prepared for upload.');

    return new File([blob], 'photograph.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
