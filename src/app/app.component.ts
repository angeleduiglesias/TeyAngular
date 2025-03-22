import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { BannerComponent } from "./components/banner/banner.component";
import { ProcesosComponent } from "./components/procesos/procesos.component";
import { ServiciosComponent } from "./components/servicios/servicios.component";
import { BeneficiosComponent } from "./components/beneficios/beneficios.component";
import { PreguntasComponent } from "./components/preguntas/preguntas.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, BannerComponent, ProcesosComponent, ServiciosComponent, BeneficiosComponent, PreguntasComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tu Empresa Ya';
}
