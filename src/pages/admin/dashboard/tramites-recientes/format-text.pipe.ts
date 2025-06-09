import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatText',
  standalone: true
})
export class FormatTextPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Reemplazar guiones bajos con espacios
    const palabras = value.split('_');
    
    // Capitalizar la primera letra de cada palabra
    return palabras.map(palabra => {
      return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    }).join(' ');
  }
}