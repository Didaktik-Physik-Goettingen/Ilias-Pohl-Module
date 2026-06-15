import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEDrivenOscillation } from './test-e-driven-oscillation';

describe('TestEDrivenOscillation', () => {
  let component: TestEDrivenOscillation;
  let fixture: ComponentFixture<TestEDrivenOscillation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEDrivenOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEDrivenOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
