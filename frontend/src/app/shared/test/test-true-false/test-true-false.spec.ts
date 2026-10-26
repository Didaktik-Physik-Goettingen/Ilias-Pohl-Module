import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTrueFalse } from './test-true-false';

describe('TestTrueFalse', () => {
  let component: TestTrueFalse;
  let fixture: ComponentFixture<TestTrueFalse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTrueFalse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTrueFalse);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('questionInstruction', "");
    fixture.componentRef.setInput('maxPoints', 10);
    fixture.componentRef.setInput('statements', [{"id": "s1", "text": "Aussage", "isCorrect": true}]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
