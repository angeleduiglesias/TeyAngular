import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';
import { EstadoFormActivated, TramiteData, PagoData } from '../../../pages/cliente/dashboard/cliente-dashboard-component';


export interface DashboardClienteInformation {
  nombre_cliente: string;
  estado_tramite: TramiteData;
  estado_pagos: PagoData;
  estado_documento: EstadoFormActivated;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteDashboardService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene los datos del dashboard del administrador
   * @returns Observable con la información del dashboard
   */
  getDashboardData(): Observable<DashboardClienteInformation> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Realizar la petición al endpoint del dashboard
    return this.http.get<DashboardClienteInformation>(`${environment.apiUrl}/api/cliente/dashboard`, { headers })
    .pipe(
        map(response => {
          // Procesar la respuesta antes de devolverla
          return {
            nombre_cliente: response.nombre_cliente || 'cliente',
            estado_tramite: response.estado_tramite || [],
            estado_pagos: response.estado_pagos || [],
            estado_documento: response.estado_documento || [],
            
          };
        }),
        catchError(error => {
          console.error('Error en el servicio ClienteDashboardService:', error);
          
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