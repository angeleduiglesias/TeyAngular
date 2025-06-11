import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClienteMinutaService } from '../../../../../app/services/cliente/cliente-minuta.service';

// Interfaces para el formulario de 5 pasos
interface DatosPersonales {
  nacionalidad: string;
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

export interface FormularioMinuta {
  paso_1: DatosPersonales;
  paso_2: DatosEmpresa;
  paso_3: CapitalAportes;
  paso_4: DatosApoderado;
  paso_5: Confirmacion;
}

interface MetodoPago {
  id: number;
  nombre: string;
  imagen: string;
}

// Tipos de formulario de minuta
 export enum TipoFormularioEIRL {
  EIRLBND = 'eirl_bienes_no_dinerarios',
  EIRLBD = 'eirl_bienes_dinerarios'
}


@Component({
  selector: 'app-form-eirl',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.eirl.component.html',
  styleUrls: ['./form.eirl.component.css']
})
export class FormEirlComponent implements OnInit {
  @Input() userData: any;
  @Input() nombreEmpresa: string = '';
  @Input() estadoReserva: string = ''; // Nuevo input para recibir el estado de la reserva
  
  // Propiedad para controlar la visibilidad del formulario
  mostrarFormulario: boolean = false;
  cargandoEstado: boolean = true; // Para mostrar un estado de carga
  
  // Eventos para comunicación con el componente padre
  @Output() estadoTramiteChange = new EventEmitter<string>();
  @Output() porcentajeProgresoChange = new EventEmitter<number>();
  @Output() estadoPagoChange = new EventEmitter<string>();
  @Output() pagoActualChange = new EventEmitter<number>();
  
  // Tipos de formulario disponibles
  tiposFormulario = TipoFormularioEIRL;
  tipoFormularioSeleccionado: TipoFormularioEIRL = TipoFormularioEIRL.EIRLBND;
  
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
    paso_1: {
      nacionalidad: '',
      profesion: '',
      estado_civil: '',
      direccion: '',
      nombre_conyuge: '',
      dni_conyuge: ''
    },
    paso_2: {
      nombre_empresa: '',
      direccion_empresa: '',
      provincia_empresa: '',
      departamento_empresa: '',
      objetivo: ''
    },
    paso_3: {
      monto_capital: 0,
      aportes: [
        {
          descripcion: '',
          monto: 0
        }
      ]
    },
    paso_4: {
      apoderado: '',
      dni_apoderado: ''
    },
    paso_5: {
      ciudad: 'Trujillo',
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

  constructor(
    private clienteMinutaService: ClienteMinutaService
  ) {}

  ngOnInit(): void {
    // Inicializar el nombre de la empresa en el formulario cuando esté disponible
    if (this.nombreEmpresa) {
      this.formularioMinuta.paso_2.nombre_empresa = this.nombreEmpresa;
    } 
    // Determinar si se debe mostrar el formulario según el estado de la reserva
    this.verificarEstadoReserva();
  }
  
  ngOnChanges(): void {
    if (this.nombreEmpresa) {
      this.formularioMinuta.paso_2.nombre_empresa = this.nombreEmpresa;
    }
    
    // Verificar el estado de la reserva cuando cambie
    this.verificarEstadoReserva();
  }
  
  // Método para verificar el estado de la reserva y determinar si se muestra el formulario
  private verificarEstadoReserva(): void {
    this.cargandoEstado = true;
    
    // Si no hay estado de reserva después de 10 segundos, ocultar el formulario
    const timeout = setTimeout(() => {
      if (!this.estadoReserva) {
        this.mostrarFormulario = true;
        this.cargandoEstado = false;
      }
    },5000);
    
    // Si hay un estado de reserva, determinar si se muestra el formulario
    if (this.estadoReserva) {
      clearTimeout(timeout); // Cancelar el timeout si ya tenemos el estado
      this.mostrarFormulario = this.estadoReserva === 'completo';
      this.cargandoEstado = false;
    }
  }
  
  // Método para cambiar el tipo de formulario
  cambiarTipoFormulario(tipo: TipoFormularioEIRL): void {
    this.tipoFormularioSeleccionado = tipo;
    
    // Reiniciar el formulario si se cambia el tipo
    this.pasoActual = 2;
    this.mostrandoResumen = false;
    
    // Reiniciar los aportes según el tipo de formulario
    if (tipo === TipoFormularioEIRL.EIRLBD) {
      // Para bienes dinerarios, inicializar con un aporte de dinero
      this.formularioMinuta.paso_3.aportes = [
        {
          descripcion: 'Aporte en efectivo',
          monto: 0
        }
      ];
    } else {
      // Para bienes no dinerarios, inicializar con un aporte genérico
      this.formularioMinuta.paso_3.aportes = [
        {
          descripcion: '',
          monto: 0
        }
      ];
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
        const datosPersonales = this.formularioMinuta.paso_1;
        if (!datosPersonales.nacionalidad || !datosPersonales.profesion || !datosPersonales.estado_civil) {
          alert('Por favor complete los campos obligatorios: Nacionalidad, Profesión y Estado Civil');
          return false;
        }
        return true;
        
      case 1: // Validar datos de empresa
        const datosEmpresa = this.formularioMinuta.paso_2;
        if (!datosEmpresa.nombre_empresa || !datosEmpresa.objetivo) {
          alert('Por favor complete los campos obligatorios: Nombre de la empresa y Objetivo');
          return false;
        }
        return true;
        
      case 2: // Validar capital y aportes
        const capitalAportes = this.formularioMinuta.paso_3;
        if (capitalAportes.monto_capital <= 0) {
          alert('El monto de capital debe ser mayor a 0');
          return false;
        }
        
        // Validación específica según el tipo de formulario
        if (this.tipoFormularioSeleccionado === TipoFormularioEIRL.EIRLBD) {
          // Para bienes dinerarios, validar que el monto del aporte coincida con el capital
          const totalAportes = capitalAportes.aportes.reduce((sum, aporte) => sum + aporte.monto, 0);
          if (totalAportes !== capitalAportes.monto_capital) {
            alert('El monto total de los aportes debe ser igual al monto de capital');
            return false;
          }
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
        const datosApoderado = this.formularioMinuta.paso_4;
        if (!datosApoderado.apoderado || !datosApoderado.dni_apoderado) {
          alert('Por favor complete los datos del apoderado');
          return false;
        }
        return true;
        
      case 4: // Validar confirmación
        const confirmacion = this.formularioMinuta.paso_5;
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
    // Si es tipo dinerario, no permitir agregar más aportes
    if (this.tipoFormularioSeleccionado === TipoFormularioEIRL.EIRLBD && 
        this.formularioMinuta.paso_3.aportes.length >= 1) {
      alert('Para bienes dinerarios solo se permite un aporte en efectivo');
      return;
    }
    
    this.formularioMinuta.paso_3.aportes.push({
      descripcion: this.tipoFormularioSeleccionado === TipoFormularioEIRL.EIRLBD ? 'Aporte en efectivo' : '',
      monto: 0
    });
  }
  
  eliminarAporte(index: number): void {
    // Si es tipo dinerario, no permitir eliminar el único aporte
    if (this.tipoFormularioSeleccionado === TipoFormularioEIRL.EIRLBD && 
        this.formularioMinuta.paso_3.aportes.length <= 1) {
      alert('Para bienes dinerarios se requiere al menos un aporte en efectivo');
      return;
    }
    
    if (index >= 0 && this.formularioMinuta.paso_3.aportes.length > 1) {
      this.formularioMinuta.paso_3.aportes.splice(index, 1);
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
    
    // Enviar el formulario al backend
    this.clienteMinutaService.enviarFormularioMinuta(
      this.formularioMinuta,
      this.tipoFormularioSeleccionado,
    ).subscribe({
      next: (response) => {
        console.log('Formulario enviado exitosamente:', response);
        // Aquí puedes manejar la respuesta exitosa
      },
      error: (error) => {
        console.error('Error al enviar el formulario:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
        this.formularioEnviado = false; // Permitir al usuario intentar nuevamente
      }
    });
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
