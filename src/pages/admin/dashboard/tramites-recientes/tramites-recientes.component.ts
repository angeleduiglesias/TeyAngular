import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TramiteReciente } from '../admin-dashboard-component';
@Component({
  selector: 'app-tramites-recientes',
  imports: [CommonModule],
  templateUrl: './tramites-recientes.component.html',
  styleUrl: './tramites-recientes.component.css'
})
export class TramitesRecientesComponent implements OnInit {
  @Input() tramitesRecientes: TramiteReciente[] = [];

  ngOnInit(): void {
    // Aquí se cargarían los datos reales desde un servicio
   if (this.tramitesRecientes.length === 0) {
     this.tramitesRecientes = [
       
       
     ]
   }
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