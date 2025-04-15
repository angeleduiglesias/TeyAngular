import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

/**
 * Componente para gestionar el proceso de cierre de sesión
 * Muestra una pantalla de carga animada mientras se procesa la solicitud
 */
@Component({
  selector: 'app-logout',
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  estaDesconectando: boolean = true;
  mensaje: string = "Cerrando sesión...";
  submensaje: string = "Por favor espere mientras finalizamos su sesión";
  
  constructor(private authService: AuthService, private router: Router) {}
  
  /**
   * Al inicializar el componente, verifica si el usuario está autenticado
   * y ejecuta el proceso de logout solo si es necesario
   */
  ngOnInit() {
    // Verificar si el usuario ya está desconectado
    if (!this.authService.isLoggedIn()) {
      this.estaDesconectando = false;
      this.mensaje = "No hay sesión activa";
      this.submensaje = "Ya has cerrado sesión o tu sesión ha expirado";
      return;
    }
    
    // Llama al servicio de autenticación para cerrar sesión
    this.authService.logout().subscribe({
      next: () => {
        // Redirecciona al login tras cerrar sesión exitosamente
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000); // Pequeño retraso para mostrar la animación
      },
      error: () => {
        // En caso de error en la API, realiza limpieza local de datos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Asegura que el usuario sea redirigido al login incluso si falla la API
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      }
    });
  }
  
  /**
   * Método para navegar a la página de inicio de sesión
   */
  irAlLogin() {
    this.router.navigate(['/login']);
  }
}