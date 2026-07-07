import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T1IntroExperiment } from './t1-intro-experiment';

describe('T1IntroExperiment', () => {
  let component: T1IntroExperiment;
  let fixture: ComponentFixture<T1IntroExperiment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T1IntroExperiment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T1IntroExperiment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
