export interface BuildInfo {
  version: string;
  builtAt: string;
}

/** The build this copy of the app is running. */
export const CURRENT_BUILD: BuildInfo = { version: __APP_VERSION__, builtAt: __APP_BUILT_AT__ };

/**
 * Asks the server which build is live. version.json isn't precached by the
 * service worker and we bypass the HTTP cache, so this always hits the network.
 */
export async function fetchLatestBuild(): Promise<BuildInfo> {
  const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as BuildInfo;
  if (typeof data.version !== 'string' || typeof data.builtAt !== 'string') throw new Error('Bad version.json');
  return data;
}

export function isSameBuild(a: BuildInfo, b: BuildInfo): boolean {
  return a.version === b.version && a.builtAt === b.builtAt;
}

export function formatBuiltAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

/**
 * Drops the cached app files and the service worker, then reloads from the
 * network so the newest build is guaranteed to load. Progress, words, and
 * settings live in localStorage, so they're untouched.
 */
export async function reloadLatest(): Promise<void> {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } finally {
    window.location.reload();
  }
}
