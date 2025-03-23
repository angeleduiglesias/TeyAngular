import { Component, EventEmitter, Output } from '@angular/core';
import { BtnComienzaComponent } from "../btn-comienza/btn-comienza.component";

@Component({
  selector: 'app-header',
  imports: [BtnComienzaComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() mostrarFormulario = new EventEmitter<void>(); //Evento para emitir el mostrar formulario
  @Output() mostrarLogin = new EventEmitter<void>(); //Evento para emitier el mostara Login.

  recibirEvento() {
    this.mostrarFormulario.emit(); // Reemitimos el evento hacia AppComponent
  }

  eventoLogin(){
    this.mostrarLogin.emit();
  }
}
