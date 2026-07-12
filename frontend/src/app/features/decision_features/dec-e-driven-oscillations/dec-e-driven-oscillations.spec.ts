import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecEDrivenOscillations } from './dec-e-driven-oscillations';

describe('DecEDrivenOscillations', () => {
  let component: DecEDrivenOscillations;
  let fixture: ComponentFixture<DecEDrivenOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecEDrivenOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecEDrivenOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
