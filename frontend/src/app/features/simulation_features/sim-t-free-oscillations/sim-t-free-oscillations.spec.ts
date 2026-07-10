import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimTFreeOscillations } from './sim-t-free-oscillations';

describe('SimTFreeOscillations', () => {
  let component: SimTFreeOscillations;
  let fixture: ComponentFixture<SimTFreeOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimTFreeOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimTFreeOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
