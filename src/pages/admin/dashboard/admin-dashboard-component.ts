import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Importar componentes
import { StatCardComponent } from './stat-card/stat-card.component';
import { TramitesRecientesComponent } from './tramites-recientes/tramites-recientes.component';
import { PagosRecientesComponent } from './pagos-recientes/pagos-recientes.component';
import { ActividadRecienteComponent } from './actividad-reciente/actividad-reciente.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    TramitesRecientesComponent,
    PagosRecientesComponent,
    ActividadRecienteComponent
  ],
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css']
})
export class AdminDashboardComponent implements OnInit {
  userData: any = null;
  totalUsuarios: number = 0;
  tramitesPendientes: number = 0;
  clientesActivos: number = 0;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
    });
    
    // Cargar estadísticas (simuladas por ahora)
    this.cargarEstadisticas();
  }
  
  cargarEstadisticas(): void {
    // Aquí se cargarían los datos reales desde un servicio
    this.totalUsuarios = 125;
    this.tramitesPendientes = 18;
    this.clientesActivos = 87;
  }
    
  logout(): void {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
}