import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { PreFormComponent } from './components/pre-form/pre-form.component';
import { StepOneComponent } from './components/pre-form/step-1/step-one.component';
import { StepTwoComponent } from './components/pre-form/step-2/step-two.component';
import { StepThreeComponent } from './components/pre-form/step-3/step-three.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'pre-form',
    component: PreFormComponent,
    children: [
      { path: '', redirectTo: 'step-one', pathMatch: 'full' },
      { path: 'step-one', component: StepOneComponent },
      { path: 'step-two', component: StepTwoComponent },
      {path:'step-three', component: StepThreeComponent}
    ]
  }
];