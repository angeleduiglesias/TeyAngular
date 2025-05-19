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
import { AdminClientComponent } from '../pages/admin/client/admin-client-component';
import { AdminNotaryComponent } from '../pages/admin/notary/admin-notary-component';
import { AdminReportsComponent } from '../pages/admin/reports/admin-reports-component';
import { AdminConfigurationComponent } from '../pages/admin/configuration/admin-configuration-component';
import { ClienteConfigurationComponent } from '../pages/cliente/configuration/cliente-configuration.component';
import { ClienteDashboardComponent } from '../pages/cliente/dashboard/cliente-dashboard-component';
import { ClienteNotifyComponent } from '../pages/cliente/notificaciones/cliente-notify.component';
import { LogoutComponent } from './components/logout/logout.component';
import { TermsConditionsComponent } from '../pages/terms-conditions/terms-conditions.component';
// Remove unused import since AuthGuard is not used in routes
import { RoleGuard } from './guards/role-guard';

// Define las rutas de la aplicación
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },   
  {
    path: 'terminos-condiciones',component:TermsConditionsComponent
  },

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
    canActivate: [RoleGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      {path: 'clientes',component: AdminClientComponent},
      {path: 'notarios',component: AdminNotaryComponent},
      {path: 'reportes',component: AdminReportsComponent},
      {path:'configuracion',component: AdminConfigurationComponent},

    ]
  },
  { 
    path: 'notario/dashboard', 
    loadComponent: () => import('../pages/notario/dashboard/notario-dashboard-component').then(c => c.NotarioDashboardComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'notario' }
  },
  
  { 
    path: 'cliente', 
    loadComponent: () => import('../pages/cliente/cliente.component').then(c => c.ClienteComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'cliente' },
    children:[
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: ClienteDashboardComponent},
      {path: 'notificaciones', component: ClienteNotifyComponent},
      {path: 'configuracion', component: ClienteConfigurationComponent},
      
    ]
  },
  // Ruta de fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];