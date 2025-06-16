
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaNombre } from '../admin-dashboard-component';
import { CambiarNombreService } from '../../../../app/services/admin/admin-cambiarnombre.service';

@Component({
  selector: 'app-actividad-reciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actividad-reciente.component.html',
  styleUrl: './actividad-reciente.component.css'
})
export class ActividadRecienteComponent implements OnInit {
  @Input() reservasNombre: ReservaNombre[] = [];
  empresaEditando: number | null = null;
  nuevoNombreEmpresa: string = '';
  
  // Variables para el modal
  mostrarModal: boolean = false;
  reservaSeleccionada: ReservaNombre | null = null;

  // Variables para el archivo
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = '';

  constructor(private cambiarNombreService: CambiarNombreService) {}
  
  ngOnInit(): void {
    // Si no se reciben datos, usar datos de ejemplo
    if (this.reservasNombre.length === 0) {
      this.reservasNombre = [
       
      ];
    }
    
    // Asegurarse de que cada reserva tenga un id si viene del backend con cliente_id
    this.reservasNombre.forEach(reserva => {
      if (!reserva.id && reserva.cliente_id) {
        reserva.id = reserva.cliente_id;
      }
    });
  }

  iniciarEdicion(id: number, nombreActual: string | null): void {
    this.empresaEditando = id;
    this.nuevoNombreEmpresa = nombreActual || '';
    // Limpiar archivo al iniciar edición
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
  }

  // Propiedad para mensajes de notificación
  mensajeNotificacion: string | null = null;
  tipoNotificacion: 'exito' | 'error' | 'info' | null = null;
  
  // Método para mostrar notificaciones
  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error' | 'info' = 'info'): void {
    this.mensajeNotificacion = mensaje;
    this.tipoNotificacion = tipo;
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      this.mensajeNotificacion = null;
      this.tipoNotificacion = null;
    }, 3000);
  }
  
  // Método para manejar la selección de archivo
  onArchivoSeleccionado(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
      this.nombreArchivo = archivo.name;
    }
  }

  // Método para limpiar el archivo seleccionado
  limpiarArchivo(): void {
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
    // Limpiar el input file
    const fileInput = document.getElementById('archivoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  guardarEdicion(id: number): void {
    // Buscar la reserva por ID
    const reserva = this.reservasNombre.find(r => r.id === id || r.cliente_id === id);
    if (reserva && this.nuevoNombreEmpresa.trim()) {
      // Guardar el nombre para usarlo en la petición
      const nuevoNombre = this.nuevoNombreEmpresa.trim();
      
      // Aquí puedes agregar lógica para manejar el archivo si es necesario
      if (this.archivoSeleccionado) {
        console.log('Archivo seleccionado:', this.archivoSeleccionado.name);
        // TODO: Implementar lógica para subir el archivo al servidor
      }
      
      // Enviar la actualización al backend
      const cliente_id = reserva.cliente_id || id;
      this.cambiarNombreService.cambiarNombreEmpresa(cliente_id, nuevoNombre)
        .subscribe({
          next: (response: any) => {
            // Solo actualizar el nombre localmente si la petición fue exitosa
            reserva.nombre_empresa = nuevoNombre;
            console.log('Nombre de empresa actualizado correctamente:', response);
            
            // Mostrar notificación de éxito
            this.mostrarNotificacion('Nombre de empresa actualizado correctamente', 'exito');
            
            // Finalizar edición y limpiar archivo
            this.empresaEditando = null;
            this.nuevoNombreEmpresa = '';
            this.limpiarArchivo();
          },
          error: (error: any) => {
            console.error('Error al actualizar el nombre de la empresa:', error);
            // Mostrar notificación de error
            this.mostrarNotificacion('Error al actualizar el nombre de la empresa', 'error');
          }
        });
    } else {
      // Finalizar edición sin cambios si no hay reserva o el nombre está vacío
      this.empresaEditando = null;
      this.nuevoNombreEmpresa = '';
      this.limpiarArchivo();
      // Mostrar notificación informativa
      this.mostrarNotificacion('No se realizaron cambios en el nombre', 'info');
    }
  }

  cancelarEdicion(): void {
    this.empresaEditando = null;
    this.nuevoNombreEmpresa = '';
    this.limpiarArchivo();
  }

  verDetalles(id: number): void {
    // Buscar la reserva por ID
    const reserva = this.reservasNombre.find(r => r.id === id || r.cliente_id === id);
    if (reserva) {
      // Crear una copia para evitar problemas de referencia
      this.reservaSeleccionada = {...reserva};
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.reservaSeleccionada = null;
  }

  // Método auxiliar para obtener el ID correcto de la reserva
  getReservaId(reserva: ReservaNombre): number {
    // Usar el id si existe, de lo contrario usar cliente_id
    return reserva.id || reserva.cliente_id || 0;
  }

  // Propiedad para el mensaje de copiado
  mensajeCopia: string | null = null;
  
  // Método para copiar al portapapeles
  copiarAlPortapapeles(texto: string | null): void {
    if (texto === null) return;
    
    navigator.clipboard.writeText(texto).then(() => {
      // Mostrar mensaje de éxito
      this.mensajeCopia = 'Texto copiado al portapapeles';
      
      // Ocultar el mensaje después de 2 segundos
      setTimeout(() => {
        this.mensajeCopia = null;
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar texto: ', err);
      this.mensajeCopia = 'Error al copiar texto';
      
      setTimeout(() => {
        this.mensajeCopia = null;
      }, 2000);
    });
  }
}