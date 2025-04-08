import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

// Componente para la pantalla de inicio de sesión
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;      // Controla el estado de carga
  submitted = false;    // Indica si el formulario fue enviado
  error = '';           // Almacena mensajes de error
  showPassword = false; // Controla la visibilidad de la contraseña
  errorMessage = '';    // Mensaje de error amigable para el usuario

  // Inyecta servicios necesarios para el formulario, navegación y autenticación
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Inicializa el formulario con validaciones
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Verificar si hay credenciales guardadas
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  // Getter para facilitar el acceso a los campos del formulario
  get f() { return this.loginForm.controls; }

  // Alterna la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Maneja el envío del formulario
  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.errorMessage = '';

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Guardar email si "recordarme" está marcado
    if (this.loginForm.value.rememberMe) {
      localStorage.setItem('rememberedEmail', this.loginForm.value.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Autenticar usuario mediante el servicio
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (response) => {
          this.loading = false;
          // Redirigir según el rol del usuario
          const userRole = this.authService.getCurrentUserRole();
          if (userRole) {
            this.router.navigate([`/${userRole}/dashboard`]);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.loading = false;
          
          // Mensajes de error más amigables
          if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o inténtalo más tarde.';
          } else if (error.status === 401) {
            this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
          } else if (error.status === 403) {
            this.errorMessage = 'No tienes permiso para acceder. Contacta al administrador.';
          } else if (error.status === 500) {
            this.errorMessage = 'Error en el servidor. Por favor, inténtalo más tarde.';
          } else {
            this.errorMessage = 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.';
          }
          
          this.error = this.errorMessage; // Actualiza también la variable error original
          console.error('Error de inicio de sesión:', error);
        }
      });
  }
}
