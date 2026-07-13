// Print mode is signalled by a `print=1` query param on any route. The report
// generator (headless Chromium) loads pages with this flag so the app renders
// their content without the side effects that would corrupt or interrupt a
// report run: the resume-redirect on startup and progress saving.
//
// SSR-safe: returns false on the server, where there is no window/URL.
export function isPrintMode(): boolean {
    if (typeof window === 'undefined' || !window.location) return false;
    return new URLSearchParams(window.location.search).get('print') === '1';
}
