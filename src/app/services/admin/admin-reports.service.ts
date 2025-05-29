import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';

// Interfaces para los datos de estadísticas
export interface CompanyStatistics {
  rubro: string;
  tipoEmpresa: string;
  ubicacion: string;
  cantidad: number;
  porcentaje: string;
  tendencia: string;
  fechaActualizacion: string;
}

// Interfaces para los datos financieros
export interface FinancialData {
  mes: string;
  ingresos: number;
  gastos: number;
  ganancia: number;
  margenBeneficio: string;
  comparativoAnterior: string;
  principalFuenteIngreso: string;
  principalGasto: string;
}

// Interfaces para datos de gráficos
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

// Interface para datos geográficos
export interface GeographicData {
  region: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminReportsService {
  private apiUrl = `${environment.apiUrl}api/admin/reports`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Obtener estadísticas de empresas
  getCompanyStatistics(): Observable<CompanyStatistics[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<CompanyStatistics[]>(`${this.apiUrl}/company-statistics`, { headers })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          console.error('Error obteniendo estadísticas de empresas:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener datos financieros
  getFinancialData(): Observable<FinancialData[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<FinancialData[]>(`${this.apiUrl}/financial-data`, { headers })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          console.error('Error obteniendo datos financieros:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener datos para el gráfico de ingresos
  getIncomeChartData(): Observable<ChartData> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChartData>(`${this.apiUrl}/income-chart`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error obteniendo datos para el gráfico de ingresos:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener datos para el gráfico de tipos de empresas
  getCompanyTypeChartData(): Observable<ChartData> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChartData>(`${this.apiUrl}/company-type-chart`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error obteniendo datos para el gráfico de tipos de empresas:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener datos para el gráfico de tendencia mensual de ingresos
  getIncomeMonthlyTrendChartData(): Observable<ChartData> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChartData>(`${this.apiUrl}/income-monthly-trend-chart`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error obteniendo datos para el gráfico de tendencia mensual de ingresos:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener datos para el gráfico de distribución geográfica
  getGeographicDistributionChartData(): Observable<ChartData> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChartData>(`${this.apiUrl}/geographic-distribution-chart`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error obteniendo datos para el gráfico de distribución geográfica:', error);
          return throwError(() => error);
        })
      );
  }

  // Método para obtener datos de prueba mientras se implementa el backend
  getMockCompanyStatistics(): CompanyStatistics[] {
    return [
      { 
        rubro: 'Tecnología y Telecomunicaciones', 
        tipoEmpresa: 'Sociedad de Responsabilidad Limitada (SRL)', 
        ubicacion: 'Lima Metropolitana', 
        cantidad: 25,
        porcentaje: '31.25%',
        tendencia: 'Creciente',
        fechaActualizacion: '15/06/2023'
      },
      { 
        rubro: 'Comercio Minorista y Mayorista', 
        tipoEmpresa: 'Sociedad Anónima Cerrada (SAC)', 
        ubicacion: 'Arequipa Centro', 
        cantidad: 18,
        porcentaje: '22.50%',
        tendencia: 'Estable',
        fechaActualizacion: '15/06/2023'
      },
      { 
        rubro: 'Servicios Profesionales', 
        tipoEmpresa: 'Empresa Individual de Responsabilidad Limitada (EIRL)', 
        ubicacion: 'Trujillo', 
        cantidad: 12,
        porcentaje: '15.00%',
        tendencia: 'Creciente',
        fechaActualizacion: '15/06/2023'
      },
      { 
        rubro: 'Manufactura e Industria', 
        tipoEmpresa: 'Sociedad Anónima (SA)', 
        ubicacion: 'Cusco', 
        cantidad: 8,
        porcentaje: '10.00%',
        tendencia: 'Decreciente',
        fechaActualizacion: '15/06/2023'
      },
      { 
        rubro: 'Construcción e Inmobiliaria', 
        tipoEmpresa: 'Sociedad Anónima Cerrada (SAC)', 
        ubicacion: 'Lima Norte', 
        cantidad: 15,
        porcentaje: '18.75%',
        tendencia: 'Estable',
        fechaActualizacion: '15/06/2023'
      }
    ];
  }

  // Método para obtener datos financieros de prueba
  getMockFinancialData(): FinancialData[] {
    return [
      { 
        mes: 'Enero 2023', 
        ingresos: 15000, 
        gastos: 8000, 
        ganancia: 7000,
        margenBeneficio: '46.67%',
        comparativoAnterior: '+15%',
        principalFuenteIngreso: 'Constitución de SAC',
        principalGasto: 'Servicios notariales'
      },
      { 
        mes: 'Febrero 2023', 
        ingresos: 18000, 
        gastos: 9500, 
        ganancia: 8500,
        margenBeneficio: '47.22%',
        comparativoAnterior: '+21.43%',
        principalFuenteIngreso: 'Constitución de SRL',
        principalGasto: 'Servicios legales'
      },
      { 
        mes: 'Marzo 2023', 
        ingresos: 22000, 
        gastos: 10000, 
        ganancia: 12000,
        margenBeneficio: '54.55%',
        comparativoAnterior: '+41.18%',
        principalFuenteIngreso: 'Constitución de SAC',
        principalGasto: 'Servicios notariales'
      },
      { 
        mes: 'Abril 2023', 
        ingresos: 19500, 
        gastos: 9800, 
        ganancia: 9700,
        margenBeneficio: '49.74%',
        comparativoAnterior: '-19.17%',
        principalFuenteIngreso: 'Constitución de EIRL',
        principalGasto: 'Servicios legales'
      },
      { 
        mes: 'Mayo 2023', 
        ingresos: 23500, 
        gastos: 11200, 
        ganancia: 12300,
        margenBeneficio: '52.34%',
        comparativoAnterior: '+26.80%',
        principalFuenteIngreso: 'Constitución de SAC',
        principalGasto: 'Servicios notariales'
      }
    ];
  }

  // Método para obtener datos de gráfico de ingresos de prueba
  getMockIncomeChartData(): ChartData {
    return {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      datasets: [
        {
          label: 'Ingresos',
          data: [1200, 1900, 3000, 5000, 2000, 3000, 500],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(54, 162, 235, 0.7)'
          ],
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Gastos',
          data: [800, 1200, 1500, 2200, 1800, 1000, 300],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Ganancia',
          data: [400, 700, 1500, 2800, 200, 2000, 200],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  // Método para obtener datos de gráfico de tipos de empresas de prueba
  getMockCompanyTypeChartData(): ChartData {
    return {
      labels: ['SAC', 'SRL', 'EIRL', 'SA', 'Otros'],
      datasets: [
        {
          label: 'Tipos de Empresas',
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    };
  }

  // Método para obtener datos de gráfico de tendencia mensual de ingresos de prueba
  getMockIncomeMonthlyTrendChartData(): ChartData {
    return {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [
        {
          label: 'Ingresos 2023',
          data: [15000, 18000, 22000, 19500, 23500, 25000, 27000, 26000, 28000, 30000, 32000, 35000],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Ingresos 2022',
          data: [12000, 14000, 16000, 15000, 18000, 20000, 22000, 21000, 23000, 24000, 26000, 28000],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  // Método para obtener datos de gráfico de distribución geográfica de prueba
  getMockGeographicDistributionChartData(): ChartData {
    return {
      labels: ['Lima Metropolitana', 'Arequipa', 'Trujillo', 'Cusco', 'Piura', 'Chiclayo'],
      datasets: [
        {
          label: 'Distribución Geográfica',
          data: [45, 18, 12, 10, 8, 7],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    };
  }

  // Método privado para obtener los headers con el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}