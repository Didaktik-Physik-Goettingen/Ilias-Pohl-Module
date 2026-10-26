// jsdom has no canvas implementation: getContext('2d') returns null.
// Returns a stand-in 2D context whose methods are no-ops, so drawing code runs in unit tests.
export function stubCanvasContext(): void {
    const noop = () => undefined;
    const ctx = new Proxy({} as Record<string | symbol, unknown>, {
        get: (target, prop) => (prop in target ? target[prop] : noop),
        set: (target, prop, value) => { target[prop] = value; return true; },
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
}
