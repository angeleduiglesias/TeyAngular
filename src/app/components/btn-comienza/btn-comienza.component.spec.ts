import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnComienzaComponent } from './btn-comienza.component';

describe('BtnComienzaComponent', () => {
  let component: BtnComienzaComponent;
  let fixture: ComponentFixture<BtnComienzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnComienzaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnComienzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
