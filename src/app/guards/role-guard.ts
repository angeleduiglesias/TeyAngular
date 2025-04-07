import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  // Inyecta servicios necesarios para autenticación y navegación
  constructor(private authService: AuthService, private router: Router) {}
  
  // Método que determina si un usuario puede acceder a una ruta
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Obtiene el rol esperado de la ruta
    const expectedRole = route.data['expectedRole'];
    // Obtiene el rol actual del usuario desde el servicio de autenticación
    const userRole = this.authService.getCurrentUserRole();
    
    // Verifica si el usuario está autenticado y si su rol coincide con el esperado
    if (this.authService.isLoggedIn() && userRole === expectedRole) {
      return true;
    }
    
    // Redirige al login si el usuario no está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      // Redirigir a la página correspondiente según el rol actual
      switch(userRole) {
        case 'admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'notario':
          this.router.navigate(['/notario/dashboard']);
          break;
        case 'cliente':
          this.router.navigate(['/cliente/dashboard']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    }
    
    // Bloquea el acceso a la ruta solicitada
    return false;
  }
}