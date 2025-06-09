import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TramiteReciente } from '../admin-dashboard-component';
import { FormatTextPipe } from './format-text.pipe';

@Component({
  selector: 'app-tramites-recientes',
  imports: [CommonModule, FormatTextPipe],
  templateUrl: './tramites-recientes.component.html',
  styleUrl: './tramites-recientes.component.css'
})
export class TramitesRecientesComponent implements OnInit {
  @Input() tramites_recientes: TramiteReciente[] = [];

  ngOnInit(): void {
    // Aquí se cargarían los datos reales desde un servicio
    if (this.tramites_recientes.length === 0) {
      this.tramites_recientes = [


      ]
    }
  }

  getIconClass(estado: string | null | undefined): string {
    if (!estado) {
      return 'fa-question-circle'; // o cualquier ícono por defecto
    }

    switch (estado) {
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