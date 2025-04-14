import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard-component.html',
  styleUrl: './admin-dashboard-component.css'
})
export class AdminDashboardComponent implements OnInit {
  userData: any = null;
  totalUsuarios: number = 42;
  tramitesPendientes: number = 15;
  notariosActivos: number = 8;

  constructor(
    private authService: AuthService,
    private router: Router  // Añadido Router al constructor
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