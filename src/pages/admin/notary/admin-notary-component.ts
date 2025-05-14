import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminNotaryService, Notary } from '../../../app/services/admin/admin-notary.service';
import { AuthService } from '../../../app/services/auth-service';

@Component({
  selector: 'app-admin-notary',
  templateUrl: './admin-notary-component.html',
  styleUrls: ['./admin-notary-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminNotaryComponent implements OnInit {
  notaries: Notary[] = [];
  filteredNotaries: Notary[] = [];
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
    private adminNotaryService: AdminNotaryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Cargar datos desde el servicio
    this.loadNotaries();
  }

  loadNotaries(): void {
    this.loading = true;
    this.error = '';

    this.adminNotaryService.getNotaries()
      .subscribe({
        next: (response) => {
          this.notaries = response;
          this.applyFilter();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar notarios:', error);
          this.error = 'No se pudieron cargar los notarios. Por favor, intenta nuevamente.';
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
      this.filteredNotaries = [...this.notaries];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredNotaries = this.notaries.filter(notary => 
        notary.nombre.toLowerCase().includes(term) ||
        notary.apellidos.toLowerCase().includes(term) ||
        notary.email.toLowerCase().includes(term)
      );
    }
    
    // Aplicar ordenamiento si existe
    this.sortData();
    
    // Calcular páginas
    this.totalPages = Math.ceil(this.filteredNotaries.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Aplicar paginación
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredNotaries = this.filteredNotaries.slice(startIndex, startIndex + this.itemsPerPage);
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
    
    this.filteredNotaries.sort((a: any, b: any) => {
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

  editNotary(notary: Notary): void {
    // Implementar lógica para editar notario
    console.log('Editar notario:', notary);
    // this.router.navigate(['/admin/notarios/editar', notary.id]);
  }

  deleteNotary(id: number): void {
    // Implementar lógica para eliminar notario
    if (confirm('¿Estás seguro de que deseas eliminar este notario?')) {
      this.adminNotaryService.deleteNotary(id)
        .subscribe({
          next: () => {
            console.log('Notario eliminado con éxito:', id);
            this.notaries = this.notaries.filter(notary => notary.id !== id);
            this.applyFilter();
          },
          error: (error) => {
            console.error('Error al eliminar notario:', error);
            alert('No se pudo eliminar el notario. Por favor, intenta nuevamente.');
          }
        });
    }
  }

  viewNotaryDetails(id: number): void {
    // Implementar lógica para ver detalles del notario
    console.log('Ver detalles del notario con ID:', id);
    // this.router.navigate(['/admin/notarios/detalles', id]);
  }
}