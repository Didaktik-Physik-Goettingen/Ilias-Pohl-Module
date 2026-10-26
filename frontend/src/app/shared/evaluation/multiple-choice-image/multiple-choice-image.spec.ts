import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceImage } from './multiple-choice-image';

describe('MultipleChoiceImage', () => {
  let component: MultipleChoiceImage;
  let fixture: ComponentFixture<MultipleChoiceImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoiceImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceImage);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('imageSrc', "q.png");
    fixture.componentRef.setInput('imageAlt', "Bild");
    fixture.componentRef.setInput('options', [{"value": "a", "label": "A"}, {"value": "b", "label": "B"}]);
    fixture.componentRef.setInput('correctAnswers', ["a"]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
