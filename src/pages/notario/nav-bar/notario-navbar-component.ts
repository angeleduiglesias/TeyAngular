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
  selector: 'app-notario-navbar',
  imports: [CommonModule],
  templateUrl: './notario-navbar-component.html',
  styleUrl: './notario-navbar-component.css'
})
export class NotarioNavbarComponent implements OnInit {
  @Input() userData: any;
  @Input() activeTab: string = 'dashboard';
  
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
