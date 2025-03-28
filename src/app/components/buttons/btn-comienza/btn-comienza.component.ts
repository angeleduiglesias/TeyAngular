import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-btn-comienza',
  imports: [RouterModule],
  templateUrl: './btn-comienza.component.html',
  styleUrls: ['./btn-comienza.component.css']
})
export class BtnComienzaComponent {
  constructor(private router: Router) {}

  navigateToForm() {
    this.router.navigate(['/pre-form']);
  }
}