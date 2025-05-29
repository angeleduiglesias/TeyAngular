import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Documento {
  id: number;
  titulo: string;
  cliente: string;
  fechaCarga: string;
  tipo: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  motivoRechazo?: string;
}

@Component({
  selector: 'app-notario-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notario-documentos-component.html',
  styleUrl: './notario-documentos-component.css'
})
export class NotarioDocumentosComponent implements OnInit {
  documentos: Documento[] = [
    {
      id: 1,
      titulo: 'Identificaciu00f3n oficial',
      cliente: 'Juan Pu00e9rez',
      fechaCarga: '15/05/2023',
      tipo: 'INE',
      estado: 'pendiente'
    },
    {
      id: 2,
      titulo: 'Comprobante de domicilio',
      cliente: 'Maru00eda Gonzu00e1lez',
      fechaCarga: '18/05/2023',
      tipo: 'Recibo CFE',
      estado: 'pendiente'
    },
    {
      id: 3,
      titulo: 'Escritura de propiedad',
      cliente: 'Carlos Rodru00edguez',
      fechaCarga: '10/05/2023',
      tipo: 'Escritura',
      estado: 'aprobado'
    },
    {
      id: 4,
      titulo: 'Poder notarial',
      cliente: 'Ana Lu00f3pez',
      fechaCarga: '05/05/2023',
      tipo: 'Poder',
      estado: 'rechazado',
      motivoRechazo: 'Documento ilegible'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inicializaciu00f3n del componente
  }

  verDocumento(id: number): void {
    console.log(`Ver documento ${id}`);
    // Implementar lu00f3gica para mostrar el documento
  }

  validarDocumento(id: number): void {
    console.log(`Validar documento ${id}`);
    // Implementar lu00f3gica para validar el documento
  }

  descargarDocumento(id: number): void {
    console.log(`Descargar documento ${id}`);
    // Implementar lu00f3gica para descargar el documento
  }

  solicitarCorreccion(id: number): void {
    console.log(`Solicitar correcciu00f3n para documento ${id}`);
    // Implementar lu00f3gica para solicitar correcciu00f3n
  }
}
