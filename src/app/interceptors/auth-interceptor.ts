import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service';

// permite que esta clase sea inyectable en otros componentes/servicios
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Inyecta el servicio de autenticación para acceder al token
  constructor(private authService: AuthService) {}
  
  // Método que intercepta las peticiones HTTP
  // Se ejecuta automáticamente en cada petición HTTP
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtiene el token de autenticación del servicio
    const token = this.authService.getToken();
    
    // Si existe un token, lo añade al encabezado de la petición
    if (token) {
      // Clona la petición original y añade el token al encabezado
      request = request.clone({
        setHeaders: {
          //autenticación con Sactum
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Continúa con la cadena de interceptores y finalmente realiza la petición
    return next.handle(request);
  }
}