import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarSimulation } from './tar-simulation';

describe('TarSimulation', () => {
  let component: TarSimulation;
  let fixture: ComponentFixture<TarSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarSimulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarSimulation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
