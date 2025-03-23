import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importa las animaciones

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations() // Habilita las animaciones
  ]
}).catch((err) => console.error(err));
