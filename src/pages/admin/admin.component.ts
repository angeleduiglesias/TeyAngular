import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarMenuComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  // Este componente actuará como contenedor principal
  // con el sidebar permanente y el área de contenido dinámico
  
  sidebarCollapsed = false;
  showSidebar = false;
  window: Window;  
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Asignar window solo si estamos en el navegador
    this.window = isPlatformBrowser(platformId) ? window : {} as Window;
  }
  
  toggleSidebarCollapse() {
    // Solo para pantallas grandes
    if (window.innerWidth > 768) {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }
  
  toggleSidebar() {
    // Para dispositivos móviles
    if (window.innerWidth <= 768) {
      this.showSidebar = !this.showSidebar;
    } else {
      // Para pantallas grandes, alternar el colapso
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }
}