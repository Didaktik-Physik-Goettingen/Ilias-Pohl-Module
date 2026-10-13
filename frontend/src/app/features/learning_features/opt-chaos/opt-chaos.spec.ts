import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
