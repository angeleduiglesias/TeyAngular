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
  
  // Variables para la subida de archivos
  subiendoArchivo: boolean = false;
  archivoSeleccionado: File | null = null;
  mensajeExito: string = '';
  mensajeError: string = '';

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
    if (!this.documentoId) {
      this.mostrarError('No hay ID de documento disponible');
      return;
    }
  
    this.notarioDocumentosService.descargarDocumento(this.documentoId)
      .subscribe({
        next: (blob) => {
          // Crear URL del blob
          const url = window.URL.createObjectURL(blob);
          
          // Crear enlace temporal para descargar
          const link = document.createElement('a');
          link.href = url;
          link.download = this.documento?.nombre_documento || 'documento.pdf';
          link.target = '_blank';
          
          // Ejecutar descarga
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Limpiar URL del blob
          window.URL.revokeObjectURL(url);
          
          // Mostrar mensaje de éxito
          this.mostrarExito('Documento descargado exitosamente');
        },
        error: (error) => {
          console.error('Error al descargar documento:', error);
          this.mostrarError('Error al descargar el documento. Intente nuevamente.');
        }
      });
  }



  
  subirDocumento(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!tiposPermitidos.includes(file.type)) {
        this.mostrarError('Solo se permiten archivos PDF, DOC o DOCX');
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      const tamañoMaximo = 10 * 1024 * 1024; // 10MB en bytes
      if (file.size > tamañoMaximo) {
        this.mostrarError('El archivo no puede ser mayor a 10MB');
        return;
      }
      
      // Solo guardar el archivo seleccionado, NO subirlo aún
      this.archivoSeleccionado = file;
      this.limpiarMensajes();
      this.mostrarExito(`Archivo seleccionado: ${file.name}`);
      
      console.log('Archivo seleccionado:', file.name);
    } else {
      this.mostrarError('Por favor seleccione un archivo válido');
    }
  }
  
  /**
   * Finaliza el trámite subiendo el documento y marcándolo como completado
   */
  finalizarTramiteConDocumento(): void {
    if (!this.documentoId || !this.archivoSeleccionado) {
      this.mostrarError('Debe seleccionar un archivo antes de finalizar');
      return;
    }
    
    this.subiendoArchivo = true;
    this.limpiarMensajes();
    
    console.log('Finalizando trámite con documento:', this.archivoSeleccionado.name);
    
    // Solo subir el documento firmado (que ya finaliza automáticamente)
    this.notarioDocumentosService.subirDocumentoFirmado(this.documentoId, this.archivoSeleccionado)
      .subscribe({
        next: (response) => {
          console.log('Documento subido exitosamente:', response);
          this.mostrarExito('Trámite finalizado exitosamente');
          this.subiendoArchivo = false;
          
          // Actualizar el estado del documento localmente
          if (this.documento) {
            this.documento.estado = 'aprobado';
          }
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/notario/documentos']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al subir documento:', error);
          this.mostrarError('Error al subir el documento. Intente nuevamente.');
          this.subiendoArchivo = false;
        }
      });
  }
  
  /**
   * Muestra mensaje de éxito
   */
  private mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mensajeError = '';
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      this.mensajeExito = '';
    }, 5000);
  }
  
  /**
   * Muestra mensaje de error
   */
  private mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mensajeExito = '';
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      this.mensajeError = '';
    }, 5000);
  }
  
  /**
   * Limpia todos los mensajes
   */
  private limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }
  
  /**
   * Limpia el archivo seleccionado
   */
  limpiarArchivo(): void {
    this.archivoSeleccionado = null;
    const fileInput = document.getElementById('documentoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

// Agregar estas propiedades
isDragOver: boolean = false;

// Agregar estos métodos
onDragOver(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = false;
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = false;
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    this.procesarArchivo(file);
  }
}

private procesarArchivo(file: File): void {
  // Reutilizar la lógica de validación del método subirDocumento
  const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!tiposPermitidos.includes(file.type)) {
    this.mostrarError('Solo se permiten archivos PDF, DOC o DOCX');
    return;
  }
  
  const tamañoMaximo = 10 * 1024 * 1024;
  if (file.size > tamañoMaximo) {
    this.mostrarError('El archivo no puede ser mayor a 10MB');
    return;
  }
  
  this.archivoSeleccionado = file;
  this.subirArchivoAlServidor(file);
}

private subirArchivoAlServidor(file: File): void {
  if (!this.documentoId) return;
  
  this.subiendoArchivo = true;
  this.limpiarMensajes();
  
  this.notarioDocumentosService.subirDocumentoFirmado(this.documentoId, file)
    .subscribe({
      next: (response) => {
        this.mostrarExito('Documento firmado subido exitosamente');
      },
      error: (error) => {
        this.mostrarError('Error al subir el documento. Intente nuevamente.');
        this.subiendoArchivo = false;
      }
    });
}
/**
 * Abre el selector de archivos
 */
abrirSelectorArchivos(): void {
  const fileInput = document.getElementById('documentoInput') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}
}
