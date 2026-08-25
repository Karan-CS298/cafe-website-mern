export function normalizeCoordinate(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function mapEmbedUrl(settings = {}) {
  const lat = normalizeCoordinate(settings.latitude);
  const lng = normalizeCoordinate(settings.longitude);
  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }
  const raw = String(settings.mapUrl || '').trim();
  if (!raw) return '';
  if (raw.includes('output=embed') || raw.includes('/maps/embed')) return raw;
  try {
    const url = new URL(raw);
    const at = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (at) return `https://www.google.com/maps?q=${at[1]},${at[2]}&z=16&output=embed`;
  } catch {}
  return '';
}

export function directionsUrl(settings = {}) {
  if (settings.directionsUrl) return settings.directionsUrl;
  const lat = normalizeCoordinate(settings.latitude);
  const lng = normalizeCoordinate(settings.longitude);
  const query = lat !== null && lng !== null ? `${lat},${lng}` : (settings.address || settings.cafeName || 'cafe');
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
