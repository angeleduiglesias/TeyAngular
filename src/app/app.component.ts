import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { BannerComponent } from "./components/banner/banner.component";
import { ProcesosComponent } from "./components/procesos/procesos.component";
import { ServiciosComponent } from "./components/servicios/servicios.component";
import { BeneficiosComponent } from "./components/beneficios/beneficios.component";
import { PreguntasComponent } from "./components/preguntas/preguntas.component";
import { FooterComponent } from "./components/footer/footer.component";
import { PreFormComponent } from "./components/pre-form/pre-form.component";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, BannerComponent, ProcesosComponent, ServiciosComponent, BeneficiosComponent, PreguntasComponent, FooterComponent, PreFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), 
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Tu Empresa Ya';

  mostrarFormulario: boolean = false;
  Login: boolean = true;

  mostrarComponentLogin(){
    this.Login = !this.Login;
  }

  recibirEventoDesdeHeader() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}
