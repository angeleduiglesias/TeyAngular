import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Notary {
  id: number;
  notarioNombre: string;
  nombreCompleto: string;
  telefono: string;
  email: string;
}

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Aquí cargarías los datos reales desde un servicio
    this.loadMockData();
    this.applyFilter();
  }

  loadMockData(): void {
    // Datos de ejemplo para la tabla
    this.notaries = [
      {
        id: 1,
        notarioNombre: 'Notaría Lima Centro',
        nombreCompleto: 'Juan Pérez Rodríguez',
        telefono: '51987654321',
        email: 'juan.perez@notaria.com'
      },
      {
        id: 2,
        notarioNombre: 'Notaría Miraflores',
        nombreCompleto: 'María González López',
        telefono: '51987123456',
        email: 'maria.gonzalez@notaria.com'
      },
      {
        id: 3,
        notarioNombre: 'Notaría San Isidro',
        nombreCompleto: 'Carlos Rodríguez Vargas',
        telefono: '51912345678',
        email: 'carlos.rodriguez@notaria.com'
      },
      {
        id: 4,
        notarioNombre: 'Notaría Surco',
        nombreCompleto: 'Ana Martínez Flores',
        telefono: '51956781234',
        email: 'ana.martinez@notaria.com'
      },
      {
        id: 5,
        notarioNombre: 'Notaría La Molina',
        nombreCompleto: 'Luis Sánchez Torres',
        telefono: '51978563412',
        email: 'luis.sanchez@notaria.com'
      }
    ];
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredNotaries = [...this.notaries];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredNotaries = this.notaries.filter(notary => 
        notary.notarioNombre.toLowerCase().includes(term) ||
        notary.nombreCompleto.toLowerCase().includes(term) ||
        notary.email.toLowerCase().includes(term)
      );
    }
    
    // Calcular páginas
    this.totalPages = Math.ceil(this.filteredNotaries.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Aplicar paginación
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredNotaries = this.filteredNotaries.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilter();
  }


  editNotary(notary: Notary): void {
    // Implementar lógica para editar cliente
    console.log('Editar cliente:', notary);
    // this.router.navigate(['/admin/clientes/editar', client.id]);
  }

  deleteNotary(id: number): void {
    // Implementar lógica para eliminar cliente
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      console.log('Eliminar cliente con ID:', id);
      this.notaries = this.notaries.filter(notary => notary.id !== id);
      this.applyFilter();
    }
  }

  viewNotaryDetails(id: number): void {
    // Implementar lógica para ver detalles del cliente
    console.log('Ver detalles del cliente con ID:', id);
    // this.router.navigate(['/admin/clientes/detalles', id]);
  }
}