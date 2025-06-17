import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteDocumentosService } from '../../../app/services/cliente/cliente-documentos.service';
import { FormatTextPipe } from '../../../app/format-text.pipe';

export interface Documento {
  documento_id: number;
  enlace_documento: string;
  nombre_documento: string;
  tipo_documento: string;
  fecha_carga: Date;
}

@Component({
  selector: 'app-cliente-documentos',
  standalone: true,
  imports: [CommonModule, FormatTextPipe],
  templateUrl: './cliente-documentos.component.html',
  styleUrl: './cliente-documentos.component.css'
})
export class ClienteDocumentosComponent implements OnInit {
  documentos: Documento[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private clienteDocumentosService: ClienteDocumentosService) {}

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  /**
   * Carga la lista de documentos desde el servicio
   */
  cargarDocumentos(): void {
    this.loading = true;
    this.error = '';
    
    this.clienteDocumentosService.obtenerDocumentos().subscribe({
      next: (documentos) => {
        this.documentos = documentos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.error = 'Error al cargar los documentos. Por favor, intente nuevamente.';
        this.loading = false;
        
        // Mantener datos de ejemplo en caso de error para demostración
        this.documentos = [
          {
            documento_id: 1,
            nombre_documento: 'Constitución de empresa',
            tipo_documento: 'PDF',
            fecha_carga: new Date(),
            enlace_documento: 'URL_ADDRESS.example.com/constitucion.pdf'
          },
          {
            documento_id: 2,
            nombre_documento: 'Contrato de arrendamiento',
            tipo_documento: 'PDF',
            fecha_carga: new Date(),
            enlace_documento: 'URL_ADDRESS.example.com/contrato.pdf'
          },
        ];
      }
    });
  }

  /**
   * Descarga un documento específico
   * @param id ID del documento a descargar
   */
  downloadDocument(id: number): void {
    console.log(`Descargando documento con ID: ${id}`);
    
    this.clienteDocumentosService.descargarDocumento(id).subscribe({
      next: (blob) => {
        // Crear URL temporal para el blob
        const url = window.URL.createObjectURL(blob);
        
        // Crear elemento de enlace temporal para descargar
        const link = document.createElement('a');
        link.href = url;
        
        // Buscar el nombre del documento
        const documento = this.documentos.find(doc => doc.documento_id === id);
        const nombreArchivo = documento ? documento.nombre_documento + '.pdf' : `documento_${id}.pdf`;
        
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar documento:', error);
        alert('Error al descargar el documento. Por favor, intente nuevamente.');
      }
    });
  }

  /**
   * Visualiza un documento en una nueva ventana
   * @param id ID del documento a visualizar
   */
  viewDocument(id: number): void {
    console.log(`Visualizando documento con ID: ${id}`);
    
    this.clienteDocumentosService.obtenerUrlVisualizacion(id).subscribe({
      next: (response) => {
        // Abrir el documento en una nueva ventana
        window.open(response.url, '_blank');
      },
      error: (error) => {
        console.error('Error al visualizar documento:', error);
        
        // Fallback: usar el enlace directo si está disponible
        const documento = this.documentos.find(doc => doc.documento_id === id);
        if (documento && documento.enlace_documento) {
          window.open(documento.enlace_documento, '_blank');
        } else {
          alert('Error al visualizar el documento. Por favor, intente nuevamente.');
        }
      }
    });
  }

  /**
   * Reintenta cargar los documentos
   */
  reintentarCarga(): void {
    this.cargarDocumentos();
  }
}
