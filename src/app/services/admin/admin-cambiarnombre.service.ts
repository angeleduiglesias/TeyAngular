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

  cambiarNombreEmpresa(cliente_id: number, nombre_empresa: string, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('cliente_id', cliente_id.toString());
    formData.append('nombre_empresa', nombre_empresa);
    formData.append('nombreArchivo', archivo); // 👈 importante: nombre debe coincidir con el backend

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // NO poner Content-Type aquí, Angular lo maneja automáticamente
    });

    // Usa POST o PUT según lo que hayas configurado en Laravel
    return this.http.post(`${environment.apiUrl}/api/admin/cambiarNombre`, formData, { headers });
  }
}
