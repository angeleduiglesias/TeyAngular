import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Interfaz para el modelo de Notario
export interface Notary {
    id: number;
    apellidos: string;
    nombre: string;
    telefono: string;
    email: string;
  }
  
@Injectable({
    providedIn: 'root'
  })
  export class AdminNotaryService {
    private apiUrl = `${environment.apiUrl}/api/admin/notarios`;
    private notariesCache$: Observable<Notary[]> | null = null;
  
    constructor(
      private http: HttpClient,
      private authService: AuthService
    ) { }
  
    // Obtener todos los notarios
    getNotaries(): Observable<Notary[]> {
      if (!this.notariesCache$) {
        const headers = this.getAuthHeaders();
        this.notariesCache$ = this.http.get<Notary[]>(this.apiUrl, { headers })
          .pipe(
            map(response => {
              return response;
            }),
            shareReplay(1),
            catchError(error => {
              console.error('Error obteniendo notarios:', error);
              // Limpiar cache en caso de error
              this.notariesCache$ = null;
              return throwError(() => error);
            })
          );
      }
      return this.notariesCache$;
    }

    // Método para limpiar el cache cuando sea necesario
    clearNotariesCache(): void {
      this.notariesCache$ = null;
    }
    
    // Crear un nuevo notario
    createNotary(notary: Omit<Notary, 'id'>): Observable<Notary> {
      const headers = this.getAuthHeaders();
      return this.http.post<Notary>(this.apiUrl, notary, { headers })
        .pipe(
          map(response => {
            // Limpiar cache después de crear para obtener datos actualizados
            this.clearNotariesCache();
            return response;
          }),
          catchError(error => {
            console.error('Error creando notario:', error);
            return throwError(() => error);
          })
        );
    }
  
    // Actualizar un notario existente
    updateNotary(id: number, notary: Partial<Notary>): Observable<Notary> {
      const headers = this.getAuthHeaders();
      return this.http.put<Notary>(`${this.apiUrl}/${id}`, notary, { headers })
        .pipe(
          map(response => {
            // Limpiar cache después de actualizar para obtener datos actualizados
            this.clearNotariesCache();
            return response;
          }),
          catchError(error => {
            console.error(`Error actualizando notario con ID ${id}:`, error);
            return throwError(() => error);
          })
        );
    }
  
    // Eliminar un notario
    deleteNotary(id: number): Observable<void> {
      const headers = this.getAuthHeaders();
      return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
        .pipe(
          map(response => {
            // Limpiar cache después de eliminar para obtener datos actualizados
            this.clearNotariesCache();
            return response;
          }),
          catchError(error => {
            console.error(`Error eliminando notario con ID ${id}:`, error);
            return throwError(() => error);
          })
        );
    }
  
    // Método privado para obtener los headers con el token de autenticación
    private getAuthHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }
  }