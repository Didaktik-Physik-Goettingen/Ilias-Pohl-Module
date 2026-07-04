import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResonanceFrequency } from './resonance-frequency';

describe('ResonanceFrequency', () => {
  let component: ResonanceFrequency;
  let fixture: ComponentFixture<ResonanceFrequency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResonanceFrequency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResonanceFrequency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
