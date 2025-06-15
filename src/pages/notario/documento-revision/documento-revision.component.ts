import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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

//cuando yo cargo el doc firmado del notario, cuadno se da en subir te mando un post 
//para tramite estado finalizado 

@Component({
  selector: 'app-documento-revision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documento-revision.component.html',
  styleUrl: './documento-revision.component.css'
})
export class DocumentoRevisionComponent implements OnInit {
  documentoId: number | null = null;
  documento: Documento | null = null;
  cargando: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private notarioDocumentosService: NotarioDocumentosService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del documento de los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.documentoId = parseInt(id, 10);
        this.cargarDocumento();
      }
    });
  }

  cargarDocumento(): void {
    if (!this.documentoId) return;
    
    this.cargando = true;
    this.error = '';
    
    // Opción 1: Obtener documento específico (si tienes este endpoint)
    this.notarioDocumentosService.getDocumentoPorId(this.documentoId).subscribe({
      next: (documento) => {
        this.documento = documento;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar documento:', error);
        this.error = 'Error al cargar el documento';
        this.cargando = false;
        
        // Fallback: buscar en la lista completa
        this.cargarDocumentoDesdeListaCompleta();
      }
    });
  }

  cargarDocumentoDesdeListaCompleta(): void {
    // Opción 2: Obtener todos los documentos y filtrar
    this.notarioDocumentosService.getDocumentos().subscribe({
      next: (documentos) => {
        const documentoEncontrado = documentos.find(doc => doc.documento_id === this.documentoId);
        if (documentoEncontrado) {
          this.documento = documentoEncontrado;
        } else {
          this.router.navigate(['/notario/documentos']);
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.error = 'Error al cargar los datos';
        this.cargando = false;
      }
    });
  }

  volverAlPanel(): void {
    this.router.navigate(['/notario/dashboard']);
  }

  descargarDocumento(): void {
    if (this.documento && this.documento.enlace_documento) {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = this.documento.enlace_documento;
      link.download = this.documento.nombre_documento || 'documento.pdf';
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  subirDocumento(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Subiendo documento firmado:', file.name);
      // Implementar lógica para subir el documento firmado
      // this.notarioDocumentosService.subirDocumentoFirmado(this.documentoId, file)
    }
  }

}
