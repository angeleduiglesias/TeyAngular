import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StepOneComponent } from './step-1/step-one.component';
import { StepTwoComponent } from './step-2/step-two.component';

@Component({
  selector: 'app-pre-form',
  imports: [ReactiveFormsModule, StepOneComponent, StepTwoComponent,CommonModule],
  templateUrl: './pre-form.component.html',
  styleUrl: './pre-form.component.css'
})
export class PreFormComponent implements OnInit{
  multiStepForm!: FormGroup;
  currentStep: number = 0; // 0: Paso 1, 1: Paso 2

  public get personalDetails():FormGroup {
    return this.personalDetails.get('personalDetails')as FormGroup;
  }

  public get addressDetails(): FormGroup {
    return this.multiStepForm.get('addressDetails') as FormGroup;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.multiStepForm = this.fb.group({
      personalDetails: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      addressDetails: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required]
      })
    });
  }

  nextStep(): void {
    // Se podria agregar validacion antes de pasar al siguiente paso
    if (this.currentStep < 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitForm(): void {
    if (this.multiStepForm.valid) {
      console.log('Datos del formulario:', this.multiStepForm.value);
      // Aquí se envia la información a laravel
    } else {
      // Se puede agregar lógica de notificación o resaltar errores
      console.error('El formulario contiene errores.');
    }
  }
}
