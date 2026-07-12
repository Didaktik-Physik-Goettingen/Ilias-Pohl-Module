import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarTheory } from './tar-theory';

describe('TarTheory', () => {
  let component: TarTheory;
  let fixture: ComponentFixture<TarTheory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarTheory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarTheory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
