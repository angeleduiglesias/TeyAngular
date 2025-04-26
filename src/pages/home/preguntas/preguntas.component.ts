import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Faq {
  pregunta: string;
  respuesta: string;
  open: boolean;
}

@Component({
  selector: 'app-preguntas',
  imports: [CommonModule],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.css'
})
export class PreguntasComponent {
  faqs: Faq[] = [
    {
      pregunta: '¿Cuánto tiempo toma constituir una empresa en Perú?',
      respuesta: 'El tiempo promedio es de 7 a 15 días hábiles, dependiendo del tipo de sociedad y la complejidad del caso.',
      open: false
    },
    {
      pregunta: '¿Cuál es la diferencia entre una S.A.C. y una E.I.R.L.?',
      respuesta: 'La S.A.C. requiere mínimo 2 socios y máximo 20, mientras que la E.I.R.L. es unipersonal. Además, tienen diferentes estructuras organizativas y requisitos legales.',
      open: false
    },
    {
      pregunta: '¿Cuál es el capital mínimo para constituir una empresa?',
      respuesta: 'No existe un capital mínimo legal, pero se recomienda un monto acorde a la actividad que realizará la empresa.',
      open: false
    },
    {
      pregunta: '¿Necesito estar presente físicamente para constituir mi empresa?',
      respuesta: 'No es necesario. Puedes otorgar un poder a nuestros abogados para que realicen todos los trámites en tu nombre.',
      open: false
    },
    {
      pregunta: '¿Qué documentos necesito para iniciar el proceso?',
      respuesta: 'Principalmente, copia de DNI de los socios, información sobre el giro del negocio, capital a aportar y distribución de acciones o participaciones.',
      open: false
    },
    {
      pregunta: '¿Puedo constituir una empresa siendo extranjero?',
      respuesta: 'Sí, los extranjeros pueden constituir empresas en Perú. Se requiere carné de extranjería o pasaporte y, en algunos casos, obtener el RUC de no domiciliado.',
      open: false
    }
  ];

  toggle(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
