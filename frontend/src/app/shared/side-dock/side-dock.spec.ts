import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { SideDock } from './side-dock';
import { GlossaryOverlay } from '../glossary-overlay/glossary-overlay.service';
import { StudyAidsLock } from '../../core/services/study-aids-lock';

@Component({ standalone: true, template: '' })
class Blank {}

describe('SideDock', () => {
    let openList: ReturnType<typeof vi.fn>;
    let locked: boolean;

    async function renderAt(url: string) {
        openList = vi.fn();
        await TestBed.configureTestingModule({
            imports: [SideDock],
            providers: [
                provideRouter([{ path: '', component: Blank }, { path: 'learning/p5-precession', component: Blank }]),
                { provide: GlossaryOverlay, useValue: { openList } },
                { provide: StudyAidsLock, useValue: { isLocked: () => locked } },
            ],
        }).compileComponents();
        await TestBed.inject(Router).navigateByUrl(url);
        const fixture = TestBed.createComponent(SideDock);
        fixture.detectChanges();
        return fixture.nativeElement as HTMLElement;
    }

    beforeEach(() => { locked = false; });

    it('is not on the start page', async () => {
        const el = await renderAt('/');
        expect(el.querySelector('.dock')).toBeNull();
    });

    it('opens the glossary list', async () => {
        const el = await renderAt('/learning/p5-precession?page=1');
        (el.querySelector('.dock-btn') as HTMLButtonElement).click();
        expect(openList).toHaveBeenCalled();
    });

    it('is greyed out, not hidden, while a test is running', async () => {
        locked = true;
        const el = await renderAt('/learning/p5-precession?page=1');
        const btn = el.querySelector('.dock-btn') as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
        btn.click();
        expect(openList).not.toHaveBeenCalled();
    });
});
