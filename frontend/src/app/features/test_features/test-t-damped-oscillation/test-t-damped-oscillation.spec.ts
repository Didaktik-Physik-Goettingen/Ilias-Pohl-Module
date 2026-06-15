import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTDampedOscillation } from './test-t-damped-oscillation';

describe('TestTDampedOscillation', () => {
  let component: TestTDampedOscillation;
  let fixture: ComponentFixture<TestTDampedOscillation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTDampedOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTDampedOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
