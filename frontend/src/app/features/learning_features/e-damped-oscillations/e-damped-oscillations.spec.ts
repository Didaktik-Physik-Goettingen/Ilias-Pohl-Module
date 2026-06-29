import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDampedOscillations } from './e-damped-oscillations';

describe('EDampedOscillations', () => {
  let component: EDampedOscillations;
  let fixture: ComponentFixture<EDampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EDampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EDampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
