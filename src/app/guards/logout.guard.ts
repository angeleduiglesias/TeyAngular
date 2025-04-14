import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {
  private permitirNavegacion = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    if (this.permitirNavegacion) {
      this.permitirNavegacion = false; // Resetear después de usar
      return true;
    }
    
    // Si el usuario intenta acceder directamente a /logout
    if (this.authService.isLoggedIn()) {
      // Si está autenticado, redirigir al dashboard según su rol
      const rol = this.authService.getCurrentUserRole();
      
      switch(rol) {
        case 'cliente':
          this.router.navigate(['/cliente/dashboard']);
          break;
        case 'admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'notario':
          this.router.navigate(['/notario/dashboard']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    } else {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/login']);
    }
    
    return false;
  }

  // Método para permitir la navegación al logout
  permitirLogout() {
    this.permitirNavegacion = true;
  }
}