import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { PreFormComponent } from './components/pre-form/pre-form.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'pre-form', component: PreFormComponent }
  ];
  