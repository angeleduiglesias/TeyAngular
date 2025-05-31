import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cita {
  id: number;
  fecha: Date;
  hora: string;
  notario: string;
  asunto: string;
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
  citas: Cita[] = [
    {
      id: 1,
      fecha: new Date(new Date().setDate(new Date().getDate() + 2)),
      hora: '10:00 AM',
      notario: 'Dr. Juan Pu00e9rez',
      asunto: 'Firma de constituciu00f3n de empresa',
      estado: 'Programada'
    },
    {
      id: 2,
      fecha: new Date(new Date().setDate(new Date().getDate() + 5)),
      hora: '3:30 PM',
      notario: 'Dra. Maru00eda Rodru00edguez',
      asunto: 'Revisiu00f3n de documentos',
      estado: 'Pendiente'
    },
    {
      id: 3,
      fecha: new Date(new Date().setDate(new Date().getDate() - 10)),
      hora: '11:15 AM',
      notario: 'Dr. Carlos Mendoza',
      asunto: 'Legalizaciu00f3n de documentos',
      estado: 'Completada'
    }
  ];

  // Filtro activo
  filtroActivo: string = 'todas';

  constructor() {}

  ngOnInit(): void {
    // Inicializaciu00f3n del componente
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

  // Verificar si una cita es pru00f3xima (en los pru00f3ximos 3 du00edas)
  esProxima(fecha: Date): boolean {
    const hoy = new Date();
    const diferenciaDias = Math.floor((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diferenciaDias >= 0 && diferenciaDias <= 3;
  }

  // Solicitar nueva cita
  solicitarCita(): void {
    console.log('Solicitando nueva cita');
    // Aquu00ed iru00eda la lu00f3gica para abrir un formulario de solicitud de cita
  }

  // Cancelar cita
  cancelarCita(id: number): void {
    console.log(`Cancelando cita con ID: ${id}`);
    // Aquu00ed iru00eda la lu00f3gica para cancelar una cita
  }

  // Reprogramar cita
  reprogramarCita(id: number): void {
    console.log(`Reprogramando cita con ID: ${id}`);
    // Aquu00ed iru00eda la lu00f3gica para reprogramar una cita
  }
}
