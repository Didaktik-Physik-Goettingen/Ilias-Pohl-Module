import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaoticBehavior } from './chaotic-behavior';

describe('ChaoticBehavior', () => {
  let component: ChaoticBehavior;
  let fixture: ComponentFixture<ChaoticBehavior>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChaoticBehavior]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChaoticBehavior);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
