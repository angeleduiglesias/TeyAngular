import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

// Interfaces para seguridad de tipos
export interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'  // Servicio disponible en toda la aplicación
})
export class AuthService {
  // Observable para mantener el estado del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost/TeyLaravel/public/api'; // URL base de la API
  
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
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
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
    return this.http.post<any>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          // Elimina datos de sesión del almacenamiento local
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Actualiza el observable para indicar que no hay usuario activo
          this.currentUserSubject.next(null);
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
}