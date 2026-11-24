import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { vi } from 'vitest';
import { E2DampedOscillation } from './e2-damped-oscillation';
import { EffortRating } from '../../../core/services/effort-rating';
import { STORAGE_PREFIX } from '../../../core/services/storage-prefix';

describe('E2DampedOscillation', () => {
  let component: E2DampedOscillation;
  let fixture: ComponentFixture<E2DampedOscillation>;

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem(STORAGE_PREFIX + 'framework_session_id', 'student-a');
    await TestBed.configureTestingModule({
      imports: [E2DampedOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E2DampedOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('asks for the mental effort on the last sub-page\'s "Weiter", then goes on', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const effort = TestBed.inject(EffortRating);
    component.currentView = 'damped_osc3';
    component.goForward();
    expect(effort.pending()?.unitId).toBe('e2-damped-oscillations');
    expect(navigate).not.toHaveBeenCalledWith(['/decision/dec-e-driven']);

    effort.submit(5);
    expect(navigate).toHaveBeenCalledWith(['/decision/dec-e-driven']);
  });
});
