import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tramites-recientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tramites-recientes.component.html',
  styleUrl: './tramites-recientes.component.css'
})
export class TramitesRecientesComponent implements OnInit {
  tramitesRecientes: any[] = [];

  ngOnInit(): void {
    // Aquí se cargarían los datos reales desde un servicio
    this.tramitesRecientes = [
      { tipo: 'Constitución de Empresa', cliente: 'Juan Pérez', fecha: '15/05/2023', estado: 'Pendiente' },
      { tipo: 'Testamento', cliente: 'María González', fecha: '18/05/2023', estado: 'En proceso' },
      { tipo: 'Poder Notarial', cliente: 'Carlos Rodríguez', fecha: '20/05/2023', estado: 'Completado' },
      { tipo: 'Escritura Pública', cliente: 'Ana Martínez', fecha: '22/05/2023', estado: 'Pendiente' },
      { tipo: 'Contrato de Arrendamiento', cliente: 'Luis Sánchez', fecha: '25/05/2023', estado: 'En proceso' },
      { tipo: 'Constitución de Empresa', cliente: 'Juan Pérez', fecha: '15/05/2023', estado: 'Pendiente' },
      { tipo: 'Testamento', cliente: 'María González', fecha: '18/05/2023', estado: 'En proceso' },
      { tipo: 'Poder Notarial', cliente: 'Carlos Rodríguez', fecha: '20/05/2023', estado: 'Completado' }, 
      { tipo: 'Escritura Pública', cliente: 'Ana Martínez', fecha: '22/05/2023', estado: 'Pendiente' },
    ];
  }

  getIconClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'fa-clock';
      case 'en proceso':
        return 'fa-spinner';
      case 'completado':
        return 'fa-check-circle';
      default:
        return 'fa-file-alt';
    }
  }
}