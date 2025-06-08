import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, shareReplay } from 'rxjs/operators';
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
  created_at: string;
  progreso: string;
  pago1: boolean;
  pago2: boolean;
  nombre_empresa: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminClientService {
  // Observable cacheado
  private clientsCache$!: Observable<Client[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /** 
   * Obtiene la lista de clientes. 
   * La petición se cachea en memoria tras la primera llamada.
   */
  getClients(): Observable<Client[]> {
    if (!this.clientsCache$) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      this.clientsCache$ = this.http
        .get<Client[]>(`${environment.apiUrl}/api/admin/clientes`, { headers })
        .pipe(
          map(response => {
            console.log('Clientes recibidos:', response);
            return response.map(cliente => ({
              id: cliente.id,
              nombre_cliente: cliente.nombre_cliente || '',
              dni: cliente.dni || '',
              telefono: cliente.telefono || '',
              email: cliente.email || 'No especificado',
              estado: cliente.estado || 'pendiente',
              created_at: cliente.created_at || new Date().toISOString(),
              tipo_empresa: cliente.tipo_empresa || 'No especificado',
              nombre_empresa: cliente.nombre_empresa || 'No especificado',
              progreso: cliente.progreso || 'No se inició',
              pago1: !!cliente.pago1,
              pago2: !!cliente.pago2,
            }));
          }),
          shareReplay(1),    // cachea la última emisión
          catchError(error => {
            console.error('Error al cargar clientes:', error);
            return throwError(() => error);
          })
        );
    }
    return this.clientsCache$;
  }

  /**
   * Limpia la caché en memoria para forzar
   * una nueva petición en la próxima llamada.
   */
  clearClientsCache(): void {
    this.clientsCache$ = undefined!;
  }
}
