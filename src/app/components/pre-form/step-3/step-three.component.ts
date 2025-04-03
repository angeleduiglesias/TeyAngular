import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-step-three',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.css',
  standalone: true
})
export class StepThreeComponent implements OnInit {
  confirmacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.confirmacionForm = this.fb.group({
      terminosCondiciones: [false, Validators.requiredTrue],
      politicaPrivacidad: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {}

  anterior(): void {
    this.router.navigate(['step-two'], { relativeTo: this.route.parent });
  }

  enviar(): void {
    if (this.confirmacionForm.valid) {
      console.log('Formulario enviado correctamente');
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      alert('¡Gracias! Tu solicitud ha sido enviada correctamente.');
      // Redirigir al home o a una página de confirmación
      this.router.navigate(['/']);
    } else {
      this.markFormGroupTouched(this.confirmacionForm);
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