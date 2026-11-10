import { useEffect, useState } from 'react';
import snapshot from '../data/supporters.json';
import { parseSupportersFeed, SUPPORTERS_FEED_URL } from '../data/supportersFeed';

export default function useSupporters() {
  const [supporters, setSupporters] = useState(snapshot.supporters);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let stopped = false;
    let active = null;
    const refresh = async () => {
      if (document.visibilityState === 'hidden' || active) return;
      const controller = new AbortController();
      active = controller;
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(SUPPORTERS_FEED_URL, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Sheet unavailable');
        const next = parseSupportersFeed(await response.text());
        if (!stopped) { setSupporters(next); setUnavailable(false); }
      } catch {
        if (!stopped) setUnavailable(true);
      } finally {
        window.clearTimeout(timeout);
        active = null;
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 60000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
      active?.abort();
    };
  }, []);
  return { supporters, unavailable };
}
