import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminTramitesService, Tramites } from '../../../app/services/admin/admin-tramites.service';
import { AuthService } from '../../../app/services/auth-service';

@Component({
  selector: 'app-admin-tramites',
  templateUrl: './admin-tramites.component.html',
  styleUrls: ['./admin-tramites.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminTramitesComponent implements OnInit {
  tramites: Tramites[] = [];
  filteredTramites: Tramites[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  
  // Variables para control de carga
  loading: boolean = false;
  error: string = '';

  // Variables para ordenamiento
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Variables para modal
  showTramiteModal = false;
  selectedTramite: Tramites | null = null;

  // Variables para filtros
  selectedStatusFilter: string = '';
  selectedPaymentFilter: string = '';

  constructor(
    private router: Router,
    private adminTramitesService: AdminTramitesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadtramites();
  }

  loadtramites(): void {
    this.loading = true;
    this.error = '';

    // Datos de prueba ampliados según la interfaz Tramites
    const datosPrueba: Tramites[] = [
      {
        id: 1,
        nombre_cliente: 'Juan Pérez',
        fecha_inicio: new Date('2023-01-15'),
        fecha_fin: new Date('2023-02-15'),
        estado_tramite: 'Completado',
        nombre_empresa: 'Empresa ABC S.A.C.',
        estado_pago: 'pagado'
      },
      {
        id: 2,
        nombre_cliente: 'María López',
        fecha_inicio: new Date('2023-02-10'),
        fecha_fin: new Date('2023-03-10'),
        estado_tramite: 'En proceso',
        nombre_empresa: 'Comercial XYZ E.I.R.L.',
        estado_pago: 'pendiente'
      },
      {
        id: 3,
        nombre_cliente: 'Carlos Rodríguez',
        fecha_inicio: new Date('2023-03-05'),
        fecha_fin: null,
        estado_tramite: 'Iniciado',
        nombre_empresa: 'Inversiones 123 S.R.L.',
        estado_pago: 'pagado'
      },
      {
        id: 4,
        nombre_cliente: 'Ana Martínez',
        fecha_inicio: new Date('2023-04-20'),
        fecha_fin: null,
        estado_tramite: 'En proceso',
        nombre_empresa: 'Servicios Integrales S.A.',
        estado_pago: 'pendiente'
      },
      {
        id: 5,
        nombre_cliente: 'Roberto Gómez',
        fecha_inicio: new Date('2023-05-12'),
        fecha_fin: new Date('2023-06-12'),
        estado_tramite: 'Completado',
        nombre_empresa: 'Constructora Lima S.A.C.',
        estado_pago: 'pagado'
      },
      {
        id: 6,
        nombre_cliente: 'Laura Sánchez',
        fecha_inicio: new Date('2023-06-08'),
        fecha_fin: null,
        estado_tramite: 'Cancelado',
        nombre_empresa: 'Consultoría Legal E.I.R.L.',
        estado_pago: 'cancelado'
      }
    ];


    // Opción 2: Intentar obtener datos del backend, y si falla, usar datos de prueba
    this.adminTramitesService.getTramites()
    .subscribe({
      next: (response) => {
        this.tramites = response;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tramites:', error);
        this.error = 'No se pudieron cargar los trámites. Por favor, intenta nuevamente.';
        
        // Usar datos de prueba en caso de error
        console.log('Usando datos de prueba debido al error');
        this.tramites = datosPrueba;
        this.applyFilter();
        this.loading = false;
        
        // Si hay un error de autenticación (401), redirigir al login
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // Métodos de filtrado
  filterByStatus(status: string): void {
    this.selectedStatusFilter = status;
    this.currentPage = 1;
    this.applyFilter();
  }

  // Modificar el método applyFilter para eliminar la referencia al filtro de pago
  applyFilter(): void {
    let filtered = [...this.tramites];
  
    // Aplicar búsqueda por texto
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(tramite => 
        tramite.nombre_cliente.toLowerCase().includes(term) ||
        tramite.nombre_empresa.toLowerCase().includes(term) ||
        tramite.estado_tramite.toLowerCase().includes(term) ||
        tramite.estado_pago.toLowerCase().includes(term)
      );
    }
  
    // Aplicar filtro por estado del trámite
    if (this.selectedStatusFilter) {
      filtered = filtered.filter(tramite => 
        tramite.estado_tramite.toLowerCase() === this.selectedStatusFilter.toLowerCase()
      );
    }
  
    this.filteredTramites = filtered;
    
    // Aplicar ordenamiento si existe
    this.sortData();
    
    // Calcular páginas
    this.totalPages = Math.ceil(this.filteredTramites.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Aplicar paginación
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredTramites = this.filteredTramites.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilter();
  }

  sortData(): void {
    if (!this.sortColumn) return;
    
    this.filteredTramites.sort((a: any, b: any) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];
      
      if (typeof valueA === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return this.sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = valueA - valueB;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilter();
  }

  viewTramiteDetails(id: number): void {
    this.selectedTramite = this.tramites.find(tramite => tramite.id === id) || null;
    this.showTramiteModal = true;
  }
  
  closeTramiteModal(): void {
    this.showTramiteModal = false;
    this.selectedTramite = null;
  }
  
  getStatusClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'finalizado':
        return 'status-completed';
      case 'en proceso':
      case 'en progreso':
        return 'status-in-progress';
      case 'iniciado':
      case 'pendiente':
        return 'status-pending';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getPaymentStatusClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pagado':
      case 'completado':
        return 'payment-paid';
      case 'pendiente':
        return 'payment-pending';
      case 'cancelado':
        return 'payment-cancelled';
      default:
        return 'payment-default';
    }
  }
}