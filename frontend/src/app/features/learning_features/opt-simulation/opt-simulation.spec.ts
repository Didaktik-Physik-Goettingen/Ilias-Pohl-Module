import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptSimulation } from './opt-simulation';

describe('OptSimulation', () => {
  let component: OptSimulation;
  let fixture: ComponentFixture<OptSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptSimulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptSimulation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
