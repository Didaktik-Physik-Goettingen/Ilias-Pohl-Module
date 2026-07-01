import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E3DrivenOscillations } from './e3-driven-oscillations';

describe('E3DrivenOscillations', () => {
  let component: E3DrivenOscillations;
  let fixture: ComponentFixture<E3DrivenOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [E3DrivenOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E3DrivenOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
