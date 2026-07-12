import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T2FreeOscillations } from './t2-free-oscillations';

describe('T2FreeOscillations', () => {
  let component: T2FreeOscillations;
  let fixture: ComponentFixture<T2FreeOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T2FreeOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T2FreeOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
