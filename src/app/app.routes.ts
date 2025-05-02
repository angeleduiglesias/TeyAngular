import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { PreFormComponent } from './components/pre-form/pre-form.component';
import { StepOneComponent } from './components/pre-form/step-1/step-one.component';
import { StepTwoComponent } from './components/pre-form/step-2/step-two.component';
import { StepThreeComponent } from './components/pre-form/step-3/step-three.component';
import { StepFourComponent } from './components/pre-form/step-4/step-four.component';
import { StepFiveComponent } from './components/pre-form/step-5/step-five.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from '../pages/admin/dashboard/admin-dashboard-component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

// Define las rutas de la aplicación
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },   
  {
    path: 'pre-form',
    component: PreFormComponent,
    children: [
      { path: '', redirectTo: 'step-one', pathMatch: 'full' },
      { path: 'step-one', component: StepOneComponent },
      { path: 'step-two', component: StepTwoComponent },
      {path:'step-three', component: StepThreeComponent},
      {path:'step-four', component: StepFourComponent},
      {path:'step-five', component: StepFiveComponent}
    ]
  },
  // Rutas protegidas por rol
  { 
    path: 'admin', 
    loadComponent: () => import('../pages/admin/admin.component').then(c => c.AdminComponent),
    //canActivate: [RoleGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      // Aquí puedes agregar más rutas hijas para el panel admin
      // { path: 'clientes', component: ClientesComponent },
      // { path: 'tramites', component: TramitesComponent },
    ]
  },
  { 
    path: 'notario/dashboard', 
    loadComponent: () => import('../pages/notario/dashboard/notario-dashboard-component').then(c => c.NotarioDashboardComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'notario' }
  },
  { 
    path: 'cliente/dashboard', 
    loadComponent: () => import('../pages/cliente/dashboard/cliente-dashboard-component').then(c => c.ClienteDashboardComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'cliente' }
  },
  // Ruta de fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];