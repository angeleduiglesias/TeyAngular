import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

@Injectable({
  providedIn: 'root'
})
export class CambiarNombreService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  cambiarNombreEmpresa(cliente_id: number, nombre_empresa: string): Observable<any> {
    const payload = {
      cliente_id,
      nombre_empresa
    };
    
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Usar PUT como solicitado y la URL base del environment
    return this.http.put(`${environment.apiUrl}/api/admin/cambiarNombre`, payload, { headers });
  }
}
