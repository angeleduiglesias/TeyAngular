import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteNombreService } from '../../../app/services/cliente/cliente-nombre.service';
@Component({
  selector: 'app-cliente-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-navbar-component.html',
  styleUrls: ['./cliente-navbar-component.css']
})

export class ClienteNavbarComponent implements OnInit {
  nombre_cliente: string = '';
  
  @Input() activeTab: string = 'tramite';
  @Output() tabChange = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(
    private clienteNombreService: ClienteNombreService
  ) {}

  ngOnInit(): void {
    this.nombre_cliente = this.clienteNombreService.getNombre();
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }

  logout(): void {
    this.logoutEvent.emit();
  }
}
