import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EIntroExperiment } from './e-intro-experiment';

describe('EIntroExperiment', () => {
  let component: EIntroExperiment;
  let fixture: ComponentFixture<EIntroExperiment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EIntroExperiment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EIntroExperiment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
