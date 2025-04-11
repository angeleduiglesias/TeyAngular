import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-step-five',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-five.component.html',
  styleUrl: './step-five.component.css'
})
export class StepFiveComponent implements OnInit {
  pagoForm: FormGroup;
  enviando = false;
  error = '';
  
  // Datos de pago
  cuotas = [
    { id: 1, nombre: '1era cuota', monto: 'S/ 100', descripcion: 'Págalo hoy' },
    { id: 2, nombre: '2da cuota', monto: 'S/ 331', descripcion: 'Págalo después de aprobar la Minuta (contrato social)' }
  ];
  
  costoTotal = 'S/ 499';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pagoForm = this.fb.group({
      metodoPago: ['', Validators.required]
    });
  }

  ngOnInit(): void {}


  pagar(): void {
    if (this.pagoForm.valid) {
      this.enviando = true;
      this.error = '';
      
      // Simulación de procesamiento de pago
      setTimeout(() => {
        console.log('Pago procesado:', this.pagoForm.value);
        this.enviando = false;
        // Aquí podrías redirigir a una página de confirmación
        alert('¡Pago procesado con éxito!');
      }, 1500);
    } else {
      this.markFormGroupTouched(this.pagoForm);
    }
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


