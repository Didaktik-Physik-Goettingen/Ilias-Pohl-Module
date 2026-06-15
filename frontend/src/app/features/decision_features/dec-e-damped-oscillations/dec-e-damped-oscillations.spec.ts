import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecEDampedOscillations } from './dec-e-damped-oscillations';

describe('DecEDampedOscillations', () => {
  let component: DecEDampedOscillations;
  let fixture: ComponentFixture<DecEDampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecEDampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecEDampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
