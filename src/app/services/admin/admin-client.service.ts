import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Definimos la interfaz Client aquí para poder reutilizarla
export interface Client {
    id: number;
    nombre: string;
    dni: string;
    tipoEmpresa: string;
    progreso: number;
    pago1: boolean;
    pago2: boolean;
    telefono: string;
    email: string;
  }  

@Injectable({
  providedIn: 'root'
})
export class AdminClientService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
      ) { }

      /**
       * Obtiene los datos del dashboard del administrador
       * @returns Observable con la información del dashboard
       */
      getClients(): Observable<Client[]> {
        // Obtener el token del servicio de autenticación
        const token = this.authService.getToken();
        
        // Establecer encabezados de autorización
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        // Realizar la petición al endpoint
    return this.http.get<Client[]>(`${environment.apiUrl}/api/cliente`, { headers })
    .pipe(
      map(response => {
        console.log('Clientes recibidos:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error al cargar clientes:', error);
        
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

/**
 * Elimina un cliente por su ID
 * @param id ID del cliente a eliminar
 * @returns Observable con la respuesta del servidor
 */
deleteClient(id: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  
  return this.http.delete(`${environment.apiUrl}/api/cliente/${id}`, { headers })
    .pipe(
      catchError(error => {
        console.error(`Error al eliminar cliente con ID ${id}:`, error);
        return throwError(() => error);
      })
    );
}
}