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
    // Verifica si el usuario está autenticado
    if (this.authService.isLoggedIn()) {
      return true; // Permite acceso a la ruta
    }
    
    // Redirige al login si no está autenticado
    this.router.navigate(['/login']);
    return false; // Bloquea acceso a la ruta
  }
}