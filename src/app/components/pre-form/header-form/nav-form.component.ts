import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-form',
  imports: [CommonModule],
  templateUrl: './nav-form.component.html',
  styleUrls: ['./nav-form.component.css']
})
export class NavFormComponent implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 3; // Actualizado a 3 pasos

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación para actualizar el paso actual
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentStep(event.url);
    });

    // Inicializar el paso actual basado en la URL actual
    this.updateCurrentStep(this.router.url);
  }

  updateCurrentStep(url: string): void {
    if (url.includes('step-one')) {
      this.currentStep = 1;
    } else if (url.includes('step-two')) {
      this.currentStep = 2;
    } else if (url.includes('step-three')) {
      this.currentStep = 3;
    }
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
