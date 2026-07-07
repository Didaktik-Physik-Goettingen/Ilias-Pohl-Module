import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecTDrivenOscillations } from './dec-t-driven-oscillations';

describe('DecTDrivenOscillations', () => {
  let component: DecTDrivenOscillations;
  let fixture: ComponentFixture<DecTDrivenOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecTDrivenOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecTDrivenOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
