import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }
  
  // Método para enviar formulario completo
  enviarFormularioCompleto(datosCompletos:any) {
    
    // Enviar al backend y limpiar localStorage después de éxito
    return this.http.post<any>(`${this.apiUrl}/pre-form`, datosCompletos)
      .pipe(
        tap(response => {
          // Si la respuesta es exitosa, limpiar localStorage
          if (response) {
            // Guardar solo los datos completos finales
            localStorage.setItem('datos_completos', JSON.stringify(datosCompletos));
            
            // Eliminar datos temporales
            localStorage.removeItem('step_one_data');
            localStorage.removeItem('step_two_data');
            localStorage.removeItem('step_three_data');
            localStorage.removeItem('datos_completos');
            console.log('Datos temporales eliminados del localStorage');
          }
        }),
        catchError(error => {
          console.error('Error al enviar formulario:', error);
          return throwError(() => new Error('Error al enviar el formulario. Por favor, inténtalo de nuevo.'));
        })
      );
  }
}