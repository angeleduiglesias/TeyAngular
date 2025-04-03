import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {NavFormComponent} from './header-form/nav-form.component'


@Component({
  selector: 'app-pre-form',
  imports: [CommonModule,RouterModule, NavFormComponent],
  templateUrl: './pre-form.component.html',
  styleUrl: './pre-form.component.css'
})
export class PreFormComponent {

}
