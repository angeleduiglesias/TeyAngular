import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';
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
    return this.http.post<any>(`${this.apiUrl}/api/pre-form`, datosCompletos)
      .pipe(
        tap(response => {
          // Si la respuesta es exitosa, limpiar localStorage
          if (response) {
            // Guardar solo los datos completos finales
            localStorage.setItem('datos_completos', JSON.stringify(datosCompletos));
            
            // Guardar el DNI para el paso 5
            if (datosCompletos.dni) {
              localStorage.setItem('dni_usuario', datosCompletos.dni);
            }
            
            // Eliminar datos temporales
            localStorage.removeItem('step_one_data');
            localStorage.removeItem('step_two_data');
            localStorage.removeItem('step_three_data');
            localStorage.removeItem('step_four_data');
            console.log('Datos temporales eliminados del localStorage, DNI guardado para paso 5');
          }
        }),
        catchError(error => {
          console.error('Error al enviar formulario:', error);
          return throwError(() => new Error('Error al enviar el formulario. Por favor, inténtalo de nuevo.'));
        })
      );
  }
}