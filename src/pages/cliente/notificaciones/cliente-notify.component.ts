import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../app/services/auth-service';
import { Router } from '@angular/router';

interface Notificacion {
  id: number;
  mensaje: string;
  fecha: Date;
  leida: boolean;
}

@Component({
  selector: 'app-cliente-notify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-notify.component.html',
  styleUrls: ['./cliente-notify.component.css']
})
export class ClienteNotifyComponent implements OnInit {
  // Datos del usuario
  userData: any = null;
  
  // Notificaciones
  notificaciones: Notificacion[] = [];
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userData = user;
        // Cargar notificaciones del usuario
        this.cargarNotificaciones();
      } else {
        // Si no hay usuario autenticado, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }
  
  cargarNotificaciones(): void {
    // Aquí implementaríamos la lógica para cargar notificaciones desde el backend
    // Por ahora usaremos datos de ejemplo
    
    this.notificaciones = [
      {
        id: 1,
        mensaje: 'Bienvenido al sistema de gestión de trámites.',
        fecha: new Date(),
        leida: false
      },
      {
        id: 2,
        mensaje: `El nombre de tu empresa "${this.userData.nombreEmpresa || 'Mi Empresa SAS'}" ha sido aprobado. Ya puedes completar el formulario.`,
        fecha: new Date(Date.now() - 3600000), // 1 hora atrás
        leida: false
      },
      {
        id: 3,
        mensaje: 'Tu formulario ha sido enviado correctamente. Por favor completa el pago para continuar con el trámite.',
        fecha: new Date(Date.now() - 86400000), // 1 día atrás
        leida: true
      }
    ];
  }
  
  marcarComoLeida(id: number): void {
    // Marcar una notificación como leída
    const notificacion = this.notificaciones.find(n => n.id === id);
    if (notificacion) {
      notificacion.leida = true;
      
      // Aquí se implementaría la lógica para actualizar en el backend
      console.log(`Notificación ${id} marcada como leída`);
    }
  }
}