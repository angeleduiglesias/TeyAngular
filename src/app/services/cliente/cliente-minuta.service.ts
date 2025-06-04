import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Importamos las interfaces necesarias desde el componente del formulario
import {
  FormularioMinuta,
  TipoFormularioMinuta
} from '../../../pages/cliente/dashboard/formulario_minuta/form-minuta-component';

// Interfaz para la respuesta del servidor
export interface MinutaResponse {
  success: boolean;
  message: string;
  id_minuta?: number;
}

// Interfaz para el envío de datos de la minuta
export interface MinutaRequest {
  formulario: FormularioMinuta;
  tipo_formulario: TipoFormularioMinuta;
  nombre_empresa: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteMinutaService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Envía los datos del formulario de minuta al backend
   * @param formularioData Datos del formulario de minuta
   * @param tipoFormulario Tipo de formulario seleccionado
   * @param nombreEmpresa Nombre de la empresa
   * @returns Observable con la respuesta del servidor
   */
  enviarFormularioMinuta(formularioData: FormularioMinuta, tipoFormulario: TipoFormularioMinuta, nombreEmpresa: string): Observable<any> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Preparar los datos a enviar
    const data: MinutaRequest = {
      formulario: formularioData,
      tipo_formulario: tipoFormulario,
      nombre_empresa: nombreEmpresa
    };
    
    // Realizar la petición POST al endpoint de minuta
    return this.http.post<any>(`${environment.apiUrl}/api/cliente/minuta`, data, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en el servicio ClienteMinutaService:', error);
          
          // Manejar diferentes tipos de errores
          if (error.status === 401) {
            console.error('Error de autenticación: Token inválido o expirado');
          } else if (error.status === 403) {
            console.error('Error de autorización: No tienes permisos para realizar esta acción');
          } else if (error.status === 404) {
            console.error('Error: Endpoint no encontrado');
          } else if (error.status === 422) {
            console.error('Error de validación:', error.error);
          } else if (error.status === 0) {
            console.error('Error de conexión: No se pudo conectar con el servidor');
          }
          
          // Propagar el error para que el componente pueda manejarlo
          return throwError(() => error);
        })
      );
  }
}