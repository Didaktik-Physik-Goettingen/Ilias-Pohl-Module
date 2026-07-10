import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T4DrivenOscillations } from './t4-driven-oscillations';

describe('T4DrivenOscillations', () => {
  let component: T4DrivenOscillations;
  let fixture: ComponentFixture<T4DrivenOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T4DrivenOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T4DrivenOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
