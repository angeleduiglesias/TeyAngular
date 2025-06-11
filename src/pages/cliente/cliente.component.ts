import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ClienteNavbarComponent } from './nav-bar/cliente-navbar-component';
import { AuthService } from '../../app/services/auth-service';
import { ClienteNombreService } from '../../app/services/cliente/cliente-nombre.service';
import { ClienteDashboardService } from '../../app/services/cliente/cliente-dashboard.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, RouterModule, ClienteNavbarComponent],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  // Datos del usuario
  userData: any = null;
  
  // Control de pestañas
  activeTab: string = 'tramite';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private clienteNombreService: ClienteNombreService,
    private ClienteDashboardService: ClienteDashboardService
  ) {}

  ngOnInit(): void {
    // Detectar la pestaña activa basada en la ruta actual
    this.detectActiveTabFromRoute();
    
    // Escuchar cambios de ruta para actualizar la pestaña activa
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.detectActiveTabFromRoute();
    });

    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;

      this.ClienteDashboardService.getDashboardData().subscribe({
        next: (data) => {
          this.clienteNombreService.setNombre(data.nombre_cliente);
        }
      });
    });
  }
  
  // Método para detectar la pestaña activa basada en la ruta actual
  private detectActiveTabFromRoute(): void {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/cliente/dashboard')) {
      this.activeTab = 'tramite';
    } else if (currentUrl.includes('/cliente/configuracion')) {
      this.activeTab = 'configuracion';
    } else if (currentUrl.includes('/cliente/documentos')) {
      this.activeTab = 'documentos';
    } else if (currentUrl.includes('/cliente/citas')) {
      this.activeTab = 'citas';
    } else {
      // Por defecto, si no coincide con ninguna ruta específica
      this.activeTab = 'tramite';
    }
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
      case 'documentos':
        this.router.navigate(['/cliente/documentos']);
        break;
      case 'citas':
        this.router.navigate(['/cliente/citas']);
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