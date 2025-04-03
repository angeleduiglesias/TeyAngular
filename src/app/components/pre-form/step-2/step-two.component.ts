import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-step-two',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.css'
})
export class StepTwoComponent implements OnInit {
  tipoEmpresaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tipoEmpresaForm = this.fb.group({
      tipoEmpresa: ['', Validators.required],
      nombreEmpresa: ['', Validators.required],
      actividadEmpresarial: ['', Validators.required]
      
    });
  }

  ngOnInit(): void {}

  anterior(): void {
    this.router.navigate(['step-one'], { relativeTo: this.route.parent });
  }

  siguiente(): void {
    if (this.tipoEmpresaForm.valid) {
      console.log('Datos de tipo de empresa guardados:', this.tipoEmpresaForm.value);
      console.log('Ir al siguiente paso');
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
