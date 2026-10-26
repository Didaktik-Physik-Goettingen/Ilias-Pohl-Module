import { ComponentFixture, TestBed } from '@angular/core/testing';
import { stubCanvasContext } from '../../../../testing/canvas-stub';

import { SimEDrivenOscillations } from './sim-e-driven-oscillations';

describe('SimEDrivenOscillations', () => {
  let component: SimEDrivenOscillations;
  let fixture: ComponentFixture<SimEDrivenOscillations>;

  beforeEach(async () => {
    stubCanvasContext();
    await TestBed.configureTestingModule({
      imports: [SimEDrivenOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimEDrivenOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
