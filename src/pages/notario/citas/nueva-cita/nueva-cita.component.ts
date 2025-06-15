import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotarioNuevacitaService, NewCita } from '../../../../app/services/notario/notario-nuevacita.service';

@Component({
  selector: 'app-nueva-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-cita.component.html',
  styleUrls: ['./nueva-cita.component.css']
})
export class NuevaCitaComponent implements OnInit {
  cita = {
    documentoId: 0,
    cliente: '',
    tipoDocumento: '',
    fecha: '',
    hora: '',
    direccion: 'Av. Principal 123, Oficina 405', // Dirección predeterminada
    notas: '', // cambiar a descripcion 
    telefono: ''
  };

  guardando = false; // Para mostrar estado de carga

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: NotarioNuevacitaService
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['documentoId']) {
        this.cita.documentoId = +params['documentoId'];
      }
      if (params['cliente']) {
        this.cita.cliente = params['cliente'];
      }
      if (params['tipoDocumento']) {
        this.cita.tipoDocumento = params['tipoDocumento'];
      }
      if (params['Telefono']) {
        this.cita.telefono = params['Telefono'];
      }
    });

    // Establecer fecha predeterminada (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 5);
    this.cita.fecha = this.formatDate(tomorrow);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  guardarCita(): void {
    console.log('Guardando cita:', this.cita);
    
    // Validar campos requeridos
    if (!this.cita.cliente || !this.cita.tipoDocumento || !this.cita.fecha || !this.cita.hora || !this.cita.telefono) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.guardando = true;

    // Preparar datos para el servicio
    const citaData: NewCita = {
      documento_id: this.cita.documentoId,
      nombre_cliente: this.cita.cliente,
      tipo_documento: this.cita.tipoDocumento,
      fecha_cita: this.cita.fecha,
      hora_cita: this.cita.hora,
      direccion: this.cita.direccion,
      descripcion: this.cita.notas,
      telefono: this.cita.telefono
    };

    // Llamar al servicio para crear la cita
    this.citaService.crearCita(citaData).subscribe({
      next: (response) => {
        console.log('Cita creada exitosamente:', response);
        this.guardando = false;
        
        if (response.success) {
          alert('Cita creada exitosamente');
          // Redirigir a la página de citas
          this.router.navigate(['/notario/citas']);
        } else {
          alert('Error al crear la cita: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error al crear la cita:', error);
        this.guardando = false;
        alert('Error al crear la cita. Por favor, intente nuevamente.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/notario/dashboard']);
  }
}
