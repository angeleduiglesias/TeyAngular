import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminPaymentsService, Payments } from '../../../app/services/admin/admin-payments.service';
import { AuthService } from '../../../app/services/auth-service';

@Component({
  selector: 'app-admin-payments',
  templateUrl: './admin-payments.component.html',
  styleUrls: ['./admin-payments.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminPaymentsComponent implements OnInit {
  payments: Payments[] = [];
  filteredPayments: Payments[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Variables para control de carga
  loading: boolean = false;
  error: string = '';

  // Variables para ordenamiento
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

    // Variables para filtros
  selectedPaymentsFilter: string = '';

  constructor(
    private router: Router,
    private adminPaymentsService: AdminPaymentsService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadpayments();
    this.applyFilter();
  }

  loadpayments(): void {
    //Datos traidos desde el backend
    this.loading = true;
    this.error = '';

    // Datos de prueba según la interfaz Payments
    const datosPrueba: Payments[] = [
      
    ];

    // Opción 2: Intentar obtener datos del backend, y si falla, usar datos de prueba
    this.adminPaymentsService.getPayments()
    .subscribe({
      next: (response) => {
        this.payments = response;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
        this.error = 'No se pudieron cargar los pagos. Por favor, intenta nuevamente.';
        
        // Usar datos de prueba en caso de error
        console.log('Usando datos de prueba debido al error');
        this.payments = datosPrueba;
        this.applyFilter();
        this.loading = false;
        
        // Si hay un error de autenticación (401), redirigir al login
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  applyFilter(): void {
    // Primero aplicamos todos los filtros a una copia de los datos originales
    let tempFiltered = [...this.payments];
    
    // Aplicar filtro por estado si está seleccionado
    if (this.selectedPaymentsFilter) {
      tempFiltered = tempFiltered.filter(payment => 
        payment.tipo_pago.toLowerCase() === this.selectedPaymentsFilter.toLowerCase()
      );
    }
    
    // Aplicar filtro de búsqueda por texto
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tempFiltered = tempFiltered.filter(payment => 
        payment.nombre_cliente.toLowerCase().includes(term) ||
        payment.dni.includes(term) ||
        payment.tipo_pago.toLowerCase().includes(term)
      );
    }
    
    // Guardar el total de resultados filtrados antes de la paginación
    const totalFilteredItems = tempFiltered.length;
    
    // Aplicar ordenamiento si existe
    if (this.sortColumn) {
      tempFiltered.sort((a: any, b: any) => {
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
    
    // Calcular páginas
    this.totalPages = Math.ceil(totalFilteredItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Aplicar paginación
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredPayments = tempFiltered.slice(startIndex, startIndex + this.itemsPerPage);
  }

   // Métodos de filtrado
   filterByPayment(paymentType: string): void {
    this.selectedPaymentsFilter = paymentType;
    this.currentPage = 1;
    this.applyFilter();
  }
    sortTable(column: string): void {
    if (this.sortColumn === column) {
      // Si ya estamos ordenando por esta columna, cambiamos la dirección
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es una nueva columna, establecemos la dirección a ascendente
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilter();
  }

  sortData(): void {
    if (!this.sortColumn) return;
    
    this.filteredPayments.sort((a: any, b: any) => {
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

  // Añadir estas propiedades a la clase
  showPaymentsModal = false;
  selectedPayments: any = null;
  
  // Modificar el método existente
  viewPaymentsDetails(id: number): void {
    // Buscar el cliente por ID
    const payments = this.filteredPayments.find(p => p.id === id);
    if (payments) {
      this.selectedPayments = this.payments;
      this.showPaymentsModal = true;
    }
  }
  
  // Añadir estos nuevos métodos
  closePaymentsModal(): void {
    this.showPaymentsModal = false;
    this.selectedPayments = null;
  }
  // Agregar estas propiedades para el modal
  showPaymentModal: boolean = false;
  selectedPayment: Payments | null = null;
  
  // Actualizar estos métodos
  viewPaymentDetails(id: number): void {
    this.selectedPayment = this.payments.find(payment => payment.id === id) || null;
    this.showPaymentModal = true;
  }
  
  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPayment = null;
  }
  
  editPayment(id: number): void {
    console.log('Editar pago con ID:', id);
    // Implementar lógica de edición
  }

  getStatusClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'completado':
      case 'pagado':
        return 'status-completed';
      case 'pendiente':
        return 'status-pending';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getPaymentMethodClass(forma: string): string {
    switch (forma.toLowerCase()) {
      case 'tarjeta de crédito':
      case 'tarjeta de débito':
        return 'method-credit-card';
      case 'transferencia':
        return 'method-transfer';
      case 'efectivo':
        return 'method-cash';
      default:
        return 'method-default';
    }
  }
}