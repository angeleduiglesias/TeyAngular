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

export interface TramiteReciente {
  id: number;
  nombre_empresa: string;
  nombre_cliente: string;
  fecha_tramite: Date;
  estado_tramite: string;
}

export interface PagosReciente {
  id: number;
  tipo_pago: string;
  nombre_cliente: string;
  monto_pago: number;
  fecha_pago: Date;
}


interface DashboardInformation {
  nombre_admin: string;

  clientes_registrados: number;
  clientes_activos: number;
  tramites_pendientes: number;
  tramites_recientes: TramiteReciente[];
  pagos_recientes: PagosReciente[];
}

@Component({
  selector: 'app-admin-dashboard',
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

  // Variable para el nombre del administrador
  nombre_admin: string = '';

  //Variables para tarjetas de estadisticas
  clientes_registrados: number = 0;
  clientes_activos: number = 0;
  tramites_pendientes: number = 0;

  // Variables para listas
  tramites_recientes: TramiteReciente[] = [];
  pagos_recientes: PagosReciente[] = [];

  // Variable para controlar estado de carga
  cargando: boolean = true;
  error: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;

      this.cargarData();
    });

    // Cargar datos del dashboard desde el backend

  }

  cargarData(): void {

    // Obtener el token de autenticación
    const token = this.authService.getToken();
    // console.log('Token usado en la petición:', token);
    // Configurar headers con el token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    // Realizar la petición al endpoint del dashboard
    this.http.get<DashboardInformation>(`${environment.apiUrl}/api/admin/dashboard`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Datos del dashboard recibidos:', response);

          // Asignar el nombre del administrador al título
          this.nombre_admin = response.nombre_admin || 'Administrador';

          // Asignar datos a las variables del componente
          this.pagos_recientes = response.pagos_recientes || [];
          this.tramites_recientes = response.tramites_recientes || [];

          // Asignar estadísticas
          this.clientes_registrados = response.clientes_registrados || 0;
          this.clientes_activos = response.clientes_activos || 0;
          this.tramites_pendientes = response.tramites_pendientes || 0;

          // Actualizar estado de carga
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
          this.error = 'No se pudieron cargar los datos del dashboard. Por favor, intenta nuevamente.';
          this.cargando = false;

          // Si hay un error de autenticación (401), redirigir al login
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  logout(): void {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
}
