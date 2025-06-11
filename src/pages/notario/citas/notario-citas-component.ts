import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Citas, NotarioNuevacitaService } from '../../../app/services/notario/notario-nuevacita.service';

@Component({
  selector: 'app-notario-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notario-citas-component.html',
  styleUrls: ['./notario-citas-component.css']
})
export class NotarioCitasComponent implements OnInit {
  citas: Citas[] = [];
  cargando = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private citaService: NotarioNuevacitaService
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = null;
    
    this.citaService.obtenerCitas().subscribe({
      next: (citas) => {
        console.log('Citas obtenidas:', citas);
        this.citas = citas;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar las citas:', error);
        this.error = 'Error al cargar las citas. Por favor, intente nuevamente.';
        this.cargando = false;
        
        // Mantener datos de ejemplo en caso de error (opcional)
        this.citas = [
          {
            cita_id: 1,
            fecha_cita: '19 de mayo de 2025',
            hora_cita: '10:30',
            nombre_cliente: 'Carlos Rodríguez',
            direccion: 'Av. Principal 123, Oficina 405',
            tipo_empresa: 'Sac'
          },
          {
            cita_id: 2,
            fecha_cita: '21 de mayo de 2025',
            hora_cita: '14:00',
            nombre_cliente: 'María González',
            direccion: 'Calle Secundaria 456, Piso 2',
            tipo_empresa: 'Eirl'
          }
        ];
      }
    });
  }

  volverAlPanel(): void {
    this.router.navigate(['/notario/dashboard']);
  }

 cancelarCita(id: number): void {
    console.log(`Cancelando cita ${id}`);
    
    // Usar el servicio para eliminar la cita
    this.citaService.eliminarCita(id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Cita cancelada exitosamente');
          // Remover la cita de la lista local
          this.citas = this.citas.filter(cita => cita.cita_id !== id);
          alert('Cita cancelada exitosamente');
        } else {
          alert('Error al cancelar la cita: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error al cancelar la cita:', error);
        alert('Error al cancelar la cita. Por favor, intente nuevamente.');
      }
    });
  }

  // Método para recargar las citas
  recargarCitas(): void {
    this.cargarCitas();
  }
}
