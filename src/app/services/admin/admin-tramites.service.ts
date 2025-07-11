import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Definimos la interfaz Client aquí para poder reutilizarla
export interface Tramites {
    id: number;
    nombre_cliente: string;
    fecha_inicio: Date;
    fecha_fin: Date | null;
    estado_tramite: string;
    nombre_empresa: string;
    pago1: boolean;
    pago2: boolean;
  }  

@Injectable({
  providedIn: 'root'
})
export class AdminTramitesService {
    private tramitesCache$: Observable<Tramites[]> | null = null;

    constructor(
        private http: HttpClient,
        private authService: AuthService
      ) { }

      /**
       * Obtiene los datos del dashboard del administrador
       * @returns Observable con la información del dashboard
       */
      getTramites(): Observable<Tramites[]> {
        if (!this.tramitesCache$) {
          // Obtener el token del servicio de autenticación
          const token = this.authService.getToken();
          
          // Establecer encabezados de autorización
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });

          // Realizar la petición al endpoint
          this.tramitesCache$ = this.http.get<Tramites[]>(`${environment.apiUrl}/api/admin/tramites`, { headers })
          .pipe(
            map(response => {
              console.log('Tramites recibidos:', response);
              // Transformar los datos recibidos para adaptarlos a nuestra interfaz
              return response.map(tramites => {
                // Crear un objeto que cumpla con nuestra interfaz
                const TramitesFormateado: Tramites = {
                  id: tramites.id,
                  nombre_cliente: tramites.nombre_cliente || '',
                  fecha_inicio: tramites.fecha_inicio || '',
                  fecha_fin: tramites.fecha_fin || null,
                  estado_tramite: tramites.estado_tramite || 'Sin especificar',
                  nombre_empresa: tramites.nombre_empresa || 'No disponible',
                  pago1: tramites.pago1 || false,
                  pago2: tramites.pago2 || false,
                  };
                
                return TramitesFormateado;
              });
            }),
            shareReplay(1),
            catchError(error => {
              console.error('Error al cargar tramites:', error);
              
              // Limpiar cache en caso de error
              this.tramitesCache$ = null;
              
              // Manejo de diferentes tipos de errores
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
        return this.tramitesCache$;
      }

      // Método para limpiar el cache cuando sea necesario
      clearTramitesCache(): void {
        this.tramitesCache$ = null;
      }
}