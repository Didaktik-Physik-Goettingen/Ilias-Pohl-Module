import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Developer mode toggle.
 *
 * Press Shift+Alt+D anywhere in the app to toggle dev mode.
 * State persists in sessionStorage across SPA navigation.
 * When active, a small badge appears in the bottom-right corner and
 * gated back-navigation buttons become visible.
 */
@Injectable({ providedIn: 'root' })
export class DevModeService {
    private readonly KEY = 'devMode';
    private badge: HTMLElement | null = null;

    isEnabled: boolean;

    constructor(@Inject(DOCUMENT) private doc: Document) {
        const win = this.doc.defaultView;
        this.isEnabled = win?.sessionStorage.getItem(this.KEY) === 'true';

        if (!win) return;

        if (this.isEnabled) this.addBadge();

        win.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.shiftKey && e.altKey && e.key === 'D') {
                win.sessionStorage.setItem(this.KEY, this.isEnabled ? 'false' : 'true');
                win.location.reload();
            }
        });
    }

    private addBadge() {
        if (this.badge) return;
        this.badge = this.doc.createElement('div');
        this.badge.textContent = '🛠 DEV MODE';
        this.badge.style.cssText = [
            'position:fixed', 'bottom:10px', 'right:10px', 'z-index:9999',
            'background:#f59e0b', 'color:#000', 'font-size:11px', 'font-weight:700',
            'padding:3px 10px', 'border-radius:4px', 'pointer-events:none',
            'font-family:monospace', 'letter-spacing:0.05em', 'opacity:0.85'
        ].join(';');
        this.doc.body.appendChild(this.badge);
    }

    private removeBadge() {
        this.badge?.remove();
        this.badge = null;
    }
}
