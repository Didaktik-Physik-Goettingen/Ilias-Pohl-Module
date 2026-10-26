import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMultipleChoice } from './multiple-choice';

describe('TestMultipleChoice', () => {
  let component: TestMultipleChoice;
  let fixture: ComponentFixture<TestMultipleChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMultipleChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestMultipleChoice);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('questionInstruction', "");
    fixture.componentRef.setInput('maxPoints', 10);
    fixture.componentRef.setInput('options', [{"value": "a", "label": "A"}, {"value": "b", "label": "B"}]);
    fixture.componentRef.setInput('correctAnswers', ["a"]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
