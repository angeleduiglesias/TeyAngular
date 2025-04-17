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
  datosPasoAnterior: any = {};

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
    // Recuperar datos del paso anterior desde localStorage
    const datosGuardados = localStorage.getItem('step_one_data');
    if (datosGuardados) {
      this.datosPasoAnterior = JSON.parse(datosGuardados);
      console.log('Datos recuperados del paso 1:', this.datosPasoAnterior);
    }
  }

  anterior(): void {
    this.router.navigate(['step-one'], { relativeTo: this.route.parent });
  }

  siguiente(): void {
    if (this.actividadesForm.valid) {
      this.enviando = true;
      
      // Combinar datos del paso 1 con los datos actuales
      const datosCombinados = {
        ...this.datosPasoAnterior,
        ...this.actividadesForm.value
      };
      
      // Guardar datos combinados en localStorage
      localStorage.setItem('datos_empresa', JSON.stringify(datosCombinados));
      console.log('Datos combinados guardados:', datosCombinados);
      
        this.router.navigate(['step-three'], { relativeTo: this.route.parent });
    } else {
      // Marca todos los campos como tocados para mostrar errores
      Object.keys(this.actividadesForm.controls).forEach(key => {
        const control = this.actividadesForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
