import { Injectable, signal } from '@angular/core';

// Open/closed state of the navigation drawer on narrow screens (header button ↔ nav-bar).
@Injectable({ providedIn: 'root' })
export class NavDrawerService {
    readonly isOpen = signal(false);

    toggle() { this.isOpen.update(open => !open); }
    close()  { this.isOpen.set(false); }
}
