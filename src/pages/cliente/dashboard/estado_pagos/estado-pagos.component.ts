import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  
  pagos = [
    { id: 1, nombre: 'Reserva de nombre', pagado: false },
    { id: 2, nombre: 'Entrega de Minuta', pagado: false }
  ];
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Actualizar el estado de los pagos según pagoActual
    for (let i = 0; i < this.pagoActual; i++) {
      if (i < this.pagos.length) {
        this.pagos[i].pagado = true;
      }
    }
  }
  
  irAPagar(pagoId: number): void {
    // Aquí puedes redirigir a la página de pago con el ID correspondiente
    this.router.navigate(['/pagos'], { queryParams: { id: pagoId } });
  }
  
  // Método para obtener el nombre del pago actual
  getNombrePagoActual(): string {
    if (this.pagoActual > 0 && this.pagoActual <= this.pagos.length) {
      return this.pagos[this.pagoActual - 1].nombre;
    }
    return '';
  }
  
  // Método para obtener el nombre del siguiente pago
  getNombreSiguientePago(): string {
    if (this.pagoActual < this.pagoTotal && this.pagoActual < this.pagos.length) {
      return this.pagos[this.pagoActual].nombre;
    }
    return '';
  }
}