import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { filter, map, take } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (_, __) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const isAuthenticated$ = isBrowser
    ? authService.authStatus$.pipe(
        filter((value) => value !== 'undetermined'),
        take(1),
        map((val, _) => {
          const isAuthenticated = val === 'authenticated';
          if (!isAuthenticated) {
            authService.invalidate();
          }
          return isAuthenticated;
        })
      )
    : true;

  return isAuthenticated$;
};
