import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ClienteDashboardService } from '../../../app/services/cliente/cliente-dashboard.service';
import { AuthService } from '../../../app/services/auth-service';
import { EstadoTramiteComponent } from './estado_tramite/estado-tramite.component';
import { EstadoPagosComponent } from './estado_pagos/estado-pagos.component';
import { FormMinutaComponent } from './formulario_minuta/form-minuta-component';


interface MetodoPago {
  id: number;
  nombre: string;
  imagen: string;
}

export interface EstadoFormActivated{
  estado_reserva: string;
  pago2: boolean;
  nombre_empresa: string;
  tipo_empresa:string;
  tipo_aporte: string;
  dni_cliente: string;
}

export interface TramiteData {
  fecha_inicio: Date;
  estado: string;
  progreso: number;
}

export interface PagoData {
  pago1: boolean;
  fecha_pago1: Date;
  pago2: boolean;
  fecha_pago2: Date;
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
  estado_tramite: TramiteData = {
    fecha_inicio: new Date(),
    estado: 'En Proceso',  //solo son datos de prueba
    progreso: 50  //solo son datos de prueba
  }
  // Datos de pagos
  estado_pagos: PagoData = {
    pago1: true, 
    fecha_pago1: new Date(), 
    fecha_pago2: new Date(), //solo son datos de prueba
    pago2: false //solo son datos de prueba
  }

  estado_documento: EstadoFormActivated = {
    estado_reserva: '',
    pago2: false,
    nombre_empresa: '',
    tipo_empresa: '',
    tipo_aporte: '',
    dni_cliente: ''
  }
  // Datos del formulario de minuta
  nombreEmpresa: string = ''; // Inicialmente vacío, se llenará cuando se reciba
  pasoActual: number = 0;

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
  
  cargando: boolean = false;
  error: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private DashboardClienteInformation: ClienteDashboardService
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
   
    this.DashboardClienteInformation.getDashboardData()
      .subscribe({
        next: (response) => {
          console.log('Datos recibidos del dashboard:', response);
          // Actualizar datos del trámite
          this.estado_tramite = response.estado_tramite;
          this.estado_documento = response.estado_documento;
          this.estado_pagos = response.estado_pagos;

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
      this.nombreEmpresa = 'Mi Empresa EIRL';
      this.nombreEmpresa = this.nombreEmpresa;
      
    });
  }
  
  actualizarEstadoTramite(estado: string): void {
    this.estado_tramite.estado = estado;
  }
  
  actualizarPorcentajeProgreso(porcentaje: number): void {
    this.estado_tramite.progreso = porcentaje;
  }
  
  actualizarEstadoPago(estado: string): void {
    this.estado_pagos.pago1 = estado === 'Completado';
  }
  
  actualizarPagoActual(pago: number): void {
    this.estado_pagos.pago2 = pago === 2; // Si pago es 2, significa que está completado
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

  // FUNCIÓN 3: Mostrar resumen - Implementada
  mostrarResumen(): void {
    // Validar que todos los campos estén completos
    let formularioValido = true;
    
    // Validar nombre de empresa
    if (!this.nombreEmpresa) {
      formularioValido = false;
    }
    
  
    
    if (formularioValido) {
      this.mostrandoResumen = true;
    } else {
      // Aquí se podría mostrar un mensaje de error
      console.error('Por favor complete todos los campos del formulario');
    }
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
    this.estado_tramite.estado = 'En proceso';
    this.estado_tramite.progreso = 50;
    
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
        this.estado_pagos.pago1 = true; // Cambiado de this.estadoPago = 'Completado'
        this.estado_pagos.pago2 = true; // Cambiado de this.pagoActual = this.pagoTotal
        
        // Actualizar estado del trámite
        this.estado_tramite.estado = 'Finalizado';
        this.estado_tramite.progreso = 100;
      }, 2000);
    }
  }
}
