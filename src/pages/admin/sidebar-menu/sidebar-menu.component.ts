import { Component, OnInit, Input, Output, EventEmitter, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.css'
})
export class SidebarMenuComponent implements OnInit {
  currentRoute = '';
  @Input() collapsed = false;
  @Input() show = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  window: Window;
  isLargeScreen = false;
  
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Asignar window solo si estamos en el navegador
    this.window = isPlatformBrowser(this.platformId) ? window : {} as Window;
    // Inicializar el valor de isLargeScreen
    if (isPlatformBrowser(this.platformId)) {
      this.isLargeScreen = window.innerWidth > 768;
    }
  }
  
  ngOnInit() {
    // Detectar la ruta actual para resaltar el elemento de menú correspondiente
    this.detectCurrentRoute();
    
    // Suscribirse a cambios de ruta para actualizar el elemento activo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.detectCurrentRoute();
    });
  }
  
  // Escuchar cambios en el tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLargeScreen = window.innerWidth > 768;
    }
  }
  
  // Método para detectar la ruta actual y aplicar la clase active
  private detectCurrentRoute(): void {
    this.currentRoute = this.router.url;
    
    // Verificar si la ruta actual coincide con alguna ruta parcial
    // Esto permite que '/admin/clientes/1' active el elemento '/admin/clientes'
    if (this.currentRoute.startsWith('/admin/clientes')) {
      this.currentRoute = '/admin/clientes';
    } else if (this.currentRoute.startsWith('/admin/notarios')) {
      this.currentRoute = '/admin/notarios';
    } else if (this.currentRoute.startsWith('/admin/reportes')) {
      this.currentRoute = '/admin/reportes';
    } else if (this.currentRoute.startsWith('/admin/pagos')) {
      this.currentRoute = '/admin/pagos';
    } else if (this.currentRoute.startsWith('/admin/tramites')) {
      this.currentRoute = '/admin/tramites';
    } else if (this.currentRoute.startsWith('/admin/configuracion')) {
      this.currentRoute = '/admin/configuracion';
    } else if (this.currentRoute.startsWith('/admin')) {
      // Si es solo /admin o alguna otra ruta de admin no especificada
      this.currentRoute = '/admin';
    }
  }
  
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  
  logout(): void {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
  
  toggle(): void {
    // En dispositivos móviles, toggle controla show, en desktop controla collapsed
    if (!this.isLargeScreen) {
      this.show = !this.show;
      // Prevenir scroll cuando el menú está abierto en móviles
      if (this.show && isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = 'hidden';
      } else if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = '';
      }
    } else {
      this.collapsed = !this.collapsed;
    }
    this.toggleSidebar.emit();
  }
}