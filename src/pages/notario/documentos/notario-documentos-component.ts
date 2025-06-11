import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Documento {
  documento_id: number;
  nombre_documento: string;
  nombre_cliente: string;
  fecha_envio: string;
  tipo_empresa: string;
  estado: 'pendiente' | 'aprobado' ;
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
      documento_id: 1,
      nombre_documento: 'Identificaciu00f3n oficial',
      nombre_cliente: 'Juan Pu00e9rez',
      fecha_envio: '15/05/2023',
      tipo_empresa: 'INE',
      estado: 'pendiente'
    },
    {
      documento_id: 2,
      nombre_documento: 'Comprobante de domicilio',
      nombre_cliente: 'Maru00eda Gonzu00e1lez',
      fecha_envio: '18/05/2023',
      tipo_empresa: 'Recibo CFE',
      estado: 'pendiente'
    },
    {
      documento_id: 3,
      nombre_documento: 'Escritura de propiedad',
      nombre_cliente: 'Carlos Rodru00edguez',
      fecha_envio: '10/05/2023',
      tipo_empresa: 'Escritura',
      estado: 'aprobado'
    },
    {
      documento_id: 4,
      nombre_documento: 'Poder notarial',
      nombre_cliente: 'Ana Lu00f3pez',
      fecha_envio: '05/05/2023',
      tipo_empresa: 'Poder',
      estado: 'pendiente',
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
    console.log(`Solicitar correccion para documento ${id}`);
    // Implementar lu00f3gica para solicitar correcciu00f3n
  }
}
