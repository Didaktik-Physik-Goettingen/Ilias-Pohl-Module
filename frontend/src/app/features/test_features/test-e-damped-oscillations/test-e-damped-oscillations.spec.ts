import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEDampedOscillations } from './test-e-damped-oscillations';

describe('TestEDampedOscillations', () => {
  let component: TestEDampedOscillations;
  let fixture: ComponentFixture<TestEDampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEDampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEDampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
