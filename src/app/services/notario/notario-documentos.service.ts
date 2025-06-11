import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

interface Documento {
  documento_id: number;
  enlace_documento: string;
  nombre_documento: string;
  nombre_cliente: string;
  fecha_envio: string;
  tipo_empresa: string;
  estado: 'pendiente' | 'aprobado';
}

@Injectable({
  providedIn: 'root'
})
export class NotarioDocumentosService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene todos los documentos del notario
   * @returns Observable con la lista de documentos
   */
  getDocumentos(): Observable<Documento[]> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Realizar la petición al endpoint de documentos
    return this.http.get<Documento[]>(`${environment.apiUrl}/api/notario/documentos`, { headers })
    .pipe(
        map(response => {
          // Procesar la respuesta antes de devolverla
          return response || [];
        }),
        catchError(error => {
          console.error('Error al obtener documentos:', error);
          return throwError(() => error);
        })
      );
  }
 
  /**
   * Obtiene un documento específico por ID
   * @param documentoId ID del documento
   * @returns Observable con el documento
   */
  getDocumentoPorId(documentoId: number): Observable<Documento> {
    const token = this.authService.getToken();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.get<Documento>(`${environment.apiUrl}/api/notario/documentos/${documentoId}`, { headers })
    .pipe(
        catchError(error => {
          console.error('Error al obtener documento:', error);
          return throwError(() => error);
        })
      );
  }
}