import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-step-five',
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './step-five.component.html',
  styleUrl: './step-five.component.css'
})
export class StepFiveComponent implements OnInit {
  pagoForm: FormGroup;
  enviando = false;
  error = '';
  mostrarQueRecibiras = false;
  mostrarPopup = false;
  mostrarCargando = false;
  mostrarError = false;
  cuentaRegresiva = 3;
  private apiUrl = environment.apiUrl; 
  
  // Datos de pago
  cuotas = [
    { id: 1, nombre: 'Primera cuota', monto: 'S/ 100.00', descripcion: 'Págalo hoy' },
    { id: 2, nombre: 'Segunda cuota', monto: 'S/ 499.00', descripcion: 'Págalo después de aprobar la Minuta (contrato social)' }
  ];
  
  costoTotal = 'S/ 599.00';
  
  queRecibiras = [
    { 
      titulo: 'Primera cuota (S/ 100.00):', 
      descripcion: 'Elaboración de la minuta, asesoría legal personalizada y revisión de documentos.'
    },
    { 
      titulo: 'Segunda cuota (S/ 499.00):', 
      descripcion: 'Trámite notarial, inscripción en Registros Públicos, obtención de RUC y gestión completa hasta la constitución formal.'
    }
  ];
  
  // Tarjeta que será rechazada (oculta para el usuario)
  private tarjetaRechazada = '4000000000000002';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.pagoForm = this.fb.group({
      datosTarjeta: this.fb.group({
        numeroTarjeta: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
        nombreTitular: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/)]],
        fechaExpiracion: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
      })
    });
    
    // Añadir formato automático para la fecha de expiración
    this.pagoForm.get('datosTarjeta.fechaExpiracion')?.valueChanges.subscribe(value => {
      if (value) {
        // Eliminar cualquier carácter que no sea número
        let newVal = value.replace(/[^\d]/g, '');
        
        // Añadir automáticamente la barra después de los primeros 2 dígitos
        if (newVal.length >= 2) {
          newVal = newVal.substring(0, 2) + '/' + newVal.substring(2);
        }
        
        // Limitar a 5 caracteres (MM/YY)
        if (newVal.length > 5) {
          newVal = newVal.substring(0, 5);
        }
        
        // Actualizar el valor solo si ha cambiado para evitar un bucle infinito
        if (newVal !== value) {
          this.pagoForm.get('datosTarjeta.fechaExpiracion')?.setValue(newVal, { emitEvent: false });
        }
      }
    });
    
    // Añadir formato para el número de tarjeta (agrupar en bloques de 4)
    this.pagoForm.get('datosTarjeta.numeroTarjeta')?.valueChanges.subscribe(value => {
      if (value) {
        // Eliminar cualquier carácter que no sea número
        let newVal = value.replace(/[^\d]/g, '');
        
        // Limitar a 16 dígitos
        if (newVal.length > 16) {
          newVal = newVal.substring(0, 16);
        }
        
        // Actualizar el valor solo si ha cambiado para evitar un bucle infinito
        if (newVal !== value) {
          this.pagoForm.get('datosTarjeta.numeroTarjeta')?.setValue(newVal, { emitEvent: false });
        }
      }
    });
    
    // Validar que el nombre solo contenga letras
    this.pagoForm.get('datosTarjeta.nombreTitular')?.valueChanges.subscribe(value => {
      if (value) {
        // Reemplazar cualquier número por una cadena vacía
        const newVal = value.replace(/[0-9]/g, '');
        
        // Actualizar el valor solo si ha cambiado
        if (newVal !== value) {
          this.pagoForm.get('datosTarjeta.nombreTitular')?.setValue(newVal, { emitEvent: false });
        }
      }
    });
    
    // Validar que el CVV solo contenga números
    this.pagoForm.get('datosTarjeta.cvv')?.valueChanges.subscribe(value => {
      if (value) {
        // Eliminar cualquier carácter que no sea número
        const newVal = value.replace(/[^\d]/g, '');
        
        // Limitar a 3 dígitos
        const limitedVal = newVal.substring(0, 3);
        
        // Actualizar el valor solo si ha cambiado
        if (limitedVal !== value) {
          this.pagoForm.get('datosTarjeta.cvv')?.setValue(limitedVal, { emitEvent: false });
        }
      }
    });
  }

  ngOnInit(): void {
    // Recuperar el DNI guardado en localStorage
    const dniUsuario = localStorage.getItem('dni_usuario');
    if (dniUsuario) {
      console.log('DNI recuperado para el paso 5:', dniUsuario);
      // Aquí puedes usar el DNI como necesites en este paso
      // Por ejemplo, mostrarlo en algún campo o usarlo para alguna validación
    }
  }

  toggleQueRecibiras(): void {
    this.mostrarQueRecibiras = !this.mostrarQueRecibiras;
  }

  pagar(): void {
    if (this.pagoForm.valid) {
      this.enviando = true;
      this.mostrarCargando = true;
      this.error = '';
      this.mostrarError = false;
      
      // Obtener número de tarjeta para validación
      const numeroTarjeta = this.pagoForm.get('datosTarjeta.numeroTarjeta')?.value;
      
      // Crear objeto con los datos del pago (simplificado)
      const datosPago = {
        dni: localStorage.getItem('dni_usuario'),
        estado: 'pagado',
        monto: 100.00,
        comprobante: null,
        tipo_pago: 'reserva_nombre'
      };
      
      // Verificar si es la tarjeta que debe fallar
      const esTarjetaFallida = numeroTarjeta === this.tarjetaRechazada;
      
      // Simular tiempo de procesamiento (4-5 segundos)
      setTimeout(() => {
        if (esTarjetaFallida) {
          // Simular error de pago
          console.error('Error al procesar el pago: Tarjeta rechazada');
          this.enviando = false;
          this.mostrarCargando = false;
          this.error = 'La tarjeta ha sido rechazada. Por favor, verifique los datos o utilice otra tarjeta.';
          this.mostrarError = true;
        } else {
          // Simular éxito y enviar datos al backend
          console.log('Respuesta del servidor: Pago exitoso');
          
          // Enviar datos simplificados al backend
          this.http.post<any>(`${this.apiUrl}/api/cliente/pagos`, datosPago).subscribe({
            next: (response) => {
              console.log('Datos enviados al backend:', response);
              this.enviando = false;
              this.mostrarCargando = false;
              this.mostrarPopup = true;
              this.iniciarCuentaRegresiva();
              },
            error: (error) => {
              console.error('Error al enviar datos al backend:', error);
              // Continuamos con el flujo de éxito para demostración
              this.enviando = false;
              this.mostrarCargando = false;
              this.mostrarPopup = true;
              this.iniciarCuentaRegresiva();
            }
          });
        }
      }, 4500); // 4.5 segundos de espera
    } else {
      this.markFormGroupTouched(this.pagoForm);
    }
  }

  iniciarCuentaRegresiva(): void {
    const intervalo = setInterval(() => {
      this.cuentaRegresiva--;
      
      if (this.cuentaRegresiva <= 0) {
        clearInterval(intervalo);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}


