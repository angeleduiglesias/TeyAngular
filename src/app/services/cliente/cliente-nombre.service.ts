import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteNombreService {
  private nombreCliente: string = 'Cliente';

  constructor() {
    // Al iniciar, intentar recuperar desde sessionStorage
    const nombreGuardado = sessionStorage.getItem('nombreCliente');
    if (nombreGuardado) {
      this.nombreCliente = nombreGuardado;
    }
  }

  // Guardar el nombre del cliente (se llama una vez, desde ClienteComponent)
  setNombre(nombre_cliente: string): void {
    this.nombreCliente = nombre_cliente;
    sessionStorage.setItem('nombreCliente', nombre_cliente);
  }

  // Obtener el nombre del cliente
  getNombre(): string {
    return this.nombreCliente;
  }

  // Opcional: limpiar el nombre al cerrar sesión
  limpiarNombre(): void {
    this.nombreCliente = '';
    sessionStorage.removeItem('nombreCliente');
  }
}
