import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces para el formulario de 5 pasos
interface DatosPersonales {
  nombre: string;
  nacionalidad: string;
  dni: string;
  profesion: string;
  estado_civil: string;
  direccion: string;
  nombre_conyuge: string;
  dni_conyuge: string;
}

interface DatosEmpresa {
  nombre_empresa: string;
  direccion_empresa: string;
  provincia_empresa: string;
  departamento_empresa: string;
  objetivo: string;
}

interface Aporte {
  descripcion: string;
  monto: number;
}

interface CapitalAportes {
  monto_capital: number;
  aportes: Aporte[];
}

interface DatosApoderado {
  apoderado: string;
  dni_apoderado: string;
}

interface Confirmacion {
  ciudad: string;
  fecha_registro: string;
}

interface FormularioMinuta {
  paso_1_datos_personales: DatosPersonales;
  paso_2_datos_empresa: DatosEmpresa;
  paso_3_capital_y_aportes: CapitalAportes;
  paso_4_apoderado: DatosApoderado;
  paso_5_confirmacion: Confirmacion;
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
  pasos: string[] = [
    'Datos Personales', 
    'Datos de la Empresa', 
    'Capital y Aportes',
    'Apoderado',
    'Confirmación'
  ];
  pasoActual: number = 0;
  
  // Inicialización del formulario
  formularioMinuta: FormularioMinuta = {
    paso_1_datos_personales: {
      nombre: '',
      nacionalidad: '',
      dni: '',
      profesion: '',
      estado_civil: '',
      direccion: '',
      nombre_conyuge: '',
      dni_conyuge: ''
    },
    paso_2_datos_empresa: {
      nombre_empresa: '',
      direccion_empresa: '',
      provincia_empresa: '',
      departamento_empresa: '',
      objetivo: ''
    },
    paso_3_capital_y_aportes: {
      monto_capital: 0,
      aportes: [
        {
          descripcion: '',
          monto: 0
        }
      ]
    },
    paso_4_apoderado: {
      apoderado: '',
      dni_apoderado: ''
    },
    paso_5_confirmacion: {
      ciudad: '',
      fecha_registro: new Date().toISOString().split('T')[0]
    }
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
      this.formularioMinuta.paso_2_datos_empresa.nombre_empresa = this.nombreEmpresa;
    }
    
    // Si hay datos del usuario, prellenar algunos campos
    if (this.userData) {
      if (this.userData.nombre) {
        this.formularioMinuta.paso_1_datos_personales.nombre = this.userData.nombre;
      }
      if (this.userData.dni) {
        this.formularioMinuta.paso_1_datos_personales.dni = this.userData.dni;
      }
    }
  }
  
  ngOnChanges(): void {
    // Actualizar el nombre de la empresa en el formulario cuando cambie
    if (this.nombreEmpresa) {
      this.formularioMinuta.paso_2_datos_empresa.nombre_empresa = this.nombreEmpresa;
    }
  }
  
  // Métodos para el formulario multi-step
  pasoSiguiente(): void {
    if (this.validarPasoActual()) {
      if (this.pasoActual < this.pasos.length - 1) {
        this.pasoActual++;
      }
    }
  }
  
  pasoAnterior(): void {
    if (this.pasoActual > 0) {
      this.pasoActual--;
    }
  }
  
  validarPasoActual(): boolean {
    switch(this.pasoActual) {
      case 0: // Validar datos personales
        const datosPersonales = this.formularioMinuta.paso_1_datos_personales;
        if (!datosPersonales.nombre || !datosPersonales.dni || !datosPersonales.nacionalidad) {
          alert('Por favor complete los campos obligatorios: Nombre, DNI y Nacionalidad');
          return false;
        }
        return true;
        
      case 1: // Validar datos de empresa
        const datosEmpresa = this.formularioMinuta.paso_2_datos_empresa;
        if (!datosEmpresa.nombre_empresa || !datosEmpresa.objetivo) {
          alert('Por favor complete los campos obligatorios: Nombre de la empresa y Objetivo');
          return false;
        }
        return true;
        
      case 2: // Validar capital y aportes
        const capitalAportes = this.formularioMinuta.paso_3_capital_y_aportes;
        if (capitalAportes.monto_capital <= 0) {
          alert('El monto de capital debe ser mayor a 0');
          return false;
        }
        
        // Validar que haya al menos un aporte y que todos tengan descripción y monto
        if (capitalAportes.aportes.length === 0) {
          alert('Debe agregar al menos un aporte');
          return false;
        }
        
        for (const aporte of capitalAportes.aportes) {
          if (!aporte.descripcion || aporte.monto <= 0) {
            alert('Todos los aportes deben tener descripción y un monto mayor a 0');
            return false;
          }
        }
        return true;
        
      case 3: // Validar datos del apoderado
        const datosApoderado = this.formularioMinuta.paso_4_apoderado;
        if (!datosApoderado.apoderado || !datosApoderado.dni_apoderado) {
          alert('Por favor complete los datos del apoderado');
          return false;
        }
        return true;
        
      case 4: // Validar confirmación
        const confirmacion = this.formularioMinuta.paso_5_confirmacion;
        if (!confirmacion.ciudad) {
          alert('Por favor ingrese la ciudad');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  }
  
  agregarAporte(): void {
    this.formularioMinuta.paso_3_capital_y_aportes.aportes.push({
      descripcion: '',
      monto: 0
    });
  }
  
  eliminarAporte(index: number): void {
    if (index >= 0 && this.formularioMinuta.paso_3_capital_y_aportes.aportes.length > 1) {
      this.formularioMinuta.paso_3_capital_y_aportes.aportes.splice(index, 1);
    }
  }
  
  mostrarResumen(): void {
    if (this.validarPasoActual()) {
      this.mostrandoResumen = true;
    }
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
    
    // Aquí se podría enviar el formulario al backend
    console.log('Formulario enviado:', this.formularioMinuta);
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