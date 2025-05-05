import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Client {
  id: number;
  nombre: string;
  dni: string;
  tipoEmpresa: string;
  progreso: number;
  pago1: boolean;
  pago2: boolean;
  telefono: string;
  email: string;
}

@Component({
  selector: 'app-admin-client',
  templateUrl: './admin-client-component.html',
  styleUrls: ['./admin-client-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminClientComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Variables para ordenamiento
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Aquí cargarías los datos reales desde un servicio
    this.loadMockData();
    this.applyFilter();
  }

  loadMockData(): void {
    // Datos de ejemplo para la tabla
    this.clients = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        dni: '12345678',
        tipoEmpresa: 'SAC',
        progreso: 75,
        pago1: true,
        pago2: false,
        telefono: '51987654321',
        email: 'juan.perez@example.com'
      },
      {
        id: 2,
        nombre: 'María González',
        dni: '87654321',
        tipoEmpresa: 'EIRL',
        progreso: 100,
        pago1: true,
        pago2: true,
        telefono: '51987123456',
        email: 'maria.gonzalez@example.com'
      },
      {
        id: 3,
        nombre: 'Carlos Rodríguez',
        dni: '45678912',
        tipoEmpresa: 'SAC',
        progreso: 30,
        pago1: true,
        pago2: false,
        telefono: '51912345678',
        email: 'carlos.rodriguez@example.com'
      },
      {
        id: 4,
        nombre: 'Ana Martínez',
        dni: '78912345',
        tipoEmpresa: 'SRL',
        progreso: 50,
        pago1: false,
        pago2: false,
        telefono: '51956781234',
        email: 'ana.martinez@example.com'
      },
      {
        id: 5,
        nombre: 'Luis Sánchez',
        dni: '32165498',
        tipoEmpresa: 'SAC',
        progreso: 90,
        pago1: true,
        pago2: true,
        telefono: '51978563412',
        email: 'luis.sanchez@example.com'
      }
    ];
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(client => 
        client.nombre.toLowerCase().includes(term) ||
        client.dni.includes(term) ||
        client.tipoEmpresa.toLowerCase().includes(term)
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

  editClient(client: Client): void {
    // Implementar lógica para editar cliente
    console.log('Editar cliente:', client);
    // this.router.navigate(['/admin/clientes/editar', client.id]);
  }

  deleteClient(id: number): void {
    // Implementar lógica para eliminar cliente
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      console.log('Eliminar cliente con ID:', id);
      this.clients = this.clients.filter(client => client.id !== id);
      this.applyFilter();
    }
  }

  viewClientDetails(id: number): void {
    // Implementar lógica para ver detalles del cliente
    console.log('Ver detalles del cliente con ID:', id);
    // this.router.navigate(['/admin/clientes/detalles', id]);
  }
}