import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOrderImages } from './order-images';

describe('TestOrderImages', () => {
  let component: TestOrderImages;
  let fixture: ComponentFixture<TestOrderImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestOrderImages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestOrderImages);
    component = fixture.componentInstance;
    // minimal question data — the component reads its inputs in ngOnInit
    fixture.componentRef.setInput('questionId', "spec-q");
    fixture.componentRef.setInput('question', "Frage?");
    fixture.componentRef.setInput('containerId', "spec-c");
    fixture.componentRef.setInput('questionInstruction', "");
    fixture.componentRef.setInput('maxPoints', 10);
    fixture.componentRef.setInput('images', [{"id": "a", "imageSrc": "a.png"}, {"id": "b", "imageSrc": "b.png"}]);
    fixture.componentRef.setInput('correctOrder', ["a", "b"]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
