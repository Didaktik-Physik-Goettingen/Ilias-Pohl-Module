import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageChoice } from './image-choice';

describe('ImageChoice', () => {
  let component: ImageChoice;
  let fixture: ComponentFixture<ImageChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageChoice);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('options', [{"value": "a", "imageSrc": "a.png", "label": "A"}, {"value": "b", "imageSrc": "b.png", "label": "B"}]);
    fixture.componentRef.setInput('correctAnswers', ["a"]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
