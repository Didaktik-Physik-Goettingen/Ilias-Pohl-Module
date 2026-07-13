import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TSetup } from './t-setup';

describe('TSetup', () => {
  let component: TSetup;
  let fixture: ComponentFixture<TSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TSetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
