import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';
import { TramiteReciente, PagosReciente, ReservaNombre} from '../../../pages/admin/dashboard/admin-dashboard-component';

export interface DashboardInformation {
  nombre_admin: string;
  clientes_registrados: number;
  clientes_activos: number;
  tramites_pendientes: number;
  tramites_recientes: TramiteReciente[];
  pagos_recientes: PagosReciente[];
  reserva_nombre: ReservaNombre[]; // Añadido para la nueva estructura de datos
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene los datos del dashboard del administrador
   * @returns Observable con la información del dashboard
   */
  getDashboardData(): Observable<DashboardInformation> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Realizar la petición al endpoint del dashboard
    return this.http.get<DashboardInformation>(`${environment.apiUrl}/api/admin/dashboard`, { headers })
    .pipe(
        map(response => {
          // Procesar la respuesta antes de devolverla
          return {
            nombre_admin: response.nombre_admin || 'admin',
            pagos_recientes: response.pagos_recientes || [],
            tramites_recientes: response.tramites_recientes || [],
            clientes_registrados: response.clientes_registrados || 0,
            clientes_activos: response.clientes_activos || 0,
            tramites_pendientes: response.tramites_pendientes || 0,
            reserva_nombre: response.reserva_nombre || [], // Añadido para la nueva estructura de datos
            
          };
        }),
        catchError(error => {
          console.error('Error en el servicio AdminDashboardService:', error);
          
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