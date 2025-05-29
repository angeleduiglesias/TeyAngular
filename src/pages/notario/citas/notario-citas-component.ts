import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cita {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  titulo: string;
  cliente: string;
  tipo: string;
}

@Component({
  selector: 'app-notario-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notario-citas-component.html',
  styleUrl: './notario-citas-component.css'
})
export class NotarioCitasComponent implements OnInit {
  citasHoy: Cita[] = [
    {
      id: 1,
      fecha: '28/05/2023',
      horaInicio: '10:00',
      horaFin: '12:00',
      titulo: 'Firma de Escritura',
      cliente: 'Juan Pu00e9rez',
      tipo: 'escritura'
    },
    {
      id: 2,
      fecha: '28/05/2023',
      horaInicio: '14:00',
      horaFin: '15:00',
      titulo: 'Asesoru00eda Legal',
      cliente: 'Maru00eda Gonzu00e1lez',
      tipo: 'asesoria'
    },
    {
      id: 3,
      fecha: '28/05/2023',
      horaInicio: '16:00',
      horaFin: '18:00',
      titulo: 'Firma de Testamento',
      cliente: 'Carlos Rodru00edguez',
      tipo: 'testamento'
    }
  ];

  proximasCitas: Cita[] = [
    {
      id: 4,
      fecha: '30/05/2023',
      horaInicio: '10:00',
      horaFin: '11:30',
      titulo: 'Firma de Poder Notarial',
      cliente: 'Ana Lu00f3pez',
      tipo: 'poder'
    },
    {
      id: 5,
      fecha: '02/06/2023',
      horaInicio: '14:00',
      horaFin: '15:00',
      titulo: 'Asesoru00eda Legal',
      cliente: 'Roberto Su00e1nchez',
      tipo: 'asesoria'
    },
    {
      id: 6,
      fecha: '05/06/2023',
      horaInicio: '11:00',
      horaFin: '13:00',
      titulo: 'Firma de Escritura',
      cliente: 'Laura Martu00ednez',
      tipo: 'escritura'
    }
  ];

  vistaActual: 'dia' | 'semana' | 'mes' = 'dia';
  fechaActual: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    // Inicializaciu00f3n del componente
  }

  cambiarVista(vista: 'dia' | 'semana' | 'mes'): void {
    this.vistaActual = vista;
    // Implementar lu00f3gica para cambiar la vista del calendario
  }

  navegarFecha(direccion: 'anterior' | 'siguiente'): void {
    // Implementar lu00f3gica para navegar entre fechas
    if (direccion === 'anterior') {
      // Restar du00edas/semanas/meses segu00fan la vista actual
    } else {
      // Sumar du00edas/semanas/meses segu00fan la vista actual
    }
  }

  verDetallesCita(id: number): void {
    console.log(`Ver detalles de cita ${id}`);
    // Implementar lu00f3gica para mostrar detalles de la cita
  }

  reprogramarCita(id: number): void {
    console.log(`Reprogramar cita ${id}`);
    // Implementar lu00f3gica para reprogramar la cita
  }

  agendarNuevaCita(): void {
    console.log('Agendar nueva cita');
    // Implementar lu00f3gica para agendar una nueva cita
  }
}
