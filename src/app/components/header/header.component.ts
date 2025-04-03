import { Component } from '@angular/core';
import { BtnComienzaComponent } from "../buttons/btn-comienza/btn-comienza.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BtnComienzaComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Aquí podemos agregar lógica adicional si es necesaria
}
