import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoice } from './single-choice';

describe('SingleChoice', () => {
  let component: SingleChoice;
  let fixture: ComponentFixture<SingleChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleChoice);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('options', [{"value": "a", "label": "A"}, {"value": "b", "label": "B"}]);
    fixture.componentRef.setInput('correctAnswer', "a");
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
