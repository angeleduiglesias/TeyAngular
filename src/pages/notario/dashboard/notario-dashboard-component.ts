import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Documento {
  id: number;
  titulo: string;
  cliente: string;
  fechaSolicitud: string;
  fechaFinalizacion?: string;
  tipo: string;
  estado: 'pendiente' | 'finalizado';
  citaProgramada?: boolean;
}

@Component({
  selector: 'app-notario-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notario-dashboard-component.html',
  styleUrls: ['./notario-dashboard-component.css']
})
export class NotarioDashboardComponent implements OnInit {
  documentosPendientes: Documento[] = [
    {
      id: 1,
      titulo: 'Escritura de Compraventa',
      cliente: 'María González',
      fechaSolicitud: '15/05/2025',
      tipo: 'escritura',
      estado: 'pendiente'
    },
    {
      id: 2,
      titulo: 'Poder Notarial',
      cliente: 'Juan Pérez',
      fechaSolicitud: '14/05/2025',
      tipo: 'poder',
      estado: 'pendiente'
    },
    {
      id: 3,
      titulo: 'Testamento',
      cliente: 'Carlos Rodríguez',
      fechaSolicitud: '12/05/2025',
      tipo: 'testamento',
      estado: 'pendiente',
      citaProgramada: true
    },
    {
      id: 4,
      titulo: 'Acta Constitutiva',
      cliente: 'Empresas XYZ',
      fechaSolicitud: '10/05/2025',
      tipo: 'acta',
      estado: 'pendiente'
    },
    {
      id: 5,
      titulo: 'Contrato de Arrendamiento',
      cliente: 'Ana Martínez',
      fechaSolicitud: '08/05/2025',
      tipo: 'contrato',
      estado: 'pendiente'
    }
  ];

  documentosFinalizados: Documento[] = [
    {
      id: 6,
      titulo: 'Escritura de Propiedad',
      cliente: 'Roberto Sánchez',
      fechaSolicitud: '01/05/2025',
      fechaFinalizacion: '20/05/2025',
      tipo: 'escritura',
      estado: 'finalizado'
    },
    {
      id: 7,
      titulo: 'Testamento Vital',
      cliente: 'Laura Martínez',
      fechaSolicitud: '28/04/2025',
      fechaFinalizacion: '18/05/2025',
      tipo: 'testamento',
      estado: 'finalizado'
    },
    {
      id: 8,
      titulo: 'Poder General',
      cliente: 'Fernando Ríos',
      fechaSolicitud: '25/04/2025',
      fechaFinalizacion: '15/05/2025',
      tipo: 'poder',
      estado: 'finalizado'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  revisarDocumento(id: number): void {
    this.router.navigate(['/notario/documento', id]);
  }

  registrarCita(id: number): void {
    console.log(`Registrando cita para documento ${id}`);
    // Implementar lógica para registrar cita
  }

  descargarDocumento(id: number): void {
    console.log(`Descargando documento ${id}`);
    // Implementar lógica para descargar el documento
  }

  verDetalles(id: number): void {
    console.log(`Ver detalles del documento ${id}`);
    // Podría redirigir a una vista de solo lectura del documento finalizado
    this.router.navigate(['/notario/documento', id]);
  }
}
