import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarChaos } from './tar-chaos';

describe('TarChaos', () => {
  let component: TarChaos;
  let fixture: ComponentFixture<TarChaos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarChaos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarChaos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
