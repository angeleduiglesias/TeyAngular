import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserData {
  nombre: string;
  telefono: string;
  email: string;
  contrasena: string;
  foto?: string;
}

interface SystemConfig {
  landingPage: boolean;
  maintenancePage: boolean;
  darkMode: boolean;
  language: string;
}

@Component({
  selector: 'app-admin-configuration',
  templateUrl: './admin-configuration-component.html',
  styleUrls: ['./admin-configuration-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminConfigurationComponent implements OnInit {
  userData: UserData = {
    nombre: '',
    telefono: '',
    email: '',
    contrasena: ''
  };

  systemConfig: SystemConfig = {
    landingPage: false,
    maintenancePage: false,
    darkMode: false,
    language: 'es'
  };

  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = '';
  activeConfigTab: string = 'general';

  constructor() { }

  ngOnInit(): void {
    // Cargar datos del usuario (simulado)
    this.loadUserData();
    // Cargar configuración del sistema (simulado)
    this.loadSystemConfig();
  }

  loadUserData(): void {
    // Simulación de carga de datos desde un servicio
    setTimeout(() => {
      this.userData = {
        nombre: 'Juan Pérez',
        telefono: '987654321',
        email: 'juan.perez@example.com',
        contrasena: '********'
      };
    }, 500);
  }

  loadSystemConfig(): void {
    // Simulación de carga de configuración desde un servicio
    setTimeout(() => {
      this.systemConfig = {
        landingPage: true,
        maintenancePage: false,
        darkMode: false,
        language: 'es'
      };
    }, 500);
  }

  savePersonalData(): void {
    // Simulación de guardado de datos personales
    console.log('Guardando datos personales:', this.userData);
    
    // Mostrar mensaje de éxito
    this.showToastMessage('Datos personales guardados correctamente', 'fa-check-circle');
  }

  saveSystemConfig(): void {
    // Confirmar antes de aplicar cambios
    if (confirm('¿Estás seguro de que deseas aplicar estos cambios en la configuración del sistema?')) {
      // Simulación de guardado de configuración del sistema
      console.log('Guardando configuración del sistema:', this.systemConfig);
      
      // Mostrar mensaje de éxito
      this.showToastMessage('Configuración del sistema actualizada', 'fa-check-circle');
    }
  }

  changeConfigTab(tab: string): void {
    this.activeConfigTab = tab;
  }

  showToastMessage(message: string, icon: string): void {
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;
    
    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}