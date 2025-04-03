import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-step-one',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.css'
})
export class StepOneComponent implements OnInit {
  datosPersonalesForm: FormGroup;
  enviando = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private formDataService: FormDataService
  ) {
    this.datosPersonalesForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]]
    });
  }

  ngOnInit(): void {}

  siguiente(): void {
    if (this.datosPersonalesForm.valid) {
      this.enviando = true;
      this.error = '';
      
      this.formDataService.enviarDatosPersonales(this.datosPersonalesForm.value)
        .subscribe({
          next: (response) => {
            console.log('Datos personales guardados:', response);
            this.enviando = false;
            // Navega a la ruta hija "step-two" relativa al componente padre
            this.router.navigate(['step-two'], { relativeTo: this.route.parent });
          },
          error: (error) => {
            console.error('Error al guardar datos:', error);
            this.enviando = false;
            this.error = 'Ocurrió un error al guardar los datos. Por favor, intenta nuevamente.';
          }
        });
    } else {
      this.markFormGroupTouched(this.datosPersonalesForm);
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