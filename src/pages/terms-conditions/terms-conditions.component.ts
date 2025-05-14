import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements AfterViewInit, OnDestroy {
  activeSection = 'introduccion';
  sections = [
    'introduccion',
    'definiciones',
    'uso',
    'privacidad',
    'propiedad',
    'limitacion',
    'modificaciones',
    'ley',
    'contacto'
  ];

  private observer!: IntersectionObserver;
  private isNavigating = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
    this.initObserver();

    // Scroll inicial solo una vez
    this.route.fragment.pipe(take(1)).subscribe(frag => {
      if (frag && this.sections.includes(frag)) {
        this.scrollToSection(frag, false);
      }
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private initObserver(): void {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver(entries => {
      // Si estamos navegando programáticamente, ignoramos
      if (this.isNavigating) return;

      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (this.sections.includes(id) && this.activeSection !== id) {
            this.activeSection = id;
            this.router.navigate([], {
              fragment: id,
              replaceUrl: true,
              queryParamsHandling: 'preserve'
            });
          }
        }
      }
    }, options);

    for (const id of this.sections) {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    }
  }

  scrollToSection(sectionId: string, updateUrl = true): void {
    const el = document.getElementById(sectionId);
    if (!el) return;

    // Bloqueamos el observer
    this.isNavigating = true;

    // Hacemos scroll suave
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Marcamos manualmente
    this.activeSection = sectionId;
    if (updateUrl) {
      this.router.navigate([], {
        fragment: sectionId,
        queryParamsHandling: 'preserve'
      });
    }

    // Tras ~700 ms volvemos a habilitar observer
    setTimeout(() => {
      this.isNavigating = false;
    }, 700);
  }
}
