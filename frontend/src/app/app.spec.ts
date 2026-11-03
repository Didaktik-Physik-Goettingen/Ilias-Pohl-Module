import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { App } from './app';
import { DataExport } from './core/services/data-export';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header-title')?.textContent).toContain('Pohlscher Resonator');
  });

  describe('resuming', () => {
    const open = async (path: string) => {
      window.history.pushState({}, '', path);
      vi.spyOn(TestBed.inject(DataExport), 'loadProgress').mockResolvedValue('/learning/last');
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
      TestBed.createComponent(App).componentInstance.ngOnInit();
      await Promise.resolve();
      await Promise.resolve();
      return navigate;
    };

    let base: HTMLBaseElement;

    beforeEach(() => {
      base = document.createElement('base');
      base.href = '/';
      document.head.prepend(base);
    });

    afterEach(() => {
      base.remove();
      window.history.pushState({}, '', '/');
    });

    it('goes to the last page when coming in through the start page', async () => {
      expect(await open('/?session_id=student-a')).toHaveBeenCalledWith('/learning/last');
    });

    it('stays on a page opened directly or reloaded', async () => {
      expect(await open('/learning/other?page=2')).not.toHaveBeenCalled();
    });
  });
});
