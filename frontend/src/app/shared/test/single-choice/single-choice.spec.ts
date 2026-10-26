import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSingleChoice } from './single-choice';

describe('TestSingleChoice', () => {
  let component: TestSingleChoice;
  let fixture: ComponentFixture<TestSingleChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSingleChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSingleChoice);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('questionInstruction', "");
    fixture.componentRef.setInput('maxPoints', 10);
    fixture.componentRef.setInput('options', [{"value": "a", "label": "A"}, {"value": "b", "label": "B"}]);
    fixture.componentRef.setInput('correctAnswer', "a");
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
