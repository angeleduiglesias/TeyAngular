import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() color: string = '';
  
  colorClass: string = '';
  
  ngOnInit(): void {
    // Asignar clase de color basada en el título o el color proporcionado
    if (this.color) {
      this.colorClass = this.color;
    } else if (this.title.includes('cliente')) {
      this.colorClass = 'blue';
    } else if (this.title.includes('tramite')) {
      this.colorClass = 'green';
    } else {
      this.colorClass = 'default';
    }
  }
  
  getIconClass(): string {
    if (this.title.includes('cliente')) {
      return 'fa-users';
    } else if (this.title.includes('tramite')) {
      return 'fa-file-alt';
    } else if (this.title.includes('activo')) {
      return 'fa-user-check';
    } else {
      return 'fa-chart-bar';
    }
  }
}