import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private apiUrl = environment.apiUrl; // Asegúrate de configurar esto en tu environment

  constructor(private http: HttpClient) { }

  enviarCapital(datos: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  return this.http.post(`${this.apiUrl}/api/capital`, datos, { headers });
  }

  // Método para enviar datos personales (Step One)
  enviarDatosPersonales(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      
    });
    
    return this.http.post(`${this.apiUrl}/api/cliente/store`, datos, { headers });
  }

  // Método para enviar datos de empresa (Step Two)
  enviarDatosEmpresa(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/api/datos-empresa`, datos, { headers });
  }

  // Método para enviar formulario completo
  enviarFormularioCompleto(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/api/formulario-completo`, datos, { headers });
  }
}