import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClienteNavbarComponent } from './nav-bar/cliente-navbar-component';
import { AuthService } from '../../app/services/auth-service';

interface Notificacion {
  id: number;
  mensaje: string;
  fecha: Date;
  leida: boolean;
}

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, ClienteNavbarComponent],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit {
  // Datos del usuario
  userData: any = null;
  
  // Control de pestañas
  activeTab: string = 'tramite';
  
  // Notificaciones
  notificaciones: Notificacion[] = [
    {
      id: 1,
      mensaje: 'Bienvenido al sistema de gestión de trámites.',
      fecha: new Date(),
      leida: false
    }
  ];
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
    });
  }
  
  // Métodos para navegación de pestañas
  changeTab(tab: string): void {
    this.activeTab = tab;
    
    // Navegar a la ruta correspondiente
    switch(tab) {
      case 'tramite':
        this.router.navigate(['/cliente/dashboard']);
        break;
      case 'configuracion':
        this.router.navigate(['/cliente/configuracion']);
        break;
      case 'notificaciones':
        this.router.navigate(['/cliente/notificaciones']);
        break;
      default:
        this.router.navigate(['/cliente/dashboard']);
    }
  }

  logout(): void {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
}