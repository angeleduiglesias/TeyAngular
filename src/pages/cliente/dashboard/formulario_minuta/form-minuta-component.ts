import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Socio {
  nombre: string;
  participacion: number;
}

interface DatosFormulario {
  nombreEmpresa: string;
  tipoSociedad: string;
  socios: Socio[];
  objetoSocial: string;
}

interface MetodoPago {
  id: number;
  nombre: string;
  imagen: string;
}

@Component({
  selector: 'app-form-minuta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-minuta.component.html',
  styleUrls: ['./form-minuta.component.css']
})
export class FormMinutaComponent implements OnInit {
  @Input() userData: any;
  @Input() nombreEmpresa: string = '';
  
  // Eventos para comunicación con el componente padre
  @Output() estadoTramiteChange = new EventEmitter<string>();
  @Output() porcentajeProgresoChange = new EventEmitter<number>();
  @Output() estadoPagoChange = new EventEmitter<string>();
  @Output() pagoActualChange = new EventEmitter<number>();
  
  // Datos del formulario de minuta
  pasos: string[] = ['Información Básica', 'Socios', 'Objeto Social'];
  pasoActual: number = 0;
  datosFormulario: DatosFormulario = {
    nombreEmpresa: '',
    tipoSociedad: 'sas',
    socios: [{ nombre: '', participacion: 0 }],
    objetoSocial: ''
  };
  mostrandoResumen: boolean = false;
  formularioEnviado: boolean = false;
  
  // Datos de pago
  metodosPago: MetodoPago[] = [
    { id: 1, nombre: 'Tarjeta de Crédito', imagen: 'assets/credit-card.png' },
    { id: 2, nombre: 'PayPal', imagen: 'assets/paypal.png' },
    { id: 3, nombre: 'Transferencia Bancaria', imagen: 'assets/bank-transfer.png' }
  ];
  metodoPagoSeleccionado: number | null = null;
  pagoConfirmado: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Inicializar el nombre de la empresa en el formulario cuando esté disponible
    if (this.nombreEmpresa) {
      this.datosFormulario.nombreEmpresa = this.nombreEmpresa;
    }
  }
  
  ngOnChanges(): void {
    // Actualizar el nombre de la empresa en el formulario cuando cambie
    if (this.nombreEmpresa) {
      this.datosFormulario.nombreEmpresa = this.nombreEmpresa;
    }
  }
  
  // Métodos para el formulario multi-step
  pasoSiguiente(): void {
    if (this.pasoActual < this.pasos.length - 1) {
      this.pasoActual++;
    }
  }
  
  pasoAnterior(): void {
    if (this.pasoActual > 0) {
      this.pasoActual--;
    }
  }
  
  agregarSocio(): void {
    this.datosFormulario.socios.push({
      nombre: '',
      participacion: 0
    });
  }
  
  eliminarSocio(index: number): void {
    if (index > 0 && this.datosFormulario.socios.length > 1) {
      this.datosFormulario.socios.splice(index, 1);
    }
  }
  
  mostrarResumen(): void {
    // Validar que todos los campos estén completos
    let formularioValido = true;
    
    // Validar nombre de empresa
    if (!this.datosFormulario.nombreEmpresa) {
      formularioValido = false;
    }
    
    // Validar socios
    for (const socio of this.datosFormulario.socios) {
      if (!socio.nombre || socio.participacion <= 0) {
        formularioValido = false;
        break;
      }
    }
    
    // Validar objeto social
    if (!this.datosFormulario.objetoSocial) {
      formularioValido = false;
    }
    
    if (formularioValido) {
      this.mostrandoResumen = true;
    } else {
      // Aquí se podría mostrar un mensaje de error
      console.error('Por favor complete todos los campos del formulario');
    }
  }
  
  getTipoSociedadTexto(tipo: string): string {
    const tiposSociedad: {[key: string]: string} = {
      'sas': 'Sociedad por Acciones Simplificada (SAS)',
      'ltda': 'Sociedad de Responsabilidad Limitada (Ltda)',
      'sa': 'Sociedad Anónima (SA)'
    };
    
    return tiposSociedad[tipo] || tipo;
  }
  
  editarFormulario(): void {
    this.mostrandoResumen = false;
  }
  
  enviarFormulario(): void {
    this.formularioEnviado = true;
    this.mostrandoResumen = false;
    
    // Actualizar estado del trámite
    this.estadoTramiteChange.emit('En proceso');
    this.porcentajeProgresoChange.emit(50);
  }
  
  seleccionarMetodoPago(id: number): void {
    this.metodoPagoSeleccionado = id;
  }
  
  confirmarPago(): void {
    if (this.metodoPagoSeleccionado) {
      // Simular procesamiento de pago
      setTimeout(() => {
        this.pagoConfirmado = true;
        
        // Actualizar estado del pago
        this.estadoPagoChange.emit('Completado');
        this.pagoActualChange.emit(2); // Asumiendo que es el pago 2 de 2
        
        // Actualizar estado del trámite
        this.estadoTramiteChange.emit('Finalizado');
        this.porcentajeProgresoChange.emit(100);
      }, 2000);
    }
  }
}