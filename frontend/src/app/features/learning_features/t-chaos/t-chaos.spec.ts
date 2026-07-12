import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TChaos } from './t-chaos';

describe('TChaos', () => {
  let component: TChaos;
  let fixture: ComponentFixture<TChaos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TChaos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TChaos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
