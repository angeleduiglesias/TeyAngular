import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotarioDocumentosService } from '../../../app/services/notario/notario-documentos.service';

interface Documento {
  documento_id: number;
  enlace_documento: string;
  nombre_documento: string;
  nombre_cliente: string;
  fecha_envio: string;
  tipo_empresa: string;
  estado: 'pendiente' | 'aprobado';
}

@Component({
  selector: 'app-notario-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notario-documentos-component.html',
  styleUrl: './notario-documentos-component.css'
})
export class NotarioDocumentosComponent implements OnInit {
  // Datos originales
  documentosOriginales: Documento[] = [];
  // Datos filtrados
  documentosFiltrados: Documento[] = [];
  // Datos que se muestran en la página actual
  documentos: Documento[] = [];

  // Variables para filtros y búsqueda
  terminoBusqueda: string = '';
  filtroTipoEmpresa: string = '';
  filtroEstado: string = '';

  // Variables para paginación
  paginaActual: number = 1;
  documentosPorPagina: number = 15;
  totalPaginas: number = 0;
  paginasVisibles: number[] = [];

  // Variable para controlar el estado de carga
  cargando: boolean = false;
  error: string = '';
  
  // Variables para toast notifications
  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = '';

  constructor(private notarioDocumentosService: NotarioDocumentosService
    , private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  /**
   * Carga los documentos desde el servicio
   */
  cargarDocumentos(): void {
    this.cargando = true;
    this.error = '';
    
    this.notarioDocumentosService.getDocumentos().subscribe({
      next: (documentos) => {
        this.documentosOriginales = documentos;
        this.documentosFiltrados = [...this.documentosOriginales];
        this.calcularPaginacion();
        this.actualizarDocumentosPagina();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.error = 'Error al cargar los documentos. Por favor, intente nuevamente.';
        this.cargando = false;
        
        // Mantener datos de ejemplo en caso de error para desarrollo
        this.documentosOriginales = [
          {
            documento_id: 1,
            nombre_documento: 'Identificación oficial',
            enlace_documento: 'URL_ADDRESS.com/documento1.pdf',
            nombre_cliente: 'Juan Perez',
            fecha_envio: '15/05/2023',
            tipo_empresa: 'SAC',
            estado: 'pendiente'
          },
          {
            documento_id: 2,
            nombre_documento: 'Comprobante de domicilio',
            enlace_documento: 'URL_ADDRESS.com/documento2.pdf',
            nombre_cliente: 'María González',
            fecha_envio: '18/05/2023',
            tipo_empresa: 'EIRL',
            estado: 'pendiente'
          },
          {
            documento_id: 3,
            nombre_documento: 'Escritura de propiedad',
            enlace_documento: 'URL_ADDRESS.com/documento3.pdf',
            nombre_cliente: 'Carlos Rodríguez',
            fecha_envio: '10/05/2023',
            tipo_empresa: 'SAC',
            estado: 'aprobado'
          },
          {
            documento_id: 4,
            nombre_documento: 'Poder notarial',
            enlace_documento: 'URL_ADDRESS.com/documento4.pdf',
            nombre_cliente: 'Ana López',
            fecha_envio: '05/05/2023',
            tipo_empresa: 'EIRL',
            estado: 'pendiente'
          }
        ];
        this.documentosFiltrados = [...this.documentosOriginales];
        this.calcularPaginacion();
        this.actualizarDocumentosPagina();
      }
    });
  }

  // Método para buscar
  buscarDocumentos(): void {
    this.aplicarFiltros();
  }

  // Método para aplicar filtros
  aplicarFiltros(): void {
    let documentosFiltrados = [...this.documentosOriginales];

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      documentosFiltrados = documentosFiltrados.filter(doc => 
        doc.nombre_documento.toLowerCase().includes(termino) ||
        doc.nombre_cliente.toLowerCase().includes(termino)
      );
    }

    // Filtrar por tipo de empresa
    if (this.filtroTipoEmpresa) {
      documentosFiltrados = documentosFiltrados.filter(doc => 
        doc.tipo_empresa === this.filtroTipoEmpresa
      );
    }

    // Filtrar por estado
    if (this.filtroEstado) {
      documentosFiltrados = documentosFiltrados.filter(doc => 
        doc.estado === this.filtroEstado
      );
    }

    this.documentosFiltrados = documentosFiltrados;
    this.paginaActual = 1; // Resetear a la primera página
    this.calcularPaginacion();
    this.actualizarDocumentosPagina();
  }

  // Método para limpiar filtros
  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroTipoEmpresa = '';
    this.filtroEstado = '';
    this.documentosFiltrados = [...this.documentosOriginales];
    this.paginaActual = 1;
    this.calcularPaginacion();
    this.actualizarDocumentosPagina();
  }

  // Calcular información de paginación
  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.documentosFiltrados.length / this.documentosPorPagina);
    this.generarPaginasVisibles();
  }

  // Generar array de páginas visibles
  generarPaginasVisibles(): void {
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginasVisibles - 1);
    
    // Ajustar inicio si estamos cerca del final
    if (fin - inicio + 1 < maxPaginasVisibles) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    this.paginasVisibles = [];
    for (let i = inicio; i <= fin; i++) {
      this.paginasVisibles.push(i);
    }
  }

  // Actualizar documentos de la página actual
  actualizarDocumentosPagina(): void {
    const inicio = (this.paginaActual - 1) * this.documentosPorPagina;
    const fin = inicio + this.documentosPorPagina;
    this.documentos = this.documentosFiltrados.slice(inicio, fin);
  }

  // Ir a página específica
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.generarPaginasVisibles();
      this.actualizarDocumentosPagina();
    }
  }

  // Ir a página anterior
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.irAPagina(this.paginaActual - 1);
    }
  }

  // Ir a página siguiente
  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.irAPagina(this.paginaActual + 1);
    }
  }

  // Obtener información de rango de documentos
  obtenerRangoDocumentos(): string {
    if (this.documentosFiltrados.length === 0) {
      return '0 documentos';
    }
    
    const inicio = (this.paginaActual - 1) * this.documentosPorPagina + 1;
    const fin = Math.min(this.paginaActual * this.documentosPorPagina, this.documentosFiltrados.length);
    
    return `${inicio}-${fin} de ${this.documentosFiltrados.length} documentos`;
  }

  verDocumento(id: number): void {
    console.log(`Ver documento ${id}`);
    
    // Usar el servicio para obtener el documento desde el backend
    this.notarioDocumentosService.mostrarDocumento(id).subscribe({
      next: (documento) => {
        if (documento && documento.enlace_documento) {
          // Abrir el documento en una nueva pestaña
          window.open(documento.enlace_documento, '_blank', 'noopener,noreferrer');
          this.showToastMessage('Documento abierto correctamente', 'fa-check-circle');
        } else {
          // Mostrar mensaje de error si no hay enlace
          console.error('Enlace del documento no disponible');
          this.showToastMessage('Error: El enlace del documento no está disponible', 'fa-times-circle');
        }
      },
      error: (error) => {
        console.error('Error al obtener documento:', error);
        this.showToastMessage('Error: No se pudo cargar el documento desde el servidor', 'fa-times-circle');
      }
    });
  }

  validarDocumento(id: number): void {
    console.log(`Ir a validar documento ${id}`);
    
    // Navegar a la página de revisión de documento
    this.router.navigate(['/notario/documento', id]);
  }

  descargarDocumento(id: number): void {
    console.log(`Descargar documento ${id}`);
    
    // Usar el servicio para descargar el documento desde el backend
    this.notarioDocumentosService.descargarDocumento(id).subscribe({
      next: (blob: Blob) => {
        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);
        
        // Crear enlace temporal para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento_${id}.pdf`; // Nombre por defecto
        link.target = '_blank';
        
        // Agregar al DOM, hacer clic y remover
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar la URL del blob
        window.URL.revokeObjectURL(url);
        
        console.log(`Documento ${id} descargado exitosamente`);
        this.showToastMessage('Documento descargado exitosamente', 'fa-download');
      },
      error: (error) => {
        console.error('Error al descargar documento:', error);
        this.showToastMessage('Error: No se pudo descargar el documento desde el servidor', 'fa-times-circle');
      }
    });
  }

  showToastMessage(message: string, icon: string): void {
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
