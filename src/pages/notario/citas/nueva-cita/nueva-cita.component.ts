import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    notas:'' ,
    telefono:''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
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
      if (params['telefono']) {
        this.cita.telefono = params['telefono'];
      }
    });

    // Establecer fecha predeterminada (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
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
    // En un escenario real, aquí se enviaría la información a un servicio
    
    // Redirigir a la página de citas
    this.router.navigate(['/notario/citas']);
  }

  cancelar(): void {
    this.router.navigate(['/notario/dashboard']);
  }
}
