import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoice } from './multiple-choice';

describe('MultipleChoice', () => {
  let component: MultipleChoice;
  let fixture: ComponentFixture<MultipleChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleChoice);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('options', [{"value": "a", "label": "A"}, {"value": "b", "label": "B"}]);
    fixture.componentRef.setInput('correctAnswers', ["a"]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
