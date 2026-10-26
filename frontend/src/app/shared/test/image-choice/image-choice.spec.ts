import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestImageChoice } from './image-choice';

describe('TestImageChoice', () => {
  let component: TestImageChoice;
  let fixture: ComponentFixture<TestImageChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestImageChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestImageChoice);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('questionInstruction', "");
    fixture.componentRef.setInput('maxPoints', 10);
    fixture.componentRef.setInput('options', [{"value": "a", "imageSrc": "a.png", "label": "A"}, {"value": "b", "imageSrc": "b.png", "label": "B"}]);
    fixture.componentRef.setInput('correctAnswer', "a");
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
