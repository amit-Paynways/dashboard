import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => {
    const g = globalThis as unknown as {
      __API_BASE_URL__?: unknown;
      process?: { env?: Record<string, string | undefined> };
    };

    if (typeof g.__API_BASE_URL__ === 'string') return g.__API_BASE_URL__;

    const fromEnv = g.process?.env?.['API_BASE_URL'];
    if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim();

    return '';
  },
});
