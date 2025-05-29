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

interface Cita {
  id: number;
  documentoId: number;
  cliente: string;
  tipoDocumento: string;
  fecha: string;
  hora: string;
  direccion: string;
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

  // Datos de ejemplo para las citas
  citas: Cita[] = [
    {
      id: 1,
      documentoId: 3,
      cliente: 'Carlos Rodríguez',
      tipoDocumento: 'Testamento',
      fecha: '19 de mayo de 2025',
      hora: '10:30',
      direccion: 'Av. Principal 123, Oficina 405'
    }
  ];

  mostrarModalCita: boolean = false;
  citaSeleccionada: Cita | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  revisarDocumento(id: number): void {
    this.router.navigate(['/notario/documento', id]);
  }

  registrarCita(id: number): void {
    // Buscar el documento por id
    const documento = this.documentosPendientes.find(doc => doc.id === id);
    
    if (documento) {
      // Navegar a la página de citas con los parámetros necesarios
      this.router.navigate(['/notario/citas/nueva'], { 
        queryParams: { 
          documentoId: id,
          cliente: documento.cliente,
          tipoDocumento: documento.titulo
        } 
      });
      
      // Marcar el documento como con cita programada (en un escenario real, esto se haría después de confirmar la creación)
      documento.citaProgramada = true;
    }
  }

  verDetalleCita(documentoId: number): void {
    // Buscar la cita asociada al documento
    const cita = this.citas.find(c => c.documentoId === documentoId);
    
    if (cita) {
      this.citaSeleccionada = cita;
      this.mostrarModalCita = true;
    } else {
      // En caso de que no se encuentre la cita (esto no debería ocurrir en un escenario real)
      console.error(`No se encontró cita para el documento ${documentoId}`);
    }
  }

  cerrarModalCita(): void {
    this.mostrarModalCita = false;
    this.citaSeleccionada = null;
  }

  irACitas(): void {
    this.cerrarModalCita();
    this.router.navigate(['/notario/citas']);
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
