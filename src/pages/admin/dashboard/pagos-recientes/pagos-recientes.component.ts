import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagos-recientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos-recientes.component.html',
  styleUrl: './pagos-recientes.component.css'
})
export class PagosRecientesComponent implements OnInit {
  pagosRecientes: any[] = [];

  ngOnInit(): void {
    // Aquí se cargarían los datos reales desde un servicio
    this.pagosRecientes = [
      { concepto: 'Constitución de Empresa', cliente: 'Juan Pérez', monto: 5000, fecha: '15/05/2023' },
      { concepto: 'Testamento', cliente: 'María González', monto: 3000, fecha: '18/05/2023' },
      { concepto: 'Poder Notarial', cliente: 'Carlos Rodríguez', monto: 2500, fecha: '20/05/2023' },
      { concepto: 'Escritura Pública', cliente: 'Ana Martínez', monto: 4200, fecha: '22/05/2023' }
    ];
  }
}