import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreFormComponent } from './pre-form.component';

describe('PreFormComponent', () => {
  let component: PreFormComponent;
  let fixture: ComponentFixture<PreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
