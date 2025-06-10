import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  cliente: string;
  direccion: string;
  tipoDocumento: string;
}

@Component({
  selector: 'app-notario-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notario-citas-component.html',
  styleUrls: ['./notario-citas-component.css']
})
export class NotarioCitasComponent implements OnInit {
  citas: Cita[] = [
    {
      id: 1,
      fecha: '19 de mayo de 2025',
      hora: '10:30',
      cliente: 'Carlos Rodríguez',
      direccion: 'Av. Principal 123, Oficina 405',
      tipoDocumento: 'Testamento'
    },
    {
      id: 2,
      fecha: '21 de mayo de 2025',
      hora: '14:00',
      cliente: 'María González',
      direccion: 'Calle Secundaria 456, Piso 2',
      tipoDocumento: 'Escritura de Compraventa',


    },
    {
      id: 3,
      fecha: '22 de mayo de 2025',
      hora: '11:15',
      cliente: 'Juan Pérez',
      direccion: 'Plaza Central 789, Local 12',
      tipoDocumento: 'Poder Notarial',
    },
    {
      id: 4,
      fecha: '25 de mayo de 2025',
      hora: '09:00',
      cliente: 'Ana López',
      direccion: 'Av. Principal 123, Oficina 405',
      tipoDocumento: 'Escritura de Propiedad',
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  volverAlPanel(): void {
    this.router.navigate(['/notario/dashboard']);
  }

  cancelarCita(id: number): void {
    console.log(`Cancelando cita ${id}`);
    // Aquí iría la lógica para cancelar la cita
    this.citas = this.citas.filter(cita => cita.id !== id);
  }
}
