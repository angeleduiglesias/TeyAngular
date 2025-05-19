import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../app/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-configuration.component.html',
  styleUrls: ['./cliente-configuration.component.css']
})
export class ClienteConfigurationComponent implements OnInit {
  // Datos del usuario
  userData: any = {
    nombre: '',
    email: '',
    telefono: ''
  };
  
  // Configuración de notificaciones
  configNotificaciones = {
    email: true,
    sms: false
  };
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userData = user;
      } else {
        // Si no hay usuario autenticado, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }
  
  guardarConfiguracion(): void {
    // Aquí implementaríamos la lógica para guardar la configuración en el backend
    // Por ahora solo mostraremos un mensaje de éxito
    
    // Simulación de guardado exitoso
    setTimeout(() => {
      alert('Configuración guardada correctamente');
      
      // Aquí se podría actualizar el usuario en el servicio de autenticación
      // this.authService.updateUserData(this.userData);
    }, 1000);
  }
}