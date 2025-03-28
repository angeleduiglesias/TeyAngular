import { Component } from '@angular/core';
import { BtnComienzaComponent } from "../buttons/btn-comienza/btn-comienza.component";

@Component({
  selector: 'app-header',
  imports: [BtnComienzaComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
