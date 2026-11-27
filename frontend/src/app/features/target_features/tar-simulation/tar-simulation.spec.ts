import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TarSimulation } from './tar-simulation';

describe('TarSimulation', () => {
  let component: TarSimulation;
  let fixture: ComponentFixture<TarSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarSimulation],
      providers: [provideRouter([])]
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
