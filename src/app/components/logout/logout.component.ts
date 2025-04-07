import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

/**
 * Componente para gestionar el proceso de cierre de sesión
 * Muestra una pantalla de carga mientras se procesa la solicitud
 */
@Component({
  selector: 'app-logout',
  template: '<div class="loading">Cerrando sesión...</div>', // Sera un button de cerrar sesión
  styles: ['.loading { display: flex; justify-content: center; align-items: center; height: 100vh; }'] // Estilo centrado para el mensaje
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  
  /**
   * Al inicializar el componente, ejecuta automáticamente el proceso de logout
   */
  ngOnInit() {
    // Llama al servicio de autenticación para cerrar sesión
    this.authService.logout().subscribe({
      next: () => {
        // Redirecciona al login tras cerrar sesión exitosamente
        this.router.navigate(['/login']);
      },
      error: () => {
        // En caso de error en la API, realiza limpieza local de datos
        // En caso de error, limpiar localmente y redirigir
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Asegura que el usuario sea redirigido al login incluso si falla la API
        this.router.navigate(['/login']);
      }
    });
  }
}