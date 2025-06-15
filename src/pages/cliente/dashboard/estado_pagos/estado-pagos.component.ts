import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estado-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-pagos.component.html',
  styleUrls: ['./estado-pagos.component.css']
})
export class EstadoPagosComponent implements OnInit, OnChanges {
  @Input() pago1: boolean = false;
  @Input() pago2: boolean = false;
  @Input() fechaPago1 : Date = new Date();
  @Input() fechaPago2 : Date = new Date();


  pagos: any[] = [];

  ngOnInit(): void {
    console.log('EstadoPagosComponent - Valores recibidos:');
    console.log('pago1:', this.pago1);
    console.log('pago2:', this.pago2);
    this.actualizarPagos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Este método se ejecuta cada vez que cambian los inputs
    if (changes['pago1'] || changes['pago2'] || changes['fechaPago1'] || changes['fechaPago2']) {
      console.log('EstadoPagosComponent - Cambios detectados:');
      console.log('pago1:', this.pago1);
      console.log('pago2:', this.pago2);
      this.actualizarPagos();
    }
  }

  private actualizarPagos(): void {
    this.pagos = [
      {
        numero: 1,
        nombre:'Reserva de Nombre',
        pagado: this.pago1,
        fecha: this.fechaPago1
      },
      {
        numero: 2,
        nombre: 'LLenado Minuta',
        pagado: this.pago2,
        fecha: this.fechaPago2
      }
    ];
    
    console.log('EstadoPagosComponent - Valores asignados:');
    console.log('pagos[0].pagado:', this.pagos[0].pagado);
    console.log('pagos[1].pagado:', this.pagos[1].pagado);
  }
}
