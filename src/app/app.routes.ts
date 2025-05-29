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
import { AdminPaymentsComponent } from '../pages/admin/payments/admin-payments.component';
import { AdminTramitesComponent } from '../pages/admin/Tramites/admin-tramites.component';
import { AdminReportsComponent } from '../pages/admin/reports/admin-reports-component';
import { AdminConfigurationComponent } from '../pages/admin/configuration/admin-configuration-component';
import { ClienteConfigurationComponent } from '../pages/cliente/configuration/cliente-configuration.component';
import { ClienteDashboardComponent } from '../pages/cliente/dashboard/cliente-dashboard-component';
import { ClienteNotifyComponent } from '../pages/cliente/notificaciones/cliente-notify.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NotarioDocumentosComponent } from '../pages/notario/documentos/notario-documentos-component';
import { NotarioCitasComponent } from '../pages/notario/citas/notario-citas-component';
import { TermsConditionsComponent } from '../pages/terms-conditions/terms-conditions.component';
import { NotarioDashboardComponent } from '../pages/notario/dashboard/notario-dashboard-component';
import { DocumentoRevisionComponent } from '../pages/notario/documento-revision/documento-revision.component';
import { NuevaCitaComponent } from '../pages/notario/citas/nueva-cita/nueva-cita.component';
// Remove unused import since AuthGuard is not used in routes
import { RoleGuard } from './guards/role-guard';
import { MaintenanceGuard } from './guards/maintenance.guard';
import { MaintenanceComponent } from '../pages/maintenance/maintenance.component';

// Define las rutas de la aplicación
export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [MaintenanceGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },   
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [MaintenanceGuard] },
  {
    path: 'terminos-condiciones', component: TermsConditionsComponent, canActivate: [MaintenanceGuard]
  },

  {
    path: 'pre-form',
    component: PreFormComponent,
    canActivate: [MaintenanceGuard],
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
      {path:'pagos',component: AdminPaymentsComponent},
      {path:'tramites',component: AdminTramitesComponent},

    ]
  },
  { 
    path: 'notario', 
    loadComponent: () => import('../pages/notario/notario.component').then(c => c.NotarioComponent),
    canActivate: [MaintenanceGuard, RoleGuard],
    data: { expectedRole: 'notario' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: NotarioDashboardComponent },
      {path:'documentos',component: NotarioDocumentosComponent},
      {path:'citas',component: NotarioCitasComponent},
      {path:'citas/nueva',component: NuevaCitaComponent},
      {path:'documento/:id',component: DocumentoRevisionComponent},
      // Rutas adicionales para documentos y citas se pueden agregar aquí
    ]
  },
  
  { 
    path: 'cliente', 
    loadComponent: () => import('../pages/cliente/cliente.component').then(c => c.ClienteComponent),
    canActivate: [MaintenanceGuard, RoleGuard],
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