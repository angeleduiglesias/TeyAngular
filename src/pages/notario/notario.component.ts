import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../app/services/auth-service';
import { NotarioNavbarComponent } from './nav-bar/notario-navbar-component';

@Component({
  selector: 'app-notario',
  standalone: true,
  imports: [CommonModule, RouterModule, NotarioNavbarComponent],
  templateUrl: './notario.component.html',
  styleUrl: './notario.component.css'
})
export class NotarioComponent implements OnInit {
  userData: any = null;
  activeTab: string = 'dashboard';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
    });
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
