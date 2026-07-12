import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimEDampedOscillations } from './sim-e-damped-oscillations';

describe('SimEDampedOscillations', () => {
  let component: SimEDampedOscillations;
  let fixture: ComponentFixture<SimEDampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimEDampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimEDampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
