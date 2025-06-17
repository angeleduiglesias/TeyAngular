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

  /**
   * Sube un documento firmado por el notario
   * @param documentoId ID del documento original
   * @param archivo Archivo firmado a subir
   * @returns Observable con la respuesta del servidor
   */
  subirDocumentoFirmado(documentoId: number, archivo: File): Observable<any> {
    const token = this.authService.getToken();
    
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('documento_firmado', archivo);
    formData.append('documento_id', documentoId.toString());
    formData.append('nombreArchivo', archivo.name);
    
    // Configurar headers (no incluir Content-Type para FormData)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${environment.apiUrl}/api/notario/documentos/${documentoId}/firmar`, formData, { headers })
    .pipe(
        map(response => {
          console.log('Documento firmado subido exitosamente:', response);
          return response;
        }),
        catchError(error => {
          console.error('Error al subir documento firmado:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Descarga un documento por su ID
   * @param documentoId ID del documento a descargar
   * @returns Observable con el blob del archivo
   */
  descargarDocumento(documentoId: number): Observable<Blob> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get(`${environment.apiUrl}/api/notario/documentos/${documentoId}/descargar`, {
      headers,
      responseType: 'blob'
    })
    .pipe(
      catchError(error => {
        console.error('Error al descargar documento:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Muestra un documento específico por ID usando el endpoint mostrar
   * @param documentoId ID del documento a mostrar
   * @returns Observable con el documento
   */
  mostrarDocumento(documentoId: number): Observable<Documento> {
    const token = this.authService.getToken();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    
    return this.http.get<Documento>(`${environment.apiUrl}/api/notario/documentos/${documentoId}/mostrar`, { headers })
    .pipe(
        catchError(error => {
          console.error('Error al mostrar documento:', error);
          return throwError(() => error);
        })
      );
  }
}