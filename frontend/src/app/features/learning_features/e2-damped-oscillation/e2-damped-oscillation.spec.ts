import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E2DampedOscillation } from './e2-damped-oscillation';

describe('E2DampedOscillation', () => {
  let component: E2DampedOscillation;
  let fixture: ComponentFixture<E2DampedOscillation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [E2DampedOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E2DampedOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
