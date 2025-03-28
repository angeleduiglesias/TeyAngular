import { Component } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';
import { PreguntasComponent } from './preguntas/preguntas.component';

@Component({
  selector: 'app-home',
  imports: [
    BannerComponent,
    ProcesosComponent,
    ServiciosComponent,
    BeneficiosComponent,
    PreguntasComponent
  ],
  template: `
    <app-banner></app-banner>
    <app-procesos></app-procesos>
    <app-servicios></app-servicios>
    <app-beneficios></app-beneficios>
    <app-preguntas></app-preguntas>
  `
})
export class HomeComponent {}