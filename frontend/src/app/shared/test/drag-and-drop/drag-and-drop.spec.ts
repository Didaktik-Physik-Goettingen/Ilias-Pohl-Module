import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDragDrop } from './drag-and-drop';

describe('TestDragDrop', () => {
  let component: TestDragDrop;
  let fixture: ComponentFixture<TestDragDrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDragDrop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDragDrop);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('questionInstruction', "");
    fixture.componentRef.setInput('maxPoints', 10);
    fixture.componentRef.setInput('containers', [{"id": "c1", "imageSrc": "c.png", "correctAnswerIds": ["a"], "assignedAnswerIds": []}]);
    fixture.componentRef.setInput('answers', [{"id": "a", "label": "A"}]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
