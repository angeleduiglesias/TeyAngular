import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClienteMinutaService } from '../../../../../app/services/cliente/cliente-minuta.service';

// Interfaces para el formulario SAC
interface DatosPersonales {
  nacionalidad: string;
  dni: string;
  profesion: string;
  estado_civil: string;
  direccion: string;
  nombre_conyuge: string;
  dni_conyuge: string;
}

interface DatosEmpresa {
  direccion_empresa: string;
  provincia_empresa: string;
  departamento_empresa: string;
  objetivo: string;
}

interface AporteSocio {
  descripcion: string;
  monto: number;
}

interface Socio {
  nombre_socio: string;
  nacionalidad_socio: string;
  dni_socio: string;
  profesion_socio: string;
  estado_civil_socio: string;
  nombre_conyuge_socio: string;
  dni_conyuge_socio: string;
  aportes: AporteSocio[];
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

export interface FormularioSAC {
  paso_1_datos_personales: DatosPersonales;
  paso_2_datos_empresa: DatosEmpresa;
  paso_3_socios: Socio[];
  paso_4_capital_y_aportes: CapitalAportes;
  paso_5_apoderado: DatosApoderado;
  paso_6_confirmacion: Confirmacion;
}

interface MetodoPago {
  id: number;
  nombre: string;
  imagen: string;
}

// Tipos de formulario SAC
export enum TipoFormularioSAC {
  SACBND = 'sac_bienes_no_dinerarios',
  SACBD = 'sac_bienes_dinerarios'
}

@Component({
  selector: 'app-form-sac',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.sac.component.html',
  styleUrls: ['./form.sac.component.css']
})
export class FormSacComponent implements OnInit {
  @Input() userData: any;
  @Input() nombreEmpresa: string = '';
  @Input() estadoReserva: string = '';
  
  // Propiedad para controlar la visibilidad del formulario
  mostrarFormulario: boolean = false;
  cargandoEstado: boolean = true;
  
  // Eventos para comunicación con el componente padre
  @Output() estadoTramiteChange = new EventEmitter<string>();
  @Output() porcentajeProgresoChange = new EventEmitter<number>();
  @Output() estadoPagoChange = new EventEmitter<string>();
  @Output() pagoActualChange = new EventEmitter<number>();
  
  // Tipos de formulario disponibles
  tiposFormulario = TipoFormularioSAC;
  tipoFormularioSeleccionado: TipoFormularioSAC = TipoFormularioSAC.SACBND;
  
  // Agregar propiedad para el máximo de capital permitido
  readonly CAPITAL_MAXIMO = 5000;
  
  // Datos del formulario SAC
  pasos: string[] = [
    'Datos Personales', 
    'Datos de la Empresa', 
    'Socios',
    'Capital y Aportes',
    'Apoderado',
    'Confirmación'
  ];
  pasoActual: number = 0;
  
  // Inicialización del formulario
  formularioSAC: FormularioSAC = {
    paso_1_datos_personales: {
      nacionalidad: '',
      dni: '',
      profesion: '',
      estado_civil: '',
      direccion: '',
      nombre_conyuge: '',
      dni_conyuge: ''
    },
    paso_2_datos_empresa: {
      direccion_empresa: '',
      provincia_empresa: '',
      departamento_empresa: '',
      objetivo: ''
    },
    paso_3_socios: [
      {
        nombre_socio: '',
        nacionalidad_socio: '',
        dni_socio: '',
        profesion_socio: '',
        estado_civil_socio: '',
        nombre_conyuge_socio: '',
        dni_conyuge_socio: '',
        aportes: [
          {
            descripcion: '',
            monto: 0
          }
        ]
      }
    ],
    paso_4_capital_y_aportes: {
      monto_capital: 0,
      aportes: [
        {
          descripcion: '',
          monto: 0
        }
      ]
    },
    paso_5_apoderado: {
      apoderado: '',
      dni_apoderado: ''
    },
    paso_6_confirmacion: {
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
  
  // Método para cambiar el tipo de formulario
  cambiarTipoFormulario(tipo: TipoFormularioSAC): void {
    this.tipoFormularioSeleccionado = tipo;
    this.pasoActual = 0;
    this.mostrandoResumen = false;
    
    // Reiniciar los aportes según el tipo de formulario
    if (tipo === TipoFormularioSAC.SACBD) {
      this.formularioSAC.paso_4_capital_y_aportes.aportes = [
        {
          descripcion: 'Aporte en efectivo',
          monto: 0
        }
      ];
      
      // También actualizar los aportes de todos los socios para bienes dinerarios
      this.formularioSAC.paso_3_socios.forEach(socio => {
        socio.aportes.forEach(aporte => {
          aporte.descripcion = 'Aporte en efectivo';
        });
      });
    } else {
      this.formularioSAC.paso_4_capital_y_aportes.aportes = [
        {
          descripcion: '',
          monto: 0
        }
      ];
      
      // Para bienes no dinerarios, limpiar las descripciones
      this.formularioSAC.paso_3_socios.forEach(socio => {
        socio.aportes.forEach(aporte => {
          if (aporte.descripcion === 'Aporte en efectivo') {
            aporte.descripcion = '';
          }
        });
      });
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
  
  // Método para calcular el capital total automáticamente
  calcularCapitalTotal(): number {
    let totalSocios = 0;
    let totalTitular = 0;
    
    // Sumar aportes de todos los socios
    this.formularioSAC.paso_3_socios.forEach(socio => {
      socio.aportes.forEach(aporte => {
        totalSocios += aporte.monto || 0;
      });
    });
    
    // Sumar aportes del titular (paso 4)
    this.formularioSAC.paso_4_capital_y_aportes.aportes.forEach(aporte => {
      totalTitular += aporte.monto || 0;
    });
    
    const total = totalSocios + totalTitular;
    
    // Actualizar el monto_capital en el formulario
    this.formularioSAC.paso_4_capital_y_aportes.monto_capital = total;
    
    // Validar que no exceda el máximo
    if (total > this.CAPITAL_MAXIMO) {
      return this.CAPITAL_MAXIMO;
    }
    
    return total;
  }
  
  // Método para manejar cambios en aportes de socios
  onAporteSocioChange(socioIndex: number, aporteIndex: number, nuevoMonto: number): void {
    const montoAnterior = this.formularioSAC.paso_3_socios[socioIndex].aportes[aporteIndex].monto;
    
    // Calcular el total sin este aporte
    const totalSinEsteAporte = this.calcularCapitalSinAporte(socioIndex, aporteIndex);
    
    // Verificar si el nuevo total excedería el máximo
    if ((totalSinEsteAporte + nuevoMonto) > this.CAPITAL_MAXIMO) {
      const montoMaximoPermitido = this.CAPITAL_MAXIMO - totalSinEsteAporte;
      alert(`El monto total no puede exceder ${this.CAPITAL_MAXIMO}. El máximo permitido para este aporte es ${montoMaximoPermitido}.`);
      this.formularioSAC.paso_3_socios[socioIndex].aportes[aporteIndex].monto = Math.max(0, montoMaximoPermitido);
    }
    
    // Recalcular el capital total
    this.calcularCapitalTotal();
  }
  
  // Método para manejar cambios en aportes del titular
  onAporteTitularChange(aporteIndex: number, nuevoMonto: number): void {
    const montoAnterior = this.formularioSAC.paso_4_capital_y_aportes.aportes[aporteIndex].monto;
    
    // Calcular el total sin este aporte del titular
    const totalSinEsteAporte = this.calcularCapitalSinAporteTitular(aporteIndex);
    
    // Verificar si el nuevo total excedería el máximo
    if ((totalSinEsteAporte + nuevoMonto) > this.CAPITAL_MAXIMO) {
      const montoMaximoPermitido = this.CAPITAL_MAXIMO - totalSinEsteAporte;
      alert(`El monto total no puede exceder ${this.CAPITAL_MAXIMO}. El máximo permitido para este aporte es ${montoMaximoPermitido}.`);
      this.formularioSAC.paso_4_capital_y_aportes.aportes[aporteIndex].monto = Math.max(0, montoMaximoPermitido);
    }
    
    // Recalcular el capital total
    this.calcularCapitalTotal();
  }
  
  // Método auxiliar para calcular capital sin un aporte específico de socio
  private calcularCapitalSinAporte(socioIndex: number, aporteIndex: number): number {
    let total = 0;
    
    // Sumar aportes de socios (excluyendo el especificado)
    this.formularioSAC.paso_3_socios.forEach((socio, sIndex) => {
      socio.aportes.forEach((aporte, aIndex) => {
        if (sIndex === socioIndex && aIndex === aporteIndex) {
          return; // Saltar este aporte
        }
        total += aporte.monto || 0;
      });
    });
    
    // Sumar aportes del titular
    this.formularioSAC.paso_4_capital_y_aportes.aportes.forEach(aporte => {
      total += aporte.monto || 0;
    });
    
    return total;
  }
  
  // Método auxiliar para calcular capital sin un aporte específico del titular
  private calcularCapitalSinAporteTitular(aporteIndex: number): number {
    let total = 0;
    
    // Sumar aportes de socios
    this.formularioSAC.paso_3_socios.forEach(socio => {
      socio.aportes.forEach(aporte => {
        total += aporte.monto || 0;
      });
    });
    
    // Sumar aportes del titular (excluyendo el especificado)
    this.formularioSAC.paso_4_capital_y_aportes.aportes.forEach((aporte, index) => {
      if (index !== aporteIndex) {
        total += aporte.monto || 0;
      }
    });
    
    return total;
  }
  
  // Modificar validación para incluir el límite de capital
  validarPasoActual(): boolean {
    switch(this.pasoActual) {
      case 0: // Validar datos personales
        const datosPersonales = this.formularioSAC.paso_1_datos_personales;
        if (!datosPersonales.nacionalidad || !datosPersonales.dni || !datosPersonales.profesion || !datosPersonales.estado_civil) {
          alert('Por favor complete los campos obligatorios: Nacionalidad, DNI, Profesión y Estado Civil');
          return false;
        }
        return true;
        
      case 1: // Validar datos de empresa
        const datosEmpresa = this.formularioSAC.paso_2_datos_empresa;
        if (!datosEmpresa.objetivo) {
          alert('Por favor complete el objetivo de la empresa');
          return false;
        }
        return true;
        
      case 2: // Validar socios
        const socios = this.formularioSAC.paso_3_socios;
        if (socios.length < 2) {
          alert('Una SAC debe tener al menos 2 socios');
          return false;
        }
        
        for (const socio of socios) {
          if (!socio.nombre_socio || !socio.nacionalidad_socio || !socio.dni_socio || !socio.profesion_socio || !socio.estado_civil_socio) {
            alert('Todos los socios deben tener nombre, nacionalidad, DNI, profesión y estado civil');
            return false;
          }
        }
        return true;
        
      case 3: // Validar capital y aportes
        const capitalAportes = this.formularioSAC.paso_4_capital_y_aportes;
        const capitalTotal = this.calcularCapitalTotal();
        
        if (capitalTotal <= 0) {
          alert('El capital total debe ser mayor a 0');
          return false;
        }
        
        if (capitalTotal > this.CAPITAL_MAXIMO) {
          alert(`El capital total no puede exceder ${this.CAPITAL_MAXIMO}`);
          return false;
        }
        
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
        
      case 4: // Validar datos del apoderado
        const datosApoderado = this.formularioSAC.paso_5_apoderado;
        if (!datosApoderado.apoderado || !datosApoderado.dni_apoderado) {
          alert('Por favor complete los datos del apoderado');
          return false;
        }
        return true;
        
      case 5: // Validar confirmación
        const confirmacion = this.formularioSAC.paso_6_confirmacion;
        if (!confirmacion.ciudad) {
          alert('Por favor ingrese la ciudad');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  }
  
  // Métodos para gestionar socios
  agregarSocio(): void {
    const nuevaDescripcion = this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD ? 'Aporte en efectivo' : '';
    
    this.formularioSAC.paso_3_socios.push({
      nombre_socio: '',
      nacionalidad_socio: '',
      dni_socio: '',
      profesion_socio: '',
      estado_civil_socio: '',
      nombre_conyuge_socio: '',
      dni_conyuge_socio: '',
      aportes: [
        {
          descripcion: nuevaDescripcion,
          monto: 0
        }
      ]
    });
  }
  
  eliminarSocio(index: number): void {
    if (this.formularioSAC.paso_3_socios.length > 2) {
      this.formularioSAC.paso_3_socios.splice(index, 1);
      this.calcularCapitalTotal();
    } else {
      alert('Una SAC debe tener al menos 2 socios');
    }
  }
  
  // Métodos para gestionar aportes de socios (versión actualizada con cálculo automático)
  agregarAporteSocio(socioIndex: number): void {
    const nuevaDescripcion = this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD ? 'Aporte en efectivo' : '';
    
    this.formularioSAC.paso_3_socios[socioIndex].aportes.push({
      descripcion: nuevaDescripcion,
      monto: 0
    });
    this.calcularCapitalTotal();
  }
  
  eliminarAporteSocio(socioIndex: number, aporteIndex: number): void {
    if (this.formularioSAC.paso_3_socios[socioIndex].aportes.length > 1) {
      this.formularioSAC.paso_3_socios[socioIndex].aportes.splice(aporteIndex, 1);
      this.calcularCapitalTotal();
    }
  }
  
  // Métodos para gestionar aportes generales (versión actualizada con cálculo automático)
  agregarAporte(): void {
    if (this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD && 
        this.formularioSAC.paso_4_capital_y_aportes.aportes.length >= 1) {
      alert('Para bienes dinerarios solo se permite un aporte en efectivo');
      return;
    }
    
    this.formularioSAC.paso_4_capital_y_aportes.aportes.push({
      descripcion: this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD ? 'Aporte en efectivo' : '',
      monto: 0
    });
    this.calcularCapitalTotal();
  }
  
  eliminarAporte(index: number): void {
    if (this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD && 
        this.formularioSAC.paso_4_capital_y_aportes.aportes.length <= 1) {
      alert('Para bienes dinerarios se requiere al menos un aporte en efectivo');
      return;
    }
    
    if (index >= 0 && this.formularioSAC.paso_4_capital_y_aportes.aportes.length > 1) {
      this.formularioSAC.paso_4_capital_y_aportes.aportes.splice(index, 1);
      this.calcularCapitalTotal();
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
    
    this.estadoTramiteChange.emit('En proceso');
    this.porcentajeProgresoChange.emit(50);
    
    // Enviar el formulario al backend
    this.clienteMinutaService.enviarFormularioMinuta(
      this.formularioSAC,
      this.tipoFormularioSeleccionado,
      this.nombreEmpresa
    ).subscribe({
      next: (response) => {
        console.log('Formulario SAC enviado exitosamente:', response);
        this.estadoTramiteChange.emit('Enviado');
        this.porcentajeProgresoChange.emit(75);
      },
      error: (error) => {
        console.error('Error al enviar el formulario SAC:', error);
        this.formularioEnviado = false;
        this.estadoTramiteChange.emit('Error');
        this.porcentajeProgresoChange.emit(0);
      }
    });
  }
  
  seleccionarMetodoPago(id: number): void {
    this.metodoPagoSeleccionado = id;
  }
  
  confirmarPago(): void {
    if (this.metodoPagoSeleccionado) {
      setTimeout(() => {
        this.pagoConfirmado = true;
        this.estadoPagoChange.emit('Completado');
        this.pagoActualChange.emit(2);
        this.estadoTramiteChange.emit('Finalizado');
        this.porcentajeProgresoChange.emit(100);
      }, 2000);
    }
  }
}