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
  @Input() pago1: boolean = false;
  @Input() pago2: boolean = false;

  pagos = [
    { id: 1, nombre: 'Reserva de nombre', pagado: false },
    { id: 2, nombre: 'Entrega de Minuta', pagado: false }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Asignar los valores booleanos recibidos
    this.pagos[0].pagado = this.pago1;
    this.pagos[1].pagado = this.pago2;
  }

  irAPagar(pagoId: number): void {
    this.router.navigate(['/pagos'], { queryParams: { id: pagoId } });
  }

  getNombrePagoActual(): string {
    const index = this.pagos.findIndex(p => !p.pagado);
    return index !== -1 ? this.pagos[index].nombre : '';
  }

  getNombreSiguientePago(): string {
    const index = this.pagos.findIndex(p => !p.pagado);
    return index + 1 < this.pagos.length ? this.pagos[index + 1].nombre : '';
  }
}
