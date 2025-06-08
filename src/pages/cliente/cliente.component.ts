import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClienteNavbarComponent } from './nav-bar/cliente-navbar-component';
import { AuthService } from '../../app/services/auth-service';
import { ClienteNombreService } from '../../app/services/cliente/cliente-nombre.service';
import { ClienteDashboardService } from '../../app/services/cliente/cliente-dashboard.service';

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