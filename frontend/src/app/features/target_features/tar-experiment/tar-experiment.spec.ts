import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarExperiment } from './tar-experiment';

describe('TarExperiment', () => {
  let component: TarExperiment;
  let fixture: ComponentFixture<TarExperiment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarExperiment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarExperiment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
