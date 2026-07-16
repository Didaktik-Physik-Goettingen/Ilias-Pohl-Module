export function isPrintMode(): boolean {
    if (typeof window === 'undefined' || !window.location) return false;
    return new URLSearchParams(window.location.search).get('print') === '1';
}
