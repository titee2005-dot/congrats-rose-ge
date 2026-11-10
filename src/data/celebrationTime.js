// Announcement time in Thailand; independent of the viewer's timezone.
export const ANNOUNCEMENT_AT = Date.parse('2026-11-14T18:00:00+07:00');

export function countdownParts(now = Date.now()) {
  const seconds = Math.max(0, Math.ceil((ANNOUNCEMENT_AT - now) / 1000));
  return {
    reached: now >= ANNOUNCEMENT_AT,
    values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
  };
}
