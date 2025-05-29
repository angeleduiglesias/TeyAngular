import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface Documento {
  id: number;
  titulo: string;
  cliente: string;
  fechaSolicitud: string;
  tipo: string;
  estado: string;
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
  
  // Datos de ejemplo para simular la carga de un documento
  documentosEjemplo: Documento[] = [
    {
      id: 1,
      titulo: 'Escritura de Compraventa',
      cliente: 'Maru00eda Gonzu00e1lez',
      fechaSolicitud: '15/05/2025',
      tipo: 'escritura',
      estado: 'pendiente'
    },
    {
      id: 2,
      titulo: 'Poder Notarial',
      cliente: 'Juan Pu00e9rez',
      fechaSolicitud: '14/05/2025',
      tipo: 'poder',
      estado: 'pendiente'
    },
    {
      id: 3,
      titulo: 'Testamento',
      cliente: 'Carlos Rodru00edguez',
      fechaSolicitud: '12/05/2025',
      tipo: 'testamento',
      estado: 'pendiente'
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
      cliente: 'Ana Martu00ednez',
      fechaSolicitud: '08/05/2025',
      tipo: 'contrato',
      estado: 'pendiente'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener el ID del documento de los paru00e1metros de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.documentoId = parseInt(id, 10);
        this.cargarDocumento();
      }
    });
  }

  cargarDocumento(): void {
    // En un caso real, aquu00ed haru00edamos una llamada a un servicio para obtener los datos del documento
    if (this.documentoId) {
      const documentoEncontrado = this.documentosEjemplo.find(doc => doc.id === this.documentoId);
      if (documentoEncontrado) {
        this.documento = documentoEncontrado;
      } else {
        // Si no se encuentra el documento, redirigir al dashboard
        this.router.navigate(['/notario/dashboard']);
      }
    }
  }

  volverAlPanel(): void {
    this.router.navigate(['/notario/dashboard']);
  }

  descargarDocumento(): void {
    console.log(`Descargando documento ${this.documentoId}`);
    // Implementar lu00f3gica para descargar el documento
  }

  subirDocumento(event: any): void {
    console.log('Subiendo documento firmado');
    // Implementar lu00f3gica para subir el documento firmado
  }

  finalizarProceso(): void {
    console.log(`Finalizando proceso para documento ${this.documentoId}`);
    // Implementar lu00f3gica para finalizar el proceso
    // Luego redirigir al dashboard
    this.router.navigate(['/notario/dashboard']);
  }
}
