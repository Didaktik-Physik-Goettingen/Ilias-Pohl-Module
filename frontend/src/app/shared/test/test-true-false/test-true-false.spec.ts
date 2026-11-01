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

  describe('choosing an answer', () => {
    const button = (label: string): HTMLButtonElement =>
      [...fixture.nativeElement.querySelectorAll('.testtf-btn') as NodeListOf<HTMLButtonElement>]
        .find(b => b.textContent!.includes(label))!;

    const click = async (label: string) => {
      button(label).click();
      await fixture.whenStable();
    };

    const isChosen = (label: string) => button(label).classList.contains('selected');

    beforeEach(() => localStorage.clear());

    it('marks only the chosen button', async () => {
      await click('Wahr');
      expect(isChosen('Wahr')).toBe(true);
      expect(isChosen('Falsch')).toBe(false);
      expect(button('Wahr').getAttribute('aria-pressed')).toBe('true');
      expect(button('Falsch').getAttribute('aria-pressed')).toBe('false');
    });

    it('takes the answer back on a second click', async () => {
      await click('Wahr');
      await click('Wahr');
      expect(component.getSelectedValue('s1')).toBeNull();
      expect(isChosen('Wahr')).toBe(false);
      expect(isChosen('Falsch')).toBe(false);
    });

    it('switches to the other answer on a click there', async () => {
      await click('Wahr');
      await click('Falsch');
      expect(component.getSelectedValue('s1')).toBe('false');
      expect(isChosen('Wahr')).toBe(false);
      expect(isChosen('Falsch')).toBe(true);
    });

    it('counts a taken back answer as not answered', async () => {
      await click('Wahr');
      await click('Wahr');
      component.submitAnswer();
      expect(component.pointsAwarded).toBe(0);
    });

    it('can no longer be changed after the submission', async () => {
      await click('Wahr');
      component.submitAnswer();
      component.toggleStatement('s1', 'true');
      expect(component.getSelectedValue('s1')).toBe('true');
    });
  });
});
