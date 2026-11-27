import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TarChaos } from './tar-chaos';

describe('TarChaos', () => {
  let component: TarChaos;
  let fixture: ComponentFixture<TarChaos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarChaos],
      providers: [provideRouter([])]
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
