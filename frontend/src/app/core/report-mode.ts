import { isDevMode } from '@angular/core';

// Solutions-reveal mode: when a page is opened with `?solutions=1`, evaluation
// components render as if answered correctly — correct options selected and the
// success/explanation message shown. Used by the report-template authoring
// script (tools/generate-report-templates.mjs) to print pages with the correct
// answers baked in.
//
// GUARDED TO DEV MODE: in a production build isDevMode() is false, so the flag is
// ignored and students can never reveal answers by adding the query param. The
// authoring script runs against `ng serve` (dev), where it works.
//
// SSR-safe: returns false on the server, where there is no window/URL.
export function isSolutionsMode(): boolean {
    if (typeof window === 'undefined' || !window.location) return false;
    if (!isDevMode()) return false;
    return new URLSearchParams(window.location.search).get('solutions') === '1';
}
