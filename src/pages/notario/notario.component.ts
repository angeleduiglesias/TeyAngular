import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { AuthService } from '../../app/services/auth-service';
import { NotarioNavbarComponent } from './nav-bar/notario-navbar-component';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-notario',
  standalone: true,
  imports: [CommonModule, RouterModule, NotarioNavbarComponent],
  templateUrl: './notario.component.html',
  styleUrls: ['./notario.component.css']
})
export class NotarioComponent implements OnInit, OnDestroy {
  userData: any = null;
  activeTab: string = 'dashboard';
  private routerSubscription: Subscription | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
    });

    // Suscribirse a los eventos de navegación para actualizar la pestaña activa
    this.routerSubscription = this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveTabFromUrl(event.urlAfterRedirects);
      });
    
    // Establecer la pestaña activa inicial basada en la URL actual
    this.updateActiveTabFromUrl(this.router.url);
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción al destruir el componente
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Método para actualizar la pestaña activa basada en la URL
  private updateActiveTabFromUrl(url: string): void {
    if (url.includes('/notario/dashboard')) {
      this.activeTab = 'dashboard';
    } else if (url.includes('/notario/documentos')) {
      this.activeTab = 'documentos';
    } else if (url.includes('/notario/citas')) {
      this.activeTab = 'citas';
    }
    // Nota: No actualizamos para rutas como /notario/documento/:id o /notario/citas/nueva
    // ya que queremos mantener la pestaña padre activa
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
    // Navegar a la ruta correspondiente
    switch(tab) {
      case 'dashboard':
        this.router.navigate(['/notario/dashboard']);
        break;
      case 'documentos':
        this.router.navigate(['/notario/documentos']);
        break;
      case 'citas':
        this.router.navigate(['/notario/citas']);
        break;
    }
  }

  logout(): void {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
}
