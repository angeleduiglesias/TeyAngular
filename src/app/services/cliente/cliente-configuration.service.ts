import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Interfaz para los datos adicionales del usuario (solo lo que no tiene authService)
export interface UserAdditionalData {
  nombre: string;
  telefono: string;
}

// Interfaz para la respuesta del servidor
export interface UpdateResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteConfigurationService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene los datos adicionales del usuario (nombre y teléfono)
   * @returns Observable con los datos adicionales del usuario
   */
  obtenerDatosAdicionales(): Observable<UserAdditionalData> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/cliente/datos-adicionales`;
    
    return this.http.get<UserAdditionalData>(endpoint, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al obtener datos adicionales del usuario:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza el email del usuario
   * @param nuevoEmail Nuevo email del usuario
   * @returns Observable con la respuesta del servidor
   */
  actualizarEmail(nuevoEmail: string): Observable<UpdateResponse> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/cliente/actualizar-email`;
    const body = { email: nuevoEmail };
    
    console.log('Actualizando email:', nuevoEmail);
    
    return this.http.put<UpdateResponse>(endpoint, body, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al actualizar email:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza el teléfono del usuario
   * @param nuevoTelefono Nuevo teléfono del usuario
   * @returns Observable con la respuesta del servidor
   */
  actualizarTelefono(nuevoTelefono: string): Observable<UpdateResponse> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/cliente/actualizar-telefono`;
    const body = { telefono: nuevoTelefono };
    
    console.log('Actualizando teléfono:', nuevoTelefono);
    
    return this.http.put<UpdateResponse>(endpoint, body, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al actualizar teléfono:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Cambia la contraseña del usuario
   * @param contrasenaActual Contraseña actual
   * @param nuevaContrasena Nueva contraseña
   * @returns Observable con la respuesta del servidor
   */
  cambiarContrasena(contrasenaActual: string, nuevaContrasena: string): Observable<UpdateResponse> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/cliente/cambiar-contrasena`;
    const body = { 
      contrasena_actual: contrasenaActual,
      nueva_contrasena: nuevaContrasena 
    };
    
    console.log('Cambiando contraseña del usuario');
    
    return this.http.put<UpdateResponse>(endpoint, body, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al cambiar contraseña:', error);
          return throwError(() => error);
        })
      );
  }
}