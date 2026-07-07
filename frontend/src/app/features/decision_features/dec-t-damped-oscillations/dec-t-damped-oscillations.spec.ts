import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecTDampedOscillations } from './dec-t-damped-oscillations';

describe('DecTDampedOscillations', () => {
  let component: DecTDampedOscillations;
  let fixture: ComponentFixture<DecTDampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecTDampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecTDampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
