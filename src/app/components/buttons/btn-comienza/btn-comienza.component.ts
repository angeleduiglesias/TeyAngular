import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-comienza',
  imports: [RouterModule, CommonModule],
  templateUrl: './btn-comienza.component.html',
  styleUrls: ['./btn-comienza.component.css']
})
export class BtnComienzaComponent {
  mostrarPopup = false;

  constructor(private router: Router) {}

  // Muestra el popup cuando se hace clic en el botón
  navigateToForm() {
    this.mostrarPopup = true;
  }

  // Cierra el popup
  cerrarPopup() {
    this.mostrarPopup = false;
  }

  // Si el usuario confirma, navega a la ruta
  confirmarNavegacion() {
    this.mostrarPopup = false;
    this.router.navigate(['/pre-form']);
  }
}