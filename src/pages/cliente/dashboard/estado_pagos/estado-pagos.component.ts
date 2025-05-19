import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-pagos.component.html',
  styleUrls: ['./estado-pagos.component.css']
})
export class EstadoPagosComponent implements OnInit {
  @Input() estadoPago: string = 'Pendiente';
  @Input() pagoActual: number = 0;
  @Input() pagoTotal: number = 2;

  constructor() { }

  ngOnInit(): void {
    // Inicialización del componente si es necesario
  }
}