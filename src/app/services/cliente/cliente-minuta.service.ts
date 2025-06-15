import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Importamos las interfaces desde ambos componentes
import {
  FormularioMinuta,
} from '../../../pages/cliente/dashboard/formulario_minuta/form-EIRL/form.eirl.component';

import {
  FormularioSAC,
} from '../../../pages/cliente/dashboard/formulario_minuta/form-SAC/form.sac.component';

// Interfaz genérica para el envío de datos de la minuta
export interface MinutaRequest {
formulario: {
  paso_1: any;
  paso_2: any;
  paso_3: any[];
  paso_4: any;
  paso_5: any;
  paso_6: any;
};
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

   * Envía los datos del formulario de minuta al backend (SAC)
   * @param formularioData Datos del formulario de minuta SAC
   * @returns Observable con la respuesta del servidor
   */
  enviarFormularioMinuta(formularioData: FormularioSAC,): Observable<any>;
  
  /**
   * Implementación del método que maneja ambos tipos de formularios
   */
  enviarFormularioMinuta(
    formularioData:  FormularioSAC, 
  ): Observable<any> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Configurar headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Preparar los datos a enviar
    const data: MinutaRequest = {
    formulario: {
      paso_1: formularioData.paso_1,
      paso_2: formularioData.paso_2,
      paso_3: formularioData.paso_3,
      paso_4: formularioData.paso_4,
      paso_5: formularioData.paso_5,
      paso_6: formularioData.paso_6,
    }
  };

      // Usar un solo endpoint para ambos tipos
      const endpoint = `${environment.apiUrl}/api/cliente/minuta`;
    
    // Realizar la petición POST al endpoint correspondiente
    return this.http.post<any>(endpoint, data, { headers })
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
