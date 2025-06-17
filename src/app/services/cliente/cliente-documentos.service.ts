import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Importamos la interfaz desde el componente
import { Documento } from '../../../pages/cliente/documentos/cliente-documentos.component';

@Injectable({
  providedIn: 'root'
})
export class ClienteDocumentosService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene la lista de documentos del cliente
   * @returns Observable con la lista de documentos
   */
  obtenerDocumentos(): Observable<Documento[]> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Realizar la petición GET al endpoint de documentos
    return this.http.get<Documento[]>(`${environment.apiUrl}/api/cliente/documentos`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en el servicio ClienteDocumentosService:', error);
          
          // Manejar diferentes tipos de errores
          if (error.status === 401) {
            console.error('Error de autenticación: Token inválido o expirado');
          } else if (error.status === 403) {
            console.error('Error de autorización: No tienes permisos para realizar esta acción');
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

  /**
   * Descarga un documento específico
   * @param documentoId ID del documento a descargar
   * @returns Observable con el blob del archivo
   */
  descargarDocumento(documentoId: number): Observable<Blob> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${environment.apiUrl}/api/cliente/documentos/${documentoId}/descargar`, {
      headers,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error al descargar documento:', error);
        return throwError(() => error);
      })
    );
  }


  /**
   * Obtiene la URL para visualizar un documento
   * @param documentoId ID del documento a visualizar
   * @returns Observable con la URL del documento
   */
  obtenerUrlVisualizacion(documentoId: number): Observable<{url: string}> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<{url: string}>(`${environment.apiUrl}/api/cliente/documentos/${documentoId}/visualizar`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al obtener URL de visualización:', error);
          return throwError(() => error);
        })
      );
  }
}