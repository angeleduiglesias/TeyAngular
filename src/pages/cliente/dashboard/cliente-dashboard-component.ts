import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cliente-dashboard',
  imports: [CommonModule],
  templateUrl: './cliente-dashboard-component.html',
  styleUrl: './cliente-dashboard-component.css'
})
export class ClienteDashboardComponent implements OnInit {
  userData: any = null;
  
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
    
  logout() {
    // Redirigir al componente de logout
    this.router.navigate(['/logout']);
  }
}