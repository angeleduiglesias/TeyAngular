import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notario-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notario-dashboard-component.html',
  styleUrls: ['./notario-dashboard-component.css']
})
export class NotarioDashboardComponent implements OnInit {
  tramitesPendientes: number = 3;
  documentosPorRevisar: number = 5;

  constructor() {}

  ngOnInit(): void {
    // Inicialización del componente
  }
}