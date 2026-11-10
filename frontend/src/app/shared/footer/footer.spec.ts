import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links the department to its website, in a new tab', () => {
    const link = fixture.nativeElement.querySelector('.footer-department a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Physik und ihre Didaktik');
    expect(link.getAttribute('href')).toBe('https://www.uni-goettingen.de/de/110922.html');
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });
});
