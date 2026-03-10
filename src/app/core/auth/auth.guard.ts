import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { getAuthMode } from './auth-mode';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const mode = getAuthMode();

  if (mode === 'bypass') {
    if (!auth.isAuthenticated()) auth.bypass();
    return true;
  }

  if (mode === 'login_only') {
    const router = inject(Router);
    return router.createUrlTree(['']);
  }

  if (auth.isAuthenticated()) return true;

  const router = inject(Router);
  return router.createUrlTree([''], { queryParams: { returnUrl: state.url } });
};
