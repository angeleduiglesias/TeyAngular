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

  // Variables para el modal de creación
  showCreateModal: boolean = false;
  newNotary: Notary = {
    id: 0,
    nombre: '',
    apellidos: '',
    telefono: '',
    email: ''
  };

  // Variables para el modal de edición
  showEditModal: boolean = false;
  editingNotary: Notary = {
    id: 0,
    nombre: '',
    apellidos: '',
    telefono: '',
    email: ''
  };

  // Variables para el modal de detalles
  showDetailsModal: boolean = false;
  selectedNotary: Notary | null = null;

  // Variables para notificaciones
  notification = {
    show: false,
    message: '',
    type: 'success',
    icon: 'fa-check-circle'
  };

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

    // Datos de prueba según la interfaz Notary
    const datosPrueba: Notary[] = [
      {
        id: 1,
        apellidos: 'García Márquez',
        nombre: 'Gabriel',
        telefono: '912345678',
        email: 'gabriel.garcia@ejemplo.com'
      },
      {
        id: 2,
        apellidos: 'Vargas Llosa',
        nombre: 'Mario',
        telefono: '923456789',
        email: 'mario.vargas@ejemplo.com'
      },
      {
        id: 3,
        apellidos: 'Allende',
        nombre: 'Isabel',
        telefono: '934567890',
        email: 'isabel.allende@ejemplo.com'
      },
      {
        id: 4,
        apellidos: 'Borges',
        nombre: 'Jorge Luis',
        telefono: '945678901',
        email: 'jorge.borges@ejemplo.com'
      },
      {
        id: 5,
        apellidos: 'Cortázar',
        nombre: 'Julio',
        telefono: '956789012',
        email: 'julio.cortazar@ejemplo.com'
      }
    ];

    // Opción 1: Usar solo datos de prueba (para desarrollo)
    this.notaries = datosPrueba;
    this.applyFilter();
    this.loading = false;

    // Opción 2: Intentar obtener datos del backend, y si falla, usar datos de prueba
    /*
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
          
          // Usar datos de prueba en caso de error
          console.log('Usando datos de prueba debido al error');
          this.notaries = datosPrueba;
          this.applyFilter();
          this.loading = false;
          
          // Si hay un error de autenticación (401), redirigir al login
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    */
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
    // Crear una copia para evitar modificar el original directamente
    this.editingNotary = { ...notary };
    this.showEditModal = true;
  }

  saveEditedNotary(): void {
    // Validar campos requeridos
    if (!this.editingNotary.nombre || !this.editingNotary.apellidos || 
        !this.editingNotary.telefono || !this.editingNotary.email) {
      this.showNotification('Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    // En un caso real, aquí se enviaría la información al backend
    this.adminNotaryService.updateNotary(this.editingNotary.id, this.editingNotary).subscribe({
      next: (response) => {
        // Actualizar el notario en la lista
        const index = this.notaries.findIndex(n => n.id === this.editingNotary.id);
        if (index !== -1) {
          this.notaries[index] = { ...this.editingNotary };
          this.applyFilter();
        }
        
        // Cerrar modal y mostrar notificación
        this.closeModal();
        this.showNotification('Notario actualizado exitosamente', 'update');
      },
      error: (error) => {
        console.error('Error al actualizar notario:', error);
        this.showNotification('Error al actualizar notario. Por favor, intente nuevamente.', 'error');
        
        // Para desarrollo: actualizar el notario en la lista local aunque falle el backend
        if (true) { // Cambiar a false en producción
          const index = this.notaries.findIndex(n => n.id === this.editingNotary.id);
          if (index !== -1) {
            this.notaries[index] = { ...this.editingNotary };
            this.applyFilter();
          }
          this.closeModal();
          this.showNotification('Notario actualizado exitosamente (modo desarrollo)', 'update');
        }
      }
    });
  }

  deleteNotary(id: number): void {
    // Implementar lógica para eliminar notario
    if (confirm('¿Estás seguro de que deseas eliminar este notario?')) {
      this.adminNotaryService.deleteNotary(id)
        .subscribe({
          next: () => {
            // Eliminar el notario de la lista
            this.notaries = this.notaries.filter(notary => notary.id !== id);
            this.applyFilter();
            this.showNotification('Notario eliminado exitosamente', 'delete');
          },
          error: (error) => {
            console.error('Error al eliminar notario:', error);
            this.showNotification('Error al eliminar notario. Por favor, intente nuevamente.', 'error');
            
            // Para desarrollo: eliminar el notario de la lista local aunque falle el backend
            if (true) { // Cambiar a false en producción
              this.notaries = this.notaries.filter(notary => notary.id !== id);
              this.applyFilter();
              this.showNotification('Notario eliminado exitosamente (modo desarrollo)', 'delete');
            }
          }
        });
    }
  }

  viewNotaryDetails(id: number): void {
    // Buscar el notario por ID
    const notary = this.notaries.find(n => n.id === id);
    if (notary) {
      // Crear una copia para evitar problemas de referencia
      this.selectedNotary = { ...notary };
      this.showDetailsModal = true;
    } else {
      this.showNotification('No se encontró el notario solicitado', 'error');
    }
  }

  openEditModalFromDetails(): void {
    if (this.selectedNotary) {
      this.editingNotary = { ...this.selectedNotary };
      this.showDetailsModal = false;
      this.showEditModal = true;
    }
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDetailsModal = false;
  }

  // Método para abrir el modal de creación
  openCreateModal(): void {
    // Reiniciar el formulario
    this.newNotary = {
      id: 0,
      nombre: '',
      apellidos: '',
      telefono: '',
      email: ''
    };
    this.showCreateModal = true;
  }

  createNotary(): void {
    // Validar campos requeridos
    if (!this.newNotary.nombre || !this.newNotary.apellidos || !this.newNotary.telefono || !this.newNotary.email) {
      this.showNotification('Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    // En un caso real, aquí se enviaría la información al backend
    this.adminNotaryService.createNotary(this.newNotary).subscribe({
      next: (response) => {
        // Agregar el nuevo notario a la lista
        const newId = this.notaries.length > 0 ? Math.max(...this.notaries.map(n => n.id)) + 1 : 1;
        const createdNotary = { ...this.newNotary, id: response?.id || newId };
        this.notaries.unshift(createdNotary);
        this.applyFilter();
        
        // Cerrar modal y mostrar notificación
        this.closeModal();
        this.showNotification('Notario creado exitosamente', 'create');
      },
      error: (error) => {
        console.error('Error al crear notario:', error);
        this.showNotification('Error al crear notario. Por favor, intente nuevamente.', 'error');
        
        // Para desarrollo: agregar el notario a la lista local aunque falle el backend
        if (true) { // Cambiar a false en producción
          const newId = this.notaries.length > 0 ? Math.max(...this.notaries.map(n => n.id)) + 1 : 1;
          const createdNotary = { ...this.newNotary, id: newId };
          this.notaries.unshift(createdNotary);
          this.applyFilter();
          this.closeModal();
          this.showNotification('Notario creado exitosamente (modo desarrollo)', 'create');
        }
      }
    });
  }

  // Método para mostrar notificaciones
  showNotification(message: string, action: 'create' | 'update' | 'delete' | 'error', icon?: string): void {
    let type: 'success' | 'warning' | 'error' = 'success';
    let iconClass = '';
    
    // Determinar tipo y icono según la acción
    switch (action) {
      case 'create':
        type = 'success';
        iconClass = 'fa-check-circle';
        break;
      case 'update':
        type = 'warning';
        iconClass = 'fa-edit';
        break;
      case 'delete':
        type = 'error';
        iconClass = 'fa-trash';
        break;
      case 'error':
        type = 'error';
        iconClass = 'fa-exclamation-circle';
        break;
    }
    
    this.notification = {
      show: true,
      message,
      type,
      icon: icon || iconClass
    };
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  }
}