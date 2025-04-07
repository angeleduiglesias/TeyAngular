import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../app/services/auth-service';

@Component({
  selector: 'app-notario-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notario-dashboard-component.html',
  styleUrl: './notario-dashboard-component.css'
})
export class NotarioDashboardComponent implements OnInit {
  userData: any = null;
  tramitesPendientes: number = 3;
  documentosPorRevisar: number = 5;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada correctamente');
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}