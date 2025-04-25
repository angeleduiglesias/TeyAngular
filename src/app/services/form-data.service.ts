import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }
  
  // Método para enviar formulario completo
  enviarFormularioCompleto(datosEmpresa: any, datosPersonales: any) {
    // Crear un objeto que contenga ambos conjuntos de datos
    const datosCompletos = {
      empresa: datosEmpresa,
      personal: datosPersonales
    };
    
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
            localStorage.removeItem('datos_formulario_completo');
            localStorage.removeItem('datos_empresa_completo');
            console.log('Datos temporales eliminados del localStorage');
          }
        })
      );
  }
}