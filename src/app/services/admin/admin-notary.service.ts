import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
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
  
    constructor(
      private http: HttpClient,
      private authService: AuthService
    ) { }
  
    // Obtener todos los notarios
    getNotaries(): Observable<Notary[]> {
      const headers = this.getAuthHeaders();
      return this.http.get<Notary[]>(this.apiUrl, { headers })
        .pipe(
          map(response => {
            return response;
          }),
          catchError(error => {
            console.error('Error obteniendo notarios:', error);
            return throwError(() => error);
          })
        );
    }
  
    // Obtener un notario por ID
    getNotaryById(id: number): Observable<Notary> {
      const headers = this.getAuthHeaders();
      return this.http.get<Notary>(`${this.apiUrl}/${id}`, { headers })
        .pipe(
          catchError(error => {
            console.error(`Error obteniendo notario con ID ${id}:`, error);
            return throwError(() => error);
          })
        );
    }
  
    // Crear un nuevo notario
    createNotary(notary: Omit<Notary, 'id'>): Observable<Notary> {
      const headers = this.getAuthHeaders();
      return this.http.post<Notary>(this.apiUrl, notary, { headers })
        .pipe(
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