import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  fecha: Date;
  estado: string;
}

@Component({
  selector: 'app-cliente-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-documentos.component.html',
  styleUrl: './cliente-documentos.component.css'
})
export class ClienteDocumentosComponent implements OnInit {
  documentos: Documento[] = [
    {
      id: 1,
      nombre: 'Constitución de empresa',
      tipo: 'PDF',
      fecha: new Date(),
      estado: 'Pendiente'
    },
    {
      id: 2,
      nombre: 'Contrato de arrendamiento',
      tipo: 'DOCX',
      fecha: new Date(new Date().setDate(new Date().getDate() - 5)),
      estado: 'Aprobado'
    },
    {
      id: 3,
      nombre: 'Declaración jurada',
      tipo: 'PDF',
      fecha: new Date(new Date().setDate(new Date().getDate() - 10)),
      estado: 'Rechazado'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  getStatusClass(estado: string): string {
    switch(estado.toLowerCase()) {
      case 'aprobado':
        return 'status-approved';
      case 'pendiente':
        return 'status-pending';
      case 'rechazado':
        return 'status-rejected';
      default:
        return '';
    }
  }

  downloadDocument(id: number): void {
    console.log(`Descargando documento con ID: ${id}`);
    // Aquí iría la lógica para descargar el documento
  }

  viewDocument(id: number): void {
    console.log(`Visualizando documento con ID: ${id}`);
    // Aquí iría la lógica para visualizar el documento
  }
}
