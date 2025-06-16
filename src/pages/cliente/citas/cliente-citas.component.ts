import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteCitasService } from '../../../app/services/cliente/cliente-citas.service';

export interface Cita {
  cita_id: number;
  fecha_cita: string;
  hora_cita: string;
  nombre_notario: string;
  descripcion: string;
  estado: string;
}

@Component({
  selector: 'app-cliente-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-citas.component.html',
  styleUrl: './cliente-citas.component.css'
})
export class ClienteCitasComponent implements OnInit {
  citas: Cita[] = [];
  loading: boolean = false;
  error: string = '';

  // Filtro activo
  filtroActivo: string = 'todas';

  constructor(private clienteCitasService: ClienteCitasService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  /**
   * Carga la lista de citas desde el servicio
   */
  cargarCitas(): void {
    this.loading = true;
    this.error = '';
    
    this.clienteCitasService.obtenerCitas().subscribe({
      next: (citas) => {
        // Convertir las fechas de string a Date si es necesario
        this.citas =citas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.error = 'Error al cargar las citas. Por favor, intente nuevamente.';
        this.loading = false;
        
        // Mantener datos de ejemplo en caso de error para demostración
        this.citas = [
          {
            cita_id: 1,
            fecha_cita:'18 de junio de 2025',
            hora_cita: '10:00 AM',
            nombre_notario: 'Dr. Juan Pérez',
            descripcion: 'Firma de constitución de empresa',
            estado: 'Programada'
          },
          {
            cita_id: 2,
            fecha_cita: '19 de junio de 2025',
            hora_cita: '3:30 PM',
            nombre_notario: 'Dra. María Rodríguez',
            descripcion: 'Revisión de documentos',
            estado: 'Pendiente'
          },
          {
            cita_id: 3,
            fecha_cita: '18 de junio de 2025',
            hora_cita: '11:15 AM',
            nombre_notario: 'Dr. Carlos Mendoza',
            descripcion: 'Legalización de documentos',
            estado: 'Completada'
          }
        ];
      }
    });
  }

  // Filtrar citas por estado
  filtrarCitas(filtro: string): void {
    this.filtroActivo = filtro;
  }

  // Obtener citas filtradas
  get citasFiltradas(): Cita[] {
    if (this.filtroActivo === 'todas') {
      return this.citas;
    }
    return this.citas.filter(cita => cita.estado.toLowerCase() === this.filtroActivo.toLowerCase());
  }

  // Obtener clase CSS para el estado de la cita
  getEstadoClass(estado: string): string {
    switch(estado.toLowerCase()) {
      case 'programada':
        return 'estado-programada';
      case 'pendiente':
        return 'estado-pendiente';
      case 'completada':
        return 'estado-completada';
      case 'cancelada':
        return 'estado-cancelada';
      default:
        return '';
    }
  }

  // Verificar si una cita es próxima (en los próximos 3 días)
  esProxima(fechaString: string): boolean {
    const hoy = new Date();
    const fechaCita = new Date(fechaString);
    
    // Validar que la fecha sea válida
    if (isNaN(fechaCita.getTime())) {
      return false;
    }
    
    const diferenciaDias = Math.floor((fechaCita.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diferenciaDias >= 0 && diferenciaDias <= 3;
  }

  /**
   * Reintenta cargar las citas
   */
  reintentarCarga(): void {
    this.cargarCitas();
  }
}
