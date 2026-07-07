import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecTFreeOscillations } from './dec-t-free-oscillations';

describe('DecTFreeOscillations', () => {
  let component: DecTFreeOscillations;
  let fixture: ComponentFixture<DecTFreeOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecTFreeOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecTFreeOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
