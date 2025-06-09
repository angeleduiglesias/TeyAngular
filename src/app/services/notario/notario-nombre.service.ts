import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotarioNombreService {
  private nombreNotario: string = 'Notario';

  constructor() {
    // Al iniciar, intentar recuperar desde sessionStorage
    const nombreGuardado = sessionStorage.getItem('nombreNotario');
    if (nombreGuardado) {
      this.nombreNotario = nombreGuardado;
    }
  }

  // Guardar el nombre del cliente (se llama una vez, desde ClienteComponent)
  setNombre(nombre_notario: string): void {
    this.nombreNotario = nombre_notario;
    sessionStorage.setItem('nombreNotario', nombre_notario);
  }

  // Obtener el nombre del cliente
  getNombre(): string {
    return this.nombreNotario;
  }

  // Opcional: limpiar el nombre al cerrar sesión
  limpiarNombre(): void {
    this.nombreNotario = '';
    sessionStorage.removeItem('nombreNotario');
  }
}
