import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormEirlComponent } from './form-EIRL/form.eirl.component';
import { FormSacComponent } from './form-SAC/form.sac.component'; // Agregar esta importación

// Enum para tipos de empresa
export enum TipoEmpresa {
  EIRL = 'EIRL',
  SAC = 'SAC'
}

@Component({
  selector: 'app-form-minuta',
  standalone: true,
  imports: [CommonModule, FormsModule, FormEirlComponent, FormSacComponent], // Agregar FormSacComponent
  templateUrl: './form-minuta.component.html',
  styleUrls: ['./form-minuta.component.css']
})
export class FormMinutaComponent implements OnInit, OnChanges {
  @Input() userData: any;
  @Input() nombreEmpresa: string = '';
  @Input() estadoReserva: string = '';
  @Input() tipoEmpresa: string = '';
  
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
    console.log('ngOnInit - estadoReserva:', this.estadoReserva);
    console.log('ngOnInit - nombreEmpresa:', this.nombreEmpresa);
    this.verificarEstadoReserva();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges ejecutado:', changes);
    
    if (changes['estadoReserva'] || changes['nombreEmpresa'] || changes['tipoEmpresa']) {
      console.log('ngOnChanges - estadoReserva:', this.estadoReserva);
      console.log('ngOnChanges - nombreEmpresa:', this.nombreEmpresa);
      console.log('ngOnChanges - tipoEmpresa:', this.tipoEmpresa);
      this.verificarEstadoReserva();
    }
  }
  
  private verificarEstadoReserva(): void {
    console.log('Verificando estado reserva:', this.estadoReserva);
    console.log('Nombre empresa:', this.nombreEmpresa);
    console.log('Tipo empresa:', this.tipoEmpresa);
    
    this.cargandoEstado = true;
    
    setTimeout(() => {
      if (this.estadoReserva === 'aprobado' && this.nombreEmpresa && this.nombreEmpresa.trim() !== '') {
        this.mostrarFormulario = true;
        // Establecer el tipo de empresa automáticamente
        if (this.tipoEmpresa === 'SAC') {
          this.tipoEmpresaSeleccionado = TipoEmpresa.SAC;
        } else if (this.tipoEmpresa === 'EIRL') {
          this.tipoEmpresaSeleccionado = TipoEmpresa.EIRL;
        } else {
          // Valor por defecto si no viene especificado
          this.tipoEmpresaSeleccionado = TipoEmpresa.EIRL;
        }
      } else {
        this.mostrarFormulario = false;
      }
      this.cargandoEstado = false;
      
      console.log('Mostrar formulario:', this.mostrarFormulario);
      console.log('Tipo empresa seleccionado:', this.tipoEmpresaSeleccionado);
      console.log('Cargando estado:', this.cargandoEstado);
    }, 500);
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
