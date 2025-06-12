import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../app/services/auth-service';
import { Router } from '@angular/router';
import { ClienteConfigurationService } from '../../../app/services/cliente/cliente-configuration.service';
import { ClienteNombreService } from '../../../app/services/cliente/cliente-nombre.service';

@Component({
  selector: 'app-cliente-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './cliente-configuration.component.html',
  styleUrls: ['./cliente-configuration.component.css']
})
export class ClienteConfigurationComponent implements OnInit {
  // Datos del usuario
  userData: any = {
    id: '',
    email: '',
  };
  // Datos adicionales del usuario
  nombre_cliente: string = '';
  telefono_cliente: string = '';
  
  // Variables para controlar el modo de edición
  editandoEmail: boolean = false;
  editandoTelefono: boolean = false;
  
  // Variables para guardar los valores originales
  emailOriginal: string = '';
  telefonoOriginal: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private configService: ClienteConfigurationService,
    private clienteNombreService: ClienteNombreService
  ) {}
  
  ngOnInit(): void {
    // Primero obtener datos del authService (email e id)
    this.authService.currentUser$.subscribe(user => {
      this.nombre_cliente = this.clienteNombreService.getNombre();

      if (user) {
        // Asignar email e id del authService
        this.userData.email = user.email;
        this.userData.id = user.id;
        this.emailOriginal = user.email;
        
        // Luego obtener datos adicionales del backend (nombre y teléfono)
        this.cargarDatosAdicionales();
      } else {
        // Si no hay usuario autenticado, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }
  
  cargarDatosAdicionales(): void {
    this.configService.obtenerDatosAdicionales().subscribe({
      next: (datosAdicionales) => {
        // Asignar nombre y teléfono del backend
        this.userData.telefono = datosAdicionales.telefono;
        this.telefonoOriginal = datosAdicionales.telefono;
      },
      error: (error) => {
        console.error('Error al cargar datos adicionales del usuario:', error);
        // Si hay error de autenticación, redirigir al login
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
  
  // Funciones para editar email
  toggleEditarEmail(): void {
    if (this.editandoEmail) {
      // Cancelar edición - restaurar valor original
      this.userData.email = this.emailOriginal;
      this.editandoEmail = false;
    } else {
      // Activar modo de edición
      this.editandoEmail = true;
    }
  }
  
  guardarEmail(): void {
    if (!this.userData.email || !this.validarEmail(this.userData.email)) {
      alert('Por favor, ingrese un email válido');
      return;
    }

    this.authService.updateUserEmail(this.userData.email).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Email actualizado correctamente');
          this.emailOriginal = this.userData.email;
          this.editandoEmail = false;
        } else {
          alert('Error al actualizar email: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error al actualizar email:', error);
        alert('Error al actualizar email');
      }
    });
  }
  
  // Funciones para editar teléfono
  toggleEditarTelefono(): void {
    if (this.editandoTelefono) {
      // Cancelar edición - restaurar valor original
      this.userData.telefono = this.telefonoOriginal;
      this.editandoTelefono = false;
    } else {
      // Activar modo de edición
      this.editandoTelefono = true;
    }
  }
  
  guardarTelefono(): void {
    if (!this.userData.telefono || !this.validarTelefono(this.userData.telefono)) {
      alert('Por favor, ingrese un teléfono válido');
      return;
    }
  
    this.configService.actualizarTelefono(this.userData.telefono).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Teléfono actualizado correctamente');
          this.telefonoOriginal = this.userData.telefono;
          this.editandoTelefono = false;
        } else {
          alert('Error al actualizar teléfono: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error al actualizar teléfono:', error);
        alert('Error al actualizar teléfono');
      }
    });
  }
  
  // Función para cambiar contraseña
  cambiarContrasena(): void {
    const contrasenaActual = prompt('Ingrese su contraseña actual:');
    const nuevaContrasena = prompt('Ingrese su nueva contraseña:');
    
    if (contrasenaActual && nuevaContrasena) {
      this.configService.cambiarContrasena(contrasenaActual, nuevaContrasena).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Contraseña cambiada correctamente');
          } else {
            alert('Error al cambiar contraseña: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error al cambiar contraseña:', error);
          alert('Error al cambiar contraseña');
        }
      });
    }
  }
  
  // Validaciones
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  validarTelefono(telefono: string): boolean {
    const telefonoRegex = /^[0-9]{9,15}$/;
    return telefonoRegex.test(telefono.replace(/\s/g, ''));
  }
  
  guardarConfiguracion(): void {
    // Función de respaldo para otros cambios generales
    setTimeout(() => {
      alert('Configuración guardada correctamente');
    }, 1000);
  }
}