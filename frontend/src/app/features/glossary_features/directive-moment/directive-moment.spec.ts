import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectiveMoment } from './directive-moment';

describe('DirectiveMoment', () => {
  let component: DirectiveMoment;
  let fixture: ComponentFixture<DirectiveMoment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectiveMoment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectiveMoment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
