import { Component } from '@angular/core';
import { BtnComienzaComponent } from "../btn-comienza/btn-comienza.component";

@Component({
  selector: 'app-header',
  imports: [BtnComienzaComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
