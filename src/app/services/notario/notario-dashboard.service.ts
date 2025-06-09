import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';
import { Documento, Cita } from '../../../pages/notario/dashboard/notario-dashboard-component';

export interface DashboardNotarioInformation {
  nombre_notario: string;
  citas: Cita[];
  documentos: Documento[];
}

@Injectable({
  providedIn: 'root'
})
export class NotarioDashboardService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene los datos del dashboard del administrador
   * @returns Observable con la información del dashboard
   */
  getDashboardData(): Observable<DashboardNotarioInformation> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Realizar la petición al endpoint del dashboard
    return this.http.get<DashboardNotarioInformation>(`${environment.apiUrl}/api/notario/dashboard`, { headers })
    .pipe(
        map(response => {
          // Procesar la respuesta antes de devolverla
          return {
            nombre_notario: response.nombre_notario || 'notario',
            citas: response.citas || [],
            documentos: response.documentos || [],
          };
        }),
        catchError(error => {
          console.error('Error en el servicio NotarioDashboardService:', error);
          
          // Puedes añadir lógica adicional para manejar diferentes tipos de errores
          if (error.status === 401) {
            console.error('Error de autenticación: Token inválido o expirado');
          } else if (error.status === 403) {
            console.error('Error de autorización: No tienes permisos para acceder a estos datos');
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