import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';
import { TramiteReciente, PagosReciente, ReservaNombre } from '../../../pages/admin/dashboard/admin-dashboard-component';

export interface DashboardInformation {
  nombre_admin: string;
  clientes_registrados: number;
  clientes_activos: number;
  tramites_pendientes: number;
  tramites_recientes: TramiteReciente[];
  pagos_recientes: PagosReciente[];
  reserva_nombre: ReservaNombre[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  // Observable cacheado
  private dashboardCache$!: Observable<DashboardInformation>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getDashboardData(): Observable<DashboardInformation> {
    if (!this.dashboardCache$) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      this.dashboardCache$ = this.http
        .get<DashboardInformation>(`${environment.apiUrl}/api/admin/dashboard`, { headers })
        .pipe(
          map(response => ({
            nombre_admin: response.nombre_admin || 'admin',
            pagos_recientes: response.pagos_recientes || [],
            tramites_recientes: response.tramites_recientes || [],
            clientes_registrados: response.clientes_registrados || 0,
            clientes_activos: response.clientes_activos || 0,
            tramites_pendientes: response.tramites_pendientes || 0,
            reserva_nombre: response.reserva_nombre || []
          })),
          shareReplay(1),    // cachear última emisión
          catchError(error => {
            console.error('Error en AdminDashboardService:', error);
            return throwError(() => error);
          })
        );
    }
    return this.dashboardCache$;
  }
}
