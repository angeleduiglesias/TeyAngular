import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-tramite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-tramite.component.html',
  styleUrls: ['./estado-tramite.component.css']
})
export class EstadoTramiteComponent implements OnInit {
  @Input() fechaInicioTramite: Date = new Date();
  @Input() estadoTramite: string = 'Pendiente';
  @Input() porcentajeProgreso: number = 0;

  constructor() { }

  ngOnInit(): void {

  }
}