import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormEirlComponent } from './form-EIRL/form.eirl.component';
import { FormSacComponent } from './form-SAC/form.sac.component'; // Agregar esta importación

// Enum para tipos de empresa
export enum TipoEmpresa {
  EIRL = 'eirl',
  SAC = 'sac'
}

@Component({
  selector: 'app-form-minuta',
  standalone: true,
  imports: [CommonModule, FormsModule, FormEirlComponent, FormSacComponent], // Agregar FormSacComponent
  templateUrl: './form-minuta.component.html',
  styleUrls: ['./form-minuta.component.css']
})
export class FormMinutaComponent implements OnInit {
  @Input() userData: any;
  @Input() nombreEmpresa: string = '';
  @Input() estadoReserva: string = '';
  
  // Eventos para comunicación con el componente padre
  @Output() estadoTramiteChange = new EventEmitter<string>();
  @Output() porcentajeProgresoChange = new EventEmitter<number>();
  @Output() estadoPagoChange = new EventEmitter<string>();
  @Output() pagoActualChange = new EventEmitter<number>();
  
  // Tipo de empresa seleccionado
  tipoEmpresaSeleccionado: TipoEmpresa = TipoEmpresa.EIRL;
  tiposEmpresa = TipoEmpresa;
  
  // Propiedad para controlar la visibilidad del formulario
  mostrarFormulario: boolean = false;
  cargandoEstado: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.verificarEstadoReserva();
  }
  
  ngOnChanges(): void {
    this.verificarEstadoReserva();
  }
  
  // Método para verificar el estado de la reserva
  private verificarEstadoReserva(): void {
    this.cargandoEstado = true;
    
    const timeout = setTimeout(() => {
      if (!this.estadoReserva) {
        this.mostrarFormulario = true;
        this.cargandoEstado = false;
      }
    }, 5000);
    
    if (this.estadoReserva) {
      clearTimeout(timeout);
      this.mostrarFormulario = this.estadoReserva === 'completo';
      this.cargandoEstado = false;
    }
  }
  
  // Método para cambiar el tipo de empresa
  cambiarTipoEmpresa(tipo: TipoEmpresa): void {
    this.tipoEmpresaSeleccionado = tipo;
  }
  
  // Métodos para manejar eventos de los componentes hijos
  onEstadoTramiteChange(estado: string): void {
    this.estadoTramiteChange.emit(estado);
  }
  
  onPorcentajeProgresoChange(porcentaje: number): void {
    this.porcentajeProgresoChange.emit(porcentaje);
  }
  
  onEstadoPagoChange(estado: string): void {
    this.estadoPagoChange.emit(estado);
  }
  
  onPagoActualChange(pago: number): void {
    this.pagoActualChange.emit(pago);
  }
}
