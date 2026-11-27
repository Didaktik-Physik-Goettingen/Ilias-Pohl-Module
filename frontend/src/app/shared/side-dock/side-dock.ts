import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GlossaryOverlay } from '../glossary-overlay/glossary-overlay.service';
import { StudyAidsLock } from '../../core/services/study-aids-lock';
import { Marks } from '../../core/services/marks';
import { MarksOverlay } from '../marks-overlay/marks-overlay.service';



// The buttons for the glossary and the marks overlays. Desktop: at the bottom of the nav column (placement "nav");
// phones, where the nav is a drawer: icons in the header beside the theme toggle (placement "header"). The page's
// "Zurück" sits at the bottom left, so a floating pair there would cover it. Not on the start page; greyed out,
// never hidden, while a test is running (StudyAidsLock).
@Component({
    selector: 'app-side-dock',
    standalone: true,
    templateUrl: './side-dock.html',
    styleUrl: './side-dock.css',
})
export class SideDock {
    @Input() placement: 'nav' | 'header' = 'nav';

    constructor(
        private router: Router,
        private glossary: GlossaryOverlay,
        private marksOverlay: MarksOverlay,
        private marks: Marks,
        private lock: StudyAidsLock
    ) {}


    get visible(): boolean {
        return this.router.url.split('?')[0] !== '/';
    }

    get locked(): boolean {
        return this.lock.isLocked();
    }

    get markCount(): number {
        this.marks.changes();   // re-read after every change
        return this.marks.list().length;
    }

    get lockHint(): string | null {
        return this.locked ? 'Während des Tests nicht verfügbar' : null;
    }


    openGlossary(): void {
        if (!this.locked) this.glossary.openList();
    }

    openMarks(): void {
        if (!this.locked) this.marksOverlay.open();
    }
}
