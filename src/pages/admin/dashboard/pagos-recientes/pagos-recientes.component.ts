import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosReciente } from '../admin-dashboard-component';

@Component({
  selector: 'app-pagos-recientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos-recientes.component.html',
  styleUrl: './pagos-recientes.component.css'
})
export class PagosRecientesComponent implements OnInit {
  @Input()pagosRecientes:PagosReciente[] = [];

  ngOnInit(): void {
    // Aquí se cargarían los datos reales desde un servicio
    if (this.pagosRecientes.length === 0) {
      this.pagosRecientes = [
        
      ]
    }
  }
}