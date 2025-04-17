import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-step-three',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.css'
})
export class StepThreeComponent implements OnInit {
  capitalForm: FormGroup;
  enviando = false;
  error = '';
  datosAnteriores: any = {};

  tipo_aporte = [
    { id: 'dinero', nombre: 'Dinero' },
    { id: 'bienes', nombre: 'Bienes' },
    { id: 'mixto', nombre: 'Mixto (Dinero y Bienes)' }
  ];

  rango_capital = [
    { id: 'rango1', nombre: 'S/ 500 - S/ 1,000' },
    { id: 'rango2', nombre: 'S/ 1,001 - S/ 5,000' },
    { id: 'rango3', nombre: 'S/ 5,001 - S/ 10,000' },
    { id: 'rango4', nombre: 'S/ 10,001 - S/ 50,000' },
    { id: 'rango5', nombre: 'Más de S/ 50,000' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.capitalForm = this.fb.group({
      tipo_aporte: ['', Validators.required],
      rango_capital: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Recuperar datos combinados de los pasos anteriores
    const datosGuardados = localStorage.getItem('datos_empresa');
    if (datosGuardados) {
      this.datosAnteriores = JSON.parse(datosGuardados);
      console.log('Datos recuperados de pasos anteriores:', this.datosAnteriores);
    }
  }

  anterior(): void {
    this.router.navigate(['step-two'], { relativeTo: this.route.parent });
  }

  siguiente(): void {
    if (this.capitalForm.valid) {
      this.enviando = true;
      this.error = '';

      // Combinar datos de todos los pasos
      const datosCombinados = {
        ...this.datosAnteriores,
        ...this.capitalForm.value
      };
      
      localStorage.setItem('datos_empresa_completo', JSON.stringify(datosCombinados));
      console.log('Datos combinados actualizados:', datosCombinados);
          this.router.navigate(['step-four'], { relativeTo: this.route.parent });
         
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