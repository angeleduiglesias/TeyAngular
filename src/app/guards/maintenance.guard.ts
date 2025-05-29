import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MaintenanceService } from '../services/maintenance.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {
  
  constructor(
    private maintenanceService: MaintenanceService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si la ruta actual es la página de mantenimiento
    const isMaintenancePage = state.url === '/maintenance';
    
    // Verificar si el modo mantenimiento está activo
    const maintenanceModeActive = this.maintenanceService.isMaintenanceMode();
    
    // Si estamos intentando acceder a la página de mantenimiento directamente
    if (isMaintenancePage) {
      // Solo permitir acceso si el modo mantenimiento está activo
      if (maintenanceModeActive) {
        return true;
      } else {
        // Si el modo mantenimiento no está activo, redirigir al home
        return this.router.parseUrl('/');
      }
    }
    
    // Si estamos intentando acceder a cualquier otra página
    if (maintenanceModeActive) {
      // Permitir acceso a la página de administración incluso en modo mantenimiento
      // para que los administradores puedan desactivar el modo mantenimiento
      if (state.url.includes('/admin')) {
        return true;
      }
      
      // Redirigir a la página de mantenimiento para todas las demás rutas
      return this.router.parseUrl('/maintenance');
    }
    
    // Si no está en modo mantenimiento, permitir el acceso normal
    return true;
  }
}
