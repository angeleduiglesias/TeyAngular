import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Importamos la interfaz desde el componente
import { Cita } from '../../../pages/cliente/citas/cliente-citas.component';

@Injectable({
  providedIn: 'root'
})
export class ClienteCitasService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene la lista de citas del cliente
   * @returns Observable con la lista de citas
   */
  obtenerCitas(): Observable<Cita[]> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Realizar la petición GET al endpoint de citas
    return this.http.get<Cita[]>(`${environment.apiUrl}/api/cliente/citas`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en el servicio ClienteCitasService:', error);
          
          // Manejar diferentes tipos de errores
          if (error.status === 401) {
            console.error('Error de autenticación: Token inválido o expirado');
          } else if (error.status === 403) {
            console.error('Error de autorización: No tienes permisos para realizar esta acción');
          } else if (error.status === 404) {
            console.error('Error: Endpoint no encontrado');
          } else if (error.status === 0) {
            console.error('Error de conexión: No se pudo conectar con el servidor');
          }
          
          // Propagar el error para que el componente pueda manejarlo
          return throwError(() => error);
        })
      );
  }
}