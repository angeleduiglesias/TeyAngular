import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent {
    today: Date = new Date();
  constructor(private router: Router) {}

  // Método para intentar volver a la página principal
  // Solo funcionará si el modo mantenimiento está desactivado
  tryReturnToHome(): void {
    this.router.navigate(['/']);
    
  }
}
