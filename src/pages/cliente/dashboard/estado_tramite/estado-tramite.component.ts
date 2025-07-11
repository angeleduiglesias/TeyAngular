import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatTextPipe } from '../../../../app/format-text.pipe';
@Component({
  selector: 'app-estado-tramite',
  standalone: true,
  imports: [CommonModule, FormatTextPipe],
  templateUrl: './estado-tramite.component.html',
  styleUrls: ['./estado-tramite.component.css']
})
export class EstadoTramiteComponent implements OnInit {
  @Input() fecha_inicio: Date = new Date();
  @Input() estado_tramite: string = '';
  @Input() progreso: number = 0;

  constructor( ) { }

  ngOnInit(): void {

  }

  get estadoTramiteClase(): string {
    return 'status-badge status-' + this.estado_tramite.toLowerCase().replace(/[ _]/g, '-');
  }
}