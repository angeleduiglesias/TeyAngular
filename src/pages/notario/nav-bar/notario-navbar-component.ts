import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotarioNombreService } from '../../../app/services/notario/notario-nombre.service';

@Component({
  selector: 'app-notario-navbar',
  imports: [CommonModule],
  templateUrl: './notario-navbar-component.html',
  styleUrl: './notario-navbar-component.css'
})
export class NotarioNavbarComponent implements OnInit {
  nombre_notario: string = '';

  @Input() activeTab: string = 'dashboard';
  
  @Output() tabChange = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();
  
  constructor(private notarioNombreService: NotarioNombreService) {}

  ngOnInit(): void {
    this.nombre_notario = this.notarioNombreService.getNombre();
  }
  
  changeTab(tab: string): void {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
  
  logout(): void {
    this.logoutEvent.emit();
  }
}
