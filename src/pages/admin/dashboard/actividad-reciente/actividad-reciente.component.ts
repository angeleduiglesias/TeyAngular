import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaMinuta } from '../admin-dashboard-component';

@Component({
  selector: 'app-actividad-reciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actividad-reciente.component.html',
  styleUrl: './actividad-reciente.component.css'
})
export class ActividadRecienteComponent implements OnInit {
  @Input() reservasMinuta: ReservaMinuta[] = [];
  empresaEditando: number | null = null;
  nuevoNombreEmpresa: string = '';
  
  // Variables para el modal
  mostrarModal: boolean = false;
  reservaSeleccionada: ReservaMinuta | null = null;

  ngOnInit(): void {
    // Si no se reciben datos, usar datos de ejemplo
    if (this.reservasMinuta.length === 0) {
      this.reservasMinuta = [
        {
          id: 1,
          nombre_cliente: 'Juan Pérez',
          nombre_empresa: 'Inversiones JP S.A.C.',
          tipo_empresa: 'SAC',
          posible_nombre1: 'JP Inversiones',
          posible_nombre2: 'Grupo JP',
          posible_nombre3: 'JP Capital',
          posible_nombre4: 'JP Consulting'
        },
        {
          id: 2,
          nombre_cliente: 'María López',
          nombre_empresa: 'Tech Solutions E.I.R.L.',
          tipo_empresa: 'EIRL',
          posible_nombre1: 'ML Solutions',
          posible_nombre2: 'Tech ML',
          posible_nombre3: 'ML Tech',
          posible_nombre4: 'Solutions ML'
        },
        {
          id: 3,
          nombre_cliente: 'Carlos Rodríguez',
          nombre_empresa: 'Constructora CR S.A.',
          tipo_empresa: 'SA',
          posible_nombre1: 'CR Construcciones',
          posible_nombre2: 'Grupo Constructor CR',
          posible_nombre3: 'CR Edificaciones',
          posible_nombre4: 'Constructora Rodríguez'
        }
      ];
    }
  }

  iniciarEdicion(id: number, nombreActual: string): void {
    this.empresaEditando = id;
    this.nuevoNombreEmpresa = nombreActual;
  }

  guardarEdicion(id: number): void {
    // Buscar la reserva por ID
    const reserva = this.reservasMinuta.find(r => r.id === id);
    if (reserva && this.nuevoNombreEmpresa.trim()) {
      // Actualizar el nombre de la empresa
      reserva.nombre_empresa = this.nuevoNombreEmpresa.trim();
      
      // En un caso real, aquí se enviaría la actualización al backend
      console.log(`Nombre de empresa actualizado para ID ${id}: ${this.nuevoNombreEmpresa}`);
      
      // Finalizar edición
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
    const reserva = this.reservasMinuta.find(r => r.id === id);
    if (reserva) {
      this.reservaSeleccionada = reserva;
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.reservaSeleccionada = null;
  }

  // Añadir esta nueva propiedad para el mensaje de copiado
  mensajeCopia: string | null = null;
  
  // Añadir este nuevo método para copiar al portapapeles
  copiarAlPortapapeles(texto: string): void {
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