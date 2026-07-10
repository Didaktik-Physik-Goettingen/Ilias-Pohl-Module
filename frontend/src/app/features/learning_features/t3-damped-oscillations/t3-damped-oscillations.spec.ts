import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T3DampedOscillations } from './t3-damped-oscillations';

describe('T3DampedOscillations', () => {
  let component: T3DampedOscillations;
  let fixture: ComponentFixture<T3DampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T3DampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T3DampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
