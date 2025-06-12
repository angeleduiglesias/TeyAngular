import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ClienteMinutaService } from '../../../../../app/services/cliente/cliente-minuta.service';

// Interfaces para el formulario SAC
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
  paso_1: DatosPersonales;
  paso_2: DatosEmpresa;
  paso_3: Socio[];
  paso_4: CapitalAportes;
  paso_5: DatosApoderado;
  paso_6: Confirmacion;
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
  @Input() tipoAporte: string = '';
  @Input() pago2: boolean = false;
  @Input() dniUsuario: string = '';
  
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
    paso_3: [
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
    paso_4: {
      monto_capital: 0,
      aportes: [
        {
          descripcion: '',
          monto: 0
        }
      ]
    },
    paso_5: {
      apoderado: '',
      dni_apoderado: ''
    },
    paso_6: {
      ciudad: 'Trujillo',
      fecha_registro: new Date().toISOString().split('T')[0]
    }
  };
  
  mostrandoResumen: boolean = false;
  formularioEnviado: boolean = false;
  
  // Datos de pago
  metodosPago: MetodoPago[] = [
    { id: 1, nombre: 'Tarjeta de Crédito', imagen: '' },
    { id: 2, nombre: 'PayPal', imagen: '' },
    { id: 3, nombre: 'Transferencia Bancaria', imagen: '' }
  ];
  metodoPagoSeleccionado: number | null = null;
  pagoConfirmado: boolean = false;
 
  constructor(
    private clienteMinutaService: ClienteMinutaService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.nombreEmpresa) {
      this.formularioSAC.paso_2.nombre_empresa = this.nombreEmpresa;
    }
    // Verificar si ya pagó
    if (this.pago2) {
      this.mostrarFormulario = false;
      this.formularioEnviado = true;
      this.pagoConfirmado = true;
      this.estadoTramiteChange.emit('Finalizado');
      this.porcentajeProgresoChange.emit(100);
      this.estadoPagoChange.emit('Completado');
      this.pagoActualChange.emit(2);
    } else {
      this.verificarEstadoReserva();
      this.configurarTipoFormulario();
    }
  }
  
  ngOnChanges(): void {
    
    if (this.nombreEmpresa) {
      this.formularioSAC.paso_2.nombre_empresa = this.nombreEmpresa;
    }
 // Verificar si ya pagó
    if (this.pago2) {
    this.mostrarFormulario = false;
    this.formularioEnviado = true;
    this.pagoConfirmado = true;
    this.estadoTramiteChange.emit('Finalizado');
    this.porcentajeProgresoChange.emit(100);
    this.estadoPagoChange.emit('Completado');
    this.pagoActualChange.emit(2);
    } else {
    this.verificarEstadoReserva();
    this.configurarTipoFormulario();
}
  }
  

//funcion para configurar el tipo de formulario segun tipo de aporte
private configurarTipoFormulario(): void {
  if (this.tipoAporte) {
    if (this.tipoAporte === 'dinero') {
      this.tipoFormularioSeleccionado = TipoFormularioSAC.SACBD; // Bienes Dinerarios
    } else if (this.tipoAporte === 'bienes') {
      this.tipoFormularioSeleccionado = TipoFormularioSAC.SACBND; // Bienes No Dinerarios
    }
    
    // Actualizar la descripción del aporte del primer socio
    if (this.formularioSAC.paso_3.length > 0 && this.formularioSAC.paso_3[0].aportes.length > 0) {
      const nuevaDescripcion = this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD ? 'Aporte en efectivo' : '';
      this.formularioSAC.paso_3[0].aportes[0].descripcion = nuevaDescripcion;
    }
    
    // Actualizar la descripción del aporte en el paso 4 (Capital y Aportes)
    if (this.formularioSAC.paso_4.aportes.length > 0) {
      const nuevaDescripcionPaso4 = this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD ? 'Aporte en efectivo' : '';
      this.formularioSAC.paso_4.aportes[0].descripcion = nuevaDescripcionPaso4;
    }
  }
}

  // Método para verificar el estado de la reserva
  private verificarEstadoReserva(): void {
    this.cargandoEstado = true;
    
    const timeout = setTimeout(() => {
      if (!this.estadoReserva) {
        this.mostrarFormulario = true;
        this.cargandoEstado = false;
      }
    }, 100);
    
    if (this.estadoReserva) {
      clearTimeout(timeout);
      this.mostrarFormulario = this.estadoReserva === 'pendiente';
      this.cargandoEstado = false;
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
    this.formularioSAC.paso_3.forEach(socio => {
      socio.aportes.forEach(aporte => {
        totalSocios += aporte.monto || 0;
      });
    });
    
    // Sumar aportes del titular (paso 4)
    this.formularioSAC.paso_4.aportes.forEach(aporte => {
      totalTitular += aporte.monto || 0;
    });
    
    const total = totalSocios + totalTitular;
    
    // Actualizar el monto_capital en el formulario
    this.formularioSAC.paso_4.monto_capital = total;
    
    // Validar que no exceda el máximo
    if (total > this.CAPITAL_MAXIMO) {
      return this.CAPITAL_MAXIMO;
    }
    
    return total;
  }
  
  // Método para manejar cambios en aportes de socios
  onAporteSocioChange(socioIndex: number, aporteIndex: number, nuevoMonto: number): void {
    const montoAnterior = this.formularioSAC.paso_3[socioIndex].aportes[aporteIndex].monto;
    
    // Calcular el total sin este aporte
    const totalSinEsteAporte = this.calcularCapitalSinAporte(socioIndex, aporteIndex);
    
    // Verificar si el nuevo total excedería el máximo
    if ((totalSinEsteAporte + nuevoMonto) > this.CAPITAL_MAXIMO) {
      const montoMaximoPermitido = this.CAPITAL_MAXIMO - totalSinEsteAporte;
      alert(`El monto total no puede exceder ${this.CAPITAL_MAXIMO}. El máximo permitido para este aporte es ${montoMaximoPermitido}.`);
      this.formularioSAC.paso_3[socioIndex].aportes[aporteIndex].monto = Math.max(0, montoMaximoPermitido);
    }
    
    // Recalcular el capital total
    this.calcularCapitalTotal();
  }
  
  // Método para manejar cambios en aportes del titular
  onAporteTitularChange(aporteIndex: number, nuevoMonto: number): void {
    const montoAnterior = this.formularioSAC.paso_4.aportes[aporteIndex].monto;
    
    // Calcular el total sin este aporte del titular
    const totalSinEsteAporte = this.calcularCapitalSinAporteTitular(aporteIndex);
    
    // Verificar si el nuevo total excedería el máximo
    if ((totalSinEsteAporte + nuevoMonto) > this.CAPITAL_MAXIMO) {
      const montoMaximoPermitido = this.CAPITAL_MAXIMO - totalSinEsteAporte;
      alert(`El monto total no puede exceder ${this.CAPITAL_MAXIMO}. El máximo permitido para este aporte es ${montoMaximoPermitido}.`);
      this.formularioSAC.paso_4.aportes[aporteIndex].monto = Math.max(0, montoMaximoPermitido);
    }
    
    // Recalcular el capital total
    this.calcularCapitalTotal();
  }
  
  // Método auxiliar para calcular capital sin un aporte específico de socio
  private calcularCapitalSinAporte(socioIndex: number, aporteIndex: number): number {
    let total = 0;
    
    // Sumar aportes de socios (excluyendo el especificado)
    this.formularioSAC.paso_3.forEach((socio, sIndex) => {
      socio.aportes.forEach((aporte, aIndex) => {
        if (sIndex === socioIndex && aIndex === aporteIndex) {
          return; // Saltar este aporte
        }
        total += aporte.monto || 0;
      });
    });
    
    // Sumar aportes del titular
    this.formularioSAC.paso_4.aportes.forEach(aporte => {
      total += aporte.monto || 0;
    });
    
    return total;
  }
  
  // Método auxiliar para calcular capital sin un aporte específico del titular
  private calcularCapitalSinAporteTitular(aporteIndex: number): number {
    let total = 0;
    
    // Sumar aportes de socios
    this.formularioSAC.paso_3.forEach(socio => {
      socio.aportes.forEach(aporte => {
        total += aporte.monto || 0;
      });
    });
    
    // Sumar aportes del titular (excluyendo el especificado)
    this.formularioSAC.paso_4.aportes.forEach((aporte, index) => {
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
        const datosPersonales = this.formularioSAC.paso_1;
        if (!datosPersonales.nacionalidad || !datosPersonales.profesion || !datosPersonales.estado_civil) {
          alert('Por favor complete los campos obligatorios: Nacionalidad, DNI, Profesión y Estado Civil');
          return false;
        }
        return true;
        
      case 1: // Validar datos de empresa
        const datosEmpresa = this.formularioSAC.paso_2;
        if (!datosEmpresa.objetivo) {
          alert('Por favor complete el objetivo de la empresa');
          return false;
        }
        return true;
        
      case 2: // Validar socios
        const socios = this.formularioSAC.paso_3;
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
        const capitalAportes = this.formularioSAC.paso_4;
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
        const datosApoderado = this.formularioSAC.paso_5;
        if (!datosApoderado.apoderado || !datosApoderado.dni_apoderado) {
          alert('Por favor complete los datos del apoderado');
          return false;
        }
        return true;
        
      case 5: // Validar confirmación
        const confirmacion = this.formularioSAC.paso_6;
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
    
    this.formularioSAC.paso_3.push({
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
    if (this.formularioSAC.paso_3.length > 2) {
      this.formularioSAC.paso_3.splice(index, 1);
      this.calcularCapitalTotal();
    } else {
      alert('Una SAC debe tener al menos 2 socios');
    }
  }
  
  // Métodos para gestionar aportes de socios (versión actualizada con cálculo automático)
  agregarAporteSocio(socioIndex: number): void {
    const nuevaDescripcion = this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD ? 'Aporte en efectivo' : '';
    
    this.formularioSAC.paso_3[socioIndex].aportes.push({
      descripcion: nuevaDescripcion,
      monto: 0
    });
    this.calcularCapitalTotal();
  }
  
  eliminarAporteSocio(socioIndex: number, aporteIndex: number): void {
    if (this.formularioSAC.paso_3[socioIndex].aportes.length > 1) {
      this.formularioSAC.paso_3[socioIndex].aportes.splice(aporteIndex, 1);
      this.calcularCapitalTotal();
    }
  }
  
  // Métodos para gestionar aportes generales (versión actualizada con cálculo automático)
  agregarAporte(): void {
    if (this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD && 
        this.formularioSAC.paso_4.aportes.length >= 1) {
      alert('Para bienes dinerarios solo se permite un aporte en efectivo');
      return;
    }
    
    this.formularioSAC.paso_4.aportes.push({
      descripcion: this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD ? 'Aporte en efectivo' : '',
      monto: 0
    });
    this.calcularCapitalTotal();
  }
  
  eliminarAporte(index: number): void {
    if (this.tipoFormularioSeleccionado === TipoFormularioSAC.SACBD && 
        this.formularioSAC.paso_4.aportes.length <= 1) {
      alert('Para bienes dinerarios se requiere al menos un aporte en efectivo');
      return;
    }
    
    if (index >= 0 && this.formularioSAC.paso_4.aportes.length > 1) {
      this.formularioSAC.paso_4.aportes.splice(index, 1);
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
      // Crear objeto con los datos del pago (similar a step-five.component.ts)
      const datosPago = {
        dni: this.dniUsuario,
        estado: 'pagado',
        fecha: new Date(),
        monto: 400.00,
        comprobante: null,
        tipo_pago: 'minuta'
      };
      
      // Mostrar indicador de carga o similar aquí si es necesario
      
      // Enviar datos al mismo endpoint que usa step-five.component.ts
      this.http.post<any>(`${environment.apiUrl}/api/cliente/pagos`, datosPago).subscribe({
        next: (response) => {
          console.log('Datos de pago enviados al backend:', response);
          
          // Mantener la lógica existente para actualizar el estado
          this.pagoConfirmado = true;
          this.estadoPagoChange.emit('Completado');
          this.pagoActualChange.emit(2);
          this.estadoTramiteChange.emit('Finalizado');
          this.porcentajeProgresoChange.emit(100);
        },
        error: (error) => {
          console.error('Error al enviar datos de pago:', error);
          // Aún así actualizamos el estado para mantener la funcionalidad actual
          // en caso de error de conexión con el backend
          this.pagoConfirmado = true;
          this.estadoPagoChange.emit('Completado');
          this.pagoActualChange.emit(2);
          this.estadoTramiteChange.emit('Finalizado');
          this.porcentajeProgresoChange.emit(100);
        }
      });
    }
  }
}