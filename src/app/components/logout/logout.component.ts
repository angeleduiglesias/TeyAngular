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
        <div class="spinner-container">
          <div class="spinner"></div>
        </div>
        <h2 class="logout-message">Cerrando sesión...</h2>
        <p class="logout-submessage">Por favor espere mientras finalizamos su sesión</p>
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
  `]
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Asegura que el usuario sea redirigido al login incluso si falla la API
        this.router.navigate(['/login']);
      }
    });
  }
}