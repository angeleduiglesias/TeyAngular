import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-btn-comienza',
  imports: [],
  templateUrl: './btn-comienza.component.html',
  styleUrl: './btn-comienza.component.css'
})
export class BtnComienzaComponent {
  @Output() mostrarFormulario = new EventEmitter<void>();

  showForm() {
    this.mostrarFormulario.emit();
  }
}
