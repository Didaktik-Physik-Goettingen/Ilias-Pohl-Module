import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTDrivenOscillation } from './test-t-driven-oscillation';

describe('TestTDrivenOscillation', () => {
  let component: TestTDrivenOscillation;
  let fixture: ComponentFixture<TestTDrivenOscillation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTDrivenOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTDrivenOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
