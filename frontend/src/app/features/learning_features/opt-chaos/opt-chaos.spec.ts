import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { OptChaos } from './opt-chaos';

describe('OptChaos', () => {
  let component: OptChaos;
  let fixture: ComponentFixture<OptChaos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptChaos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptChaos);
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
    localStorage.setItem('nav-chosen-strand', strand);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.goBack();
    expect(navigate).toHaveBeenCalledWith([route], { queryParams: { page: '5' } });
    localStorage.removeItem('nav-chosen-strand');
  });
});
