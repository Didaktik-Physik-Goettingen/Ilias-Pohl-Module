import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { OptSimulation } from './opt-simulation';
import { NAV_STRAND_KEY } from '../../../shared/nav-bar/nav-bar';

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

  it.each([
    ['e', '/test/test-e-driven'],
    ['t', '/test/test-t-driven'],
  ])('goes back to the test of strand %s', (strand, route) => {
    localStorage.setItem(NAV_STRAND_KEY, strand);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.goBack();
    expect(navigate).toHaveBeenCalledWith([route], { queryParams: { page: '5' } });
    localStorage.removeItem(NAV_STRAND_KEY);
  });
});
