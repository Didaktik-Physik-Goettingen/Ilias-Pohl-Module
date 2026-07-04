import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEDrivenOscillations } from './test-e-driven-oscillations';

describe('TestEDrivenOscillations', () => {
  let component: TestEDrivenOscillations;
  let fixture: ComponentFixture<TestEDrivenOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEDrivenOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEDrivenOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
