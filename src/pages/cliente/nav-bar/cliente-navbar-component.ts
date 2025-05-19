import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Notificacion {
  id: number;
  mensaje: string;
  fecha: Date;
  leida: boolean;
}

@Component({
  selector: 'app-cliente-navbar',
  imports: [CommonModule],
  templateUrl: './cliente-navbar-component.html',
  styleUrl: './cliente-navbar-component.css'
})
export class ClienteNavbarComponent implements OnInit {
  @Input() userData: any;
  @Input() notificaciones: Notificacion[] = [];
  @Input() activeTab: string = 'tramite';
  
  @Output() tabChange = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialización del componente
  }
  
  changeTab(tab: string): void {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
  
  logout(): void {
    this.logoutEvent.emit();
  }
}