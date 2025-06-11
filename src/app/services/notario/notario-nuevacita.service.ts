import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Interfaz para los datos de la cita
export interface CitaData {
  documento_id: number;
  cliente: string;
  tipo_documento: string;
  fecha: string;
  hora: string;
  direccion: string;
  notas: string;
  telefono: string;
}

// Interfaz para la respuesta del servidor
export interface CitaResponse {
  success: boolean;
  message: string;
  id_cita?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotarioNuevacitaService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Envía los datos de la nueva cita al backend
   * @param citaData Datos de la cita a crear
   * @returns Observable con la respuesta del servidor
   */
  crearCita(citaData: CitaData): Observable<CitaResponse> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Endpoint para crear citas
    const endpoint = `${environment.apiUrl}/api/notario/nueva-cita`;
    
    console.log('Enviando cita al endpoint:', endpoint);
    console.log('Datos de la cita:', citaData);
    
    // Realizar la petición POST
    return this.http.post<CitaResponse>(endpoint, citaData, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al crear la cita:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene todas las citas del notario
   * @returns Observable con la lista de citas
   */
  obtenerCitas(): Observable<CitaData[]> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/notario/citas`;
    
    return this.http.get<CitaData[]>(endpoint, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al obtener las citas:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza una cita existente
   * @param citaId ID de la cita a actualizar
   * @param citaData Datos actualizados de la cita
   * @returns Observable con la respuesta del servidor
   */
  actualizarCita(citaId: number, citaData: CitaData): Observable<CitaResponse> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/notario/citas/${citaId}`;
    
    return this.http.put<CitaResponse>(endpoint, citaData, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al actualizar la cita:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Elimina una cita
   * @param citaId ID de la cita a eliminar
   * @returns Observable con la respuesta del servidor
   */
  eliminarCita(citaId: number): Observable<CitaResponse> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/notario/citas/${citaId}`;
    
    return this.http.delete<CitaResponse>(endpoint, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al eliminar la cita:', error);
          return throwError(() => error);
        })
      );
  }
}