import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptSetup } from './opt-setup';

describe('OptSetup', () => {
  let component: OptSetup;
  let fixture: ComponentFixture<OptSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptSetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
