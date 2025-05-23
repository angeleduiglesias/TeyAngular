import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Definimos la interfaz Client aquí para poder reutilizarla
export interface Client {
    id: number;
    nombre_cliente: string;
    dni: string;
    tipo_empresa: string;
    estado: string;
    created_at: string; //o fecha de  registro, si lo modificas
    progreso: string;  //este seria el estado del tramite, en base a eso yo evaluo
    pago1: boolean;  // en cuanto a esto, primero necesitamos guardar el pago y luego lo arreglamos
    pago2: boolean;
    contacto: string;
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
    return this.http.get<Client[]>(`${environment.apiUrl}/api/admin/clientes`, { headers })
    .pipe(
      map(response => {
        console.log('Clientes recibidos:', response);
        // Transformar los datos recibidos para adaptarlos a nuestra interfaz
        return response.map(cliente => {
          // Crear un objeto que cumpla con nuestra interfaz
          const clienteFormateado: Client = {
            id: cliente.id,
            nombre_cliente: cliente.nombre_cliente || '',
            dni: cliente.dni || '',
            contacto: cliente.contacto || '',
            email: cliente.email || 'No especificado',
            estado: cliente.estado || 'pendiente',
            // Usar created_at como fechaRegistro
            created_at: cliente.created_at || new Date().toISOString(),
            // Campos que podrían no venir del backend
            tipo_empresa: cliente.tipo_empresa || 'No especificado',
                    progreso: cliente.progreso ||'No se inicio',
            pago1: !!cliente.pago1, // Convertir a booleano
            pago2: !!cliente.pago2, // Convertir a booleano,
            };
          
          return clienteFormateado;
        });
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
}