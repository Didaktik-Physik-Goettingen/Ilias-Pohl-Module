import { isDevMode } from '@angular/core';

export function isSolutionsMode(): boolean {
    if (typeof window === 'undefined' || !window.location) return false;
    if (!isDevMode()) return false;
    return new URLSearchParams(window.location.search).get('solutions') === '1';
}
