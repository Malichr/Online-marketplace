import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (requiredRole?: 'seller' | 'buyer') => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (requiredRole) {
      const hasRole = requiredRole === 'seller' ? 
        authService.isSeller() : 
        authService.isBuyer();

      if (!hasRole) {
        router.navigate(['/']);
        return false;
      }
    }

    return true;
  };
}; 