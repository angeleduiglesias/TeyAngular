
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

  constructor(private cambiarNombreService: CambiarNombreService) {}
  
  ngOnInit(): void {
    // Si no se reciben datos, usar datos de ejemplo
    if (this.reservasNombre.length === 0) {
      this.reservasNombre = [
        {
          id: 1,
          cliente_id: 1,
          nombre_cliente: 'Juan Pérez',
          nombre_empresa: 'Tecnología Innovadora S.A.C.',
          tipo_empresa: 'SAC',
          posible_nombre1: 'TecnoInnovación S.A.C.',
          posible_nombre2: 'InnovaTech Perú S.A.C.',
          posible_nombre3: 'Soluciones Tecnológicas S.A.C.',
          posible_nombre4: 'Digital Solutions S.A.C.'
        },
        {
          id: 2,
          cliente_id: 2,
          nombre_cliente: 'María García',
          nombre_empresa: 'Consultores Asociados E.I.R.L.',
          tipo_empresa: 'EIRL',
          posible_nombre1: 'Consultoría Integral E.I.R.L.',
          posible_nombre2: 'Asesoría Empresarial E.I.R.L.',
          posible_nombre3: 'Consultores Expertos E.I.R.L.',
          posible_nombre4: 'Soluciones Empresariales E.I.R.L.'
        }
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
  }

  guardarEdicion(id: number): void {
    // Buscar la reserva por ID
    const reserva = this.reservasNombre.find(r => r.id === id || r.cliente_id === id);
    if (reserva && this.nuevoNombreEmpresa.trim()) {
      // Guardar el nombre para usarlo en la petición
      const nuevoNombre = this.nuevoNombreEmpresa.trim();
      
      // Enviar la actualización al backend
      const cliente_id = reserva.cliente_id || id;
      this.cambiarNombreService.cambiarNombreEmpresa(cliente_id, nuevoNombre)
        .subscribe({
          next: (response: any) => {
            // Solo actualizar el nombre localmente si la petición fue exitosa
            reserva.nombre_empresa = nuevoNombre;
            console.log('Nombre de empresa actualizado correctamente:', response);
            
            // Finalizar edición
            this.empresaEditando = null;
            this.nuevoNombreEmpresa = '';
          },
          error: (error: any) => {
            console.error('Error al actualizar el nombre de la empresa:', error);
            // No actualizar el nombre localmente si hay error
            // Opcionalmente, mostrar un mensaje de error al usuario
          }
        });
    } else {
      // Finalizar edición sin cambios si no hay reserva o el nombre está vacío
      this.empresaEditando = null;
      this.nuevoNombreEmpresa = '';
    }
  }

  cancelarEdicion(): void {
    this.empresaEditando = null;
    this.nuevoNombreEmpresa = '';
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