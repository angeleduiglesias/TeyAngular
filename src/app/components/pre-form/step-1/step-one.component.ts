import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-step-one',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.css'
})
export class StepOneComponent implements OnInit {
  datosPersonalesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.datosPersonalesForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]]
    });
  }

  ngOnInit(): void {}

  siguiente(): void {
    if (this.datosPersonalesForm.valid) {
      console.log('Datos personales guardados:', this.datosPersonalesForm.value);
      // Navega a la ruta hija "step-two" relativa al componente padre (PreFormComponent)
      this.router.navigate(['step-two'], { relativeTo: this.route.parent });
    } else {
      this.markFormGroupTouched(this.datosPersonalesForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}