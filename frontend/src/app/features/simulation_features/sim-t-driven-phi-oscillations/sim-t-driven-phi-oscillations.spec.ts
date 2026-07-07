import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimTDrivenPhiOscillations } from './sim-t-driven-phi-oscillations';

describe('SimTDrivenPhiOscillations', () => {
  let component: SimTDrivenPhiOscillations;
  let fixture: ComponentFixture<SimTDrivenPhiOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimTDrivenPhiOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimTDrivenPhiOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
