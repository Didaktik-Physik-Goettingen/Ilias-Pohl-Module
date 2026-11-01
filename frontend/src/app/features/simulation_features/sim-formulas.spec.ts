import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubCanvasContext } from '../../../testing/canvas-stub';
import { SimEDampedOscillations } from './sim-e-damped-oscillations/sim-e-damped-oscillations';
import { SimEDrivenOscillations } from './sim-e-driven-oscillations/sim-e-driven-oscillations';
import { SimTDampedOscillations } from './sim-t-damped-oscillations/sim-t-damped-oscillations';
import { SimTDrivenPhiOscillations } from './sim-t-driven-phi-oscillations/sim-t-driven-phi-oscillations';
import { SimTDrivenXOscillations } from './sim-t-driven-x-oscillations/sim-t-driven-x-oscillations';
import { SimTFreeOscillations } from './sim-t-free-oscillations/sim-t-free-oscillations';

// On a cold load MathJax can finish its own first pass before a page's typeset call, and it replaces the LaTeX source
// in the page. A formula removed at that point can't be rendered again, and a second pass processes the first one's
// hidden MathML. Arriving from another page, nothing has rendered yet, so the page has to ask for the pass itself.
describe('Simulation pages: typesetting the formulas', () => {
    const pages: [string, Type<{ renderMath(): void }>][] = [
        ['sim-e-damped', SimEDampedOscillations],
        ['sim-e-driven', SimEDrivenOscillations],
        ['sim-t-damped', SimTDampedOscillations],
        ['sim-t-driven-phi', SimTDrivenPhiOscillations],
        ['sim-t-driven-x', SimTDrivenXOscillations],
        ['sim-t-free', SimTFreeOscillations],
    ];
    let main: HTMLElement;

    const addRenderedFormula = () => {
        const rendered = document.createElement('mjx-container');
        rendered.className = 'MathJax';
        main.appendChild(rendered);
        return rendered;
    };

    beforeEach(() => {
        stubCanvasContext();
        vi.useFakeTimers();
        main = document.createElement('main');
        document.body.appendChild(main);
        window.MathJax = { typesetPromise: vi.fn(), startup: { promise: Promise.resolve() } };
    });

    afterEach(() => {
        vi.useRealTimers();
        main.remove();
        delete window.MathJax;
    });

    it.each(pages)('%s typesets when arriving from another page', async (_name, page) => {
        TestBed.createComponent(page).componentInstance.renderMath();
        await vi.advanceTimersByTimeAsync(200);
        expect(window.MathJax.typesetPromise).toHaveBeenCalled();
    });

    it.each(pages)('%s keeps what the first pass of MathJax rendered, without a second pass', async (_name, page) => {
        const rendered = addRenderedFormula();
        TestBed.createComponent(page).componentInstance.renderMath();
        await vi.advanceTimersByTimeAsync(200);
        expect(document.body.contains(rendered)).toBe(true);
        expect(window.MathJax.typesetPromise).not.toHaveBeenCalled();
    });

    it.each(pages)('%s waits for the first pass of MathJax to finish', async (_name, page) => {
        let finishFirstPass = () => {};
        window.MathJax.startup.promise = new Promise<void>(resolve => finishFirstPass = resolve);
        TestBed.createComponent(page).componentInstance.renderMath();
        await vi.advanceTimersByTimeAsync(200);
        expect(window.MathJax.typesetPromise).not.toHaveBeenCalled();

        addRenderedFormula();
        finishFirstPass();
        await vi.advanceTimersByTimeAsync(0);
        expect(window.MathJax.typesetPromise).not.toHaveBeenCalled();
    });

    it.each(pages)('%s leaves it to MathJax if the script is still loading', async (_name, page) => {
        window.MathJax = { tex: {} };     // only the configuration from index.html so far
        TestBed.createComponent(page).componentInstance.renderMath();
        await expect(vi.advanceTimersByTimeAsync(200)).resolves.not.toThrow();
    });
});
