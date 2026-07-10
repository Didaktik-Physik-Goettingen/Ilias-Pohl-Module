import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimTDrivenXOscillations } from './sim-t-driven-x-oscillations';

describe('SimTDrivenXOscillations', () => {
  let component: SimTDrivenXOscillations;
  let fixture: ComponentFixture<SimTDrivenXOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimTDrivenXOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimTDrivenXOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
