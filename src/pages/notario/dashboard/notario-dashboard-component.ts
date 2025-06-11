import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service';
import { NotarioDashboardService } from '../../../app/services/notario/notario-dashboard.service';

export interface Documento {
  documento_id: number;
  titulo: string;
  cliente: string;
  fecha_inicio: string;
  telefono?:string;
  tipo: string;
  estado: 'pendiente' | 'finalizado';
  cita_programada?: boolean;
}

export interface Cita {
  id: number;
  documento_id: number;
  cliente: string;
  tipo_documento: string;
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

  userData: any = null;

  activeTab: string = 'documentos';

  documentosPendientes: Documento[] = [
    {
      documento_id: 1,
      titulo: 'Minuta EIRL',
      cliente: 'María González',
      fecha_inicio: '15/05/2025',
      tipo: 'escritura',
      estado: 'pendiente'
    },
    {
      documento_id: 2,
      titulo: 'Minuta SAC',
      cliente: 'Juan Pérez',
      fecha_inicio: '14/05/2025',
      tipo: 'poder',
      estado: 'pendiente'
    },
    {
      documento_id: 3,
      titulo: 'Minuta EIRL',
      cliente: 'Carlos Rodríguez',
      fecha_inicio: '12/05/2025',
      tipo: 'testamento',
      estado: 'pendiente',
      cita_programada: true
    },
    {
      documento_id: 4,
      titulo: 'Acta Constitutiva',
      cliente: 'Empresas XYZ',
      fecha_inicio: '10/05/2025',
      tipo: 'acta',
      estado: 'pendiente'
    },
    {
      documento_id: 5,
      titulo: 'Contrato de Arrendamiento',
      cliente: 'Ana Martínez',
      fecha_inicio: '08/05/2025',
      tipo: 'contrato',
      estado: 'pendiente'
    }
  ];

  // Datos de ejemplo para las citas
  citas: Cita[] = [
    {
      id: 1,
      documento_id: 3,
      cliente: 'Carlos Rodríguez',
      tipo_documento: 'Testamento',
      fecha: '19 de mayo de 2025',
      hora: '10:30',
      direccion: 'Av. Principal 123, Oficina 405'
    }
  ];

  mostrarModalCita: boolean = false;
  citaSeleccionada: Cita | null = null;

  cargando: boolean = false;
  error: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private notarioDashboardService: NotarioDashboardService,
  ) {}

  ngOnInit(): void {
    // Inicialización del componente
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;

      this.cargarDatosDashboard();
    });
  }

  cargarDatosDashboard(): void {
    this.cargando = true;
    this.error = '';
    
    // Obtener el ID del usuario desde el servicio de autenticación
   
    this.notarioDashboardService.getDashboardData()
      .subscribe({
        next: (response) => {
          console.log('Datos recibidos del dashboard:', response);
          // Actualizar datos del trámite
          this.citas = response.citas;
          this.documentosPendientes = response.documentos;

          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
          this.error = 'No se pudieron cargar los datos. Por favor, intenta nuevamente.';
          this.cargando = false;
        }
      });
  }
  
  revisarDocumento(id: number): void {
    this.router.navigate(['/notario/documento', id]);
  }

  registrarCita(id: number): void {
    // Buscar el documento por id
    const documento = this.documentosPendientes.find(doc => doc.documento_id === id);
    
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
      documento.cita_programada = true;
    }
  }

  verDetalleCita(id: number): void {
    // Buscar la cita asociada al documento
    const cita = this.citas.find(c => c.documento_id === id);
    
    if (cita) {
      this.citaSeleccionada = cita;
      this.mostrarModalCita = true;
    } else {
      // En caso de que no se encuentre la cita (esto no debería ocurrir en un escenario real)
      console.error(`No se encontró cita para el documento ${id}`);
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

  // Método para obtener el número de documentos con cita programada
  getDocumentosProgramados(): number {
    return this.documentosPendientes.filter(d => d.cita_programada).length;
  }
}
