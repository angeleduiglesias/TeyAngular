import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-step-one',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.css'
})
    export class StepOneComponent {
        @Input() formGroup!: FormGroup;
      }