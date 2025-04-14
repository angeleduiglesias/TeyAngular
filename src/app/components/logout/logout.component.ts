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
  template: `
    <div class="logout-container">
      <div class="logout-card">
        <div class="spinner-container" *ngIf="estaDesconectando">
          <div class="spinner"></div>
        </div>
        <h2 class="logout-message">{{ mensaje }}</h2>
        <p class="logout-submessage">{{ submensaje }}</p>
        <button *ngIf="!estaDesconectando" class="login-button" (click)="irAlLogin()">Ir a inicio de sesión</button>
      </div>
    </div>
  `,
  styles: [`
    .logout-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }
    
    .logout-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 30px;
      text-align: center;
      width: 90%;
      max-width: 400px;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(40, 167, 69, 0.2);
      border-radius: 50%;
      border-top-color: #28a745;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .logout-message {
      color: #343a40;
      font-size: 22px;
      margin-bottom: 10px;
    }
    
    .logout-submessage {
      color: #6c757d;
      font-size: 14px;
    }
    
    .login-button {
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      margin-top: 15px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    
    .login-button:hover {
      background-color: #218838;
    }
  `]
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