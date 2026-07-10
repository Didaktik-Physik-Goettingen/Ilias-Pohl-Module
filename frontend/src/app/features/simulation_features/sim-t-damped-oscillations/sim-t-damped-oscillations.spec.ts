import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimTDampedOscillations } from './sim-t-damped-oscillations';

describe('SimTDampedOscillations', () => {
  let component: SimTDampedOscillations;
  let fixture: ComponentFixture<SimTDampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimTDampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimTDampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
