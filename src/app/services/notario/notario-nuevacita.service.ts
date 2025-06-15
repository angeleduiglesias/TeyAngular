import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Interfaz para los datos de la cita
export interface NewCita {
  documento_id: number;
  nombre_cliente: string;
  tipo_documento: string;
  fecha_cita: string;
  hora_cita: string;
  direccion: string;
  descripcion: string;
  telefono: string;
}

export interface Citas {
    cita_id: number;
    fecha_cita: string;
    hora_cita: string;
    nombre_cliente: string;
    direccion: string;
    tipo_empresa: string;
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
  crearCita(citaData: NewCita): Observable<any> {
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
    return this.http.post<any>(endpoint, citaData, { headers })
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
  obtenerCitas(): Observable<Citas[]> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/notario/citas`;
    
    return this.http.get<Citas[]>(endpoint, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al obtener las citas:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Elimina una cita
   * @param citaId ID de la cita a eliminar
   * @returns Observable con la respuesta del servidor
   */
  eliminarCita(citaId: number): Observable<any> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const endpoint = `${environment.apiUrl}/api/notario/citas/${citaId}`;
    
    console.log('Eliminando cita en endpoint:', endpoint);
    
    return this.http.delete<any>(endpoint, { headers })
      .pipe(
        catchError(error => {
          console.log('Error al eliminar la cita:', error);
          return throwError(() => error);
        })
      );
  }

}