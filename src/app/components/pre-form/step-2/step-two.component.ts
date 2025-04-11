import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-two',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.css'
})
export class StepTwoComponent implements OnInit {
  actividadesForm: FormGroup;
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.actividadesForm = this.fb.group({
      actividades: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aquí puedes cargar datos previos si es necesario
  }

  anterior(): void {
    this.router.navigate(['step-one'], { relativeTo: this.route.parent });
  }

  siguiente(): void {
    if (this.actividadesForm.valid) {
      this.enviando = true;
      
      // Aquí puedes guardar los datos en un servicio si es necesario
      
      // Simulamos un pequeño retraso para mostrar el estado de "enviando"
      
    } else {
      // Marca todos los campos como tocados para mostrar errores
      Object.keys(this.actividadesForm.controls).forEach(key => {
        const control = this.actividadesForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
