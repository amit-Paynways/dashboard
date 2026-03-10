export type AuthMode = 'enabled' | 'bypass' | 'login_only';

export function getAuthMode(): AuthMode {
  const g = globalThis as unknown as {
    __AUTH_MODE__?: unknown;
    process?: { env?: Record<string, string | undefined> };
  };

  const raw = (typeof g.__AUTH_MODE__ === 'string' ? g.__AUTH_MODE__ : g.process?.env?.['AUTH_MODE']) ?? '';
  const normalized = String(raw).trim().toLowerCase();

  if (normalized === 'bypass') return 'bypass';
  if (normalized === 'login_only' || normalized === 'login-only' || normalized === 'loginonly') return 'login_only';
  return 'enabled';
}

