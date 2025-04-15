import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
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
  title = 'Tey';
  mostrarFooter = false; // Inicialmente oculto
  mostrarHeader = false; // Inicialmente oculto
  cargaInicial = true;   // Indicador de carga inicial

  constructor(private router: Router) {
    // Verificar la ruta actual al inicio
    this.verificarRuta(this.router.url);
    
    // Suscribirse a cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.verificarRuta(event.url);
      }
    });
    
    // Marcar como cargado después de un breve retraso
    setTimeout(() => {
      this.cargaInicial = false;
    }, 100);
  }
  
  private verificarRuta(rutaActual: string): void {
    // Ocultar el footer y el header en rutas específicas
    const esRutaPreForm = rutaActual.startsWith('/pre-form');
    const esRutaLogin = rutaActual.startsWith('/login');
    const esRutaAdmin = rutaActual.includes('/admin');
    const esRutaLogout = rutaActual.includes('/logout');
    
    this.mostrarFooter = !(esRutaPreForm || esRutaLogin || esRutaAdmin || esRutaLogout);
    this.mostrarHeader = !(esRutaPreForm || esRutaLogin || esRutaAdmin || esRutaLogout);
  }
}

