import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-step-one',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.css'
})
export class StepOneComponent implements OnInit {
  tipoEmpresaForm: FormGroup;
  opcionesSocios = [2, 3, 5, 10];
  mostrarInputPersonalizado = false;
  datosPersonalesForm: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.tipoEmpresaForm = this.fb.group({
      tipo_empresa: ['', Validators.required],
      nombre_empresa: ['', Validators.required],
      posible_nombre1: ['', Validators.required],  //recomendacion de poner posibles_Nombre1 y asi para todos los demas
      posible_nombre2: ['', Validators.required],
      posible_nombre3: ['', Validators.required],
      posible_nombre4: ['', Validators.required],
      numero_socios: [null]
    });
  }

  ngOnInit(): void {
    // Escuchar cambios en el tipo de empresa para añadir validadores dinámicamente
    this.tipoEmpresaForm.get('tipo_empresa')?.valueChanges.subscribe(value => {
      const numeroSociosControl = this.tipoEmpresaForm.get('numero_socios');
      
      if (value === 'SAC') {
        numeroSociosControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        numeroSociosControl?.clearValidators();
        this.mostrarInputPersonalizado = false;
      }
      
      numeroSociosControl?.updateValueAndValidity();
    });
  }
  
  cambiarTipoInput(esPersonalizado: boolean): void {
    this.mostrarInputPersonalizado = esPersonalizado;
    if (esPersonalizado) {
      this.tipoEmpresaForm.get('numero_socios')?.setValue(null);
    }
  }


  onCustomSociosInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue) {
      this.tipoEmpresaForm.get('numero_socios')?.setValue(parseInt(inputValue, 10));
    }
  }

  siguiente(): void {
    if (this.tipoEmpresaForm.valid) {
      // Guardar datos en localStorage
      const formData = this.tipoEmpresaForm.value;
      localStorage.setItem('step_one_data', JSON.stringify(formData));
      
      console.log('Datos de tipo de empresa guardados:', this.tipoEmpresaForm.value);
      console.log('Ir al siguiente paso');
      // Navegar al siguiente paso (step-two)
      this.router.navigate(['step-two'], { relativeTo: this.route.parent });
    } else {
      this.markFormGroupTouched(this.tipoEmpresaForm);
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