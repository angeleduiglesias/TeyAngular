import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service';
import { EstadoTramiteComponent } from './estado_tramite/estado-tramite.component';
import { EstadoPagosComponent } from './estado_pagos/estado-pagos.component';
import { FormMinutaComponent } from './formulario_minuta/form-minuta-component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

interface Notificacion {
  id: number;
  mensaje: string;
  fecha: Date;
  leida: boolean;
}

interface MetodoPago {
  id: number;
  nombre: string;
  imagen: string;
}

interface DashboardData {
  tramite: {
    fechaInicio: string;
    estado: string;
    porcentaje: number;
  };
  pago: {
    estado: string;
    actual: number;
    total: number;
  };
  empresa: {
    nombre: string;
  };
  notificaciones: Notificacion[];
}

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, EstadoTramiteComponent, EstadoPagosComponent, FormMinutaComponent],
  templateUrl: './cliente-dashboard-component.html',
  styleUrl: './cliente-dashboard-component.css'
})
export class ClienteDashboardComponent implements OnInit {
  // Datos del usuario
  userData: any = null;
  
  // Control de pestañas
  activeTab: string = 'tramite';
  
  // Datos del trámite
  fechaInicioTramite: Date = new Date();
  estadoTramite: string = 'Pendiente'; // 'Pendiente', 'En proceso', 'Finalizado'
  porcentajeProgreso: number = 25;
  
  // Datos de pagos
  estadoPago: string = 'Pendiente'; // 'Pendiente', 'Completado'
  pagoActual: number = 0;
  pagoTotal: number = 2;
  
  // Datos del formulario de minuta
  nombreEmpresa: string = ''; // Inicialmente vacío, se llenará cuando se reciba
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
  
  // Configuración de notificaciones
  configNotificaciones = {
    email: true,
    sms: false
  };
  
  // Notificaciones
  notificaciones: Notificacion[] = [
    {
      id: 1,
      mensaje: 'Bienvenido al sistema de gestión de trámites.',
      fecha: new Date(),
      leida: false
    }
  ];
  
  cargando: boolean = false;
  error: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
      
      // Cargar todos los datos del dashboard de una sola vez
      this.cargarDatosDashboard();
    });
  }
  
  cargarDatosDashboard(): void {
    this.cargando = true;
    this.error = '';
    
    // Obtener el ID del usuario desde el servicio de autenticación
    const userId = this.userData?.id || localStorage.getItem('userId') || '0';
    
    this.http.get<DashboardData>(`${environment.apiUrl}/clientes/${userId}/dashboard`)
      .subscribe({
        next: (data) => {
          // Actualizar datos del trámite
          this.fechaInicioTramite = new Date(data.tramite.fechaInicio);
          this.estadoTramite = data.tramite.estado;
          this.porcentajeProgreso = data.tramite.porcentaje;
          
          // Actualizar datos de pago
          this.estadoPago = data.pago.estado;
          this.pagoActual = data.pago.actual;
          this.pagoTotal = data.pago.total;
          
          // Actualizar nombre de empresa
          this.nombreEmpresa = data.empresa.nombre;
          if (this.nombreEmpresa) {
            this.datosFormulario.nombreEmpresa = this.nombreEmpresa;
          }
          
          // Actualizar notificaciones
          if (data.notificaciones && data.notificaciones.length > 0) {
            this.notificaciones = data.notificaciones;
          }
          
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
          this.error = 'No se pudieron cargar los datos. Por favor, intenta nuevamente.';
          this.cargando = false;
          
          // Usar datos simulados en caso de error (para desarrollo)
          this.simularDatos();
        }
      });
  }
  
  // Método para simular datos (solo para desarrollo)
  private simularDatos(): void {
    // Simulación: después de 1 segundo, recibimos los datos
    setTimeout(() => {
      this.nombreEmpresa = 'Mi Empresa SAS';
      this.datosFormulario.nombreEmpresa = this.nombreEmpresa;
      
      // Agregar notificación
      this.notificaciones.unshift({
        id: 2,
        mensaje: `El nombre de tu empresa "${this.nombreEmpresa}" ha sido aprobado. Ya puedes completar el formulario.`,
        fecha: new Date(),
        leida: false
      });
    }, 1000);
  }
  
  actualizarEstadoTramite(estado: string): void {
    this.estadoTramite = estado;
  }
  
  actualizarPorcentajeProgreso(porcentaje: number): void {
    this.porcentajeProgreso = porcentaje;
  }
  
  actualizarEstadoPago(estado: string): void {
    this.estadoPago = estado;
  }
  
  actualizarPagoActual(pago: number): void {
    this.pagoActual = pago;
  }

  // Métodos para el formulario multi-step
  pasoSiguiente(): void {
    if (this.pasoActual < this.pasos.length - 1) {
      this.pasoActual++;
    }
  }

  logout() {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
  
  pasoAnterior(): void {
    if (this.pasoActual > 0) {
      this.pasoActual--;
    }
  }
  
  // FUNCIÓN 1: Agregar socio - Corregida
  agregarSocio(): void {
    this.datosFormulario.socios.push({
      nombre: '',
      participacion: 0
    });
  }
  
  // FUNCIÓN 2: Eliminar socio - Implementada
  eliminarSocio(index: number): void {
    if (index > 0 && this.datosFormulario.socios.length > 1) {
      this.datosFormulario.socios.splice(index, 1);
    }
  }
  
  // FUNCIÓN 3: Mostrar resumen - Implementada
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
  
  // FUNCIÓN 4: Obtener texto de tipo de sociedad - Implementada
  getTipoSociedadTexto(tipo: string): string {
    const tiposSociedad: {[key: string]: string} = {
      'sas': 'Sociedad por Acciones Simplificada (SAS)',
      'ltda': 'Sociedad de Responsabilidad Limitada (Ltda)',
      'sa': 'Sociedad Anónima (SA)'
    };
    
    return tiposSociedad[tipo] || tipo;
  }
  
  // FUNCIÓN 5: Editar formulario - Implementada
  editarFormulario(): void {
    this.mostrandoResumen = false;
  }
  
  // FUNCIÓN 6: Enviar formulario - Implementada
  enviarFormulario(): void {
    this.formularioEnviado = true;
    this.mostrandoResumen = false;
    
    // Actualizar estado del trámite
    this.estadoTramite = 'En proceso';
    this.porcentajeProgreso = 50;
    
    // Agregar notificación
    this.notificaciones.unshift({
      id: this.notificaciones.length + 1,
      mensaje: 'Tu formulario ha sido enviado correctamente. Por favor completa el pago para continuar con el trámite.',
      fecha: new Date(),
      leida: false
    });
  }
  
  // FUNCIÓN 7: Seleccionar método de pago - Implementada
  seleccionarMetodoPago(id: number): void {
    this.metodoPagoSeleccionado = id;
  }
  
  // FUNCIÓN 8: Confirmar pago - Implementada
  confirmarPago(): void {
    if (this.metodoPagoSeleccionado) {
      // Simular procesamiento de pago
      setTimeout(() => {
        this.pagoConfirmado = true;
        this.estadoPago = 'Completado';
        this.pagoActual = this.pagoTotal;
        
        // Actualizar estado del trámite
        this.estadoTramite = 'Finalizado';
        this.porcentajeProgreso = 100;
        
        // Agregar notificación
        this.notificaciones.unshift({
          id: this.notificaciones.length + 1,
          mensaje: 'Tu pago ha sido procesado correctamente. Tu empresa será registrada en un plazo no mayor a 10 días.',
          fecha: new Date(),
          leida: false
        });
      }, 2000);
    }
  }
}
