import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './app/interceptors/auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importa las animaciones
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ,
    provideAnimations() // Habilita las animaciones
  ]
}).catch((err) => console.error(err));
