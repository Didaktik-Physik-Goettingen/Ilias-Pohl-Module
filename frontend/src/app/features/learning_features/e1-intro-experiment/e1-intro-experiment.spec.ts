import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E1IntroExperiment } from './e1-intro-experiment';

describe('E1IntroExperiment', () => {
  let component: E1IntroExperiment;
  let fixture: ComponentFixture<E1IntroExperiment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [E1IntroExperiment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E1IntroExperiment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
