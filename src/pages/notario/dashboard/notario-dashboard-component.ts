import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../app/services/auth-service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
    });
  }

  logout() {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
}