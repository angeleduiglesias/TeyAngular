import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces para seguridad de tipos
export interface User {
  id: string;
  email: string;
  rol: string;
}

/**
 * Interfaz que define la estructura de la respuesta de autenticación
 * recibida desde el backend al iniciar sesión
 */
export interface AuthResponse {
  token: string;  // Token Sanctum para autenticación
  user: User;     // Información del usuario autenticado
}

// Interfaz para la respuesta de actualización
export interface UpdateResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'  // Servicio disponible en toda la aplicación
})
export class AuthService {
  // Observable para mantener el estado del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl; // Obtiene la URL base desde el environment
  
  constructor(private http: HttpClient) {
    // Carga el usuario desde localStorage al iniciar el servicio
    this.loadUserFromStorage();
  }
  
  // Recupera la información del usuario almacenada localmente
  private loadUserFromStorage() {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData && token) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }
  
  // Autentica al usuario y almacena su información
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Almacena token y datos del usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            // Actualiza el observable con los datos del usuario
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }
  
  // Cierra la sesión del usuario y limpia los datos almacenados
  logout(): Observable<any> {
    // Configurar los headers con el token de autenticación
    const headers = {
      'Authorization': `Bearer ${this.getToken()}`
    };

    return this.http.post<any>(`${this.apiUrl}/api/logout`, {}, { headers })
      .pipe(
        tap(() => {
          // Elimina datos de sesión del almacenamiento local
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Actualiza el observable para indicar que no hay usuario activo
          this.currentUserSubject.next(null);
        }),
        catchError(error => {
          // Si hay un error en la petición, limpiamos los datos locales de todos modos
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.currentUserSubject.next(null);
          return throwError(() => error);
        })
      );
  }
  
  // Verifica si hay un usuario autenticado actualmente
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  // Obtiene el token de autenticación actual
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  // Obtiene el rol del usuario actual para control de acceso
  getCurrentUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.rol : null;
  }

  /**
   * Actualiza el email del usuario en el backend y en el estado local
   * @param nuevoEmail Nuevo email del usuario
   * @returns Observable con la respuesta del servidor
   */
  updateUserEmail(nuevoEmail: string): Observable<UpdateResponse> {
    const token = this.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    const endpoint = `${this.apiUrl}/api/actualizar-email`;
    const body = { email: nuevoEmail };
    
    console.log('Actualizando email del usuario:', nuevoEmail);
    
    return this.http.put<UpdateResponse>(endpoint, body, { headers })
      .pipe(
        tap(response => {
          // Si la actualización fue exitosa, actualizar el estado local
          if (response.success) {
            const currentUser = this.currentUserSubject.value;
            if (currentUser) {
              const updatedUser = { ...currentUser, email: nuevoEmail };
              // Actualizar localStorage
              localStorage.setItem('user', JSON.stringify(updatedUser));
              // Actualizar el observable
              this.currentUserSubject.next(updatedUser);
            }
          }
        }),
        catchError(error => {
          console.log('Error al actualizar email:', error);
          return throwError(() => error);
        })
      );
  }
}