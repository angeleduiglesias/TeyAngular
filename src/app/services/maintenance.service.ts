import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  // BehaviorSubject para mantener el estado del modo mantenimiento
  private maintenanceModeSubject = new BehaviorSubject<boolean>(false);
  
  // Observable para que los componentes puedan suscribirse a cambios
  maintenanceMode$: Observable<boolean> = this.maintenanceModeSubject.asObservable();

  constructor() {
    // Intentar cargar el estado desde localStorage al iniciar
    this.loadMaintenanceModeState();
  }

  // Obtener el estado actual del modo mantenimiento
  isMaintenanceMode(): boolean {
    return this.maintenanceModeSubject.value;
  }

  // Activar o desactivar el modo mantenimiento
  setMaintenanceMode(isActive: boolean): void {
    // Actualizar el estado
    this.maintenanceModeSubject.next(isActive);
    
    // Guardar el estado en localStorage para persistencia
    localStorage.setItem('maintenanceMode', JSON.stringify(isActive));
    
    console.log(`Modo mantenimiento ${isActive ? 'activado' : 'desactivado'}`);
  }

  // Cargar el estado del modo mantenimiento desde localStorage
  private loadMaintenanceModeState(): void {
    try {
      const savedState = localStorage.getItem('maintenanceMode');
      if (savedState !== null) {
        const isActive = JSON.parse(savedState);
        this.maintenanceModeSubject.next(isActive);
        console.log(`Estado del modo mantenimiento cargado: ${isActive}`);
      }
    } catch (error) {
      console.error('Error al cargar el estado del modo mantenimiento:', error);
    }
  }
}
