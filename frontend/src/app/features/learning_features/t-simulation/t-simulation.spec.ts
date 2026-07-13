import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TSimulation } from './t-simulation';

describe('TSimulation', () => {
  let component: TSimulation;
  let fixture: ComponentFixture<TSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TSimulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TSimulation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
