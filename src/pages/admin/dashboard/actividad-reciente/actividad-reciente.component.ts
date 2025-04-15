import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actividad-reciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad-reciente.component.html',
  styleUrl: './actividad-reciente.component.css'
})
export class ActividadRecienteComponent implements OnInit {
  actividades: any[] = [];

  ngOnInit(): void {
    // Datos de ejemplo para mostrar en el componente
    this.actividades = [
      { 
        tipo: 'login', 
        descripcion: 'Usuario admin inició sesión', 
        tiempo: 'Hace 5 minutos' 
      },
      { 
        tipo: 'documento', 
        descripcion: 'Nuevo documento subido: Contrato.pdf', 
        tiempo: 'Hace 30 minutos' 
      },
      { 
        tipo: 'cliente', 
        descripcion: 'Nuevo cliente registrado: María López', 
        tiempo: 'Hace 2 horas' 
      },
      { 
        tipo: 'notificacion', 
        descripcion: 'Recordatorio: Reunión con notarios', 
        tiempo: 'Hace 3 horas' 
      },
      { 
        tipo: 'notificacion', 
        descripcion: 'Recordatorio: Reunión con notarios', 
        tiempo: 'Hace 3 horas' 
      },
      { 
        tipo: 'notificacion', 
        descripcion: 'Recordatorio: Reunión con notarios', 
        tiempo: 'Hace 3 horas' 
      },
      { 
        tipo: 'notificacion', 
        descripcion: 'Recordatorio: Reunión con notarios', 
        tiempo: 'Hace 3 horas' 
      },
      {
        tipo: 'notificacion',
        descripcion: 'Recordatorio: Reunión con notarios',
        tiempo: 'Hace 3 horas'
      },
    ];
  }

  getIconClass(tipo: string): string {
    switch (tipo) {
      case 'login':
        return 'fa-user-circle';
      case 'documento':
        return 'fa-file-alt';
      case 'cliente':
        return 'fa-user-plus';
      case 'notificacion':
        return 'fa-bell';
      default:
        return 'fa-info-circle';
    }
  }
}