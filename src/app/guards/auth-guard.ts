import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // Inyecta el servicio de autenticación y el router
  constructor(private authService: AuthService, private router: Router) {}
  
  // Método que determina si una ruta puede ser activada
  canActivate(): boolean {
    // Comentado temporalmente para permitir acceso directo a los componentes
    
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
    
    
    // Temporalmente retornamos true para permitir acceso a todas las rutas
    // IMPORTANTE: Recordar revertir este cambio antes de pasar a producción
  }
}