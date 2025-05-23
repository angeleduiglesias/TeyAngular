import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminClientService, Client } from '../../../app/services/admin/admin-client.service';
import { AuthService } from '../../../app/services/auth-service';

@Component({
  selector: 'app-admin-client',
  templateUrl: './admin-client-component.html',
  styleUrls: ['./admin-client-component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminClientComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
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

  constructor(
    private router: Router,
    private adminClientService: AdminClientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.applyFilter();
  }

  loadClients(): void {
    //Datos traidos desde el backend
    this.loading = true;
    this.error = '';

    this.adminClientService.getClients()
    .subscribe({
      next: (response) => {
        this.clients = response;
        this.applyFilter();
        this.loading = false;
      },
        error: (error) => {
          console.error('Error al cargar clientes:', error);
          this.error = 'No se pudieron cargar los clientes. Por favor, intenta nuevamente.';
          this.loading = false;
          
          // Si hay un error de autenticación (401), redirigir al login
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(client => 
        client.nombre_cliente.toLowerCase().includes(term) ||
        client.dni.includes(term) ||
        client.tipo_empresa.toLowerCase().includes(term)
      );
    }
    
    // Aplicar ordenamiento si existe
    this.sortData();
    
    // Calcular páginas
    this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Aplicar paginación
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredClients = this.filteredClients.slice(startIndex, startIndex + this.itemsPerPage);
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
    
    this.filteredClients.sort((a: any, b: any) => {
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
  showClientModal = false;
  selectedClient: any = null;
  
  // Modificar el método existente
  viewClientDetails(id: number): void {
    // Buscar el cliente por ID
    const client = this.filteredClients.find(c => c.id === id);
    if (client) {
      this.selectedClient = client;
      this.showClientModal = true;
    }
  }
  
  // Añadir estos nuevos métodos
  closeClientModal(): void {
    this.showClientModal = false;
    this.selectedClient = null;
  }
  
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'activo':
        return 'status-active';
      case 'pendiente':
        return 'status-pending';
      case 'inactivo':
        return 'status-inactive';
      default:
        return '';
    }
  }
  
  contactClient(method: string, contact: string): void {
    if (!contact) return;
    
    if (method === 'whatsapp') {
      window.open(`https://wa.me/${contact}`, '_blank');
    } else if (method === 'email') {
      window.open(`mailto:${contact}`, '_blank');
    }
  }
}