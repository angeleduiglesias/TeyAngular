import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Definimos la interfaz Client aquí para poder reutilizarla
export interface Payments {
    id: number;
    nombre_cliente: string;
    dni: string;
    tipo_pago: string;
    monto: number;
    fecha: Date;
    estado_pago: string;
    forma_pago: string;
  }  

@Injectable({
  providedIn: 'root'
})
export class AdminPaymentsService {
    private paymentsCache$: Observable<Payments[]> | null = null;

    constructor(
        private http: HttpClient,
        private authService: AuthService
      ) { }

      /**
       * Obtiene los datos del dashboard del administrador
       * @returns Observable con la información del dashboard
       */
      getPayments(): Observable<Payments[]> {
        if (!this.paymentsCache$) {
          // Obtener el token del servicio de autenticación
          const token = this.authService.getToken();
          
          // Establecer encabezados de autorización
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });

          // Realizar la petición al endpoint
          this.paymentsCache$ = this.http.get<Payments[]>(`${environment.apiUrl}/api/admin/pagos`, { headers })
          .pipe(
            map(response => {
              console.log('Pagos recibidos:', response);
              // Transformar los datos recibidos para adaptarlos a nuestra interfaz
              return response.map(payments => {
                // Crear un objeto que cumpla con nuestra interfaz
                const PagoFormateado: Payments = {
                  id: payments.id,
                  nombre_cliente: payments.nombre_cliente || '',
                  dni: payments.dni || '',
                  tipo_pago: this.formatTipoPago(payments.tipo_pago) || '',
                  monto: payments.monto || 0,
                  fecha: payments.fecha || 'No disponible',
                  estado_pago: payments.estado_pago || 'pendiente',
                  forma_pago: payments.forma_pago || 'Tarjeta',
                  };
                
                return PagoFormateado ;
              });
            }),
            shareReplay(1),
            catchError(error => {
              console.error('Error al cargar pagos:', error);
              
              // Limpiar cache en caso de error
              this.paymentsCache$ = null;
              
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
        return this.paymentsCache$;
      }

      // Método para limpiar el cache cuando sea necesario
      clearPaymentsCache(): void {
        this.paymentsCache$ = null;
      }

      // Añadir este método a la clase
      private formatTipoPago(tipoPago: string): string {
        if (!tipoPago) return '';
        
        // Eliminar guiones y dividir en palabras
        const palabras = tipoPago.split('_');
        
        // Capitalizar la primera letra de cada palabra y unirlas con espacio
        return palabras.map(palabra => {
          return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
        }).join(' ');
      }
}