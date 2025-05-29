import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../app/services/maintenance.service';

interface UserData {
  nombre: string;
  telefono: string;
  email: string;
}

interface SystemConfig {
  landingPage: boolean;
  maintenancePage: boolean;
}

interface AdminUser {
  nombre: string;
  email: string;
  isPrincipal?: boolean;
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
    email: ''
  };

  systemConfig: SystemConfig = {
    landingPage: false,
    maintenancePage: false,
  };

  newAdmin: AdminUser = {
    nombre: '',
    email: ''
  };

  adminList: AdminUser[] = [];

  showToast: boolean = false;
  toastMessage: string = '';
  toastIcon: string = '';
  activeConfigTab: string = 'general';
  
  showConfirmModal: boolean = false;

  // Variables para validación de email
  isValidEmail: boolean = false;
  emailError: string = '';

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadSystemConfig();
    this.loadAdminList();
    
    this.systemConfig.maintenancePage = this.maintenanceService.isMaintenanceMode();
  }

  loadUserData(): void {
    setTimeout(() => {
      this.userData = {
        nombre: 'Juan Pérez',
        telefono: '987654321',
        email: 'juan.perez@example.com'
      };
    }, 500);
  }

  loadSystemConfig(): void {
    setTimeout(() => {
      const maintenanceMode = this.maintenanceService.isMaintenanceMode();
      
      this.systemConfig = {
        landingPage: false,
        maintenancePage: maintenanceMode
      };
    }, 500);
  }

  loadAdminList(): void {
    setTimeout(() => {
      this.adminList = [
        {
          nombre: 'Juan Pérez',
          email: 'juan.perez@example.com',
          isPrincipal: true
        }
      ];
    }, 500);
  }

  // Validar formato de email
  validateEmail(): void {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    if (!this.newAdmin.email) {
      this.isValidEmail = false;
      this.emailError = '';
      return;
    }
    
    if (!emailRegex.test(this.newAdmin.email)) {
      this.isValidEmail = false;
      this.emailError = 'Por favor, ingrese un correo electrónico válido';
    } else {
      this.isValidEmail = true;
      this.emailError = '';
    }
  }

  addNewAdmin(): void {
    this.validateEmail();
    
    if (!this.newAdmin.nombre || !this.newAdmin.email || !this.isValidEmail) {
      this.showToastMessage('Por favor, complete todos los campos correctamente', 'fa-exclamation-circle');
      return;
    }

    console.log('Añadiendo nuevo administrador:', this.newAdmin);
    
    this.adminList.push({
      nombre: this.newAdmin.nombre,
      email: this.newAdmin.email
    });
    
    this.newAdmin = {
      nombre: '',
      email: ''
    };
    this.isValidEmail = false;
    
    this.showToastMessage('Administrador agregado correctamente', 'fa-check-circle');
  }

  updatePhone(): void {
    console.log('Actualizando teléfono:', this.userData.telefono);
    
    this.showToastMessage('Teléfono actualizado correctamente', 'fa-check-circle');
  }

  updateEmail(): void {
    console.log('Actualizando email:', this.userData.email);
    
    this.showToastMessage('Email actualizado correctamente', 'fa-check-circle');
  }

  redirectToPasswordReset(): void {
    console.log('Redireccionando a cambio de contraseña en Firebase');
    
    this.showToastMessage('Se ha enviado un enlace para cambiar la contraseña a su correo', 'fa-info-circle');
  }

  openConfirmModal(): void {
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  confirmSaveSystemConfig(): void {
    this.maintenanceService.setMaintenanceMode(this.systemConfig.maintenancePage);
    
    console.log('Guardando configuración del sistema:', this.systemConfig);
    
    this.closeConfirmModal();
    
    this.showToastMessage('Configuración del sistema actualizada', 'fa-check-circle');
    
    if (this.systemConfig.maintenancePage) {
      setTimeout(() => {
        this.showToastMessage('Modo mantenimiento activado. Los usuarios serán redirigidos a la página de mantenimiento.', 'fa-info-circle');
      }, 3500);
    }
  }

  onMaintenanceModeChange(event: any): void {
    console.log('Cambio en modo mantenimiento:', this.systemConfig.maintenancePage);
  }

  changeConfigTab(tab: string): void {
    this.activeConfigTab = tab;
  }

  showToastMessage(message: string, icon: string): void {
    this.toastMessage = message;
    this.toastIcon = icon;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}