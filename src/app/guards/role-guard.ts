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
    // Comentado temporalmente para permitir acceso directo a los componentes
    /*
    const expectedRole = route.data['expectedRole'];
    const userRole = this.authService.getCurrentUserRole();
    
    if (this.authService.isLoggedIn() && userRole === expectedRole) {
      return true;
    }
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
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
    
    return false;
    */
    
    // Temporalmente retornamos true para permitir acceso a todas las rutas
    // IMPORTANTE: Recordar revertir este cambio antes de pasar a producción
    return true;
  }
}